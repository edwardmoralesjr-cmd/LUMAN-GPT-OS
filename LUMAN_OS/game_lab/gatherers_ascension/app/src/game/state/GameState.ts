import type { BiomeId, HarvestQuality, StatId, ToolId } from '../data/content';
import type { GathererRole } from '../data/network';

export interface PlayerStats extends Record<StatId, number> {}
export interface ToolLevels extends Record<ToolId, number> {}
export interface ToolDurability extends Record<ToolId, number> {}

export interface BiomeEcologyState {
  saturation: number;
  updatedAt: number;
  totalPressure: number;
}

export interface GathererState {
  id: string;
  templateId: string;
  name: string;
  role: GathererRole;
  specialty: ToolId;
  level: number;
  xp: number;
  equipmentLevel: number;
  efficiency: number;
  endurance: number;
  fortune: number;
  fatigue: number;
  fatigueUpdatedAt: number;
  totalGathered: number;
  cyclesCompleted: number;
  assignedZoneId: string | null;
  lastCycleAt: number | null;
}

export interface NetworkActivity {
  id: string;
  timestamp: number;
  title: string;
  detail: string;
  tone: 'normal' | 'success' | 'rare' | 'warning';
}

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
  discoveredQualities: Record<string, HarvestQuality[]>;
  claimedMilestones: number[];
  rareMomentum: number;
  activeBoostUntil: number;
  stats: PlayerStats;
  tools: ToolLevels;
  toolDurability: ToolDurability;
  biomeEcology: Record<BiomeId, BiomeEcologyState>;
  gear: {
    worldpack: number;
    boots: number;
    fieldKit: number;
    relicWard: number;
  };
  skills: Record<ToolId, { level: number; xp: number }>;
  network: {
    level: number;
    xp: number;
    commandPoints: number;
    unlockedZones: string[];
    gatherers: GathererState[];
    activity: NetworkActivity[];
    totalAutomatedGathered: number;
    expeditionsCompleted: number;
  };
  operations: {
    totalRepairs: number;
    totalRepairCost: number;
    capacityStops: number;
    exhaustionRecalls: number;
    lastMaintenanceAt: number | null;
  };
  totals: {
    gathered: number;
    coinsEarned: number;
    rareFinds: number;
    variantsFound: number;
    criticalHarvests: number;
    surpriseEvents: number;
    perfectedFinds: number;
  };
}

const biomeIds: readonly BiomeId[] = ['greenveil', 'ironfall', 'crystal-vale', 'emberdeep'];

function createBiomeEcology(now = Date.now()): Record<BiomeId, BiomeEcologyState> {
  return Object.fromEntries(biomeIds.map((id) => [id, { saturation: 12, updatedAt: now, totalPressure: 0 }])) as Record<BiomeId, BiomeEcologyState>;
}

function starterGatherer(now = Date.now()): GathererState {
  return {
    id: 'gatherer-rowan',
    templateId: 'rowan',
    name: 'Rowan Vale',
    role: 'Forager',
    specialty: 'sickle',
    level: 1,
    xp: 0,
    equipmentLevel: 1,
    efficiency: 1.08,
    endurance: 8,
    fortune: 5,
    fatigue: 0,
    fatigueUpdatedAt: now,
    totalGathered: 0,
    cyclesCompleted: 0,
    assignedZoneId: null,
    lastCycleAt: null,
  };
}

