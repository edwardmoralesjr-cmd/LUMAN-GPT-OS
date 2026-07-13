import {
  allResources,
  biomes,
  parseInventoryKey,
  qualityDefinitions,
  type BiomeId,
  type ToolId,
} from '../data/content';
import { gatheringZones, zonesByBiome, type GatheringZoneDefinition } from '../data/network';
import { xpForLevel } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState } from '../state/GameState';

type CommandView = 'dashboard' | 'field' | 'network' | 'gatherers' | 'codex' | 'market';
type PrimaryMode = 'sell' | 'repair' | 'network' | 'field';

interface DashboardSample {
  at: number;
  gathered: number;
  netWorth: number;
  rate: number;
}

interface OperationProjection {
  gatherer: GathererState;
  zone: GatheringZoneDefinition;
  progress: number;
  remainingMs: number;
  unitsPerMinute: number;
  valuePerMinute: number;
}

interface InventorySummary {
  units: number;
  value: number;
}

interface EnvironmentProfile {
  weather: string;
  temperature: string;
  wind: string;
  light: string;
  stability: string;
}

const toolIds: readonly ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];
const dangerScore: Record<GatheringZoneDefinition['danger'], number> = {
  Low: 8,
  Moderate: 28,
  High: 56,
  Extreme: 82,
};

export class CommandCenterDashboardV3 {
  private state: Readonly<GameState>;
  private active = true;
  private selectedZoneId: string | null = null;
  private unsubscribe: (() => void) | null = null;
  private timer: number | null = null;
  private samples: DashboardSample[] = [];
  private zoom = 1;

  private readonly overlay: HTMLElement;
  private readonly leftPanel: HTMLElement;
  private readonly rightPanel: HTMLElement;
  private readonly bottomPanel: HTMLElement;
  private readonly kicker: HTMLElement;
  private readonly title: HTMLElement;
  private readonly subtitle: HTMLElement;

  constructor(private store: GameStore) {
    this.state = store.snapshot;
    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    const leftPanel = document.querySelector<HTMLElement>('#left-panel-content');
    const rightPanel = document.querySelector<HTMLElement>('#right-panel-content');
    const bottomPanel = document.querySelector<HTMLElement>('#bottom-panel-content');
    const kicker = document.querySelector<HTMLElement>('#operation-kicker');
    const title = document.querySelector<HTMLElement>('#operation-title');
    const subtitle = document.querySelector<HTMLElement>('#operation-subtitle');
    if (!overlay || !leftPanel || !rightPanel || !bottomPanel || !kicker || !title || !subtitle) {
      throw new Error('Command Center V3 requires the command interface shell.');
    }
    this.overlay = overlay;
    this.leftPanel = leftPanel;
    this.rightPanel = rightPanel;
    this.bottomPanel = bottomPanel;
    this.kicker = kicker;
    this.title = title;
    this.subtitle = subtitle;
  }

