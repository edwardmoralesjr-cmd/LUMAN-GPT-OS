import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';
import type { GameStore } from './state/GameStore';

export function createGame(store: GameStore): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#0f241c',
    transparent: false,
    scene: [new WorldScene(store)],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%',
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
  });
}
