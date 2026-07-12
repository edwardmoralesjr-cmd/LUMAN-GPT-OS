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
import { gearLevel, gearUpgradeCost, skillXpForLevel, toolUpgradeCost, xpForLevel } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState } from '../state/GameState';
import type { CloudStatus } from '../systems/SaveService';

export class UIController {
  private activeTab = 'status';
  private state: Readonly<GameState>;
  private panel: HTMLElement;
  private saveStatus: HTMLElement;
  private cloudButton: HTMLButtonElement;
  private discoveryLayer: HTMLElement;

  constructor(private store: GameStore) {
    this.state = store.snapshot;
    const panel = document.querySelector<HTMLElement>('#panel-content');
    const saveStatus = document.querySelector<HTMLElement>('#save-status');
    const cloudButton = document.querySelector<HTMLButtonElement>('#cloud-button');
    const discoveryLayer = document.querySelector<HTMLElement>('#discovery-layer');
    if (!panel || !saveStatus || !cloudButton || !discoveryLayer) throw new Error('Required interface elements are missing.');
    this.panel = panel;
    this.saveStatus = saveStatus;
    this.cloudButton = cloudButton;
    this.discoveryLayer = discoveryLayer;

    document.querySelectorAll<HTMLButtonElement>('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.dataset.tab ?? 'status';
        document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
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
  }

  bindCloudButton(handler: () => Promise<void>): void {
    this.cloudButton.addEventListener('click', () => void handler());
  }

  setCloudStatus(status: CloudStatus): void {
    if (!status.configured) {
      this.cloudButton.textContent = 'Cloud Setup Needed';
      this.cloudButton.title = 'Add Supabase environment variables to enable GitHub account cloud saves.';
      return;
    }
    this.cloudButton.textContent = status.user ? 'Sync Cloud Save' : 'Connect GitHub Save';
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
    window.setTimeout(() => toast.remove(), 3400);
  }

  private render(): void {
    if (this.activeTab === 'inventory') this.renderInventory();
    else if (this.activeTab === 'codex') this.renderCodex();
    else if (this.activeTab === 'market') this.renderMarket();
    else if (this.activeTab === 'biomes') this.renderBiomes();
    else this.renderStatus();
  }

  private renderStatus(): void {
    const xpNeeded = xpForLevel(this.state.level);
    const progress = Math.min(100, (this.state.xp / xpNeeded) * 100);
    const boostSeconds = Math.max(0, Math.ceil((this.state.activeBoostUntil - Date.now()) / 1000));
    const stats = (Object.keys(statNames) as StatId[]).map((stat) => `
      <div class="stat-row">
        <span class="row-title">${statNames[stat]}</span>
        <div>
          <span class="value">${this.state.stats[stat]}</span>
          <button class="small-button" data-stat="${stat}" ${this.state.statPoints <= 0 ? 'disabled' : ''}>+</button>
        </div>
      </div>`).join('');

    const skills = (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const skill = this.state.skills[tool];
      const needed = skillXpForLevel(skill.level);
      return `
        <div class="stat-row">
          <div class="row-main">
            <span class="row-title">${toolNames[tool]} Mastery</span>
            <span class="row-subtitle">${skill.xp} / ${needed} mastery XP</span>
          </div>
          <span class="value">Lv ${skill.level}</span>
        </div>`;
    }).join('');

    this.panel.innerHTML = `
      <section class="card">
        <span class="badge">Level ${this.state.level}</span>
        <span class="badge">Gear ${gearLevel(this.state as GameState)}</span>
        <span class="badge">${this.state.coins} coins</span>
        <span class="badge">${this.state.discovered.length}/${Object.keys(allResources).length} Codex</span>
        <h2 style="margin-top:10px">${this.escape(this.state.playerName)}</h2>
        <p>${this.state.xp} / ${xpNeeded} XP toward the next gathering level</p>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        <p>${this.state.statPoints} unspent stat point${this.state.statPoints === 1 ? '' : 's'}</p>
        ${boostSeconds > 0 ? `<div class="boost-banner">✦ Discovery Resonance active for about ${boostSeconds}s</div>` : ''}
      </section>
      <section class="card"><h3>Permanent Stats</h3>${stats}</section>
      <section class="card"><h3>Gathering Mastery</h3>${skills}</section>
      <section class="card">
        <h3>Lifetime Path</h3>
        <div class="stat-row"><span>Total gathered</span><span class="value">${this.state.totals.gathered}</span></div>
        <div class="stat-row"><span>Critical harvests</span><span class="value">${this.state.totals.criticalHarvests}</span></div>
        <div class="stat-row"><span>Surprise events</span><span class="value">${this.state.totals.surpriseEvents}</span></div>
        <div class="stat-row"><span>Mythic variants found</span><span class="value">${this.state.totals.variantsFound}</span></div>
        <div class="stat-row"><span>Perfected+ specimens</span><span class="value">${this.state.totals.perfectedFinds}</span></div>
        <div class="stat-row"><span>Discovery momentum</span><span class="value">${this.state.rareMomentum}</span></div>
      </section>`;

    this.panel.querySelectorAll<HTMLButtonElement>('[data-stat]').forEach((button) => {
      button.addEventListener('click', () => this.store.allocateStat(button.dataset.stat as StatId));
    });
  }

