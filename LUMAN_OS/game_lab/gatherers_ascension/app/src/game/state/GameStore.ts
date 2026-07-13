import {
  allResources,
  biomes,
  inventoryKey,
  parseInventoryKey,
  qualityDefinitions,
  rareVariants,
  resources,
  toolForm,
  variantByBase,
  type BiomeId,
  type HarvestQuality,
  type ResourceDefinition,
  type StatId,
  type ToolId,
} from '../data/content';
import { gathererTemplates, gatheringZones, type GatheringZoneDefinition } from '../data/network';
import { gearLevel, gearUpgradeCost, skillXpForLevel, toolUpgradeCost, xpForLevel } from '../systems/Progression';
import { createInitialState, normalizeState, type GameState, type GathererState, type NetworkActivity } from './GameState';

export interface NodeRoll {
  resourceId: string;
  quality: HarvestQuality;
}

export interface GatherResult {
  quantity: number;
  critical: boolean;
  definition: ResourceDefinition;
  quality: HarvestQuality;
  surprise?: string;
  newDiscovery: boolean;
}

export type StoreEvent =
  | { type: 'state'; state: GameState }
  | { type: 'toast'; title: string; message: string }
  | { type: 'biome'; biome: BiomeId }
  | { type: 'discovery'; definition: ResourceDefinition; quality: HarvestQuality };

const toolIds: readonly ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];
const biomeIds: readonly BiomeId[] = ['greenveil', 'ironfall', 'crystal-vale', 'emberdeep'];
const riskWeight: Record<GatheringZoneDefinition['danger'], number> = { Low: 1, Moderate: 2, High: 3, Extreme: 4 };

export class GameStore {
  private state: GameState = createInitialState();
  private listeners = new Set<(event: StoreEvent) => void>();
  private lastCapacityWarningAt = 0;
  private lastToolWarningAt = 0;

  get snapshot(): Readonly<GameState> {
    return this.state;
  }

  subscribe(listener: (event: StoreEvent) => void): () => void {
    this.listeners.add(listener);
    listener({ type: 'state', state: this.state });
    return () => this.listeners.delete(listener);
  }

  hydrate(state: GameState): void {
    this.state = normalizeState(state);
    this.emitState();
    this.emit({ type: 'biome', biome: this.state.currentBiome });
  }

  reset(): void {
    this.state = createInitialState();
    this.emitState();
    this.emit({ type: 'biome', biome: 'greenveil' });
    this.toast('New path begun', 'Your gathering journey has been reset.');
  }

  inventoryUnits(): number {
    return Object.values(this.state.inventory).reduce((sum, amount) => sum + Math.max(0, amount), 0);
  }

  inventoryCapacity(): number {
    return Math.floor(
      250
      + this.state.gear.worldpack * 180
      + this.state.level * 18
      + this.state.stats.endurance * 12
      + this.state.network.level * 25,
    );
  }

  inventorySpaceRemaining(): number {
    return Math.max(0, this.inventoryCapacity() - this.inventoryUnits());
  }

  inventoryLoadPercent(): number {
    return Math.max(0, (this.inventoryUnits() / Math.max(1, this.inventoryCapacity())) * 100);
  }

  biomeSaturation(biomeId: BiomeId): number {
    return this.state.biomeEcology[biomeId]?.saturation ?? 12;
  }

  biomeRecoveryRate(): number {
    return 1.2;
  }

  toolRepairCost(tool: ToolId): number {
    const missing = Math.max(0, 100 - this.state.toolDurability[tool]);
    return Math.ceil(missing * (1.2 + this.state.tools[tool] * 0.35));
  }

  repairTool(tool: ToolId): void {
    const cost = this.toolRepairCost(tool);
    if (cost <= 0) {
      this.toast('Maintenance check complete', `${toolForm(this.state.tools[tool])} is already at full condition.`);
      return;
    }
    if (this.state.coins < cost) {
      this.toast('Repair unavailable', `${cost.toLocaleString()} coins are required to restore this tool.`);
      return;
    }
    this.state.coins -= cost;
    this.state.toolDurability[tool] = 100;
    this.state.operations.totalRepairs += 1;
    this.state.operations.totalRepairCost += cost;
    this.state.operations.lastMaintenanceAt = Date.now();
    this.addNetworkActivity('Tool Restored', `${tool} returned to full operational condition for ${cost} coins.`, 'success');
    this.touch();
    this.emitState();
    this.toast('Tool repaired', `Full condition restored for ${cost.toLocaleString()} coins.`);
  }

