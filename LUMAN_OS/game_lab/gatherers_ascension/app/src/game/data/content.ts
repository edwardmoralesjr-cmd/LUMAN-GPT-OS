export type ToolId = 'axe' | 'pickaxe' | 'sickle' | 'gloves';
export type StatId = 'power' | 'precision' | 'perception' | 'endurance' | 'knowledge' | 'fortune';
export type BiomeId = 'greenveil' | 'ironfall' | 'crystal-vale' | 'emberdeep';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type HarvestQuality = 'Standard' | 'Fine' | 'Perfected' | 'Ancient' | 'Enchanted';

export interface ResourceDefinition {
  id: string;
  name: string;
  tool: ToolId;
  rarity: Rarity;
  xp: number;
  skillXp: number;
  value: number;
  color: number;
  glow: number;
  radius: number;
  nativeBiome: BiomeId;
  lore: string;
  properties: string;
  uses: string;
  isVariant?: boolean;
  baseId?: string;
  spawnChance?: number;
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

export interface QualityDefinition {
  name: HarvestQuality;
  rank: number;
  valueMultiplier: number;
  xpMultiplier: number;
  yieldBonus: number;
  color: string;
  glow: number;
  description: string;
}

export const resources: Record<string, ResourceDefinition> = {
  wood: {
    id: 'wood', name: 'Worldwood', tool: 'axe', rarity: 'Common', xp: 12, skillXp: 10, value: 3,
    color: 0x7d5b3f, glow: 0xb98b61, radius: 13, nativeBiome: 'greenveil',
    lore: 'Young Worldwood carries the memory of every season in its grain.',
    properties: 'Flexible, dependable, and unusually receptive to tool enchantment.',
    uses: 'Basic tool handles, field gear, shelters, and early upgrades.',
  },
  fiber: {
    id: 'fiber', name: 'Silkgrass', tool: 'sickle', rarity: 'Common', xp: 10, skillXp: 9, value: 2,
    color: 0x7cab66, glow: 0xb7e49a, radius: 9, nativeBiome: 'greenveil',
    lore: 'A meadow fiber that knots itself tighter when exposed to moonlight.',
    properties: 'Lightweight, strong, and naturally weather resistant.',
    uses: 'Worldpack stitching, bindings, clothing, and gathering nets.',
  },
  herb: {
    id: 'herb', name: 'Dawn Herb', tool: 'sickle', rarity: 'Uncommon', xp: 18, skillXp: 14, value: 6,
    color: 0x56b783, glow: 0x92f0b7, radius: 10, nativeBiome: 'greenveil',
    lore: 'Its leaves open only during the first quiet minutes of morning.',
    properties: 'Restorative aroma and a faint sensitivity to hidden resources.',
    uses: 'Field tonics, temporary boosts, dyes, and alchemical infusions.',
  },
  stone: {
    id: 'stone', name: 'Graystone', tool: 'pickaxe', rarity: 'Common', xp: 14, skillXp: 11, value: 4,
    color: 0x7c8583, glow: 0xc2cecb, radius: 12, nativeBiome: 'greenveil',
    lore: 'Ordinary at first glance, Graystone records every impact made against it.',
    properties: 'Dense, stable, and ideal for reinforcing equipment.',
    uses: 'Tool heads, foundations, protective plating, and market trade.',
  },
  ore: {
    id: 'ore', name: 'Ironvein Ore', tool: 'pickaxe', rarity: 'Uncommon', xp: 24, skillXp: 18, value: 9,
    color: 0x805f4d, glow: 0xdb9471, radius: 12, nativeBiome: 'ironfall',
    lore: 'Ironfall miners say the red veins are the basin remembering old fire.',
    properties: 'High tensile strength and excellent resonance under repeated use.',
    uses: 'Advanced tools, armor fittings, region keys, and durable upgrades.',
  },
  ancientBark: {
    id: 'ancientBark', name: 'Ancient Bark', tool: 'axe', rarity: 'Rare', xp: 34, skillXp: 25, value: 16,
    color: 0x4d6e52, glow: 0xc8e0a3, radius: 14, nativeBiome: 'ironfall',
    lore: 'Bark shed from trees that survived the first mineral storms of Ironfall.',
    properties: 'Slowly repairs hairline fractures in anything it is bonded to.',
    uses: 'Self-mending handles, relic cases, wards, and prestige cosmetics.',
  },
  crystal: {
    id: 'crystal', name: 'Lumen Crystal', tool: 'pickaxe', rarity: 'Rare', xp: 42, skillXp: 32, value: 23,
    color: 0x6e77c7, glow: 0xc7c5ff, radius: 11, nativeBiome: 'crystal-vale',
    lore: 'A condensed memory of light trapped beneath the vale.',
    properties: 'Stores energy, amplifies perception, and reacts to nearby discoveries.',
    uses: 'Tool cores, navigation lights, Codex lenses, and high-tier enhancements.',
  },
  moonDew: {
    id: 'moonDew', name: 'Moon Dew', tool: 'sickle', rarity: 'Epic', xp: 58, skillXp: 42, value: 34,
    color: 0x6ca8b7, glow: 0xcaf6ff, radius: 9, nativeBiome: 'crystal-vale',
    lore: 'Droplets gathered from flowers that bloom beneath reflected starlight.',
    properties: 'Temporarily sharpens fortune and reveals faint resource mutations.',
    uses: 'Gathering elixirs, visual infusions, rare dyes, and precision upgrades.',
  },
  relic: {
    id: 'relic', name: 'Buried Relic', tool: 'gloves', rarity: 'Epic', xp: 72, skillXp: 50, value: 48,
    color: 0xb69a55, glow: 0xffe2a0, radius: 11, nativeBiome: 'emberdeep',
    lore: 'A fragment from a civilization that measured wealth through remembrance.',
    properties: 'Carries dormant inscriptions that awaken near completed collections.',
    uses: 'Codex expansion, ancient gear, cosmetic relics, and archive access.',
  },
  emberglass: {
    id: 'emberglass', name: 'Emberglass', tool: 'pickaxe', rarity: 'Legendary', xp: 110, skillXp: 78, value: 80,
    color: 0xb94736, glow: 0xffa16f, radius: 12, nativeBiome: 'emberdeep',
    lore: 'Glass formed where impossible heat met a sealed underground sea.',
    properties: 'Holds heat without burning and strengthens under controlled impact.',
    uses: 'Legendary tool edges, radiant cosmetics, deep-region keys, and masterwork gear.',
  },
};

export const rareVariants: Record<string, ResourceDefinition> = {
  heartwoodCrown: {
    id: 'heartwoodCrown', baseId: 'wood', isVariant: true, spawnChance: 0.006,
    name: 'Heartwood Crown', tool: 'axe', rarity: 'Mythic', xp: 180, skillXp: 125, value: 220,
    color: 0xd7a64a, glow: 0xffe9a3, radius: 16, nativeBiome: 'greenveil',
    lore: 'A living knot said to form only when an ancient tree chooses to remember the gatherer who found it.',
    properties: 'Greatly improves tool durability and causes nearby wood nodes to resonate.',
    uses: 'Mythic axe infusion, golden bark cosmetics, and Heartwood collection milestones.',
  },
  starwovenSilk: {
    id: 'starwovenSilk', baseId: 'fiber', isVariant: true, spawnChance: 0.0075,
    name: 'Starwoven Silk', tool: 'sickle', rarity: 'Mythic', xp: 160, skillXp: 112, value: 190,
    color: 0x8fd7ff, glow: 0xe7f8ff, radius: 11, nativeBiome: 'greenveil',
    lore: 'Silkgrass that braided itself around a fallen star before dawn could erase it.',
    properties: 'Nearly weightless and capable of holding enchantments without decay.',
    uses: 'Mythic Worldpack lining, celestial garments, and gathering-radius infusions.',
  },
  firstlightBloom: {
    id: 'firstlightBloom', baseId: 'herb', isVariant: true, spawnChance: 0.0055,
    name: 'Firstlight Bloom', tool: 'sickle', rarity: 'Mythic', xp: 210, skillXp: 138, value: 250,
    color: 0xffc86b, glow: 0xffffc5, radius: 12, nativeBiome: 'greenveil',
    lore: 'A Dawn Herb that captured the very first ray of a season and refused to release it.',
    properties: 'Creates a powerful but temporary surge in discovery chance.',
    uses: 'Fortune tonics, luminous cosmetics, and rare-resource mutation rituals.',
  },
  echoheartStone: {
    id: 'echoheartStone', baseId: 'stone', isVariant: true, spawnChance: 0.005,
    name: 'Echoheart Stone', tool: 'pickaxe', rarity: 'Mythic', xp: 205, skillXp: 142, value: 240,
    color: 0x303a4d, glow: 0x9ec8ff, radius: 15, nativeBiome: 'greenveil',
    lore: 'A stone whose center repeats the sound of the first tool that ever struck it.',
    properties: 'Stores impact energy and releases it during critical harvests.',
    uses: 'Critical-yield upgrades, resonant tool heads, and echoing cosmetic effects.',
  },
  kingsbloodIron: {
    id: 'kingsbloodIron', baseId: 'ore', isVariant: true, spawnChance: 0.0045,
    name: 'Kingsblood Iron', tool: 'pickaxe', rarity: 'Mythic', xp: 260, skillXp: 175, value: 330,
    color: 0x6f1720, glow: 0xff6a63, radius: 15, nativeBiome: 'ironfall',
    lore: 'A crimson ore vein once reserved for tools carried by the basin wardens.',
    properties: 'Becomes stronger after every successful harvest instead of wearing down.',
    uses: 'Prestige pickaxes, crimson armor details, and permanent power enhancements.',
  },
  elderheartBark: {
    id: 'elderheartBark', baseId: 'ancientBark', isVariant: true, spawnChance: 0.0038,
    name: 'Elderheart Bark', tool: 'axe', rarity: 'Mythic', xp: 310, skillXp: 205, value: 390,
    color: 0x1f563b, glow: 0x9dffb8, radius: 17, nativeBiome: 'ironfall',
    lore: 'A single layer of bark that continued growing after leaving its tree.',
    properties: 'Regenerates damaged tool components and strengthens collection bonuses.',
    uses: 'Living tool forms, restorative wards, and ancient forest cosmetics.',
  },
  celestialLumen: {
    id: 'celestialLumen', baseId: 'crystal', isVariant: true, spawnChance: 0.0032,
    name: 'Celestial Lumen', tool: 'pickaxe', rarity: 'Mythic', xp: 380, skillXp: 250, value: 520,
    color: 0x826dff, glow: 0xffffff, radius: 14, nativeBiome: 'crystal-vale',
    lore: 'A crystal that contains a moving night sky no astronomer can identify.',
    properties: 'Greatly magnifies perception and reveals distant unidentified nodes.',
    uses: 'Mythic Codex lenses, starfield tool cores, and celestial avatar effects.',
  },
  eclipseDew: {
    id: 'eclipseDew', baseId: 'moonDew', isVariant: true, spawnChance: 0.0028,
    name: 'Eclipse Dew', tool: 'sickle', rarity: 'Mythic', xp: 440, skillXp: 285, value: 610,
    color: 0x392c72, glow: 0xffd0ff, radius: 12, nativeBiome: 'crystal-vale',
    lore: 'A droplet formed during an eclipse that never appeared in the sky above the vale.',
    properties: 'Temporarily bends fortune and increases the chance of chained surprise events.',
    uses: 'Eclipse infusions, shadow-light cosmetics, and high-tier boost recipes.',
  },
  crownlessIdol: {
    id: 'crownlessIdol', baseId: 'relic', isVariant: true, spawnChance: 0.0024,
    name: 'The Crownless Idol', tool: 'gloves', rarity: 'Mythic', xp: 520, skillXp: 340, value: 760,
    color: 0x26211a, glow: 0xffd67c, radius: 14, nativeBiome: 'emberdeep',
    lore: 'A small figure whose missing crown appears only in its shadow.',
    properties: 'Unlocks sealed Codex commentary and increases collection milestone rewards.',
    uses: 'Archive keys, relic cosmetics, lore chambers, and master collection upgrades.',
  },
  phoenixglass: {
    id: 'phoenixglass', baseId: 'emberglass', isVariant: true, spawnChance: 0.0018,
    name: 'Phoenixglass', tool: 'pickaxe', rarity: 'Mythic', xp: 700, skillXp: 455, value: 1100,
    color: 0xff5a2f, glow: 0xffffb0, radius: 16, nativeBiome: 'emberdeep',
    lore: 'A shard that cools into ash and reforms every time it is removed from the earth.',
    properties: 'Allows a tool to evolve into its final radiant form and survive any heat.',
    uses: 'Final tool evolution, phoenix avatar aura, and the Emberdeep master collection.',
  },
};

export const allResources: Record<string, ResourceDefinition> = { ...resources, ...rareVariants };

export const variantByBase: Record<string, string> = Object.fromEntries(
  Object.values(rareVariants).map((variant) => [variant.baseId as string, variant.id]),
);

export const qualityDefinitions: Record<HarvestQuality, QualityDefinition> = {
  Standard: { name: 'Standard', rank: 0, valueMultiplier: 1, xpMultiplier: 1, yieldBonus: 0, color: '#e7f5e8', glow: 0xbdd8c3, description: 'A dependable natural specimen.' },
  Fine: { name: 'Fine', rank: 1, valueMultiplier: 1.5, xpMultiplier: 1.15, yieldBonus: 0, color: '#8ee3b2', glow: 0x8ee3b2, description: 'Cleaner, stronger, and more valuable than average.' },
  Perfected: { name: 'Perfected', rank: 2, valueMultiplier: 3, xpMultiplier: 1.4, yieldBonus: 1, color: '#7dc8ff', glow: 0x7dc8ff, description: 'An unusually flawless expression of the material.' },
  Ancient: { name: 'Ancient', rank: 3, valueMultiplier: 6, xpMultiplier: 1.8, yieldBonus: 2, color: '#d59cff', glow: 0xd59cff, description: 'A specimen shaped by time, memory, and deep pressure.' },
  Enchanted: { name: 'Enchanted', rank: 4, valueMultiplier: 12, xpMultiplier: 2.5, yieldBonus: 3, color: '#ffe38d', glow: 0xffe38d, description: 'A visibly awakened material carrying active energy.' },
};

export const biomes: Record<BiomeId, BiomeDefinition> = {
  greenveil: {
    id: 'greenveil', name: 'Greenveil Meadow', subtitle: 'Soft earth, old trees, and the first roots of mastery',
    levelRequired: 1, gearRequired: 0, background: 0x112a20, fog: 0x355948,
    resources: ['wood', 'fiber', 'herb', 'stone'], nodeCount: 28,
  },
  ironfall: {
    id: 'ironfall', name: 'Ironfall Basin', subtitle: 'Stone ridges split by mineral-rich scars',
    levelRequired: 5, gearRequired: 4, background: 0x252622, fog: 0x5a5044,
    resources: ['stone', 'ore', 'wood', 'ancientBark'], nodeCount: 31,
  },
  'crystal-vale': {
    id: 'crystal-vale', name: 'Crystal Vale', subtitle: 'A moonlit valley where the ground remembers light',
    levelRequired: 12, gearRequired: 10, background: 0x151b35, fog: 0x363b69,
    resources: ['crystal', 'moonDew', 'ancientBark', 'ore'], nodeCount: 34,
  },
  emberdeep: {
    id: 'emberdeep', name: 'Emberdeep Archive', subtitle: 'Buried heat, broken vaults, and relics that refuse silence',
    levelRequired: 22, gearRequired: 18, background: 0x2a1514, fog: 0x6d3129,
    resources: ['relic', 'emberglass', 'crystal', 'ore'], nodeCount: 36,
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

export function inventoryKey(resourceId: string, quality: HarvestQuality): string {
  return quality === 'Standard' ? resourceId : `${resourceId}::${quality.toLowerCase()}`;
}

export function parseInventoryKey(key: string): { resourceId: string; quality: HarvestQuality } {
  const [resourceId = key, rawQuality] = key.split('::');
  const quality = rawQuality
    ? (Object.keys(qualityDefinitions).find((entry) => entry.toLowerCase() === rawQuality) as HarvestQuality | undefined)
    : 'Standard';
  return { resourceId, quality: quality ?? 'Standard' };
}

export function toolForm(level: number): string {
  if (level >= 16) return 'Ascendant Form';
  if (level >= 11) return 'Mythic Form';
  if (level >= 7) return 'Awakened Form';
  if (level >= 4) return 'Reinforced Form';
  return 'Field Form';
}
