import { toolForm, toolNames, type ToolId } from '../data/content';
import { gearUpgradeCost, toolUpgradeCost } from '../systems/Progression';
import type { GameStore, StoreEvent } from '../state/GameStore';
import type { GameState, GathererState } from '../state/GameState';

type GearId = keyof GameState['gear'];
type UpgradeTarget =
  | { kind: 'tool'; id: ToolId }
  | { kind: 'gear'; id: GearId }
  | { kind: 'gatherer'; id: string };

interface TierMeta { label: string; rarity: string; accent: string; }
interface ComparisonLine { label: string; current: string; next: string; }

const gearNames: Record<GearId, string> = {
  worldpack: 'Worldpack', boots: 'Trail Boots', fieldKit: 'Field Kit', relicWard: 'Relic Ward',
};
const gearBases: Record<GearId, number> = { worldpack: 55, boots: 48, fieldKit: 62, relicWard: 85 };
const gearSlots: Record<GearId, string> = {
  worldpack: 'Backpack / Scanner / Power Cell', boots: 'Boots',
  fieldKit: 'Head / Chest / Legs / Utility', relicWard: 'Gloves / Relic Core',
};
const gearDescriptions: Record<GearId, string> = {
  worldpack: 'Storage frame, scanner mount, utility lines, and power-cell housing.',
  boots: 'Biome-adaptive traction, reinforced soles, and kinetic movement supports.',
  fieldKit: 'Hood, chest layers, leg protection, utility harness, and field armor.',
  relicWard: 'Relic gloves, resonance bracers, ward core, and ancient-tech shielding.',
};
const toolDescriptions: Record<ToolId, string> = {
  axe: 'Worldroot harvesting edge built for living timber and ancient bark.',
  pickaxe: 'Veinbreaker mineral tool tuned for ore, crystal, and deep-stone resonance.',
  sickle: 'Dawn Sickle optimized for delicate flora, dew, fibers, and rare growth.',
  gloves: 'Relic Gloves designed for artifacts, unstable materials, and precision recovery.',
};
const tiers: readonly TierMeta[] = [
  { label: 'Field Form', rarity: 'COMMON', accent: '#829687' },
  { label: 'Reinforced Form', rarity: 'UNCOMMON', accent: '#72d992' },
  { label: 'Awakened Form', rarity: 'RARE', accent: '#72d8ee' },
  { label: 'Mythic Form', rarity: 'EPIC', accent: '#b58bff' },
  { label: 'Ascendant Form', rarity: 'LEGENDARY', accent: '#f3cf72' },
];

export class UpgradePreviewSystem {
  private state: Readonly<GameState>;
  private active = false;
  private previewApplied = true;
  private compareMode = true;
  private selected: UpgradeTarget = { kind: 'gear', id: 'fieldKit' };
  private unsubscribe: (() => void) | null = null;

  constructor(private store: GameStore) { this.state = store.snapshot; }

