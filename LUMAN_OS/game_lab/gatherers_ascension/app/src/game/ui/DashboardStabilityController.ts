import type { CommandCenterDashboardV2 } from './CommandCenterDashboardV2';
import type { LiveDashboardTelemetry } from './LiveDashboardTelemetry';
import type { PersistentOperationsConsole } from './PersistentOperationsConsole';
import type { GameState } from '../state/GameState';

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
};

const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']);

/**
 * Gives the tactical Dashboard one structural renderer and protects both the
 * internal command viewport and browser page from live-data layout shifts.
 */
export class DashboardStabilityController {
  private originalDashboardRender: (() => void) | null = null;
  private originalOperationsRender: (() => void) | null = null;
  private dashboardInternal: DashboardInternals | null = null;
  private lastDashboardSignature = '';
  private lastOperationsSignature = '';
  private rendering = false;
  private destroyed = false;

  private overlay: HTMLElement | null = null;
  private scrollObserver: MutationObserver | null = null;
  private restoreFrame: number | null = null;
  private intendedOverlayScroll = 0;
  private intendedWindowScroll = 0;
  private userScrollUntil = 0;

  stabilizeDashboard(dashboard: CommandCenterDashboardV2): void {
    const internal = dashboard as unknown as DashboardInternals;
    if (this.originalDashboardRender) return;

    this.dashboardInternal = internal;
    this.originalDashboardRender = internal.render.bind(dashboard);
    internal.render = () => this.renderDashboardSafely(internal);
    this.installScrollGuard();
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
    internal.timer = window.setInterval(() => internal.render(), 2_000);
  }

  destroy(): void {
    this.destroyed = true;
    this.scrollObserver?.disconnect();
    this.scrollObserver = null;
    if (this.restoreFrame !== null) cancelAnimationFrame(this.restoreFrame);
    this.restoreFrame = null;

    const overlay = this.overlay;
    overlay?.removeEventListener('scroll', this.handleOverlayScroll);
    window.removeEventListener('scroll', this.handleWindowScroll);
    window.removeEventListener('wheel', this.markUserScroll);
    window.removeEventListener('touchstart', this.markUserScroll);
    window.removeEventListener('pointerdown', this.markUserScroll);
    document.removeEventListener('keydown', this.markUserScroll, true);
  }

