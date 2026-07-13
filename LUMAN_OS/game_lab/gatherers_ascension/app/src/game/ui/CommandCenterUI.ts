import {
  allResources,
  biomes,
  parseInventoryKey,
  qualityDefinitions,
  rareVariants,
  resources,
  statNames,
  toolForm,
  toolNames,
  variantByBase,
  type BiomeId,
  type HarvestQuality,
  type ResourceDefinition,
  type StatId,
  type ToolId,
} from '../data/content';
import { gathererTemplates, gatheringZones, zonesByBiome, type GatheringZoneDefinition } from '../data/network';
import { gearLevel, gearUpgradeCost, skillXpForLevel, toolUpgradeCost, xpForLevel } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState } from '../state/GameState';
import type { CloudStatus } from '../systems/SaveService';

type CommandView = 'dashboard' | 'field' | 'network' | 'gatherers' | 'codex' | 'market';

export class CommandCenterUI {
  private activeView: CommandView = 'dashboard';
  private state: Readonly<GameState>;
  private leftPanel: HTMLElement;
  private rightPanel: HTMLElement;
  private bottomPanel: HTMLElement;
  private strategicOverlay: HTMLElement;
  private saveStatus: HTMLElement;
  private cloudButton: HTMLButtonElement;
  private discoveryLayer: HTMLElement;
  private operationKicker: HTMLElement;
  private operationTitle: HTMLElement;
  private operationSubtitle: HTMLElement;
  private serverTime: HTMLElement;

