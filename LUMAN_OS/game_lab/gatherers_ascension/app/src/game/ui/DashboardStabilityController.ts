import { gatheringZones } from '../data/network';
import type { GameStore } from '../state/GameStore';
import type { GameState } from '../state/GameState';
import type { ToolId } from '../data/content';
import type { CommandCenterDashboardV2 } from './CommandCenterDashboardV2';
import type { LiveDashboardTelemetry } from './LiveDashboardTelemetry';
import type { PersistentOperationsConsole } from './PersistentOperationsConsole';

type DashboardInternals = {
  render: () => void;
  refreshTimer: number | null;
  state: Readonly<GameState>;
  active: boolean;
  routeMode: string;
  selectedZoneId: string | null;
  scanBoostUntil: number;
};

type TelemetryInternals = {
  update: () => void;
  tickTimer: number | null;
};

type OperationsInternals = {
  render: () => void;
  timer: number | null;
  state: Readonly<GameState>;
  active: boolean;
  mount: HTMLElement | null;
  store: GameStore;
};

const toolIds: readonly ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];

/**
 * Coordinates the Dashboard around a single structural renderer. There is no
 * mutation observer, automatic window scrolling, or continuous DOM rebuilding.
 */
export class DashboardStabilityController {
  private originalDashboardRender: (() => void) | null = null;
  private originalOperationsRender: (() => void) | null = null;
  private lastDashboardSignature = '';
  private lastOperationsStructure = '';
  private rendering = false;

  stabilizeDashboard(dashboard: CommandCenterDashboardV2): void {
    const internal = dashboard as unknown as DashboardInternals;
    if (this.originalDashboardRender) return;
    this.originalDashboardRender = internal.render.bind(dashboard);
    internal.render = () => this.renderDashboardSafely(internal);
  }

  disableNativeDashboardTimer(dashboard: CommandCenterDashboardV2): void {
    const internal = dashboard as unknown as DashboardInternals;
    if (internal.refreshTimer !== null) {
      window.clearInterval(internal.refreshTimer);
      internal.refreshTimer = null;
    }
  }

  stabilizeTelemetry(telemetry: LiveDashboardTelemetry): void {
    const internal = telemetry as unknown as TelemetryInternals;
    if (internal.tickTimer !== null) window.clearInterval(internal.tickTimer);
    internal.tickTimer = window.setInterval(() => internal.update(), 1_000);
  }

  stabilizeOperationsConsole(consoleSystem: PersistentOperationsConsole): void {
    const internal = consoleSystem as unknown as OperationsInternals;
    if (!this.originalOperationsRender) {
      this.originalOperationsRender = internal.render.bind(consoleSystem);
      internal.render = () => this.renderOperationsSafely(internal);
    }
    if (internal.timer !== null) window.clearInterval(internal.timer);
    internal.timer = window.setInterval(() => internal.render(), 1_000);
  }

  destroy(): void {
    // Native component destroy methods own their timers and subscriptions.
  }

  private renderDashboardSafely(internal: DashboardInternals): void {
    if (this.rendering || !this.originalDashboardRender || !internal.active) return;
    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    const signature = this.dashboardSignature(internal);
    if (overlay?.querySelector('.command-v2-shell') && signature === this.lastDashboardSignature) return;

    this.rendering = true;
    const overlayScroll = overlay?.scrollTop ?? 0;
    const pageScroll = window.scrollY;
    const telemetryDeck = overlay?.querySelector<HTMLElement>('.live-telemetry-deck') ?? null;

    try {
      telemetryDeck?.remove();
      this.originalDashboardRender();
      const freshOverlay = document.querySelector<HTMLElement>('#strategic-overlay');
      const freshShell = freshOverlay?.querySelector<HTMLElement>('.command-v2-shell');
      if (telemetryDeck && freshShell) freshShell.prepend(telemetryDeck);
      if (freshOverlay) freshOverlay.scrollTop = overlayScroll;
      window.scrollTo({ top: pageScroll, left: window.scrollX, behavior: 'auto' });
      requestAnimationFrame(() => {
        if (freshOverlay) freshOverlay.scrollTop = overlayScroll;
        window.scrollTo({ top: pageScroll, left: window.scrollX, behavior: 'auto' });
      });
      this.lastDashboardSignature = signature;
    } finally {
      this.rendering = false;
    }
  }

