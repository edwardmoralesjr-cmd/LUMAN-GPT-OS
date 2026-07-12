import type { BiomeId, ToolId } from './content';

export type GathererRole = 'Forager' | 'Miner' | 'Harvester' | 'Relic Seeker' | 'Surveyor' | 'Expedition Leader';
export type ZoneRisk = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface GathererTemplate {
  id: string;
  name: string;
  role: GathererRole;
  specialty: ToolId;
  unlockLevel: number;
  recruitCost: number;
  efficiency: number;
  endurance: number;
  fortune: number;
  description: string;
  trait: string;
}

export interface GatheringZoneDefinition {
  id: string;
  name: string;
  biomeId: BiomeId;
  tier: number;
  unlockLevel: number;
  durationSeconds: number;
  baseYield: number;
  danger: ZoneRisk;
  stability: number;
  rarityBonus: number;
  specialty: ToolId;
  resources: string[];
  description: string;
  accent: string;
}

export const gathererTemplates: Record<string, GathererTemplate> = {
  rowan: {
    id: 'rowan',
    name: 'Rowan Vale',
    role: 'Forager',
    specialty: 'sickle',
    unlockLevel: 1,
    recruitCost: 0,
    efficiency: 1.08,
    endurance: 8,
    fortune: 5,
    description: 'A patient meadow scout who reads movement in grass and leaf.',
    trait: 'Verdant Instinct: increased flora yield in Greenveil zones.',
  },
  torren: {
    id: 'torren',
    name: 'Torren Flint',
    role: 'Miner',
    specialty: 'pickaxe',
    unlockLevel: 5,
    recruitCost: 320,
    efficiency: 1.16,
    endurance: 12,
    fortune: 3,
    description: 'A disciplined extractor trained to keep tools productive under pressure.',
    trait: 'Deep Strike: improved ore yield and reduced Ironfall cycle time.',
  },
  lyra: {
    id: 'lyra',
    name: 'Lyra Moss',
    role: 'Harvester',
    specialty: 'axe',
    unlockLevel: 9,
    recruitCost: 620,
    efficiency: 1.22,
    endurance: 9,
    fortune: 8,
    description: 'A rare-material tracker who follows changes in sap, bark, and resonance.',
    trait: 'Living Pattern: stronger quality and mutation odds in forest zones.',
  },
  cael: {
    id: 'cael',
    name: 'Cael Meridian',
    role: 'Surveyor',
    specialty: 'gloves',
    unlockLevel: 13,
    recruitCost: 980,
    efficiency: 1.28,
    endurance: 10,
    fortune: 11,
    description: 'A field analyst who maps unstable nodes before committing a full team.',
    trait: 'Resonance Scan: raises rare-find chance across the active network.',
  },
  mira: {
    id: 'mira',
    name: 'Mira Ashfall',
    role: 'Relic Seeker',
    specialty: 'gloves',
    unlockLevel: 18,
    recruitCost: 1550,
    efficiency: 1.36,
    endurance: 14,
    fortune: 12,
    description: 'A deep-archive specialist capable of handling sealed and volatile remains.',
    trait: 'Archive Sense: improved relic and Mythic yield in Emberdeep.',
  },
  orren: {
    id: 'orren',
    name: 'Orren Starpath',
    role: 'Expedition Leader',
    specialty: 'pickaxe',
    unlockLevel: 24,
    recruitCost: 2400,
    efficiency: 1.48,
    endurance: 16,
    fortune: 15,
    description: 'A veteran route commander who synchronizes multiple gathering disciplines.',
    trait: 'Command Presence: boosts every assigned gatherer when deployed.',
  },
};

