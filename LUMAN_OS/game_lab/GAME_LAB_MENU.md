# LUMAN OS Game Lab

## Purpose

The Game Lab is the permanent LUMAN OS home for visual games, interactive systems, playable prototypes, game-design documents, progression systems, and deployment workflows.

It keeps game projects organized without mixing source code into the Book Section, Creative Vault, or GPT Builder Lab.

## Command

```text
/open game lab
```

## Game Lab Menu

```text
╔════════════════════════════════════════╗
║             LUMAN GAME LAB             ║
║     Visual Games and Playable Systems  ║
╚════════════════════════════════════════╝

[1] Gatherer's Ascension
[2] Game Project Registry
[3] Shared Game Systems
[4] Prototype Incubator
[5] Deployment and Save Systems

Type a number, project name, or command.
```

## Active Project Homes

### Gatherer's Ascension

```text
LUMAN_OS/game_lab/gatherers_ascension/PROJECT_HOME.md
```

A visual gathering RPG built around the loop:

```text
Explore -> Gather -> Level Up -> Improve Stats -> Upgrade Gear -> Unlock New Areas
```

Current state: Incubating and ready for structured development.

## Game Lab Rules

- Store public-safe source code, design documents, schemas, roadmaps, and deployment workflows.
- Never commit API keys, private tokens, passwords, or live player credentials.
- Do not store personal cloud-save data directly in the public repository.
- Label unapproved mechanics as Draft, Proposed, Prototype, or Non-Canon Test Mechanic.
- Keep each game in its own project folder.
- Game source owns gameplay truth. LUMAN OS coordinates status, routing, and next actions.
- New games do not become active strategic fronts unless Edward explicitly activates them.

## Standard Project Structure

```text
project-name/
  PROJECT_HOME.md
  GAME_DESIGN.md
  ROADMAP.md
  CHANGELOG.md
  app/
  public/
  docs/
  save-schema/
```

Folders are added only when needed.

## Commands

```text
/open game lab
/open gatherers ascension
/game status: [project]
/build game: [project]
/game design: [project]
/game roadmap: [project]
/import game build: [project]
/deploy game: [project]
```

## Recommended Next Move

```text
Open Gatherer's Ascension and import the first playable browser build into its app folder.
```
