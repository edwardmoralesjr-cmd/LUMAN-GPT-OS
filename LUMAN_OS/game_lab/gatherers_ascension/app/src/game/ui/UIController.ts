import { biomes, resources, statNames, toolNames, type BiomeId, type StatId, type ToolId } from '../data/content';
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

  constructor(private store: GameStore) {
    this.state = store.snapshot;
    const panel = document.querySelector<HTMLElement>('#panel-content');
    const saveStatus = document.querySelector<HTMLElement>('#save-status');
    const cloudButton = document.querySelector<HTMLButtonElement>('#cloud-button');
    if (!panel || !saveStatus || !cloudButton) throw new Error('Required interface elements are missing.');
    this.panel = panel;
    this.saveStatus = saveStatus;
    this.cloudButton = cloudButton;

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
    else if (this.activeTab === 'market') this.renderMarket();
    else if (this.activeTab === 'biomes') this.renderBiomes();
    else this.renderStatus();
  }

  private renderStatus(): void {
    const xpNeeded = xpForLevel(this.state.level);
    const progress = Math.min(100, (this.state.xp / xpNeeded) * 100);
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
        <h2 style="margin-top:10px">${this.escape(this.state.playerName)}</h2>
        <p>${this.state.xp} / ${xpNeeded} XP toward the next gathering level</p>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        <p>${this.state.statPoints} unspent stat point${this.state.statPoints === 1 ? '' : 's'}</p>
      </section>
      <section class="card"><h3>Permanent Stats</h3>${stats}</section>
      <section class="card"><h3>Gathering Mastery</h3>${skills}</section>
      <section class="card">
        <h3>Lifetime Path</h3>
        <div class="stat-row"><span>Total gathered</span><span class="value">${this.state.totals.gathered}</span></div>
        <div class="stat-row"><span>Coins earned</span><span class="value">${this.state.totals.coinsEarned}</span></div>
        <div class="stat-row"><span>Rare critical finds</span><span class="value">${this.state.totals.rareFinds}</span></div>
      </section>`;

    this.panel.querySelectorAll<HTMLButtonElement>('[data-stat]').forEach((button) => {
      button.addEventListener('click', () => this.store.allocateStat(button.dataset.stat as StatId));
    });
  }

  private renderInventory(): void {
    const entries = Object.entries(this.state.inventory).filter(([, amount]) => amount > 0);
    const value = entries.reduce((sum, [id, amount]) => sum + (resources[id]?.value ?? 0) * amount, 0);
    const rows = entries.length ? entries.map(([id, amount]) => {
      const definition = resources[id];
      if (!definition) return '';
      return `
        <div class="resource-row">
          <div class="row-main">
            <span class="row-title">${definition.name}</span>
            <span class="row-subtitle">${definition.rarity} · ${definition.value} coins each</span>
          </div>
          <span class="value">${amount}</span>
        </div>`;
    }).join('') : '<div class="empty-state">Your Worldpack is empty. Walk near a resource to gather it.</div>';

    this.panel.innerHTML = `
      <section class="card">
        <h2>Worldpack</h2>
        <p>Unlimited carrying capacity. Pack upgrades increase gathering radius and flow.</p>
        <div class="stat-row"><span>Current sale value</span><span class="value">${value} coins</span></div>
        <div class="button-row"><button id="sell-all-inventory" class="primary-button" ${entries.length ? '' : 'disabled'}>Sell Everything</button></div>
      </section>
      <section class="card"><h3>Gathered Resources</h3>${rows}</section>
      <section class="card"><h3>Codex</h3><p>${this.state.discovered.length} of ${Object.keys(resources).length} known resources discovered.</p></section>`;

    this.panel.querySelector<HTMLButtonElement>('#sell-all-inventory')?.addEventListener('click', () => this.store.sellAll());
  }

  private renderMarket(): void {
    const tools = (Object.keys(toolNames) as ToolId[]).map((tool) => {
      const level = this.state.tools[tool];
      const cost = toolUpgradeCost(level);
      return `
        <div class="shop-row">
          <div class="row-main"><span class="row-title">${toolNames[tool]}</span><span class="row-subtitle">Level ${level} · improves yield</span></div>
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
        <p>Turn harvested materials into permanent gathering power.</p>
        <div class="stat-row"><span>Available coins</span><span class="value">${this.state.coins}</span></div>
        <div class="button-row"><button id="market-sell-all" class="primary-button">Sell All Resources</button></div>
      </section>
      <section class="card"><h3>Tools</h3>${tools}</section>
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
      const action = current
        ? '<span class="badge">Current</span>'
        : unlocked
          ? `<button class="small-button" data-travel="${id}">Travel</button>`
          : `<button class="small-button" data-unlock="${id}" ${eligible ? '' : 'disabled'}>Unlock</button>`;
      return `
        <div class="biome-row">
          <div class="row-main">
            <span class="row-title">${biome.name}</span>
            <span class="row-subtitle">Level ${biome.levelRequired} · Gear ${biome.gearRequired} · ${biome.subtitle}</span>
          </div>
          ${action}
        </div>`;
    }).join('');

    this.panel.innerHTML = `
      <section class="card">
        <h2>World Map</h2>
        <p>Higher levels and stronger equipment open more valuable gathering grounds.</p>
        <div class="stat-row"><span>Your level</span><span class="value">${this.state.level}</span></div>
        <div class="stat-row"><span>Your Gear Level</span><span class="value">${currentGear}</span></div>
      </section>
      <section class="card"><h3>Known Regions</h3>${rows}</section>`;

    this.panel.querySelectorAll<HTMLButtonElement>('[data-unlock]').forEach((button) => button.addEventListener('click', () => this.store.unlockBiome(button.dataset.unlock as BiomeId)));
    this.panel.querySelectorAll<HTMLButtonElement>('[data-travel]').forEach((button) => button.addEventListener('click', () => this.store.travel(button.dataset.travel as BiomeId)));
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
