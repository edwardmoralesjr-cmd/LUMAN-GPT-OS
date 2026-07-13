import { toolForm, toolNames, type ToolId } from '../data/content';
import { gearUpgradeCost, toolUpgradeCost } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState } from '../state/GameState';

type GearId = keyof GameState['gear'];
type UpgradeTarget =
  | { kind: 'tool'; id: ToolId }
  | { kind: 'gear'; id: GearId }
  | { kind: 'gatherer'; id: string };

interface TierMeta {
  label: string;
  rarity: string;
  accent: string;
  glow: string;
}

interface ComparisonLine {
  label: string;
  current: string;
  next: string;
  positive?: boolean;
}

const gearNames: Record<GearId, string> = {
  worldpack: 'Worldpack',
  boots: 'Trail Boots',
  fieldKit: 'Field Kit',
  relicWard: 'Relic Ward',
};

const gearDescriptions: Record<GearId, string> = {
  worldpack: 'Storage frame, scanner mount, utility lines, and power-cell housing.',
  boots: 'Biome-adaptive traction, reinforced soles, and kinetic movement supports.',
  fieldKit: 'Hood, chest layers, leg protection, utility harness, and field armor.',
  relicWard: 'Relic gloves, resonance bracers, ward core, and ancient-tech shielding.',
};

const gearBases: Record<GearId, number> = {
  worldpack: 55,
  boots: 48,
  fieldKit: 62,
  relicWard: 85,
};

const gearSlots: Record<GearId, string> = {
  worldpack: 'Backpack / Scanner / Power Cell',
  boots: 'Boots',
  fieldKit: 'Head / Chest / Legs / Utility',
  relicWard: 'Gloves / Relic Core',
};

const toolDescriptions: Record<ToolId, string> = {
  axe: 'Worldroot harvesting edge built for living timber and ancient bark.',
  pickaxe: 'Veinbreaker mineral tool tuned for ore, crystal, and deep-stone resonance.',
  sickle: 'Dawn Sickle optimized for delicate flora, dew, fibers, and rare growth.',
  gloves: 'Relic Gloves designed for artifacts, unstable materials, and precision recovery.',
};

export class UpgradePreviewSystem {
  private state: Readonly<GameState>;
  private active = false;
  private previewApplied = true;
  private compareMode = true;
  private selected: UpgradeTarget = { kind: 'gear', id: 'fieldKit' };
  private unsubscribe: (() => void) | null = null;

  constructor(private store: GameStore) {
    this.state = store.snapshot;
  }

