import type { BiomeId } from '../data/content';
import type { GameStore, StoreEvent } from '../state/GameStore';

export type AudioCommandView = 'dashboard' | 'field' | 'network' | 'gatherers' | 'codex' | 'market';
type TrackKey = 'command' | BiomeId;

interface TrackDefinition {
  label: string;
  file: string;
}

const tracks: Record<TrackKey, TrackDefinition> = {
  command: { label: 'Worldroot Command Center', file: 'audio/worldroot-command-center.mp3' },
  greenveil: { label: 'Greenveil Meadow', file: 'audio/greenveil-meadow.mp3' },
  ironfall: { label: 'Ironfall Basin', file: 'audio/ironfall-basin.mp3' },
  'crystal-vale': { label: 'Crystal Vale', file: 'audio/crystal-vale.mp3' },
  emberdeep: { label: 'Emberdeep Archive', file: 'audio/emberdeep-archive.mp3' },
};

const VOLUME_KEY = 'gatherers-ascension-music-volume';
const MUTED_KEY = 'gatherers-ascension-music-muted';

export class AudioManager {
  private currentView: AudioCommandView = 'dashboard';
  private currentKey: TrackKey | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private fadingAudio: HTMLAudioElement | null = null;
  private armed = false;
  private switching = false;
  private volume = this.readVolume();
  private muted = localStorage.getItem(MUTED_KEY) === 'true';
  private trackLabel: HTMLElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private volumeSlider: HTMLInputElement | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor(private store: GameStore) {}

  initialize(): void {
    this.trackLabel = document.querySelector<HTMLElement>('#music-track');
    this.toggleButton = document.querySelector<HTMLButtonElement>('#music-toggle');
    this.volumeSlider = document.querySelector<HTMLInputElement>('#music-volume');

    if (this.volumeSlider) {
      this.volumeSlider.value = String(Math.round(this.volume * 100));
      this.volumeSlider.addEventListener('input', () => {
        this.volume = Math.max(0, Math.min(1, Number(this.volumeSlider?.value ?? 35) / 100));
        localStorage.setItem(VOLUME_KEY, String(this.volume));
        if (this.activeAudio && !this.muted) this.activeAudio.volume = this.volume;
        this.updateControls();
      });
    }

    this.toggleButton?.addEventListener('click', () => {
      this.arm();
      this.muted = !this.muted;
      localStorage.setItem(MUTED_KEY, String(this.muted));
      if (this.activeAudio) {
        if (this.muted) this.fadeTo(this.activeAudio, 0, 250);
        else {
          void this.activeAudio.play().catch(() => undefined);
          this.fadeTo(this.activeAudio, this.volume, 350);
        }
      }
      this.updateControls();
    });

    const unlock = () => this.arm();
    window.addEventListener('pointerdown', unlock, { once: true, capture: true });
    window.addEventListener('keydown', unlock, { once: true, capture: true });
    window.addEventListener('command-view-changed', (event) => {
      const detail = (event as CustomEvent<{ view?: AudioCommandView }>).detail;
      this.currentView = detail?.view ?? 'dashboard';
      void this.syncTrack();
    });
    document.querySelectorAll<HTMLButtonElement>('.command-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.currentView = (tab.dataset.view as AudioCommandView | undefined) ?? 'dashboard';
        void this.syncTrack();
      });
    });

    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type === 'biome' || event.type === 'state') void this.syncTrack();
    });

    this.updateControls();
  }

  destroy(): void {
    this.unsubscribe?.();
    this.activeAudio?.pause();
    this.fadingAudio?.pause();
  }

  private arm(): void {
    if (this.armed) return;
    this.armed = true;
    void this.syncTrack();
  }

  private desiredTrack(): TrackKey {
    return this.currentView === 'field' ? this.store.snapshot.currentBiome : 'command';
  }

  private async syncTrack(): Promise<void> {
    const desired = this.desiredTrack();
    if (!this.armed) {
      this.currentKey = desired;
      this.updateControls('Tap anywhere to start music');
      return;
    }
    if (desired === this.currentKey && this.activeAudio) {
      this.updateControls();
      return;
    }
    if (this.switching) return;
    this.switching = true;
    try {
      await this.switchTrack(desired);
    } finally {
      this.switching = false;
    }
  }

  private async switchTrack(key: TrackKey): Promise<void> {
    const definition = tracks[key];
    const next = new Audio(new URL(definition.file, document.baseURI).href);
    next.loop = true;
    next.preload = 'auto';
    next.volume = 0;

    try {
      await next.play();
    } catch {
      this.updateControls('Music assets loading');
      return;
    }

    const previous = this.activeAudio;
    this.fadingAudio = previous;
    this.activeAudio = next;
    this.currentKey = key;
    this.fadeTo(next, this.muted ? 0 : this.volume, 1500);
    if (previous) {
      this.fadeTo(previous, 0, 1500, () => {
        previous.pause();
        previous.src = '';
        if (this.fadingAudio === previous) this.fadingAudio = null;
      });
    }
    this.updateControls();
  }

  private fadeTo(audio: HTMLAudioElement, target: number, duration: number, done?: () => void): void {
    const start = audio.volume;
    const started = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / Math.max(1, duration));
      const eased = progress * progress * (3 - 2 * progress);
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
      else done?.();
    };
    requestAnimationFrame(step);
  }

  private updateControls(override?: string): void {
    const desired = tracks[this.desiredTrack()];
    if (this.trackLabel) this.trackLabel.textContent = override ?? desired.label;
    if (this.toggleButton) {
      this.toggleButton.textContent = this.muted ? '♪ OFF' : '♪ ON';
      this.toggleButton.setAttribute('aria-pressed', String(!this.muted));
      this.toggleButton.title = this.muted ? 'Turn background music on' : 'Mute background music';
    }
    if (this.volumeSlider) this.volumeSlider.setAttribute('aria-valuetext', `${Math.round(this.volume * 100)} percent`);
  }

  private readVolume(): number {
    const saved = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.34;
  }
}
