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
        this.render();
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
    if (this.activeView === 'dashboard') this.renderDashboard();
    else if (this.activeView === 'field') this.renderField();
    else if (this.activeView === 'network') this.renderNetwork();
    else if (this.activeView === 'gatherers') this.renderGatherers();
    else if (this.activeView === 'codex') this.renderCodex();
    else this.renderMarket();
    this.bindRenderedActions();
    this.refreshLiveTimers();
  }

  private renderDashboard(): void {
    const biome = biomes[this.state.currentBiome];
    const active = this.activeGatherers();
    const idle = this.idleGatherers();
    const inventory = this.inventorySummary();
    const nextRecruit = Object.values(gathererTemplates).find((template) => !this.state.network.gatherers.some((gatherer) => gatherer.templateId === template.id));

    this.operationKicker.textContent = 'WORLDROOT COMMAND DASHBOARD';
    this.operationTitle.textContent = `${biome.name} Network Overview`;
    this.operationSubtitle.textContent = 'Direct field activity, automated deployments, Codex intelligence, and progression are synchronized.';

    this.strategicOverlay.innerHTML = `
      <div class="dashboard-core">
        <section class="world-command-map">
          <div class="map-link one"></div><div class="map-link two"></div><div class="map-link three"></div><div class="map-link four"></div>
          <div class="map-radar"><div class="map-radar-sweep"></div></div>
          <div class="map-core">✦</div>
          ${this.dashboardBiomeNode('greenveil')}
          ${this.dashboardBiomeNode('ironfall')}
          ${this.dashboardBiomeNode('crystal-vale')}
          ${this.dashboardBiomeNode('emberdeep')}
        </section>
        <div class="dashboard-side-stack">
          <div class="signal-card"><span>ACTIVE OPERATIONS</span><strong>${active.length}</strong><span>${idle.length} gatherer${idle.length === 1 ? '' : 's'} awaiting deployment</span></div>
          <div class="signal-card"><span>AUTOMATED YIELD</span><strong>${this.state.network.totalAutomatedGathered.toLocaleString()}</strong><span>Lifetime materials returned by the network</span></div>
          <div class="signal-card"><span>INVENTORY VALUE</span><strong>${inventory.value.toLocaleString()} coins</strong><span>${inventory.units.toLocaleString()} stored material units</span></div>
          <div class="signal-card"><span>RARE MATERIAL INTELLIGENCE</span><strong>${this.rareDiscoveryRate()}%</strong><span>Current estimated network discovery potential</span></div>
          <button class="command-button" data-switch-view="field">Enter Live Field Operation</button>
        </div>
      </div>`;

    this.leftPanel.innerHTML = `
      ${this.operatorStatusCard()}
      <section class="telemetry-card">
        <h3 class="panel-title">Command Rank</h3>
        ${this.networkGauge()}
        <div class="metric-row"><span class="metric-label">Gatherer Capacity</span><span class="metric-value">${this.state.network.gatherers.length}/${this.store.maxGathererSlots()}</span></div>
        <div class="metric-row"><span class="metric-label">Command Points</span><span class="metric-value gold">${this.state.network.commandPoints}</span></div>
      </section>
      <section class="telemetry-card">
        <h3 class="panel-title">Gathering Mastery</h3>
        ${this.masteryRows()}
      </section>`;

    this.rightPanel.innerHTML = `
      <section class="telemetry-card">
        <h3 class="panel-title">Active Deployments</h3>
        ${active.length ? active.map((gatherer) => this.activeOperationRow(gatherer)).join('') : '<div class="empty-state">No automated gatherers are deployed.</div>'}
      </section>
      <section class="telemetry-card">
        <h3 class="panel-title">Next Network Expansion</h3>
        ${nextRecruit ? `<div class="metric-row"><div><span class="metric-label">${nextRecruit.name}</span><div class="metric-caption">${nextRecruit.role} · Unlock level ${nextRecruit.unlockLevel}</div></div><span class="metric-value gold">${nextRecruit.recruitCost}c</span></div>` : '<div class="metric-row"><span class="metric-label">All current gatherers recruited</span><span class="metric-value green">COMPLETE</span></div>'}
        <div class="metric-row"><span class="metric-label">Unlocked Zones</span><span class="metric-value">${this.state.network.unlockedZones.length}/${Object.keys(gatheringZones).length}</span></div>
        <div class="metric-row"><span class="metric-label">Unlocked Biomes</span><span class="metric-value">${this.state.unlockedBiomes.length}/${Object.keys(biomes).length}</span></div>
      </section>
      ${this.inventoryMiniCard()}`;

    this.bottomPanel.innerHTML = `
      ${this.activityDeckCard()}
      ${this.objectivesDeckCard()}
      ${this.collectionDeckCard()}
      ${this.systemDeckCard()}`;
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
      </section>
      <section class="telemetry-card"><h3 class="panel-title">Network Capacity</h3>${this.networkGauge()}<div class="metric-row"><span class="metric-label">Available Gatherers</span><span class="metric-value green">${this.idleGatherers().length}</span></div><div class="metric-row"><span class="metric-label">Active Zones</span><span class="metric-value">${this.activeGatherers().length}</span></div></section>`;

    this.rightPanel.innerHTML = `
      <section class="telemetry-card"><h3 class="panel-title">Active Expeditions</h3>${this.activeGatherers().length ? this.activeGatherers().map((gatherer) => this.activeOperationRow(gatherer)).join('') : '<div class="empty-state">No active deployments.</div>'}</section>
      <section class="telemetry-card"><h3 class="panel-title">Idle Gatherers</h3>${this.idleGatherers().map((gatherer) => `<div class="metric-row"><div><span class="metric-label">${gatherer.name}</span><div class="metric-caption">${gatherer.role} · Lv ${gatherer.level}</div></div><span class="metric-value green">READY</span></div>`).join('') || '<div class="empty-state">All gatherers deployed.</div>'}</section>`;

    this.bottomPanel.innerHTML = `${this.activityDeckCard()}${this.networkStatsDeckCard()}${this.objectivesDeckCard()}${this.systemDeckCard()}`;
  }

  private renderGatherers(): void {
    this.operationKicker.textContent = 'GATHERER COMMAND AND LOADOUT';
    this.operationTitle.textContent = 'Worldroot Field Roster';
    this.operationSubtitle.textContent = 'Recruit specialists, improve equipment, and assign the right gatherer to each biome.';

    this.strategicOverlay.innerHTML = `<div class="roster-grid">${this.state.network.gatherers.map((gatherer) => this.gathererCard(gatherer)).join('')}</div>`;

    this.leftPanel.innerHTML = `
      <section class="telemetry-card"><h3 class="panel-title">Roster Capacity</h3>${this.simpleGauge(Math.round((this.state.network.gatherers.length / this.store.maxGathererSlots()) * 100), 'slots occupied')}<div class="metric-row"><span class="metric-label">Recruited</span><span class="metric-value">${this.state.network.gatherers.length}</span></div><div class="metric-row"><span class="metric-label">Maximum Slots</span><span class="metric-value green">${this.store.maxGathererSlots()}</span></div></section>
      <section class="telemetry-card"><h3 class="panel-title">Role Distribution</h3>${this.roleDistribution()}</section>`;

    const recruitable = Object.values(gathererTemplates).filter((template) => !this.state.network.gatherers.some((gatherer) => gatherer.templateId === template.id));
    this.rightPanel.innerHTML = `
      <section class="telemetry-card">
        <h3 class="panel-title">Recruitment Board</h3>
        ${recruitable.map((template) => {
          const canRecruit = this.state.level >= template.unlockLevel && this.state.coins >= template.recruitCost && this.state.network.gatherers.length < this.store.maxGathererSlots();
          return `<div class="metric-row"><div><span class="metric-label">${template.name}</span><div class="metric-caption">${template.role} · Lv ${template.unlockLevel} · ${template.trait}</div></div><button class="command-button" data-recruit="${template.id}" ${canRecruit ? '' : 'disabled'}>${template.recruitCost}c</button></div>`;
        }).join('') || '<div class="empty-state">All current gathering specialists have joined your network.</div>'}
      </section>
      <section class="telemetry-card"><h3 class="panel-title">Network Synergy</h3><div class="metric-row"><span class="metric-label">Specialties Covered</span><span class="metric-value">${new Set(this.state.network.gatherers.map((gatherer) => gatherer.specialty)).size}/4</span></div><div class="metric-row"><span class="metric-label">Average Efficiency</span><span class="metric-value green">${this.averageGathererEfficiency()}%</span></div></section>`;

    this.bottomPanel.innerHTML = `${this.networkStatsDeckCard()}${this.activityDeckCard()}${this.objectivesDeckCard()}${this.systemDeckCard()}`;
  }

  private renderCodex(): void {
    const total = Object.keys(allResources).length;
    const discovered = this.state.discovered.length;
    this.operationKicker.textContent = 'COLLECTION INTELLIGENCE ARCHIVE';
    this.operationTitle.textContent = `Collection Codex ${discovered}/${total}`;
    this.operationSubtitle.textContent = 'Every material, quality tier, Mythic mutation, property, use, and native region is preserved here.';

    const entries = Object.values(resources).map((base) => {
      const variantId = variantByBase[base.id];
      const variant = variantId ? rareVariants[variantId] : undefined;
      return `${this.codexEntry(base, false)}${variant ? this.codexEntry(variant, true) : ''}`;
    }).join('');
    this.strategicOverlay.innerHTML = `<section class="codex-command-grid">${entries}</section>`;

    this.leftPanel.innerHTML = `
      <section class="telemetry-card"><h3 class="panel-title">Codex Completion</h3>${this.simpleGauge(Math.round((discovered / total) * 100), 'overall completion')}<div class="metric-row"><span class="metric-label">Known Materials</span><span class="metric-value green">${discovered}</span></div><div class="metric-row"><span class="metric-label">Mythic Variants</span><span class="metric-value gold">${this.state.totals.variantsFound}/${Object.keys(rareVariants).length}</span></div></section>
      <section class="telemetry-card"><h3 class="panel-title">Specimen Quality</h3>${this.qualitySummary()}</section>`;

    this.rightPanel.innerHTML = `
      <section class="telemetry-card"><h3 class="panel-title">Biome Collections</h3>${(Object.keys(biomes) as BiomeId[]).map((id) => this.biomeCodexProgress(id)).join('')}</section>
      <section class="telemetry-card"><h3 class="panel-title">Discovery Momentum</h3><div class="metric-row"><span class="metric-label">Momentum</span><span class="metric-value gold">${this.state.rareMomentum}/400</span></div><div class="command-progress gold" style="--progress:${Math.min(100, this.state.rareMomentum / 4)}%"><span></span></div></section>`;

    this.bottomPanel.innerHTML = `${this.collectionDeckCard()}${this.activityDeckCard()}${this.objectivesDeckCard()}${this.systemDeckCard()}`;
  }

  private renderMarket(): void {
    this.operationKicker.textContent = 'EQUIPMENT, TOOLS, AND NETWORK INVESTMENT';
    this.operationTitle.textContent = 'Worldroot Upgrade Command';
    this.operationSubtitle.textContent = 'Convert collected value into stronger tools, field gear, and more capable automated gatherers.';

    const toolRows = (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const level = this.state.tools[tool];
      const cost = toolUpgradeCost(level);
      return `<div class="zone-node"><div class="zone-icon" style="--zone-accent:#8ee6a3">✦</div><div class="zone-copy"><strong>${toolNames[tool]}</strong><span>Lv ${level} · ${toolForm(level)} · Next visual and mechanical evolution</span></div><button class="command-button" data-tool="${tool}" ${this.state.coins < cost ? 'disabled' : ''}>${cost}c</button></div>`;
    }).join('');

    const gearInfo: Array<[keyof GameState['gear'], string, string, number]> = [
      ['worldpack', 'Worldpack', 'Gathering radius and future capacity systems', 55],
      ['boots', 'Trail Boots', 'Movement speed and deployment mobility', 48],
      ['fieldKit', 'Field Kit', 'Gear Level and operation readiness', 62],
      ['relicWard', 'Relic Ward', 'Deep-region access and expedition stability', 85],
    ];
    const gearRows = gearInfo.map(([id, name, description, base]) => {
      const level = this.state.gear[id];
      const cost = gearUpgradeCost(level, base);
      return `<div class="zone-node"><div class="zone-icon" style="--zone-accent:#e5c977">⬡</div><div class="zone-copy"><strong>${name}</strong><span>Lv ${level} · ${description}</span></div><button class="command-button" data-gear="${id}" ${this.state.coins < cost ? 'disabled' : ''}>${cost}c</button></div>`;
    }).join('');

    this.strategicOverlay.innerHTML = `<div class="market-command-grid"><section class="command-card"><h3 class="panel-title">Tool Evolution</h3><div class="zone-list">${toolRows}</div></section><section class="command-card"><h3 class="panel-title">Field Equipment</h3><div class="zone-list">${gearRows}</div></section><section class="command-card full-span"><h3 class="panel-title">Gatherer Loadout Investment</h3><div class="roster-grid">${this.state.network.gatherers.map((gatherer) => this.gathererUpgradeCard(gatherer)).join('')}</div></section></div>`;

    this.leftPanel.innerHTML = `
      <section class="telemetry-card"><h3 class="panel-title">Available Capital</h3>${this.simpleGauge(Math.min(100, Math.round(this.state.coins / 25)), 'coin reserve')}<div class="metric-row"><span class="metric-label">Coins</span><span class="metric-value gold">${this.state.coins.toLocaleString()}</span></div><button class="command-button" id="market-sell-all">Sell All Resources</button></section>
      ${this.inventoryMiniCard()}`;

    this.rightPanel.innerHTML = `<section class="telemetry-card"><h3 class="panel-title">Upgrade Readiness</h3><div class="metric-row"><span class="metric-label">Tool Levels</span><span class="metric-value">${(Object.keys(toolNames) as ToolId[]).reduce((sum, tool) => sum + this.state.tools[tool], 0)}</span></div><div class="metric-row"><span class="metric-label">Gear Level</span><span class="metric-value green">${gearLevel(this.state as GameState)}</span></div><div class="metric-row"><span class="metric-label">Gatherer Equipment</span><span class="metric-value">${this.state.network.gatherers.reduce((sum, gatherer) => sum + gatherer.equipmentLevel, 0)}</span></div></section>${this.networkGaugeCard()}`;

    this.bottomPanel.innerHTML = `${this.networkStatsDeckCard()}${this.collectionDeckCard()}${this.activityDeckCard()}${this.systemDeckCard()}`;
  }

  private dashboardBiomeNode(biomeId: BiomeId): string {
    const biome = biomes[biomeId];
    const unlocked = this.state.unlockedBiomes.includes(biomeId);
    const active = this.state.network.gatherers.filter((gatherer) => gatherer.assignedZoneId && gatheringZones[gatherer.assignedZoneId]?.biomeId === biomeId).length;
    const zones = zonesByBiome(biomeId);
    return `<article class="map-biome-node ${biomeId} ${unlocked ? '' : 'locked'}"><h4>${biome.name}</h4><p>${unlocked ? `${active} active gatherer${active === 1 ? '' : 's'} · ${zones.filter((zone) => this.state.network.unlockedZones.includes(zone.id)).length}/${zones.length} zones` : `Requires Level ${biome.levelRequired} and Gear ${biome.gearRequired}`}</p></article>`;
  }

  private biomeSector(biomeId: BiomeId): string {
    const biome = biomes[biomeId];
    const unlockedBiome = this.state.unlockedBiomes.includes(biomeId);
    const zones = zonesByBiome(biomeId);
    const accent = zones[0]?.accent ?? '#8ee6a3';
    return `<section class="biome-sector" style="--sector-accent:${accent}24"><h3>${biome.name}</h3><p>${biome.subtitle}</p><div class="zone-list">${zones.map((zone) => this.zoneNode(zone, unlockedBiome)).join('')}</div></section>`;
  }

  private zoneNode(zone: GatheringZoneDefinition, biomeUnlocked: boolean): string {
    const unlocked = this.state.network.unlockedZones.includes(zone.id);
    const assigned = this.state.network.gatherers.find((gatherer) => gatherer.assignedZoneId === zone.id);
    const eligible = biomeUnlocked && this.state.level >= zone.unlockLevel;
    const idle = this.idleGatherers();
    let actions = '';
    if (assigned) {
      actions = `<span class="gatherer-status deployed">${assigned.name}</span>`;
    } else if (unlocked && idle.length) {
      actions = `<select data-zone-select="${zone.id}">${idle.map((gatherer) => `<option value="${gatherer.id}">${gatherer.name}</option>`).join('')}</select><button class="command-button" data-assign-zone="${zone.id}">DEPLOY</button>`;
    } else if (unlocked) {
      actions = '<span class="gatherer-status">READY</span>';
    } else {
      const cost = this.store.zoneUnlockCost(zone.id);
      actions = `<button class="command-button" data-unlock-zone="${zone.id}" ${eligible && this.state.coins >= cost ? '' : 'disabled'}>${cost}c</button>`;
    }
    return `<div class="zone-node ${unlocked ? '' : 'locked'}"><div class="zone-icon" style="--zone-accent:${zone.accent}">${unlocked ? '✦' : '◇'}</div><div class="zone-copy"><strong>${zone.name}</strong><span>Tier ${zone.tier} · ${zone.danger} risk · ${zone.durationSeconds}s base cycle · ${zone.resources.length} resource families</span></div><div class="zone-actions">${actions}</div></div>`;
  }

  private gathererCard(gatherer: GathererState): string {
    const template = gathererTemplates[gatherer.templateId];
    const zone = gatherer.assignedZoneId ? gatheringZones[gatherer.assignedZoneId] : undefined;
    const xpNeed = this.gathererXpForLevel(gatherer.level);
    const progress = Math.min(100, (gatherer.xp / xpNeed) * 100);
    const upgradeCost = this.store.gathererUpgradeCost(gatherer.id);
    return `<article class="gatherer-card"><div class="gatherer-header"><div class="gatherer-avatar">${this.roleIcon(gatherer.role)}</div><div><h3>${gatherer.name}</h3><p>${gatherer.role} · ${toolNames[gatherer.specialty]} specialist</p></div></div><span class="gatherer-status ${zone ? 'deployed' : ''}">${zone ? zone.name : 'Idle'}</span><div class="gatherer-trait">${template?.trait ?? 'Experienced field gatherer.'}</div><div class="metric-row"><span class="metric-label">Level</span><span class="metric-value">${gatherer.level}</span></div><div class="command-progress" style="--progress:${progress}%"><span></span></div><div class="metric-row"><span class="metric-label">Efficiency</span><span class="metric-value green">${Math.round(gatherer.efficiency * 100)}%</span></div><div class="metric-row"><span class="metric-label">Equipment Tier</span><span class="metric-value gold">${gatherer.equipmentLevel}</span></div><div class="metric-row"><span class="metric-label">Lifetime Yield</span><span class="metric-value">${gatherer.totalGathered.toLocaleString()}</span></div><div class="button-row"><button class="command-button" data-upgrade-gatherer="${gatherer.id}" ${this.state.coins < upgradeCost ? 'disabled' : ''}>Upgrade ${upgradeCost}c</button>${zone ? `<button class="command-button-danger" data-recall-gatherer="${gatherer.id}">Recall</button>` : ''}</div></article>`;
  }

  private gathererUpgradeCard(gatherer: GathererState): string {
    const cost = this.store.gathererUpgradeCost(gatherer.id);
    return `<article class="gatherer-card"><div class="gatherer-header"><div class="gatherer-avatar">${this.roleIcon(gatherer.role)}</div><div><h3>${gatherer.name}</h3><p>${gatherer.role} · Equipment Tier ${gatherer.equipmentLevel}</p></div></div><div class="metric-row"><span class="metric-label">Efficiency</span><span class="metric-value green">${Math.round(gatherer.efficiency * 100)}%</span></div><div class="metric-row"><span class="metric-label">Endurance</span><span class="metric-value">${gatherer.endurance}</span></div><div class="metric-row"><span class="metric-label">Fortune</span><span class="metric-value gold">${gatherer.fortune}</span></div><button class="command-button" data-upgrade-gatherer="${gatherer.id}" ${this.state.coins < cost ? 'disabled' : ''}>Improve Loadout ${cost}c</button></article>`;
  }

  private operatorStatusCard(): string {
    const needed = xpForLevel(this.state.level);
    const progress = Math.min(100, (this.state.xp / needed) * 100);
    return `<section class="telemetry-card"><h3 class="panel-title">Operator Status</h3><div class="metric-row"><div><span class="metric-label">${this.escape(this.state.playerName)}</span><div class="metric-caption">Worldroot Commander · Level ${this.state.level}</div></div><span class="metric-value gold">RANK ${this.state.level}</span></div><div class="command-progress" style="--progress:${progress}%"><span></span></div><div class="metric-caption">${this.state.xp.toLocaleString()} / ${needed.toLocaleString()} XP</div><div class="metric-row"><span class="metric-label">Unspent Stat Points</span><span class="metric-value green">${this.state.statPoints}</span></div>${(Object.keys(statNames) as StatId[]).map((stat) => `<div class="metric-row"><span class="metric-label">${statNames[stat]}</span><div><span class="metric-value">${this.state.stats[stat]}</span> <button class="command-button-secondary" data-stat="${stat}" ${this.state.statPoints <= 0 ? 'disabled' : ''}>+</button></div></div>`).join('')}</section>`;
  }

  private masteryRows(): string {
    return (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const skill = this.state.skills[tool];
      const needed = skillXpForLevel(skill.level);
      const progress = Math.min(100, (skill.xp / needed) * 100);
      return `<div class="metric-row"><div style="min-width:0;flex:1"><span class="metric-label">${toolNames[tool]}</span><div class="command-progress" style="--progress:${progress}%"><span></span></div><div class="metric-caption">${skill.xp}/${needed} mastery XP</div></div><span class="metric-value">Lv ${skill.level}</span></div>`;
    }).join('');
  }

  private activeOperationRow(gatherer: GathererState): string {
    const zone = gatherer.assignedZoneId ? gatheringZones[gatherer.assignedZoneId] : undefined;
    if (!zone) return '';
    const duration = this.store.automationCycleDuration(gatherer, zone);
    const elapsed = Math.max(0, Date.now() - (gatherer.lastCycleAt ?? Date.now()));
    const progress = Math.min(100, (elapsed / duration) * 100);
    const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
    return `<div class="metric-row"><div style="min-width:0;flex:1"><span class="metric-label">${gatherer.name}</span><div class="metric-caption">${zone.name} · ${zone.danger} risk</div><div class="command-progress" data-cycle-progress="${gatherer.id}" style="--progress:${progress}%"><span></span></div></div><span class="metric-value green" data-cycle-time="${gatherer.id}">${remaining}s</span></div>`;
  }

  private inventoryMiniCard(): string {
    const summary = this.inventorySummary();
    const groups = new Map<string, number>();
    for (const [key, amount] of Object.entries(this.state.inventory)) {
      if (amount <= 0) continue;
      const { resourceId } = parseInventoryKey(key);
      const name = allResources[resourceId]?.name ?? resourceId;
      groups.set(name, (groups.get(name) ?? 0) + amount);
    }
    const top = [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    return `<section class="telemetry-card"><h3 class="panel-title">Inventory and Value</h3><div class="metric-row"><span class="metric-label">Stored Units</span><span class="metric-value">${summary.units.toLocaleString()}</span></div><div class="metric-row"><span class="metric-label">Market Estimate</span><span class="metric-value gold">${summary.value.toLocaleString()}c</span></div><div class="inventory-mini-grid">${top.map(([name, amount]) => `<div class="inventory-mini"><strong>${amount}</strong><span>${name}</span></div>`).join('') || '<div class="empty-state full-span">No stored resources.</div>'}</div></section>`;
  }

  private networkGauge(): string {
    const needed = this.networkXpForLevel(this.state.network.level);
    const percentage = Math.min(100, Math.round((this.state.network.xp / needed) * 100));
    return `${this.simpleGauge(percentage, `network Lv ${this.state.network.level}`)}<div class="metric-caption" style="text-align:center">${this.state.network.xp}/${needed} network XP</div>`;
  }

  private networkGaugeCard(): string {
    return `<section class="telemetry-card"><h3 class="panel-title">Worldroot Network</h3>${this.networkGauge()}<div class="metric-row"><span class="metric-label">Automated Yield</span><span class="metric-value green">${this.state.network.totalAutomatedGathered.toLocaleString()}</span></div></section>`;
  }

  private simpleGauge(value: number, label: string): string {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    return `<div class="command-gauge" style="--gauge:${clamped}%"><div class="command-gauge-content"><strong>${clamped}%</strong><span>${label}</span></div></div>`;
  }

  private activityDeckCard(): string {
    return `<section class="deck-card"><h3 class="panel-title">System Feed</h3><div class="activity-feed">${this.state.network.activity.slice(0, 6).map((item) => `<div class="activity-item ${item.tone}"><span class="activity-time">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><div class="activity-copy"><strong>${item.title}</strong><span>${item.detail}</span></div></div>`).join('')}</div></section>`;
  }

  private objectivesDeckCard(): string {
    const nextZone = Object.values(gatheringZones).find((zone) => !this.state.network.unlockedZones.includes(zone.id) && this.state.unlockedBiomes.includes(zone.biomeId));
    const nextRecruit = Object.values(gathererTemplates).find((template) => !this.state.network.gatherers.some((gatherer) => gatherer.templateId === template.id));
    return `<section class="deck-card"><h3 class="panel-title">Mission Objectives</h3><div class="objective-list"><div class="objective"><span class="objective-mark">✓</span><span class="objective-copy">Maintain an active automated deployment</span><span class="objective-value">${this.activeGatherers().length ? 'ONLINE' : '0/1'}</span></div><div class="objective"><span class="objective-mark">◇</span><span class="objective-copy">Unlock the next gathering zone</span><span class="objective-value">${nextZone?.name ?? 'COMPLETE'}</span></div><div class="objective"><span class="objective-mark">◇</span><span class="objective-copy">Recruit the next specialist</span><span class="objective-value">${nextRecruit?.name ?? 'COMPLETE'}</span></div><div class="objective"><span class="objective-mark">◇</span><span class="objective-copy">Discover all Mythic variants</span><span class="objective-value">${this.state.totals.variantsFound}/${Object.keys(rareVariants).length}</span></div></div></section>`;
  }

  private collectionDeckCard(): string {
    const total = Object.keys(allResources).length;
    const discovered = this.state.discovered.length;
    const percent = Math.round((discovered / total) * 100);
    return `<section class="deck-card"><h3 class="panel-title">Collection Tracker</h3><div class="metric-row"><span class="metric-label">Codex Entries</span><span class="metric-value green">${discovered}/${total}</span></div><div class="command-progress" style="--progress:${percent}%"><span></span></div><div class="metric-row"><span class="metric-label">Mythic Variants</span><span class="metric-value gold">${this.state.totals.variantsFound}</span></div><div class="metric-row"><span class="metric-label">Perfected+ Finds</span><span class="metric-value">${this.state.totals.perfectedFinds}</span></div></section>`;
  }

  private systemDeckCard(): string {
    const boostSeconds = Math.max(0, Math.ceil((this.state.activeBoostUntil - Date.now()) / 1000));
    return `<section class="deck-card"><h3 class="panel-title">System Overview</h3><div class="metric-row"><span class="metric-label">Environment</span><span class="metric-value green">${biomes[this.state.currentBiome].name}</span></div><div class="metric-row"><span class="metric-label">Save System</span><span class="metric-value green">ONLINE</span></div><div class="metric-row"><span class="metric-label">Discovery Resonance</span><span class="metric-value ${boostSeconds > 0 ? 'gold' : ''}">${boostSeconds > 0 ? `${boostSeconds}s` : 'DORMANT'}</span></div><div class="metric-row"><span class="metric-label">Network Stability</span><span class="metric-value cyan">${Math.max(55, 100 - this.activeGatherers().length * 3)}%</span></div></section>`;
  }

  private networkStatsDeckCard(): string {
    return `<section class="deck-card"><h3 class="panel-title">Network Telemetry</h3><div class="metric-row"><span class="metric-label">Network Level</span><span class="metric-value green">${this.state.network.level}</span></div><div class="metric-row"><span class="metric-label">Completed Cycles</span><span class="metric-value">${this.state.network.expeditionsCompleted.toLocaleString()}</span></div><div class="metric-row"><span class="metric-label">Automated Materials</span><span class="metric-value gold">${this.state.network.totalAutomatedGathered.toLocaleString()}</span></div><div class="metric-row"><span class="metric-label">Average Efficiency</span><span class="metric-value">${this.averageGathererEfficiency()}%</span></div></section>`;
  }

  private codexEntry(definition: ResourceDefinition, variant: boolean): string {
    const known = this.state.discovered.includes(definition.id);
    if (!known && variant) {
      return `<article class="codex-entry codex-locked"><div class="codex-silhouette">◆</div><div><span class="badge mythic-badge">UNKNOWN VARIANT</span><h3>Unidentified Material</h3></div><p>A hidden mutation of ${resources[definition.baseId ?? '']?.name ?? 'a known resource'}. Harvest it directly or through a network expedition to reveal its identity.</p></article>`;
    }
    if (!known) {
      return `<article class="codex-entry codex-locked"><div class="codex-silhouette">●</div><div><span class="badge">UNDISCOVERED</span><h3>${definition.name}</h3></div><p>Native region: ${biomes[definition.nativeBiome].name}. Gather this material to unlock its complete record.</p></article>`;
    }
    const qualities = this.state.discoveredQualities[definition.id] ?? ['Standard'];
    const qualityBadges = (Object.keys(qualityDefinitions) as HarvestQuality[]).map((quality) => {
      const found = qualities.includes(quality);
      return `<span class="quality-chip ${found ? 'found' : 'missing'}" style="--quality-color:${qualityDefinitions[quality].color}">${found ? quality : '◆'}</span>`;
    }).join('');
    return `<article class="codex-entry ${variant ? 'codex-mythic' : ''}"><div class="codex-orb" style="--resource-color:#${definition.glow.toString(16).padStart(6, '0')}"></div><div><span class="badge ${variant ? 'mythic-badge' : ''}">${definition.rarity}${variant ? ' VARIANT' : ''}</span><h3>${definition.name}</h3><span class="row-subtitle">${biomes[definition.nativeBiome].name}</span></div><p><strong>Lore:</strong> ${definition.lore}</p><p><strong>Properties:</strong> ${definition.properties}</p><p><strong>Potential uses:</strong> ${definition.uses}</p><div class="quality-track">${qualityBadges}</div></article>`;
  }

  private bindRenderedActions(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-switch-view]').forEach((button) => button.addEventListener('click', () => this.switchView((button.dataset.switchView as CommandView | undefined) ?? 'dashboard')));
    document.querySelectorAll<HTMLButtonElement>('[data-stat]').forEach((button) => button.addEventListener('click', () => this.store.allocateStat(button.dataset.stat as StatId)));
    document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((button) => button.addEventListener('click', () => this.store.upgradeTool(button.dataset.tool as ToolId)));
    document.querySelectorAll<HTMLButtonElement>('[data-gear]').forEach((button) => button.addEventListener('click', () => this.store.upgradeGear(button.dataset.gear as keyof GameState['gear'])));
    document.querySelectorAll<HTMLButtonElement>('[data-recruit]').forEach((button) => button.addEventListener('click', () => this.store.recruitGatherer(button.dataset.recruit ?? '')));
    document.querySelectorAll<HTMLButtonElement>('[data-upgrade-gatherer]').forEach((button) => button.addEventListener('click', () => this.store.upgradeGatherer(button.dataset.upgradeGatherer ?? '')));
    document.querySelectorAll<HTMLButtonElement>('[data-recall-gatherer]').forEach((button) => button.addEventListener('click', () => this.store.recallGatherer(button.dataset.recallGatherer ?? '')));
    document.querySelectorAll<HTMLButtonElement>('[data-unlock-zone]').forEach((button) => button.addEventListener('click', () => this.store.unlockZone(button.dataset.unlockZone ?? '')));
    document.querySelectorAll<HTMLButtonElement>('[data-assign-zone]').forEach((button) => button.addEventListener('click', () => {
      const zoneId = button.dataset.assignZone ?? '';
      const select = document.querySelector<HTMLSelectElement>(`[data-zone-select="${zoneId}"]`);
      if (select?.value) this.store.assignGatherer(select.value, zoneId);
    }));
    document.querySelectorAll<HTMLButtonElement>('[data-unlock-biome]').forEach((button) => button.addEventListener('click', () => this.store.unlockBiome(button.dataset.unlockBiome as BiomeId)));
    document.querySelectorAll<HTMLButtonElement>('[data-travel-biome]').forEach((button) => button.addEventListener('click', () => {
      const biome = button.dataset.travelBiome as BiomeId;
      if (biome !== this.state.currentBiome) this.store.travel(biome);
    }));
    document.querySelector<HTMLButtonElement>('#market-sell-all')?.addEventListener('click', () => this.store.sellAll());
  }

  private switchView(view: CommandView): void {
    this.activeView = view;
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === view));
    this.render();
  }

  private refreshLiveTimers(): void {
    for (const gatherer of this.activeGatherers()) {
      if (!gatherer.assignedZoneId) continue;
      const zone = gatheringZones[gatherer.assignedZoneId];
      if (!zone) continue;
      const duration = this.store.automationCycleDuration(gatherer, zone);
      const elapsed = Math.max(0, Date.now() - (gatherer.lastCycleAt ?? Date.now()));
      const cycleElapsed = elapsed % duration;
      const progress = Math.min(100, (cycleElapsed / duration) * 100);
      const remaining = Math.max(0, Math.ceil((duration - cycleElapsed) / 1000));
      document.querySelectorAll<HTMLElement>(`[data-cycle-progress="${gatherer.id}"]`).forEach((element) => element.style.setProperty('--progress', `${progress}%`));
      document.querySelectorAll<HTMLElement>(`[data-cycle-time="${gatherer.id}"]`).forEach((element) => { element.textContent = `${remaining}s`; });
    }
  }

  private updateClock(): void {
    this.serverTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private inventorySummary(): { units: number; value: number } {
    let units = 0;
    let value = 0;
    for (const [key, amount] of Object.entries(this.state.inventory)) {
      if (amount <= 0) continue;
      const { resourceId, quality } = parseInventoryKey(key);
      units += amount;
      value += Math.floor((allResources[resourceId]?.value ?? 0) * qualityDefinitions[quality].valueMultiplier * amount);
    }
    return { units, value };
  }

  private activeGatherers(): GathererState[] { return this.state.network.gatherers.filter((gatherer) => Boolean(gatherer.assignedZoneId)); }
  private idleGatherers(): GathererState[] { return this.state.network.gatherers.filter((gatherer) => !gatherer.assignedZoneId); }

  private averageGathererEfficiency(): number {
    if (!this.state.network.gatherers.length) return 0;
    return Math.round((this.state.network.gatherers.reduce((sum, gatherer) => sum + gatherer.efficiency, 0) / this.state.network.gatherers.length) * 100);
  }

  private rareDiscoveryRate(): number {
    const gathererFortune = this.state.network.gatherers.reduce((sum, gatherer) => sum + gatherer.fortune, 0);
    return Math.min(99, Math.round((2.5 + this.state.stats.fortune * .7 + gathererFortune * .28 + this.state.network.level * .45 + this.state.rareMomentum * .018) * 10) / 10);
  }

  private roleDistribution(): string {
    const counts = new Map<string, number>();
    this.state.network.gatherers.forEach((gatherer) => counts.set(gatherer.role, (counts.get(gatherer.role) ?? 0) + 1));
    return [...counts.entries()].map(([role, count]) => `<div class="metric-row"><span class="metric-label">${role}</span><span class="metric-value">${count}</span></div>`).join('');
  }

  private qualitySummary(): string {
    const qualityCounts = new Map<HarvestQuality, number>();
    for (const qualities of Object.values(this.state.discoveredQualities)) {
      qualities.forEach((quality) => qualityCounts.set(quality, (qualityCounts.get(quality) ?? 0) + 1));
    }
    return (Object.keys(qualityDefinitions) as HarvestQuality[]).map((quality) => `<div class="metric-row"><span class="metric-label">${quality}</span><span class="metric-value">${qualityCounts.get(quality) ?? 0}</span></div>`).join('');
  }

  private biomeCodexProgress(biomeId: BiomeId): string {
    const entries = Object.values(allResources).filter((resource) => resource.nativeBiome === biomeId);
    const known = entries.filter((resource) => this.state.discovered.includes(resource.id)).length;
    const percent = entries.length ? Math.round((known / entries.length) * 100) : 0;
    return `<div class="metric-row"><div style="min-width:0;flex:1"><span class="metric-label">${biomes[biomeId].name}</span><div class="command-progress" style="--progress:${percent}%"><span></span></div></div><span class="metric-value">${known}/${entries.length}</span></div>`;
  }

  private roleIcon(role: GathererState['role']): string {
    if (role === 'Miner') return '⛏';
    if (role === 'Harvester') return '⌁';
    if (role === 'Relic Seeker') return '◆';
    if (role === 'Surveyor') return '◎';
    if (role === 'Expedition Leader') return '✦';
    return '❧';
  }

  private networkXpForLevel(level: number): number { return Math.floor(140 + Math.pow(level, 1.5) * 95); }
  private gathererXpForLevel(level: number): number { return Math.floor(90 + Math.pow(level, 1.42) * 70); }

  private showDiscovery(definition: ResourceDefinition, quality: HarvestQuality): void {
    const nativeBiome = biomes[definition.nativeBiome].name;
    this.discoveryLayer.innerHTML = `<div class="discovery-backdrop"></div><article class="discovery-card ${definition.isVariant ? 'mythic-discovery' : ''}"><p class="discovery-kicker">${definition.isVariant ? 'MYTHIC NETWORK DISCOVERY' : 'NEW CODEX ENTRY'}</p><div class="discovery-orb" style="--resource-color:#${definition.glow.toString(16).padStart(6, '0')}"></div><h2>${definition.name}</h2><p class="discovery-rarity">${quality} · ${definition.rarity} · ${nativeBiome}</p><p>${definition.lore}</p><div class="discovery-detail"><strong>Unique properties</strong><span>${definition.properties}</span></div><div class="discovery-detail"><strong>Potential uses</strong><span>${definition.uses}</span></div><button class="primary-button" id="close-discovery">Add to Collection Codex</button></article>`;
    this.discoveryLayer.classList.add('visible');
    const close = () => {
      this.discoveryLayer.classList.remove('visible');
      window.setTimeout(() => { this.discoveryLayer.innerHTML = ''; }, 250);
    };
    this.discoveryLayer.querySelector<HTMLButtonElement>('#close-discovery')?.addEventListener('click', close);
    this.discoveryLayer.querySelector<HTMLElement>('.discovery-backdrop')?.addEventListener('click', close);
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
