# Gatherer's Ascension Project Home

## Project Identity

**Working Title:** Gatherer's Ascension  
**Project Type:** Visual browser gathering RPG  
**LUMAN Domain:** Game Lab  
**State:** Incubating  
**Owner:** Edward Morales Jr.  
**Primary Purpose:** Build a peaceful but deeply rewarding progression game where gathering is the central activity.

## Core Promise

Everything the player gathers creates visible progress.

The primary loop is:

```text
Explore -> Gather -> Gain Experience -> Improve Stats -> Upgrade Gear -> Unlock New Areas -> Gather Rarer Resources
```

Combat is not the main purpose. Environmental danger, weather, terrain, exhaustion, and wildlife may add tension, but they must support the gathering loop rather than replace it.

## Recovered Foundation

The earlier HTML concept established several important features:

- Visual player movement
- Automatic harvesting near resource nodes
- Gathering levels and experience
- Tool and equipment upgrades
- Markets for selling gathered materials
- Gear-level biome requirements
- New regions with rarer resources
- Desktop and touch controls
- Automatic local saving

This recovered foundation guides the current rebuild unless Edward explicitly changes it.

## Current Technical Architecture

```text
Engine: Phaser
Language: TypeScript
Build Tool: Vite
Local Save: IndexedDB
Deployment Target: GitHub Pages
Optional Cloud Save: Supabase with GitHub authentication
Application Path: LUMAN_OS/game_lab/gatherers_ascension/app/
```

## Imported Playable Build

The first playable source build is now stored inside LUMAN OS.

Implemented systems:

- Visual 2D gathering world
- Desktop, tap-to-walk, and touch movement
- Automatic nearby gathering
- Resource disappearance and timed respawning
- Four gathering biomes
- Ten resource types
- Common through Legendary rarity
- Character levels and experience
- Six permanent stats
- Four tool mastery tracks
- Tool and equipment upgrades
- Unlimited Worldpack inventory
- Market selling
- Gear Level biome gates
- Resource Codex discoveries
- Critical gathering results
- IndexedDB autosaving every ten seconds
- Optional Supabase cloud-save reconciliation

## Build Validation

The imported source passed:

```text
TypeScript validation
Vite production compilation
57-module transformation
Production HTML, CSS, and JavaScript generation
```

The current build has one non-blocking optimization warning because Phaser is included in a large JavaScript bundle.

Detailed status:

```text
LUMAN_OS/game_lab/gatherers_ascension/app/PROJECT_STATUS.md
```

## Save-System Law

GitHub remembers the game's source code, design, schemas, and development history. It is not the player's live save database.

Player progress uses:

1. IndexedDB for automatic local saves
2. Export and import save files as a planned manual-backup feature
3. Optional authenticated cloud saving through Supabase

Never commit credentials, tokens, service keys, `.env` files, or private player-save records to the public repository.

## Core Player Stats

- Power
- Precision
- Perception
- Endurance
- Knowledge
- Fortune

## Current Gathering Masteries

- Worldroot Axe
- Veinbreaker Pick
- Dawn Sickle
- Relic Gloves

The broader design may later expand into Foraging, Mining, Logging, Fishing, Excavation, Salvaging, Harvesting, Tracking, and Resource Identification.

## Project Structure

```text
LUMAN_OS/game_lab/gatherers_ascension/
  PROJECT_HOME.md
  app/
    README.md
    PROJECT_STATUS.md
    package.json
    tsconfig.json
    vite.config.ts
    index.html
    src/
    supabase/
  GAME_DESIGN.md       planned
  ROADMAP.md           planned
  CHANGELOG.md         planned
  docs/                planned
  public/              planned
  save-schema/         planned
```

## Working Status

```text
Concept: Recovered and expanded
Core loop: Defined and implemented
Visual direction: Browser-based 2D game
Architecture: Imported
Playable source: Present in GitHub
Build validation: Passed
Local autosave: Implemented
Cloud save: Code and schema present, external setup required
Deployment: GitHub Pages workflow still required
Final artwork: Not started
```

## Commands

```text
/open gatherers ascension
/game status: gatherers ascension
/build game: gatherers ascension
/game design: gatherers ascension
/game roadmap: gatherers ascension
/test game: gatherers ascension
/deploy game: gatherers ascension
```

## Activation Rule

Gatherer's Ascension remains Incubating until Edward explicitly makes it an active strategic front. Development work may still be captured, organized, tested, imported, and deployed while it is incubating.

## Recommended Next Move

```text
Create a repository-level GitHub Pages workflow and publish the playable prototype.
```
