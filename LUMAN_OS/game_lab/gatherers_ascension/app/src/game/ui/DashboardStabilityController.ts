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
};

/**
 * Prevents the tactical dashboard, real-time telemetry, and persistent
 * operations console from rebuilding the same DOM on overlapping timers.
 *
 * The tactical screen now performs a full render only when its structural
 * signature changes. Live values continue updating through their dedicated
 * telemetry systems without resetting the map, scroll position, or controls.
 */
export class DashboardStabilityController {
  private originalDashboardRender: (() => void) | null = null;
  private dashboardPollTimer: number | null = null;
  private lastDashboardSignature = '';
  private rendering = false;
  private destroyed = false;

  stabilizeDashboard(dashboard: CommandCenterDashboardV2): void {
    const internal = dashboard as unknown as DashboardInternals;
    if (this.originalDashboardRender) return;

    this.originalDashboardRender = internal.render.bind(dashboard);
    internal.render = () => this.renderDashboardSafely(internal);

    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    overlay?.classList.add('dashboard-render-stable');

    this.dashboardPollTimer = window.setInterval(() => {
      if (!this.destroyed && internal.active) internal.render();
    }, 1_000);
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
    if (internal.timer !== null) window.clearInterval(internal.timer);
    internal.timer = window.setInterval(() => internal.render(), 2_000);
  }

  destroy(): void {
    this.destroyed = true;
    if (this.dashboardPollTimer !== null) window.clearInterval(this.dashboardPollTimer);
    this.dashboardPollTimer = null;
  }

  private renderDashboardSafely(internal: DashboardInternals): void {
    if (this.rendering || !this.originalDashboardRender || !internal.active) return;

    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    const hasDashboard = Boolean(overlay?.querySelector('.command-v2-shell'));
    const signature = this.dashboardSignature(internal);
    if (hasDashboard && signature === this.lastDashboardSignature) return;

    this.rendering = true;
    const savedScrollTop = overlay?.scrollTop ?? 0;
    const savedScrollLeft = overlay?.scrollLeft ?? 0;
    const telemetryDeck = overlay?.querySelector<HTMLElement>('.live-telemetry-deck') ?? null;

    try {
      telemetryDeck?.remove();
      this.originalDashboardRender();

      const freshOverlay = document.querySelector<HTMLElement>('#strategic-overlay');
      const freshShell = freshOverlay?.querySelector<HTMLElement>('.command-v2-shell');
      if (telemetryDeck && freshShell) freshShell.prepend(telemetryDeck);

      if (freshOverlay) {
        freshOverlay.classList.add('dashboard-render-stable');
        freshOverlay.scrollTop = savedScrollTop;
        freshOverlay.scrollLeft = savedScrollLeft;
        requestAnimationFrame(() => {
          if (!freshOverlay.isConnected) return;
          freshOverlay.scrollTop = savedScrollTop;
          freshOverlay.scrollLeft = savedScrollLeft;
        });
      }

      this.lastDashboardSignature = signature;
    } finally {
      this.rendering = false;
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
}