  private renderInventory(): void {
    const entries = Object.entries(this.state.inventory).filter(([, amount]) => amount > 0);
    const value = entries.reduce((sum, [key, amount]) => {
      const { resourceId, quality } = parseInventoryKey(key);
      return sum + Math.floor((allResources[resourceId]?.value ?? 0) * qualityDefinitions[quality].valueMultiplier * amount);
    }, 0);

    const rows = entries.length ? entries.map(([key, amount]) => {
      const { resourceId, quality } = parseInventoryKey(key);
      const definition = allResources[resourceId];
      if (!definition) return '';
      const unitValue = Math.floor(definition.value * qualityDefinitions[quality].valueMultiplier);
      return `
        <div class="resource-row quality-${quality.toLowerCase()}">
          <div class="resource-swatch" style="--resource-color:#${definition.glow.toString(16).padStart(6, '0')}"></div>
          <div class="row-main">
            <span class="row-title">${quality === 'Standard' ? '' : `${quality} `}${definition.name}</span>
            <span class="row-subtitle">${definition.rarity}${definition.isVariant ? ' Variant' : ''} · ${unitValue} coins each</span>
          </div>
          <span class="value">${amount}</span>
        </div>`;
    }).join('') : '<div class="empty-state">Your Worldpack is empty. Walk near a resource to gather it.</div>';

    this.panel.innerHTML = `
      <section class="card">
        <h2>Worldpack</h2>
        <p>Unlimited carrying capacity. Elevated specimens and Mythic variants sell for far more than ordinary materials.</p>
        <div class="stat-row"><span>Current sale value</span><span class="value">${value} coins</span></div>
        <div class="button-row"><button id="sell-all-inventory" class="primary-button" ${entries.length ? '' : 'disabled'}>Sell Everything</button></div>
      </section>
      <section class="card"><h3>Gathered Resources</h3>${rows}</section>`;

    this.panel.querySelector<HTMLButtonElement>('#sell-all-inventory')?.addEventListener('click', () => this.store.sellAll());
  }

  private renderCodex(): void {
    const total = Object.keys(allResources).length;
    const discovered = this.state.discovered.length;
    const nextMilestone = [5, 10, 15, 20].find((value) => value > discovered) ?? total;
    const collectionProgress = Math.min(100, (discovered / total) * 100);
    const entries = Object.values(resources).map((base) => {
      const variantId = variantByBase[base.id];
      const variant = variantId ? rareVariants[variantId] : undefined;
      return `${this.codexEntry(base, false)}${variant ? this.codexEntry(variant, true) : ''}`;
    }).join('');

    this.panel.innerHTML = `
      <section class="card codex-summary">
        <span class="badge">${discovered} / ${total} entries</span>
        <span class="badge">${this.state.totals.variantsFound} / ${Object.keys(rareVariants).length} Mythic variants</span>
        <h2 style="margin-top:10px">Collection Codex</h2>
        <p>Rare variants remain unidentified until the moment you successfully harvest them.</p>
        <div class="progress-track"><div class="progress-fill codex-fill" style="width:${collectionProgress}%"></div></div>
        <p>${discovered >= total ? 'Master collection complete.' : `${Math.max(0, nextMilestone - discovered)} discoveries until the next collection reward.`}</p>
      </section>
      <section class="codex-grid">${entries}</section>`;
  }

