import {
  allResources,
  parseInventoryKey,
  qualityDefinitions,
  rareVariants,
  toolNames,
  type ResourceDefinition,
  type ToolId,
} from '../data/content';
import { gatheringZones, type GatheringZoneDefinition } from '../data/network';
import { skillXpForLevel, xpForLevel } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState, NetworkActivity } from '../state/GameState';

interface TelemetrySample {
  at: number;
  gathered: number;
  coinsEarned: number;
  inventoryUnits: number;
  cargoValue: number;
}

interface InventoryItemSummary {
  name: string;
  units: number;
  value: number;
}

interface InventorySummary {
  units: number;
  value: number;
  top: InventoryItemSummary[];
}

interface ProjectedOperation {
  gatherer: GathererState;
  zone: GatheringZoneDefinition;
  durationMs: number;
  progress: number;
  remainingMs: number;
  expectedUnits: number;
  unitsPerMinute: number;
  valuePerMinute: number;
}

interface ProjectedNetworkRates {
  unitsPerMinute: number;
  valuePerMinute: number;
  cyclesPerMinute: number;
  nextReturnMs: number | null;
  operations: ProjectedOperation[];
}

export class LiveDashboardTelemetry {
  private state: Readonly<GameState>;
  private active = true;
  private mount: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;
  private tickTimer: number | null = null;
  private sampleTimer: number | null = null;
  private animationFrame: number | null = null;
  private readonly sessionStartedAt = Date.now();
  private samples: TelemetrySample[] = [];
  private frames = 0;
  private fps = 0;
  private fpsWindowStarted = performance.now();

  constructor(private store: GameStore) {
    this.state = store.snapshot;
  }