  initialize(): void {
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.active = tab.dataset.view === 'dashboard';
        document.documentElement.classList.toggle('v3-dashboard-active', this.active);
        if (this.active) {
          this.mount();
          this.update();
        }
      });
    });

    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type !== 'state') return;
      this.state = event.state;
      if (!this.active) return;
      this.mount();
      this.update();
    });

    this.active = document.querySelector<HTMLButtonElement>('.command-tab.active')?.dataset.view === 'dashboard';
    document.documentElement.classList.toggle('v3-dashboard-active', this.active);
    this.recordSample();
    this.timer = window.setInterval(() => {
      if (!this.active) return;
      this.recordSample();
      this.update();
    }, 1_000);

    if (this.active) {
      this.mount();
      this.update();
    }
  }

  destroy(): void {
    this.unsubscribe?.();
    if (this.timer !== null) window.clearInterval(this.timer);
    document.documentElement.classList.remove('v3-dashboard-active');
  }

  private mount(): void {
    if (this.overlay.querySelector('.command-v3-map')) return;

    this.kicker.textContent = 'WORLDROOT TACTICAL COMMAND CENTER';
    this.title.textContent = 'Operational Network';
    this.subtitle.textContent = 'Select a node, evaluate current conditions, and issue the next command.';

    this.leftPanel.innerHTML = this.leftTemplate();
    this.rightPanel.innerHTML = this.rightTemplate();
    this.bottomPanel.innerHTML = this.bottomTemplate();
    this.overlay.innerHTML = this.centerTemplate();
    this.overlay.classList.add('visible');
    this.bindActions();
  }

  private leftTemplate(): string {
    return `<section class="v3-panel v3-biome-card">
      <header><span>OPERATIONS</span><b id="v3-network-sync">SYNCED</b></header>
      <div class="v3-biome-identity"><div class="v3-worldroot-emblem" aria-hidden="true"><i></i></div><div><small id="v3-biome-subtitle">ACTIVE BIOME</small><h3 id="v3-biome-name">Greenveil Meadow</h3><p>Network level <strong id="v3-network-level">1</strong></p></div></div>
      <div class="v3-progress"><span id="v3-network-xp-bar"></span></div><div class="v3-progress-caption"><span id="v3-network-xp">0 / 0 XP</span><b id="v3-zone-access">1/3 zones</b></div>
    </section>
    <section class="v3-panel">
      <header><span>BIOME CONDITIONS</span><b>LIVE PROFILE</b></header>
      <div class="v3-condition-list">
        ${this.conditionRow('WEATHER', 'v3-weather')}${this.conditionRow('TEMPERATURE', 'v3-temperature')}${this.conditionRow('WIND', 'v3-wind')}${this.conditionRow('TIME / LIGHT', 'v3-light')}${this.conditionRow('ECOLOGY', 'v3-ecology')}
      </div>
      <button class="v3-button quiet" data-v3-action="field">ENTER FIELD OPERATION</button>
    </section>
    <section class="v3-panel v3-routes-panel">
      <header><span>ACTIVE ROUTES</span><b id="v3-active-route-count">0 ACTIVE</b></header>
      <div class="v3-route-list">${[0, 1, 2].map((index) => this.routeSlot(index)).join('')}</div>
      <button class="v3-button" data-v3-action="network">MANAGE ROUTES</button>
    </section>
    <section class="v3-panel v3-quick-command-panel">
      <header><span>QUICK COMMANDS</span><b>READY</b></header>
      <div class="v3-quick-grid">
        <button data-v3-action="sell">LIQUIDATE<br><strong id="v3-quick-cargo">0c</strong></button>
        <button data-v3-action="repair">MAINTENANCE<br><strong id="v3-repair-cost">0c</strong></button>
        <button data-v3-action="codex">OPEN<br><strong>CODEX</strong></button>
        <button data-v3-action="market">GEAR<br><strong>UPGRADES</strong></button>
      </div>
    </section>`;
  }

  private rightTemplate(): string {
    return `<section class="v3-panel v3-node-card">
      <header><span>NODE INTELLIGENCE</span><b id="v3-node-status">READY</b></header>
      <div class="v3-node-title"><div class="v3-node-icon">◇</div><div><small id="v3-node-tier">TIER 1</small><h3 id="v3-node-name">Worldwood Grove</h3><p id="v3-node-description">Stable gathering route</p></div></div>
      <div class="v3-readout-row"><span>STABILITY</span><strong id="v3-node-stability">100%</strong></div><div class="v3-thin-bar"><span id="v3-node-stability-bar"></span></div>
      <div class="v3-readout-row"><span>PROJECTED YIELD</span><strong id="v3-node-yield">0 / min</strong></div>
      <div class="v3-readout-row"><span>NEXT CYCLE</span><strong id="v3-node-eta">IDLE</strong></div>
      <div class="v3-readout-row"><span>RESOURCE FOCUS</span><strong id="v3-node-resource">Unknown</strong></div>
      <div class="v3-readout-row"><span>LOCAL RISK</span><strong id="v3-node-risk">LOW</strong></div>
      <button class="v3-button" data-v3-action="network">OPEN NODE CONTROLS</button>
    </section>
    <section class="v3-panel">
      <header><span>LINK STATUS</span><b id="v3-link-health">STABLE</b></header>
      <div class="v3-link-list">${[0, 1, 2].map((index) => `<div data-v3-link-index="${index}"><i></i><span>Awaiting node</span><strong>--</strong></div>`).join('')}</div>
    </section>
    <section class="v3-panel v3-alert-panel">
      <header><span>SYSTEM ALERTS</span><b id="v3-alert-count">0</b></header>
      <div class="v3-alert-list">${[0, 1, 2].map((index) => `<div data-v3-alert-index="${index}" class="nominal"><i></i><span>All systems nominal</span></div>`).join('')}</div>
    </section>
    <section class="v3-panel v3-recommendation">
      <header><span>COMMAND RECOMMENDATION</span><b>PRIORITY</b></header>
      <p id="v3-recommendation-copy">Continue current operations.</p>
      <button id="v3-recommendation-action" class="v3-button primary" data-v3-primary-mode="field">ENTER FIELD</button>
    </section>`;
  }

  private centerTemplate(): string {
    return `<section class="command-v3-map" aria-label="Worldroot tactical map">
      <header class="v3-map-header"><div><span id="v3-map-kicker">ACTIVE BIOME</span><h3 id="v3-map-title">Greenveil Meadow</h3><p id="v3-map-coordinates">NETWORK COORDINATES · 00.0 / 00.0</p></div><div class="v3-map-actions"><button data-v3-action="codex">CODEX</button><button data-v3-action="field">FIELD</button></div></header>
      <div class="v3-map-viewport">
        <div id="v3-map-world" class="v3-map-world">
          <div class="v3-route-line line-a"></div><div class="v3-route-line line-b"></div><div class="v3-route-line line-c"></div>
          <div class="v3-command-core"><span>✦</span><b id="v3-core-label">COMMAND CORE</b></div>
          ${[0, 1, 2].map((index) => `<button class="v3-map-node node-${index}" data-v3-map-node="${index}"><i></i><span>NODE ${index + 1}</span><strong>SCANNING</strong></button>`).join('')}
          <div class="v3-anomaly-node"><i></i><span id="v3-anomaly-name">ANOMALY SCAN</span><strong id="v3-anomaly-status">STABLE</strong></div>
        </div>
        <div class="v3-weather-chip"><span id="v3-map-weather">CLEAR CANOPY</span><strong id="v3-map-temperature">18°C</strong><small id="v3-map-wind">8 km/h</small></div>
        <div class="v3-map-controls"><button data-v3-zoom="in" aria-label="Zoom map in">+</button><button data-v3-zoom="out" aria-label="Zoom map out">−</button><button data-v3-zoom="reset" aria-label="Reset map zoom">⌾</button></div>
        <div class="v3-expedition-card">
          <div class="v3-expedition-symbol">✦</div><div class="v3-expedition-main"><span>ACTIVE EXPEDITION</span><strong id="v3-expedition-name">No team deployed</strong><div class="v3-progress"><span id="v3-expedition-bar"></span></div></div>
          <div><span>UNITS / MIN</span><strong id="v3-expedition-units">0</strong></div><div><span>VALUE / MIN</span><strong id="v3-expedition-value">0c</strong></div><div><span>ETA</span><strong id="v3-expedition-eta">IDLE</strong></div>
          <button data-v3-action="network">MANAGE</button>
        </div>
      </div>
      <footer class="v3-command-footer"><span id="v3-command-status">WORLDROOT NETWORK READY</span><button id="v3-primary-command" data-v3-primary-mode="field">ENTER FIELD OPERATION</button></footer>
    </section>`;
  }

  private bottomTemplate(): string {
    return `<article class="v3-analytics-card"><header><span>YIELD TREND</span><strong id="v3-yield-current">0 /m</strong></header><svg viewBox="0 0 300 84" preserveAspectRatio="none"><polyline id="v3-yield-line" points="0,72 300,72"/></svg><footer><span>LAST 60 SECONDS</span><b id="v3-yield-delta">0%</b></footer></article>
    <article class="v3-analytics-card"><header><span>NETWORK VALUE</span><strong id="v3-net-worth">0c</strong></header><svg viewBox="0 0 300 84" preserveAspectRatio="none"><polyline id="v3-value-line" points="0,72 300,72"/></svg><footer><span>COINS + CARGO</span><b id="v3-value-delta">0%</b></footer></article>
    <article class="v3-analytics-card"><header><span>PRODUCTION RATE</span><strong id="v3-production-rate">0c /m</strong></header><div class="v3-production-bars">${Array.from({ length: 16 }, (_, index) => `<i data-v3-production-bar="${index}"></i>`).join('')}</div><footer><span>PROJECTED NETWORK</span><b id="v3-active-operations">0 OPS</b></footer></article>
    <article class="v3-analytics-card gauge-card"><header><span>BIOME EFFICIENCY</span><strong id="v3-efficiency-label">STABLE</strong></header><div id="v3-efficiency-gauge" class="v3-gauge"><div><strong id="v3-efficiency">100%</strong><span>EFFICIENCY</span></div></div><footer><span>ECOLOGY + FATIGUE</span><b id="v3-saturation">0%</b></footer></article>
    <article class="v3-analytics-card gauge-card"><header><span>THREAT MONITOR</span><strong id="v3-threat-label">LOW</strong></header><div id="v3-threat-gauge" class="v3-gauge threat"><div><strong id="v3-threat">0%</strong><span>LOCAL RISK</span></div></div><footer><span>SELECTED NODE</span><b id="v3-anomaly-tier">NOMINAL</b></footer></article>`;
  }

  private conditionRow(label: string, id: string): string {
    return `<div><span>${label}</span><strong id="${id}">--</strong></div>`;
  }

  private routeSlot(index: number): string {
    return `<button data-v3-route-index="${index}"><i></i><div><strong>Awaiting route</strong><span>Node not connected</span></div><b>--</b></button>`;
  }

  private bindActions(): void {
    const roots = [this.leftPanel, this.rightPanel, this.bottomPanel, this.overlay];
    roots.forEach((root) => {
      root.querySelectorAll<HTMLButtonElement>('[data-v3-action]').forEach((button) => {
        button.addEventListener('click', () => this.runAction(button.dataset.v3Action ?? ''));
      });
    });

    this.leftPanel.querySelectorAll<HTMLButtonElement>('[data-v3-route-index]').forEach((button) => {
      button.addEventListener('click', () => this.selectZone(Number(button.dataset.v3RouteIndex ?? '0')));
    });
    this.overlay.querySelectorAll<HTMLButtonElement>('[data-v3-map-node]').forEach((button) => {
      button.addEventListener('click', () => this.selectZone(Number(button.dataset.v3MapNode ?? '0')));
    });
    this.overlay.querySelectorAll<HTMLButtonElement>('[data-v3-zoom]').forEach((button) => {
      button.addEventListener('click', () => this.changeZoom(button.dataset.v3Zoom ?? 'reset'));
    });
    this.overlay.querySelector<HTMLButtonElement>('#v3-primary-command')?.addEventListener('click', (event) => {
      const button = event.currentTarget as HTMLButtonElement;
      this.runPrimary(button.dataset.v3PrimaryMode as PrimaryMode | undefined);
    });
    this.rightPanel.querySelector<HTMLButtonElement>('#v3-recommendation-action')?.addEventListener('click', (event) => {
      const button = event.currentTarget as HTMLButtonElement;
      this.runPrimary(button.dataset.v3PrimaryMode as PrimaryMode | undefined);
    });
  }

  private runAction(action: string): void {
    if (action === 'sell') this.store.sellAll();
    else if (action === 'repair') this.store.repairAllTools();
    else if (action === 'field' || action === 'network' || action === 'codex' || action === 'market') this.switchView(action);
  }

  private runPrimary(mode: PrimaryMode | undefined): void {
    if (!mode) return;
    this.runAction(mode);
  }

  private switchView(view: CommandView): void {
    document.querySelector<HTMLButtonElement>(`.command-tab[data-view="${view}"]`)?.click();
  }

  private selectZone(index: number): void {
    const zones = zonesByBiome(this.state.currentBiome);
    const zone = zones[index];
    if (!zone) return;
    this.selectedZoneId = zone.id;
    this.update();
  }

  private changeZoom(direction: string): void {
    if (direction === 'in') this.zoom = Math.min(1.2, this.zoom + 0.08);
    else if (direction === 'out') this.zoom = Math.max(0.92, this.zoom - 0.08);
    else this.zoom = 1;
    this.overlay.querySelector<HTMLElement>('#v3-map-world')?.style.setProperty('--map-zoom', String(this.zoom));
  }

  private update(): void {
    if (!this.active || !this.overlay.querySelector('.command-v3-map')) return;
    const biome = biomes[this.state.currentBiome];
    const zones = zonesByBiome(this.state.currentBiome);
    const activeOperations = this.operationProjections();
    const inventory = this.inventorySummary();
    const rate = activeOperations.reduce((sum, operation) => sum + operation.valuePerMinute, 0);
    const selected = this.resolveSelectedZone(zones, activeOperations);
    const environment = this.environmentProfile(this.state.currentBiome);
    const saturation = this.store.biomeSaturation(this.state.currentBiome);
    const efficiency = this.efficiencyScore(saturation);
    const threat = this.threatScore(selected, saturation);
    const primary = this.primaryRecommendation(inventory, activeOperations, saturation);

    this.kicker.textContent = 'WORLDROOT TACTICAL COMMAND CENTER';
    this.title.textContent = biome.name;
    this.subtitle.textContent = 'Live route control, node intelligence, and immediate command decisions.';

    this.text('v3-biome-name', biome.name);
    this.text('v3-biome-subtitle', biome.subtitle.toUpperCase());
    this.text('v3-network-level', String(this.state.network.level));
    const networkNeed = Math.floor(140 + Math.pow(this.state.network.level, 1.5) * 95);
    this.text('v3-network-xp', `${this.state.network.xp.toLocaleString()} / ${networkNeed.toLocaleString()} XP`);
    this.width('v3-network-xp-bar', networkNeed > 0 ? (this.state.network.xp / networkNeed) * 100 : 100);
    const unlockedInBiome = zones.filter((zone) => this.state.network.unlockedZones.includes(zone.id)).length;
    this.text('v3-zone-access', `${unlockedInBiome}/${zones.length} zones`);
    this.text('v3-network-sync', activeOperations.length ? 'OPERATING' : 'READY');

    this.text('v3-weather', environment.weather);
    this.text('v3-temperature', environment.temperature);
    this.text('v3-wind', environment.wind);
    this.text('v3-light', environment.light);
    this.text('v3-ecology', `${Math.round(saturation)}% · ${this.ecologyLabel(saturation)}`);
    this.text('v3-map-weather', environment.weather.toUpperCase());
    this.text('v3-map-temperature', environment.temperature);
    this.text('v3-map-wind', environment.wind);

    this.updateRoutes(zones, activeOperations);
    this.updateMapNodes(zones, activeOperations, selected);
    this.updateSelectedNode(selected, activeOperations);
    this.updateLinks(zones, activeOperations);
    this.updateAlerts(inventory, saturation, threat);
    this.updateExpedition(activeOperations);

    this.text('v3-map-kicker', `${biome.subtitle.toUpperCase()} · LIVE OPERATIONS`);
    this.text('v3-map-title', biome.name);
    this.text('v3-map-coordinates', this.coordinatesFor(this.state.currentBiome));
    this.text('v3-core-label', `${biome.name.toUpperCase()} CORE`);
    this.text('v3-command-status', activeOperations.length ? `${activeOperations.length} EXTRACTION STREAM${activeOperations.length === 1 ? '' : 'S'} ACTIVE` : 'WORLDROOT NETWORK READY');

    this.text('v3-quick-cargo', `${inventory.value.toLocaleString()}c`);
    const repairCost = toolIds.reduce((sum, tool) => sum + this.store.toolRepairCost(tool), 0);
    this.text('v3-repair-cost', `${repairCost.toLocaleString()}c`);
    this.text('v3-active-route-count', `${activeOperations.length} ACTIVE`);

    this.applyPrimary(primary);
    this.updateAnalytics(inventory, rate, activeOperations, efficiency, saturation, threat, selected);
  }

  private updateRoutes(zones: GatheringZoneDefinition[], operations: OperationProjection[]): void {
    this.leftPanel.querySelectorAll<HTMLButtonElement>('[data-v3-route-index]').forEach((row, index) => {
      const zone = zones[index];
      const active = zone ? operations.find((operation) => operation.zone.id === zone.id) : undefined;
      const unlocked = zone ? this.state.network.unlockedZones.includes(zone.id) : false;
      row.classList.toggle('selected', Boolean(zone && zone.id === this.selectedZoneId));
      row.classList.toggle('locked', Boolean(zone && !unlocked));
      const title = row.querySelector<HTMLElement>('strong');
      const detail = row.querySelector<HTMLElement>('span');
      const status = row.querySelector<HTMLElement>('b');
      const dot = row.querySelector<HTMLElement>('i');
      if (!zone) {
        if (title) title.textContent = 'No additional route';
        if (detail) detail.textContent = 'Biome route capacity complete';
        if (status) status.textContent = '--';
        return;
      }
      if (title) title.textContent = zone.name;
      if (detail) detail.textContent = active ? `${active.gatherer.name} · ${this.formatClock(active.remainingMs)}` : `${zone.danger} risk · T${zone.tier} · ${zone.baseYield} base yield`;
      if (status) status.textContent = active ? 'ACTIVE' : unlocked ? 'READY' : 'LOCKED';
      if (dot) dot.style.setProperty('--route-color', zone.accent);
    });
  }

  private updateMapNodes(zones: GatheringZoneDefinition[], operations: OperationProjection[], selected: GatheringZoneDefinition): void {
    this.overlay.querySelectorAll<HTMLButtonElement>('[data-v3-map-node]').forEach((node, index) => {
      const zone = zones[index];
      if (!zone) {
        node.hidden = true;
        return;
      }
      node.hidden = false;
      const active = operations.find((operation) => operation.zone.id === zone.id);
      const unlocked = this.state.network.unlockedZones.includes(zone.id);
      node.classList.toggle('selected', zone.id === selected.id);
      node.classList.toggle('active', Boolean(active));
      node.classList.toggle('locked', !unlocked);
      const name = node.querySelector<HTMLElement>('span');
      const status = node.querySelector<HTMLElement>('strong');
      if (name) name.textContent = zone.name;
      if (status) status.textContent = active ? `ACTIVE · ${this.formatClock(active.remainingMs)}` : unlocked ? `READY · T${zone.tier}` : `LOCKED · LV ${zone.unlockLevel}`;
      node.style.setProperty('--node-accent', zone.accent);
    });

    const anomalyZone = zones.find((zone) => zone.danger === 'Extreme') ?? zones[zones.length - 1];
    this.text('v3-anomaly-name', anomalyZone ? anomalyZone.name.toUpperCase() : 'ANOMALY SCAN');
    this.text('v3-anomaly-status', anomalyZone && anomalyZone.danger !== 'Low' ? `${anomalyZone.danger.toUpperCase()} · T${anomalyZone.tier}` : 'NOMINAL');
  }

  private updateSelectedNode(zone: GatheringZoneDefinition, operations: OperationProjection[]): void {
    const active = operations.find((operation) => operation.zone.id === zone.id);
    const unlocked = this.state.network.unlockedZones.includes(zone.id);
    const resource = zone.resources[0] ? allResources[zone.resources[0]] : undefined;
    this.text('v3-node-status', active ? 'ACTIVE' : unlocked ? 'READY' : 'LOCKED');
    this.text('v3-node-tier', `${zone.danger.toUpperCase()} · TIER ${zone.tier}`);
    this.text('v3-node-name', zone.name);
    this.text('v3-node-description', zone.description);
    this.text('v3-node-stability', `${zone.stability}%`);
    this.width('v3-node-stability-bar', zone.stability);
    this.text('v3-node-yield', active ? `${active.unitsPerMinute.toFixed(1)} units / min` : `${zone.baseYield} base units`);
    this.text('v3-node-eta', active ? this.formatClock(active.remainingMs) : unlocked ? 'AWAITING TEAM' : 'REQUIRES UNLOCK');
    this.text('v3-node-resource', resource?.name ?? 'Multiple resources');
    this.text('v3-node-risk', zone.danger.toUpperCase());
  }

  private updateLinks(zones: GatheringZoneDefinition[], operations: OperationProjection[]): void {
    this.rightPanel.querySelectorAll<HTMLElement>('[data-v3-link-index]').forEach((row, index) => {
      const zone = zones[index];
      const active = zone ? operations.find((operation) => operation.zone.id === zone.id) : undefined;
      const unlocked = zone ? this.state.network.unlockedZones.includes(zone.id) : false;
      const name = row.querySelector<HTMLElement>('span');
      const status = row.querySelector<HTMLElement>('strong');
      row.classList.toggle('locked', Boolean(zone && !unlocked));
      if (name) name.textContent = zone?.name ?? 'No linked node';
      if (status) status.textContent = active ? this.formatClock(active.remainingMs) : unlocked ? 'STANDBY' : 'OFFLINE';
    });
    this.text('v3-link-health', operations.length ? 'TRANSMITTING' : 'STABLE');
  }

  private updateAlerts(inventory: InventorySummary, saturation: number, threat: number): void {
    const damaged = toolIds.filter((tool) => this.state.toolDurability[tool] < 40).length;
    const tired = this.state.network.gatherers.filter((gatherer) => gatherer.fatigue >= 75).length;
    const alerts: Array<{ text: string; tone: 'nominal' | 'warning' | 'danger' }> = [];
    const load = this.store.inventoryLoadPercent();
    if (load >= 90) alerts.push({ text: `Storage at ${Math.round(load)}% capacity`, tone: load >= 100 ? 'danger' : 'warning' });
    if (damaged) alerts.push({ text: `${damaged} tool${damaged === 1 ? '' : 's'} require maintenance`, tone: 'warning' });
    if (tired) alerts.push({ text: `${tired} gatherer${tired === 1 ? '' : 's'} approaching fatigue limit`, tone: 'warning' });
    if (saturation >= 75) alerts.push({ text: `Biome saturation elevated at ${Math.round(saturation)}%`, tone: 'warning' });
    if (threat >= 55) alerts.push({ text: `Selected route threat is ${this.threatLabel(threat)}`, tone: threat >= 80 ? 'danger' : 'warning' });
    if (!alerts.length) alerts.push({ text: 'All command systems nominal', tone: 'nominal' });
    if (inventory.units === 0) alerts.push({ text: 'Worldpack ready for new cargo', tone: 'nominal' });

    const visible = alerts.slice(0, 3);
    this.rightPanel.querySelectorAll<HTMLElement>('[data-v3-alert-index]').forEach((row, index) => {
      const alert = visible[index];
      row.className = alert?.tone ?? 'nominal';
      const copy = row.querySelector<HTMLElement>('span');
      if (copy) copy.textContent = alert?.text ?? 'No additional alert';
      row.classList.toggle('empty', !alert);
    });
    this.text('v3-alert-count', String(alerts.filter((alert) => alert.tone !== 'nominal').length));
  }

  private updateExpedition(operations: OperationProjection[]): void {
    const operation = [...operations].sort((a, b) => a.remainingMs - b.remainingMs)[0];
    if (!operation) {
      this.text('v3-expedition-name', 'No team deployed');
      this.text('v3-expedition-units', '0');
      this.text('v3-expedition-value', '0c');
      this.text('v3-expedition-eta', 'IDLE');
      this.width('v3-expedition-bar', 0);
      return;
    }
    this.text('v3-expedition-name', `${operation.gatherer.name} · ${operation.zone.name}`);
    this.text('v3-expedition-units', operation.unitsPerMinute.toFixed(1));
    this.text('v3-expedition-value', `${Math.round(operation.valuePerMinute)}c`);
    this.text('v3-expedition-eta', this.formatClock(operation.remainingMs));
    this.width('v3-expedition-bar', operation.progress);
  }

  private updateAnalytics(
    inventory: InventorySummary,
    rate: number,
    operations: OperationProjection[],
    efficiency: number,
    saturation: number,
    threat: number,
    selected: GatheringZoneDefinition,
  ): void {
    const netWorth = this.state.coins + inventory.value;
    this.text('v3-yield-current', `${operations.reduce((sum, operation) => sum + operation.unitsPerMinute, 0).toFixed(1)} /m`);
    this.text('v3-net-worth', `${netWorth.toLocaleString()}c`);
    this.text('v3-production-rate', `${Math.round(rate).toLocaleString()}c /m`);
    this.text('v3-active-operations', `${operations.length} OPS`);
    this.text('v3-efficiency', `${Math.round(efficiency)}%`);
    this.text('v3-efficiency-label', efficiency >= 90 ? 'EXCELLENT' : efficiency >= 72 ? 'STABLE' : 'STRAINED');
    this.text('v3-saturation', `${Math.round(saturation)}% SATURATION`);
    this.text('v3-threat', `${Math.round(threat)}%`);
    this.text('v3-threat-label', this.threatLabel(threat));
    this.text('v3-anomaly-tier', selected.tier >= 3 ? `TIER ${selected.tier}` : 'NOMINAL');
    this.gauge('v3-efficiency-gauge', efficiency);
    this.gauge('v3-threat-gauge', threat);

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const yieldDelta = first && last ? this.percentDelta(first.gathered, last.gathered) : 0;
    const valueDelta = first && last ? this.percentDelta(first.netWorth, last.netWorth) : 0;
    this.text('v3-yield-delta', `${yieldDelta >= 0 ? '+' : ''}${yieldDelta.toFixed(1)}%`);
    this.text('v3-value-delta', `${valueDelta >= 0 ? '+' : ''}${valueDelta.toFixed(1)}%`);
    this.polyline('v3-yield-line', this.samples.map((sample) => sample.gathered));
    this.polyline('v3-value-line', this.samples.map((sample) => sample.netWorth));
    this.updateProductionBars(rate);
  }

  private applyPrimary(recommendation: { mode: PrimaryMode; label: string; copy: string }): void {
    const buttons = [
      this.overlay.querySelector<HTMLButtonElement>('#v3-primary-command'),
      this.rightPanel.querySelector<HTMLButtonElement>('#v3-recommendation-action'),
    ];
    buttons.forEach((button) => {
      if (!button) return;
      button.dataset.v3PrimaryMode = recommendation.mode;
      button.textContent = recommendation.label;
    });
    this.text('v3-recommendation-copy', recommendation.copy);
  }

  private primaryRecommendation(inventory: InventorySummary, operations: OperationProjection[], saturation: number): { mode: PrimaryMode; label: string; copy: string } {
    const load = this.store.inventoryLoadPercent();
    const repairCost = toolIds.reduce((sum, tool) => sum + this.store.toolRepairCost(tool), 0);
    if (load >= 85 && inventory.value > 0) return { mode: 'sell', label: 'LIQUIDATE CARGO', copy: `Storage is ${Math.round(load)}% full. Convert cargo into spendable capital before another operation returns.` };
    if (toolIds.some((tool) => this.state.toolDurability[tool] < 40) && repairCost <= this.state.coins) return { mode: 'repair', label: 'REPAIR EQUIPMENT', copy: 'Low tool condition is reducing field performance. Complete maintenance before the next manual harvest.' };
    if (!operations.length) return { mode: 'network', label: 'DEPLOY A TEAM', copy: 'No automated extraction stream is active. Assign an available gatherer to an unlocked route.' };
    if (saturation >= 75) return { mode: 'network', label: 'ROTATE ROUTES', copy: 'Biome saturation is reducing output. Move a team to a lower-pressure route or biome.' };
    return { mode: 'field', label: 'ENTER FIELD OPERATION', copy: 'Network conditions are stable. Join the active biome for direct harvesting and discovery momentum.' };
  }

  private resolveSelectedZone(zones: GatheringZoneDefinition[], operations: OperationProjection[]): GatheringZoneDefinition {
    const selected = this.selectedZoneId ? zones.find((zone) => zone.id === this.selectedZoneId) : undefined;
    const active = operations.find((operation) => operation.zone.biomeId === this.state.currentBiome)?.zone;
    const fallback = zones.find((zone) => this.state.network.unlockedZones.includes(zone.id)) ?? zones[0];
    const resolved = selected ?? active ?? fallback;
    if (!resolved) throw new Error(`Biome ${this.state.currentBiome} has no command zones.`);
    this.selectedZoneId = resolved.id;
    return resolved;
  }

  private operationProjections(): OperationProjection[] {
    const now = Date.now();
    return this.state.network.gatherers.flatMap((gatherer) => {
      if (!gatherer.assignedZoneId) return [];
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) return [];
      const duration = this.store.automationCycleDuration(gatherer, zone);
      const elapsed = Math.max(0, now - (gatherer.lastCycleAt ?? now));
      const cycleElapsed = elapsed % duration;
      const progress = duration > 0 ? (cycleElapsed / duration) * 100 : 0;
      const remainingMs = Math.max(0, duration - cycleElapsed);
      const expected = this.store.projectedCycleUnits(gatherer, zone);
      const unitsPerMinute = expected * (60_000 / Math.max(1, duration));
      const valuePerMinute = unitsPerMinute * this.averageZoneValue(zone);
      return [{ gatherer, zone, progress, remainingMs, unitsPerMinute, valuePerMinute }];
    });
  }

  private inventorySummary(): InventorySummary {
    let units = 0;
    let value = 0;
    for (const [key, amount] of Object.entries(this.state.inventory)) {
      if (amount <= 0) continue;
      const { resourceId, quality } = parseInventoryKey(key);
      const resource = allResources[resourceId];
      if (!resource) continue;
      units += amount;
      value += Math.floor(amount * resource.value * qualityDefinitions[quality].valueMultiplier);
    }
    return { units, value };
  }

  private averageZoneValue(zone: GatheringZoneDefinition): number {
    const values = zone.resources.map((id) => allResources[id]?.value).filter((value): value is number => typeof value === 'number');
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  private efficiencyScore(saturation: number): number {
    const gatherers = this.state.network.gatherers;
    const fatigue = gatherers.length ? gatherers.reduce((sum, gatherer) => sum + gatherer.fatigue, 0) / gatherers.length : 0;
    const toolCondition = toolIds.reduce((sum, tool) => sum + this.state.toolDurability[tool], 0) / toolIds.length;
    return this.clamp(106 - saturation * 0.28 - fatigue * 0.18 - (100 - toolCondition) * 0.2, 38, 100);
  }

  private threatScore(zone: GatheringZoneDefinition, saturation: number): number {
    return this.clamp(dangerScore[zone.danger] + Math.max(0, saturation - 55) * 0.35 + (100 - zone.stability) * 0.18, 0, 100);
  }

  private environmentProfile(biomeId: BiomeId): EnvironmentProfile {
    const hour = new Date().getHours();
    const light = hour < 6 ? 'Night' : hour < 11 ? 'Morning' : hour < 17 ? 'Daylight' : hour < 21 ? 'Dusk' : 'Night';
    const profiles: Record<BiomeId, Omit<EnvironmentProfile, 'light'>> = {
      greenveil: { weather: 'Clear Canopy', temperature: '18°C', wind: '8 km/h', stability: 'Stable' },
      ironfall: { weather: 'Mineral Haze', temperature: '27°C', wind: '14 km/h', stability: 'Variable' },
      'crystal-vale': { weather: 'Lumen Mist', temperature: '9°C', wind: '11 km/h', stability: 'Resonant' },
      emberdeep: { weather: 'Ash Drift', temperature: '41°C', wind: '4 km/h', stability: 'Volatile' },
    };
    return { ...profiles[biomeId], light };
  }

  private recordSample(): void {
    const inventory = this.inventorySummary();
    const operations = this.operationProjections();
    const rate = operations.reduce((sum, operation) => sum + operation.valuePerMinute, 0);
    this.samples.push({ at: Date.now(), gathered: this.state.totals.gathered, netWorth: this.state.coins + inventory.value, rate });
    this.samples = this.samples.slice(-60);
  }

  private updateProductionBars(rate: number): void {
    const bars = this.bottomPanel.querySelectorAll<HTMLElement>('[data-v3-production-bar]');
    bars.forEach((bar, index) => {
      const phase = (Date.now() / 1000 + index * 0.72) % 8;
      const modulation = 0.45 + Math.abs(Math.sin(phase)) * 0.55;
      const normalized = rate <= 0 ? 8 : this.clamp(20 + modulation * 75, 8, 100);
      bar.style.setProperty('--bar-height', `${normalized}%`);
    });
  }

  private polyline(id: string, values: number[]): void {
    const line = this.bottomPanel.querySelector<SVGPolylineElement>(`#${id}`);
    if (!line) return;
    if (values.length < 2) {
      line.setAttribute('points', '0,72 300,72');
      return;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const points = values.map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 300;
      const y = 72 - ((value - min) / range) * 56;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    line.setAttribute('points', points);
  }

  private gauge(id: string, value: number): void {
    this.bottomPanel.querySelector<HTMLElement>(`#${id}`)?.style.setProperty('--gauge-angle', `${this.clamp(value, 0, 100) * 3.6}deg`);
  }

  private text(id: string, value: string): void {
    const target = document.getElementById(id);
    if (target && target.textContent !== value) target.textContent = value;
  }

  private width(id: string, value: number): void {
    const target = document.getElementById(id);
    if (target) target.style.width = `${this.clamp(value, 0, 100).toFixed(1)}%`;
  }

  private percentDelta(start: number, end: number): number {
    if (start <= 0) return end > 0 ? 100 : 0;
    return ((end - start) / start) * 100;
  }

  private coordinatesFor(biomeId: BiomeId): string {
    const values: Record<BiomeId, string> = {
      greenveil: 'NETWORK COORDINATES · X 14.2 / Y 87.3',
      ironfall: 'NETWORK COORDINATES · X 48.6 / Y 31.8',
      'crystal-vale': 'NETWORK COORDINATES · X 72.1 / Y 68.4',
      emberdeep: 'NETWORK COORDINATES · X 91.7 / Y 12.6',
    };
    return values[biomeId];
  }

  private ecologyLabel(value: number): string {
    if (value >= 82) return 'DEPLETED';
    if (value >= 65) return 'HEAVY';
    if (value >= 35) return 'ACTIVE';
    return 'OPTIMAL';
  }

  private threatLabel(value: number): string {
    if (value >= 80) return 'EXTREME';
    if (value >= 55) return 'HIGH';
    if (value >= 28) return 'MODERATE';
    return 'LOW';
  }

  private formatClock(milliseconds: number): string {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