  repairAllTools(): void {
    const damaged = toolIds.filter((tool) => this.state.toolDurability[tool] < 99.95);
    if (!damaged.length) {
      this.toast('Maintenance check complete', 'Every gathering tool is already at full condition.');
      return;
    }
    const cost = damaged.reduce((sum, tool) => sum + this.toolRepairCost(tool), 0);
    if (this.state.coins < cost) {
      this.toast('Repair All unavailable', `${cost.toLocaleString()} coins are required for complete maintenance.`);
      return;
    }
    this.state.coins -= cost;
    damaged.forEach((tool) => { this.state.toolDurability[tool] = 100; });
    this.state.operations.totalRepairs += damaged.length;
    this.state.operations.totalRepairCost += cost;
    this.state.operations.lastMaintenanceAt = Date.now();
    this.addNetworkActivity('Maintenance Cycle Complete', `${damaged.length} tools restored for ${cost} coins.`, 'success');
    this.touch();
    this.emitState();
    this.toast('All tools repaired', `${damaged.length} tools restored for ${cost.toLocaleString()} coins.`);
  }

  projectedCycleUnits(gatherer: GathererState, zone: GatheringZoneDefinition): number {
    const specialtyBonus = gatherer.specialty === zone.specialty ? 1.25 : 1;
    const commandBonus = 1 + Math.max(0, this.state.network.level - 1) * 0.025;
    const fatigueMultiplier = Math.max(0.5, 1 - gatherer.fatigue * 0.0045);
    const saturationMultiplier = this.saturationYieldMultiplier(zone.biomeId);
    return Math.max(1, Math.floor(
      zone.baseYield
      * gatherer.efficiency
      * specialtyBonus
      * commandBonus
      * (1 + gatherer.equipmentLevel * 0.07)
      * fatigueMultiplier
      * saturationMultiplier,
    ));
  }

  rollNode(baseResourceId: string): NodeRoll {
    const variantId = variantByBase[baseResourceId];
    const variant = variantId ? rareVariants[variantId] : undefined;
    let resourceId = baseResourceId;

    if (variant) {
      const saturation = this.biomeSaturation(variant.nativeBiome);
      const ecologyModifier = saturation < 35 ? (35 - saturation) * 0.00012 : -(saturation - 65) * 0.00008;
      const fortuneBonus = this.state.stats.fortune * 0.00008;
      const perceptionBonus = this.state.stats.perception * 0.00004;
      const momentumBonus = Math.min(0.025, this.state.rareMomentum * 0.00008);
      const boostBonus = this.isBoostActive() ? 0.015 : 0;
      const chance = Math.min(0.08, Math.max(0, (variant.spawnChance ?? 0) + ecologyModifier + fortuneBonus + perceptionBonus + momentumBonus + boostBonus));
      if (Math.random() < chance) resourceId = variant.id;
    }

    return { resourceId, quality: this.rollQuality() };
  }