  private renderOperationsSafely(internal: OperationsInternals): void {
    if (!this.originalOperationsRender || !internal.active) return;
    const structure = this.operationsStructure(internal.state);
    const mounted = Boolean(internal.mount && document.contains(internal.mount));
    if (!mounted || structure !== this.lastOperationsStructure) {
      this.originalOperationsRender();
      this.lastOperationsStructure = structure;
      return;
    }
    this.updateOperationsInPlace(internal);
  }

  private updateOperationsInPlace(internal: OperationsInternals): void {
    const root = internal.mount;
    if (!root) return;
    const state = internal.state;
    const store = internal.store;
    const units = store.inventoryUnits();
    const capacity = store.inventoryCapacity();
    const load = store.inventoryLoadPercent();
    const saturation = store.biomeSaturation(state.currentBiome);
    const ecology = state.biomeEcology[state.currentBiome];
    const active = state.network.gatherers.filter((gatherer) => Boolean(gatherer.assignedZoneId));
    const repairAllCost = toolIds.reduce((sum, tool) => sum + store.toolRepairCost(tool), 0);

    const storage = root.querySelector<HTMLElement>('.storage-system-card');
    this.text(storage?.querySelector('header strong'), `${Math.round(load)}%`);
    const storageBar = storage?.querySelector<HTMLElement>('.persistent-bar');
    storageBar?.style.setProperty('--fill', `${Math.min(100, load).toFixed(1)}%`);
    storageBar?.classList.toggle('warning', load >= 80 && load < 100);
    storageBar?.classList.toggle('danger', load >= 100);
    this.text(storage?.querySelector('.persistent-gauge-line small'), `${units.toLocaleString()} / ${capacity.toLocaleString()} units`);
    const storageStats = storage?.querySelectorAll<HTMLElement>('.persistent-stat-grid strong');
    if (storageStats?.length === 4) {
      this.text(storageStats[0], Math.max(0, capacity - units).toLocaleString());
      this.text(storageStats[1], `Lv ${state.gear.worldpack}`);
      this.text(storageStats[2], String(state.operations.capacityStops));
      this.text(storageStats[3], this.capacityLabel(load));
    }
    const liquidate = storage?.querySelector<HTMLButtonElement>('[data-operations-liquidate]');
    if (liquidate) liquidate.disabled = units <= 0;

    const ecologyCard = root.querySelector<HTMLElement>('.ecology-system-card');
    this.text(ecologyCard?.querySelector('header strong'), `${Math.round(saturation)}%`);
    ecologyCard?.querySelector<HTMLElement>('.ecology-orbit')?.style.setProperty('--saturation', `${Math.min(100, saturation) * 3.6}deg`);
    this.text(ecologyCard?.querySelector('.ecology-orbit strong'), `${Math.round(saturation)}%`);
    this.text(ecologyCard?.querySelector('.ecology-orbit span'), this.saturationLabel(saturation));
    const ecologyStats = ecologyCard?.querySelectorAll<HTMLElement>('.persistent-stat-grid strong');
    if (ecologyStats?.length === 4) {
      this.text(ecologyStats[0], this.biomeName(state.currentBiome));
      const recovery = saturation <= 8 ? 'OPTIMAL' : `~${Math.ceil((saturation - 8) / store.biomeRecoveryRate())}m`;
      this.text(ecologyStats[1], recovery);
      this.text(ecologyStats[2], String(Math.round(ecology.totalPressure)));
      this.text(ecologyStats[3], String(active.filter((gatherer) => gatheringZones[gatherer.assignedZoneId ?? '']?.biomeId === state.currentBiome).length));
    }

    const maintenance = root.querySelector<HTMLElement>('.maintenance-system-card');
    this.text(maintenance?.querySelector('header strong'), `${repairAllCost.toLocaleString()}c`);
    maintenance?.querySelectorAll<HTMLElement>('.persistent-tool-row').forEach((row, index) => {
      const tool = toolIds[index];
      if (!tool) return;
      const condition = state.toolDurability[tool];
      const cost = store.toolRepairCost(tool);
      this.text(row.querySelector('div:first-child span'), `Lv ${state.tools[tool]} · ${this.conditionLabel(condition)}`);
      row.querySelector<HTMLElement>('.persistent-tool-meter > div')?.style.setProperty('--fill', `${condition.toFixed(1)}%`);
      this.text(row.querySelector('.persistent-tool-meter b'), `${condition.toFixed(0)}%`);
      const button = row.querySelector<HTMLButtonElement>('[data-operations-repair]');
      if (button) {
        button.textContent = cost > 0 ? `${cost}c` : 'READY';
        button.disabled = cost <= 0 || state.coins < cost;
      }
    });
    const repairAll = maintenance?.querySelector<HTMLButtonElement>('[data-operations-repair-all]');
    if (repairAll) {
      repairAll.textContent = `REPAIR ALL · ${repairAllCost.toLocaleString()}c`;
      repairAll.disabled = repairAllCost <= 0 || state.coins < repairAllCost;
    }
    this.text(maintenance?.querySelector('.maintenance-history'), `${state.operations.totalRepairs} repairs · ${state.operations.totalRepairCost.toLocaleString()}c lifetime maintenance`);

    const readiness = root.querySelector<HTMLElement>('.readiness-system-card');
    this.text(readiness?.querySelector('header strong'), `${active.length} ACTIVE`);
    readiness?.querySelectorAll<HTMLElement>('.persistent-gatherer-row').forEach((row, index) => {
      const gatherer = state.network.gatherers[index];
      if (!gatherer) return;
      const zone = gatherer.assignedZoneId ? gatheringZones[gatherer.assignedZoneId] : undefined;
      const recovery = Math.ceil(gatherer.fatigue / (3.5 + gatherer.endurance * .12));
      this.text(row.querySelector('div:first-child span'), zone ? zone.name : gatherer.fatigue > 0 ? `Recovering · ~${recovery}m` : 'Ready for deployment');
      row.querySelector<HTMLElement>('.fatigue-meter > div')?.style.setProperty('--fill', `${gatherer.fatigue.toFixed(1)}%`);
      this.text(row.querySelector('.fatigue-meter b'), `${gatherer.fatigue.toFixed(0)}%`);
      this.text(row.querySelector('em'), this.readinessLabel(gatherer.fatigue));
    });
    const readinessStats = readiness?.querySelectorAll<HTMLElement>('.persistent-stat-grid strong');
    if (readinessStats?.length === 2) {
      this.text(readinessStats[0], String(state.operations.exhaustionRecalls));
      this.text(readinessStats[1], '<85%');
    }

    const alert = root.querySelector<HTMLElement>('.operations-alert');
    if (alert) {
      alert.textContent = this.priorityMessage(state, load, saturation);
      alert.classList.toggle('warning', load >= 100 || saturation >= 82 || state.network.gatherers.some((gatherer) => gatherer.fatigue >= 85) || toolIds.some((tool) => state.toolDurability[tool] <= 25));
      alert.classList.toggle('stable', !alert.classList.contains('warning'));
    }
  }

