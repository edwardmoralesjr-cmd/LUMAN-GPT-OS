import type { BiomeId, StatId, ToolId } from '../data/content';

export interface PlayerStats extends Record<StatId, number> {}
export interface ToolLevels extends Record<ToolId, number> {}

export interface GameState {
  version: number;
  updatedAt: number;
  playerName: string;
  level: number;
  xp: number;
  statPoints: number;
  coins: number;
  currentBiome: BiomeId;
  unlockedBiomes: BiomeId[];
  inventory: Record<string, number>;
  discovered: string[];
  stats: PlayerStats;
  tools: ToolLevels;
  gear: {
    worldpack: number;
    boots: number;
    fieldKit: number;
    relicWard: number;
  };
  skills: Record<ToolId, { level: number; xp: number }>;
  totals: {
    gathered: number;
    coinsEarned: number;
    rareFinds: number;
  };
}

export function createInitialState(): GameState {
  return {
    version: 2,
    updatedAt: Date.now(),
    playerName: 'The Gatherer',
    level: 1,
    xp: 0,
    statPoints: 0,
    coins: 0,
    currentBiome: 'greenveil',
    unlockedBiomes: ['greenveil'],
    inventory: {},
    discovered: [],
    stats: {
      power: 1,
      precision: 1,
      perception: 1,
      endurance: 1,
      knowledge: 1,
      fortune: 1,
    },
    tools: {
      axe: 1,
      pickaxe: 1,
      sickle: 1,
      gloves: 1,
    },
    gear: {
      worldpack: 0,
      boots: 0,
      fieldKit: 0,
      relicWard: 0,
    },
    skills: {
      axe: { level: 1, xp: 0 },
      pickaxe: { level: 1, xp: 0 },
      sickle: { level: 1, xp: 0 },
      gloves: { level: 1, xp: 0 },
    },
    totals: {
      gathered: 0,
      coinsEarned: 0,
      rareFinds: 0,
    },
  };
}

export function normalizeState(raw: Partial<GameState> | null | undefined): GameState {
  const base = createInitialState();
  if (!raw) return base;

  return {
    ...base,
    ...raw,
    inventory: { ...base.inventory, ...(raw.inventory ?? {}) },
    stats: { ...base.stats, ...(raw.stats ?? {}) },
    tools: { ...base.tools, ...(raw.tools ?? {}) },
    gear: { ...base.gear, ...(raw.gear ?? {}) },
    skills: {
      axe: { ...base.skills.axe, ...(raw.skills?.axe ?? {}) },
      pickaxe: { ...base.skills.pickaxe, ...(raw.skills?.pickaxe ?? {}) },
      sickle: { ...base.skills.sickle, ...(raw.skills?.sickle ?? {}) },
      gloves: { ...base.skills.gloves, ...(raw.skills?.gloves ?? {}) },
    },
    totals: { ...base.totals, ...(raw.totals ?? {}) },
    unlockedBiomes: raw.unlockedBiomes?.length ? raw.unlockedBiomes : base.unlockedBiomes,
    discovered: raw.discovered ?? base.discovered,
    updatedAt: raw.updatedAt ?? Date.now(),
    version: 2,
  };
}
