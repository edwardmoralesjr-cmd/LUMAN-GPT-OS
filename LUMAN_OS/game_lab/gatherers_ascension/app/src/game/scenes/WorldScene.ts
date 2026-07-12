import Phaser from 'phaser';
import { biomes, resources, type BiomeId } from '../data/content';
import type { GameStore, StoreEvent } from '../state/GameStore';

interface ResourceNode {
  id: string;
  x: number;
  y: number;
  body: Phaser.GameObjects.Arc;
  ring: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  available: boolean;
  readyAt: number;
}

export class WorldScene extends Phaser.Scene {
  private store: GameStore;
  private worldWidth = 1600;
  private worldHeight = 1000;
  private player!: Phaser.GameObjects.Arc;
  private playerGlow!: Phaser.GameObjects.Arc;
  private gatherRing!: Phaser.GameObjects.Arc;
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
      fontFamily: 'Georgia, serif',
      fontSize: '30px',
      color: '#f2f8f1',
      stroke: '#06100d',
      strokeThickness: 5,
    }).setScrollFactor(0).setDepth(10);

    this.subtitleText = this.add.text(36, 67, '', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      color: '#b8c8bd',
      stroke: '#06100d',
      strokeThickness: 4,
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

  update(_time: number, delta: number): void {
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

    this.updateNodes();
  }

  private loadBiome(biomeId: BiomeId): void {
    const biome = biomes[biomeId];
    this.cameras.main.setBackgroundColor(biome.background);
    this.children.removeAll(true);
    this.nodes = [];

    this.drawTerrain(biome.background, biome.fog);

    this.playerGlow = this.add.circle(this.worldWidth / 2, this.worldHeight / 2, 27, 0x9ee8a5, 0.16).setDepth(5);
    this.player = this.add.circle(this.worldWidth / 2, this.worldHeight / 2, 14, 0xe8f7ec, 1).setStrokeStyle(3, 0x81d78f, 0.95).setDepth(7);
    this.gatherRing = this.add.circle(this.player.x, this.player.y, this.gatherRadius(), 0x9ee8a5, 0.035).setStrokeStyle(1, 0xa6eab0, 0.22).setDepth(4);

    this.titleText = this.add.text(34, 30, biome.name, {
      fontFamily: 'Georgia, serif',
      fontSize: '30px',
      color: '#f2f8f1',
      stroke: '#06100d',
      strokeThickness: 5,
    }).setScrollFactor(0).setDepth(20);
    this.subtitleText = this.add.text(36, 67, biome.subtitle, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      color: '#b8c8bd',
      stroke: '#06100d',
      strokeThickness: 4,
    }).setScrollFactor(0).setDepth(20);

    for (let i = 0; i < biome.nodeCount; i += 1) this.spawnNode(biomeId, i);
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
    const resourceId = Phaser.Utils.Array.GetRandom(biome.resources);
    const definition = resources[resourceId];
    if (!definition) return;

    const x = Phaser.Math.Between(70, this.worldWidth - 70);
    const y = Phaser.Math.Between(100, this.worldHeight - 70);
    const rare = ['Rare', 'Epic', 'Legendary'].includes(definition.rarity);
    const ring = this.add.circle(x, y, definition.radius + 9, definition.glow, rare ? 0.18 : 0.08).setDepth(1);
    const body = this.add.circle(x, y, definition.radius, definition.color, 0.98).setStrokeStyle(2, definition.glow, 0.75).setDepth(2);
    const label = this.add.text(x, y + definition.radius + 9, definition.name, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      color: '#d9e7dc',
      backgroundColor: '#07100dcc',
      padding: { left: 4, right: 4, top: 2, bottom: 2 },
    }).setOrigin(0.5, 0).setAlpha(0).setDepth(3);

    this.nodes.push({ id: `${resourceId}-${index}`, x, y, body, ring, label, available: true, readyAt: 0 });
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
      node.label.setAlpha(distance < 120 ? 0.82 : 0);
      node.ring.setScale(1 + Math.sin((now + node.x) / 480) * 0.08);
      if (distance <= radius) this.harvestNode(node);
    }
  }

  private harvestNode(node: ResourceNode): void {
    const resourceId = node.id.split('-')[0];
    if (!resourceId) return;
    const result = this.store.gather(resourceId);
    node.available = false;
    node.readyAt = performance.now() + Phaser.Math.Between(3500, 6500);
    node.body.setVisible(false);
    node.ring.setVisible(false);
    node.label.setVisible(false);

    const text = this.add.text(node.x, node.y - 18, `${result.critical ? '✦ ' : '+'}${result.quantity} ${result.definition.name}`, {
      fontFamily: 'Inter, sans-serif',
      fontStyle: 'bold',
      fontSize: result.critical ? '15px' : '12px',
      color: result.critical ? '#ffe7a8' : '#e7f5e8',
      stroke: '#07100d',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({ targets: text, y: text.y - 40, alpha: 0, duration: 900, ease: 'Cubic.easeOut', onComplete: () => text.destroy() });
    this.tweens.add({ targets: this.playerGlow, scale: 1.35, alpha: 0.32, yoyo: true, duration: 110 });
  }

  private restoreNode(node: ResourceNode): void {
    node.available = true;
    node.body.setVisible(true).setScale(0.35).setAlpha(0);
    node.ring.setVisible(true).setScale(0.35).setAlpha(0);
    node.label.setVisible(true);
    this.tweens.add({ targets: [node.body, node.ring], scale: 1, alpha: 1, duration: 420, ease: 'Back.easeOut' });
  }

  private gatherRadius(): number {
    return 52 + this.store.snapshot.gear.worldpack * 7 + this.store.snapshot.stats.perception * 1.5;
  }

  private refreshProgressionVisuals(): void {
    if (!this.gatherRing?.active) return;
    this.gatherRing.setRadius(this.gatherRadius());
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