  gather(initialResourceId: string, initialQuality: HarvestQuality = 'Standard'): GatherResult {
    let resourceId = initialResourceId;
    const initialDefinition = allResources[resourceId];
    if (!initialDefinition) throw new Error(`Unknown resource: ${resourceId}`);
    let definition: ResourceDefinition = initialDefinition;
    let quality = initialQuality;
    let surprise: string | undefined;

    const durability = this.state.toolDurability[definition.tool];
    const toolBroken = durability <= 0.01;

    if (!definition.isVariant && !toolBroken) {
      const mutationTarget = variantByBase[resourceId];
      const ecologyBonus = this.biomeSaturation(this.state.currentBiome) < 35 ? 0.0015 : 0;
      const mutationChance = 0.0015 + ecologyBonus + this.state.stats.fortune * 0.00003 + (this.isBoostActive() ? 0.004 : 0);
      if (mutationTarget && Math.random() < mutationChance) {
        const mutatedDefinition = allResources[mutationTarget];
        if (mutatedDefinition) {
          resourceId = mutationTarget;
          definition = mutatedDefinition;
          quality = this.rollQuality(true);
          surprise = 'Rare mutation';
        }
      }
    }

    const toolLevel = this.state.tools[definition.tool];
    const statPower = this.state.stats.power;
    const fortune = this.state.stats.fortune;
    const perception = this.state.stats.perception;
    const conditionMultiplier = toolBroken ? 0.2 : 0.5 + durability * 0.005;
    const saturationMultiplier = this.saturationYieldMultiplier(this.state.currentBiome);
    const baseBonus = Math.floor((toolLevel - 1) / 3) + Math.floor((statPower - 1) / 5);
    const criticalChance = toolBroken ? 0 : Math.min(0.42, (0.04 + fortune * 0.008 + perception * 0.004 + (this.isBoostActive() ? 0.04 : 0)) * conditionMultiplier);
    const critical = Math.random() < criticalChance;
    const qualityInfo = qualityDefinitions[quality];
    let quantity = Math.max(1, Math.floor((1 + baseBonus + qualityInfo.yieldBonus + (critical ? 1 + Math.floor(fortune / 4) : 0)) * conditionMultiplier * saturationMultiplier));

    if (toolBroken) {
      quality = 'Standard';
      surprise = undefined;
      quantity = 1;
      if (Date.now() - this.lastToolWarningAt > 8_000) {
        this.lastToolWarningAt = Date.now();
        this.toast('Tool condition critical', 'Improvised gathering is limited to one unit until the tool is repaired.');
      }
    } else if (!surprise) {
      const surpriseRoll = Math.random();
      const bountifulChance = Math.min(0.12, 0.035 + fortune * 0.0015);
      const echoChance = bountifulChance + Math.min(0.055, 0.012 + perception * 0.0008);
      const surgeChance = echoChance + Math.min(0.035, 0.008 + fortune * 0.0005);
      if (surpriseRoll < bountifulChance) {
        quantity += 2 + Math.floor(fortune / 5);
        surprise = 'Bountiful cluster';
      } else if (surpriseRoll < echoChance) {
        quantity *= 2;
        surprise = 'Echo harvest';
      } else if (surpriseRoll < surgeChance) {
        this.state.activeBoostUntil = Math.max(this.state.activeBoostUntil, Date.now() + 30_000);
        surprise = 'Discovery resonance';
      }
    }

    const remaining = this.inventorySpaceRemaining();
    if (remaining <= 0) {
      quantity = 1;
      if (Date.now() - this.lastCapacityWarningAt > 8_000) {
        this.lastCapacityWarningAt = Date.now();
        this.toast('Worldpack overloaded', 'Manual gathering is reduced to emergency single-unit collection. Sell cargo or upgrade the Worldpack.');
      }
    } else {
      quantity = Math.max(1, Math.min(quantity, remaining));
    }

    const finalQualityInfo = qualityDefinitions[quality];
    const knowledgeBonus = 1 + (this.state.stats.knowledge - 1) * 0.025;
    const xpGain = Math.floor(definition.xp * quantity * knowledgeBonus * finalQualityInfo.xpMultiplier);
    const key = inventoryKey(resourceId, quality);
    this.state.inventory[key] = (this.state.inventory[key] ?? 0) + quantity;
    this.state.xp += xpGain;
    this.state.skills[definition.tool].xp += Math.floor(definition.skillXp * quantity * finalQualityInfo.xpMultiplier);
    this.state.totals.gathered += quantity;
    if (critical) this.state.totals.criticalHarvests += 1;
    if (surprise) this.state.totals.surpriseEvents += 1;
    if (finalQualityInfo.rank >= 2) this.state.totals.perfectedFinds += 1;

    const newDiscovery = !this.state.discovered.includes(resourceId);
    if (newDiscovery) {
      this.state.discovered.push(resourceId);
      if (definition.isVariant) this.state.totals.variantsFound += 1;
      this.emit({ type: 'discovery', definition, quality });
      this.resolveCollectionMilestones();
    }

    const knownQualities = this.state.discoveredQualities[resourceId] ?? [];
    if (!knownQualities.includes(quality)) {
      this.state.discoveredQualities[resourceId] = [...knownQualities, quality];
      if (!newDiscovery && quality !== 'Standard') this.toast(`${quality} specimen discovered`, `${definition.name} now has a new visual tier in your Codex.`);
    }

    if (definition.isVariant) {
      this.state.rareMomentum = 0;
      this.state.totals.rareFinds += 1;
    } else {
      this.state.rareMomentum = Math.min(400, this.state.rareMomentum + 1);
      if (critical && ['Rare', 'Epic', 'Legendary'].includes(definition.rarity)) this.state.totals.rareFinds += 1;
    }

    if (!toolBroken) {
      const wearBase = 0.48 + finalQualityInfo.rank * 0.14 + (definition.isVariant ? 0.55 : 0);
      const wearReduction = Math.min(0.55, (toolLevel - 1) * 0.018 + this.state.gear.fieldKit * 0.015);
      const wear = Math.max(0.12, wearBase * (1 - wearReduction));
      this.state.toolDurability[definition.tool] = Math.max(0, durability - wear);
      if (this.state.toolDurability[definition.tool] <= 0.01) {
        this.addNetworkActivity('Tool Failure', `${definition.tool} reached zero condition and now requires repair.`, 'warning');
        this.toast('Tool disabled', 'The tool has reached zero condition. Emergency single-unit gathering remains available.');
      }
    }

    this.applyBiomePressure(this.state.currentBiome, 0.18 + quantity * 0.055 + finalQualityInfo.rank * 0.09);
    this.resolveLevelUps();
    this.resolveSkillLevels(definition.tool);
    this.touch();
    this.emitState();
    if (surprise) this.toast(surprise, this.surpriseMessage(surprise, definition.name, quantity));
    return { quantity, critical, definition, quality, surprise, newDiscovery };
  }

