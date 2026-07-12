import Phaser from 'phaser';
import {
  allResources,
  biomes,
  qualityDefinitions,
  resources,
  type BiomeId,
  type HarvestQuality,
  type ToolId,
} from '../data/content';
import type { GameStore, StoreEvent } from '../state/GameStore';

interface ResourceNode {
  id: string;
  biomeId: BiomeId;
  baseId: string;
  resourceId: string;
  quality: HarvestQuality;
  x: number;
  y: number;
  body: Phaser.GameObjects.Arc;
  ring: Phaser.GameObjects.Arc;
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

export class WorldScene extends Phaser.Scene {
  private store: GameStore;
  private worldWidth = 1600;
  private worldHeight = 1000;
  private player!: Phaser.GameObjects.Arc;
  private playerGlow!: Phaser.GameObjects.Arc;
  private gatherRing!: Phaser.GameObjects.Arc;
  private toolOrbitals: Phaser.GameObjects.Arc[] = [];
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private nodes: ResourceNode[] = [];
  private keys!: Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;
  private tapTarget: Phaser.Math.Vector2 | null = null;
  private touchDirection = { up: false, down: false, left: false, right: false };
  private unsubscribe: (() => void) | null = null;

  constructor(store: GameStore) {
    super('WorldScene');
    this.store = store;
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this.playerGlow = this.add.circle(300, 300, 27, 0x9ee8a5, 0.16);
    this.player = this.add.circle(300, 300, 14, 0xe8f7ec, 1).setStrokeStyle(3, 0x81d78f, 0.95);
    this.gatherRing = this.add.circle(300, 300, this.gatherRadius(), 0x9ee8a5, 0.035).setStrokeStyle(1, 0xa6eab0, 0.22);

    this.titleText = this.add.text(34, 30, '', {
      fontFamily: 'Georgia, serif', fontSize: '30px', color: '#f2f8f1', stroke: '#06100d', strokeThickness: 5,
    }).setScrollFactor(0).setDepth(10);

    this.subtitleText = this.add.text(36, 67, '', {
      fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#b8c8bd', stroke: '#06100d', strokeThickness: 4,
    }).setScrollFactor(0).setDepth(10);

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
    });

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);

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

    const speed = 190 + this.store.snapshot.gear.boots * 15 + this.store.snapshot.stats.endurance * 2.5;
    this.player.x = Phaser.Math.Clamp(this.player.x + direction.x * speed * dt, 40, this.worldWidth - 40);
    this.player.y = Phaser.Math.Clamp(this.player.y + direction.y * speed * dt, 40, this.worldHeight - 40);
    this.playerGlow.setPosition(this.player.x, this.player.y);
    this.gatherRing.setPosition(this.player.x, this.player.y);
    this.updateToolOrbitals(time);
    this.updateNodes();
  }

  private loadBiome(biomeId: BiomeId): void {
    const biome = biomes[biomeId];
    this.cameras.main.setBackgroundColor(biome.background);
    this.children.removeAll(true);
    this.nodes = [];
    this.toolOrbitals = [];

    this.drawTerrain(biome.background, biome.fog);

    this.playerGlow = this.add.circle(this.worldWidth / 2, this.worldHeight / 2, 27, 0x9ee8a5, 0.16).setDepth(5);
    this.player = this.add.circle(this.worldWidth / 2, this.worldHeight / 2, 14, 0xe8f7ec, 1).setStrokeStyle(3, 0x81d78f, 0.95).setDepth(7);
    this.gatherRing = this.add.circle(this.player.x, this.player.y, this.gatherRadius(), 0x9ee8a5, 0.035).setStrokeStyle(1, 0xa6eab0, 0.22).setDepth(4);
    this.createToolOrbitals();

    this.titleText = this.add.text(34, 30, biome.name, {
      fontFamily: 'Georgia, serif', fontSize: '30px', color: '#f2f8f1', stroke: '#06100d', strokeThickness: 5,
    }).setScrollFactor(0).setDepth(20);
    this.subtitleText = this.add.text(36, 67, biome.subtitle, {
      fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#b8c8bd', stroke: '#06100d', strokeThickness: 4,
    }).setScrollFactor(0).setDepth(20);

    for (let i = 0; i < biome.nodeCount; i += 1) this.spawnNode(biomeId, i);
    this.refreshProgressionVisuals();
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  private drawTerrain(base: number, fog: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(base, 1).fillRect(0, 0, this.worldWidth, this.worldHeight);

    for (let i = 0; i < 70; i += 1) {
      const x = Phaser.Math.Between(0, this.worldWidth);
      const y = Phaser.Math.Between(0, this.worldHeight);
      const radius = Phaser.Math.Between(35, 135);
      graphics.fillStyle(fog, Phaser.Math.FloatBetween(0.025, 0.085));
      graphics.fillCircle(x, y, radius);
    }

    graphics.lineStyle(2, fog, 0.12);
    for (let i = 0; i < 24; i += 1) {
      const y = Phaser.Math.Between(50, this.worldHeight - 50);
      graphics.beginPath();
      graphics.moveTo(0, y);
      graphics.lineTo(this.worldWidth, y + Phaser.Math.Between(-80, 80));
      graphics.strokePath();
    }
  }

  private spawnNode(biomeId: BiomeId, index: number): void {
    const biome = biomes[biomeId];
    const baseId = Phaser.Utils.Array.GetRandom(biome.resources);
    const roll = this.store.rollNode(baseId);
    const definition = allResources[roll.resourceId];
    if (!definition) return;

    const x = Phaser.Math.Between(70, this.worldWidth - 70);
    const y = Phaser.Math.Between(100, this.worldHeight - 70);
    const ring = this.add.circle(x, y, definition.radius + 9, definition.glow, 0.08).setDepth(1);
    const body = this.add.circle(x, y, definition.radius, definition.color, 0.98).setStrokeStyle(2, definition.glow, 0.75).setDepth(2);
    const label = this.add.text(x, y + definition.radius + 9, '', {
      fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#d9e7dc', backgroundColor: '#07100dcc',
      padding: { left: 4, right: 4, top: 2, bottom: 2 },
    }).setOrigin(0.5, 0).setAlpha(0).setDepth(3);

    const node: ResourceNode = {
      id: `node-${index}`, biomeId, baseId, resourceId: roll.resourceId, quality: roll.quality,
      x, y, body, ring, label, available: true, readyAt: 0,
    };
    this.nodes.push(node);
    this.applyNodeVisuals(node);
  }

  private updateNodes(): void {
    const now = performance.now();
    const radius = this.gatherRadius();

    for (const node of this.nodes) {
      if (!node.available) {
        if (now >= node.readyAt) this.restoreNode(node);
        continue;
      }

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, node.x, node.y);
      node.label.setAlpha(distance < 130 ? 0.9 : 0);
      const qualityRank = qualityDefinitions[node.quality].rank;
      const variantPulse = allResources[node.resourceId]?.isVariant ? 0.14 : 0.08;
      node.ring.setScale(1 + Math.sin((now + node.x) / Math.max(220, 480 - qualityRank * 45)) * (variantPulse + qualityRank * 0.018));
      node.body.setRotation(Math.sin((now + node.y) / 850) * (qualityRank * 0.035));
      if (distance <= radius) this.harvestNode(node);
    }
  }

  private harvestNode(node: ResourceNode): void {
    const result = this.store.gather(node.resourceId, node.quality);
    node.available = false;
    node.readyAt = performance.now() + Phaser.Math.Between(3500, 6500);
    node.body.setVisible(false);
    node.ring.setVisible(false);
    node.label.setVisible(false);

    const qualityInfo = qualityDefinitions[result.quality];
    const prefix = result.definition.isVariant ? '✦ DISCOVERY ✦ ' : result.critical ? '✦ ' : '+';
    const suffix = result.surprise ? ` · ${result.surprise}` : '';
    const text = this.add.text(node.x, node.y - 18, `${prefix}${result.quantity} ${result.quality} ${result.definition.name}${suffix}`, {
      fontFamily: 'Inter, sans-serif', fontStyle: 'bold',
      fontSize: result.definition.isVariant ? '17px' : result.critical ? '15px' : '12px',
      color: result.definition.isVariant ? '#fff0a6' : qualityInfo.color,
      stroke: '#07100d', strokeThickness: 5, align: 'center', wordWrap: { width: 300 },
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({ targets: text, y: text.y - 50, alpha: 0, duration: result.definition.isVariant ? 1700 : 1000, ease: 'Cubic.easeOut', onComplete: () => text.destroy() });
    this.tweens.add({ targets: this.playerGlow, scale: result.definition.isVariant ? 1.85 : 1.35, alpha: result.definition.isVariant ? 0.65 : 0.32, yoyo: true, duration: result.definition.isVariant ? 320 : 110 });

    if (result.definition.isVariant) {
      this.cameras.main.flash(650, 255, 225, 135, false);
      this.cameras.main.shake(280, 0.006);
    } else if (qualityInfo.rank >= 3) {
      this.cameras.main.flash(240, 180, 150, 255, false);
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
    node.body.setVisible(true).setScale(0.35).setAlpha(0);
    node.ring.setVisible(true).setScale(0.35).setAlpha(0);
    node.label.setVisible(true);
    this.tweens.add({ targets: [node.body, node.ring], scale: 1, alpha: 1, duration: 480, ease: 'Back.easeOut' });
  }

  private applyNodeVisuals(node: ResourceNode): void {
    const definition = allResources[node.resourceId] ?? resources[node.baseId];
    if (!definition) return;
    const quality = qualityDefinitions[node.quality];
    const hiddenVariant = Boolean(definition.isVariant && !this.store.snapshot.discovered.includes(definition.id));
    const bodyColor = hiddenVariant ? 0x11131c : definition.color;
    const glowColor = hiddenVariant ? 0xb7a6ff : quality.rank > 0 ? quality.glow : definition.glow;
    const radius = definition.radius + Math.min(3, quality.rank);

    node.body.setRadius(radius).setFillStyle(bodyColor, hiddenVariant ? 0.88 : 0.98).setStrokeStyle(2 + Math.min(2, quality.rank), glowColor, hiddenVariant ? 1 : 0.78);
    node.ring.setRadius(radius + 9 + quality.rank * 2).setFillStyle(glowColor, hiddenVariant ? 0.22 : 0.07 + quality.rank * 0.045).setStrokeStyle(hiddenVariant || quality.rank >= 2 ? 1 : 0, glowColor, 0.48);
    node.label.setY(node.y + radius + 9);

    if (hiddenVariant) {
      node.label.setText('◆ Unidentified Material').setColor('#d8ceff');
    } else {
      const qualityPrefix = node.quality === 'Standard' ? '' : `${node.quality} `;
      node.label.setText(`${qualityPrefix}${definition.name}`).setColor(quality.color);
    }
  }

  private createToolOrbitals(): void {
    const tools: ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];
    this.toolOrbitals = tools.map((tool) => this.add.circle(this.player.x, this.player.y, 3, toolColors[tool], 0.9).setDepth(8));
  }

  private updateToolOrbitals(time: number): void {
    const tools: ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];
    tools.forEach((tool, index) => {
      const orbital = this.toolOrbitals[index];
      if (!orbital) return;
      const level = this.store.snapshot.tools[tool];
      const distance = 23 + Math.min(10, Math.floor(level / 3));
      const angle = time * (0.0007 + index * 0.00004) + index * (Math.PI / 2);
      orbital.setPosition(this.player.x + Math.cos(angle) * distance, this.player.y + Math.sin(angle) * distance);
    });
  }

  private gatherRadius(): number {
    return 52 + this.store.snapshot.gear.worldpack * 7 + this.store.snapshot.stats.perception * 1.5;
  }

  private refreshProgressionVisuals(): void {
    if (!this.gatherRing?.active || !this.player?.active) return;
    this.gatherRing.setRadius(this.gatherRadius());

    const level = this.store.snapshot.level;
    const tier = Math.min(4, Math.floor((level - 1) / 8));
    const fills = [0xe8f7ec, 0xcdf6d1, 0xc8e6ff, 0xe2c8ff, 0xffe7a2];
    const strokes = [0x81d78f, 0x8ee3b2, 0x7dc8ff, 0xd59cff, 0xffd66d];
    this.player.setFillStyle(fills[tier] ?? fills[0], 1).setStrokeStyle(3 + Math.min(2, tier), strokes[tier] ?? strokes[0], 0.98);
    this.playerGlow.setFillStyle(strokes[tier] ?? strokes[0], 0.14 + tier * 0.035).setRadius(27 + tier * 3);
    this.gatherRing.setStrokeStyle(1 + Math.min(2, tier), strokes[tier] ?? strokes[0], 0.22 + tier * 0.06);

    const tools: ToolId[] = ['axe', 'pickaxe', 'sickle', 'gloves'];
    tools.forEach((tool, index) => {
      const orbital = this.toolOrbitals[index];
      if (!orbital) return;
      const toolLevel = this.store.snapshot.tools[tool];
      const toolTier = Math.min(4, Math.floor((toolLevel - 1) / 4));
      orbital.setRadius(3 + toolTier * 1.25).setFillStyle(toolColors[tool], 0.75 + toolTier * 0.055).setStrokeStyle(toolTier >= 2 ? 2 : 0, 0xffffff, 0.45 + toolTier * 0.1);
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
