# Gatherer's Ascension Changelog

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

- Resources and tools still use procedural shapes rather than final artwork
- Audio and haptic feedback are not yet implemented
- Cloud saving still requires external Supabase configuration
