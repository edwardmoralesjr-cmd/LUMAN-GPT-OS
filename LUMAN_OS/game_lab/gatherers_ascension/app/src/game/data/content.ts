export type ToolId = 'axe' | 'pickaxe' | 'sickle' | 'gloves';
export type StatId = 'power' | 'precision' | 'perception' | 'endurance' | 'knowledge' | 'fortune';
export type BiomeId = 'greenveil' | 'ironfall' | 'crystal-vale' | 'emberdeep';

export interface ResourceDefinition {
  id: string;
  name: string;
  tool: ToolId;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  xp: number;
  skillXp: number;
  value: number;
  color: number;
  glow: number;
  radius: number;
}

export interface BiomeDefinition {
  id: BiomeId;
  name: string;
  subtitle: string;
  levelRequired: number;
  gearRequired: number;
  background: number;
  fog: number;
  resources: string[];
  nodeCount: number;
}

export const resources: Record<string, ResourceDefinition> = {
  wood: { id: 'wood', name: 'Worldwood', tool: 'axe', rarity: 'Common', xp: 12, skillXp: 10, value: 3, color: 0x7d5b3f, glow: 0xb98b61, radius: 13 },
  fiber: { id: 'fiber', name: 'Silkgrass', tool: 'sickle', rarity: 'Common', xp: 10, skillXp: 9, value: 2, color: 0x7cab66, glow: 0xb7e49a, radius: 9 },
  herb: { id: 'herb', name: 'Dawn Herb', tool: 'sickle', rarity: 'Uncommon', xp: 18, skillXp: 14, value: 6, color: 0x56b783, glow: 0x92f0b7, radius: 10 },
  stone: { id: 'stone', name: 'Graystone', tool: 'pickaxe', rarity: 'Common', xp: 14, skillXp: 11, value: 4, color: 0x7c8583, glow: 0xc2cecb, radius: 12 },
  ore: { id: 'ore', name: 'Ironvein Ore', tool: 'pickaxe', rarity: 'Uncommon', xp: 24, skillXp: 18, value: 9, color: 0x805f4d, glow: 0xdb9471, radius: 12 },
  ancientBark: { id: 'ancientBark', name: 'Ancient Bark', tool: 'axe', rarity: 'Rare', xp: 34, skillXp: 25, value: 16, color: 0x4d6e52, glow: 0xc8e0a3, radius: 14 },
  crystal: { id: 'crystal', name: 'Lumen Crystal', tool: 'pickaxe', rarity: 'Rare', xp: 42, skillXp: 32, value: 23, color: 0x6e77c7, glow: 0xc7c5ff, radius: 11 },
  moonDew: { id: 'moonDew', name: 'Moon Dew', tool: 'sickle', rarity: 'Epic', xp: 58, skillXp: 42, value: 34, color: 0x6ca8b7, glow: 0xcaf6ff, radius: 9 },
  relic: { id: 'relic', name: 'Buried Relic', tool: 'gloves', rarity: 'Epic', xp: 72, skillXp: 50, value: 48, color: 0xb69a55, glow: 0xffe2a0, radius: 11 },
  emberglass: { id: 'emberglass', name: 'Emberglass', tool: 'pickaxe', rarity: 'Legendary', xp: 110, skillXp: 78, value: 80, color: 0xb94736, glow: 0xffa16f, radius: 12 },
};

export const biomes: Record<BiomeId, BiomeDefinition> = {
  greenveil: {
    id: 'greenveil',
    name: 'Greenveil Meadow',
    subtitle: 'Soft earth, old trees, and the first roots of mastery',
    levelRequired: 1,
    gearRequired: 0,
    background: 0x112a20,
    fog: 0x355948,
    resources: ['wood', 'fiber', 'herb', 'stone'],
    nodeCount: 28,
  },
  ironfall: {
    id: 'ironfall',
    name: 'Ironfall Basin',
    subtitle: 'Stone ridges split by mineral-rich scars',
    levelRequired: 5,
    gearRequired: 4,
    background: 0x252622,
    fog: 0x5a5044,
    resources: ['stone', 'ore', 'wood', 'ancientBark'],
    nodeCount: 31,
  },
  'crystal-vale': {
    id: 'crystal-vale',
    name: 'Crystal Vale',
    subtitle: 'A moonlit valley where the ground remembers light',
    levelRequired: 12,
    gearRequired: 10,
    background: 0x151b35,
    fog: 0x363b69,
    resources: ['crystal', 'moonDew', 'ancientBark', 'ore'],
    nodeCount: 34,
  },
  emberdeep: {
    id: 'emberdeep',
    name: 'Emberdeep Archive',
    subtitle: 'Buried heat, broken vaults, and relics that refuse silence',
    levelRequired: 22,
    gearRequired: 18,
    background: 0x2a1514,
    fog: 0x6d3129,
    resources: ['relic', 'emberglass', 'crystal', 'ore'],
    nodeCount: 36,
  },
};

export const toolNames: Record<ToolId, string> = {
  axe: 'Worldroot Axe',
  pickaxe: 'Veinbreaker Pick',
  sickle: 'Dawn Sickle',
  gloves: 'Relic Gloves',
};

export const statNames: Record<StatId, string> = {
  power: 'Power',
  precision: 'Precision',
  perception: 'Perception',
  endurance: 'Endurance',
  knowledge: 'Knowledge',
  fortune: 'Fortune',
};
