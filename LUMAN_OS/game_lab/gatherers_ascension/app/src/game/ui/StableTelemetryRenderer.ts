import type { GatheringZoneDefinition } from '../data/network';
import type { GameState, GathererState, NetworkActivity } from '../state/GameState';
import type { LiveDashboardTelemetry } from './LiveDashboardTelemetry';

interface StableOperation {
  gatherer: GathererState;
  zone: GatheringZoneDefinition;
  progress: number;
  remainingMs: number;
  expectedUnits: number;
  unitsPerMinute: number;
  valuePerMinute: number;
}

interface StableInventoryItem {
  name: string;
  units: number;
  value: number;
}

type TelemetryInternals = {
  state: Readonly<GameState>;
  renderOperations: (root: HTMLElement, operations: StableOperation[]) => void;
  renderInventory: (root: HTMLElement, items: StableInventoryItem[]) => void;
  renderMasteries: (root: HTMLElement) => void;
  renderActivities: (root: HTMLElement, activities: NetworkActivity[]) => void;
};

/**
 * Replaces the remaining interval-driven innerHTML writes with fixed DOM slots.
 * Live updates change text and bar widths only, so dashboard height and scroll
 * position remain stable while timers continue moving.
 */
export class StableTelemetryRenderer {
  stabilize(telemetry: LiveDashboardTelemetry): void {
    const internal = telemetry as unknown as TelemetryInternals;
    internal.renderOperations = (root, operations) => this.updateOperations(root, operations);
    internal.renderInventory = (root, items) => this.updateInventory(root, items);
    internal.renderMasteries = (root) => this.updateMasteries(root, internal.state);
    internal.renderActivities = (root, activities) => this.updateActivities(root, activities);
  }

  private updateOperations(root: HTMLElement, operations: StableOperation[]): void {
    const target = root.querySelector<HTMLElement>('#rt-operation-grid');
    if (!target) return;

    const ordered = [...operations].sort((a, b) => a.gatherer.id.localeCompare(b.gatherer.id));
    const signature = ordered.map((operation) => `${operation.gatherer.id}:${operation.zone.id}`).join('|') || 'idle';
    if (target.dataset.structure !== signature) {
      target.dataset.structure = signature;
      target.innerHTML = ordered.length
        ? ordered.map((operation) => `<div class="live-operation-card" data-stable-operation="${this.escape(operation.gatherer.id)}">
          <div class="live-operation-title"><div><strong data-op-name></strong><span data-op-zone></span></div><b data-op-remaining>--:--</b></div>
          <div class="live-cycle-bar" style="--cycle:0%"><span></span></div>
          <div class="live-operation-stats">
            <span><small>Cycle</small><strong data-op-progress>0%</strong></span>
            <span><small>Expected</small><strong data-op-expected>0 units</strong></span>
            <span><small>Rate</small><strong data-op-rate>0/m</strong></span>
            <span><small>Value</small><strong data-op-value>0c/m</strong></span>
            <span><small>Efficiency</small><strong data-op-efficiency>0%</strong></span>
            <span><small>Equipment</small><strong data-op-equipment>T1</strong></span>
          </div>
        </div>`).join('')
        : '<div class="live-empty stable-live-empty">No gatherers deployed. Open Network to start a measurable extraction stream.</div>';
    }

    if (!ordered.length) return;
    const cards = [...target.querySelectorAll<HTMLElement>('[data-stable-operation]')];
    for (const operation of ordered) {
      const card = cards.find((candidate) => candidate.dataset.stableOperation === operation.gatherer.id);
      if (!card) continue;
      this.text(card, '[data-op-name]', operation.gatherer.name);
      this.text(card, '[data-op-zone]', `${operation.zone.name} · ${operation.gatherer.role}`);
      this.text(card, '[data-op-remaining]', this.formatClock(operation.remainingMs));
      this.text(card, '[data-op-progress]', `${operation.progress.toFixed(1)}%`);
      this.text(card, '[data-op-expected]', `${operation.expectedUnits} units`);
      this.text(card, '[data-op-rate]', `${operation.unitsPerMinute.toFixed(1)}/m`);
      this.text(card, '[data-op-value]', `${Math.round(operation.valuePerMinute)}c/m`);
      this.text(card, '[data-op-efficiency]', `${Math.round(operation.gatherer.efficiency * 100)}%`);
      this.text(card, '[data-op-equipment]', `T${operation.gatherer.equipmentLevel}`);
      card.querySelector<HTMLElement>('.live-cycle-bar')?.style.setProperty('--cycle', `${operation.progress.toFixed(1)}%`);
    }
  }

