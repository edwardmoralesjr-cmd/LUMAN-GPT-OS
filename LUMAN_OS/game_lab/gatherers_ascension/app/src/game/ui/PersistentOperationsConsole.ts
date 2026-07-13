import { toolNames, type BiomeId, type ToolId } from '../data/content';
import { gatheringZones } from '../data/network';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState } from '../state/GameState';

const toolIds: readonly ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];

type CommandView = 'dashboard' | 'field' | 'network' | 'gatherers' | 'codex' | 'market';

export class PersistentOperationsConsole {
  private state: Readonly<GameState>;
  private active = true;
  private mount: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;
  private timer: number | null = null;

  constructor(private store: GameStore) {
    this.state = store.snapshot;
  }

  initialize(): void {
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.active = (tab.dataset.view as CommandView | undefined) === 'dashboard';
        if (this.active) queueMicrotask(() => this.render());
      });
    });
    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type !== 'state') return;
      this.state = event.state;
      if (this.active) queueMicrotask(() => this.render());
    });
    this.active = document.querySelector<HTMLButtonElement>('.command-tab.active')?.dataset.view === 'dashboard';
    this.timer = window.setInterval(() => {
      if (this.active) this.render();
    }, 750);
    if (this.active) queueMicrotask(() => this.render());
  }

  destroy(): void {
    this.unsubscribe?.();
    if (this.timer !== null) window.clearInterval(this.timer);
  }

  private render(): void {
    if (!this.active) return;
    this.ensureMount();
    if (!this.mount) return;

    const units = this.store.inventoryUnits();
    const capacity = this.store.inventoryCapacity();
    const load = this.store.inventoryLoadPercent();
    const saturation = this.store.biomeSaturation(this.state.currentBiome);
    const recoveryMinutes = saturation <= 8 ? 0 : Math.ceil((saturation - 8) / this.store.biomeRecoveryRate());
    const ecology = this.state.biomeEcology[this.state.currentBiome];
    const active = this.state.network.gatherers.filter((gatherer) => Boolean(gatherer.assignedZoneId));
    const repairAllCost = toolIds.reduce((sum, tool) => sum + this.store.toolRepairCost(tool), 0);

    this.mount.innerHTML = `<header class="persistent-operations-head">
      <div><span class="persistent-live-dot"></span><div><strong>PERSISTENT OPERATIONS SYSTEMS</strong><small>Saved durability, fatigue, capacity, and biome ecology</small></div></div>
      <div class="operations-alert ${load >= 100 || saturation >= 82 ? 'warning' : 'stable'}">${this.priorityMessage(load, saturation)}</div>
    </header>
    <div class="persistent-operations-grid">
      <article class="persistent-system-card storage-system-card">
        <header><span>WORLDROOT STORAGE</span><strong>${Math.round(load)}%</strong></header>
        <div class="persistent-gauge-line"><div class="persistent-bar ${load >= 100 ? 'danger' : load >= 80 ? 'warning' : ''}" style="--fill:${Math.min(100, load).toFixed(1)}%"><span></span></div><small>${units.toLocaleString()} / ${capacity.toLocaleString()} units</small></div>
        <div class="persistent-stat-grid"><div><span>Remaining</span><strong>${Math.max(0, capacity - units).toLocaleString()}</strong></div><div><span>Worldpack</span><strong>Lv ${this.state.gear.worldpack}</strong></div><div><span>Capacity Stops</span><strong>${this.state.operations.capacityStops}</strong></div><div><span>Status</span><strong class="${load >= 100 ? 'danger-text' : load >= 80 ? 'warning-text' : 'good-text'}">${this.capacityLabel(load)}</strong></div></div>
        <button class="persistent-action primary" data-operations-liquidate ${units > 0 ? '' : 'disabled'}>LIQUIDATE ALL CARGO</button>
      </article>

      <article class="persistent-system-card ecology-system-card">
        <header><span>LIVE BIOME ECOLOGY</span><strong>${Math.round(saturation)}%</strong></header>
        <div class="ecology-orbit" style="--saturation:${Math.min(100, saturation) * 3.6}deg"><div><strong>${Math.round(saturation)}%</strong><span>${this.saturationLabel(saturation)}</span></div></div>
        <div class="persistent-stat-grid"><div><span>Biome</span><strong>${this.escape(this.biomeName(this.state.currentBiome))}</strong></div><div><span>Recovery</span><strong>${recoveryMinutes ? `~${recoveryMinutes}m` : 'OPTIMAL'}</strong></div><div><span>Lifetime Pressure</span><strong>${Math.round(ecology.totalPressure)}</strong></div><div><span>Active Teams</span><strong>${active.filter((g) => gatheringZones[g.assignedZoneId ?? '']?.biomeId === this.state.currentBiome).length}</strong></div></div>
      </article>

      <article class="persistent-system-card maintenance-system-card">
        <header><span>TOOL MAINTENANCE</span><strong>${repairAllCost.toLocaleString()}c</strong></header>
        <div class="persistent-tool-list">${toolIds.map((tool) => this.toolRow(tool)).join('')}</div>
        <button class="persistent-action" data-operations-repair-all ${repairAllCost > 0 && this.state.coins >= repairAllCost ? '' : 'disabled'}>REPAIR ALL · ${repairAllCost.toLocaleString()}c</button>
        <small class="maintenance-history">${this.state.operations.totalRepairs} repairs · ${this.state.operations.totalRepairCost.toLocaleString()}c lifetime maintenance</small>
      </article>

      <article class="persistent-system-card readiness-system-card">
        <header><span>GATHERER READINESS</span><strong>${active.length} ACTIVE</strong></header>
        <div class="persistent-readiness-list">${this.state.network.gatherers.map((gatherer) => this.gathererRow(gatherer)).join('')}</div>
        <div class="persistent-stat-grid"><div><span>Exhaustion Recalls</span><strong>${this.state.operations.exhaustionRecalls}</strong></div><div><span>Deploy Threshold</span><strong>&lt;85%</strong></div></div>
      </article>
    </div>`;

    this.bindActions();
    this.synchronizeLegacyReadouts(saturation);
  }

  private ensureMount(): void {
    if (this.mount && document.contains(this.mount)) return;
    const deck = document.querySelector<HTMLElement>('.live-telemetry-deck');
    if (!deck) {
      this.mount = null;
      return;
    }
    const existing = deck.querySelector<HTMLElement>('.persistent-operations-console');
    if (existing) {
      this.mount = existing;
      return;
    }
    const section = document.createElement('section');
    section.className = 'persistent-operations-console';
    section.setAttribute('aria-label', 'Persistent operations systems');
    const kpis = deck.querySelector('.live-kpi-strip');
    if (kpis) kpis.after(section);
    else deck.prepend(section);
    this.mount = section;
  }

  private toolRow(tool: ToolId): string {
    const condition = this.state.toolDurability[tool];
    const cost = this.store.toolRepairCost(tool);
    return `<div class="persistent-tool-row"><div><strong>${this.escape(toolNames[tool])}</strong><span>Lv ${this.state.tools[tool]} · ${this.conditionLabel(condition)}</span></div><div class="persistent-tool-meter"><div style="--fill:${condition.toFixed(1)}%"><span></span></div><b>${condition.toFixed(0)}%</b></div><button data-operations-repair="${tool}" ${cost > 0 && this.state.coins >= cost ? '' : 'disabled'}>${cost > 0 ? `${cost}c` : 'READY'}</button></div>`;
  }

  private gathererRow(gatherer: GathererState): string {
    const fatigue = gatherer.fatigue;
    const zone = gatherer.assignedZoneId ? gatheringZones[gatherer.assignedZoneId] : undefined;
    const recoveryPerMinute = 3.5 + gatherer.endurance * 0.12;
    const recovery = fatigue > 0 && !zone ? Math.ceil(fatigue / recoveryPerMinute) : 0;
    return `<div class="persistent-gatherer-row"><div><strong>${this.escape(gatherer.name)}</strong><span>${zone ? this.escape(zone.name) : fatigue > 0 ? `Recovering · ~${recovery}m` : 'Ready for deployment'}</span></div><div class="fatigue-meter"><div style="--fill:${fatigue.toFixed(1)}%"><span></span></div><b class="${fatigue >= 85 ? 'danger-text' : fatigue >= 60 ? 'warning-text' : 'good-text'}">${fatigue.toFixed(0)}%</b></div>${zone ? `<button data-operations-recall="${gatherer.id}">RECALL</button>` : `<em>${this.readinessLabel(fatigue)}</em>`}</div>`;
  }

  private bindActions(): void {
    if (!this.mount) return;
    this.mount.querySelector<HTMLButtonElement>('[data-operations-liquidate]')?.addEventListener('click', () => this.store.sellAll());
    this.mount.querySelector<HTMLButtonElement>('[data-operations-repair-all]')?.addEventListener('click', () => this.store.repairAllTools());
    this.mount.querySelectorAll<HTMLButtonElement>('[data-operations-repair]').forEach((button) => button.addEventListener('click', () => {
      const tool = button.dataset.operationsRepair as ToolId | undefined;
      if (tool && toolIds.includes(tool)) this.store.repairTool(tool);
    }));
    this.mount.querySelectorAll<HTMLButtonElement>('[data-operations-recall]').forEach((button) => button.addEventListener('click', () => {
      const gathererId = button.dataset.operationsRecall;
      if (gathererId) this.store.recallGatherer(gathererId);
    }));
  }

  private synchronizeLegacyReadouts(saturation: number): void {
    const gauge = document.querySelector<HTMLElement>('.saturation-card .command-ring-gauge');
    if (gauge) {
      gauge.style.setProperty('--gauge', `${Math.min(100, saturation) * 3.6}deg`);
      const value = gauge.querySelector<HTMLElement>('strong');
      const label = gauge.querySelector<HTMLElement>('span');
      if (value) value.textContent = `${Math.round(saturation)}%`;
      if (label) label.textContent = this.saturationLabel(saturation);
    }
    document.querySelectorAll<HTMLElement>('.tool-condition-row').forEach((row, index) => {
      const tool = toolIds[index];
      if (!tool) return;
      const condition = this.state.toolDurability[tool];
      const label = row.querySelector<HTMLElement>('span');
      const bar = row.querySelector<HTMLElement>('.mini-condition-bar');
      if (label) label.textContent = `Lv ${this.state.tools[tool]} · ${condition.toFixed(0)}% condition`;
      if (bar) bar.style.setProperty('--condition', `${condition.toFixed(1)}%`);
    });
  }

  private priorityMessage(load: number, saturation: number): string {
    if (load >= 100) return 'ACTION REQUIRED · STORAGE FULL';
    if (this.state.network.gatherers.some((gatherer) => gatherer.fatigue >= 85)) return 'ACTION REQUIRED · GATHERER FATIGUE';
    if (toolIds.some((tool) => this.state.toolDurability[tool] <= 25)) return 'MAINTENANCE ADVISED · LOW TOOL CONDITION';
    if (saturation >= 82) return 'ROTATION ADVISED · BIOME DEPLETION';
    return 'SYSTEMS STABLE · OPERATIONS READY';
  }

  private capacityLabel(load: number): string {
    if (load >= 100) return 'OVERLOADED';
    if (load >= 80) return 'NEAR LIMIT';
    if (load >= 50) return 'ACTIVE';
    return 'OPEN';
  }

  private saturationLabel(value: number): string {
    if (value >= 82) return 'DEPLETED';
    if (value >= 65) return 'HEAVY';
    if (value >= 35) return 'ACTIVE';
    return 'OPTIMAL';
  }

  private conditionLabel(value: number): string {
    if (value <= 0) return 'DISABLED';
    if (value <= 25) return 'CRITICAL';
    if (value <= 55) return 'WORN';
    if (value <= 80) return 'SERVICEABLE';
    return 'PRIME';
  }

  private readinessLabel(fatigue: number): string {
    if (fatigue >= 85) return 'RESTING';
    if (fatigue >= 60) return 'LIMITED';
    if (fatigue >= 25) return 'READY';
    return 'PRIME';
  }

  private biomeName(biomeId: BiomeId): string {
    return ({ greenveil: 'Greenveil Meadow', ironfall: 'Ironfall Basin', 'crystal-vale': 'Crystal Vale', emberdeep: 'Emberdeep Archive' } as Record<BiomeId, string>)[biomeId];
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
