# Gatherer's Ascension App

This folder contains the first playable visual build of Gatherer's Ascension inside LUMAN OS.

## Current systems

- Phaser visual world rendered in the browser
- TypeScript and Vite project structure
- WASD, arrow-key, tap-to-walk, and touch movement
- Automatic nearby gathering and resource respawns
- Four biomes and ten resource types
- Character levels, XP, stat points, gathering mastery, tools, gear, coins, and biome gates
- Unlimited Worldpack inventory
- Market selling and permanent upgrades
- IndexedDB local autosave every ten seconds
- Optional Supabase cloud saving through GitHub authentication

## Run locally

From this folder:

```bash
npm install
npm run dev
```

Open `http://localhost:8080`.

## Validate and build

```bash
npm run build
npm run preview
```

## Save behavior

GitHub stores source code and development history. Live player progress is stored in IndexedDB. Optional cloud saving requires a Supabase project and GitHub OAuth.

Copy `.env.example` to `.env` only on a trusted local machine and supply:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not commit `.env`, API keys, service-role keys, tokens, or player save records.

## Cloud database

Run `supabase/schema.sql` in the Supabase SQL editor. Its Row Level Security policies restrict every save row to its authenticated owner.

## Core loop

```text
Move near a resource
-> gather automatically
-> gain XP and mastery
-> sell materials
-> upgrade tools and gear
-> unlock new biomes
-> gather rarer resources
```

## Current limitation

The prototype uses procedural shapes rather than final character, environment, and resource artwork. GitHub Pages deployment for the nested LUMAN OS path still needs a repository-level workflow.