  initialize(): void {
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.active = tab.dataset.view === 'dashboard';
        if (this.active) queueMicrotask(() => this.update());
      });
    });

    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type !== 'state') return;
      this.state = event.state;
      this.recordSample();
      if (this.active) queueMicrotask(() => this.update());
    });

    this.active = document.querySelector<HTMLButtonElement>('.command-tab.active')?.dataset.view === 'dashboard';
    this.recordSample();
    this.tickTimer = window.setInterval(() => this.update(), 250);
    this.sampleTimer = window.setInterval(() => this.recordSample(), 1_000);
    this.animationFrame = requestAnimationFrame(this.measureFrames);
    if (this.active) queueMicrotask(() => this.update());
  }

  destroy(): void {
    this.unsubscribe?.();
    if (this.tickTimer !== null) window.clearInterval(this.tickTimer);
    if (this.sampleTimer !== null) window.clearInterval(this.sampleTimer);
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
  }

  private readonly measureFrames = (now: number): void => {
    this.frames += 1;
    const elapsed = now - this.fpsWindowStarted;
    if (elapsed >= 1_000) {
      this.fps = Math.round((this.frames * 1_000) / elapsed);
      this.frames = 0;
      this.fpsWindowStarted = now;
    }
    this.animationFrame = requestAnimationFrame(this.measureFrames);
  };

  private update(): void {
    if (!this.active) return;
    this.ensureMount();
    const root = this.mount;
    if (!root) return;

    const now = Date.now();
    const inventory = this.inventorySummary();
    const rates = this.projectedNetworkRates(now);
    const flow60 = this.measuredFlow(60_000);
    const flow300 = this.measuredFlow(300_000);
    const boostRemaining = Math.max(0, this.state.activeBoostUntil - now);
    const discovery = this.discoveryMetrics(boostRemaining > 0);
    const playerNeed = xpForLevel(this.state.level);
    const networkNeed = this.networkXpForLevel(this.state.network.level);
    const latestActivity = this.state.network.activity[0];

    this.setText(root, 'rt-local-clock', new Date(now).toLocaleTimeString());
    this.setText(root, 'rt-session-time', this.formatLongDuration(now - this.sessionStartedAt));
    this.setText(root, 'rt-fps', `${this.fps || '--'} FPS`);
    this.setText(root, 'rt-link-state', navigator.onLine ? 'CLIENT ONLINE' : 'CLIENT OFFLINE');
    this.setTone(root, 'rt-link-state', navigator.onLine ? 'good' : 'danger');
    this.setText(root, 'rt-visibility', document.visibilityState.toUpperCase());
    this.setText(root, 'rt-state-age', this.relativeDuration(now - this.state.updatedAt));
    this.setText(root, 'rt-save-state', document.querySelector<HTMLElement>('#save-status')?.textContent?.trim() || 'Local state active');
    this.setText(root, 'rt-music-state', document.querySelector<HTMLSelectElement>('#music-select')?.selectedOptions[0]?.textContent?.trim() || 'No soundtrack selected');

    this.setText(root, 'rt-active-ops', String(rates.operations.length));
    this.setText(root, 'rt-next-return', rates.nextReturnMs === null ? 'IDLE' : this.formatClock(rates.nextReturnMs));
    this.setText(root, 'rt-measured-yield', `+${flow60.gathered}`);
    this.setText(root, 'rt-projected-units', `${rates.unitsPerMinute.toFixed(1)}/m`);
    this.setText(root, 'rt-projected-value', `${Math.round(rates.valuePerMinute).toLocaleString()}c/m`);
    this.setText(root, 'rt-cargo-value', `${inventory.value.toLocaleString()}c`);
    this.setText(root, 'rt-net-worth', `${(inventory.value + this.state.coins).toLocaleString()}c`);
    this.setText(root, 'rt-boost', boostRemaining > 0 ? this.formatClock(boostRemaining) : 'INACTIVE');
    this.setTone(root, 'rt-boost', boostRemaining > 0 ? 'good' : 'muted');

    this.setText(root, 'rt-flow-60-units', `+${flow60.gathered}`);
    this.setText(root, 'rt-flow-5m-units', `+${flow300.gathered}`);
    this.setText(root, 'rt-flow-60-coins', `+${flow60.coinsEarned.toLocaleString()}c`);
    this.setText(root, 'rt-flow-cargo', this.signedNumber(flow60.cargoValue, 'c'));
    this.setText(root, 'rt-cycles-minute', rates.cyclesPerMinute.toFixed(2));
    this.setText(root, 'rt-lifetime-yield', this.state.totals.gathered.toLocaleString());
    this.setText(root, 'rt-auto-lifetime', this.state.network.totalAutomatedGathered.toLocaleString());
    this.setText(root, 'rt-cycle-total', this.state.network.expeditionsCompleted.toLocaleString());

    this.setText(root, 'rt-known-materials', `${this.state.discovered.length}/${Object.keys(allResources).length}`);
    this.setText(root, 'rt-known-qualities', `${discovery.knownQualities}/${Object.keys(allResources).length * Object.keys(qualityDefinitions).length}`);
    this.setText(root, 'rt-mythic-found', String(this.state.totals.variantsFound));
    this.setText(root, 'rt-rare-momentum', String(this.state.rareMomentum));
    this.setText(root, 'rt-manual-mythic', `${discovery.manualChance.toFixed(2)}%`);
    this.setText(root, 'rt-network-mythic', `${discovery.networkChance.toFixed(2)}%`);
    this.setText(root, 'rt-next-milestone', discovery.nextMilestone === null ? 'COMPLETE' : `${this.state.discovered.length}/${discovery.nextMilestone}`);
    this.setWidth(root, 'rt-discovery-progress', discovery.completion);

    this.setText(root, 'rt-player-level', `LV ${this.state.level}`);
    this.setText(root, 'rt-player-xp', `${this.state.xp.toLocaleString()} / ${playerNeed.toLocaleString()}`);
    this.setWidth(root, 'rt-player-xp-bar', playerNeed > 0 ? (this.state.xp / playerNeed) * 100 : 100);
    this.setText(root, 'rt-network-level', `LV ${this.state.network.level}`);
    this.setText(root, 'rt-network-xp', `${this.state.network.xp.toLocaleString()} / ${networkNeed.toLocaleString()}`);
    this.setWidth(root, 'rt-network-xp-bar', networkNeed > 0 ? (this.state.network.xp / networkNeed) * 100 : 100);
    this.setText(root, 'rt-stat-points', String(this.state.statPoints));
    this.setText(root, 'rt-command-points', String(this.state.network.commandPoints));
    this.setText(root, 'rt-zone-count', `${this.state.network.unlockedZones.length}/${Object.keys(gatheringZones).length}`);
    this.setText(root, 'rt-biome-count', `${this.state.unlockedBiomes.length}/4`);

    this.setText(root, 'rt-inventory-units', inventory.units.toLocaleString());
    this.setText(root, 'rt-inventory-types', String(inventory.top.length));
    this.renderOperations(root, rates.operations);
    this.renderInventory(root, inventory.top);
    this.renderMasteries(root);
    this.renderActivities(root, this.state.network.activity.slice(0, 6));

    this.setText(root, 'rt-latest-event', latestActivity?.title ?? 'No network event recorded');
    this.setText(root, 'rt-latest-event-age', latestActivity ? this.relativeDuration(now - latestActivity.timestamp) : '--');
  }

  private ensureMount(): void {
    if (this.mount && document.contains(this.mount)) return;
    const shell = document.querySelector<HTMLElement>('.command-v2-shell');
    if (!shell) {
      this.mount = null;
      return;
    }

    const existing = shell.querySelector<HTMLElement>('.live-telemetry-deck');
    if (existing) {
      this.mount = existing;
      return;
    }

    const section = document.createElement('section');
    section.className = 'live-telemetry-deck';
    section.setAttribute('aria-label', 'Real-time dashboard telemetry');
    section.innerHTML = this.template();
    const summaryRow = shell.querySelector('.command-v2-summary-row');
    if (summaryRow) summaryRow.before(section);
    else shell.append(section);
    this.mount = section;
  }

  private template(): string {
    return `<div class="live-telemetry-head">
      <div><span class="live-dot"></span><div><strong>REAL-TIME OPERATIONS TELEMETRY</strong><small>Measured game-state signals and clearly labeled projections</small></div></div>
      <div class="live-system-strip"><span id="rt-link-state">CLIENT ONLINE</span><span id="rt-visibility">VISIBLE</span><span id="rt-fps">-- FPS</span><span id="rt-local-clock">--:--:--</span></div>
    </div>
    <div class="live-kpi-strip">
      ${this.kpi('ACTIVE OPERATIONS', 'rt-active-ops', 'measured')}
      ${this.kpi('NEXT RETURN', 'rt-next-return', 'measured')}
      ${this.kpi('ACTUAL YIELD · 60S', 'rt-measured-yield', 'measured')}
      ${this.kpi('PROJECTED UNITS', 'rt-projected-units', 'projected')}
      ${this.kpi('PROJECTED VALUE', 'rt-projected-value', 'projected')}
      ${this.kpi('CARGO VALUE', 'rt-cargo-value', 'measured')}
      ${this.kpi('NET WORTH', 'rt-net-worth', 'measured')}
      ${this.kpi('DISCOVERY BOOST', 'rt-boost', 'measured')}
    </div>
    <div class="live-telemetry-grid">
      <article class="live-panel live-operations-panel"><header><span>ACTIVE EXTRACTION STREAMS</span><small>Measured cycle position · projected output</small></header><div id="rt-operation-grid" class="live-operation-grid"></div></article>
      <article class="live-panel"><header><span>PRODUCTION PULSE</span><small>Gross gains from actual state changes</small></header><div class="live-metric-matrix">
        ${this.metric('60-second yield', 'rt-flow-60-units')}${this.metric('5-minute yield', 'rt-flow-5m-units')}${this.metric('Coins earned · 60s', 'rt-flow-60-coins')}${this.metric('Cargo value change', 'rt-flow-cargo')}${this.metric('Projected cycles / min', 'rt-cycles-minute')}${this.metric('Lifetime total yield', 'rt-lifetime-yield')}${this.metric('Automated lifetime', 'rt-auto-lifetime')}${this.metric('Completed cycles', 'rt-cycle-total')}
      </div></article>
      <article class="live-panel"><header><span>DISCOVERY INTELLIGENCE</span><small>Actual progression · estimated chances</small></header><div class="live-metric-matrix">
        ${this.metric('Known materials', 'rt-known-materials')}${this.metric('Known quality records', 'rt-known-qualities')}${this.metric('Mythic variants found', 'rt-mythic-found')}${this.metric('Discovery momentum', 'rt-rare-momentum')}${this.metric('Manual Mythic estimate', 'rt-manual-mythic')}${this.metric('Network Mythic estimate', 'rt-network-mythic')}${this.metric('Next Codex milestone', 'rt-next-milestone')}
      </div><div class="live-progress"><span id="rt-discovery-progress"></span></div></article>
      <article class="live-panel"><header><span>COMMANDER & NETWORK</span><small>Live progression state</small></header><div class="live-level-row"><strong id="rt-player-level">LV 1</strong><div><span>Commander XP</span><small id="rt-player-xp">0 / 0</small><div class="live-progress"><span id="rt-player-xp-bar"></span></div></div></div><div class="live-level-row"><strong id="rt-network-level">LV 1</strong><div><span>Network XP</span><small id="rt-network-xp">0 / 0</small><div class="live-progress network"><span id="rt-network-xp-bar"></span></div></div></div><div class="live-metric-matrix compact">${this.metric('Stat points', 'rt-stat-points')}${this.metric('Command points', 'rt-command-points')}${this.metric('Zones online', 'rt-zone-count')}${this.metric('Biomes online', 'rt-biome-count')}</div><div id="rt-mastery-grid" class="live-mastery-grid"></div></article>
      <article class="live-panel"><header><span>INVENTORY FLOW</span><small>Measured quantities and market value</small></header><div class="live-inventory-summary"><div><span>Stored units</span><strong id="rt-inventory-units">0</strong></div><div><span>Tracked material groups</span><strong id="rt-inventory-types">0</strong></div></div><div id="rt-inventory-list" class="live-inventory-list"></div></article>
      <article class="live-panel"><header><span>NETWORK EVENT STREAM</span><small>Newest first</small></header><div class="live-event-highlight"><span>LATEST SIGNAL</span><strong id="rt-latest-event">No event</strong><small id="rt-latest-event-age">--</small></div><div id="rt-event-list" class="live-event-list"></div></article>
      <article class="live-panel system-panel"><header><span>CLIENT & SESSION HEALTH</span><small>Real browser and local-state information</small></header><div class="live-metric-matrix">${this.metric('Session uptime', 'rt-session-time')}${this.metric('State changed', 'rt-state-age')}${this.metric('Save channel', 'rt-save-state')}${this.metric('Soundtrack', 'rt-music-state')}</div><footer>Local browser telemetry only · no simulated player counts · 250 ms display refresh</footer></article>
    </div>`;
  }

  private kpi(label: string, id: string, source: 'measured' | 'projected'): string {
    return `<div class="live-kpi"><span>${label}</span><strong id="${id}">--</strong><small class="${source}">${source.toUpperCase()}</small></div>`;
  }

  private metric(label: string, id: string): string {
    return `<div><span>${label}</span><strong id="${id}">--</strong></div>`;
  }

  private renderOperations(root: HTMLElement, operations: ProjectedOperation[]): void {
    const target = root.querySelector<HTMLElement>('#rt-operation-grid');
    if (!target) return;
    if (!operations.length) {
      target.innerHTML = '<div class="live-empty">No gatherers deployed. Open Network to start a measurable extraction stream.</div>';
      return;
    }
    target.innerHTML = operations.map((operation) => `<div class="live-operation-card">
      <div class="live-operation-title"><div><strong>${this.escape(operation.gatherer.name)}</strong><span>${this.escape(operation.zone.name)} · ${this.escape(operation.gatherer.role)}</span></div><b>${this.formatClock(operation.remainingMs)}</b></div>
      <div class="live-cycle-bar" style="--cycle:${operation.progress.toFixed(1)}%"><span></span></div>
      <div class="live-operation-stats"><span><small>Cycle</small><strong>${operation.progress.toFixed(1)}%</strong></span><span><small>Expected</small><strong>${operation.expectedUnits} units</strong></span><span><small>Rate</small><strong>${operation.unitsPerMinute.toFixed(1)}/m</strong></span><span><small>Value</small><strong>${Math.round(operation.valuePerMinute)}c/m</strong></span><span><small>Efficiency</small><strong>${Math.round(operation.gatherer.efficiency * 100)}%</strong></span><span><small>Equipment</small><strong>T${operation.gatherer.equipmentLevel}</strong></span></div>
    </div>`).join('');
  }

  private renderInventory(root: HTMLElement, items: InventoryItemSummary[]): void {
    const target = root.querySelector<HTMLElement>('#rt-inventory-list');
    if (!target) return;
    target.innerHTML = items.length ? items.slice(0, 7).map((item, index) => `<div><span><i class="inventory-rank r${index}"></i>${this.escape(item.name)}</span><strong>${item.units.toLocaleString()}</strong><small>${item.value.toLocaleString()}c</small></div>`).join('') : '<div class="live-empty">No stored resources yet.</div>';
  }

  private renderMasteries(root: HTMLElement): void {
    const target = root.querySelector<HTMLElement>('#rt-mastery-grid');
    if (!target) return;
    target.innerHTML = (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const skill = this.state.skills[tool];
      const needed = skillXpForLevel(skill.level);
      const progress = needed > 0 ? this.clamp((skill.xp / needed) * 100, 0, 100) : 100;
      return `<div><span>${this.escape(toolNames[tool])}</span><strong>Lv ${skill.level}</strong><div class="live-progress"><span style="width:${progress.toFixed(1)}%"></span></div></div>`;
    }).join('');
  }

  private renderActivities(root: HTMLElement, activities: NetworkActivity[]): void {
    const target = root.querySelector<HTMLElement>('#rt-event-list');
    if (!target) return;
    target.innerHTML = activities.length ? activities.map((activity) => `<div class="event-${activity.tone}"><span>${this.relativeDuration(Date.now() - activity.timestamp)}</span><div><strong>${this.escape(activity.title)}</strong><small>${this.escape(activity.detail)}</small></div></div>`).join('') : '<div class="live-empty">No network activity recorded.</div>';
  }

  private projectedNetworkRates(now: number): ProjectedNetworkRates {
    const operations: ProjectedOperation[] = [];
    let unitsPerMinute = 0;
    let valuePerMinute = 0;
    let cyclesPerMinute = 0;
    let nextReturnMs: number | null = null;

    for (const gatherer of this.state.network.gatherers) {
      if (!gatherer.assignedZoneId) continue;
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) continue;
      const durationMs = this.store.automationCycleDuration(gatherer, zone);
      const elapsed = Math.max(0, now - (gatherer.lastCycleAt ?? now));
      const cycleElapsed = elapsed % durationMs;
      const remainingMs = Math.max(0, durationMs - cycleElapsed);
      const progress = this.clamp((cycleElapsed / durationMs) * 100, 0, 100);
      const expectedUnits = this.expectedCycleUnits(gatherer, zone);
      const operationUnitsPerMinute = expectedUnits * (60_000 / durationMs);
      const operationValuePerMinute = operationUnitsPerMinute * this.averageZoneValue(zone);
      unitsPerMinute += operationUnitsPerMinute;
      valuePerMinute += operationValuePerMinute;
      cyclesPerMinute += 60_000 / durationMs;
      nextReturnMs = nextReturnMs === null ? remainingMs : Math.min(nextReturnMs, remainingMs);
      operations.push({ gatherer, zone, durationMs, progress, remainingMs, expectedUnits, unitsPerMinute: operationUnitsPerMinute, valuePerMinute: operationValuePerMinute });
    }

    operations.sort((a, b) => a.remainingMs - b.remainingMs);
    return { unitsPerMinute, valuePerMinute, cyclesPerMinute, nextReturnMs, operations };
  }

  private expectedCycleUnits(gatherer: GathererState, zone: GatheringZoneDefinition): number {
    const specialtyBonus = gatherer.specialty === zone.specialty ? 1.25 : 1;
    const commandBonus = 1 + Math.max(0, this.state.network.level - 1) * 0.025;
    return Math.max(1, Math.floor(zone.baseYield * gatherer.efficiency * specialtyBonus * commandBonus * (1 + gatherer.equipmentLevel * 0.07) * 1.01));
  }

  private averageZoneValue(zone: GatheringZoneDefinition): number {
    const definitions = zone.resources.map((id) => allResources[id]).filter((item): item is ResourceDefinition => Boolean(item));
    return definitions.length ? definitions.reduce((sum, item) => sum + item.value, 0) / definitions.length : 0;
  }

  private discoveryMetrics(boostActive: boolean): { knownQualities: number; manualChance: number; networkChance: number; nextMilestone: number | null; completion: number } {
    const knownQualities = Object.values(this.state.discoveredQualities).reduce((sum, entries) => sum + entries.length, 0);
    const nativeVariants = Object.values(rareVariants).filter((variant) => variant.nativeBiome === this.state.currentBiome);
    const averageBaseChance = nativeVariants.length ? nativeVariants.reduce((sum, variant) => sum + (variant.spawnChance ?? 0), 0) / nativeVariants.length : 0;
    const momentumBonus = Math.min(0.025, this.state.rareMomentum * 0.00008);
    const manualChance = Math.min(0.08, averageBaseChance + this.state.stats.fortune * 0.00008 + this.state.stats.perception * 0.00004 + momentumBonus + (boostActive ? 0.015 : 0)) * 100;

    const leaderBonus = this.state.network.gatherers.some((gatherer) => gatherer.role === 'Expedition Leader' && gatherer.assignedZoneId) ? 0.004 : 0;
    const networkChances = this.state.network.gatherers.flatMap((gatherer) => {
      if (!gatherer.assignedZoneId) return [];
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) return [];
      const variants = zone.resources.map((id) => Object.values(rareVariants).find((variant) => variant.baseId === id)).filter((item): item is ResourceDefinition => Boolean(item));
      if (!variants.length) return [];
      const base = variants.reduce((sum, variant) => sum + (variant.spawnChance ?? 0), 0) / variants.length;
      return [Math.min(0.09, base + zone.rarityBonus + gatherer.fortune * 0.00018 + leaderBonus) * 100];
    });
    const networkChance = networkChances.length ? networkChances.reduce((sum, chance) => sum + chance, 0) / networkChances.length : 0;
    const nextMilestone = [5, 10, 15, 20].find((milestone) => !this.state.claimedMilestones.includes(milestone)) ?? null;
    const completion = Object.keys(allResources).length ? (this.state.discovered.length / Object.keys(allResources).length) * 100 : 0;
    return { knownQualities, manualChance, networkChance, nextMilestone, completion };
  }

  private inventorySummary(): InventorySummary {
    let units = 0;
    let value = 0;
    const grouped = new Map<string, InventoryItemSummary>();
    for (const [key, amount] of Object.entries(this.state.inventory)) {
      if (amount <= 0) continue;
      const { resourceId, quality } = parseInventoryKey(key);
      const definition = allResources[resourceId];
      if (!definition) continue;
      const itemValue = Math.floor(definition.value * qualityDefinitions[quality].valueMultiplier * amount);
      units += amount;
      value += itemValue;
      const current = grouped.get(definition.name) ?? { name: definition.name, units: 0, value: 0 };
      current.units += amount;
      current.value += itemValue;
      grouped.set(definition.name, current);
    }
    const top = [...grouped.values()].sort((a, b) => b.value - a.value || b.units - a.units);
    return { units, value, top };
  }

  private recordSample(): void {
    const now = Date.now();
    const inventory = this.inventorySummary();
    const previous = this.samples[this.samples.length - 1];
    if (previous && now - previous.at < 400 && previous.gathered === this.state.totals.gathered && previous.coinsEarned === this.state.totals.coinsEarned && previous.inventoryUnits === inventory.units && previous.cargoValue === inventory.value) return;
    this.samples.push({ at: now, gathered: this.state.totals.gathered, coinsEarned: this.state.totals.coinsEarned, inventoryUnits: inventory.units, cargoValue: inventory.value });
    const cutoff = now - 310_000;
    this.samples = this.samples.filter((sample) => sample.at >= cutoff);
  }

  private measuredFlow(windowMs: number): { gathered: number; coinsEarned: number; inventoryUnits: number; cargoValue: number } {
    const latest = this.samples[this.samples.length - 1];
    if (!latest) return { gathered: 0, coinsEarned: 0, inventoryUnits: 0, cargoValue: 0 };
    const cutoff = latest.at - windowMs;
    let baseline = this.samples[0] ?? latest;
    for (const sample of this.samples) {
      if (sample.at <= cutoff) baseline = sample;
      else break;
    }
    return {
      gathered: Math.max(0, latest.gathered - baseline.gathered),
      coinsEarned: Math.max(0, latest.coinsEarned - baseline.coinsEarned),
      inventoryUnits: latest.inventoryUnits - baseline.inventoryUnits,
      cargoValue: latest.cargoValue - baseline.cargoValue,
    };
  }

  private networkXpForLevel(level: number): number {
    return Math.floor(140 + Math.pow(level, 1.5) * 95);
  }

  private setText(root: HTMLElement, id: string, value: string): void {
    const element = root.querySelector<HTMLElement>(`#${id}`);
    if (element && element.textContent !== value) element.textContent = value;
  }

  private setWidth(root: HTMLElement, id: string, value: number): void {
    const element = root.querySelector<HTMLElement>(`#${id}`);
    if (element) element.style.width = `${this.clamp(value, 0, 100).toFixed(1)}%`;
  }

  private setTone(root: HTMLElement, id: string, tone: 'good' | 'danger' | 'muted'): void {
    const element = root.querySelector<HTMLElement>(`#${id}`);
    if (!element) return;
    element.classList.remove('good', 'danger', 'muted');
    element.classList.add(tone);
  }

  private signedNumber(value: number, suffix = ''): string {
    if (value > 0) return `+${value.toLocaleString()}${suffix}`;
    if (value < 0) return `${value.toLocaleString()}${suffix}`;
    return `0${suffix}`;
  }

  private relativeDuration(milliseconds: number): string {
    const seconds = Math.max(0, Math.floor(milliseconds / 1_000));
    if (seconds < 2) return 'NOW';
    if (seconds < 60) return `${seconds}s AGO`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m AGO`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h AGO`;
  }

  private formatClock(milliseconds: number): string {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1_000));
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  private formatLongDuration(milliseconds: number): string {
    const seconds = Math.max(0, Math.floor(milliseconds / 1_000));
    const hours = Math.floor(seconds / 3_600);
    const minutes = Math.floor((seconds % 3_600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