  sellResource(inventoryId: string, amount?: number): void {
    const { resourceId, quality } = parseInventoryKey(inventoryId);
    const definition = allResources[resourceId];
    const owned = this.state.inventory[inventoryId] ?? 0;
    if (!definition || owned <= 0) return;
    const sold = Math.max(0, Math.min(owned, amount ?? owned));
    const total = Math.floor(sold * definition.value * qualityDefinitions[quality].valueMultiplier);
    this.state.inventory[inventoryId] = owned - sold;
    this.state.coins += total;
    this.state.totals.coinsEarned += total;
    this.touch();
    this.emitState();
    this.toast('Resources sold', `${sold} ${quality} ${definition.name} exchanged for ${total} coins.`);
  }

  sellAll(): void {
    let total = 0;
    for (const [key, amount] of Object.entries(this.state.inventory)) {
      const { resourceId, quality } = parseInventoryKey(key);
      const definition = allResources[resourceId];
      if (!definition || amount <= 0) continue;
      total += Math.floor(amount * definition.value * qualityDefinitions[quality].valueMultiplier);
      this.state.inventory[key] = 0;
    }
    if (total <= 0) return;
    this.state.coins += total;
    this.state.totals.coinsEarned += total;
    this.touch();
    this.emitState();
    this.toast('Pack emptied', `Your gathered resources sold for ${total} coins.`);
  }

  upgradeTool(tool: ToolId): void {
    const current = this.state.tools[tool];
    const cost = toolUpgradeCost(current);
    if (this.state.coins < cost) return;
    this.state.coins -= cost;
    this.state.tools[tool] += 1;
    this.state.toolDurability[tool] = 100;
    const nextLevel = current + 1;
    this.touch();
    this.emitState();
    this.toast('Tool evolved', `Level ${nextLevel} reached. ${toolForm(nextLevel)} is now visible and fully restored.`);
  }

  upgradeGear(gear: keyof GameState['gear']): void {
    const bases: Record<keyof GameState['gear'], number> = { worldpack: 55, boots: 48, fieldKit: 62, relicWard: 85 };
    const current = this.state.gear[gear];
    const cost = gearUpgradeCost(current, bases[gear]);
    if (this.state.coins < cost) return;
    this.state.coins -= cost;
    this.state.gear[gear] += 1;
    this.touch();
    this.emitState();
    this.toast('Gear improved', `${gear} advanced to level ${current + 1}.`);
  }

  allocateStat(stat: StatId): void {
    if (this.state.statPoints <= 0) return;
    this.state.statPoints -= 1;
    this.state.stats[stat] += 1;
    this.touch();
    this.emitState();
  }

  unlockBiome(biomeId: BiomeId): void {
    const biome = biomes[biomeId];
    if (!biome || this.state.unlockedBiomes.includes(biomeId)) return;
    if (this.state.level < biome.levelRequired || gearLevel(this.state) < biome.gearRequired) return;
    this.state.unlockedBiomes.push(biomeId);
    this.touch();
    this.emitState();
    this.toast('New region unlocked', biome.name);
  }

  travel(biomeId: BiomeId): void {
    if (!this.state.unlockedBiomes.includes(biomeId) || this.state.currentBiome === biomeId) return;
    this.state.currentBiome = biomeId;
    this.touch();
    this.emitState();
    this.emit({ type: 'biome', biome: biomeId });
    this.toast('Journey complete', `You entered ${biomes[biomeId].name}.`);
  }

  maxGathererSlots(): number {
    return Math.min(8, 1 + Math.floor((this.state.level - 1) / 5) + Math.floor((this.state.network.level - 1) / 5));
  }

  zoneUnlockCost(zoneId: string): number {
    const zone = gatheringZones[zoneId];
    return zone ? zone.tier * 180 + zone.unlockLevel * 25 : 0;
  }

  gathererUpgradeCost(gathererId: string): number {
    const gatherer = this.state.network.gatherers.find((item) => item.id === gathererId);
    return gatherer ? 140 + gatherer.level * 90 + gatherer.equipmentLevel * 120 : 0;
  }

  automationCycleDuration(gatherer: GathererState, zone: GatheringZoneDefinition): number {
    const specialtyBonus = gatherer.specialty === zone.specialty ? 1.18 : 1;
    const equipmentBonus = 1 + Math.max(0, gatherer.equipmentLevel - 1) * 0.06;
    const networkBonus = 1 + Math.max(0, this.state.network.level - 1) * 0.015;
    const fatiguePenalty = 1 + gatherer.fatigue * 0.006;
    const saturationPenalty = 1 + Math.max(0, this.biomeSaturation(zone.biomeId) - 35) * 0.005;
    return Math.max(7_000, ((zone.durationSeconds * 1000) / (gatherer.efficiency * specialtyBonus * equipmentBonus * networkBonus)) * fatiguePenalty * saturationPenalty);
  }