  private updateInventory(root: HTMLElement, items: StableInventoryItem[]): void {
    const target = root.querySelector<HTMLElement>('#rt-inventory-list');
    if (!target) return;
    if (target.dataset.stableSlots !== 'true') {
      target.dataset.stableSlots = 'true';
      target.innerHTML = Array.from({ length: 7 }, (_, index) => `<div class="stable-inventory-slot" data-inventory-slot="${index}"><span><i class="inventory-rank r${index}"></i><b data-inventory-name>Awaiting material</b></span><strong data-inventory-units>0</strong><small data-inventory-value>0c</small></div>`).join('');
    }

    const visible = items.slice(0, 7);
    target.querySelectorAll<HTMLElement>('[data-inventory-slot]').forEach((row, index) => {
      const item = visible[index];
      row.classList.toggle('stable-slot-empty', !item);
      row.setAttribute('aria-hidden', item ? 'false' : 'true');
      this.text(row, '[data-inventory-name]', item?.name ?? 'Awaiting material');
      this.text(row, '[data-inventory-units]', item ? item.units.toLocaleString() : '0');
      this.text(row, '[data-inventory-value]', item ? `${item.value.toLocaleString()}c` : '0c');
    });
  }

  private updateMasteries(root: HTMLElement, state: Readonly<GameState>): void {
    const target = root.querySelector<HTMLElement>('#rt-mastery-grid');
    if (!target) return;
    const tools = ['axe', 'pickaxe', 'sickle', 'gloves'] as const;
    if (target.dataset.stableSlots !== 'true') {
      target.dataset.stableSlots = 'true';
      target.innerHTML = tools.map((tool) => `<div data-mastery-tool="${tool}"><span>${this.toolName(tool)}</span><strong data-mastery-level>Lv 1</strong><div class="live-progress"><span data-mastery-bar></span></div></div>`).join('');
    }

    tools.forEach((tool) => {
      const row = [...target.querySelectorAll<HTMLElement>('[data-mastery-tool]')].find((candidate) => candidate.dataset.masteryTool === tool);
      if (!row) return;
      const skill = state.skills[tool];
      const needed = Math.floor(65 + Math.pow(skill.level, 1.35) * 50);
      const progress = needed > 0 ? Math.max(0, Math.min(100, (skill.xp / needed) * 100)) : 100;
      this.text(row, '[data-mastery-level]', `Lv ${skill.level}`);
      row.querySelector<HTMLElement>('[data-mastery-bar]')?.style.setProperty('width', `${progress.toFixed(1)}%`);
    });
  }

  private updateActivities(root: HTMLElement, activities: NetworkActivity[]): void {
    const target = root.querySelector<HTMLElement>('#rt-event-list');
    if (!target) return;
    if (target.dataset.stableSlots !== 'true') {
      target.dataset.stableSlots = 'true';
      target.innerHTML = Array.from({ length: 6 }, (_, index) => `<div class="stable-event-slot" data-event-slot="${index}"><span data-event-age>--</span><div><strong data-event-title>Awaiting network event</strong><small data-event-detail>No signal recorded</small></div></div>`).join('');
    }

    target.querySelectorAll<HTMLElement>('[data-event-slot]').forEach((row, index) => {
      const activity = activities[index];
      row.className = `stable-event-slot ${activity ? `event-${activity.tone}` : 'stable-slot-empty'}`;
      row.setAttribute('aria-hidden', activity ? 'false' : 'true');
      this.text(row, '[data-event-age]', activity ? this.relativeDuration(Date.now() - activity.timestamp) : '--');
      this.text(row, '[data-event-title]', activity?.title ?? 'Awaiting network event');
      this.text(row, '[data-event-detail]', activity?.detail ?? 'No signal recorded');
    });
  }

  private text(root: HTMLElement, selector: string, value: string): void {
    const target = root.querySelector<HTMLElement>(selector);
    if (target && target.textContent !== value) target.textContent = value;
  }

  private toolName(tool: 'axe' | 'pickaxe' | 'sickle' | 'gloves'): string {
    return ({ axe: 'Worldroot Axe', pickaxe: 'Veinbreaker Pick', sickle: 'Dawn Sickle', gloves: 'Relic Gloves' })[tool];
  }

  private formatClock(milliseconds: number): string {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  private relativeDuration(milliseconds: number): string {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  }

  private escape(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