  constructor(private store: GameStore) {
    this.state = store.snapshot;
    const leftPanel = document.querySelector<HTMLElement>('#left-panel-content');
    const rightPanel = document.querySelector<HTMLElement>('#right-panel-content');
    const bottomPanel = document.querySelector<HTMLElement>('#bottom-panel-content');
    const strategicOverlay = document.querySelector<HTMLElement>('#strategic-overlay');
    const saveStatus = document.querySelector<HTMLElement>('#save-status');
    const cloudButton = document.querySelector<HTMLButtonElement>('#cloud-button');
    const discoveryLayer = document.querySelector<HTMLElement>('#discovery-layer');
    const operationKicker = document.querySelector<HTMLElement>('#operation-kicker');
    const operationTitle = document.querySelector<HTMLElement>('#operation-title');
    const operationSubtitle = document.querySelector<HTMLElement>('#operation-subtitle');
    const serverTime = document.querySelector<HTMLElement>('#server-time');

    if (!leftPanel || !rightPanel || !bottomPanel || !strategicOverlay || !saveStatus || !cloudButton || !discoveryLayer || !operationKicker || !operationTitle || !operationSubtitle || !serverTime) {
      throw new Error('Required command interface elements are missing.');
    }

    this.leftPanel = leftPanel;
    this.rightPanel = rightPanel;
    this.bottomPanel = bottomPanel;
    this.strategicOverlay = strategicOverlay;
    this.saveStatus = saveStatus;
    this.cloudButton = cloudButton;
    this.discoveryLayer = discoveryLayer;
    this.operationKicker = operationKicker;
    this.operationTitle = operationTitle;
    this.operationSubtitle = operationSubtitle;
    this.serverTime = serverTime;

    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.activeView = (tab.dataset.view as CommandView | undefined) ?? 'dashboard';
        document.querySelectorAll('.command-tab').forEach((item) => item.classList.remove('active'));
        tab.classList.add('active');
        this.render();
      });
    });

    this.store.subscribe((event: StoreEvent) => {
      if (event.type === 'state') {
        this.state = event.state;
        // The tactical Dashboard owns and stabilizes its own DOM. Rebuilding it
        // here on every state tick destroys the live deck and resets scrollTop.
        if (this.activeView !== 'dashboard') this.render();
        else this.refreshLiveTimers();
      } else if (event.type === 'toast') {
        this.toast(event.title, event.message);
      } else if (event.type === 'discovery') {
        this.showDiscovery(event.definition, event.quality);
      }
    });

    this.updateClock();
    window.setInterval(() => {
      this.updateClock();
      this.refreshLiveTimers();
    }, 1000);
  }

  bindCloudButton(handler: () => Promise<void>): void {
    this.cloudButton.addEventListener('click', () => void handler());
  }

  setCloudStatus(status: CloudStatus): void {
    if (!status.configured) {
      this.cloudButton.textContent = 'Local Save Active';
      this.cloudButton.title = 'Supabase and GitHub OAuth can be configured later for cloud saves.';
      return;
    }
    this.cloudButton.textContent = status.user ? 'Sync Network Save' : 'Connect GitHub Save';
    this.cloudButton.title = status.user ? `Signed in as ${status.user.email ?? 'GitHub user'}` : 'Sign in with GitHub through Supabase.';
  }

  setSaveStatus(message: string): void {
    this.saveStatus.textContent = message;
  }

  toast(title: string, message: string): void {
    const layer = document.querySelector<HTMLElement>('#toast-layer');
    if (!layer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<strong>${this.escape(title)}</strong><span>${this.escape(message)}</span>`;
    layer.append(toast);
    window.setTimeout(() => toast.remove(), 3600);
  }

  private render(): void {
    this.strategicOverlay.classList.toggle('visible', this.activeView !== 'field');

    // Dashboard rendering is exclusively handled by CommandCenterDashboardV2.
    // Keeping this branch mutation-free prevents scroll position resets and
    // avoids racing the live telemetry and persistent operations layers.
    if (this.activeView === 'dashboard') {
      this.refreshLiveTimers();
      return;
    }

    if (this.activeView === 'field') this.renderField();
    else if (this.activeView === 'network') this.renderNetwork();
    else if (this.activeView === 'gatherers') this.renderGatherers();
    else if (this.activeView === 'codex') this.renderCodex();
    else this.renderMarket();
    this.bindRenderedActions();
    this.refreshLiveTimers();
  }

  private renderDashboard(): void {
    // Retained only as legacy source reference. Runtime Dashboard ownership was
    // transferred to CommandCenterDashboardV2 to guarantee a single renderer.
  }

  private renderField(): void {
    const biome = biomes[this.state.currentBiome];
    const active = this.activeGatherers();
    this.operationKicker.textContent = 'LIVE FIELD OPERATIONS';
    this.operationTitle.textContent = biome.name;
    this.operationSubtitle.textContent = `${biome.subtitle}. Automated teams continue operating while you gather directly.`;
    this.strategicOverlay.innerHTML = '';

    this.leftPanel.innerHTML = `
      ${this.operatorStatusCard()}
      <section class="telemetry-card">
        <h3 class="panel-title">Extraction Performance</h3>
        <div class="metric-row"><span class="metric-label">Gather Radius</span><span class="metric-value green">${Math.round(52 + this.state.gear.worldpack * 7 + this.state.stats.perception * 1.5)}m</span></div>
        <div class="metric-row"><span class="metric-label">Critical Yield Chance</span><span class="metric-value">${Math.round(Math.min(.42, .04 + this.state.stats.fortune * .008 + this.state.stats.perception * .004) * 100)}%</span></div>
        <div class="metric-row"><span class="metric-label">Discovery Momentum</span><span class="metric-value gold">${this.state.rareMomentum}</span></div>
        <div class="metric-row"><span class="metric-label">Field Gear Level</span><span class="metric-value">${gearLevel(this.state as GameState)}</span></div>
      </section>
      <section class="telemetry-card"><h3 class="panel-title">Tool Mastery</h3>${this.masteryRows()}</section>`;

    this.rightPanel.innerHTML = `
      <section class="telemetry-card">
        <h3 class="panel-title">Automated Node Queue</h3>
        ${active.length ? active.map((gatherer) => this.activeOperationRow(gatherer)).join('') : '<div class="empty-state">Deploy gatherers from the Network view.</div>'}
      </section>
      ${this.inventoryMiniCard()}
      <section class="telemetry-card">
        <h3 class="panel-title">Rare Material Discovery</h3>
        ${this.simpleGauge(this.rareDiscoveryRate(), 'network chance')}
        <div class="metric-row"><span class="metric-label">Mythic Variants</span><span class="metric-value gold">${this.state.totals.variantsFound}/${Object.keys(rareVariants).length}</span></div>
      </section>`;

    this.bottomPanel.innerHTML = `
      ${this.collectionDeckCard()}
      ${this.activityDeckCard()}
      ${this.objectivesDeckCard()}
      ${this.systemDeckCard()}`;
  }

  private renderNetwork(): void {
    this.operationKicker.textContent = 'WORLDROOT NETWORK OPERATIONS';
    this.operationTitle.textContent = 'Biome Intelligence and Deployment Map';
    this.operationSubtitle.textContent = 'Unlock zones, assign specialists, and build a continuously operating gathering network.';

    this.strategicOverlay.innerHTML = `
      <div class="network-map">
        ${(Object.keys(biomes) as BiomeId[]).map((biomeId) => this.biomeSector(biomeId)).join('')}
      </div>`;

    const currentGear = gearLevel(this.state as GameState);
    this.leftPanel.innerHTML = `
      <section class="telemetry-card">
        <h3 class="panel-title">World Progression</h3>
        ${(Object.keys(biomes) as BiomeId[]).map((id) => {
          const biome = biomes[id];
          const unlocked = this.state.unlockedBiomes.includes(id);
          const eligible = this.state.level >= biome.levelRequired && currentGear >= biome.gearRequired;
          return `<div class="metric-row"><div><span class="metric-label">${biome.name}</span><div class="metric-caption">Level ${biome.levelRequired} · Gear ${biome.gearRequired}</div></div>${unlocked ? `<button class="command-button-secondary" data-travel-biome="${id}">${this.state.currentBiome === id ? 'ACTIVE' : 'TRAVEL'}</button>` : `<button class="command-button" data-unlock-biome="${id}" ${eligible ? '' : 'disabled'}>UNLOCK</button>`}</div>`;
        }).join('')}
      </section>`;

    this.rightPanel.innerHTML = `
      <section class="telemetry-card">
        <h3 class="panel-title">Network Operations</h3>
        <div class="metric-row"><span class="metric-label">Active Gatherers</span><span class="metric-value green">${this.activeGatherers().length}</span></div>
        <div class="metric-row"><span class="metric-label">Available Slots</span><span class="metric-value">${this.state.network.gatherers.length}/${this.store.maxGathererSlots()}</span></div>
        <div class="metric-row"><span class="metric-label">Automated Yield</span><span class="metric-value gold">${this.state.network.totalAutomatedGathered.toLocaleString()}</span></div>
      </section>
      ${this.activityMiniCard()}`;

    this.bottomPanel.innerHTML = `
      ${(Object.keys(biomes) as BiomeId[]).map((biomeId) => this.biomeZoneDeck(biomeId)).join('')}`;
  }

  private renderGatherers(): void {
    this.operationKicker.textContent = 'GATHERER ROSTER';
    this.operationTitle.textContent = 'Personnel, Roles, and Field Readiness';
    this.operationSubtitle.textContent = 'Recruit specialists, improve loadouts, and monitor automated performance.';
    this.strategicOverlay.innerHTML = `<div class="roster-grid">${this.state.network.gatherers.map((gatherer) => this.gathererCard(gatherer)).join('')}${this.recruitCards()}</div>`;
    this.leftPanel.innerHTML = `${this.operatorStatusCard()}<section class="telemetry-card"><h3 class="panel-title">Roster Capacity</h3>${this.simpleGauge(Math.round((this.state.network.gatherers.length / this.store.maxGathererSlots()) * 100), 'slots used')}<div class="metric-row"><span class="metric-label">Network Level</span><span class="metric-value green">${this.state.network.level}</span></div></section>`;
    this.rightPanel.innerHTML = `<section class="telemetry-card"><h3 class="panel-title">Role Coverage</h3>${this.roleCoverage()}</section>${this.activityMiniCard()}`;
    this.bottomPanel.innerHTML = `${this.activityDeckCard()}${this.objectivesDeckCard()}${this.systemDeckCard()}${this.collectionDeckCard()}`;
  }

  private renderCodex(): void {
    this.operationKicker.textContent = 'COLLECTION CODEX';
    this.operationTitle.textContent = 'Material Intelligence Archive';
    this.operationSubtitle.textContent = 'Every hidden material remains unknown until successfully harvested.';
    this.strategicOverlay.innerHTML = `<div class="codex-grid">${Object.values(resources).map((resource) => this.codexCard(resource)).join('')}</div>`;
    this.leftPanel.innerHTML = `${this.operatorStatusCard()}<section class="telemetry-card"><h3 class="panel-title">Collection Completion</h3>${this.collectionGauge()}<div class="metric-row"><span class="metric-label">Known Materials</span><span class="metric-value green">${this.state.discovered.length}/${Object.keys(allResources).length}</span></div><div class="metric-row"><span class="metric-label">Mythic Variants</span><span class="metric-value gold">${this.state.totals.variantsFound}/${Object.keys(rareVariants).length}</span></div></section>`;
    this.rightPanel.innerHTML = `<section class="telemetry-card"><h3 class="panel-title">Quality Archive</h3>${this.qualityArchive()}</section><section class="telemetry-card"><h3 class="panel-title">Collection Milestones</h3>${[5, 10, 15, 20].map((milestone) => `<div class="metric-row"><span class="metric-label">${milestone} discoveries</span><span class="metric-value ${this.state.claimedMilestones.includes(milestone) ? 'green' : ''}">${this.state.claimedMilestones.includes(milestone) ? 'CLAIMED' : `${Math.min(this.state.discovered.length, milestone)}/${milestone}`}</span></div>`).join('')}</section>`;
    this.bottomPanel.innerHTML = `${this.collectionDeckCard()}${this.activityDeckCard()}${this.objectivesDeckCard()}${this.systemDeckCard()}`;
  }

  private renderMarket(): void {
    this.operationKicker.textContent = 'LOADOUT DEVELOPMENT';
    this.operationTitle.textContent = 'Tools, Gear, Stats, and Network Upgrades';
    this.operationSubtitle.textContent = 'Invest gathered value into visible equipment evolution and increasingly powerful operations.';
    this.strategicOverlay.innerHTML = `<div class="upgrade-columns"><section class="upgrade-column"><h3>Gathering Tools</h3>${(Object.keys(toolNames) as ToolId[]).map((tool) => this.toolUpgradeCard(tool)).join('')}</section><section class="upgrade-column"><h3>Field Gear</h3>${this.gearUpgradeCards()}</section><section class="upgrade-column"><h3>Gatherer Loadouts</h3>${this.state.network.gatherers.map((gatherer) => this.gathererUpgradeCard(gatherer)).join('')}</section></div>`;
    this.leftPanel.innerHTML = `${this.operatorStatusCard()}<section class="telemetry-card"><h3 class="panel-title">Available Capital</h3><div class="coin-display">${this.state.coins.toLocaleString()}<span>coins</span></div>${this.inventoryMiniCard()}</section>`;
    this.rightPanel.innerHTML = `<section class="telemetry-card"><h3 class="panel-title">Stat Allocation</h3><div class="metric-row"><span class="metric-label">Available Points</span><span class="metric-value gold">${this.state.statPoints}</span></div>${(Object.keys(statNames) as StatId[]).map((stat) => `<div class="metric-row"><div><span class="metric-label">${statNames[stat]}</span><div class="metric-caption">Current level ${this.state.stats[stat]}</div></div><button class="command-button-secondary" data-allocate-stat="${stat}" ${this.state.statPoints > 0 ? '' : 'disabled'}>+</button></div>`).join('')}</section>`;
    this.bottomPanel.innerHTML = `${this.objectivesDeckCard()}${this.activityDeckCard()}${this.collectionDeckCard()}${this.systemDeckCard()}`;
  }

  private bindRenderedActions(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-switch-view]').forEach((button) => button.addEventListener('click', () => {
      const view = button.dataset.switchView as CommandView | undefined;
      if (view) document.querySelector<HTMLButtonElement>(`.command-tab[data-view="${view}"]`)?.click();
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-unlock-biome]').forEach((button) => button.addEventListener('click', () => this.store.unlockBiome(button.dataset.unlockBiome as BiomeId)));
    document.querySelectorAll<HTMLButtonElement>('[data-travel-biome]').forEach((button) => button.addEventListener('click', () => this.store.travel(button.dataset.travelBiome as BiomeId)));
    document.querySelectorAll<HTMLButtonElement>('[data-unlock-zone]').forEach((button) => button.addEventListener('click', () => {
      const zoneId = button.dataset.unlockZone;
      if (zoneId) this.store.unlockZone(zoneId);
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-assign-gatherer]').forEach((button) => button.addEventListener('click', () => {
      const gathererId = button.dataset.assignGatherer;
      const select = button.parentElement?.querySelector<HTMLSelectElement>('[data-zone-select]');
      const zoneId = select?.value;
      if (gathererId && zoneId) this.store.assignGatherer(gathererId, zoneId);
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-recall-gatherer]').forEach((button) => button.addEventListener('click', () => {
      const gathererId = button.dataset.recallGatherer;
      if (gathererId) this.store.recallGatherer(gathererId);
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-recruit-gatherer]').forEach((button) => button.addEventListener('click', () => {
      const templateId = button.dataset.recruitGatherer;
      if (templateId) this.store.recruitGatherer(templateId);
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-upgrade-gatherer]').forEach((button) => button.addEventListener('click', () => {
      const gathererId = button.dataset.upgradeGatherer;
      if (gathererId) this.store.upgradeGatherer(gathererId);
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-upgrade-tool]').forEach((button) => button.addEventListener('click', () => this.store.upgradeTool(button.dataset.upgradeTool as ToolId)));
    document.querySelectorAll<HTMLButtonElement>('[data-upgrade-gear]').forEach((button) => button.addEventListener('click', () => this.store.upgradeGear(button.dataset.upgradeGear as keyof GameState['gear'])));
    document.querySelectorAll<HTMLButtonElement>('[data-allocate-stat]').forEach((button) => button.addEventListener('click', () => this.store.allocateStat(button.dataset.allocateStat as StatId)));
    document.querySelectorAll<HTMLButtonElement>('[data-sell-resource]').forEach((button) => button.addEventListener('click', () => {
      const key = button.dataset.sellResource;
      if (key) this.store.sellResource(key);
    }));
  }

  private refreshLiveTimers(): void {
    document.querySelectorAll<HTMLElement>('[data-countdown]').forEach((element) => {
      const target = Number(element.dataset.countdown ?? '0');
      const remaining = Math.max(0, target - Date.now());
      element.textContent = this.formatDuration(remaining);
    });
    document.querySelectorAll<HTMLElement>('[data-cycle-gatherer]').forEach((element) => {
      const gatherer = this.state.network.gatherers.find((item) => item.id === element.dataset.cycleGatherer);
      if (!gatherer?.assignedZoneId || !gatherer.lastCycleAt) return;
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) return;
      const duration = this.store.automationCycleDuration(gatherer, zone);
      const elapsed = Date.now() - gatherer.lastCycleAt;
      const progress = Math.max(0, Math.min(100, (elapsed / duration) * 100));
      element.style.setProperty('--progress', `${progress}%`);
    });
  }

  private updateClock(): void {
    this.serverTime.textContent = new Date().toLocaleTimeString();
  }

  private activeGatherers(): GathererState[] {
    return this.state.network.gatherers.filter((gatherer) => Boolean(gatherer.assignedZoneId));
  }

  private idleGatherers(): GathererState[] {
    return this.state.network.gatherers.filter((gatherer) => !gatherer.assignedZoneId);
  }

  private operatorStatusCard(): string {
    const needed = xpForLevel(this.state.level);
    return `<section class="telemetry-card operator-card"><div class="operator-portrait"><span>${Math.min(9, Math.floor(this.state.level / 5) + 1)}</span></div><div><span class="metric-caption">PRIMARY GATHERER</span><h3>${this.escape(this.state.playerName)}</h3><div class="metric-row"><span class="metric-label">Level ${this.state.level}</span><span class="metric-value">${this.state.xp}/${needed} XP</span></div><div class="command-progress" style="--progress:${Math.min(100, (this.state.xp / needed) * 100)}%"><span></span></div></div></section>`;
  }

  private networkGauge(): string {
    const needed = Math.floor(140 + Math.pow(this.state.network.level, 1.5) * 95);
    const percent = Math.min(100, Math.round((this.state.network.xp / needed) * 100));
    return this.simpleGauge(percent, `Network Lv ${this.state.network.level}`);
  }

  private collectionGauge(): string {
    return this.simpleGauge(Math.round((this.state.discovered.length / Object.keys(allResources).length) * 100), 'Codex complete');
  }

  private simpleGauge(percent: number, label: string): string {
    return `<div class="command-gauge" style="--gauge:${Math.max(0, Math.min(100, percent))}%"><div class="command-gauge-content"><strong>${percent}%</strong><span>${this.escape(label)}</span></div></div>`;
  }

  private masteryRows(): string {
    return (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const skill = this.state.skills[tool];
      const needed = skillXpForLevel(skill.level);
      return `<div class="mastery-row"><div><span>${toolNames[tool]}</span><strong>Lv ${skill.level}</strong></div><div class="command-progress" style="--progress:${Math.min(100, (skill.xp / needed) * 100)}%"><span></span></div></div>`;
    }).join('');
  }

  private inventorySummary(): { units: number; value: number } {
    let units = 0;
    let value = 0;
    for (const [key, amount] of Object.entries(this.state.inventory)) {
      const { resourceId, quality } = parseInventoryKey(key);
      const definition = allResources[resourceId];
      if (!definition || amount <= 0) continue;
      units += amount;
      value += Math.floor(amount * definition.value * qualityDefinitions[quality].valueMultiplier);
    }
    return { units, value };
  }

  private inventoryMiniCard(): string {
    const entries = Object.entries(this.state.inventory).filter(([, amount]) => amount > 0).sort(([, a], [, b]) => b - a).slice(0, 6);
    return `<section class="telemetry-card"><h3 class="panel-title">Inventory Signal</h3>${entries.length ? entries.map(([key, amount]) => {
      const { resourceId, quality } = parseInventoryKey(key);
      const definition = allResources[resourceId];
      return definition ? `<div class="metric-row"><div><span class="metric-label">${quality === 'Standard' ? '' : `${quality} `}${definition.name}</span><div class="metric-caption">${definition.rarity} · ${definition.nativeBiome}</div></div><div><span class="metric-value">${amount}</span><button class="micro-action" data-sell-resource="${key}">SELL</button></div></div>` : '';
    }).join('') : '<div class="empty-state">Your Worldpack is empty.</div>'}</section>`;
  }

  private activityMiniCard(): string {
    return `<section class="telemetry-card"><h3 class="panel-title">Live Activity</h3>${this.state.network.activity.slice(0, 4).map((activity) => `<div class="activity-row ${activity.tone}"><span>${this.escape(activity.title)}</span><small>${this.escape(activity.detail)}</small></div>`).join('')}</section>`;
  }

  private activeOperationRow(gatherer: GathererState): string {
    const zone = gatherer.assignedZoneId ? gatheringZones[gatherer.assignedZoneId] : undefined;
    if (!zone || !gatherer.lastCycleAt) return '';
    const duration = this.store.automationCycleDuration(gatherer, zone);
    return `<div class="operation-row"><div><strong>${this.escape(gatherer.name)}</strong><span>${this.escape(zone.name)} · ${gatherer.role}</span></div><div class="operation-cycle"><div data-cycle-gatherer="${gatherer.id}" class="command-progress" style="--progress:0%"><span></span></div><small>continuous operation · ${Math.round(duration / 1000)}s cycle</small></div><button class="micro-action" data-recall-gatherer="${gatherer.id}">RECALL</button></div>`;
  }

  private dashboardBiomeNode(biomeId: BiomeId): string {
    const biome = biomes[biomeId];
    const unlocked = this.state.unlockedBiomes.includes(biomeId);
    const activeCount = this.state.network.gatherers.filter((gatherer) => gatherer.assignedZoneId && gatheringZones[gatherer.assignedZoneId]?.biomeId === biomeId).length;
    const zoneCount = zonesByBiome(biomeId).filter((zone) => this.state.network.unlockedZones.includes(zone.id)).length;
    return `<div class="map-biome-node ${biomeId} ${unlocked ? '' : 'locked'}"><h4>${biome.name}</h4><p>${unlocked ? `${zoneCount} zones online · ${activeCount} gatherers active` : `Requires level ${biome.levelRequired} and gear ${biome.gearRequired}`}</p></div>`;
  }

  private biomeSector(biomeId: BiomeId): string {
    const biome = biomes[biomeId];
    const unlocked = this.state.unlockedBiomes.includes(biomeId);
    const zones = zonesByBiome(biomeId);
    return `<section class="biome-sector ${biomeId} ${unlocked ? '' : 'locked'}"><div class="sector-head"><div><span>${biome.subtitle}</span><h3>${biome.name}</h3></div><strong>${unlocked ? 'ONLINE' : 'LOCKED'}</strong></div><div class="zone-stack">${zones.map((zone) => this.zoneRow(zone)).join('')}</div></section>`;
  }

  private zoneRow(zone: GatheringZoneDefinition): string {
    const unlocked = this.state.network.unlockedZones.includes(zone.id);
    const active = this.state.network.gatherers.find((gatherer) => gatherer.assignedZoneId === zone.id);
    const eligible = this.state.level >= zone.unlockLevel && this.state.unlockedBiomes.includes(zone.biomeId);
    return `<div class="zone-row ${unlocked ? '' : 'locked'}"><div><strong>${zone.name}</strong><span>T${zone.tier} · ${zone.danger} risk · ${zone.durationSeconds}s base cycle</span></div><div>${active ? `<span class="operation-chip">${this.escape(active.name)}</span>` : unlocked ? '<span class="operation-chip idle">AVAILABLE</span>' : `<button class="micro-action" data-unlock-zone="${zone.id}" ${eligible && this.state.coins >= this.store.zoneUnlockCost(zone.id) ? '' : 'disabled'}>${this.store.zoneUnlockCost(zone.id)}c</button>`}</div></div>`;
  }

  private biomeZoneDeck(biomeId: BiomeId): string {
    const zones = zonesByBiome(biomeId);
    return `<section class="deck-card"><h3>${biomes[biomeId].name}</h3>${zones.map((zone) => {
      const active = this.state.network.gatherers.find((gatherer) => gatherer.assignedZoneId === zone.id);
      return `<div class="metric-row"><span class="metric-label">${zone.name}</span><span class="metric-value ${active ? 'green' : ''}">${active ? this.escape(active.name) : this.state.network.unlockedZones.includes(zone.id) ? 'OPEN' : 'LOCKED'}</span></div>`;
    }).join('')}</section>`;
  }

  private gathererCard(gatherer: GathererState): string {
    const zone = gatherer.assignedZoneId ? gatheringZones[gatherer.assignedZoneId] : undefined;
    const availableZones = Object.values(gatheringZones).filter((candidate) => this.state.network.unlockedZones.includes(candidate.id) && !this.state.network.gatherers.some((item) => item.assignedZoneId === candidate.id));
    return `<article class="roster-card"><div class="roster-avatar role-${gatherer.role.toLowerCase().replaceAll(' ', '-')}"><span>${gatherer.name.slice(0, 1)}</span></div><div class="roster-identity"><span>${gatherer.role}</span><h3>${this.escape(gatherer.name)}</h3><p>Level ${gatherer.level} · Equipment T${gatherer.equipmentLevel}</p></div><div class="roster-stat-grid"><div><span>EFF</span><strong>${Math.round(gatherer.efficiency * 100)}%</strong></div><div><span>END</span><strong>${gatherer.endurance}</strong></div><div><span>FORT</span><strong>${gatherer.fortune}</strong></div><div><span>YIELD</span><strong>${gatherer.totalGathered}</strong></div></div>${zone ? `<div class="assignment-box active"><span>DEPLOYED</span><strong>${zone.name}</strong><div class="command-progress" data-cycle-gatherer="${gatherer.id}" style="--progress:0%"><span></span></div><button class="command-button-secondary" data-recall-gatherer="${gatherer.id}">Recall</button></div>` : `<div class="assignment-box"><span>READY FOR DEPLOYMENT</span><select data-zone-select>${availableZones.map((candidate) => `<option value="${candidate.id}">${candidate.name}</option>`).join('')}</select><button class="command-button" data-assign-gatherer="${gatherer.id}" ${availableZones.length ? '' : 'disabled'}>Deploy</button></div>`}<button class="upgrade-line" data-upgrade-gatherer="${gatherer.id}" ${this.state.coins >= this.store.gathererUpgradeCost(gatherer.id) ? '' : 'disabled'}><span>Upgrade Equipment</span><strong>${this.store.gathererUpgradeCost(gatherer.id)}c</strong></button></article>`;
  }

  private recruitCards(): string {
    return Object.values(gathererTemplates).filter((template) => !this.state.network.gatherers.some((gatherer) => gatherer.templateId === template.id)).map((template) => {
      const locked = this.state.level < template.unlockLevel || this.state.network.gatherers.length >= this.store.maxGathererSlots();
      return `<article class="roster-card recruit-card ${locked ? 'locked' : ''}"><div class="roster-avatar recruit"><span>+</span></div><div class="roster-identity"><span>AVAILABLE SPECIALIST</span><h3>${template.name}</h3><p>${template.role} · Unlock level ${template.unlockLevel}</p></div><div class="roster-stat-grid"><div><span>EFF</span><strong>${Math.round(template.efficiency * 100)}%</strong></div><div><span>END</span><strong>${template.endurance}</strong></div><div><span>FORT</span><strong>${template.fortune}</strong></div><div><span>COST</span><strong>${template.recruitCost}c</strong></div></div><p class="recruit-trait">${template.trait}</p><button class="command-button" data-recruit-gatherer="${template.id}" ${!locked && this.state.coins >= template.recruitCost ? '' : 'disabled'}>Recruit ${template.name}</button></article>`;
    }).join('');
  }

  private codexCard(resource: ResourceDefinition): string {
    const variantId = variantByBase[resource.id];
    const variant = variantId ? rareVariants[variantId] : undefined;
    const known = this.state.discovered.includes(resource.id);
    const variantKnown = variant ? this.state.discovered.includes(variant.id) : false;
    const qualities = this.state.discoveredQualities[resource.id] ?? [];
    return `<article class="codex-card ${known ? '' : 'unknown'}"><div class="codex-art" style="--resource-color:${this.hex(resource.color)};--resource-glow:${this.hex(resource.glow)}"><span>${known ? resource.name.slice(0, 1) : '?'}</span></div><div class="codex-copy"><span>${known ? `${resource.rarity} · ${resource.nativeBiome}` : 'UNKNOWN ENTRY'}</span><h3>${known ? resource.name : 'Undiscovered Material'}</h3><p>${known ? resource.description : 'Harvest this material in its native biome to reveal the Codex entry.'}</p></div><div class="quality-dots">${(Object.keys(qualityDefinitions) as HarvestQuality[]).map((quality) => `<i class="${qualities.includes(quality) ? 'known' : ''}" style="--quality:${qualityDefinitions[quality].color}" title="${quality}"></i>`).join('')}</div><div class="variant-slot ${variantKnown ? 'known' : ''}"><span>MYTHIC MUTATION</span><strong>${variantKnown ? variant?.name : 'Unknown'}</strong></div></article>`;
  }

  private qualityArchive(): string {
    return (Object.keys(qualityDefinitions) as HarvestQuality[]).map((quality) => {
      const count = Object.values(this.state.discoveredQualities).filter((qualities) => qualities.includes(quality)).length;
      return `<div class="quality-row"><span style="--quality:${qualityDefinitions[quality].color}">${quality}</span><strong>${count}</strong></div>`;
    }).join('');
  }

  private toolUpgradeCard(tool: ToolId): string {
    const level = this.state.tools[tool];
    const cost = toolUpgradeCost(level);
    return `<article class="upgrade-card"><div class="upgrade-art tool-${tool} tier-${Math.min(4, Math.floor((level - 1) / 4))}"><span>${level}</span></div><div><span>${toolNames[tool]}</span><h3>${toolForm(level)}</h3><p>Current level ${level}. Higher levels increase yield and visibly evolve the tool.</p></div><button data-upgrade-tool="${tool}" ${this.state.coins >= cost ? '' : 'disabled'}>Upgrade · ${cost}c</button></article>`;
  }

  private gearUpgradeCards(): string {
    const definitions: Array<[keyof GameState['gear'], string, number, string]> = [['worldpack', 'Worldpack', 55, 'Expands gathering radius and storage profile.'], ['boots', 'Trail Boots', 48, 'Improves field traversal speed.'], ['fieldKit', 'Field Kit', 62, 'Raises total gear level and specialist readiness.'], ['relicWard', 'Relic Ward', 85, 'Advanced protection for deeper regions.']];
    return definitions.map(([id, name, base, description]) => {
      const level = this.state.gear[id];
      const cost = gearUpgradeCost(level, base);
      return `<article class="upgrade-card"><div class="upgrade-art gear-${id} tier-${Math.min(4, Math.floor(level / 3))}"><span>${level}</span></div><div><span>FIELD GEAR</span><h3>${name}</h3><p>${description}</p></div><button data-upgrade-gear="${id}" ${this.state.coins >= cost ? '' : 'disabled'}>Upgrade · ${cost}c</button></article>`;
    }).join('');
  }

  private gathererUpgradeCard(gatherer: GathererState): string {
    const cost = this.store.gathererUpgradeCost(gatherer.id);
    return `<article class="upgrade-card"><div class="upgrade-art gatherer-loadout tier-${Math.min(4, Math.floor((gatherer.equipmentLevel - 1) / 2))}"><span>${gatherer.equipmentLevel}</span></div><div><span>${gatherer.role}</span><h3>${this.escape(gatherer.name)} Loadout</h3><p>Improves cycle speed, yield efficiency, endurance, and periodic fortune.</p></div><button data-upgrade-gatherer="${gatherer.id}" ${this.state.coins >= cost ? '' : 'disabled'}>Upgrade · ${cost}c</button></article>`;
  }

  private roleCoverage(): string {
    return Object.values(gathererTemplates).map((template) => `<div class="metric-row"><span class="metric-label">${template.role}</span><span class="metric-value ${this.state.network.gatherers.some((gatherer) => gatherer.role === template.role) ? 'green' : ''}">${this.state.network.gatherers.some((gatherer) => gatherer.role === template.role) ? 'ONLINE' : 'MISSING'}</span></div>`).join('');
  }

  private rareDiscoveryRate(): string {
    const activeFortune = this.activeGatherers().reduce((total, gatherer) => total + gatherer.fortune, 0);
    const estimate = Math.min(12, .6 + this.state.stats.fortune * .09 + activeFortune * .025 + this.state.rareMomentum * .0025);
    return estimate.toFixed(2);
  }

  private activityDeckCard(): string {
    return `<section class="deck-card"><h3>Network Activity Feed</h3>${this.state.network.activity.slice(0, 5).map((activity) => `<div class="activity-row ${activity.tone}"><span>${this.escape(activity.title)}</span><small>${this.escape(activity.detail)}</small></div>`).join('')}</section>`;
  }

  private objectivesDeckCard(): string {
    const nextZone = Object.values(gatheringZones).find((zone) => !this.state.network.unlockedZones.includes(zone.id));
    const nextBiome = Object.values(biomes).find((biome) => !this.state.unlockedBiomes.includes(biome.id));
    return `<section class="deck-card"><h3>Mission Objectives</h3><div class="objective-item"><span>Expand Collection Codex</span><strong>${this.state.discovered.length}/${Object.keys(allResources).length}</strong></div><div class="objective-item"><span>${nextZone ? `Activate ${nextZone.name}` : 'All zones activated'}</span><strong>${nextZone ? `${this.store.zoneUnlockCost(nextZone.id)}c` : 'COMPLETE'}</strong></div><div class="objective-item"><span>${nextBiome ? `Prepare for ${nextBiome.name}` : 'All biomes unlocked'}</span><strong>${nextBiome ? `Lv ${nextBiome.levelRequired}` : 'COMPLETE'}</strong></div></section>`;
  }

  private collectionDeckCard(): string {
    return `<section class="deck-card"><h3>Collection Intelligence</h3><div class="metric-row"><span class="metric-label">Known Resources</span><span class="metric-value green">${this.state.discovered.length}</span></div><div class="metric-row"><span class="metric-label">Mythic Mutations</span><span class="metric-value gold">${this.state.totals.variantsFound}</span></div><div class="metric-row"><span class="metric-label">Perfected+ Finds</span><span class="metric-value">${this.state.totals.perfectedFinds}</span></div><div class="metric-row"><span class="metric-label">Rare Momentum</span><span class="metric-value cyan">${this.state.rareMomentum}</span></div></section>`;
  }

  private systemDeckCard(): string {
    return `<section class="deck-card"><h3>System Integrity</h3><div class="metric-row"><span class="metric-label">Local Autosave</span><span class="metric-value green">ONLINE</span></div><div class="metric-row"><span class="metric-label">Automation Engine</span><span class="metric-value green">SYNCHRONIZED</span></div><div class="metric-row"><span class="metric-label">Cloud Network</span><span class="metric-value">OPTIONAL</span></div><div class="metric-row"><span class="metric-label">Save Version</span><span class="metric-value">v${this.state.version}</span></div></section>`;
  }

  private showDiscovery(definition: ResourceDefinition, quality: HarvestQuality): void {
    const knownQualities = this.state.discoveredQualities[definition.id] ?? [];
    const message = definition.isVariant ? 'MYTHIC MUTATION DISCOVERED' : knownQualities.length === 1 ? 'CODEX ENTRY UNLOCKED' : `${quality.toUpperCase()} SPECIMEN`;
    this.discoveryLayer.innerHTML = `<div class="discovery-modal ${definition.isVariant ? 'mythic' : ''}"><div class="discovery-radiance"></div><span>${message}</span><div class="discovery-resource-art" style="--resource-color:${this.hex(definition.color)};--resource-glow:${this.hex(definition.glow)}"><strong>${definition.name.slice(0, 1)}</strong></div><h2>${definition.name}</h2><p>${definition.description}</p><div class="discovery-tags"><span>${definition.rarity}</span><span>${quality}</span><span>${definition.nativeBiome}</span></div></div>`;
    this.discoveryLayer.classList.add('visible');
    window.setTimeout(() => this.discoveryLayer.classList.remove('visible'), definition.isVariant ? 4800 : 2800);
  }

  private formatDuration(milliseconds: number): string {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  private hex(value: number): string {
    return `#${value.toString(16).padStart(6, '0')}`;
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
