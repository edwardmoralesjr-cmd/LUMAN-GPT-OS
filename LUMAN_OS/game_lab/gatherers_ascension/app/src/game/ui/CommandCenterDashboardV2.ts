import {
  allResources,
  biomes,
  parseInventoryKey,
  toolNames,
  type BiomeId,
  type ResourceDefinition,
  type ToolId,
} from '../data/content';
import { gatheringZones, zonesByBiome, type GatheringZoneDefinition } from '../data/network';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState } from '../state/GameState';

type RouteMode = 'resources' | 'rare' | 'speed' | 'safety' | 'value' | 'experience';
type CommandView = 'dashboard' | 'field' | 'network' | 'gatherers' | 'codex' | 'market';

interface EnvironmentProfile {
  weather: string;
  temperature: number;
  wind: number;
  time: string;
  season: string;
  visibility: string;
  instability: number;
  effects: Array<{ label: string; value: string; positive: boolean }>;
}

interface RouteProjection {
  zone: GatheringZoneDefinition;
  distance: number;
  minutes: number;
  expectedUnits: number;
  marketValue: number;
  rarityScore: number;
  durabilityCost: number;
  energyCost: number;
  danger: number;
}

const biomeOrder: readonly BiomeId[] = ['greenveil', 'ironfall', 'crystal-vale', 'emberdeep'];
const routeLabels: Record<RouteMode, string> = {
  resources: 'Maximum Resources',
  rare: 'Rare Discovery',
  speed: 'Fastest Route',
  safety: 'Safest Route',
  value: 'Highest Market Value',
  experience: 'Maximum Experience',
};
const nodePositions: ReadonlyArray<readonly [number, number]> = [
  [20, 31], [49, 20], [74, 37], [32, 68], [67, 72], [85, 58],
];

export class CommandCenterDashboardV2 {
  private state: Readonly<GameState>;
  private active = true;
  private routeMode: RouteMode = 'value';
  private selectedZoneId: string | null = null;
  private scanBoostUntil = 0;
  private unsubscribe: (() => void) | null = null;
  private refreshTimer: number | null = null;

  constructor(private store: GameStore) {
    this.state = store.snapshot;
  }

