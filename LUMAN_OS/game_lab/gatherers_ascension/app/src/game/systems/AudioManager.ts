type TrackKey = 'command' | 'greenveil' | 'ironfall' | 'crystal-vale' | 'emberdeep';

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
const TRACK_KEY = 'gatherers-ascension-selected-track';

function isTrackKey(value: string): value is TrackKey {
  return Object.prototype.hasOwnProperty.call(tracks, value);
}

export class AudioManager {
  private selectedKey = this.readSelectedTrack();
  private currentKey: TrackKey | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private fadingAudio: HTMLAudioElement | null = null;
  private armed = false;
  private transitionId = 0;
  private volume = this.readVolume();
  private muted = localStorage.getItem(MUTED_KEY) === 'true';
  private trackLabel: HTMLElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private volumeSlider: HTMLInputElement | null = null;
  private trackSelect: HTMLSelectElement | null = null;

  initialize(): void {
    this.trackLabel = document.querySelector<HTMLElement>('#music-track');
    this.toggleButton = document.querySelector<HTMLButtonElement>('#music-toggle');
    this.volumeSlider = document.querySelector<HTMLInputElement>('#music-volume');
    this.trackSelect = document.querySelector<HTMLSelectElement>('#music-select');

    if (this.trackSelect) {
      this.trackSelect.value = this.selectedKey;
      this.trackSelect.addEventListener('change', () => {
        const value = this.trackSelect?.value ?? 'command';
        if (!isTrackKey(value)) return;
        this.selectedKey = value;
        localStorage.setItem(TRACK_KEY, value);
        this.arm();
        void this.syncTrack();
      });
    }

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
      this.muted = !this.muted;
      localStorage.setItem(MUTED_KEY, String(this.muted));
      this.arm();

      if (this.activeAudio) {
        if (this.muted) {
          this.fadeTo(this.activeAudio, 0, 250);
        } else {
          void this.activeAudio.play().catch(() => undefined);
          this.fadeTo(this.activeAudio, this.volume, 350);
        }
      } else if (!this.muted) {
        void this.syncTrack();
      }
      this.updateControls();
    });

    const unlock = () => this.arm();
    window.addEventListener('pointerdown', unlock, { once: true, capture: true });
    window.addEventListener('keydown', unlock, { once: true, capture: true });

    this.updateControls();
  }

  destroy(): void {
    this.transitionId += 1;
    this.activeAudio?.pause();
    this.fadingAudio?.pause();
  }

  private arm(): void {
    if (this.armed) return;
    this.armed = true;
    void this.syncTrack();
  }

  private async syncTrack(): Promise<void> {
    const desired = this.selectedKey;
    if (!this.armed) {
      this.updateControls('Tap anywhere to start selected music');
      return;
    }
    if (desired === this.currentKey && this.activeAudio) {
      this.updateControls();
      return;
    }

    const requestId = ++this.transitionId;
    await this.switchTrack(desired, requestId);
  }

  private async switchTrack(key: TrackKey, requestId: number): Promise<void> {
    const definition = tracks[key];
    const next = new Audio(new URL(definition.file, document.baseURI).href);
    next.loop = true;
    next.preload = 'auto';
    next.volume = 0;

    try {
      await next.play();
    } catch {
      if (requestId === this.transitionId) this.updateControls('Unable to load selected track');
      return;
    }

    if (requestId !== this.transitionId) {
      next.pause();
      next.src = '';
      return;
    }

    const previous = this.activeAudio;
    this.fadingAudio = previous;
    this.activeAudio = next;
    this.currentKey = key;
    this.fadeTo(next, this.muted ? 0 : this.volume, 1200);

    if (previous) {
      this.fadeTo(previous, 0, 1200, () => {
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
    const selected = tracks[this.selectedKey];
    if (this.trackLabel) this.trackLabel.textContent = override ?? selected.label;
    if (this.trackSelect) this.trackSelect.value = this.selectedKey;
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

  private readSelectedTrack(): TrackKey {
    const saved = localStorage.getItem(TRACK_KEY) ?? '';
    return isTrackKey(saved) ? saved : 'command';
  }
}