  private installScrollGuard(): void {
    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    if (!overlay) return;

    this.overlay = overlay;
    this.intendedOverlayScroll = overlay.scrollTop;
    this.intendedWindowScroll = window.scrollY;
    overlay.classList.add('dashboard-render-stable');

    overlay.addEventListener('scroll', this.handleOverlayScroll, { passive: true });
    window.addEventListener('scroll', this.handleWindowScroll, { passive: true });
    window.addEventListener('wheel', this.markUserScroll, { passive: true });
    window.addEventListener('touchstart', this.markUserScroll, { passive: true });
    window.addEventListener('pointerdown', this.markUserScroll, { passive: true });
    document.addEventListener('keydown', this.markUserScroll, true);

    this.scrollObserver = new MutationObserver(() => this.scheduleScrollRestore());
    this.scrollObserver.observe(overlay, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  private readonly markUserScroll = (event: Event): void => {
    if (event instanceof KeyboardEvent && !scrollKeys.has(event.key)) return;
    this.userScrollUntil = performance.now() + 900;
  };

  private readonly handleOverlayScroll = (): void => {
    if (!this.overlay || performance.now() > this.userScrollUntil) return;
    this.intendedOverlayScroll = this.overlay.scrollTop;
  };

  private readonly handleWindowScroll = (): void => {
    if (performance.now() > this.userScrollUntil) return;
    this.intendedWindowScroll = window.scrollY;
  };

  private renderDashboardSafely(internal: DashboardInternals): void {
    if (this.rendering || !this.originalDashboardRender || !internal.active) return;

    const overlay = this.overlay ?? document.querySelector<HTMLElement>('#strategic-overlay');
    const hasDashboard = Boolean(overlay?.querySelector('.command-v2-shell'));
    const signature = this.dashboardSignature(internal);
    if (hasDashboard && signature === this.lastDashboardSignature) {
      this.ensureTelemetryDeckFirst();
      return;
    }

    this.rendering = true;
    const savedOverlayScroll = overlay?.scrollTop ?? this.intendedOverlayScroll;
    const savedWindowScroll = window.scrollY;
    const telemetryDeck = overlay?.querySelector<HTMLElement>('.live-telemetry-deck') ?? null;
    this.intendedOverlayScroll = savedOverlayScroll;
    this.intendedWindowScroll = savedWindowScroll;

    try {
      telemetryDeck?.remove();
      this.originalDashboardRender();

      const freshOverlay = document.querySelector<HTMLElement>('#strategic-overlay');
      const freshShell = freshOverlay?.querySelector<HTMLElement>('.command-v2-shell');
      if (telemetryDeck && freshShell) freshShell.prepend(telemetryDeck);

      if (freshOverlay) {
        this.overlay = freshOverlay;
        freshOverlay.classList.add('dashboard-render-stable');
      }

      this.ensureTelemetryDeckFirst();
      this.lastDashboardSignature = signature;
      this.scheduleScrollRestore(true);
    } finally {
      this.rendering = false;
    }
  }

  private renderOperationsSafely(internal: OperationsInternals): void {
    if (!this.originalOperationsRender || !internal.active) return;
    const mounted = Boolean(internal.mount && document.contains(internal.mount));
    const signature = this.operationsSignature(internal.state);
    if (mounted && signature === this.lastOperationsSignature) return;
    this.originalOperationsRender();
    this.lastOperationsSignature = signature;
    this.scheduleScrollRestore();
  }

  private ensureTelemetryDeckFirst(): void {
    const overlay = this.overlay;
    if (!overlay) return;
    const shell = overlay.querySelector<HTMLElement>('.command-v2-shell');
    const deck = shell?.querySelector<HTMLElement>(':scope > .live-telemetry-deck');
    if (!shell || !deck || shell.firstElementChild === deck) return;

    const overlayScroll = overlay.scrollTop;
    const windowScroll = window.scrollY;
    shell.prepend(deck);
    this.intendedOverlayScroll = overlayScroll;
    this.intendedWindowScroll = windowScroll;
    this.scheduleScrollRestore(true);
  }

  private scheduleScrollRestore(force = false): void {
    if (this.destroyed || !this.dashboardInternal?.active) return;
    if (!force && performance.now() <= this.userScrollUntil) return;
    if (this.restoreFrame !== null) cancelAnimationFrame(this.restoreFrame);

    this.restoreFrame = requestAnimationFrame(() => {
      this.restoreFrame = null;
      this.restoreScrollPosition();
    });
  }

  private restoreScrollPosition(): void {
    if (this.destroyed || !this.dashboardInternal?.active || performance.now() <= this.userScrollUntil) return;
    const overlay = this.overlay;
    if (!overlay) return;

    const overlayMaximum = Math.max(0, overlay.scrollHeight - overlay.clientHeight);
    const overlayTarget = Math.min(this.intendedOverlayScroll, overlayMaximum);
    if (Math.abs(overlay.scrollTop - overlayTarget) > 1) overlay.scrollTop = overlayTarget;

    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const windowMaximum = Math.max(0, documentHeight - window.innerHeight);
    const windowTarget = Math.min(this.intendedWindowScroll, windowMaximum);
    if (Math.abs(window.scrollY - windowTarget) > 1) {
      window.scrollTo({ top: windowTarget, left: window.scrollX, behavior: 'auto' });
    }
  }

  private dashboardSignature(internal: DashboardInternals): string {
    const state = internal.state;
    const assignments = state.network.gatherers
      .map((gatherer) => `${gatherer.id}:${gatherer.assignedZoneId ?? '-'}:${Math.floor(gatherer.fatigue / 10)}`)
      .join('|');
    const tools = Object.entries(state.tools)
      .map(([tool, level]) => `${tool}:${level}:${Math.floor((state.toolDurability[tool as keyof typeof state.toolDurability] ?? 100) / 5)}`)
      .join('|');
    const gear = Object.entries(state.gear).map(([item, level]) => `${item}:${level}`).join('|');
    const ecology = Math.round(state.biomeEcology[state.currentBiome]?.saturation ?? 12);
    const scanActive = Date.now() < internal.scanBoostUntil;

    return [
      state.currentBiome,
      state.level,
      state.network.level,
      state.unlockedBiomes.join(','),
      state.network.unlockedZones.join(','),
      state.discovered.length,
      assignments,
      tools,
      gear,
      ecology,
      internal.routeMode,
      internal.selectedZoneId ?? '-',
      scanActive ? 'scan-on' : 'scan-off',
      Math.floor(state.totals.gathered / 100),
    ].join('::');
  }

  private operationsSignature(state: Readonly<GameState>): string {
    const inventoryUnits = Object.values(state.inventory).reduce((sum, amount) => sum + Math.max(0, amount), 0);
    const tools = Object.entries(state.tools)
      .map(([tool, level]) => `${tool}:${level}:${(state.toolDurability[tool as keyof typeof state.toolDurability] ?? 100).toFixed(1)}`)
      .join('|');
    const gatherers = state.network.gatherers
      .map((gatherer) => `${gatherer.id}:${gatherer.assignedZoneId ?? '-'}:${gatherer.fatigue.toFixed(1)}:${gatherer.endurance}`)
      .join('|');
    const ecology = state.biomeEcology[state.currentBiome];

    return [
      state.currentBiome,
      state.coins,
      inventoryUnits,
      state.level,
      state.network.level,
      state.stats.endurance,
      state.gear.worldpack,
      tools,
      gatherers,
      ecology?.saturation.toFixed(1) ?? '12.0',
      ecology?.totalPressure.toFixed(1) ?? '0.0',
      state.operations.totalRepairs,
      state.operations.totalRepairCost,
      state.operations.capacityStops,
      state.operations.exhaustionRecalls,
    ].join('::');
  }
}
