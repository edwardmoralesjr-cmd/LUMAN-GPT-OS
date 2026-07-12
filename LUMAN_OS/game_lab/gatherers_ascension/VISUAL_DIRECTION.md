# Gatherer's Ascension Visual Direction

## Locked Visual Identity

Gatherer's Ascension uses a premium stylized mystical-fantasy 2.5D presentation built within Phaser, TypeScript, Vite, and GitHub Pages.

The goal is not photorealism. The goal is a luxurious, readable, atmospheric world where gathering materials, avatar growth, tool evolution, and rare discoveries are immediately recognizable and visually rewarding.

## Visual Pillars

### Living Gathering Grounds

Every biome must feel active even when the player is standing still. Atmosphere should come from layered terrain, distant landmarks, haze, ambient particles, subtle movement, changing light, resource animation, and strong biome-specific color identity.

### Materials as Treasure

Every gatherable resource must have a recognizable silhouette and visual hierarchy. Players should be able to distinguish ordinary resources, elevated quality specimens, and Mythic variants before reading text.

### Visible Progression

Avatar levels, tool levels, material quality, Codex completion, and rare discoveries must create visible changes. Progress should not exist only as numbers.

### Reward Without Visual Clutter

Effects should become more dramatic as reward importance rises:

```text
Normal harvest
< Critical harvest
< Elevated-quality specimen
< Surprise event
< New Codex discovery
< Mythic variant discovery
< Collection milestone
```

Mythic events may briefly dominate the screen. Ordinary harvests should remain quick and readable.

## Biome Identities

### Greenveil Meadow

- Deep living greens
- Warm gold highlights
- Ancient trees and soft paths
- Floating spores and pollen
- Peaceful, fertile, and quietly magical

### Ironfall Basin

- Charcoal rock and oxidized earth
- Copper, rust, and furnace-orange accents
- Ridges, scars, ore fractures, and mineral dust
- Heavy, industrial, and enduring

### Crystal Vale

- Midnight blue and bruised violet
- Cyan and white refraction
- Crystal towers, reflective pools, and luminous mist
- Dreamlike, cold, and celestial

### Emberdeep Archive

- Blackened crimson and volcanic brown
- Ember orange and antique gold
- Ruins, sealed towers, ash, heat fractures, and buried memory
- Dangerous, sacred, and ancient

## Resource Presentation

Resources should use:

- Unique material-family silhouettes
- Ground shadows
- Inner detail lines
- Rarity outlines
- Quality-based aura intensity
- Slow bobbing and breathing motion
- Orbiting particles for elevated specimens
- Strong silhouette concealment before Mythic discovery

Quality hierarchy:

```text
Standard: readable silhouette and restrained outline
Fine: stronger color and mild glow
Perfected: animated aura and visible sparks
Ancient: prestige outline, expanded pulse, and arcane detail
Enchanted: strongest non-Mythic animation and energy signature
Mythic: unique silhouette, dedicated aura, dramatic reveal, and permanent Codex identity
```

## Avatar Direction

The gatherer should feel like a field explorer becoming a legendary collector.

Current procedural representation includes:

- Hooded silhouette
- Layered cloak
- Rune core
- Worldpack detail
- Ground shadow
- Idle motion
- Movement trails
- Level-based aura progression

Future hand-authored art should preserve this silhouette and expand it into modular clothing, hairstyles, skin tones, cloaks, packs, charms, masks, and prestige effects.

## Tool Direction

Tools must remain recognizable at a glance and visibly change at progression milestones.

Forms:

1. Field Form
2. Reinforced Form
3. Awakened Form
4. Mythic Form
5. Ascendant Form

Each form should add shape detail, material contrast, rune work, light effects, motion, and prestige without making the tool difficult to identify.

## Interface Direction

The interface should feel like a fusion of:

- Field journal
- Mystical collection archive
- Premium dark-fantasy instrument panel

It must remain readable, responsive, and calm. Glass effects, fine borders, restrained gold, living green, and rarity-specific accents should support the world rather than overpower it.

## Performance Law

High-end presentation must remain practical for browser deployment.

Priorities:

- Reuse procedural geometry and pooled effects where possible
- Avoid unlimited particle accumulation
- Keep ordinary nodes inexpensive
- Reserve heavier effects for meaningful discoveries
- Support desktop and mobile layouts
- Add future quality presets for Low, Balanced, High, and Ascendant
- Preserve reduced-motion support

## Accessibility Frontier

The next accessibility pass should add controls for:

- Camera shake
- Screen flashes
- Particle density
- Ambient animation
- High-contrast labels
- Reduced motion
- Performance quality

## Future Art Ceiling

The current procedural 2.5D system is the premium browser-native baseline. The next major visual ceiling can be raised without changing engines by adding:

- Hand-painted biome tiles and landmark plates
- Professionally illustrated resource sprites
- Modular avatar sprite layers
- Animated tool sprite sheets
- Normal-map-style lighting textures
- Custom WebGL shaders
- Weather overlays
- Cinematic discovery illustrations
- Original sound and music signatures

## Recommended Next Move

```text
Playtest the Ascendant Visual Overhaul, identify the three most important art targets, then replace those procedural elements with hand-authored assets while preserving the current effects and progression systems.
```
