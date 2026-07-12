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

This recovered foundation should guide the rebuild unless Edward explicitly changes it.

## Current Technical Direction

Use a modular browser-game architecture rather than one giant HTML file.

```text
Engine: Phaser
Language: TypeScript
Build Tool: Vite
Local Save: IndexedDB
Deployment: GitHub Pages
Optional Cloud Save: Supabase with GitHub authentication
```

The first version should remain installable as a Progressive Web App when practical.

## Save-System Law

GitHub remembers the game's source code, design, schemas, and development history. It should not be used as the player's live save database.

Player progress should use:

1. IndexedDB for automatic local saves
2. Export and import save files for manual backup
3. Optional authenticated cloud saving later

Never commit credentials, tokens, service keys, or private player-save records to the public repository.

## First Playable Scope

The first complete build should contain:

- One playable gatherer
- Visual movement
- Automatic nearby gathering
- Four gathering biomes
- At least ten resources
- Character level and experience
- Gathering skill progression
- Permanent stat points
- Upgradeable tools
- Upgradeable gathering equipment
- Market selling
- Gear-level biome gates
- Resource Codex discoveries
- Desktop and mobile controls
- Reliable automatic saving

## Core Player Stats

- Power
- Precision
- Perception
- Endurance
- Knowledge
- Fortune

## Core Gathering Skills

- Foraging
- Mining
- Logging
- Fishing
- Excavation
- Salvaging
- Harvesting
- Tracking
- Resource Identification

The first playable build may launch with a smaller supported set, but the data model should allow expansion.

## Project Folder Plan

```text
LUMAN_OS/game_lab/gatherers_ascension/
  PROJECT_HOME.md
  GAME_DESIGN.md
  ROADMAP.md
  CHANGELOG.md
  app/
  docs/
  public/
  save-schema/
```

Only `PROJECT_HOME.md` is required at the incubation stage. Add the remaining folders as development begins.

## Working Status

```text
Concept: Recovered and expanded
Core loop: Defined
Visual direction: Browser-based 2D game
Architecture: Selected
Playable source: Ready to import
Cloud save: Planned, not required for first launch
Deployment: GitHub Pages planned
```

## Commands

```text
/open gatherers ascension
/game status: gatherers ascension
/build game: gatherers ascension
/game design: gatherers ascension
/game roadmap: gatherers ascension
/import game build: gatherers ascension
/deploy game: gatherers ascension
```

## Activation Rule

Gatherer's Ascension remains Incubating until Edward explicitly makes it an active strategic front. Development work may still be captured, organized, tested, and imported while it is incubating.

## Recommended Next Move

```text
Import the first playable Phaser, TypeScript, and Vite build into LUMAN_OS/game_lab/gatherers_ascension/app/.
```