  initialize(): void {
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.active = tab.dataset.view === 'market';
        if (this.active) queueMicrotask(() => this.render());
      });
    });

    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type !== 'state') return;
      this.state = event.state;
      if (this.active) queueMicrotask(() => this.render());
    });

    this.active = document.querySelector<HTMLButtonElement>('.command-tab.active')?.dataset.view === 'market';
    if (this.active) queueMicrotask(() => this.render());
  }

  destroy(): void {
    this.unsubscribe?.();
  }

  private render(): void {
    if (!this.active) return;
    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    if (!overlay) return;

    this.selected = this.normalizeTarget(this.selected);
    const currentLevel = this.targetLevel(this.selected);
    const nextLevel = currentLevel + 1;
    const cost = this.targetCost(this.selected);
    const canAfford = this.state.coins >= cost;
    const currentTier = this.tierMeta(currentLevel);
    const nextTier = this.tierMeta(nextLevel);
    const changedSlot = this.targetSlot(this.selected);

    const kicker = document.querySelector<HTMLElement>('#operation-kicker');
    const title = document.querySelector<HTMLElement>('#operation-title');
    const subtitle = document.querySelector<HTMLElement>('#operation-subtitle');
    if (kicker) kicker.textContent = 'VISUAL EQUIPMENT EVOLUTION LAB';
    if (title) title.textContent = 'Worldroot Loadout Preview';
    if (subtitle) subtitle.textContent = 'Inspect current and next-tier artwork, apply live previews, compare full builds, and confirm only when ready.';

    overlay.innerHTML = `
      <div class="upgrade-preview-shell">
        <aside class="upgrade-library" aria-label="Visual upgrade library">
          <div class="upgrade-section-heading"><span>PLAYER TOOLS</span><strong>4 PATHS</strong></div>
          <div class="upgrade-asset-grid">${(Object.keys(toolNames) as ToolId[]).map((id) => this.assetCard({ kind: 'tool', id })).join('')}</div>
          <div class="upgrade-section-heading"><span>VISIBLE FIELD GEAR</span><strong>4 SYSTEMS</strong></div>
          <div class="upgrade-asset-grid">${(Object.keys(gearNames) as GearId[]).map((id) => this.assetCard({ kind: 'gear', id })).join('')}</div>
          <div class="upgrade-section-heading"><span>AUTOMATED GATHERERS</span><strong>${this.state.network.gatherers.length} UNITS</strong></div>
          <div class="upgrade-asset-grid gatherer-assets">${this.state.network.gatherers.map((gatherer) => this.assetCard({ kind: 'gatherer', id: gatherer.id })).join('')}</div>
        </aside>

        <section class="upgrade-model-stage">
          <div class="upgrade-stage-toolbar">
            <div><span>LIVE CHARACTER PREVIEW</span><strong>${this.escape(this.targetName(this.selected))}</strong></div>
            <div class="upgrade-toolbar-actions">
              <button class="upgrade-mini-button ${this.compareMode ? 'active' : ''}" data-upgrade-compare>${this.compareMode ? 'SPLIT VIEW ON' : 'SPLIT VIEW OFF'}</button>
              <button class="upgrade-mini-button ${this.previewApplied ? 'active' : ''}" data-upgrade-apply-preview>${this.previewApplied ? 'PREVIEW APPLIED' : 'APPLY PREVIEW'}</button>
            </div>
          </div>
          <div class="upgrade-model-layout ${this.compareMode ? 'compare' : 'single'}">
            ${this.compareMode ? `<div class="model-pane"><span class="model-label">CURRENT BUILD</span>${this.fullModel(this.selected, false)}</div>` : ''}
            <div class="model-pane preview-pane"><span class="model-label">${this.previewApplied ? 'UPGRADE PREVIEW' : 'CURRENT BUILD'}</span>${this.fullModel(this.selected, this.previewApplied)}</div>
          </div>
          <div class="changed-slot-banner"><span class="changed-pulse"></span><strong>CHANGED REGION</strong><span>${this.escape(changedSlot)}</span></div>
          <div class="visual-trait-strip">
            <div><span>CURRENT STYLE</span><strong>${currentTier.label}</strong></div>
            <div><span>NEXT STYLE</span><strong style="color:${nextTier.accent}">${nextTier.label}</strong></div>
            <div><span>VISUAL EVOLUTION</span><strong>${this.visualEvolutionText(this.selected, nextLevel)}</strong></div>
          </div>
        </section>

        <aside class="upgrade-comparison-panel">
          <div class="upgrade-comparison-heading"><span>SIDE-BY-SIDE EQUIPMENT ART</span><strong>${cost.toLocaleString()}c</strong></div>
          <div class="item-comparison-grid">
            ${this.itemComparisonCard(this.selected, currentLevel, 'CURRENT', currentTier)}
            ${this.itemComparisonCard(this.selected, nextLevel, 'NEXT UPGRADE', nextTier)}
          </div>
          <section class="upgrade-detail-card">
            <div class="upgrade-rarity-line"><span style="--rarity:${nextTier.accent}"></span><strong>${nextTier.rarity} · TIER ${nextLevel}</strong></div>
            <p>${this.escape(this.targetDescription(this.selected))}</p>
            <div class="upgrade-stat-list">${this.comparisonLines(this.selected).map((line) => `<div><span>${this.escape(line.label)}</span><strong>${this.escape(line.current)}</strong><b>→</b><em class="${line.positive === false ? '' : 'positive'}">${this.escape(line.next)}</em></div>`).join('')}</div>
          </section>
          <section class="upgrade-passive-card">
            <span>NEW PASSIVE / VISUAL TRAIT</span>
            <strong>${this.escape(this.passiveText(this.selected, nextLevel))}</strong>
            <p>${this.escape(this.materialText(nextLevel))}</p>
          </section>
          <div class="upgrade-confirm-row">
            <button class="upgrade-revert-button" data-upgrade-revert>REVERT PREVIEW</button>
            <button class="upgrade-confirm-button" data-upgrade-confirm ${canAfford ? '' : 'disabled'}>${canAfford ? `CONFIRM ${cost.toLocaleString()}c` : `NEED ${(cost - this.state.coins).toLocaleString()}c`}</button>
          </div>
        </aside>
      </div>`;

    this.bindActions(overlay);
  }

  private assetCard(target: UpgradeTarget): string {
    const level = this.targetLevel(target);
    const tier = this.tierMeta(level);
    const selected = this.targetKey(target) === this.targetKey(this.selected);
    return `<button class="upgrade-asset-card ${selected ? 'selected' : ''}" data-upgrade-target="${this.targetKey(target)}" style="--upgrade-accent:${tier.accent}">
      <div class="upgrade-thumb">${this.itemArt(target, level, 'thumb')}</div>
      <div class="upgrade-asset-copy"><strong>${this.escape(this.targetName(target))}</strong><span>Lv ${level} · ${tier.rarity}</span></div>
      <span class="preview-tag">PREVIEW</span>
    </button>`;
  }

  private itemComparisonCard(target: UpgradeTarget, level: number, label: string, tier: TierMeta): string {
    return `<article class="item-comparison-card" style="--upgrade-accent:${tier.accent}">
      <div class="comparison-label">${label}</div>
      <div class="large-item-render">${this.itemArt(target, level, 'large')}</div>
      <span class="rarity-chip">${tier.rarity}</span>
      <h3>${this.escape(this.formName(target, level))}</h3>
      <p>Level ${level} · ${this.escape(this.targetSlot(target))}</p>
    </article>`;
  }

  private bindActions(root: HTMLElement): void {
    root.querySelectorAll<HTMLButtonElement>('[data-upgrade-target]').forEach((button) => {
      const select = () => {
        const parsed = this.parseTarget(button.dataset.upgradeTarget ?? '');
        if (!parsed) return;
        this.selected = parsed;
        this.previewApplied = true;
        this.render();
      };
      button.addEventListener('click', select);
      button.addEventListener('mouseenter', select);
      button.addEventListener('focus', select);
    });

    root.querySelector<HTMLButtonElement>('[data-upgrade-apply-preview]')?.addEventListener('click', () => {
      this.previewApplied = !this.previewApplied;
      this.render();
    });
    root.querySelector<HTMLButtonElement>('[data-upgrade-compare]')?.addEventListener('click', () => {
      this.compareMode = !this.compareMode;
      this.render();
    });
    root.querySelector<HTMLButtonElement>('[data-upgrade-revert]')?.addEventListener('click', () => {
      this.previewApplied = false;
      this.render();
    });
    root.querySelector<HTMLButtonElement>('[data-upgrade-confirm]')?.addEventListener('click', () => {
      const cost = this.targetCost(this.selected);
      if (this.state.coins < cost) return;
      if (this.selected.kind === 'tool') this.store.upgradeTool(this.selected.id);
      else if (this.selected.kind === 'gear') this.store.upgradeGear(this.selected.id);
      else this.store.upgradeGatherer(this.selected.id);
      this.previewApplied = true;
    });
  }

  private comparisonLines(target: UpgradeTarget): ComparisonLine[] {
    const current = this.targetLevel(target);
    const next = current + 1;
    if (target.kind === 'tool') {
      const currentYieldTier = Math.floor((current - 1) / 3);
      const nextYieldTier = Math.floor((next - 1) / 3);
      return [
        { label: 'Tool Level', current: String(current), next: String(next) },
        { label: 'Harvest Yield Tier', current: `+${currentYieldTier}`, next: `+${nextYieldTier}` },
        { label: 'Gear Rating', current: `+${Math.max(0, current - 1)}`, next: `+${Math.max(0, next - 1)}` },
        { label: 'Visual Form', current: toolForm(current), next: toolForm(next) },
      ];
    }
    if (target.kind === 'gear') {
      const lines: ComparisonLine[] = [
        { label: 'Equipment Level', current: String(current), next: String(next) },
        { label: 'Gear Rating', current: `+${current}`, next: `+${next}` },
        { label: 'Visual Tier', current: this.tierMeta(current).label, next: this.tierMeta(next).label },
      ];
      if (target.id === 'worldpack') lines.push({ label: 'Gather Radius Bonus', current: `+${current * 7}m`, next: `+${next * 7}m` });
      else if (target.id === 'boots') lines.push({ label: 'Mobility System', current: `Mk ${current}`, next: `Mk ${next}` });
      else if (target.id === 'fieldKit') lines.push({ label: 'Protected Body Regions', current: '3', next: '4' });
      else lines.push({ label: 'Resonance Channels', current: String(Math.min(8, current + 1)), next: String(Math.min(8, next + 1)) });
      return lines;
    }

    const gatherer = this.gatherer(target.id);
    if (!gatherer) return [];
    const fortuneGain = next % 3 === 0 ? 1 : 0;
    return [
      { label: 'Equipment Tier', current: String(current), next: String(next) },
      { label: 'Efficiency', current: `${Math.round(gatherer.efficiency * 100)}%`, next: `${Math.round((gatherer.efficiency + 0.055) * 100)}%` },
      { label: 'Endurance', current: String(gatherer.endurance), next: String(gatherer.endurance + 1) },
      { label: 'Fortune', current: String(gatherer.fortune), next: fortuneGain ? String(gatherer.fortune + 1) : String(gatherer.fortune) },
    ];
  }

  private fullModel(target: UpgradeTarget, preview: boolean): string {
    const levels = {
      worldpack: this.state.gear.worldpack,
      boots: this.state.gear.boots,
      fieldKit: this.state.gear.fieldKit,
      relicWard: this.state.gear.relicWard,
      tool: target.kind === 'tool' ? this.state.tools[target.id] : this.state.tools.axe,
      gatherer: target.kind === 'gatherer' ? this.targetLevel(target) : 0,
    };
    if (preview) {
      if (target.kind === 'gear') levels[target.id] += 1;
      else if (target.kind === 'tool') levels.tool += 1;
      else levels.gatherer += 1;
    }
    return target.kind === 'gatherer'
      ? this.gathererModelSvg(target, levels.gatherer, preview)
      : this.characterModelSvg(target, levels, preview);
  }

  private characterModelSvg(target: UpgradeTarget, levels: { worldpack: number; boots: number; fieldKit: number; relicWard: number; tool: number; gatherer: number }, preview: boolean): string {
    const tier = this.tierMeta(Math.max(levels.worldpack, levels.boots, levels.fieldKit, levels.relicWard, levels.tool));
    const changed = (slot: GearId | 'tool') => preview && ((target.kind === 'gear' && target.id === slot) || (target.kind === 'tool' && slot === 'tool')) ? 'upgrade-changed' : '';
    const kit = Math.min(6, levels.fieldKit);
    const pack = Math.min(6, levels.worldpack);
    const ward = Math.min(6, levels.relicWard);
    const boot = Math.min(6, levels.boots);
    return `<svg class="character-upgrade-svg" viewBox="0 0 360 520" role="img" aria-label="Full character equipment preview">
      <defs>
        <radialGradient id="modelAura" cx="50%" cy="45%"><stop offset="0" stop-color="${tier.accent}" stop-opacity=".24"/><stop offset="1" stop-color="${tier.accent}" stop-opacity="0"/></radialGradient>
        <linearGradient id="armorMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#66796b"/><stop offset=".48" stop-color="#25362e"/><stop offset="1" stop-color="#0d1813"/></linearGradient>
        <filter id="modelGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="180" cy="245" rx="165" ry="225" fill="url(#modelAura)"/>
      <circle cx="180" cy="245" r="138" fill="none" stroke="${tier.accent}" stroke-opacity=".13" stroke-dasharray="3 9"/>
      <ellipse cx="180" cy="474" rx="92" ry="18" fill="#000" opacity=".5"/>
      <g class="${changed('worldpack')}">
        <path d="M118 170 Q88 194 96 322 L126 340 L142 190Z" fill="#273b2f" stroke="${tier.accent}" stroke-opacity=".45" stroke-width="3"/>
        ${Array.from({ length: Math.max(1, pack) }, (_, index) => `<circle cx="${108 + (index % 2) * 18}" cy="${205 + Math.floor(index / 2) * 35}" r="7" fill="${tier.accent}" opacity="${.25 + index * .08}"/>`).join('')}
        <rect x="87" y="250" width="26" height="66" rx="8" fill="#14241b" stroke="${tier.accent}" stroke-opacity=".55"/>
      </g>
      <g class="${changed('fieldKit')}">
        <path d="M130 112 Q180 60 230 112 L218 172 Q180 192 142 172Z" fill="#17251d" stroke="${tier.accent}" stroke-opacity=".5" stroke-width="3"/>
        <path d="M145 123 Q180 95 215 123 L207 159 Q180 172 153 159Z" fill="#07110d"/>
        <path d="M157 143 L203 143 L194 152 L166 152Z" fill="${tier.accent}" opacity=".85" filter="url(#modelGlow)"/>
        <path d="M126 174 Q180 148 234 174 L250 329 Q218 391 180 412 Q142 391 110 329Z" fill="url(#armorMetal)" stroke="${tier.accent}" stroke-opacity=".5" stroke-width="3"/>
        ${Array.from({ length: Math.max(1, kit) }, (_, index) => `<path d="M${137 + index * 8} ${205 + index * 17} L${223 - index * 8} ${205 + index * 17}" stroke="${tier.accent}" stroke-opacity="${.16 + index * .08}" stroke-width="4"/>`).join('')}
        <path d="M141 185 L180 207 L219 185 L207 277 L180 301 L153 277Z" fill="#1b3124" stroke="${tier.accent}" stroke-opacity=".35"/>
        <circle cx="180" cy="241" r="13" fill="${tier.accent}" opacity=".75" filter="url(#modelGlow)"/>
        <path d="M128 315 L97 442 L145 462 L176 350Z" fill="#1b2c22"/>
        <path d="M232 315 L263 442 L215 462 L184 350Z" fill="#1b2c22"/>
      </g>
      <g class="${changed('relicWard')}">
        <path d="M121 194 Q85 210 80 306 L101 317 L139 222Z" fill="#21382a" stroke="${tier.accent}" stroke-opacity=".4"/>
        <path d="M239 194 Q275 210 280 306 L259 317 L221 222Z" fill="#21382a" stroke="${tier.accent}" stroke-opacity=".4"/>
        <rect x="77" y="288" width="34" height="68" rx="12" fill="#15271d" stroke="${tier.accent}" stroke-width="${1 + ward * .4}"/>
        <rect x="249" y="288" width="34" height="68" rx="12" fill="#15271d" stroke="${tier.accent}" stroke-width="${1 + ward * .4}"/>
        <circle cx="94" cy="319" r="8" fill="${tier.accent}" opacity=".85" filter="url(#modelGlow)"/>
        <circle cx="266" cy="319" r="8" fill="${tier.accent}" opacity=".85" filter="url(#modelGlow)"/>
      </g>
      <g class="${changed('boots')}">
        <path d="M126 388 L169 391 L164 477 L107 477 Q101 459 122 448Z" fill="#17271e" stroke="${tier.accent}" stroke-width="${1 + boot * .35}"/>
        <path d="M234 388 L191 391 L196 477 L253 477 Q259 459 238 448Z" fill="#17271e" stroke="${tier.accent}" stroke-width="${1 + boot * .35}"/>
        <path d="M112 451 L160 451 M200 451 L248 451" stroke="${tier.accent}" stroke-opacity=".6" stroke-width="4"/>
      </g>
      <g class="${changed('tool')}" transform="translate(252 260) rotate(18)">${this.toolShape(target.kind === 'tool' ? target.id : 'axe', levels.tool, tier.accent, 0.78)}</g>
      ${preview ? `<text x="180" y="505" text-anchor="middle" fill="${tier.accent}" font-size="11" letter-spacing="3">LIVE PREVIEW ACTIVE</text>` : ''}
    </svg>`;
  }

  private gathererModelSvg(target: UpgradeTarget, level: number, preview: boolean): string {
    const gatherer = target.kind === 'gatherer' ? this.gatherer(target.id) : undefined;
    const tier = this.tierMeta(level);
    const modules = Math.min(8, Math.max(1, level));
    return `<svg class="character-upgrade-svg" viewBox="0 0 360 520" role="img" aria-label="Automated gatherer loadout preview">
      <defs><filter id="unitGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <ellipse cx="180" cy="260" rx="160" ry="220" fill="${tier.accent}" opacity=".08"/>
      <circle cx="180" cy="240" r="142" fill="none" stroke="${tier.accent}" stroke-opacity=".18" stroke-dasharray="4 10"/>
      <ellipse cx="180" cy="472" rx="94" ry="18" fill="#000" opacity=".5"/>
      <g class="${preview ? 'upgrade-changed' : ''}">
        <path d="M130 126 Q180 82 230 126 L218 184 Q180 202 142 184Z" fill="#14251c" stroke="${tier.accent}" stroke-width="3"/>
        <rect x="116" y="180" width="128" height="190" rx="42" fill="#1b2e23" stroke="${tier.accent}" stroke-opacity=".6" stroke-width="3"/>
        <circle cx="180" cy="232" r="25" fill="#07110d" stroke="${tier.accent}" stroke-width="3"/>
        <circle cx="180" cy="232" r="11" fill="${tier.accent}" filter="url(#unitGlow)"/>
        <path d="M117 213 L74 294 L100 311 L141 248 M243 213 L286 294 L260 311 L219 248" fill="none" stroke="#385642" stroke-width="24" stroke-linecap="round"/>
        <path d="M142 354 L125 468 L166 474 L180 372 L194 474 L235 468 L218 354" fill="#16271e" stroke="${tier.accent}" stroke-opacity=".42" stroke-width="3"/>
        <rect x="88" y="166" width="38" height="126" rx="14" fill="#0d1913" stroke="${tier.accent}" stroke-opacity=".55"/>
        ${Array.from({ length: modules }, (_, index) => `<circle cx="${99 + (index % 2) * 18}" cy="${185 + Math.floor(index / 2) * 26}" r="6" fill="${tier.accent}" opacity="${.3 + index * .07}"/>`).join('')}
        <path d="M248 170 L292 134 L302 145 L261 195Z" fill="#273e30" stroke="${tier.accent}"/>
        <circle cx="299" cy="140" r="12" fill="${tier.accent}" opacity=".78" filter="url(#unitGlow)"/>
      </g>
      <text x="180" y="42" text-anchor="middle" fill="${tier.accent}" font-size="12" letter-spacing="3">${this.escape(gatherer?.role.toUpperCase() ?? 'FIELD UNIT')}</text>
      <text x="180" y="505" text-anchor="middle" fill="#b9d7c1" font-size="13">${this.escape(gatherer?.name ?? 'Gatherer')}</text>
    </svg>`;
  }

  private itemArt(target: UpgradeTarget, level: number, size: 'thumb' | 'large'): string {
    const tier = this.tierMeta(level);
    const scale = size === 'thumb' ? 0.68 : 1;
    const unique = `${this.targetKey(target).replace(/[^a-z0-9]/gi, '')}${level}${size}`;
    let shape = '';
    if (target.kind === 'tool') shape = this.toolShape(target.id, level, tier.accent, scale);
    else if (target.kind === 'gear') shape = this.gearShape(target.id, level, tier.accent, scale);
    else shape = this.gathererRigShape(level, tier.accent, scale);
    return `<svg class="upgrade-item-svg" viewBox="0 0 240 240" role="img" aria-label="${this.escape(this.formName(target, level))}">
      <defs><radialGradient id="bg${unique}"><stop stop-color="${tier.accent}" stop-opacity=".2"/><stop offset="1" stop-color="#06100c" stop-opacity="0"/></radialGradient><filter id="g${unique}"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <circle cx="120" cy="120" r="101" fill="url(#bg${unique})"/>
      <circle cx="120" cy="120" r="92" fill="none" stroke="${tier.accent}" stroke-opacity=".28" stroke-width="2" stroke-dasharray="4 8"/>
      <g filter="url(#g${unique})">${shape}</g>
      ${Array.from({ length: Math.min(6, Math.max(1, Math.floor(level / 2))) }, (_, index) => `<circle cx="${45 + index * 27}" cy="${196 - (index % 2) * 11}" r="3" fill="${tier.accent}" opacity="${.35 + index * .08}"/>`).join('')}
    </svg>`;
  }

  private toolShape(id: ToolId, level: number, accent: string, scale = 1): string {
    const detail = Math.min(6, Math.max(1, Math.ceil(level / 3)));
    const transform = `translate(${120 - 120 * scale} ${120 - 120 * scale}) scale(${scale})`;
    if (id === 'axe') return `<g transform="${transform}"><path d="M106 43 L128 42 L139 184 L117 190Z" fill="#584932" stroke="#b69b6b" stroke-width="4"/><path d="M78 48 Q118 19 174 49 L160 104 Q125 90 91 115 L61 91Z" fill="#274333" stroke="${accent}" stroke-width="5"/><path d="M83 57 L150 51" stroke="${accent}" stroke-width="${3 + detail}" opacity=".75"/><circle cx="124" cy="80" r="${7 + detail}" fill="${accent}" opacity=".82"/></g>`;
    if (id === 'pickaxe') return `<g transform="${transform}"><path d="M112 48 L132 48 L137 194 L115 194Z" fill="#4b4439" stroke="#a99b7e" stroke-width="4"/><path d="M45 72 Q119 24 196 72 L181 96 Q122 72 59 99Z" fill="#30424a" stroke="${accent}" stroke-width="5"/><path d="M54 75 L190 74" stroke="${accent}" stroke-width="${2 + detail}" opacity=".72"/><circle cx="123" cy="77" r="${7 + detail}" fill="${accent}" opacity=".84"/></g>`;
    if (id === 'sickle') return `<g transform="${transform}"><path d="M112 104 L132 105 L126 202 L105 198Z" fill="#584932" stroke="#b69b6b" stroke-width="4"/><path d="M122 110 Q85 94 68 56 Q121 27 177 72 Q139 73 122 110Z" fill="#294b3a" stroke="${accent}" stroke-width="5"/><path d="M82 58 Q122 39 163 69" fill="none" stroke="${accent}" stroke-width="${2 + detail}"/><circle cx="119" cy="104" r="${6 + detail}" fill="${accent}"/></g>`;
    return `<g transform="${transform}"><path d="M70 73 Q91 51 111 78 L119 129 L105 178 L75 160Z" fill="#263e31" stroke="${accent}" stroke-width="5"/><path d="M170 73 Q149 51 129 78 L121 129 L135 178 L165 160Z" fill="#263e31" stroke="${accent}" stroke-width="5"/><circle cx="96" cy="111" r="${8 + detail}" fill="${accent}" opacity=".85"/><circle cx="144" cy="111" r="${8 + detail}" fill="${accent}" opacity=".85"/><path d="M82 84 L68 48 M95 76 L88 39 M158 84 L172 48 M145 76 L152 39" stroke="${accent}" stroke-width="4"/></g>`;
  }

  private gearShape(id: GearId, level: number, accent: string, scale = 1): string {
    const detail = Math.min(7, Math.max(1, Math.ceil(level / 2)));
    const transform = `translate(${120 - 120 * scale} ${120 - 120 * scale}) scale(${scale})`;
    if (id === 'worldpack') return `<g transform="${transform}"><rect x="67" y="47" width="106" height="145" rx="28" fill="#24372b" stroke="${accent}" stroke-width="5"/><rect x="86" y="66" width="68" height="47" rx="12" fill="#101d16" stroke="${accent}" stroke-opacity=".55"/><rect x="53" y="90" width="31" height="74" rx="10" fill="#17261d" stroke="${accent}"/><rect x="156" y="83" width="31" height="90" rx="10" fill="#17261d" stroke="${accent}"/><circle cx="120" cy="89" r="16" fill="${accent}" opacity=".82"/>${Array.from({ length: detail }, (_, i) => `<rect x="${84 + (i % 3) * 26}" y="${130 + Math.floor(i / 3) * 22}" width="17" height="12" rx="3" fill="${accent}" opacity="${.22 + i * .07}"/>`).join('')}</g>`;
    if (id === 'boots') return `<g transform="${transform}"><path d="M64 50 L113 54 L110 158 L90 194 L39 188 Q35 164 61 149Z" fill="#24362b" stroke="${accent}" stroke-width="5"/><path d="M176 50 L127 54 L130 158 L150 194 L201 188 Q205 164 179 149Z" fill="#24362b" stroke="${accent}" stroke-width="5"/><path d="M52 155 L104 155 M136 155 L188 155" stroke="${accent}" stroke-width="${3 + detail * .6}"/><circle cx="87" cy="91" r="${5 + detail}" fill="${accent}" opacity=".7"/><circle cx="153" cy="91" r="${5 + detail}" fill="${accent}" opacity=".7"/></g>`;
    if (id === 'fieldKit') return `<g transform="${transform}"><path d="M78 51 Q120 20 162 51 L151 92 Q120 105 89 92Z" fill="#1b2b21" stroke="${accent}" stroke-width="5"/><path d="M66 94 Q120 70 174 94 L187 182 Q154 213 120 222 Q86 213 53 182Z" fill="#2c4032" stroke="${accent}" stroke-width="5"/><path d="M86 106 L120 125 L154 106 L146 169 L120 189 L94 169Z" fill="#132119" stroke="${accent}" stroke-opacity=".5"/>${Array.from({ length: detail }, (_, i) => `<path d="M${80 + i * 8} ${105 + i * 14} L${160 - i * 8} ${105 + i * 14}" stroke="${accent}" stroke-width="4" opacity="${.2 + i * .08}"/>`).join('')}<circle cx="120" cy="146" r="${8 + detail}" fill="${accent}" opacity=".8"/></g>`;
    return `<g transform="${transform}"><path d="M54 66 Q82 42 107 78 L112 170 Q88 194 61 171Z" fill="#263a2d" stroke="${accent}" stroke-width="5"/><path d="M186 66 Q158 42 133 78 L128 170 Q152 194 179 171Z" fill="#263a2d" stroke="${accent}" stroke-width="5"/><circle cx="83" cy="113" r="${10 + detail}" fill="${accent}" opacity=".82"/><circle cx="157" cy="113" r="${10 + detail}" fill="${accent}" opacity=".82"/><path d="M83 78 L83 151 M157 78 L157 151" stroke="${accent}" stroke-width="${3 + detail * .5}"/></g>`;
  }

  private gathererRigShape(level: number, accent: string, scale = 1): string {
    const detail = Math.min(8, Math.max(1, level));
    const transform = `translate(${120 - 120 * scale} ${120 - 120 * scale}) scale(${scale})`;
    return `<g transform="${transform}"><rect x="67" y="72" width="106" height="103" rx="29" fill="#20352a" stroke="${accent}" stroke-width="5"/><circle cx="120" cy="119" r="28" fill="#07110d" stroke="${accent}" stroke-width="4"/><circle cx="120" cy="119" r="12" fill="${accent}" opacity=".9"/><path d="M68 99 L37 72 M172 99 L203 72 M76 162 L54 201 M164 162 L186 201" stroke="#405b48" stroke-width="15" stroke-linecap="round"/>${Array.from({ length: detail }, (_, i) => `<circle cx="${78 + (i % 4) * 28}" cy="${52 + Math.floor(i / 4) * 138}" r="6" fill="${accent}" opacity="${.3 + i * .06}"/>`).join('')}</g>`;
  }

  private targetLevel(target: UpgradeTarget): number {
    if (target.kind === 'tool') return this.state.tools[target.id];
    if (target.kind === 'gear') return this.state.gear[target.id];
    return this.gatherer(target.id)?.equipmentLevel ?? 1;
  }

  private targetCost(target: UpgradeTarget): number {
    const level = this.targetLevel(target);
    if (target.kind === 'tool') return toolUpgradeCost(level);
    if (target.kind === 'gear') return gearUpgradeCost(level, gearBases[target.id]);
    return this.store.gathererUpgradeCost(target.id);
  }

  private targetName(target: UpgradeTarget): string {
    if (target.kind === 'tool') return toolNames[target.id];
    if (target.kind === 'gear') return gearNames[target.id];
    return this.gatherer(target.id)?.name ?? 'Gatherer Loadout';
  }

  private targetDescription(target: UpgradeTarget): string {
    if (target.kind === 'tool') return toolDescriptions[target.id];
    if (target.kind === 'gear') return gearDescriptions[target.id];
    const gatherer = this.gatherer(target.id);
    return gatherer ? `${gatherer.name}'s visible field rig, scanner modules, protection layers, and automated extraction equipment.` : 'Automated gathering equipment.';
  }

  private targetSlot(target: UpgradeTarget): string {
    if (target.kind === 'tool') return 'Gathering Tool / Main Hand';
    if (target.kind === 'gear') return gearSlots[target.id];
    return 'Automated Gatherer / Field Rig';
  }

  private formName(target: UpgradeTarget, level: number): string {
    if (target.kind === 'tool') return `${toolNames[target.id]} · ${toolForm(level)}`;
    if (target.kind === 'gear') return `${this.gearForm(target.id, level)} ${gearNames[target.id]}`;
    return `${this.targetName(target)} · ${this.tierMeta(level).label} Loadout`;
  }

  private gearForm(id: GearId, level: number): string {
    const forms: Record<GearId, string[]> = {
      worldpack: ['Fieldframe', 'Reinforced', 'Resonant', 'Worldroot', 'Ascendant'],
      boots: ['Trailworn', 'Ironstep', 'Biomebound', 'Rootstride', 'Ascendant'],
      fieldKit: ['Field', 'Reinforced', 'Verdant', 'Ancient-Tech', 'Ascendant'],
      relicWard: ['Dormant', 'Attuned', 'Awakened', 'Mythic', 'Ascendant'],
    };
    return forms[id][this.tierIndex(level)] ?? forms[id][0];
  }

  private tierMeta(level: number): TierMeta {
    const index = this.tierIndex(level);
    return [
      { label: 'Field Form', rarity: 'COMMON', accent: '#829687', glow: 'rgba(130,150,135,.3)' },
      { label: 'Reinforced Form', rarity: 'UNCOMMON', accent: '#72d992', glow: 'rgba(114,217,146,.34)' },
      { label: 'Awakened Form', rarity: 'RARE', accent: '#72d8ee', glow: 'rgba(114,216,238,.36)' },
      { label: 'Mythic Form', rarity: 'EPIC', accent: '#b58bff', glow: 'rgba(181,139,255,.38)' },
      { label: 'Ascendant Form', rarity: 'LEGENDARY', accent: '#f3cf72', glow: 'rgba(243,207,114,.42)' },
    ][index];
  }

  private tierIndex(level: number): number {
    if (level >= 16) return 4;
    if (level >= 12) return 3;
    if (level >= 8) return 2;
    if (level >= 4) return 1;
    return 0;
  }

  private visualEvolutionText(target: UpgradeTarget, nextLevel: number): string {
    const tier = this.tierMeta(nextLevel);
    if (target.kind === 'tool') return `${tier.label}: added edge geometry, energy core, and reinforced modules`;
    if (target.kind === 'gear' && target.id === 'worldpack') return `${tier.label}: expanded frame, scanner array, and brighter power cell`;
    if (target.kind === 'gear' && target.id === 'boots') return `${tier.label}: heavier traction plates and kinetic channels`;
    if (target.kind === 'gear' && target.id === 'fieldKit') return `${tier.label}: upgraded hood, chest plates, leg guards, and utility lines`;
    if (target.kind === 'gear') return `${tier.label}: stronger gauntlets, ward emitters, and relic core`;
    return `${tier.label}: expanded modules, reinforced limbs, and upgraded scanner mast`;
  }

  private passiveText(target: UpgradeTarget, nextLevel: number): string {
    if (target.kind === 'tool') return `${toolForm(nextLevel)} tuning improves harvesting authority and advances total Gear Level.`;
    if (target.kind === 'gear' && target.id === 'worldpack') return 'Expanded Worldpack architecture increases gathering radius and future carrying-system capacity.';
    if (target.kind === 'gear' && target.id === 'boots') return 'Adaptive traction and kinetic supports improve field mobility and route control.';
    if (target.kind === 'gear' && target.id === 'fieldKit') return 'Layered armor and utility integration improve operation readiness and regional access.';
    if (target.kind === 'gear') return 'Resonance shielding improves deep-region readiness and relic-handling stability.';
    return 'Improved field loadout increases automated efficiency, endurance, and milestone fortune gains.';
  }

  private materialText(level: number): string {
    const tier = this.tierMeta(level);
    if (tier.rarity === 'COMMON') return 'Rugged field cloth, timber, leather, and basic metal reinforcement.';
    if (tier.rarity === 'UNCOMMON') return 'Refined alloys, biome-treated fibers, reinforced joints, and calibrated modules.';
    if (tier.rarity === 'RARE') return 'Crystal conductors, resonant metals, precision mechanisms, and luminous channels.';
    if (tier.rarity === 'EPIC') return 'Ancient-tech plates, living root circuits, relic cores, and unstable energy filaments.';
    return 'Ascendant worldroot matter, perfected cores, floating modules, and legendary energy effects.';
  }

  private normalizeTarget(target: UpgradeTarget): UpgradeTarget {
    if (target.kind !== 'gatherer') return target;
    return this.gatherer(target.id) ? target : { kind: 'gear', id: 'fieldKit' };
  }

  private gatherer(id: string): GathererState | undefined {
    return this.state.network.gatherers.find((item) => item.id === id);
  }

  private targetKey(target: UpgradeTarget): string {
    return `${target.kind}:${target.id}`;
  }

  private parseTarget(value: string): UpgradeTarget | null {
    const [kind, id] = value.split(':');
    if (kind === 'tool' && Object.prototype.hasOwnProperty.call(toolNames, id)) return { kind, id: id as ToolId };
    if (kind === 'gear' && Object.prototype.hasOwnProperty.call(gearNames, id)) return { kind, id: id as GearId };
    if (kind === 'gatherer' && this.gatherer(id)) return { kind, id };
    return null;
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
