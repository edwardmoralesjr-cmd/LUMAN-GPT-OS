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
import { gearLevel, gearUpgradeCost, skillXpForLevel, toolUpgradeCost, xpForLevel } from '../systems/Progression';
import { createInitialState, normalizeState, type GameState } from './GameState';

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

export class GameStore {
  private state: GameState = createInitialState();
  private listeners = new Set<(event: StoreEvent) => void>();

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

  rollNode(baseResourceId: string): NodeRoll {
    const variantId = variantByBase[baseResourceId];
    const variant = variantId ? rareVariants[variantId] : undefined;
    let resourceId = baseResourceId;

    if (variant) {
      const fortuneBonus = this.state.stats.fortune * 0.00008;
      const perceptionBonus = this.state.stats.perception * 0.00004;
      const momentumBonus = Math.min(0.025, this.state.rareMomentum * 0.00008);
      const boostBonus = this.isBoostActive() ? 0.015 : 0;
      const chance = Math.min(0.08, (variant.spawnChance ?? 0) + fortuneBonus + perceptionBonus + momentumBonus + boostBonus);
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

    if (!definition.isVariant) {
      const mutationTarget = variantByBase[resourceId];
      const mutationChance = 0.0015 + this.state.stats.fortune * 0.00003 + (this.isBoostActive() ? 0.004 : 0);
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
    const baseBonus = Math.floor((toolLevel - 1) / 3) + Math.floor((statPower - 1) / 5);
    const criticalChance = Math.min(0.42, 0.04 + fortune * 0.008 + perception * 0.004 + (this.isBoostActive() ? 0.04 : 0));
    const critical = Math.random() < criticalChance;
    const qualityInfo = qualityDefinitions[quality];
    let quantity = Math.max(1, 1 + baseBonus + qualityInfo.yieldBonus + (critical ? 1 + Math.floor(fortune / 4) : 0));

    if (!surprise) {
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

    const knowledgeBonus = 1 + (this.state.stats.knowledge - 1) * 0.025;
    const xpGain = Math.floor(definition.xp * quantity * knowledgeBonus * qualityInfo.xpMultiplier);
    const key = inventoryKey(resourceId, quality);

    this.state.inventory[key] = (this.state.inventory[key] ?? 0) + quantity;
    this.state.xp += xpGain;
    this.state.skills[definition.tool].xp += Math.floor(definition.skillXp * quantity * qualityInfo.xpMultiplier);
    this.state.totals.gathered += quantity;
    if (critical) this.state.totals.criticalHarvests += 1;
    if (surprise) this.state.totals.surpriseEvents += 1;
    if (qualityInfo.rank >= 2) this.state.totals.perfectedFinds += 1;

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
      if (!newDiscovery && quality !== 'Standard') {
        this.toast(`${quality} specimen discovered`, `${definition.name} now has a new visual tier in your Codex.`);
      }
    }

    if (definition.isVariant) {
      this.state.rareMomentum = 0;
      this.state.totals.rareFinds += 1;
    } else {
      this.state.rareMomentum = Math.min(400, this.state.rareMomentum + 1);
      if (critical && ['Rare', 'Epic', 'Legendary'].includes(definition.rarity)) this.state.totals.rareFinds += 1;
    }

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
    const nextLevel = current + 1;
    this.touch();
    this.emitState();
    this.toast('Tool evolved', `Level ${nextLevel} reached. ${toolForm(nextLevel)} is now visible.`);
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

  private isBoostActive(): boolean {
    return this.state.activeBoostUntil > Date.now();
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
    if (event === 'Echo harvest') return 'The harvest echoed through the ground and doubled its yield.';
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