  initialize(): void {
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.active = tab.dataset.view === 'dashboard';
        if (this.active) queueMicrotask(() => this.render());
      });
    });
    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type !== 'state') return;
      this.state = event.state;
      if (this.active) queueMicrotask(() => this.render());
    });
    this.active = document.querySelector<HTMLButtonElement>('.command-tab.active')?.dataset.view === 'dashboard';
    this.refreshTimer = window.setInterval(() => {
      if (this.active) this.render();
    }, 2_000);
    if (this.active) queueMicrotask(() => this.render());
  }

  destroy(): void {
    this.unsubscribe?.();
    if (this.refreshTimer !== null) window.clearInterval(this.refreshTimer);
  }

  private render(): void {
    if (!this.active) return;
    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    const left = document.querySelector<HTMLElement>('#left-panel-content');
    const right = document.querySelector<HTMLElement>('#right-panel-content');
    const bottom = document.querySelector<HTMLElement>('#bottom-panel-content');
    const kicker = document.querySelector<HTMLElement>('#operation-kicker');
    const title = document.querySelector<HTMLElement>('#operation-title');
    const subtitle = document.querySelector<HTMLElement>('#operation-subtitle');
    if (!overlay || !left || !right || !bottom || !kicker || !title || !subtitle) return;
    const biome = biomes[this.state.currentBiome];
    const zones = zonesByBiome(this.state.currentBiome);
    if (!biome || !zones.length) return;
    const selected = this.resolveSelectedZone(zones);
    const environment = this.environmentProfile(this.state.currentBiome);
    const saturation = this.biomeSaturation(zones);
    const efficiency = this.harvestEfficiency(selected, environment, saturation);
    const threat = this.threatLevel(selected, environment, saturation);
    const projection = this.routeProjection(selected, efficiency, threat);
    kicker.textContent = 'WORLDROOT TACTICAL COMMAND CENTER';
    title.textContent = biome.name;
    subtitle.textContent = `${biome.subtitle}. Live route, environment, expedition, and production intelligence are synchronized.`;
    overlay.classList.add('visible');
    overlay.innerHTML = this.centralCommandMap(zones, selected, projection, environment, saturation, efficiency, threat);
    left.innerHTML = this.biomeIntelligencePanel(environment, saturation, zones);
    right.innerHTML = this.operationsPanel(projection, efficiency, threat);
    bottom.innerHTML = this.bottomIntelligenceDeck(projection, zones, environment);
    this.bindActions(overlay, right, bottom);
  }

  private centralCommandMap(zones: GatheringZoneDefinition[], selected: GatheringZoneDefinition, projection: RouteProjection, environment: EnvironmentProfile, saturation: number, efficiency: number, threat: number): string {
    const mapNodes = zones.map((zone, index) => this.mapNode(zone, index, selected.id)).join('');
    const routePath = this.routePath(zones, selected.id);
    const scanActive = Date.now() < this.scanBoostUntil;
    const activeGatherers = this.activeGatherersInBiome(this.state.currentBiome);
    const unknownCount = selected.resources.filter((id) => !this.state.discovered.includes(id)).length;
    return `<div class="command-v2-shell">
      <section class="tactical-map-card">
        <div class="tactical-map-head">
          <div><span>TACTICAL BIOME MAP</span><strong>${this.escape(biomes[this.state.currentBiome]?.name ?? this.state.currentBiome)}</strong><small>${activeGatherers.length} deployed · ${zones.length} gathering zones · ${unknownCount} unidentified signals on route</small></div>
          <div class="map-head-metrics"><div><span>EFFICIENCY</span><strong>${efficiency}%</strong></div><div><span>THREAT</span><strong>${threat}%</strong></div><div><span>SATURATION</span><strong>${saturation}%</strong></div></div>
        </div>
        <div class="tactical-map-surface biome-${this.state.currentBiome}">
          <div class="map-contour contour-a"></div><div class="map-contour contour-b"></div><div class="map-contour contour-c"></div>
          <div class="map-grid-lines"></div><div class="map-radar-core"></div><div class="map-scan ${scanActive ? 'boosted' : ''}"></div>
          <svg class="route-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${routePath}"/></svg>
          ${mapNodes}
          <div class="map-route-summary"><span>ACTIVE ROUTE · ${routeLabels[this.routeMode].toUpperCase()}</span><strong>${this.escape(selected.name)}</strong><small>${projection.distance.toFixed(1)} km · ${projection.minutes} min · ${projection.expectedUnits} units · ${projection.marketValue.toLocaleString()}c</small></div>
          <div class="environment-float"><span>${environment.weather.toUpperCase()}</span><strong>${environment.temperature}°C</strong><small>${environment.wind} km/h wind · ${environment.visibility}</small></div>
        </div>
        <div class="map-overlay-tabs">
          ${(['resources', 'rare', 'speed', 'safety', 'value', 'experience'] as RouteMode[]).map((mode) => `<button class="map-overlay-button ${this.routeMode === mode ? 'active' : ''}" data-route-mode="${mode}">${routeLabels[mode]}</button>`).join('')}
        </div>
      </section>
      <section class="command-v2-summary-row">${this.anomalyMonitor()}${this.harvestTrendGraph()}${this.projectedHarvestCard(projection)}</section>
    </div>`;
  }

  private biomeIntelligencePanel(environment: EnvironmentProfile, saturation: number, zones: GatheringZoneDefinition[]): string {
    const biome = biomes[this.state.currentBiome];
    if (!biome) return '';
    const biomeIndex = Math.max(0, biomeOrder.indexOf(this.state.currentBiome));
    const biomeLevel = Math.max(1, this.state.network.level + biomeIndex * 2 + Math.floor(this.state.network.expeditionsCompleted / 24));
    const biomeXpNeed = 180 + biomeLevel * 115;
    const biomeXp = (this.state.totals.gathered + this.state.network.totalAutomatedGathered + biomeIndex * 67) % biomeXpNeed;
    const unlocked = zones.filter((zone) => this.state.network.unlockedZones.includes(zone.id)).length;
    const saturationState = saturation < 35 ? 'OPTIMAL' : saturation < 65 ? 'ACTIVE' : saturation < 82 ? 'HEAVY' : 'DEPLETED';
    const recoveryMinutes = Math.max(2, Math.ceil(saturation * 0.7));
    return `<section class="telemetry-card biome-intelligence-card"><div class="biome-identity-row"><div class="biome-command-icon">${this.biomeIcon(this.state.currentBiome)}</div><div><span class="metric-caption">BIOME INTELLIGENCE</span><h3>${this.escape(biome.name)}</h3><p>${this.escape(biome.subtitle)}</p></div></div><div class="metric-row"><span class="metric-label">Biome Level</span><span class="metric-value green">${biomeLevel}</span></div><div class="command-progress" style="--progress:${Math.round((biomeXp / biomeXpNeed) * 100)}%"><span></span></div><div class="metric-caption">${biomeXp} / ${biomeXpNeed} biome XP · ${unlocked}/${zones.length} zones connected</div></section>
    <section class="telemetry-card saturation-card"><h3 class="panel-title">Biome Saturation</h3>${this.ringGauge(saturation, saturationState, saturation >= 75 ? 'warning' : 'green')}<div class="metric-row"><span class="metric-label">Recovery Window</span><span class="metric-value">${recoveryMinutes}m</span></div><div class="metric-row"><span class="metric-label">Player Teams</span><span class="metric-value green">${this.activeGatherersInBiome(this.state.currentBiome).length}</span></div><div class="metric-row"><span class="metric-label">Ecology Pressure</span><span class="metric-value ${saturation >= 75 ? 'gold' : ''}">${saturationState}</span></div></section>
    <section class="telemetry-card"><h3 class="panel-title">Environmental Conditions</h3>${this.conditionRow('Weather', environment.weather)}${this.conditionRow('Temperature', `${environment.temperature}°C`)}${this.conditionRow('Wind', `${environment.wind} km/h`)}${this.conditionRow('Time / Season', `${environment.time} · ${environment.season}`)}${this.conditionRow('Visibility', environment.visibility)}${this.conditionRow('Instability', `${environment.instability}%`)}</section>
    <section class="telemetry-card"><h3 class="panel-title">Biome Effects</h3>${environment.effects.map((effect) => `<div class="metric-row"><span class="metric-label">${this.escape(effect.label)}</span><span class="metric-value ${effect.positive ? 'green' : 'gold'}">${this.escape(effect.value)}</span></div>`).join('')}</section>`;
  }

  private operationsPanel(projection: RouteProjection, efficiency: number, threat: number): string {
    const active = this.activeGatherersInBiome(this.state.currentBiome);
    const idle = this.state.network.gatherers.filter((gatherer) => !gatherer.assignedZoneId);
    return `<section class="telemetry-card"><h3 class="panel-title">Harvest Efficiency</h3>${this.ringGauge(efficiency, 'EFFICIENT', 'green')}<div class="metric-row"><span class="metric-label">Estimated Yield / Min</span><span class="metric-value green">${Math.max(1, Math.round(projection.expectedUnits / Math.max(1, projection.minutes)))}</span></div><div class="metric-row"><span class="metric-label">Travel Efficiency</span><span class="metric-value">${Math.max(45, 100 - Math.round(projection.distance * 5))}%</span></div><div class="metric-row"><span class="metric-label">Idle Gatherers</span><span class="metric-value">${idle.length}</span></div></section>
    <section class="telemetry-card threat-monitor"><h3 class="panel-title">Threat Monitoring</h3>${this.ringGauge(threat, this.threatLabel(threat), threat >= 60 ? 'warning' : 'green')}<div class="metric-row"><span class="metric-label">Zone Risk</span><span class="metric-value gold">${projection.zone.danger}</span></div><div class="metric-row"><span class="metric-label">Stability</span><span class="metric-value green">${projection.zone.stability}%</span></div><div class="metric-row"><span class="metric-label">Energy Exposure</span><span class="metric-value">${projection.energyCost}</span></div></section>
    <section class="telemetry-card route-optimizer-card"><h3 class="panel-title">Route Optimizer</h3><div class="route-target-name"><span>${routeLabels[this.routeMode]}</span><strong>${this.escape(projection.zone.name)}</strong><p>${this.escape(projection.zone.description)}</p></div>${this.conditionRow('Distance', `${projection.distance.toFixed(1)} km`)}${this.conditionRow('Completion', `${projection.minutes} min`)}${this.conditionRow('Expected Yield', `${projection.expectedUnits} units`)}${this.conditionRow('Expected Value', `${projection.marketValue.toLocaleString()}c`)}${this.conditionRow('Durability Cost', `${projection.durabilityCost}%`)}${this.conditionRow('Rare Potential', `${projection.rarityScore}%`)}</section>
    <section class="telemetry-card"><h3 class="panel-title">Quick Actions</h3><div class="quick-action-grid"><button data-command-view="field">Enter Field</button><button data-command-view="network">Deploy Teams</button><button data-command-scan>Activate Scan</button><button data-command-view="market">Repair / Upgrade</button><button data-command-view="codex">Open Codex</button><button data-command-view="gatherers">Roster</button></div><div class="metric-caption">${active.length} active expedition${active.length === 1 ? '' : 's'} in this biome</div></section>`;
  }

  private bottomIntelligenceDeck(projection: RouteProjection, zones: GatheringZoneDefinition[], environment: EnvironmentProfile): string {
    return `<section class="command-deck-card tool-condition-deck"><h3>Tool & Equipment Status</h3>${this.toolConditionRows()}</section><section class="command-deck-card"><h3>Resource Respawn Intelligence</h3>${this.respawnRows(projection.zone)}</section><section class="command-deck-card"><h3>Expedition Clock</h3>${this.expeditionClock(zones)}<div class="metric-row"><span class="metric-label">Expedition Bonus</span><span class="metric-value green">+${Math.min(35, this.state.network.level + this.activeGatherersInBiome(this.state.currentBiome).length * 3)}% yield</span></div><div class="metric-row"><span class="metric-label">Extraction Window</span><span class="metric-value">${environment.time}</span></div></section><section class="command-deck-card avatar-status-deck"><h3>Commander Status</h3><div class="commander-avatar"><span>${this.biomeIcon(this.state.currentBiome)}</span><div><strong>${this.escape(this.state.playerName)}</strong><small>Worldroot Commander · Level ${this.state.level}</small></div></div><div class="metric-row"><span class="metric-label">Reputation Rank</span><span class="metric-value gold">${this.commandRank()}</span></div><div class="metric-row"><span class="metric-label">Network Level</span><span class="metric-value green">${this.state.network.level}</span></div></section><section class="command-deck-card currency-deck"><h3>Resource Currency Matrix</h3>${this.currencyBar()}</section>`;
  }

  private mapNode(zone: GatheringZoneDefinition, index: number, selectedId: string): string {
    const position = nodePositions[index % nodePositions.length] ?? [50, 50];
    const unlocked = this.state.network.unlockedZones.includes(zone.id);
    const assigned = this.state.network.gatherers.find((gatherer) => gatherer.assignedZoneId === zone.id);
    const unknown = zone.resources.some((id) => !this.state.discovered.includes(id));
    const selected = zone.id === selectedId;
    return `<button class="tactical-node ${unlocked ? '' : 'locked'} ${assigned ? 'active-operation' : ''} ${unknown ? 'unknown-signal' : ''} ${selected ? 'selected' : ''}" style="left:${position[0]}%;top:${position[1]}%;--node-accent:${zone.accent}" data-route-zone="${zone.id}" ${unlocked ? '' : 'disabled'}><span class="node-pulse"></span><span class="node-core">${unknown ? '?' : this.zoneIcon(zone)}</span><strong>${this.escape(zone.name)}</strong><small>${this.zoneRarity(zone)} · T${zone.tier}${assigned ? ` · ${this.escape(assigned.name)}` : ''}</small></button>`;
  }

  private routePath(zones: GatheringZoneDefinition[], selectedId: string): string {
    const unlocked = zones.filter((zone) => this.state.network.unlockedZones.includes(zone.id));
    const ordered = [...unlocked].sort((a, b) => this.routeScore(b) - this.routeScore(a));
    const selectedIndex = zones.findIndex((zone) => zone.id === selectedId);
    const selectedPosition = nodePositions[selectedIndex % nodePositions.length] ?? [50, 50];
    const points: Array<readonly [number, number]> = [[50, 50]];
    ordered.slice(0, 2).forEach((zone) => {
      const index = zones.findIndex((item) => item.id === zone.id);
      const point = nodePositions[index % nodePositions.length];
      if (point) points.push(point);
    });
    points.push(selectedPosition);
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ');
  }

  private routeProjection(zone: GatheringZoneDefinition, efficiency: number, threat: number): RouteProjection {
    const assigned = this.state.network.gatherers.find((gatherer) => gatherer.assignedZoneId === zone.id);
    const gathererEfficiency = assigned?.efficiency ?? this.averageGathererEfficiency();
    const modeYield = this.routeMode === 'resources' ? 1.28 : this.routeMode === 'speed' ? 0.85 : this.routeMode === 'value' ? 1.08 : 1;
    const modeTime = this.routeMode === 'speed' ? 0.72 : this.routeMode === 'safety' ? 1.18 : 1;
    const minutes = Math.max(1, Math.round((zone.durationSeconds / 12) * modeTime + zone.tier * 1.5));
    const expectedUnits = Math.max(1, Math.round(zone.baseYield * gathererEfficiency * (efficiency / 58) * modeYield * 5));
    const definitions = zone.resources.map((id) => allResources[id]).filter((item): item is ResourceDefinition => Boolean(item));
    const averageValue = definitions.length ? definitions.reduce((sum, item) => sum + item.value, 0) / definitions.length : 1;
    const valueModifier = this.routeMode === 'value' ? 1.35 : this.routeMode === 'rare' ? 1.16 : 1;
    return { zone, distance: Math.max(0.8, Number((zone.tier * 0.9 + (100 - zone.stability) / 25 + 0.6).toFixed(1))), minutes, expectedUnits, marketValue: Math.round(expectedUnits * averageValue * valueModifier), rarityScore: Math.min(99, Math.round((zone.rarityBonus * 1000 + this.state.stats.fortune * 1.2 + (this.routeMode === 'rare' ? 18 : 0)) * 10) / 10), durabilityCost: Math.min(35, Math.max(2, Math.round(zone.tier * 2.4 + threat * 0.08))), energyCost: Math.max(1, Math.round(zone.tier * 8 + minutes * 1.5)), danger: threat };
  }

  private environmentProfile(biomeId: BiomeId): EnvironmentProfile {
    const hour = new Date().getHours();
    const time = hour < 6 ? 'Night' : hour < 10 ? 'Dawn' : hour < 17 ? 'Daylight' : hour < 21 ? 'Dusk' : 'Night';
    const profiles: Record<BiomeId, Omit<EnvironmentProfile, 'time'>> = {
      greenveil: { weather: hour % 3 === 0 ? 'Light Rain' : 'Clear Canopy', temperature: 18, wind: 8, season: 'Verdant Rise', visibility: 'Excellent', instability: 14, effects: [{ label: 'Gathering Speed', value: '+18%', positive: true }, { label: 'Resource Respawn', value: '-12%', positive: true }, { label: 'Rare Detection', value: '+4%', positive: true }, { label: 'Tool Wear', value: '+1%', positive: false }] },
      ironfall: { weather: 'Mineral Dust', temperature: 24, wind: 16, season: 'Emberwane', visibility: 'Moderate', instability: 31, effects: [{ label: 'Ore Yield', value: '+22%', positive: true }, { label: 'Critical Harvest', value: '+7%', positive: true }, { label: 'Movement Speed', value: '-6%', positive: false }, { label: 'Tool Wear', value: '+9%', positive: false }] },
      'crystal-vale': { weather: 'Luminous Mist', temperature: 9, wind: 5, season: 'Starfall', visibility: 'Variable', instability: 58, effects: [{ label: 'Quality Chance', value: '+15%', positive: true }, { label: 'Mutation Chance', value: '+8%', positive: true }, { label: 'Scan Range', value: '+12%', positive: true }, { label: 'Energy Drain', value: '+5%', positive: false }] },
      emberdeep: { weather: 'Ash Drift', temperature: 41, wind: 11, season: 'Archive Heat', visibility: 'Low', instability: 76, effects: [{ label: 'Relic Value', value: '+28%', positive: true }, { label: 'Mastery XP', value: '+18%', positive: true }, { label: 'Threat Exposure', value: '+14%', positive: false }, { label: 'Tool Wear', value: '+12%', positive: false }] },
    };
    return { ...profiles[biomeId], time };
  }

  private biomeSaturation(zones: GatheringZoneDefinition[]): number {
    const active = this.activeGatherersInBiome(this.state.currentBiome).length;
    const pressure = active * 17 + (this.state.network.totalAutomatedGathered % 90) * 0.18 + zones.filter((zone) => this.state.network.unlockedZones.includes(zone.id)).length * 4;
    return this.clamp(Math.round(12 + pressure), 8, 94);
  }

  private harvestEfficiency(zone: GatheringZoneDefinition, environment: EnvironmentProfile, saturation: number): number {
    const gatherer = this.state.network.gatherers.find((item) => item.assignedZoneId === zone.id);
    const gathererScore = (gatherer?.efficiency ?? this.averageGathererEfficiency()) * 42;
    const gearScore = Object.values(this.state.gear).reduce((sum, value) => sum + value, 0) * 1.2;
    return this.clamp(Math.round(gathererScore + zone.stability * 0.38 + gearScore + environment.effects.filter((effect) => effect.positive).length * 3 - saturation * 0.24), 35, 98);
  }

  private threatLevel(zone: GatheringZoneDefinition, environment: EnvironmentProfile, saturation: number): number {
    const riskBase: Record<GatheringZoneDefinition['danger'], number> = { Low: 10, Moderate: 28, High: 53, Extreme: 78 };
    const endurance = this.state.network.gatherers.find((item) => item.assignedZoneId === zone.id)?.endurance ?? 6;
    return this.clamp(Math.round(riskBase[zone.danger] + environment.instability * 0.18 + saturation * 0.12 - endurance * 0.8), 4, 96);
  }

  private resolveSelectedZone(zones: GatheringZoneDefinition[]): GatheringZoneDefinition {
    const available = zones.filter((zone) => this.state.network.unlockedZones.includes(zone.id));
    const active = zones.find((zone) => this.state.network.gatherers.some((gatherer) => gatherer.assignedZoneId === zone.id));
    const selected = zones.find((zone) => zone.id === this.selectedZoneId && this.state.network.unlockedZones.includes(zone.id));
    const result = selected ?? active ?? available[0] ?? zones[0];
    if (!result) throw new Error('Current biome has no gathering zones.');
    this.selectedZoneId = result.id;
    return result;
  }

  private projectedHarvestCard(projection: RouteProjection): string {
    const definitions = projection.zone.resources.map((id) => allResources[id]).filter((item): item is ResourceDefinition => Boolean(item));
    return `<article class="command-v2-mini-card projected-card"><h3>Projected Harvest</h3>${definitions.map((definition, index) => `<div><span><i style="--resource:${this.hex(definition.glow)}"></i>${this.escape(definition.name)}</span><strong>${Math.max(1, Math.round(projection.expectedUnits * (0.48 - index * 0.08)))}</strong></div>`).join('')}<footer><span>Market estimate</span><strong>${projection.marketValue.toLocaleString()}c</strong></footer></article>`;
  }

  private anomalyMonitor(): string {
    const pulse = this.clamp(Math.round(48 + Math.sin(Date.now() / 11_000) * 24 + this.state.rareMomentum * 0.05), 8, 96);
    const points = Array.from({ length: 12 }, (_, index) => 70 - (Math.sin(index * 0.8 + Date.now() / 14_000) * 20 + (index % 3) * 4));
    const path = points.map((value, index) => `${index === 0 ? 'M' : 'L'} ${index * 9} ${value}`).join(' ');
    return `<article class="command-v2-mini-card anomaly-card"><h3>Anomaly Pulse Monitor</h3><svg viewBox="0 0 100 90" preserveAspectRatio="none"><path d="${path}"/></svg><div><span>Instability waveform</span><strong>${pulse}%</strong></div><small>${pulse >= 72 ? 'Rare event formation likely' : 'Worldroot signal remains within monitored range'}</small></article>`;
  }

  private harvestTrendGraph(): string {
    const base = Math.max(8, this.state.totals.gathered % 48);
    const values = Array.from({ length: 14 }, (_, index) => 76 - this.clamp(base + Math.sin(index * 0.9) * 13 + index * 1.7, 5, 68));
    const path = values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${index * 7.7} ${value}`).join(' ');
    const change = Math.max(2, Math.min(38, Math.round(this.state.network.level * 1.8 + this.state.tools.axe * 0.8)));
    return `<article class="command-v2-mini-card trend-card"><h3>Harvest Trend</h3><svg viewBox="0 0 100 90" preserveAspectRatio="none"><path d="${path}"/></svg><div><span>Current operation trend</span><strong>+${change}%</strong></div><small>Improved by route intelligence, equipment, and network mastery</small></article>`;
  }

  private toolConditionRows(): string {
    const icons: Record<ToolId, string> = { axe: '⚒', pickaxe: '⛏', sickle: '☾', gloves: '◇' };
    return (Object.keys(toolNames) as ToolId[]).map((tool, index) => {
      const level = this.state.tools[tool];
      const condition = this.clamp(97 - ((this.state.totals.gathered + index * 13) % Math.max(12, 25 + level * 3)), 58, 99);
      return `<div class="tool-condition-row"><div class="tool-mini-art">${icons[tool]}</div><div><strong>${toolNames[tool]}</strong><span>Lv ${level} · ${condition}% condition</span><div class="mini-condition-bar" style="--condition:${condition}%"><i></i></div></div></div>`;
    }).join('');
  }

  private respawnRows(zone: GatheringZoneDefinition): string {
    const now = Math.floor(Date.now() / 1000);
    return zone.resources.map((id, index) => {
      const definition = allResources[id];
      if (!definition) return '';
      const cycle = 82 + zone.tier * 23 + index * 41;
      const remaining = cycle - (now % cycle);
      return `<div class="metric-row"><span class="metric-label">${this.escape(definition.name)}</span><span class="metric-value ${remaining < 20 ? 'green' : ''}">${this.formatDuration(remaining)}</span></div>`;
    }).join('');
  }

  private expeditionClock(zones: GatheringZoneDefinition[]): string {
    const active = this.activeGatherersInBiome(this.state.currentBiome);
    if (!active.length) return '<div class="empty-state">No active biome expedition. Deploy a gatherer to begin live timing.</div>';
    const oldest = Math.min(...active.map((gatherer) => gatherer.lastCycleAt ?? Date.now()));
    const elapsed = Math.max(0, Math.floor((Date.now() - oldest) / 1000));
    const activeZones = new Set(active.map((gatherer) => gatherer.assignedZoneId).filter(Boolean));
    return `<div class="expedition-clock"><strong>${this.formatLongDuration(elapsed)}</strong><span>ACTIVE EXPEDITION TIME</span></div><div class="metric-row"><span class="metric-label">Gatherers Active</span><span class="metric-value green">${active.length}</span></div><div class="metric-row"><span class="metric-label">Zones Operating</span><span class="metric-value">${Math.min(zones.length, activeZones.size)}</span></div>`;
  }

  private currencyBar(): string {
    const relicUnits = Object.entries(this.state.inventory).reduce((sum, [key, amount]) => {
      const { resourceId } = parseInventoryKey(key);
      return sum + (allResources[resourceId]?.nativeBiome === 'emberdeep' ? amount : 0);
    }, 0);
    const currencies = [['Silver', this.state.coins, 'Spendable currency'], ['Verdant Shards', Math.floor(this.state.totals.gathered / 25), 'Biome growth currency'], ['Resonant Dust', this.state.totals.perfectedFinds * 3 + this.state.totals.rareFinds, 'Quality refinement'], ['Memory Fragments', this.state.discovered.length * 2 + this.state.totals.variantsFound * 5, 'Codex research'], ['Research Points', this.state.network.level * 4 + this.state.network.commandPoints, 'System development'], ['Upgrade Cores', Math.floor(this.state.totals.rareFinds / 3) + this.state.totals.variantsFound, 'Elite equipment'], ['Relic Energy', relicUnits, 'Ancient technology']] as const;
    return `<div class="currency-matrix">${currencies.map(([name, value, purpose], index) => `<div title="${this.escape(purpose)}"><span class="currency-icon c${index}">◆</span><small>${this.escape(name)}</small><strong>${value.toLocaleString()}</strong></div>`).join('')}</div>`;
  }

  private bindActions(...roots: HTMLElement[]): void {
    roots.forEach((root) => {
      root.querySelectorAll<HTMLButtonElement>('[data-route-zone]').forEach((button) => button.addEventListener('click', () => { this.selectedZoneId = button.dataset.routeZone ?? null; this.render(); }));
      root.querySelectorAll<HTMLButtonElement>('[data-route-mode]').forEach((button) => button.addEventListener('click', () => { const mode = button.dataset.routeMode as RouteMode | undefined; if (!mode || !(mode in routeLabels)) return; this.routeMode = mode; this.selectedZoneId = null; this.render(); }));
      root.querySelectorAll<HTMLButtonElement>('[data-command-view]').forEach((button) => button.addEventListener('click', () => { const view = button.dataset.commandView as CommandView | undefined; if (!view) return; document.querySelector<HTMLButtonElement>(`.command-tab[data-view="${view}"]`)?.click(); }));
      root.querySelector<HTMLButtonElement>('[data-command-scan]')?.addEventListener('click', () => { this.scanBoostUntil = Date.now() + 12_000; this.flashNotice('Scan pulse activated', 'Tactical map resolution increased for twelve seconds.'); this.render(); });
    });
  }

  private routeScore(zone: GatheringZoneDefinition): number {
    if (this.routeMode === 'resources') return zone.baseYield * 8 + zone.tier;
    if (this.routeMode === 'rare') return zone.rarityBonus * 1000 + zone.tier * 2;
    if (this.routeMode === 'speed') return 200 - zone.durationSeconds;
    if (this.routeMode === 'safety') return zone.stability * 2 - this.riskNumber(zone.danger) * 20;
    if (this.routeMode === 'experience') return zone.tier * 20 + zone.baseYield * 3;
    return zone.resources.reduce((sum, id) => sum + (allResources[id]?.value ?? 0), 0) + zone.rarityBonus * 300;
  }

  private averageGathererEfficiency(): number { return this.state.network.gatherers.length ? this.state.network.gatherers.reduce((sum, gatherer) => sum + gatherer.efficiency, 0) / this.state.network.gatherers.length : 1; }
  private activeGatherersInBiome(biomeId: BiomeId): GathererState[] { return this.state.network.gatherers.filter((gatherer) => gatherer.assignedZoneId && gatheringZones[gatherer.assignedZoneId]?.biomeId === biomeId); }
  private zoneRarity(zone: GatheringZoneDefinition): string { if (zone.rarityBonus >= 0.035) return 'RELIC'; if (zone.rarityBonus >= 0.022) return 'LEGENDARY'; if (zone.rarityBonus >= 0.013) return 'EPIC'; if (zone.rarityBonus >= 0.006) return 'RARE'; if (zone.rarityBonus > 0) return 'UNCOMMON'; return 'COMMON'; }
  private zoneIcon(zone: GatheringZoneDefinition): string { return ({ axe: '♧', pickaxe: '◆', sickle: '❧', gloves: '✦' } as Record<ToolId, string>)[zone.specialty]; }
  private biomeIcon(biomeId: BiomeId): string { return ({ greenveil: '♧', ironfall: '◆', 'crystal-vale': '✧', emberdeep: '◈' } as Record<BiomeId, string>)[biomeId]; }
  private ringGauge(value: number, label: string, tone: 'green' | 'warning'): string { return `<div class="command-ring-gauge ${tone}" style="--gauge:${value * 3.6}deg"><div><strong>${value}%</strong><span>${this.escape(label)}</span></div></div>`; }
  private conditionRow(label: string, value: string): string { return `<div class="metric-row"><span class="metric-label">${this.escape(label)}</span><span class="metric-value">${this.escape(value)}</span></div>`; }
  private threatLabel(threat: number): string { return threat >= 80 ? 'EXTREME' : threat >= 60 ? 'HIGH' : threat >= 35 ? 'MODERATE' : 'LOW'; }
  private commandRank(): string { return this.state.level >= 30 ? 'ASCENDANT' : this.state.level >= 20 ? 'PATHFINDER' : this.state.level >= 12 ? 'WARDEN' : this.state.level >= 6 ? 'SPECIALIST' : 'FIELD COMMANDER'; }
  private riskNumber(risk: GatheringZoneDefinition['danger']): number { return ({ Low: 1, Moderate: 2, High: 3, Extreme: 4 } as const)[risk]; }
  private formatDuration(seconds: number): string { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }
  private formatLongDuration(seconds: number): string { const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60); return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  private hex(value: number): string { return `#${value.toString(16).padStart(6, '0')}`; }
  private flashNotice(title: string, message: string): void { const layer = document.querySelector<HTMLElement>('#toast-layer'); if (!layer) return; const toast = document.createElement('div'); toast.className = 'toast'; toast.innerHTML = `<strong>${this.escape(title)}</strong><span>${this.escape(message)}</span>`; layer.append(toast); window.setTimeout(() => toast.remove(), 3200); }
  private clamp(value: number, min: number, max: number): number { return Math.min(max, Math.max(min, value)); }
  private escape(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
}
