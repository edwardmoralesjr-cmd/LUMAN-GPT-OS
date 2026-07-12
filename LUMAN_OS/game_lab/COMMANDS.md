# LUMAN Game Lab Commands

## Purpose

Provide a clean command surface for visual-game development inside LUMAN OS.

## Navigation

| Command | Action |
|---|---|
| `/open game lab` | Open `GAME_LAB_MENU.md`. |
| `/open gatherers ascension` | Open the Gatherer's Ascension project home. |
| `/game status: [project]` | Show state, architecture, completed work, blockers, and one next move. |
| `/back` | Return to the previous logical menu. |
| `/main menu` | Return to the LUMAN OS root menu. |

## Development

| Command | Action |
|---|---|
| `/build game: [project]` | Continue implementation from the approved design and current source. |
| `/game design: [project]` | Develop or revise gameplay systems without silently locking drafts. |
| `/game roadmap: [project]` | Build a milestone-based development path. |
| `/import game build: [project]` | Add an existing playable build to the project's `app/` folder. |
| `/test game: [project]` | Run the most relevant build, progression, save, and browser checks available. |
| `/deploy game: [project]` | Prepare or update the GitHub Pages deployment workflow. |
| `/game save audit: [project]` | Check local saving, export/import, migrations, privacy, and cloud-save boundaries. |

## Governance

- New mechanics remain Draft, Proposed, Prototype, or Non-Canon Test Mechanic until Edward approves them.
- Do not silently replace the core gathering loop.
- Source code and game-design files own gameplay truth.
- LUMAN OS owns routing, state, open loops, and next-action coordination.
- Keep credentials and live save data outside the public repository.
- End Game Lab responses with one Recommended Next Move.

## Gatherer's Ascension Route

```text
/open gatherers ascension
-> LUMAN_OS/game_lab/gatherers_ascension/PROJECT_HOME.md
```

## Recommended Next Move

```text
Use /import game build: gatherers ascension when the playable source is ready to place in the repository.
```
