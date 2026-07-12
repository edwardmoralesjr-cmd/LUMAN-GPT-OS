# Gatherer's Ascension Changelog

## 2026-07-12: Ascendant Visual Overhaul v1

### Added

- Premium procedural 2.5D rendering while preserving the Phaser, TypeScript, Vite, and GitHub Pages architecture
- Four biome-specific visual identities with unique palettes, terrain, distant landmarks, paths, haze, shadows, and atmospheric particles
- Animated spores, dust, crystal motes, and Emberdeep ash
- Redesigned gatherable nodes with recognizable silhouettes for wood, plants, dew, stone, ore, crystal, relic, and unidentified Mythic materials
- Material-quality effects including stronger outlines, auras, orbiting sparks, pulses, scale changes, and enhanced labels
- Detailed layered gatherer avatar with cloak, hood, rune core, Worldpack detail, animated shadow, idle motion, movement trails, and level-based visual evolution
- Redesigned orbiting tool emblems with distinct axe, pickaxe, sickle, and relic-glove forms
- Destination pulse feedback for tap-to-move controls
- Harvest shockwaves, particle bursts, floating reward text, camera impact, Mythic flashes, and discovery zoom effects
- Premium world-title plate and biome transitions
- High-end dark fantasy interface shell with improved glass panels, ornamental framing, animated progress bars, refined cards, stronger hierarchy, and responsive mobile presentation
- Enhanced Collection Codex cards, unidentified silhouettes, Mythic sheen, quality chips, and full-screen discovery reveals
- Reduced-motion CSS support for interface animations

### Changed

- World dimensions increased to 1800 x 1120 for richer exploration framing
- Phaser renderer now requests high-performance graphics with antialiasing and multiple touch pointers
- Gathering rings now use layered animated visual channels
- Resource presentation now communicates material family, quality, rarity, and Mythic state before reading labels
- Tool progression is more visually distinct at Reinforced, Awakened, Mythic, and Ascendant tiers
- The interface identity has advanced from prototype styling to the Worldroot Ascendant visual baseline

### Validation

- TypeScript validation passed
- Vite production build passed
- 58 application modules transformed successfully
- Production HTML, CSS, and JavaScript generated successfully
- Existing GitHub Pages deployment workflow remains compatible and automatically rebuilds when game files change

### Current Limitations

- Visuals are high-detail procedural artwork rather than final hand-painted sprite atlases or commissioned illustrations
- Automated browser screenshot verification could not run in the sandbox because Chromium could not initialize WebGL
- Audio, music, haptic feedback, advanced weather, and accessibility controls for camera shake and flashes remain future work

## 2026-07-12: Collection Loop v1

### Added

- Ten hidden Mythic material variants, one for every current base material
- Unknown silhouettes and unidentified world labels before first discovery
- Permanent Collection Codex with full revealed records
- Lore, properties, potential uses, rarity, and native-biome data
- Five visible material-quality tiers
- Quality-based XP, yield, and market-value multipliers
- Critical Harvest, Bountiful Cluster, Echo Harvest, Rare Mutation, and Discovery Resonance events
- Fair discovery-momentum system to soften long rare-find dry streaks
- Codex rewards at 5, 10, 15, and 20 discoveries
- Full-screen discovery reveal sequence
- Avatar visual evolution based on character level
- Orbiting tool emblems with visible evolution forms
- Mythic and elevated-quality world effects

### Changed

- Save schema upgraded from version 2 to version 3
- Inventory now supports distinct quality specimens
- Market values now account for specimen quality
- Status panel now tracks critical harvests, surprise events, Mythic variants, perfected specimens, and discovery momentum
- Biome panel now shows Mythic collection progress by region

### Validation

- TypeScript validation passed
- Vite production build passed
- 58 application modules transformed successfully

### Known Limitations

- Audio and haptic feedback are not yet implemented
- Cloud saving still requires external Supabase configuration