  private dashboardSignature(internal: DashboardInternals): string {
    const state = internal.state;
    return [
      state.currentBiome,
      state.level,
      state.network.level,
      state.unlockedBiomes.join(','),
      state.network.unlockedZones.join(','),
      state.discovered.length,
      state.network.gatherers.map((gatherer) => `${gatherer.id}:${gatherer.assignedZoneId ?? '-'}`).join('|'),
      Object.entries(state.tools).map(([tool, level]) => `${tool}:${level}`).join('|'),
      Object.entries(state.gear).map(([item, level]) => `${item}:${level}`).join('|'),
      internal.routeMode,
      internal.selectedZoneId ?? '-',
      Date.now() < internal.scanBoostUntil ? 'scan-on' : 'scan-off',
    ].join('::');
  }

  private operationsStructure(state: Readonly<GameState>): string {
    return [
      state.currentBiome,
      state.network.gatherers.map((gatherer) => `${gatherer.id}:${gatherer.assignedZoneId ?? '-'}`).join('|'),
      Object.keys(state.tools).join(','),
    ].join('::');
  }

  private priorityMessage(state: Readonly<GameState>, load: number, saturation: number): string {
    if (load >= 100) return 'ACTION REQUIRED · STORAGE FULL';
    if (state.network.gatherers.some((gatherer) => gatherer.fatigue >= 85)) return 'ACTION REQUIRED · GATHERER FATIGUE';
    if (toolIds.some((tool) => state.toolDurability[tool] <= 25)) return 'MAINTENANCE ADVISED · LOW TOOL CONDITION';
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

  private biomeName(id: GameState['currentBiome']): string {
    return ({ greenveil: 'Greenveil Meadow', ironfall: 'Ironfall Basin', 'crystal-vale': 'Crystal Vale', emberdeep: 'Emberdeep Archive' })[id];
  }

  private text(target: Element | null | undefined, value: string): void {
    if (target && target.textContent !== value) target.textContent = value;
  }
}