  private codexEntry(definition: ResourceDefinition, variant: boolean): string {
    const known = this.state.discovered.includes(definition.id);
    if (!known && variant) {
      return `
        <article class="codex-entry codex-locked">
          <div class="codex-silhouette">◆</div>
          <div><span class="badge mythic-badge">UNKNOWN VARIANT</span><h3>Unidentified Material</h3></div>
          <p>A hidden mutation of ${resources[definition.baseId ?? '']?.name ?? 'a known resource'}. Harvest it to reveal its identity, lore, properties, and uses.</p>
        </article>`;
    }

    if (!known) {
      return `
        <article class="codex-entry codex-locked">
          <div class="codex-silhouette">●</div>
          <div><span class="badge">UNDISCOVERED</span><h3>${definition.name}</h3></div>
          <p>Native region: ${biomes[definition.nativeBiome].name}. Gather this material to unlock its complete record.</p>
        </article>`;
    }

    const qualities = this.state.discoveredQualities[definition.id] ?? ['Standard'];
    const qualityBadges = (Object.keys(qualityDefinitions) as HarvestQuality[]).map((quality) => {
      const found = qualities.includes(quality);
      return `<span class="quality-chip ${found ? 'found' : 'missing'}" style="--quality-color:${qualityDefinitions[quality].color}">${found ? quality : '◆'}</span>`;
    }).join('');

    return `
      <article class="codex-entry ${variant ? 'codex-mythic' : ''}">
        <div class="codex-orb" style="--resource-color:#${definition.glow.toString(16).padStart(6, '0')}"></div>
        <div>
          <span class="badge ${variant ? 'mythic-badge' : ''}">${definition.rarity}${variant ? ' VARIANT' : ''}</span>
          <h3>${definition.name}</h3>
          <span class="row-subtitle">${biomes[definition.nativeBiome].name}</span>
        </div>
        <p><strong>Lore:</strong> ${definition.lore}</p>
        <p><strong>Properties:</strong> ${definition.properties}</p>
        <p><strong>Potential uses:</strong> ${definition.uses}</p>
        <div class="quality-track">${qualityBadges}</div>
      </article>`;
  }

  private renderMarket(): void {
    const tools = (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const level = this.state.tools[tool];
      const cost = toolUpgradeCost(level);
      return `
        <div class="shop-row">
          <div class="tool-emblem tool-${tool}" data-tier="${Math.min(4, Math.floor((level - 1) / 4))}">✦</div>
          <div class="row-main">
            <span class="row-title">${toolNames[tool]}</span>
            <span class="row-subtitle">Level ${level} · ${toolForm(level)} · improves yield and visible form</span>
          </div>
          <button class="small-button" data-tool="${tool}" ${this.state.coins < cost ? 'disabled' : ''}>${cost} coins</button>
        </div>`;
    }).join('');

    const gearInfo: Array<[keyof GameState['gear'], string, string, number]> = [
      ['worldpack', 'Worldpack', 'Increases auto-gather radius', 55],
      ['boots', 'Trail Boots', 'Increases movement speed', 48],
      ['fieldKit', 'Field Kit', 'Raises Gear Level for region access', 62],
      ['relicWard', 'Relic Ward', 'Raises Gear Level for deep regions', 85],
    ];
    const gearRows = gearInfo.map(([id, name, description, base]) => {
      const level = this.state.gear[id];
      const cost = gearUpgradeCost(level, base);
      return `
        <div class="shop-row">
          <div class="row-main"><span class="row-title">${name}</span><span class="row-subtitle">Level ${level} · ${description}</span></div>
          <button class="small-button" data-gear="${id}" ${this.state.coins < cost ? 'disabled' : ''}>${cost} coins</button>
        </div>`;
    }).join('');

