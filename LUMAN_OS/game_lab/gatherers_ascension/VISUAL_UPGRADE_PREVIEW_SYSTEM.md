# Gatherer's Ascension Visual Upgrade Preview System

## Locked Design Requirement

No major visible armor, tool, backpack, accessory, field-rig, or automated-gatherer upgrade may be presented as text only.

Any upgrade that changes appearance must include artwork and a visual comparison before the player spends resources.

## Current Playable Implementation

The Upgrades command screen now includes:

- Procedural item artwork for every current gathering tool
- Procedural item artwork for every current visible player gear system
- Visual field-rig artwork for every recruited automated gatherer
- Current and next upgrade images shown side by side
- Current and previewed full character models
- Split-view comparison mode
- Single-model preview mode
- Hover, focus, and click preview selection
- Apply-preview and revert-preview controls
- Confirm-to-purchase controls
- Changed equipment-region highlighting
- Rarity-colored borders, cores, labels, and energy treatment
- Current and next visual-form labels
- Stat-delta comparisons
- Passive-effect and material-style descriptions
- Responsive desktop and mobile layouts

## Current Visual Slot Mapping

The existing game state uses grouped equipment systems. The preview maps them visually as follows:

- Field Kit: headgear, chest armor, leg protection, and utility harness
- Relic Ward: gloves, bracers, relic core, and shielding
- Trail Boots: boots and movement hardware
- Worldpack: backpack, scanner mount, utility modules, and power cell
- Tool paths: Worldroot Axe, Veinbreaker Pick, Dawn Sickle, and Relic Gloves
- Gatherer loadouts: automated field rig, scanner modules, protection, limbs, and extraction systems

Future individual equipment slots must follow the same visual-preview law.

## Visual Progression Tiers

1. Field Form / Common
2. Reinforced Form / Uncommon
3. Awakened Form / Rare
4. Mythic Form / Epic
5. Ascendant Form / Legendary

Each tier changes color treatment, glow, visible modules, armor detail, core size, reinforcement, and nature-tech complexity.

## Interaction Law

The player must be able to:

1. Select or hover over an upgrade
2. See the current item artwork
3. See the next item artwork
4. Apply the next appearance to the full model
5. Identify the changed body or equipment region
6. Compare stat and passive changes
7. Revert the preview without spending
8. Confirm the upgrade only after inspection

## Future Asset Upgrade

The procedural SVG artwork is the playable visual foundation. It can later be replaced by hand-painted renders, layered sprite atlases, commissioned character equipment, 3D turntables, or animated item cards without changing the preview-system architecture.