export function createInitialState(): GameState {
  const now = Date.now();
  return {
    version: 5,
    updatedAt: now,
    playerName: 'The Gatherer',
    level: 1,
    xp: 0,
    statPoints: 0,
    coins: 0,
    currentBiome: 'greenveil',
    unlockedBiomes: ['greenveil'],
    inventory: {},
    discovered: [],
    discoveredQualities: {},
    claimedMilestones: [],
    rareMomentum: 0,
    activeBoostUntil: 0,
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
    toolDurability: {
      axe: 100,
      pickaxe: 100,
      sickle: 100,
      gloves: 100,
    },
    biomeEcology: createBiomeEcology(now),
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
    network: {
      level: 1,
      xp: 0,
      commandPoints: 0,
      unlockedZones: ['worldwood-grove'],
      gatherers: [starterGatherer(now)],
      activity: [{
        id: 'network-online',
        timestamp: now,
        title: 'Worldroot Network Online',
        detail: 'Rowan Vale is ready for the first automated deployment.',
        tone: 'success',
      }],
      totalAutomatedGathered: 0,
      expeditionsCompleted: 0,
    },
    operations: {
      totalRepairs: 0,
      totalRepairCost: 0,
      capacityStops: 0,
      exhaustionRecalls: 0,
      lastMaintenanceAt: null,
    },
    totals: {
      gathered: 0,
      coinsEarned: 0,
      rareFinds: 0,
      variantsFound: 0,
      criticalHarvests: 0,
      surpriseEvents: 0,
      perfectedFinds: 0,
    },
  };
}

export function normalizeState(raw: Partial<GameState> | null | undefined): GameState {
  const base = createInitialState();
  if (!raw) return base;

  const rawNetwork = raw.network;
  const rawEcology = raw.biomeEcology;
  const normalizedEcology = Object.fromEntries(biomeIds.map((id) => [id, {
    ...base.biomeEcology[id],
    ...(rawEcology?.[id] ?? {}),
    saturation: Math.min(100, Math.max(8, rawEcology?.[id]?.saturation ?? base.biomeEcology[id].saturation)),
  }])) as Record<BiomeId, BiomeEcologyState>;

  return {
    ...base,
    ...raw,
    inventory: { ...base.inventory, ...(raw.inventory ?? {}) },
    discoveredQualities: { ...base.discoveredQualities, ...(raw.discoveredQualities ?? {}) },
    stats: { ...base.stats, ...(raw.stats ?? {}) },
    tools: { ...base.tools, ...(raw.tools ?? {}) },
    toolDurability: { ...base.toolDurability, ...(raw.toolDurability ?? {}) },
    biomeEcology: normalizedEcology,
    gear: { ...base.gear, ...(raw.gear ?? {}) },
    skills: {
      axe: { ...base.skills.axe, ...(raw.skills?.axe ?? {}) },
      pickaxe: { ...base.skills.pickaxe, ...(raw.skills?.pickaxe ?? {}) },
      sickle: { ...base.skills.sickle, ...(raw.skills?.sickle ?? {}) },
      gloves: { ...base.skills.gloves, ...(raw.skills?.gloves ?? {}) },
    },
    network: {
      ...base.network,
      ...(rawNetwork ?? {}),
      unlockedZones: rawNetwork?.unlockedZones?.length ? rawNetwork.unlockedZones : base.network.unlockedZones,
      gatherers: rawNetwork?.gatherers?.length ? rawNetwork.gatherers.map((gatherer) => ({
        ...starterGatherer(),
        ...gatherer,
        fatigue: Math.min(100, Math.max(0, gatherer.fatigue ?? 0)),
        fatigueUpdatedAt: gatherer.fatigueUpdatedAt ?? raw.updatedAt ?? Date.now(),
      })) : base.network.gatherers,
      activity: rawNetwork?.activity?.length ? rawNetwork.activity.slice(0, 40) : base.network.activity,
    },
    operations: { ...base.operations, ...(raw.operations ?? {}) },
    totals: { ...base.totals, ...(raw.totals ?? {}) },
    unlockedBiomes: raw.unlockedBiomes?.length ? raw.unlockedBiomes : base.unlockedBiomes,
    discovered: raw.discovered ?? base.discovered,
    claimedMilestones: raw.claimedMilestones ?? base.claimedMilestones,
    rareMomentum: raw.rareMomentum ?? base.rareMomentum,
    activeBoostUntil: raw.activeBoostUntil ?? base.activeBoostUntil,
    updatedAt: raw.updatedAt ?? Date.now(),
    version: 5,
  };
}
