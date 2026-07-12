# Gatherer's Ascension Game Design

## Core Design Law

Gatherer's Ascension must be difficult to put down because gathering is consistently enjoyable, fair, generous, and full of meaningful discovery. It must never depend on real-money gambling, loot boxes, pay-to-win systems, artificial scarcity, energy purchases, or pressure to spend money.

## Primary Collection Loop

```text
Gather resources
-> Discover elevated qualities and hidden rare variants
-> Complete Collection Codex entries
-> Gain avatar experience and permanent stats
-> Upgrade and visually evolve tools
-> Unlock new regions
-> Reach more valuable and mysterious material families
-> Repeat with deeper mastery and stronger discovery potential
```

Every gathering action should advance at least one form of progress: inventory, experience, mastery, coins, Codex completion, collection milestones, discovery momentum, tool evolution, region access, or cosmetic prestige.

## Hidden Rare Variant System

Every base material has one native Mythic variant.

Rules:

1. Mythic variants only appear in a biome where their base material naturally occurs.
2. A variant is completely unidentified before its first successful harvest.
3. Before discovery, the world displays a dark silhouette, unusual glow, and `Unidentified Material` label.
4. The Collection Codex displays a hidden variant silhouette without revealing its real name, final appearance, lore, properties, or uses.
5. The first harvest triggers a dedicated reveal sequence.
6. After discovery, the complete Codex entry remains permanently unlocked.
7. Future appearances use the variant's true name, color, glow, and visual identity.
8. Rare chance is influenced by Fortune, Perception, temporary boosts, and fair discovery momentum.
9. Discovery momentum rises after normal harvests and resets after a Mythic variant, reducing the chance of extreme dry streaks without making rare finds predictable.

## Initial Mythic Variant Families

| Base Material | Hidden Variant | Native Region |
|---|---|---|
| Worldwood | Heartwood Crown | Greenveil Meadow |
| Silkgrass | Starwoven Silk | Greenveil Meadow |
| Dawn Herb | Firstlight Bloom | Greenveil Meadow |
| Graystone | Echoheart Stone | Greenveil Meadow |
| Ironvein Ore | Kingsblood Iron | Ironfall Basin |
| Ancient Bark | Elderheart Bark | Ironfall Basin |
| Lumen Crystal | Celestial Lumen | Crystal Vale |
| Moon Dew | Eclipse Dew | Crystal Vale |
| Buried Relic | The Crownless Idol | Emberdeep Archive |
| Emberglass | Phoenixglass | Emberdeep Archive |

## Material Quality Progression

Every material may appear in five visible quality tiers:

1. Standard
2. Fine
3. Perfected
4. Ancient
5. Enchanted

Elevated qualities use increasingly distinctive colors, glow strength, node scale, pulse behavior, harvest text, value multipliers, XP multipliers, and yield bonuses. Quality discoveries are recorded independently for each material in the Codex.

## Surprise Reward Events

Gathering can produce fair, non-monetized surprise events:

- Critical Harvest: extra yield based on Fortune and Perception
- Bountiful Cluster: the node opens into several connected resources
- Echo Harvest: the gathered yield repeats and doubles
- Rare Mutation: a familiar material transforms into its Mythic variant during harvest
- Discovery Resonance: a temporary boost to Mythic and elevated-quality chances
- Collection Milestone: permanent rewards for reaching Codex thresholds

Surprises should be exciting but not required to make normal gathering worthwhile.

## Collection Codex

Each revealed entry records:

- Name
- Appearance and visual color identity
- Rarity
- Native biome
- Lore
- Unique properties
- Potential uses
- Discovered quality tiers
- Base-material and Mythic-variant relationship

Collection milestones occur at 5, 10, 15, and 20 discoveries. Initial rewards include coins, one permanent stat point, and a temporary discovery boost.

## Avatar Progression

The avatar advances through:

- Character level and experience
- Permanent gathering stats
- Tool mastery levels
- Gear Level
- Codex completion
- Biome access
- Collection milestones
- Cosmetic and aura progression

The current prototype changes the avatar's core color, stroke, glow, and gathering ring as level tiers increase.

## Tool Evolution

Each tool has mechanical and visible forms:

1. Field Form
2. Reinforced Form
3. Awakened Form
4. Mythic Form
5. Ascendant Form

Tool levels improve yield. Every fourth level changes the visible form. The prototype represents each equipped tool as an orbiting emblem around the avatar whose size, outline, and presence evolve with tool level.

Future tool evolution should allow rare-material infusion, branching traits, named forms, custom effects, and prestige cosmetics without invalidating earlier progress.

## Reward Ethics

The game must not include:

- Real-money gambling
- Purchasable loot boxes
- Pay-to-win boosts
- Paid energy or gathering attempts
- Artificially punishing inventory restrictions
- Fear-of-missing-out pressure designed around spending
- Hidden odds that affect purchases
- Progress resets intended to sell recovery

Random rewards exist only to add discovery, surprise, and variety. Normal play must always remain valuable.

## Fairness Principles

- Normal resources remain useful throughout progression.
- Every harvest produces measurable advancement.
- Rare finds are bonuses, not mandatory gates for basic progression.
- Long dry streaks are softened through discovery momentum.
- Collection rewards are permanent and clearly communicated.
- Players can stop and return without losing progress or being punished.
- Autosaving protects time and effort.

## Current Implementation Status

Implemented in Collection Loop v1:

- Ten hidden Mythic variants
- Unknown world silhouettes before discovery
- Permanent Codex reveals
- Full lore, property, use, rarity, and native-biome records
- Five material quality tiers
- Critical, cluster, echo, mutation, and resonance events
- Discovery momentum
- Four Codex milestones
- Avatar visual level tiers
- Visible tool-form progression
- Quality-aware inventory values
- IndexedDB save migration to version 3

## Recommended Next Move

Add sound design, particle signatures, animated resource silhouettes, collection-set rewards, and rare-material tool infusion.
