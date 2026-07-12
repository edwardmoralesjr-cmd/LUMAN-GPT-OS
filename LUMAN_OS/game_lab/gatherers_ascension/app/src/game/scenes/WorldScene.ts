import Phaser from 'phaser';
import {
  allResources,
  biomes,
  qualityDefinitions,
  resources,
  type BiomeId,
  type HarvestQuality,
  type ResourceDefinition,
  type ToolId,
} from '../data/content';
import type { GameStore, StoreEvent } from '../state/GameStore';

interface BiomeVisualTheme {
  skyTop: number;
  skyBottom: number;
  ground: number;
  accent: number;
  accentSecondary: number;
  haze: number;
  mote: number;
  shadow: number;
}

interface AmbientMote {
  body: Phaser.GameObjects.Arc;
  velocity: Phaser.Math.Vector2;
  phase: number;
  amplitude: number;
}

interface ResourceNode {
  id: string;
  biomeId: BiomeId;
  baseId: string;
  resourceId: string;
  quality: HarvestQuality;
  x: number;
  y: number;
  shadow: Phaser.GameObjects.Ellipse;
  aura: Phaser.GameObjects.Arc;
  ring: Phaser.GameObjects.Arc;
  body: Phaser.GameObjects.Graphics;
  detail: Phaser.GameObjects.Graphics;
  sparks: Phaser.GameObjects.Arc[];
  label: Phaser.GameObjects.Text;
  available: boolean;
  readyAt: number;
}

const toolColors: Record<ToolId, number> = {
  axe: 0x9ed37f,
  pickaxe: 0x8db9ff,
  sickle: 0xf1d77b,
  gloves: 0xd59cff,
};

const biomeThemes: Record<BiomeId, BiomeVisualTheme> = {
  greenveil: {
    skyTop: 0x071814,
    skyBottom: 0x173a2b,
    ground: 0x102d22,
    accent: 0x8ee6a3,
    accentSecondary: 0xe5c977,
    haze: 0x396e55,
    mote: 0xc9ffd0,
    shadow: 0x020806,
  },
  ironfall: {
    skyTop: 0x121413,
    skyBottom: 0x3a3029,
    ground: 0x272722,
    accent: 0xe68d62,
    accentSecondary: 0x9fb5ae,
    haze: 0x705441,
    mote: 0xffc79f,
    shadow: 0x080706,
  },
  'crystal-vale': {
    skyTop: 0x080c21,
    skyBottom: 0x202b5b,
    ground: 0x151d3c,
    accent: 0xa99cff,
    accentSecondary: 0x8fe8ff,
    haze: 0x4d5794,
    mote: 0xe5e6ff,
    shadow: 0x03040c,
  },
  emberdeep: {
    skyTop: 0x140707,
    skyBottom: 0x4b1d16,
    ground: 0x2c1110,
    accent: 0xff7654,
    accentSecondary: 0xffcf78,
    haze: 0x7f3024,
    mote: 0xffbb78,
    shadow: 0x090202,
  },
};

const toolOrder: ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];

export class WorldScene extends Phaser.Scene {
  private readonly store: GameStore;
  private readonly worldWidth = 1800;
  private readonly worldHeight = 1120;
  private currentBiome: BiomeId = 'greenveil';
  private theme: BiomeVisualTheme = biomeThemes.greenveil;

  private player!: Phaser.GameObjects.Container;
  private avatarFigure!: Phaser.GameObjects.Container;
  private playerGlow!: Phaser.GameObjects.Arc;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private avatarBody!: Phaser.GameObjects.Graphics;
  private avatarRune!: Phaser.GameObjects.Graphics;
  private gatherRing!: Phaser.GameObjects.Arc;
  private gatherRingInner!: Phaser.GameObjects.Arc;
  private toolOrbitals: Phaser.GameObjects.Graphics[] = [];
  private ambientMotes: AmbientMote[] = [];
  private nodes: ResourceNode[] = [];

  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private keys!: Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;
  private tapTarget: Phaser.Math.Vector2 | null = null;
  private touchDirection = { up: false, down: false, left: false, right: false };
  private unsubscribe: (() => void) | null = null;
  private lastTrailAt = 0;