  recruitGatherer(templateId: string): void {
    const template = gathererTemplates[templateId];
    if (!template) return;
    if (this.state.network.gatherers.some((gatherer) => gatherer.templateId === templateId)) return;
    if (this.state.level < template.unlockLevel || this.state.coins < template.recruitCost) return;
    if (this.state.network.gatherers.length >= this.maxGathererSlots()) return;
    this.state.coins -= template.recruitCost;
    const now = Date.now();
    const gatherer: GathererState = {
      id: `gatherer-${template.id}`,
      templateId: template.id,
      name: template.name,
      role: template.role,
      specialty: template.specialty,
      level: 1,
      xp: 0,
      equipmentLevel: 1,
      efficiency: template.efficiency,
      endurance: template.endurance,
      fortune: template.fortune,
      fatigue: 0,
      fatigueUpdatedAt: now,
      totalGathered: 0,
      cyclesCompleted: 0,
      assignedZoneId: null,
      lastCycleAt: null,
    };
    this.state.network.gatherers.push(gatherer);
    this.addNetworkActivity('Gatherer Recruited', `${template.name}, ${template.role}, joined the Worldroot network.`, 'success');
    this.touch();
    this.emitState();
    this.toast('New gatherer recruited', `${template.name} is ready for deployment.`);
  }

  unlockZone(zoneId: string): void {
    const zone = gatheringZones[zoneId];
    if (!zone || this.state.network.unlockedZones.includes(zoneId)) return;
    if (this.state.level < zone.unlockLevel || !this.state.unlockedBiomes.includes(zone.biomeId)) return;
    const cost = this.zoneUnlockCost(zoneId);
    if (this.state.coins < cost) return;
    this.state.coins -= cost;
    this.state.network.unlockedZones.push(zoneId);
    this.state.network.xp += zone.tier * 25;
    this.resolveNetworkLevels();
    this.addNetworkActivity('Zone Activated', `${zone.name} is now connected to the gathering network.`, 'success');
    this.touch();
    this.emitState();
    this.toast('Gathering zone unlocked', zone.name);
  }

  assignGatherer(gathererId: string, zoneId: string): void {
    this.advancePersistentSystems(Date.now());
    const gatherer = this.state.network.gatherers.find((item) => item.id === gathererId);
    const zone = gatheringZones[zoneId];
    if (!gatherer || !zone || gatherer.assignedZoneId) return;
    if (!this.state.network.unlockedZones.includes(zoneId)) return;
    if (this.state.network.gatherers.some((item) => item.assignedZoneId === zoneId)) return;
    if (gatherer.fatigue >= 85) {
      this.toast('Gatherer requires recovery', `${gatherer.name} is at ${Math.round(gatherer.fatigue)}% fatigue and cannot deploy yet.`);
      return;
    }
    if (this.inventoryLoadPercent() >= 100) {
      this.toast('Deployment blocked', 'Worldpack storage is full. Liquidate cargo before starting another automated operation.');
      return;
    }
    const now = Date.now();
    gatherer.assignedZoneId = zoneId;
    gatherer.lastCycleAt = now;
    gatherer.fatigueUpdatedAt = now;
    this.addNetworkActivity('Deployment Started', `${gatherer.name} deployed to ${zone.name}.`, 'normal');
    this.touch();
    this.emitState();
    this.toast('Gatherer deployed', `${gatherer.name} is now operating in ${zone.name}.`);
  }

  recallGatherer(gathererId: string): void {
    this.processAutomation(Date.now());
    const gatherer = this.state.network.gatherers.find((item) => item.id === gathererId);
    if (!gatherer || !gatherer.assignedZoneId) return;
    const zoneName = gatheringZones[gatherer.assignedZoneId]?.name ?? 'the field';
    gatherer.assignedZoneId = null;
    gatherer.lastCycleAt = null;
    gatherer.fatigueUpdatedAt = Date.now();
    this.addNetworkActivity('Gatherer Recalled', `${gatherer.name} returned from ${zoneName} at ${Math.round(gatherer.fatigue)}% fatigue.`, 'normal');
    this.touch();
    this.emitState();
  }

  upgradeGatherer(gathererId: string): void {
    const gatherer = this.state.network.gatherers.find((item) => item.id === gathererId);
    if (!gatherer) return;
    const cost = this.gathererUpgradeCost(gathererId);
    if (this.state.coins < cost) return;
    this.state.coins -= cost;
    gatherer.equipmentLevel += 1;
    gatherer.efficiency += 0.055;
    gatherer.endurance += 1;
    gatherer.fatigue = Math.max(0, gatherer.fatigue - 12);
    gatherer.fatigueUpdatedAt = Date.now();
    if (gatherer.equipmentLevel % 3 === 0) gatherer.fortune += 1;
    this.addNetworkActivity('Loadout Improved', `${gatherer.name}'s equipment reached tier ${gatherer.equipmentLevel}.`, 'success');
    this.touch();
    this.emitState();
    this.toast('Gatherer upgraded', `${gatherer.name} is now more efficient and recovered 12 fatigue.`);
  }