export const gatheringZones: Record<string, GatheringZoneDefinition> = {
  'worldwood-grove': {
    id: 'worldwood-grove', name: 'Worldwood Grove', biomeId: 'greenveil', tier: 1, unlockLevel: 1,
    durationSeconds: 18, baseYield: 3, danger: 'Low', stability: 96, rarityBonus: 0,
    specialty: 'axe', resources: ['wood', 'fiber'], accent: '#79d98b',
    description: 'A stable starter operation rich in wood, fiber, and easy route mastery.',
  },
  'verdant-fern-patch': {
    id: 'verdant-fern-patch', name: 'Verdant Fern Patch', biomeId: 'greenveil', tier: 1, unlockLevel: 2,
    durationSeconds: 24, baseYield: 4, danger: 'Low', stability: 92, rarityBonus: 0.003,
    specialty: 'sickle', resources: ['fiber', 'herb'], accent: '#8ee6a3',
    description: 'Dense medicinal growth with stronger Fine-quality specimen rates.',
  },
  'elderbark-hollow': {
    id: 'elderbark-hollow', name: 'Elderbark Hollow', biomeId: 'greenveil', tier: 2, unlockLevel: 6,
    durationSeconds: 36, baseYield: 5, danger: 'Moderate', stability: 84, rarityBonus: 0.007,
    specialty: 'axe', resources: ['wood', 'ancientBark', 'herb'], accent: '#d7c36b',
    description: 'An old-growth pocket where ancient wood and hidden variants can surface.',
  },
  'orebreak-ridge': {
    id: 'orebreak-ridge', name: 'Orebreak Ridge', biomeId: 'ironfall', tier: 2, unlockLevel: 5,
    durationSeconds: 30, baseYield: 5, danger: 'Moderate', stability: 81, rarityBonus: 0.004,
    specialty: 'pickaxe', resources: ['stone', 'ore'], accent: '#dd8f62',
    description: 'A reliable extraction ridge with elevated tool wear and strong ore output.',
  },
  'red-vein-pass': {
    id: 'red-vein-pass', name: 'Red Vein Pass', biomeId: 'ironfall', tier: 3, unlockLevel: 10,
    durationSeconds: 44, baseYield: 7, danger: 'High', stability: 72, rarityBonus: 0.009,
    specialty: 'pickaxe', resources: ['ore', 'stone', 'ancientBark'], accent: '#ff745f',
    description: 'A volatile mineral corridor with stronger rare-ore and critical-yield odds.',
  },
  'warden-cut': {
    id: 'warden-cut', name: "Warden's Cut", biomeId: 'ironfall', tier: 3, unlockLevel: 14,
    durationSeconds: 58, baseYield: 8, danger: 'High', stability: 66, rarityBonus: 0.014,
    specialty: 'axe', resources: ['ore', 'ancientBark'], accent: '#c86c4f',
    description: 'A sealed industrial route where persistent teams can uncover warden-era materials.',
  },
  'lumen-shelf': {
    id: 'lumen-shelf', name: 'Lumen Shelf', biomeId: 'crystal-vale', tier: 3, unlockLevel: 12,
    durationSeconds: 42, baseYield: 6, danger: 'Moderate', stability: 79, rarityBonus: 0.011,
    specialty: 'pickaxe', resources: ['crystal', 'ore'], accent: '#8fe8ff',
    description: 'A luminous shelf suited to crystal specialists and high-value specimens.',
  },
  'moonglass-pools': {
    id: 'moonglass-pools', name: 'Moonglass Pools', biomeId: 'crystal-vale', tier: 4, unlockLevel: 16,
    durationSeconds: 56, baseYield: 8, danger: 'High', stability: 68, rarityBonus: 0.018,
    specialty: 'sickle', resources: ['moonDew', 'crystal'], accent: '#b8a7ff',
    description: 'Reflective pools that amplify mutation, quality, and celestial-material chances.',
  },
  'starfall-terrace': {
    id: 'starfall-terrace', name: 'Starfall Terrace', biomeId: 'crystal-vale', tier: 5, unlockLevel: 21,
    durationSeconds: 76, baseYield: 10, danger: 'Extreme', stability: 59, rarityBonus: 0.026,
    specialty: 'gloves', resources: ['crystal', 'moonDew', 'relic'], accent: '#d5c4ff',
    description: 'A high-altitude expedition zone with extraordinary discovery potential.',
  },
  'ash-vault': {
    id: 'ash-vault', name: 'Ash Vault', biomeId: 'emberdeep', tier: 4, unlockLevel: 22,
    durationSeconds: 62, baseYield: 9, danger: 'High', stability: 64, rarityBonus: 0.016,
    specialty: 'gloves', resources: ['relic', 'ore'], accent: '#ff9a64',
    description: 'A buried archive entrance rich in relic fragments and sealed inscriptions.',
  },
  'crownless-gallery': {
    id: 'crownless-gallery', name: 'Crownless Gallery', biomeId: 'emberdeep', tier: 5, unlockLevel: 27,
    durationSeconds: 88, baseYield: 12, danger: 'Extreme', stability: 51, rarityBonus: 0.03,
    specialty: 'gloves', resources: ['relic', 'emberglass'], accent: '#ffd078',
    description: 'A prestige expedition site where completed collections influence the ruins.',
  },
  'phoenix-trench': {
    id: 'phoenix-trench', name: 'Phoenix Trench', biomeId: 'emberdeep', tier: 6, unlockLevel: 34,
    durationSeconds: 120, baseYield: 16, danger: 'Extreme', stability: 42, rarityBonus: 0.045,
    specialty: 'pickaxe', resources: ['emberglass', 'relic', 'crystal'], accent: '#ff6846',
    description: 'The deepest known operation, reserved for elite teams and Ascendant equipment.',
  },
};

export const zonesByBiome = (biomeId: BiomeId): GatheringZoneDefinition[] =>
  Object.values(gatheringZones).filter((zone) => zone.biomeId === biomeId);
