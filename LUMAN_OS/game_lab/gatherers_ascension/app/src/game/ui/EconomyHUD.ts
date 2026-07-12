import { allResources, parseInventoryKey, qualityDefinitions, toolNames, type ResourceDefinition, type ToolId } from '../data/content';
import { gathererTemplates, gatheringZones } from '../data/network';
import { gearUpgradeCost, toolUpgradeCost } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState } from '../state/GameState';

interface InvestmentTarget {
  label: string;
  cost: number;
}

export class EconomyHUD {
  private coins: HTMLElement;
  private cargo: HTMLElement;
  private netWorth: HTMLElement;
  private rate: HTMLElement;
  private status: HTMLElement;
  private targetLabel: HTMLElement;
  private targetValue: HTMLElement;
  private progressFill: HTMLElement;
  private sellAll: HTMLButtonElement;
  private unsubscribe: (() => void) | null = null;

  constructor(private store: GameStore) {
    const coins = document.querySelector<HTMLElement>('#economy-coins');
    const cargo = document.querySelector<HTMLElement>('#economy-cargo');
    const netWorth = document.querySelector<HTMLElement>('#economy-net-worth');
    const rate = document.querySelector<HTMLElement>('#economy-rate');
    const status = document.querySelector<HTMLElement>('#economy-status');
    const targetLabel = document.querySelector<HTMLElement>('#economy-target-label');
    const targetValue = document.querySelector<HTMLElement>('#economy-target-value');
    const progressFill = document.querySelector<HTMLElement>('#economy-progress-fill');
    const sellAll = document.querySelector<HTMLButtonElement>('#economy-sell-all');
    if (!coins || !cargo || !netWorth || !rate || !status || !targetLabel || !targetValue || !progressFill || !sellAll) {
      throw new Error('Required treasury interface elements are missing.');
    }
    this.coins = coins;
    this.cargo = cargo;
    this.netWorth = netWorth;
    this.rate = rate;
    this.status = status;
    this.targetLabel = targetLabel;
    this.targetValue = targetValue;
    this.progressFill = progressFill;
    this.sellAll = sellAll;
    this.sellAll.addEventListener('click', () => this.store.sellAll());
    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type === 'state') this.render(event.state);
    });
  }

  destroy(): void {
    this.unsubscribe?.();
  }

  private render(state: Readonly<GameState>): void {
    const inventory = this.inventorySummary(state);
    const netWorth = state.coins + inventory.value;
    const rate = this.estimatedNetworkValuePerMinute(state);
    const target = this.nextInvestmentTarget(state);
    const progress = target.cost > 0 ? Math.min(100, (state.coins / target.cost) * 100) : 100;

    this.coins.textContent = this.formatEconomy(state.coins);
    this.cargo.textContent = this.formatEconomy(inventory.value);
    this.netWorth.textContent = this.formatEconomy(netWorth);
    this.rate.textContent = `${this.formatEconomy(rate)}c`;
    this.targetLabel.textContent = target.label;
    this.targetValue.textContent = target.cost > 0 ? `${target.cost.toLocaleString()}c` : 'ALL SYSTEMS FUNDED';
    this.progressFill.style.width = `${progress}%`;
    this.sellAll.disabled = inventory.value <= 0;
    this.sellAll.textContent = inventory.value > 0 ? `LIQUIDATE ${this.formatEconomy(inventory.value)}c` : 'CARGO EMPTY';

    if (target.cost <= 0) this.status.textContent = 'ASCENDANT RESERVE';
    else if (state.coins >= target.cost) this.status.textContent = 'EXPANSION READY';
    else if (progress >= 75) this.status.textContent = 'NEAR INVESTMENT TARGET';
    else if (progress >= 35) this.status.textContent = 'RESERVE BUILDING';
    else this.status.textContent = 'CAPITAL FORMING';
  }

  private inventorySummary(state: Readonly<GameState>): { units: number; value: number } {
    let units = 0;
    let value = 0;
    for (const [key, amount] of Object.entries(state.inventory)) {
      if (amount <= 0) continue;
      const { resourceId, quality } = parseInventoryKey(key);
      units += amount;
      value += Math.floor((allResources[resourceId]?.value ?? 0) * qualityDefinitions[quality].valueMultiplier * amount);
    }
    return { units, value };
  }

  private estimatedNetworkValuePerMinute(state: Readonly<GameState>): number {
    let valuePerMinute = 0;
    for (const gatherer of state.network.gatherers.filter((item) => Boolean(item.assignedZoneId))) {
      if (!gatherer.assignedZoneId) continue;
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) continue;
      const definitions = zone.resources.map((id) => allResources[id]).filter((item): item is ResourceDefinition => Boolean(item));
      const averageValue = definitions.length ? definitions.reduce((sum, item) => sum + item.value, 0) / definitions.length : 0;
      const specialtyBonus = gatherer.specialty === zone.specialty ? 1.25 : 1;
      const commandBonus = 1 + Math.max(0, state.network.level - 1) * 0.025;
      const expectedYield = zone.baseYield * gatherer.efficiency * specialtyBonus * commandBonus * (1 + gatherer.equipmentLevel * 0.07);
      const cyclesPerMinute = 60_000 / this.store.automationCycleDuration(gatherer, zone);
      valuePerMinute += averageValue * expectedYield * cyclesPerMinute * 1.08;
    }
    return Math.max(0, Math.round(valuePerMinute));
  }

  private nextInvestmentTarget(state: Readonly<GameState>): InvestmentTarget {
    const candidates: InvestmentTarget[] = [];
    const hasSlot = state.network.gatherers.length < this.store.maxGathererSlots();
    if (hasSlot) {
      for (const template of Object.values(gathererTemplates)) {
        if (state.network.gatherers.some((gatherer) => gatherer.templateId === template.id)) continue;
        if (state.level >= template.unlockLevel) candidates.push({ label: `RECRUIT ${template.name.toUpperCase()}`, cost: template.recruitCost });
      }
    }
    for (const zone of Object.values(gatheringZones)) {
      if (state.network.unlockedZones.includes(zone.id)) continue;
      if (state.level >= zone.unlockLevel && state.unlockedBiomes.includes(zone.biomeId)) {
        candidates.push({ label: `ACTIVATE ${zone.name.toUpperCase()}`, cost: this.store.zoneUnlockCost(zone.id) });
      }
    }
    for (const tool of Object.keys(toolNames) as ToolId[]) {
      candidates.push({ label: `UPGRADE ${toolNames[tool].toUpperCase()}`, cost: toolUpgradeCost(state.tools[tool]) });
    }
    const gearBases: Array<[keyof GameState['gear'], string, number]> = [
      ['worldpack', 'WORLD PACK', 55],
      ['boots', 'TRAIL BOOTS', 48],
      ['fieldKit', 'FIELD KIT', 62],
      ['relicWard', 'RELIC WARD', 85],
    ];
    for (const [id, label, base] of gearBases) {
      candidates.push({ label: `UPGRADE ${label}`, cost: gearUpgradeCost(state.gear[id], base) });
    }
    for (const gatherer of state.network.gatherers) {
      candidates.push({ label: `EQUIP ${gatherer.name.toUpperCase()}`, cost: this.store.gathererUpgradeCost(gatherer.id) });
    }
    return candidates.filter((item) => item.cost > 0).sort((a, b) => a.cost - b.cost)[0] ?? { label: 'TREASURY COMPLETE', cost: 0 };
  }

  private formatEconomy(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
    if (value >= 10_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
    return Math.round(value).toLocaleString();
  }
}
