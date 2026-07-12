import type { GameState } from '../state/GameState';

export function xpForLevel(level: number): number {
  return Math.floor(85 * Math.pow(level, 1.48));
}

export function skillXpForLevel(level: number): number {
  return Math.floor(55 * Math.pow(level, 1.42));
}

export function gearLevel(state: GameState): number {
  const tools = Object.values(state.tools as Record<string, number>).reduce((sum, value) => sum + Math.max(0, value - 1), 0);
  const gear = Object.values(state.gear as Record<string, number>).reduce((sum, value) => sum + value, 0);
  return tools + gear;
}

export function toolUpgradeCost(level: number): number {
  return Math.floor(28 * Math.pow(level, 1.72));
}

export function gearUpgradeCost(level: number, base: number): number {
  return Math.floor(base * Math.pow(level + 1, 1.62));
}
