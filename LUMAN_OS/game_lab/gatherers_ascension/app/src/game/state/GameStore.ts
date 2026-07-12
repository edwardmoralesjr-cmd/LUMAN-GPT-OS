import { biomes, resources, type BiomeId, type ResourceDefinition, type StatId, type ToolId } from '../data/content';
import { gearLevel, gearUpgradeCost, skillXpForLevel, toolUpgradeCost, xpForLevel } from '../systems/Progression';
import { createInitialState, normalizeState, type GameState } from './GameState';

export type StoreEvent =
  | { type: 'state'; state: GameState }
  | { type: 'toast'; title: string; message: string }
  | { type: 'biome'; biome: BiomeId };

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

  gather(resourceId: string): { quantity: number; critical: boolean; definition: ResourceDefinition } {
    const definition = resources[resourceId];
    if (!definition) throw new Error(`Unknown resource: ${resourceId}`);

    const toolLevel = this.state.tools[definition.tool];
    const statPower = this.state.stats.power;
    const fortune = this.state.stats.fortune;
    const perception = this.state.stats.perception;
    const baseBonus = Math.floor((toolLevel - 1) / 3) + Math.floor((statPower - 1) / 5);
    const criticalChance = Math.min(0.35, 0.04 + fortune * 0.008 + perception * 0.004);
    const critical = Math.random() < criticalChance;
    const quantity = Math.max(1, 1 + baseBonus + (critical ? 1 + Math.floor(fortune / 4) : 0));
    const knowledgeBonus = 1 + (this.state.stats.knowledge - 1) * 0.025;
    const xpGain = Math.floor(definition.xp * quantity * knowledgeBonus);

    this.state.inventory[resourceId] = (this.state.inventory[resourceId] ?? 0) + quantity;
    this.state.xp += xpGain;
    this.state.skills[definition.tool].xp += definition.skillXp * quantity;
    this.state.totals.gathered += quantity;
    if (!this.state.discovered.includes(resourceId)) {
      this.state.discovered.push(resourceId);
      this.toast('New codex entry', `${definition.name} has been discovered.`);
    }
    if (critical && ['Rare', 'Epic', 'Legendary'].includes(definition.rarity)) this.state.totals.rareFinds += 1;

    this.resolveLevelUps();
    this.resolveSkillLevels(definition.tool);
    this.touch();
    this.emitState();

    return { quantity, critical, definition };
  }

  sellResource(resourceId: string, amount?: number): void {
    const definition = resources[resourceId];
    const owned = this.state.inventory[resourceId] ?? 0;
    if (!definition || owned <= 0) return;
    const sold = Math.max(0, Math.min(owned, amount ?? owned));
    const total = sold * definition.value;
    this.state.inventory[resourceId] = owned - sold;
    this.state.coins += total;
    this.state.totals.coinsEarned += total;
    this.touch();
    this.emitState();
    this.toast('Resources sold', `${sold} ${definition.name} exchanged for ${total} coins.`);
  }

  sellAll(): void {
    let total = 0;
    for (const [id, amount] of Object.entries(this.state.inventory)) {
      const definition = resources[id];
      if (!definition || amount <= 0) continue;
      total += amount * definition.value;
      this.state.inventory[id] = 0;
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
    this.touch();
    this.emitState();
    this.toast('Tool strengthened', `Your tool reached level ${current + 1}.`);
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