  processAutomation(now = Date.now()): number {
    let totalCollected = 0;
    let firstDiscovery: { definition: ResourceDefinition; quality: HarvestQuality } | null = null;
    let changed = this.advancePersistentSystems(now);

    for (const gatherer of this.state.network.gatherers) {
      if (!gatherer.assignedZoneId) continue;
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) continue;
      if (!gatherer.lastCycleAt) gatherer.lastCycleAt = now;
      let completedCycles = 0;
      let gathererCollected = 0;
      let rareFound = false;

      while (completedCycles < 96 && gatherer.assignedZoneId) {
        const duration = this.automationCycleDuration(gatherer, zone);
        const elapsed = Math.max(0, now - (gatherer.lastCycleAt ?? now));
        if (elapsed < duration) break;
        if (this.inventorySpaceRemaining() <= 0) {
          this.stopGathererForCapacity(gatherer, zone);
          changed = true;
          break;
        }
        const result = this.resolveAutomatedCycle(gatherer, zone);
        gatherer.lastCycleAt = (gatherer.lastCycleAt ?? now) + duration;
        completedCycles += 1;
        gathererCollected += result.quantity;
        totalCollected += result.quantity;
        changed = true;
        if (result.newDiscovery && !firstDiscovery) firstDiscovery = { definition: result.definition, quality: result.quality };
        if (result.definition.isVariant || result.quality === 'Ancient' || result.quality === 'Enchanted') rareFound = true;
        if (gatherer.fatigue >= 100) {
          this.stopGathererForExhaustion(gatherer, zone);
          break;
        }
      }

      if (completedCycles > 0) {
        this.addNetworkActivity(
          rareFound ? 'Rare Operation Result' : 'Automated Yield Secured',
          `${gatherer.name} completed ${completedCycles} cycle${completedCycles === 1 ? '' : 's'} in ${zone.name} and returned ${gathererCollected} materials. Fatigue ${Math.round(gatherer.fatigue)}%.`,
          rareFound ? 'rare' : 'success',
        );
      }
    }