    this.panel.innerHTML = `
      <section class="card">
        <h2>Gatherer's Market</h2>
        <p>Turn harvested materials into permanent gathering power. Every fourth tool level changes its visible form.</p>
        <div class="stat-row"><span>Available coins</span><span class="value">${this.state.coins}</span></div>
        <div class="button-row"><button id="market-sell-all" class="primary-button">Sell All Resources</button></div>
      </section>
      <section class="card"><h3>Tool Evolution</h3>${tools}</section>
      <section class="card"><h3>Gear</h3>${gearRows}</section>`;

    this.panel.querySelector<HTMLButtonElement>('#market-sell-all')?.addEventListener('click', () => this.store.sellAll());
    this.panel.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((button) => button.addEventListener('click', () => this.store.upgradeTool(button.dataset.tool as ToolId)));
    this.panel.querySelectorAll<HTMLButtonElement>('[data-gear]').forEach((button) => button.addEventListener('click', () => this.store.upgradeGear(button.dataset.gear as keyof GameState['gear'])));
  }

  private renderBiomes(): void {
    const currentGear = gearLevel(this.state as GameState);
    const rows = (Object.keys(biomes) as BiomeId[]).map((id) => {
      const biome = biomes[id];
      const unlocked = this.state.unlockedBiomes.includes(id);
      const eligible = this.state.level >= biome.levelRequired && currentGear >= biome.gearRequired;
      const current = this.state.currentBiome === id;
      const knownVariants = Object.values(rareVariants).filter((variant) => variant.nativeBiome === id && this.state.discovered.includes(variant.id)).length;
      const totalVariants = Object.values(rareVariants).filter((variant) => variant.nativeBiome === id).length;
      const action = current
        ? '<span class="badge">Current</span>'
        : unlocked
          ? `<button class="small-button" data-travel="${id}">Travel</button>`
          : `<button class="small-button" data-unlock="${id}" ${eligible ? '' : 'disabled'}>Unlock</button>`;
      return `
        <div class="biome-row">
          <div class="row-main">
            <span class="row-title">${biome.name}</span>
            <span class="row-subtitle">Level ${biome.levelRequired} · Gear ${biome.gearRequired} · Mythic discoveries ${knownVariants}/${totalVariants}</span>
            <span class="row-subtitle">${biome.subtitle}</span>
          </div>
          ${action}
        </div>`;
    }).join('');

    this.panel.innerHTML = `
      <section class="card">
        <h2>World Map</h2>
        <p>Higher levels and stronger equipment open more valuable gathering grounds and hidden material families.</p>
        <div class="stat-row"><span>Your level</span><span class="value">${this.state.level}</span></div>
        <div class="stat-row"><span>Your Gear Level</span><span class="value">${currentGear}</span></div>
      </section>
      <section class="card"><h3>Known Regions</h3>${rows}</section>`;

    this.panel.querySelectorAll<HTMLButtonElement>('[data-unlock]').forEach((button) => button.addEventListener('click', () => this.store.unlockBiome(button.dataset.unlock as BiomeId)));
    this.panel.querySelectorAll<HTMLButtonElement>('[data-travel]').forEach((button) => button.addEventListener('click', () => this.store.travel(button.dataset.travel as BiomeId)));
  }

  private showDiscovery(definition: ResourceDefinition, quality: HarvestQuality): void {
    const nativeBiome = biomes[definition.nativeBiome].name;
    this.discoveryLayer.innerHTML = `
      <div class="discovery-backdrop"></div>
      <article class="discovery-card ${definition.isVariant ? 'mythic-discovery' : ''}">
        <p class="discovery-kicker">${definition.isVariant ? 'MYTHIC VARIANT DISCOVERED' : 'NEW CODEX ENTRY'}</p>
        <div class="discovery-orb" style="--resource-color:#${definition.glow.toString(16).padStart(6, '0')}"></div>
        <h2>${definition.name}</h2>
        <p class="discovery-rarity">${quality} · ${definition.rarity} · ${nativeBiome}</p>
        <p>${definition.lore}</p>
        <div class="discovery-detail"><strong>Unique properties</strong><span>${definition.properties}</span></div>
        <div class="discovery-detail"><strong>Potential uses</strong><span>${definition.uses}</span></div>
        <button class="primary-button" id="close-discovery">Add to Collection Codex</button>
      </article>`;
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