  initialize(): void {
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => tab.addEventListener('click', () => {
      this.active = tab.dataset.view === 'market';
      if (this.active) queueMicrotask(() => this.render());
    }));
    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type !== 'state') return;
      this.state = event.state;
      if (this.active) queueMicrotask(() => this.render());
    });
    this.active = document.querySelector<HTMLButtonElement>('.command-tab.active')?.dataset.view === 'market';
    if (this.active) queueMicrotask(() => this.render());
  }

  destroy(): void { this.unsubscribe?.(); }

  private render(): void {
    if (!this.active) return;
    const overlay = document.querySelector<HTMLElement>('#strategic-overlay');
    if (!overlay) return;
    this.selected = this.normalizeTarget(this.selected);
    const current = this.targetLevel(this.selected);
    const next = current + 1;
    const currentTier = this.tier(current);
    const nextTier = this.tier(next);
    const cost = this.targetCost(this.selected);
    const canAfford = this.state.coins >= cost;

    this.setHeader('VISUAL EQUIPMENT EVOLUTION LAB', 'Worldroot Loadout Preview', 'Compare current and next-tier artwork, apply live previews, and confirm only when ready.');
    overlay.innerHTML = `<div class="upgrade-preview-shell">
      <aside class="upgrade-library">
        ${this.librarySection('PLAYER TOOLS', (Object.keys(toolNames) as ToolId[]).map((id) => ({ kind: 'tool', id } as UpgradeTarget)))}
        ${this.librarySection('VISIBLE FIELD GEAR', (Object.keys(gearNames) as GearId[]).map((id) => ({ kind: 'gear', id } as UpgradeTarget)))}
        ${this.librarySection('AUTOMATED GATHERERS', this.state.network.gatherers.map((g) => ({ kind: 'gatherer', id: g.id } as UpgradeTarget)))}
      </aside>
      <section class="upgrade-model-stage">
        <div class="upgrade-stage-toolbar"><div><span>LIVE CHARACTER PREVIEW</span><strong>${this.escape(this.targetName(this.selected))}</strong></div>
          <div class="upgrade-toolbar-actions"><button class="upgrade-mini-button ${this.compareMode ? 'active' : ''}" data-upgrade-compare>${this.compareMode ? 'SPLIT VIEW ON' : 'SPLIT VIEW OFF'}</button><button class="upgrade-mini-button ${this.previewApplied ? 'active' : ''}" data-upgrade-apply-preview>${this.previewApplied ? 'PREVIEW APPLIED' : 'APPLY PREVIEW'}</button></div>
        </div>
        <div class="upgrade-model-layout ${this.compareMode ? 'compare' : 'single'}">
          ${this.compareMode ? `<div class="model-pane"><span class="model-label">CURRENT BUILD</span>${this.fullModel(this.selected, false)}</div>` : ''}
          <div class="model-pane preview-pane"><span class="model-label">${this.previewApplied ? 'UPGRADE PREVIEW' : 'CURRENT BUILD'}</span>${this.fullModel(this.selected, this.previewApplied)}</div>
        </div>
        <div class="changed-slot-banner"><span class="changed-pulse"></span><strong>CHANGED REGION</strong><span>${this.escape(this.targetSlot(this.selected))}</span></div>
        <div class="visual-trait-strip"><div><span>CURRENT STYLE</span><strong>${currentTier.label}</strong></div><div><span>NEXT STYLE</span><strong style="color:${nextTier.accent}">${nextTier.label}</strong></div><div><span>VISUAL EVOLUTION</span><strong>${this.escape(this.visualEvolutionText(this.selected, next))}</strong></div></div>
      </section>
      <aside class="upgrade-comparison-panel">
        <div class="upgrade-comparison-heading"><span>SIDE-BY-SIDE EQUIPMENT ART</span><strong>${cost.toLocaleString()}c</strong></div>
        <div class="item-comparison-grid">${this.itemComparisonCard(this.selected, current, 'CURRENT')}${this.itemComparisonCard(this.selected, next, 'NEXT UPGRADE')}</div>
        <section class="upgrade-detail-card"><div class="upgrade-rarity-line"><span style="--rarity:${nextTier.accent}"></span><strong>${nextTier.rarity} · TIER ${next}</strong></div><p>${this.escape(this.targetDescription(this.selected))}</p><div class="upgrade-stat-list">${this.comparisonLines(this.selected).map((line) => `<div><span>${this.escape(line.label)}</span><strong>${this.escape(line.current)}</strong><b>→</b><em class="positive">${this.escape(line.next)}</em></div>`).join('')}</div></section>
        <section class="upgrade-passive-card"><span>NEW PASSIVE / VISUAL TRAIT</span><strong>${this.escape(this.passiveText(this.selected, next))}</strong><p>${this.escape(this.materialText(next))}</p></section>
        <div class="upgrade-confirm-row"><button class="upgrade-revert-button" data-upgrade-revert>REVERT PREVIEW</button><button class="upgrade-confirm-button" data-upgrade-confirm ${canAfford ? '' : 'disabled'}>${canAfford ? `CONFIRM ${cost.toLocaleString()}c` : `NEED ${(cost - this.state.coins).toLocaleString()}c`}</button></div>
      </aside>
    </div>`;
    this.bindActions(overlay);
  }

  private librarySection(title: string, targets: UpgradeTarget[]): string {
    return `<div class="upgrade-section-heading"><span>${title}</span><strong>${targets.length}</strong></div><div class="upgrade-asset-grid">${targets.map((target) => this.assetCard(target)).join('')}</div>`;
  }

  private assetCard(target: UpgradeTarget): string {
    const level = this.targetLevel(target);
    const tier = this.tier(level);
    const selected = this.targetKey(target) === this.targetKey(this.selected);
    return `<button class="upgrade-asset-card ${selected ? 'selected' : ''}" data-upgrade-target="${this.targetKey(target)}" style="--upgrade-accent:${tier.accent}"><div class="upgrade-thumb">${this.itemArt(target, level)}</div><div class="upgrade-asset-copy"><strong>${this.escape(this.targetName(target))}</strong><span>Lv ${level} · ${tier.rarity}</span></div><span class="preview-tag">PREVIEW</span></button>`;
  }

  private itemComparisonCard(target: UpgradeTarget, level: number, label: string): string {
    const tier = this.tier(level);
    return `<article class="item-comparison-card" style="--upgrade-accent:${tier.accent}"><div class="comparison-label">${label}</div><div class="large-item-render">${this.itemArt(target, level)}</div><span class="rarity-chip">${tier.rarity}</span><h3>${this.escape(this.formName(target, level))}</h3><p>Level ${level} · ${this.escape(this.targetSlot(target))}</p></article>`;
  }

  private bindActions(root: HTMLElement): void {
    root.querySelectorAll<HTMLButtonElement>('[data-upgrade-target]').forEach((button) => {
      const select = () => {
        const parsed = this.parseTarget(button.dataset.upgradeTarget ?? '');
        if (!parsed || (this.targetKey(parsed) === this.targetKey(this.selected) && this.previewApplied)) return;
        this.selected = parsed; this.previewApplied = true; this.render();
      };
      button.addEventListener('click', select); button.addEventListener('mouseenter', select); button.addEventListener('focus', select);
    });
    root.querySelector<HTMLButtonElement>('[data-upgrade-apply-preview]')?.addEventListener('click', () => { this.previewApplied = !this.previewApplied; this.render(); });
    root.querySelector<HTMLButtonElement>('[data-upgrade-compare]')?.addEventListener('click', () => { this.compareMode = !this.compareMode; this.render(); });
    root.querySelector<HTMLButtonElement>('[data-upgrade-revert]')?.addEventListener('click', () => { this.previewApplied = false; this.render(); });
    root.querySelector<HTMLButtonElement>('[data-upgrade-confirm]')?.addEventListener('click', () => {
      if (this.state.coins < this.targetCost(this.selected)) return;
      if (this.selected.kind === 'tool') this.store.upgradeTool(this.selected.id);
      else if (this.selected.kind === 'gear') this.store.upgradeGear(this.selected.id);
      else this.store.upgradeGatherer(this.selected.id);
      this.previewApplied = true;
    });
  }

  private comparisonLines(target: UpgradeTarget): ComparisonLine[] {
    const current = this.targetLevel(target), next = current + 1;
    if (target.kind === 'tool') return [
      { label: 'Tool Level', current: String(current), next: String(next) },
      { label: 'Harvest Yield Tier', current: `+${Math.floor((current - 1) / 3)}`, next: `+${Math.floor((next - 1) / 3)}` },
      { label: 'Gear Rating', current: `+${Math.max(0, current - 1)}`, next: `+${Math.max(0, next - 1)}` },
      { label: 'Visual Form', current: toolForm(current), next: toolForm(next) },
    ];
    if (target.kind === 'gear') {
      const result = [
        { label: 'Equipment Level', current: String(current), next: String(next) },
        { label: 'Gear Rating', current: `+${current}`, next: `+${next}` },
        { label: 'Visual Tier', current: this.tier(current).label, next: this.tier(next).label },
      ];
      if (target.id === 'worldpack') result.push({ label: 'Gather Radius Bonus', current: `+${current * 7}m`, next: `+${next * 7}m` });
      else result.push({ label: 'System Mark', current: `Mk ${current}`, next: `Mk ${next}` });
      return result;
    }
    const gatherer = this.gatherer(target.id);
    if (!gatherer) return [];
    return [
      { label: 'Equipment Tier', current: String(current), next: String(next) },
      { label: 'Efficiency', current: `${Math.round(gatherer.efficiency * 100)}%`, next: `${Math.round((gatherer.efficiency + .055) * 100)}%` },
      { label: 'Endurance', current: String(gatherer.endurance), next: String(gatherer.endurance + 1) },
      { label: 'Fortune', current: String(gatherer.fortune), next: String(gatherer.fortune + (next % 3 === 0 ? 1 : 0)) },
    ];
  }

  private fullModel(target: UpgradeTarget, preview: boolean): string {
    if (target.kind === 'gatherer') return this.gathererModel(target, this.targetLevel(target) + (preview ? 1 : 0), preview);
    const levels = { ...this.state.gear, tool: target.kind === 'tool' ? this.state.tools[target.id] : this.state.tools.axe };
    if (preview && target.kind === 'gear') levels[target.id] += 1;
    if (preview && target.kind === 'tool') levels.tool += 1;
    return this.characterModel(target, levels, preview);
  }

  private characterModel(target: UpgradeTarget, levels: GameState['gear'] & { tool: number }, preview: boolean): string {
    const max = Math.max(levels.worldpack, levels.boots, levels.fieldKit, levels.relicWard, levels.tool);
    const accent = this.tier(max).accent;
    const changed = (slot: GearId | 'tool') => preview && ((target.kind === 'gear' && target.id === slot) || (target.kind === 'tool' && slot === 'tool')) ? 'upgrade-changed' : '';
    const dots = (count: number, x: number, y: number) => Array.from({ length: Math.min(6, count) }, (_, i) => `<circle cx="${x + (i % 2) * 18}" cy="${y + Math.floor(i / 2) * 26}" r="6" fill="${accent}" opacity="${.28 + i * .08}"/>`).join('');
    return `<svg class="character-upgrade-svg" viewBox="0 0 360 520" role="img"><defs><filter id="modelGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><ellipse cx="180" cy="255" rx="160" ry="225" fill="${accent}" opacity=".07"/><circle cx="180" cy="250" r="140" fill="none" stroke="${accent}" stroke-opacity=".18" stroke-dasharray="4 10"/><ellipse cx="180" cy="475" rx="95" ry="17" fill="#000" opacity=".48"/>
      <g class="${changed('worldpack')}"><path d="M118 171 Q87 190 94 325 L129 342 L143 190Z" fill="#26392d" stroke="${accent}" stroke-opacity=".5" stroke-width="3"/>${dots(levels.worldpack,101,207)}</g>
      <g class="${changed('fieldKit')}"><path d="M130 112 Q180 63 230 112 L216 170 Q180 190 144 170Z" fill="#15241b" stroke="${accent}" stroke-width="3"/><path d="M126 174 Q180 148 234 174 L250 327 Q217 393 180 412 Q143 393 110 327Z" fill="#25382c" stroke="${accent}" stroke-width="3"/><path d="M143 190 L180 211 L217 190 L207 278 L180 302 L153 278Z" fill="#102018" stroke="${accent}" stroke-opacity=".55"/><circle cx="180" cy="243" r="${10 + Math.min(8, levels.fieldKit)}" fill="${accent}" opacity=".8" filter="url(#modelGlow)"/><path d="M128 315 L98 444 L145 463 L176 350Z M232 315 L262 444 L215 463 L184 350Z" fill="#192b21"/></g>
      <g class="${changed('relicWard')}"><path d="M122 194 Q85 211 80 307 L103 319 L140 223Z M238 194 Q275 211 280 307 L257 319 L220 223Z" fill="#20362a" stroke="${accent}" stroke-opacity=".55"/><rect x="77" y="288" width="36" height="68" rx="12" fill="#122219" stroke="${accent}" stroke-width="${1 + levels.relicWard * .35}"/><rect x="247" y="288" width="36" height="68" rx="12" fill="#122219" stroke="${accent}" stroke-width="${1 + levels.relicWard * .35}"/></g>
      <g class="${changed('boots')}"><path d="M126 388 L169 391 L163 477 L106 477 Q101 459 122 448Z M234 388 L191 391 L197 477 L254 477 Q259 459 238 448Z" fill="#15271d" stroke="${accent}" stroke-width="${1 + levels.boots * .3}"/></g>
      <g class="${changed('tool')}" transform="translate(246 245) scale(.72)">${this.toolShape(target.kind === 'tool' ? target.id : 'axe', levels.tool, accent)}</g>${preview ? `<text x="180" y="505" text-anchor="middle" fill="${accent}" font-size="11" letter-spacing="3">LIVE PREVIEW ACTIVE</text>` : ''}</svg>`;
  }

  private gathererModel(target: UpgradeTarget, level: number, preview: boolean): string {
    const gatherer = target.kind === 'gatherer' ? this.gatherer(target.id) : undefined;
    const accent = this.tier(level).accent;
    return `<svg class="character-upgrade-svg" viewBox="0 0 360 520" role="img"><ellipse cx="180" cy="260" rx="160" ry="220" fill="${accent}" opacity=".08"/><circle cx="180" cy="245" r="142" fill="none" stroke="${accent}" stroke-opacity=".2" stroke-dasharray="4 10"/><ellipse cx="180" cy="473" rx="94" ry="17" fill="#000" opacity=".5"/><g class="${preview ? 'upgrade-changed' : ''}"><path d="M130 126 Q180 82 230 126 L218 184 Q180 202 142 184Z" fill="#14251c" stroke="${accent}" stroke-width="3"/><rect x="116" y="180" width="128" height="190" rx="42" fill="#1b2e23" stroke="${accent}" stroke-width="3"/><circle cx="180" cy="232" r="25" fill="#07110d" stroke="${accent}" stroke-width="3"/><circle cx="180" cy="232" r="11" fill="${accent}"/><path d="M117 213 L74 294 L100 311 L141 248 M243 213 L286 294 L260 311 L219 248" fill="none" stroke="#385642" stroke-width="24" stroke-linecap="round"/><path d="M142 354 L125 468 L166 474 L180 372 L194 474 L235 468 L218 354" fill="#16271e" stroke="${accent}" stroke-width="3"/><rect x="88" y="166" width="38" height="126" rx="14" fill="#0d1913" stroke="${accent}"/>${Array.from({ length: Math.min(8, level) }, (_, i) => `<circle cx="${99 + (i % 2) * 18}" cy="${185 + Math.floor(i / 2) * 26}" r="6" fill="${accent}" opacity="${.3 + i * .07}"/>`).join('')}</g><text x="180" y="42" text-anchor="middle" fill="${accent}" font-size="12" letter-spacing="3">${this.escape(gatherer?.role.toUpperCase() ?? 'FIELD UNIT')}</text><text x="180" y="505" text-anchor="middle" fill="#b9d7c1" font-size="13">${this.escape(gatherer?.name ?? 'Gatherer')}</text></svg>`;
  }

  private itemArt(target: UpgradeTarget, level: number): string {
    const tier = this.tier(level), accent = tier.accent;
    const shape = target.kind === 'tool' ? this.toolShape(target.id, level, accent) : target.kind === 'gear' ? this.gearShape(target.id, level, accent) : this.rigShape(level, accent);
    return `<svg class="upgrade-item-svg" viewBox="0 0 240 240" role="img"><circle cx="120" cy="120" r="101" fill="${accent}" opacity=".07"/><circle cx="120" cy="120" r="92" fill="none" stroke="${accent}" stroke-opacity=".32" stroke-width="2" stroke-dasharray="4 8"/>${shape}</svg>`;
  }

  private toolShape(id: ToolId, level: number, accent: string): string {
    const detail = Math.min(7, Math.max(1, Math.ceil(level / 3)));
    if (id === 'axe') return `<path d="M106 43 L128 42 L139 184 L117 190Z" fill="#584932" stroke="#b69b6b" stroke-width="4"/><path d="M78 48 Q118 19 174 49 L160 104 Q125 90 91 115 L61 91Z" fill="#274333" stroke="${accent}" stroke-width="5"/><circle cx="124" cy="80" r="${7 + detail}" fill="${accent}"/>`;
    if (id === 'pickaxe') return `<path d="M112 48 L132 48 L137 194 L115 194Z" fill="#4b4439" stroke="#a99b7e" stroke-width="4"/><path d="M45 72 Q119 24 196 72 L181 96 Q122 72 59 99Z" fill="#30424a" stroke="${accent}" stroke-width="5"/><circle cx="123" cy="77" r="${7 + detail}" fill="${accent}"/>`;
    if (id === 'sickle') return `<path d="M112 104 L132 105 L126 202 L105 198Z" fill="#584932" stroke="#b69b6b" stroke-width="4"/><path d="M122 110 Q85 94 68 56 Q121 27 177 72 Q139 73 122 110Z" fill="#294b3a" stroke="${accent}" stroke-width="5"/><circle cx="119" cy="104" r="${6 + detail}" fill="${accent}"/>`;
    return `<path d="M70 73 Q91 51 111 78 L119 129 L105 178 L75 160Z M170 73 Q149 51 129 78 L121 129 L135 178 L165 160Z" fill="#263e31" stroke="${accent}" stroke-width="5"/><circle cx="96" cy="111" r="${8 + detail}" fill="${accent}"/><circle cx="144" cy="111" r="${8 + detail}" fill="${accent}"/>`;
  }

  private gearShape(id: GearId, level: number, accent: string): string {
    const detail = Math.min(7, Math.max(1, Math.ceil(level / 2)));
    if (id === 'worldpack') return `<rect x="67" y="47" width="106" height="145" rx="28" fill="#24372b" stroke="${accent}" stroke-width="5"/><rect x="86" y="66" width="68" height="47" rx="12" fill="#101d16" stroke="${accent}"/><circle cx="120" cy="89" r="${12 + detail}" fill="${accent}"/>`;
    if (id === 'boots') return `<path d="M64 50 L113 54 L110 158 L90 194 L39 188 Q35 164 61 149Z M176 50 L127 54 L130 158 L150 194 L201 188 Q205 164 179 149Z" fill="#24362b" stroke="${accent}" stroke-width="5"/><path d="M52 155 L104 155 M136 155 L188 155" stroke="${accent}" stroke-width="${3 + detail}"/>`;
    if (id === 'fieldKit') return `<path d="M78 51 Q120 20 162 51 L151 92 Q120 105 89 92Z" fill="#1b2b21" stroke="${accent}" stroke-width="5"/><path d="M66 94 Q120 70 174 94 L187 182 Q154 213 120 222 Q86 213 53 182Z" fill="#2c4032" stroke="${accent}" stroke-width="5"/><circle cx="120" cy="146" r="${8 + detail}" fill="${accent}"/>`;
    return `<path d="M54 66 Q82 42 107 78 L112 170 Q88 194 61 171Z M186 66 Q158 42 133 78 L128 170 Q152 194 179 171Z" fill="#263a2d" stroke="${accent}" stroke-width="5"/><circle cx="83" cy="113" r="${10 + detail}" fill="${accent}"/><circle cx="157" cy="113" r="${10 + detail}" fill="${accent}"/>`;
  }

  private rigShape(level: number, accent: string): string {
    return `<rect x="67" y="72" width="106" height="103" rx="29" fill="#20352a" stroke="${accent}" stroke-width="5"/><circle cx="120" cy="119" r="28" fill="#07110d" stroke="${accent}" stroke-width="4"/><circle cx="120" cy="119" r="${10 + Math.min(8, level)}" fill="${accent}"/><path d="M68 99 L37 72 M172 99 L203 72 M76 162 L54 201 M164 162 L186 201" stroke="#405b48" stroke-width="15" stroke-linecap="round"/>`;
  }

  private targetLevel(target: UpgradeTarget): number { return target.kind === 'tool' ? this.state.tools[target.id] : target.kind === 'gear' ? this.state.gear[target.id] : this.gatherer(target.id)?.equipmentLevel ?? 1; }
  private targetCost(target: UpgradeTarget): number { const level = this.targetLevel(target); return target.kind === 'tool' ? toolUpgradeCost(level) : target.kind === 'gear' ? gearUpgradeCost(level, gearBases[target.id]) : this.store.gathererUpgradeCost(target.id); }
  private targetName(target: UpgradeTarget): string { return target.kind === 'tool' ? toolNames[target.id] : target.kind === 'gear' ? gearNames[target.id] : this.gatherer(target.id)?.name ?? 'Gatherer Loadout'; }
  private targetDescription(target: UpgradeTarget): string { return target.kind === 'tool' ? toolDescriptions[target.id] : target.kind === 'gear' ? gearDescriptions[target.id] : `${this.targetName(target)} field rig, scanner modules, protection layers, and extraction equipment.`; }
  private targetSlot(target: UpgradeTarget): string { return target.kind === 'tool' ? 'Gathering Tool / Main Hand' : target.kind === 'gear' ? gearSlots[target.id] : 'Automated Gatherer / Field Rig'; }
  private formName(target: UpgradeTarget, level: number): string { return target.kind === 'tool' ? `${toolNames[target.id]} · ${toolForm(level)}` : `${this.targetName(target)} · ${this.tier(level).label}`; }
  private tier(level: number): TierMeta { return tiers[this.tierIndex(level)] ?? tiers[0]!; }
  private tierIndex(level: number): number { return level >= 16 ? 4 : level >= 12 ? 3 : level >= 8 ? 2 : level >= 4 ? 1 : 0; }
  private visualEvolutionText(target: UpgradeTarget, next: number): string { const tier = this.tier(next).label; return target.kind === 'tool' ? `${tier}: stronger geometry, energy core, and reinforced modules` : target.kind === 'gatherer' ? `${tier}: expanded modules, reinforced limbs, and upgraded scanner mast` : `${tier}: more armor detail, luminous channels, and nature-tech components`; }
  private passiveText(target: UpgradeTarget, next: number): string { return target.kind === 'tool' ? `${toolForm(next)} tuning improves harvesting authority and total Gear Level.` : target.kind === 'gatherer' ? 'Improved field loadout increases automated efficiency, endurance, and milestone fortune gains.' : target.id === 'worldpack' ? 'Expanded architecture increases gathering radius and future carrying capacity.' : 'The upgraded system improves field readiness, mobility, protection, and regional access.'; }
  private materialText(level: number): string { const rarity = this.tier(level).rarity; return rarity === 'COMMON' ? 'Rugged cloth, timber, leather, and basic metal reinforcement.' : rarity === 'UNCOMMON' ? 'Refined alloys, biome-treated fibers, and calibrated modules.' : rarity === 'RARE' ? 'Crystal conductors, resonant metals, and luminous channels.' : rarity === 'EPIC' ? 'Ancient-tech plates, living root circuits, and relic cores.' : 'Ascendant worldroot matter, perfected cores, and legendary energy effects.'; }
  private normalizeTarget(target: UpgradeTarget): UpgradeTarget { return target.kind !== 'gatherer' || this.gatherer(target.id) ? target : { kind: 'gear', id: 'fieldKit' }; }
  private gatherer(id: string): GathererState | undefined { return this.state.network.gatherers.find((item) => item.id === id); }
  private targetKey(target: UpgradeTarget): string { return `${target.kind}:${target.id}`; }
  private parseTarget(value: string): UpgradeTarget | null { const [kind, id] = value.split(':'); if (!kind || !id) return null; if (kind === 'tool' && Object.prototype.hasOwnProperty.call(toolNames, id)) return { kind, id: id as ToolId }; if (kind === 'gear' && Object.prototype.hasOwnProperty.call(gearNames, id)) return { kind, id: id as GearId }; return kind === 'gatherer' && this.gatherer(id) ? { kind, id } : null; }
  private setHeader(kicker: string, title: string, subtitle: string): void { const k = document.querySelector<HTMLElement>('#operation-kicker'), t = document.querySelector<HTMLElement>('#operation-title'), s = document.querySelector<HTMLElement>('#operation-subtitle'); if (k) k.textContent = kicker; if (t) t.textContent = title; if (s) s.textContent = subtitle; }
  private escape(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
}