    if (changed) {
      this.resolveNetworkLevels();
      this.resolveLevelUps();
      this.touch();
      this.emitState();
      if (firstDiscovery) this.emit({ type: 'discovery', ...firstDiscovery });
    }
    return totalCollected;
  }

  private resolveAutomatedCycle(gatherer: GathererState, zone: GatheringZoneDefinition): {
    quantity: number; definition: ResourceDefinition; quality: HarvestQuality; newDiscovery: boolean;
  } {
    const fallbackResourceId = zone.resources[0];
    if (!fallbackResourceId) throw new Error(`Zone ${zone.id} has no resource pool.`);
    const baseResourceId = zone.resources[Math.floor(Math.random() * zone.resources.length)] ?? fallbackResourceId;
    let resourceId: string = baseResourceId;
    const variantId = variantByBase[baseResourceId];
    const variant = variantId ? rareVariants[variantId] : undefined;
    const leaderBonus = this.state.network.gatherers.some((item) => item.role === 'Expedition Leader' && item.assignedZoneId) ? 0.004 : 0;
    const ecologyBonus = Math.max(-0.012, Math.min(0.006, (40 - this.biomeSaturation(zone.biomeId)) * 0.00012));
    const fatiguePenalty = gatherer.fatigue * 0.000025;
    const variantChance = Math.min(0.09, Math.max(0, (variant?.spawnChance ?? 0) + zone.rarityBonus + gatherer.fortune * 0.00018 + leaderBonus + ecologyBonus - fatiguePenalty));
    if (variant && Math.random() < variantChance) resourceId = variant.id;

    const definition = allResources[resourceId] ?? resources[baseResourceId];
    if (!definition) throw new Error(`Unknown automated resource: ${resourceId}`);
    const quality = this.rollAutomationQuality(zone.rarityBonus, gatherer.fortune);
    const projected = this.projectedCycleUnits(gatherer, zone);
    const rolled = Math.max(1, Math.floor(projected * (0.82 + Math.random() * 0.38)));
    const quantity = Math.max(1, Math.min(rolled, this.inventorySpaceRemaining()));
    const key = inventoryKey(resourceId, quality);
    this.state.inventory[key] = (this.state.inventory[key] ?? 0) + quantity;

    const newDiscovery = !this.state.discovered.includes(resourceId);
    if (newDiscovery) {
      this.state.discovered.push(resourceId);
      if (definition.isVariant) this.state.totals.variantsFound += 1;
      this.resolveCollectionMilestones();
    }
    const qualities = this.state.discoveredQualities[resourceId] ?? [];
    if (!qualities.includes(quality)) this.state.discoveredQualities[resourceId] = [...qualities, quality];

    const fatigueGain = Math.max(0.7, 0.75 + zone.tier * 0.42 + riskWeight[zone.danger] * 0.28 - gatherer.endurance * 0.045);
    gatherer.fatigue = Math.min(100, gatherer.fatigue + fatigueGain);
    gatherer.fatigueUpdatedAt = Date.now();
    gatherer.totalGathered += quantity;
    gatherer.cyclesCompleted += 1;
    gatherer.xp += quantity * zone.tier * 3;
    while (gatherer.xp >= this.gathererXpForLevel(gatherer.level)) {
      gatherer.xp -= this.gathererXpForLevel(gatherer.level);
      gatherer.level += 1;
      gatherer.efficiency += 0.025;
      gatherer.endurance += 1;
    }

    this.applyBiomePressure(zone.biomeId, 0.28 + zone.tier * 0.16 + quantity * 0.045);
    this.state.network.xp += quantity * zone.tier * 2;
    this.state.network.totalAutomatedGathered += quantity;
    this.state.network.expeditionsCompleted += 1;
    this.state.xp += Math.max(1, Math.floor(quantity * zone.tier * 0.45));
    this.state.totals.gathered += quantity;
    if (definition.isVariant) {
      this.state.totals.rareFinds += 1;
      this.state.rareMomentum = 0;
    } else {
      this.state.rareMomentum = Math.min(400, this.state.rareMomentum + 1);
    }
    if (qualityDefinitions[quality].rank >= 2) this.state.totals.perfectedFinds += 1;
    return { quantity, definition, quality, newDiscovery };
  }

  private advancePersistentSystems(now: number): boolean {
    let changed = false;
    for (const biomeId of biomeIds) {
      const ecology = this.state.biomeEcology[biomeId];
      const elapsed = Math.max(0, now - ecology.updatedAt);
      if (elapsed < 5_000) continue;
      const recovered = Math.min(ecology.saturation - 8, (elapsed / 60_000) * this.biomeRecoveryRate());
      if (recovered > 0.01) {
        ecology.saturation = Math.max(8, ecology.saturation - recovered);
        changed = true;
      }
      ecology.updatedAt = now;
    }

    for (const gatherer of this.state.network.gatherers) {
      const elapsed = Math.max(0, now - gatherer.fatigueUpdatedAt);
      if (elapsed < 5_000) continue;
      if (!gatherer.assignedZoneId && gatherer.fatigue > 0) {
        const recoveryPerMinute = 3.5 + gatherer.endurance * 0.12;
        const recovered = Math.min(gatherer.fatigue, (elapsed / 60_000) * recoveryPerMinute);
        if (recovered > 0.01) {
          gatherer.fatigue = Math.max(0, gatherer.fatigue - recovered);
          changed = true;
        }
      }
      gatherer.fatigueUpdatedAt = now;
    }
    return changed;
  }

  private applyBiomePressure(biomeId: BiomeId, pressure: number): void {
    const ecology = this.state.biomeEcology[biomeId];
    ecology.saturation = Math.min(100, ecology.saturation + pressure);
    ecology.totalPressure += pressure;
    ecology.updatedAt = Date.now();
  }

  private saturationYieldMultiplier(biomeId: BiomeId): number {
    const saturation = this.biomeSaturation(biomeId);
    if (saturation <= 35) return 1 + (35 - saturation) * 0.004;
    return Math.max(0.5, 1 - (saturation - 35) * 0.007);
  }

  private stopGathererForCapacity(gatherer: GathererState, zone: GatheringZoneDefinition): void {
    gatherer.assignedZoneId = null;
    gatherer.lastCycleAt = null;
    gatherer.fatigueUpdatedAt = Date.now();
    this.state.operations.capacityStops += 1;
    this.addNetworkActivity('Cargo Capacity Reached', `${gatherer.name} returned from ${zone.name} because shared storage is full.`, 'warning');
    this.toast('Automated operation paused', `${gatherer.name} returned because the Worldpack network is full.`);
  }

  private stopGathererForExhaustion(gatherer: GathererState, zone: GatheringZoneDefinition): void {
    gatherer.assignedZoneId = null;
    gatherer.lastCycleAt = null;
    gatherer.fatigueUpdatedAt = Date.now();
    this.state.operations.exhaustionRecalls += 1;
    this.addNetworkActivity('Gatherer Exhausted', `${gatherer.name} automatically returned from ${zone.name} and entered recovery.`, 'warning');
    this.toast('Gatherer recalled for recovery', `${gatherer.name} reached maximum fatigue.`);
  }

  private rollQuality(forceElevated = false): HarvestQuality {
    const fortune = this.state.stats.fortune;
    const perception = this.state.stats.perception;
    const boost = this.isBoostActive() ? 1 : 0;
    const roll = Math.random();
    const enchanted = 0.001 + fortune * 0.00006 + boost * 0.0025;
    const ancient = enchanted + 0.004 + fortune * 0.00015 + perception * 0.00005 + boost * 0.004;
    const perfected = ancient + 0.02 + fortune * 0.00035 + perception * 0.00015 + boost * 0.009;
    const fine = perfected + 0.12 + fortune * 0.001 + perception * 0.0004 + boost * 0.02;
    if (roll < enchanted) return 'Enchanted';
    if (roll < ancient) return 'Ancient';
    if (roll < perfected || forceElevated) return 'Perfected';
    if (roll < fine) return 'Fine';
    return 'Standard';
  }

  private rollAutomationQuality(rarityBonus: number, fortune: number): HarvestQuality {
    const roll = Math.random();
    const enchanted = 0.001 + rarityBonus * 0.08 + fortune * 0.00008;
    const ancient = enchanted + 0.006 + rarityBonus * 0.16 + fortune * 0.00018;
    const perfected = ancient + 0.035 + rarityBonus * 0.28 + fortune * 0.00035;
    const fine = perfected + 0.18 + rarityBonus * 0.4 + fortune * 0.0008;
    if (roll < enchanted) return 'Enchanted';
    if (roll < ancient) return 'Ancient';
    if (roll < perfected) return 'Perfected';
    if (roll < fine) return 'Fine';
    return 'Standard';
  }

  private isBoostActive(): boolean {
    return this.state.activeBoostUntil > Date.now();
  }

  private gathererXpForLevel(level: number): number {
    return Math.floor(90 + Math.pow(level, 1.42) * 70);
  }

  private resolveNetworkLevels(): void {
    let needed = this.networkXpForLevel(this.state.network.level);
    while (this.state.network.xp >= needed) {
      this.state.network.xp -= needed;
      this.state.network.level += 1;
      this.state.network.commandPoints += 1;
      this.toast('Network command rank increased', `Worldroot Network reached level ${this.state.network.level}.`);
      needed = this.networkXpForLevel(this.state.network.level);
    }
  }

  private networkXpForLevel(level: number): number {
    return Math.floor(140 + Math.pow(level, 1.5) * 95);
  }

  private addNetworkActivity(title: string, detail: string, tone: NetworkActivity['tone']): void {
    this.state.network.activity.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      title,
      detail,
      tone,
    });
    this.state.network.activity = this.state.network.activity.slice(0, 40);
  }

  private resolveCollectionMilestones(): void {
    const count = this.state.discovered.length;
    const milestones = [5, 10, 15, 20];
    for (const milestone of milestones) {
      if (count < milestone || this.state.claimedMilestones.includes(milestone)) continue;
      this.state.claimedMilestones.push(milestone);
      const coinReward = milestone * 35;
      this.state.coins += coinReward;
      this.state.statPoints += 1;
      this.state.activeBoostUntil = Math.max(this.state.activeBoostUntil, Date.now() + 45_000);
      this.toast('Collection milestone complete', `${milestone} Codex entries. +${coinReward} coins, +1 stat point, and a discovery boost.`);
    }
  }

  private resolveLevelUps(): void {
    let needed = xpForLevel(this.state.level);
    while (this.state.xp >= needed) {
      this.state.xp -= needed;
      this.state.level += 1;
      this.state.statPoints += 1;
      this.toast('Gatherer level increased', `Level ${this.state.level}. One stat point gained.`);
      needed = xpForLevel(this.state.level);
    }
  }

  private resolveSkillLevels(tool: ToolId): void {
    const skill = this.state.skills[tool];
    let needed = skillXpForLevel(skill.level);
    while (skill.xp >= needed) {
      skill.xp -= needed;
      skill.level += 1;
      this.toast('Mastery increased', `${tool} mastery reached level ${skill.level}.`);
      needed = skillXpForLevel(skill.level);
    }
  }

  private surpriseMessage(event: string, name: string, quantity: number): string {
    if (event === 'Rare mutation') return `${name} transformed at the moment of harvest.`;
    if (event === 'Bountiful cluster') return `The node opened into a cluster and yielded ${quantity}.`;
    if (event === 'Echo harvest') return `The harvest echoed through the ground and doubled its yield.`;
    return 'For 30 seconds, rare variants and elevated qualities are more likely.';
  }

  private touch(): void {
    this.state.updatedAt = Date.now();
  }

  private emitState(): void {
    this.emit({ type: 'state', state: this.state });
  }

  private toast(title: string, message: string): void {
    this.emit({ type: 'toast', title, message });
  }

  private emit(event: StoreEvent): void {
    for (const listener of this.listeners) listener(event);
  }
}