  constructor(store: GameStore) {
    super('WorldScene');
    this.store = store;
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setRoundPixels(false);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input unavailable.');
    this.keys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y > this.scale.height - 90) return;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.tapTarget = new Phaser.Math.Vector2(worldPoint.x, worldPoint.y);
      this.createDestinationPulse(worldPoint.x, worldPoint.y);
    });

    this.unsubscribe = this.store.subscribe((event: StoreEvent) => {
      if (event.type === 'biome') this.loadBiome(event.biome);
      if (event.type === 'state') this.refreshProgressionVisuals();
    });

    this.loadBiome(this.store.snapshot.currentBiome);
    this.bindTouchControls();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unsubscribe?.());
  }

  update(time: number, delta: number): void {
    const dt = Math.min(delta / 1000, 0.05);
    const direction = new Phaser.Math.Vector2(
      Number(this.keys.right.isDown || this.keys.d.isDown || this.touchDirection.right) - Number(this.keys.left.isDown || this.keys.a.isDown || this.touchDirection.left),
      Number(this.keys.down.isDown || this.keys.s.isDown || this.touchDirection.down) - Number(this.keys.up.isDown || this.keys.w.isDown || this.touchDirection.up),
    );

    const manualInput = direction.lengthSq() > 0;
    if (manualInput) {
      direction.normalize();
      this.tapTarget = null;
    } else if (this.tapTarget) {
      direction.set(this.tapTarget.x - this.player.x, this.tapTarget.y - this.player.y);
      if (direction.length() < 8) {
        this.tapTarget = null;
        direction.set(0, 0);
      } else {
        direction.normalize();
      }
    }

    const moving = direction.lengthSq() > 0;
    const speed = 190 + this.store.snapshot.gear.boots * 15 + this.store.snapshot.stats.endurance * 2.5;
    this.player.x = Phaser.Math.Clamp(this.player.x + direction.x * speed * dt, 48, this.worldWidth - 48);
    this.player.y = Phaser.Math.Clamp(this.player.y + direction.y * speed * dt, 70, this.worldHeight - 54);

    if (moving) {
      this.avatarFigure.rotation = Phaser.Math.Linear(this.avatarFigure.rotation, direction.x * 0.08, 0.12);
      if (time - this.lastTrailAt > 72) {
        this.createMovementTrail();
        this.lastTrailAt = time;
      }
    } else {
      this.avatarFigure.rotation = Phaser.Math.Linear(this.avatarFigure.rotation, 0, 0.08);
    }

    this.avatarFigure.y = Math.sin(time / 260) * 1.7;
    this.playerShadow.scaleX = 1 + Math.sin(time / 260) * 0.035;
    this.playerShadow.alpha = 0.34 - Math.sin(time / 260) * 0.035;
    this.gatherRing.setPosition(this.player.x, this.player.y);
    this.gatherRingInner.setPosition(this.player.x, this.player.y);
    this.gatherRing.rotation = time * 0.00008;
    this.gatherRingInner.rotation = -time * 0.00012;

    this.updateToolOrbitals(time);
    this.updateAmbientMotes(time, dt);
    this.updateNodes(time);
  }

  private loadBiome(biomeId: BiomeId): void {
    const biome = biomes[biomeId];
    this.currentBiome = biomeId;
    this.theme = biomeThemes[biomeId];

    this.cameras.main.fadeOut(120, 0, 0, 0);
    this.children.removeAll(true);
    this.nodes = [];
    this.toolOrbitals = [];
    this.ambientMotes = [];

    this.cameras.main.setBackgroundColor(this.theme.skyTop);
    this.drawTerrain(biomeId);
    this.createAmbientMotes();
    this.createAvatar(this.worldWidth / 2, this.worldHeight / 2);
    this.createWorldTitle(biome.name, biome.subtitle);

    for (let i = 0; i < biome.nodeCount; i += 1) this.spawnNode(biomeId, i);

    this.refreshProgressionVisuals();
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1.045);
    this.cameras.main.fadeIn(520, 0, 0, 0);
  }

  private drawTerrain(biomeId: BiomeId): void {
    const theme = this.theme;
    const background = this.add.graphics().setDepth(-20);
    const steps = 44;
    const top = Phaser.Display.Color.ValueToColor(theme.skyTop);
    const bottom = Phaser.Display.Color.ValueToColor(theme.skyBottom);

    for (let index = 0; index < steps; index += 1) {
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(top, bottom, steps - 1, index);
      background.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
      background.fillRect(0, (this.worldHeight / steps) * index, this.worldWidth, this.worldHeight / steps + 2);
    }

    const distant = this.add.graphics().setDepth(-18).setScrollFactor(0.58);
    const midground = this.add.graphics().setDepth(-12).setScrollFactor(0.82);
    const ground = this.add.graphics().setDepth(-8);

    distant.fillStyle(theme.haze, 0.12);
    for (let i = 0; i < 22; i += 1) {
      distant.fillCircle(
        Phaser.Math.Between(-100, this.worldWidth + 100),
        Phaser.Math.Between(20, this.worldHeight - 140),
        Phaser.Math.Between(90, 250),
      );
    }

    ground.fillStyle(theme.ground, 0.7).fillRect(0, this.worldHeight * 0.44, this.worldWidth, this.worldHeight * 0.56);
    for (let i = 0; i < 240; i += 1) {
      const x = Phaser.Math.Between(0, this.worldWidth);
      const y = Phaser.Math.Between(Math.floor(this.worldHeight * 0.42), this.worldHeight);
      const alpha = Phaser.Math.FloatBetween(0.025, 0.085);
      ground.fillStyle(i % 5 === 0 ? theme.accentSecondary : theme.haze, alpha);
      ground.fillEllipse(x, y, Phaser.Math.Between(8, 34), Phaser.Math.Between(2, 8));
    }

    this.drawBiomeLandmarks(biomeId, distant, midground, ground);

    const path = this.add.graphics().setDepth(-6);
    path.lineStyle(34, theme.shadow, 0.16);
    path.beginPath();
    path.moveTo(0, this.worldHeight * 0.72);
    for (let segment = 1; segment <= 18; segment += 1) {
      const progress = segment / 18;
      const x = this.worldWidth * progress;
      const y = this.worldHeight * (0.7 + Math.sin(progress * Math.PI * 2.2) * 0.08 - progress * 0.035);
      path.lineTo(x, y);
    }
    path.strokePath();
    path.lineStyle(2, theme.accent, 0.08);
    path.strokePath();

    const border = this.add.graphics().setDepth(-4);
    border.lineStyle(2, theme.accent, 0.08).strokeRoundedRect(28, 28, this.worldWidth - 56, this.worldHeight - 56, 34);
  }

  private drawBiomeLandmarks(
    biomeId: BiomeId,
    distant: Phaser.GameObjects.Graphics,
    midground: Phaser.GameObjects.Graphics,
    ground: Phaser.GameObjects.Graphics,
  ): void {
    const theme = this.theme;

    if (biomeId === 'greenveil') {
      for (let i = 0; i < 34; i += 1) {
        const x = Phaser.Math.Between(30, this.worldWidth - 30);
        const y = Phaser.Math.Between(120, this.worldHeight - 80);
        const scale = Phaser.Math.FloatBetween(0.7, 1.45);
        midground.fillStyle(0x071a12, 0.58).fillRoundedRect(x - 6 * scale, y, 12 * scale, 54 * scale, 7);
        midground.fillStyle(i % 3 === 0 ? theme.accentSecondary : theme.accent, 0.09);
        midground.fillCircle(x, y - 8 * scale, 33 * scale);
        midground.fillCircle(x - 20 * scale, y + 5 * scale, 24 * scale);
        midground.fillCircle(x + 20 * scale, y + 4 * scale, 25 * scale);
      }
      ground.lineStyle(2, theme.accent, 0.06);
      for (let i = 0; i < 45; i += 1) {
        const x = Phaser.Math.Between(0, this.worldWidth);
        const y = Phaser.Math.Between(480, this.worldHeight);
        ground.lineBetween(x, y, x + Phaser.Math.Between(-14, 14), y - Phaser.Math.Between(8, 25));
      }
    } else if (biomeId === 'ironfall') {
      distant.fillStyle(0x0b0d0c, 0.58);
      for (let i = 0; i < 13; i += 1) {
        const x = i * 155 - 80;
        const height = Phaser.Math.Between(150, 360);
        distant.fillTriangle(x, 610, x + 120, 610 - height, x + 260, 610);
      }
      midground.lineStyle(5, theme.accent, 0.15);
      for (let i = 0; i < 30; i += 1) {
        const x = Phaser.Math.Between(0, this.worldWidth);
        const y = Phaser.Math.Between(390, this.worldHeight);
        midground.beginPath();
        midground.moveTo(x, y);
        midground.lineTo(x + Phaser.Math.Between(-55, 55), y + Phaser.Math.Between(35, 90));
        midground.lineTo(x + Phaser.Math.Between(-85, 85), y + Phaser.Math.Between(95, 150));
        midground.strokePath();
      }
    } else if (biomeId === 'crystal-vale') {
      for (let i = 0; i < 30; i += 1) {
        const x = Phaser.Math.Between(20, this.worldWidth - 20);
        const y = Phaser.Math.Between(180, this.worldHeight - 70);
        const height = Phaser.Math.Between(50, 160);
        const width = Phaser.Math.Between(18, 50);
        midground.fillStyle(i % 2 === 0 ? theme.accent : theme.accentSecondary, 0.1);
        midground.fillPoints([
          new Phaser.Math.Vector2(x, y - height),
          new Phaser.Math.Vector2(x + width, y - 12),
          new Phaser.Math.Vector2(x + width * 0.6, y + 20),
          new Phaser.Math.Vector2(x - width * 0.55, y + 16),
          new Phaser.Math.Vector2(x - width, y - 10),
        ], true, true);
      }
      ground.fillStyle(theme.accentSecondary, 0.045);
      for (let i = 0; i < 12; i += 1) {
        ground.fillEllipse(Phaser.Math.Between(80, this.worldWidth - 80), Phaser.Math.Between(520, this.worldHeight - 60), Phaser.Math.Between(90, 240), Phaser.Math.Between(18, 48));
      }
    } else {
      distant.fillStyle(0x090202, 0.64);
      for (let i = 0; i < 14; i += 1) {
        const x = Phaser.Math.Between(0, this.worldWidth);
        const y = Phaser.Math.Between(180, 580);
        const width = Phaser.Math.Between(48, 110);
        const height = Phaser.Math.Between(130, 330);
        distant.fillRect(x, y, width, height);
        distant.fillTriangle(x - 14, y, x + width / 2, y - 60, x + width + 14, y);
      }
      ground.lineStyle(3, theme.accent, 0.22);
      for (let i = 0; i < 44; i += 1) {
        const x = Phaser.Math.Between(0, this.worldWidth);
        const y = Phaser.Math.Between(470, this.worldHeight);
        ground.beginPath();
        ground.moveTo(x, y);
        ground.lineTo(x + Phaser.Math.Between(-22, 22), y + Phaser.Math.Between(20, 62));
        ground.lineTo(x + Phaser.Math.Between(-48, 48), y + Phaser.Math.Between(70, 118));
        ground.strokePath();
      }
    }
  }

  private createAmbientMotes(): void {
    const count = this.currentBiome === 'emberdeep' ? 72 : 56;
    for (let i = 0; i < count; i += 1) {
      const radius = Phaser.Math.FloatBetween(0.8, i % 7 === 0 ? 3.2 : 2.1);
      const body = this.add.circle(
        Phaser.Math.Between(0, this.worldWidth),
        Phaser.Math.Between(0, this.worldHeight),
        radius,
        this.theme.mote,
        Phaser.Math.FloatBetween(0.08, 0.34),
      ).setDepth(i % 6 === 0 ? 9 : -2);
      if (i % 4 === 0) body.setBlendMode(Phaser.BlendModes.ADD);
      this.ambientMotes.push({
        body,
        velocity: new Phaser.Math.Vector2(
          Phaser.Math.FloatBetween(-7, 9),
          this.currentBiome === 'emberdeep' ? Phaser.Math.FloatBetween(-18, -5) : Phaser.Math.FloatBetween(-5, 7),
        ),
        phase: Phaser.Math.FloatBetween(0, Math.PI * 2),
        amplitude: Phaser.Math.FloatBetween(0.07, 0.22),
      });
    }
  }

  private updateAmbientMotes(time: number, dt: number): void {
    for (const mote of this.ambientMotes) {
      mote.body.x += mote.velocity.x * dt;
      mote.body.y += mote.velocity.y * dt;
      mote.body.alpha = Phaser.Math.Clamp(0.18 + Math.sin(time / 620 + mote.phase) * mote.amplitude, 0.03, 0.48);
      if (mote.body.x < -20) mote.body.x = this.worldWidth + 20;
      if (mote.body.x > this.worldWidth + 20) mote.body.x = -20;
      if (mote.body.y < -20) mote.body.y = this.worldHeight + 20;
      if (mote.body.y > this.worldHeight + 20) mote.body.y = -20;
    }
  }

  private createAvatar(x: number, y: number): void {
    this.playerShadow = this.add.ellipse(0, 18, 34, 13, this.theme.shadow, 0.34);
    this.playerGlow = this.add.circle(0, 0, 34, this.theme.accent, 0.14).setBlendMode(Phaser.BlendModes.ADD);
    this.avatarBody = this.add.graphics();
    this.avatarRune = this.add.graphics();
    this.avatarFigure = this.add.container(0, 0, [this.playerGlow, this.avatarBody, this.avatarRune]);
    this.player = this.add.container(x, y, [this.playerShadow, this.avatarFigure]).setDepth(12);

    this.gatherRing = this.add.circle(x, y, this.gatherRadius(), this.theme.accent, 0.018)
      .setStrokeStyle(2, this.theme.accent, 0.24)
      .setDepth(4)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.gatherRingInner = this.add.circle(x, y, Math.max(30, this.gatherRadius() - 12), this.theme.accentSecondary, 0)
      .setStrokeStyle(1, this.theme.accentSecondary, 0.12)
      .setDepth(4);

    this.createToolOrbitals();
  }

  private drawAvatar(tier: number): void {
    const fills = [0xdcecdf, 0xc9f4d0, 0xc3e5ff, 0xe0c5ff, 0xffe3a0];
    const strokes = [0x79c88b, 0x8ee3b2, 0x78caff, 0xd59cff, 0xffd66d];
    const fill = fills[tier] ?? 0xdcecdf;
    const stroke = strokes[tier] ?? 0x79c88b;

    this.avatarBody.clear();
    this.avatarBody.fillStyle(0x030807, 0.58).fillRoundedRect(-12, -3, 24, 29, 10);
    this.avatarBody.fillStyle(fill, 0.96).fillRoundedRect(-9, -11, 18, 25, 7);
    this.avatarBody.lineStyle(2 + tier * 0.5, stroke, 0.95).strokeRoundedRect(-9, -11, 18, 25, 7);
    this.avatarBody.fillStyle(0x101a17, 0.92).fillTriangle(-15, 8, 15, 8, 0, 28 + tier * 2);
    this.avatarBody.lineStyle(1.5, stroke, 0.72).strokeTriangle(-15, 8, 15, 8, 0, 28 + tier * 2);
    this.avatarBody.fillStyle(0x18221f, 1).fillCircle(0, -15, 10.5);
    this.avatarBody.lineStyle(2, stroke, 0.88).strokeCircle(0, -15, 10.5);
    this.avatarBody.fillStyle(stroke, 0.95).fillCircle(0, -15, 3 + tier * 0.45);
    this.avatarBody.fillStyle(0x33271f, 0.9).fillRoundedRect(9, -4, 7, 17, 3);
    this.avatarBody.lineStyle(1, 0xd7b77c, 0.55).strokeRoundedRect(9, -4, 7, 17, 3);

    this.avatarRune.clear();
    this.avatarRune.lineStyle(1.4 + tier * 0.35, stroke, 0.72);
    const size = 5 + tier;
    this.avatarRune.strokePoints([
      new Phaser.Math.Vector2(0, -size),
      new Phaser.Math.Vector2(size, 0),
      new Phaser.Math.Vector2(0, size),
      new Phaser.Math.Vector2(-size, 0),
    ], true, true);
    if (tier >= 2) {
      this.avatarRune.lineBetween(-size - 4, 0, size + 4, 0);
      this.avatarRune.lineBetween(0, -size - 4, 0, size + 4);
    }
    this.avatarRune.setPosition(0, 1);

    this.playerGlow.setFillStyle(stroke, 0.12 + tier * 0.035).setRadius(34 + tier * 5);
    this.playerGlow.setBlendMode(Phaser.BlendModes.ADD);
  }

  private createWorldTitle(name: string, subtitle: string): void {
    const plate = this.add.graphics().setScrollFactor(0).setDepth(40);
    plate.fillStyle(0x020706, 0.68).fillRoundedRect(20, 18, 470, 76, 18);
    plate.lineStyle(1, this.theme.accent, 0.24).strokeRoundedRect(20, 18, 470, 76, 18);
    plate.fillStyle(this.theme.accent, 0.8).fillRoundedRect(20, 18, 4, 76, 2);

    this.titleText = this.add.text(39, 29, name, {
      fontFamily: 'Georgia, serif',
      fontSize: '31px',
      color: '#f6fbf7',
      stroke: '#020706',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 3, color: '#000000', blur: 8, fill: true },
    }).setScrollFactor(0).setDepth(42);

    this.subtitleText = this.add.text(41, 67, subtitle, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#b9c9bf',
      stroke: '#020706',
      strokeThickness: 3,
    }).setScrollFactor(0).setDepth(42);
  }

  private spawnNode(biomeId: BiomeId, index: number): void {
    const biome = biomes[biomeId];
    const baseId = Phaser.Utils.Array.GetRandom(biome.resources);
    const roll = this.store.rollNode(baseId);
    const definition = allResources[roll.resourceId];
    if (!definition) return;

    const x = Phaser.Math.Between(90, this.worldWidth - 90);
    const y = Phaser.Math.Between(130, this.worldHeight - 90);
    const shadow = this.add.ellipse(x, y + 14, 42, 14, this.theme.shadow, 0.34).setDepth(0);
    const aura = this.add.circle(x, y, definition.radius + 18, definition.glow, 0.045).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
    const ring = this.add.circle(x, y, definition.radius + 11, definition.glow, 0).setStrokeStyle(1, definition.glow, 0.35).setDepth(2);
    const body = this.add.graphics().setPosition(x, y).setDepth(3);
    const detail = this.add.graphics().setPosition(x, y).setDepth(4);
    const sparks = Array.from({ length: 5 }, (_, sparkIndex) => this.add.circle(x, y, sparkIndex % 2 === 0 ? 1.7 : 1.1, definition.glow, 0).setDepth(5).setBlendMode(Phaser.BlendModes.ADD));
    const label = this.add.text(x, y + definition.radius + 18, '', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#d9e7dc',
      backgroundColor: '#030807e6',
      padding: { left: 7, right: 7, top: 4, bottom: 4 },
      shadow: { offsetX: 0, offsetY: 2, color: '#000000', blur: 5, fill: true },
    }).setOrigin(0.5, 0).setAlpha(0).setDepth(8);

    const node: ResourceNode = {
      id: `node-${index}`,
      biomeId,
      baseId,
      resourceId: roll.resourceId,
      quality: roll.quality,
      x,
      y,
      shadow,
      aura,
      ring,
      body,
      detail,
      sparks,
      label,
      available: true,
      readyAt: 0,
    };
    this.nodes.push(node);
    this.applyNodeVisuals(node);
  }

  private updateNodes(time: number): void {
    const radius = this.gatherRadius();

    for (const node of this.nodes) {
      if (!node.available) {
        if (time >= node.readyAt) this.restoreNode(node);
        continue;
      }

      const definition = allResources[node.resourceId] ?? resources[node.baseId];
      if (!definition) continue;
      const qualityRank = qualityDefinitions[node.quality].rank;
      const variant = Boolean(definition.isVariant);
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, node.x, node.y);
      const near = Phaser.Math.Clamp(1 - distance / 190, 0, 1);
      const pulseSpeed = Math.max(210, 510 - qualityRank * 48 - (variant ? 80 : 0));
      const pulse = Math.sin((time + node.x * 1.7) / pulseSpeed);
      const bob = Math.sin((time + node.y * 2.1) / 720) * (1.2 + qualityRank * 0.55);

      node.label.setAlpha(distance < 145 ? 0.96 : 0);
      node.body.setPosition(node.x, node.y + bob).setScale(1 + near * 0.035);
      node.detail.setPosition(node.x, node.y + bob).setRotation(time * (variant ? 0.00045 : 0.00012) + node.x);
      node.ring.setScale(1 + pulse * (0.07 + qualityRank * 0.018 + (variant ? 0.08 : 0)) + near * 0.08);
      node.aura.setScale(1 + pulse * 0.09 + near * 0.16).setAlpha(0.04 + qualityRank * 0.025 + near * 0.08 + (variant ? 0.08 : 0));
      node.shadow.scaleX = 1 + pulse * 0.04;

      node.sparks.forEach((spark, sparkIndex) => {
        const angle = time * (0.00048 + sparkIndex * 0.000035) + sparkIndex * 1.27 + node.x;
        const orbit = definition.radius + 13 + qualityRank * 3 + sparkIndex * 1.5;
        spark.setPosition(node.x + Math.cos(angle) * orbit, node.y + bob + Math.sin(angle) * orbit * 0.55);
        spark.setAlpha(qualityRank === 0 && !variant ? 0 : 0.18 + qualityRank * 0.11 + near * 0.22);
      });

      if (distance <= radius) this.harvestNode(node);
    }
  }

  private harvestNode(node: ResourceNode): void {
    const result = this.store.gather(node.resourceId, node.quality);
    node.available = false;
    node.readyAt = this.time.now + Phaser.Math.Between(3500, 6500);
    this.setNodeVisible(node, false);

    const qualityInfo = qualityDefinitions[result.quality];
    const color = result.definition.isVariant ? 0xffe49a : qualityInfo.glow;
    const prefix = result.definition.isVariant ? 'MYTHIC DISCOVERY' : result.critical ? 'CRITICAL HARVEST' : result.quality === 'Standard' ? 'HARVESTED' : `${result.quality.toUpperCase()} SPECIMEN`;
    const suffix = result.surprise ? `\n${result.surprise}` : '';
    const text = this.add.text(node.x, node.y - 25, `${prefix}\n+${result.quantity} ${result.definition.name}${suffix}`, {
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'bold',
      fontSize: result.definition.isVariant ? '18px' : result.critical ? '15px' : '12px',
      color: result.definition.isVariant ? '#fff0a6' : qualityInfo.color,
      stroke: '#020706',
      strokeThickness: 6,
      align: 'center',
      lineSpacing: 4,
      wordWrap: { width: 320 },
      shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 10, fill: true },
    }).setOrigin(0.5).setDepth(70);

    this.createHarvestBurst(node.x, node.y, color, qualityInfo.rank, Boolean(result.definition.isVariant));
    this.tweens.add({
      targets: text,
      y: text.y - 66,
      alpha: 0,
      scale: result.definition.isVariant ? 1.12 : 1,
      duration: result.definition.isVariant ? 2100 : 1250,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy(),
    });
    this.tweens.add({
      targets: this.playerGlow,
      scale: result.definition.isVariant ? 2.1 : 1.45,
      alpha: result.definition.isVariant ? 0.72 : 0.36,
      yoyo: true,
      duration: result.definition.isVariant ? 380 : 130,
    });

    if (result.definition.isVariant) {
      this.cameras.main.flash(720, 255, 222, 135, false);
      this.cameras.main.shake(360, 0.008);
      this.tweens.add({ targets: this.cameras.main, zoom: 1.105, yoyo: true, duration: 430, ease: 'Sine.easeInOut' });
    } else if (qualityInfo.rank >= 3) {
      this.cameras.main.flash(260, 180, 150, 255, false);
      this.cameras.main.shake(120, 0.0025);
    } else if (result.critical) {
      this.cameras.main.shake(85, 0.0016);
    }
  }

  private createHarvestBurst(x: number, y: number, color: number, qualityRank: number, mythic: boolean): void {
    const particleCount = mythic ? 34 : 12 + qualityRank * 5;
    const shockwave = this.add.circle(x, y, 10, color, 0).setStrokeStyle(mythic ? 4 : 2, color, mythic ? 0.95 : 0.65).setDepth(60).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: shockwave, scale: mythic ? 10 : 5 + qualityRank, alpha: 0, duration: mythic ? 920 : 540, ease: 'Cubic.easeOut', onComplete: () => shockwave.destroy() });

    for (let i = 0; i < particleCount; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(mythic ? 55 : 24, mythic ? 145 : 65 + qualityRank * 16);
      const size = Phaser.Math.FloatBetween(1.2, mythic ? 4.8 : 3.2);
      const particle = this.add.circle(x, y, size, i % 5 === 0 ? 0xffffff : color, Phaser.Math.FloatBetween(0.5, 1))
        .setDepth(62)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance - Phaser.Math.Between(8, 34),
        alpha: 0,
        scale: 0.15,
        duration: Phaser.Math.Between(mythic ? 720 : 430, mythic ? 1350 : 900),
        delay: Phaser.Math.Between(0, mythic ? 160 : 60),
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  private restoreNode(node: ResourceNode): void {
    const biome = biomes[node.biomeId];
    node.baseId = Phaser.Utils.Array.GetRandom(biome.resources);
    const roll = this.store.rollNode(node.baseId);
    node.resourceId = roll.resourceId;
    node.quality = roll.quality;
    node.available = true;
    this.applyNodeVisuals(node);
    this.setNodeVisible(node, true);

    const visualObjects: Phaser.GameObjects.GameObject[] = [node.shadow, node.aura, node.ring, node.body, node.detail, ...node.sparks];
    visualObjects.forEach((object) => {
      const transformable = object as Phaser.GameObjects.GameObject & { setScale?: (value: number) => unknown; setAlpha?: (value: number) => unknown };
      transformable.setScale?.(0.25);
      transformable.setAlpha?.(0);
    });
    this.tweens.add({ targets: visualObjects, scale: 1, alpha: 1, duration: 620, ease: 'Back.easeOut' });
  }

  private setNodeVisible(node: ResourceNode, visible: boolean): void {
    node.shadow.setVisible(visible);
    node.aura.setVisible(visible);
    node.ring.setVisible(visible);
    node.body.setVisible(visible);
    node.detail.setVisible(visible);
    node.sparks.forEach((spark) => spark.setVisible(visible));
    node.label.setVisible(visible);
  }

  private applyNodeVisuals(node: ResourceNode): void {
    const definition = allResources[node.resourceId] ?? resources[node.baseId];
    if (!definition) return;
    const quality = qualityDefinitions[node.quality];
    const hiddenVariant = Boolean(definition.isVariant && !this.store.snapshot.discovered.includes(definition.id));
    const bodyColor = hiddenVariant ? 0x0b0d16 : definition.color;
    const glowColor = hiddenVariant ? 0xb7a6ff : quality.rank > 0 ? quality.glow : definition.glow;
    const radius = definition.radius + Math.min(4, quality.rank);

    node.shadow.setSize(radius * 2.9, Math.max(9, radius * 0.72)).setFillStyle(this.theme.shadow, 0.35);
    node.aura.setRadius(radius + 18 + quality.rank * 3).setFillStyle(glowColor, hiddenVariant ? 0.14 : 0.035 + quality.rank * 0.025);
    node.ring.setRadius(radius + 10 + quality.rank * 2).setFillStyle(glowColor, 0).setStrokeStyle(1 + Math.min(2, quality.rank), glowColor, hiddenVariant ? 0.85 : 0.25 + quality.rank * 0.11);
    node.label.setY(node.y + radius + 19);

    this.drawResourceBody(node.body, node.detail, definition, node.baseId, bodyColor, glowColor, radius, quality.rank, hiddenVariant);
    node.sparks.forEach((spark, index) => {
      spark.setRadius(1.1 + quality.rank * 0.25 + (definition.isVariant ? 0.8 : 0));
      spark.setFillStyle(index % 4 === 0 ? 0xffffff : glowColor, 1);
      spark.setAlpha(hiddenVariant || quality.rank > 0 ? 0.35 : 0);
    });

    if (hiddenVariant) {
      node.label.setText('◆ UNIDENTIFIED MATERIAL').setColor('#ded5ff');
    } else {
      const qualityPrefix = node.quality === 'Standard' ? '' : `${node.quality.toUpperCase()} · `;
      node.label.setText(`${qualityPrefix}${definition.name}`).setColor(quality.color);
    }
  }

  private drawResourceBody(
    body: Phaser.GameObjects.Graphics,
    detail: Phaser.GameObjects.Graphics,
    definition: ResourceDefinition,
    baseId: string,
    bodyColor: number,
    glowColor: number,
    radius: number,
    qualityRank: number,
    hiddenVariant: boolean,
  ): void {
    body.clear();
    detail.clear();

    if (hiddenVariant) {
      body.fillStyle(bodyColor, 0.96);
      body.fillPoints([
        new Phaser.Math.Vector2(0, -radius * 1.25),
        new Phaser.Math.Vector2(radius * 0.92, -radius * 0.22),
        new Phaser.Math.Vector2(radius * 0.56, radius),
        new Phaser.Math.Vector2(0, radius * 1.32),
        new Phaser.Math.Vector2(-radius * 0.62, radius),
        new Phaser.Math.Vector2(-radius * 0.94, -radius * 0.18),
      ], true, true);
      body.lineStyle(3, glowColor, 0.95).strokePoints([
        new Phaser.Math.Vector2(0, -radius * 1.25),
        new Phaser.Math.Vector2(radius * 0.92, -radius * 0.22),
        new Phaser.Math.Vector2(radius * 0.56, radius),
        new Phaser.Math.Vector2(0, radius * 1.32),
        new Phaser.Math.Vector2(-radius * 0.62, radius),
        new Phaser.Math.Vector2(-radius * 0.94, -radius * 0.18),
      ], true, true);
      detail.lineStyle(2, glowColor, 0.72).strokeCircle(0, 0, radius * 0.34);
      detail.lineBetween(0, -radius * 0.2, 0, radius * 0.12);
      detail.fillStyle(glowColor, 0.9).fillCircle(0, radius * 0.35, 1.8);
      return;
    }

    const outlineWidth = 1.5 + qualityRank * 0.55;
    const highlight = Phaser.Display.Color.IntegerToColor(glowColor).brighten(22).color;

    if (definition.tool === 'axe') {
      body.fillStyle(0x33261d, 0.96).fillRoundedRect(-radius * 0.36, -radius * 0.95, radius * 0.72, radius * 1.9, radius * 0.22);
      body.lineStyle(outlineWidth, glowColor, 0.85).strokeRoundedRect(-radius * 0.36, -radius * 0.95, radius * 0.72, radius * 1.9, radius * 0.22);
      body.fillStyle(bodyColor, 0.94);
      body.fillCircle(0, -radius * 0.78, radius * 0.72);
      body.fillCircle(-radius * 0.52, -radius * 0.43, radius * 0.48);
      body.fillCircle(radius * 0.52, -radius * 0.4, radius * 0.49);
      body.lineStyle(outlineWidth, glowColor, 0.72).strokeCircle(0, -radius * 0.78, radius * 0.72);
      detail.lineStyle(1.2, highlight, 0.65);
      detail.lineBetween(0, -radius * 0.65, 0, radius * 0.62);
      detail.lineBetween(0, -radius * 0.15, -radius * 0.45, -radius * 0.5);
      detail.lineBetween(0, -radius * 0.05, radius * 0.42, -radius * 0.45);
    } else if (definition.tool === 'sickle') {
      body.lineStyle(Math.max(3, radius * 0.22), 0x3a6c4c, 0.95).lineBetween(0, radius * 0.9, 0, -radius * 0.55);
      body.fillStyle(bodyColor, 0.96);
      body.fillEllipse(-radius * 0.38, -radius * 0.08, radius * 0.9, radius * 0.44);
      body.fillEllipse(radius * 0.38, radius * 0.14, radius * 0.9, radius * 0.44);
      body.lineStyle(outlineWidth, glowColor, 0.75).strokeEllipse(-radius * 0.38, -radius * 0.08, radius * 0.9, radius * 0.44);
      body.strokeEllipse(radius * 0.38, radius * 0.14, radius * 0.9, radius * 0.44);
      if (baseId === 'moonDew') {
        body.fillStyle(bodyColor, 0.9).fillCircle(0, -radius * 0.68, radius * 0.5);
        body.lineStyle(outlineWidth, glowColor, 0.9).strokeCircle(0, -radius * 0.68, radius * 0.5);
        detail.lineStyle(1, 0xffffff, 0.6).strokeCircle(-radius * 0.13, -radius * 0.83, radius * 0.13);
      } else {
        for (let petal = 0; petal < 6; petal += 1) {
          const angle = petal * (Math.PI / 3);
          body.fillStyle(petal % 2 === 0 ? glowColor : bodyColor, 0.82);
          body.fillCircle(Math.cos(angle) * radius * 0.38, -radius * 0.72 + Math.sin(angle) * radius * 0.38, radius * 0.28);
        }
        detail.fillStyle(highlight, 0.95).fillCircle(0, -radius * 0.72, radius * 0.2);
      }
    } else if (definition.tool === 'gloves') {
      body.fillStyle(0x342b20, 0.96).fillRoundedRect(-radius * 0.72, -radius * 0.5, radius * 1.44, radius * 1.28, radius * 0.18);
      body.lineStyle(outlineWidth, glowColor, 0.88).strokeRoundedRect(-radius * 0.72, -radius * 0.5, radius * 1.44, radius * 1.28, radius * 0.18);
      body.fillStyle(bodyColor, 0.98).fillCircle(0, -radius * 0.55, radius * 0.52);
      body.lineStyle(outlineWidth, glowColor, 0.85).strokeCircle(0, -radius * 0.55, radius * 0.52);
      detail.lineStyle(1.4, highlight, 0.72);
      detail.strokePoints([
        new Phaser.Math.Vector2(0, -radius * 0.85),
        new Phaser.Math.Vector2(radius * 0.28, -radius * 0.55),
        new Phaser.Math.Vector2(0, -radius * 0.25),
        new Phaser.Math.Vector2(-radius * 0.28, -radius * 0.55),
      ], true, true);
      detail.lineBetween(-radius * 0.42, radius * 0.1, radius * 0.42, radius * 0.1);
      detail.lineBetween(-radius * 0.3, radius * 0.36, radius * 0.3, radius * 0.36);
    } else if (baseId === 'stone' || baseId === 'ore') {
      body.fillStyle(bodyColor, 0.96);
      body.fillPoints([
        new Phaser.Math.Vector2(-radius, radius * 0.35),
        new Phaser.Math.Vector2(-radius * 0.62, -radius * 0.65),
        new Phaser.Math.Vector2(0, -radius),
        new Phaser.Math.Vector2(radius * 0.78, -radius * 0.55),
        new Phaser.Math.Vector2(radius, radius * 0.45),
        new Phaser.Math.Vector2(radius * 0.25, radius),
        new Phaser.Math.Vector2(-radius * 0.6, radius * 0.88),
      ], true, true);
      body.lineStyle(outlineWidth, glowColor, 0.85).strokePoints([
        new Phaser.Math.Vector2(-radius, radius * 0.35),
        new Phaser.Math.Vector2(-radius * 0.62, -radius * 0.65),
        new Phaser.Math.Vector2(0, -radius),
        new Phaser.Math.Vector2(radius * 0.78, -radius * 0.55),
        new Phaser.Math.Vector2(radius, radius * 0.45),
        new Phaser.Math.Vector2(radius * 0.25, radius),
        new Phaser.Math.Vector2(-radius * 0.6, radius * 0.88),
      ], true, true);
      detail.lineStyle(1.2, highlight, 0.58);
      detail.lineBetween(-radius * 0.6, radius * 0.34, 0, -radius * 0.52);
      detail.lineBetween(0, -radius * 0.52, radius * 0.55, radius * 0.3);
      detail.lineBetween(0, -radius * 0.52, radius * 0.18, radius * 0.76);
    } else {
      body.fillStyle(bodyColor, 0.95);
      body.fillPoints([
        new Phaser.Math.Vector2(0, -radius * 1.28),
        new Phaser.Math.Vector2(radius * 0.8, -radius * 0.18),
        new Phaser.Math.Vector2(radius * 0.5, radius),
        new Phaser.Math.Vector2(0, radius * 1.25),
        new Phaser.Math.Vector2(-radius * 0.55, radius),
        new Phaser.Math.Vector2(-radius * 0.78, -radius * 0.2),
      ], true, true);
      body.lineStyle(outlineWidth, glowColor, 0.9).strokePoints([
        new Phaser.Math.Vector2(0, -radius * 1.28),
        new Phaser.Math.Vector2(radius * 0.8, -radius * 0.18),
        new Phaser.Math.Vector2(radius * 0.5, radius),
        new Phaser.Math.Vector2(0, radius * 1.25),
        new Phaser.Math.Vector2(-radius * 0.55, radius),
        new Phaser.Math.Vector2(-radius * 0.78, -radius * 0.2),
      ], true, true);
      detail.lineStyle(1.2, highlight, 0.72);
      detail.lineBetween(0, -radius * 1.02, 0, radius * 0.92);
      detail.lineBetween(-radius * 0.48, -radius * 0.1, 0, -radius * 0.58);
      detail.lineBetween(0, -radius * 0.58, radius * 0.5, -radius * 0.1);
      detail.lineBetween(-radius * 0.32, radius * 0.5, 0, radius * 0.12);
      detail.lineBetween(0, radius * 0.12, radius * 0.3, radius * 0.52);
    }

    if (qualityRank >= 2) {
      detail.lineStyle(1, glowColor, 0.5 + qualityRank * 0.08).strokeCircle(0, 0, radius + 5 + qualityRank);
    }
    if (definition.isVariant) {
      detail.lineStyle(2, glowColor, 0.82);
      detail.strokeCircle(0, 0, radius + 10);
      detail.lineBetween(-radius - 13, 0, radius + 13, 0);
      detail.lineBetween(0, -radius - 13, 0, radius + 13);
    }
  }

  private createToolOrbitals(): void {
    this.toolOrbitals = toolOrder.map((tool) => {
      const graphics = this.add.graphics().setDepth(16).setBlendMode(Phaser.BlendModes.ADD);
      this.drawToolIcon(graphics, tool, 0);
      return graphics;
    });
  }

  private drawToolIcon(graphics: Phaser.GameObjects.Graphics, tool: ToolId, tier: number): void {
    const color = toolColors[tool];
    const size = 4.5 + tier * 1.2;
    graphics.clear();
    graphics.fillStyle(0x020706, 0.82).fillCircle(0, 0, size + 3.5);
    graphics.lineStyle(1 + tier * 0.45, color, 0.9).strokeCircle(0, 0, size + 3.5);
    graphics.lineStyle(1.4 + tier * 0.28, color, 0.96);

    if (tool === 'axe') {
      graphics.lineBetween(-2, size * 0.75, 2, -size * 0.8);
      graphics.fillStyle(color, 0.9).fillTriangle(0, -size * 0.65, size * 0.95, -size * 0.45, size * 0.05, size * 0.05);
    } else if (tool === 'pickaxe') {
      graphics.lineBetween(0, -size * 0.8, 0, size * 0.8);
      graphics.beginPath();
      graphics.arc(0, -size * 0.48, size * 0.82, Math.PI * 1.12, Math.PI * 1.88, false);
      graphics.strokePath();
    } else if (tool === 'sickle') {
      graphics.beginPath();
      graphics.arc(0, 0, size * 0.8, Math.PI * 0.15, Math.PI * 1.35, false);
      graphics.strokePath();
      graphics.lineBetween(size * 0.45, size * 0.25, size * 0.85, size * 0.88);
    } else {
      graphics.fillStyle(color, 0.72).fillCircle(0, size * 0.15, size * 0.55);
      for (let finger = -2; finger <= 2; finger += 1) graphics.fillRoundedRect(finger * size * 0.24 - 1, -size * 0.8 + Math.abs(finger) * 0.5, 2.2, size * 0.8, 1);
    }

    if (tier >= 2) {
      graphics.lineStyle(1, 0xffffff, 0.52).strokeCircle(0, 0, size + 6 + tier);
    }
  }

  private updateToolOrbitals(time: number): void {
    toolOrder.forEach((tool, index) => {
      const orbital = this.toolOrbitals[index];
      if (!orbital) return;
      const level = this.store.snapshot.tools[tool];
      const tier = Math.min(4, Math.floor((level - 1) / 4));
      const distance = 31 + tier * 4 + index * 1.2;
      const angle = time * (0.00058 + index * 0.000035) + index * (Math.PI / 2);
      orbital.setPosition(this.player.x + Math.cos(angle) * distance, this.player.y + Math.sin(angle) * distance * 0.72);
      orbital.rotation = angle + time * 0.00025;
      orbital.alpha = 0.58 + Math.sin(time / 420 + index) * 0.18 + tier * 0.045;
    });
  }

  private createMovementTrail(): void {
    const levelTier = Math.min(4, Math.floor((this.store.snapshot.level - 1) / 8));
    const trailColors = [0x81d78f, 0x8ee3b2, 0x7dc8ff, 0xd59cff, 0xffd66d];
    const color = trailColors[levelTier] ?? 0x81d78f;
    const mote = this.add.circle(this.player.x + Phaser.Math.Between(-5, 5), this.player.y + Phaser.Math.Between(10, 22), Phaser.Math.FloatBetween(1.2, 2.8), color, 0.34)
      .setDepth(6)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: mote, y: mote.y + Phaser.Math.Between(12, 25), x: mote.x + Phaser.Math.Between(-10, 10), alpha: 0, scale: 0.2, duration: Phaser.Math.Between(380, 620), onComplete: () => mote.destroy() });
  }

  private createDestinationPulse(x: number, y: number): void {
    const pulse = this.add.circle(x, y, 9, this.theme.accent, 0.06).setStrokeStyle(1.5, this.theme.accent, 0.6).setDepth(10);
    this.tweens.add({ targets: pulse, scale: 3.8, alpha: 0, duration: 480, ease: 'Cubic.easeOut', onComplete: () => pulse.destroy() });
  }

  private gatherRadius(): number {
    return 52 + this.store.snapshot.gear.worldpack * 7 + this.store.snapshot.stats.perception * 1.5;
  }

  private refreshProgressionVisuals(): void {
    if (!this.gatherRing?.active || !this.player?.active) return;
    const radius = this.gatherRadius();
    this.gatherRing.setRadius(radius);
    this.gatherRingInner.setRadius(Math.max(28, radius - 13));

    const level = this.store.snapshot.level;
    const tier = Math.min(4, Math.floor((level - 1) / 8));
    const strokes = [0x81d78f, 0x8ee3b2, 0x7dc8ff, 0xd59cff, 0xffd66d];
    const stroke = strokes[tier] ?? 0x81d78f;
    this.drawAvatar(tier);
    this.gatherRing.setStrokeStyle(1.5 + tier * 0.55, stroke, 0.2 + tier * 0.05).setFillStyle(stroke, 0.015 + tier * 0.005);
    this.gatherRingInner.setStrokeStyle(1, tier >= 3 ? 0xffe7a2 : this.theme.accentSecondary, 0.09 + tier * 0.025);

    toolOrder.forEach((tool, index) => {
      const orbital = this.toolOrbitals[index];
      if (!orbital) return;
      const toolLevel = this.store.snapshot.tools[tool];
      const toolTier = Math.min(4, Math.floor((toolLevel - 1) / 4));
      this.drawToolIcon(orbital, tool, toolTier);
    });

    for (const node of this.nodes) this.applyNodeVisuals(node);
  }

  private bindTouchControls(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
      const direction = button.dataset.move as keyof typeof this.touchDirection | undefined;
      if (!direction) return;
      const start = (event: Event) => {
        event.preventDefault();
        this.touchDirection[direction] = true;
        this.tapTarget = null;
      };
      const stop = (event: Event) => {
        event.preventDefault();
        this.touchDirection[direction] = false;
      };
      button.addEventListener('pointerdown', start);
      button.addEventListener('pointerup', stop);
      button.addEventListener('pointercancel', stop);
      button.addEventListener('pointerleave', stop);
    });
  }
}
