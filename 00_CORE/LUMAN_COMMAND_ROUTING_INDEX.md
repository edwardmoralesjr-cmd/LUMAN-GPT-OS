# LUMAN Command Routing Index

## Purpose

Give LUMAN OS one clean command-routing source of truth across the modern interface layer, core protocol layer, System Settings orchestration layer, and active project vaults.

## Current Architecture

```text
LUMAN_OS/                  = modern user interface and active module layer
LUMAN_OS/system_settings/  = portfolio orchestration, governance, audit, and source mapping
00_CORE/                   = protocol, live status, routing, GitHub updates, and loop engineering
Project vaults             = domain-specific truth, assets, canon, records, and workflows
Chat                       = living intelligence and active update room
GitHub                     = durable public-safe external brain
```

Primary bridge:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
```

Source authority matrix:

```text
LUMAN_OS/system_settings/SOURCE_OF_TRUTH_MATRIX.md
```

## Routing Priority

Resolve commands in this order:

1. Exact command match in this file.
2. Exact command in a modern section `COMMANDS.md` or menu.
3. Source ownership from `SOURCE_OF_TRUTH_MATRIX.md`.
4. Architecture ownership from `MASTER_BRIDGE_INDEX.md`.
5. Matching project dashboard, module command file, or vault.
6. Closest known command in root `COMMANDS.md` or `DEPLOYMENT_INDEX.md`.
7. Best-effort inference when the route is still clear enough to act safely.

Do not ask for clarification unless the request is unsafe, impossible, or risks corrupting important project structure.

## Root and Dashboard Commands

| Command | Route To | Default Action |
|---|---|---|
| `/open luman` | `LUMAN_OS/ROOT_MENU.md` | Open the modern home screen and pull live priorities and open loops from `00_CORE/`. |
| `Open LUMAN OS` | `LUMAN_OS/ROOT_MENU.md` | Treat the repository as the active operating system. |
| `/dashboard` | Root Menu + Master Command Center + core dashboard | Show current mode, human foundation, strategic fronts, protected secondary builds, project state, open loops, warnings, and next move. |
| `Open LUMAN dashboards` | `00_CORE/LUMAN_DASHBOARD.md` | Show operational status and vault context. |
| `/open loops` | `00_CORE/OPEN_LOOPS.md` | Show the live master open-loop list. |
| `/next move` | Active Priorities + Open Loops + Command Center | Choose the highest-leverage next action. |
| `/main menu` | `LUMAN_OS/ROOT_MENU.md` | Return to the root interface. |
| `/help` | This file + root `COMMANDS.md` | Show useful commands. |
| `/back` | Current section context | Return to the previous logical menu. |

## System Settings and Command Center Commands

Primary files:

```text
LUMAN_OS/system_settings/SYSTEM_SETTINGS_MENU.md
LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md
LUMAN_OS/system_settings/PROJECT_REGISTRY.md
LUMAN_OS/system_settings/SOURCE_OF_TRUTH_MATRIX.md
LUMAN_OS/system_settings/COMMANDS.md
```

| Command | Route To | Default Action |
|---|---|---|
| `/system settings` | `SYSTEM_SETTINGS_MENU.md` | Open governance, audit, routing, versioning, privacy, and portfolio controls. |
| `/open command center` | `MASTER_COMMAND_CENTER.md` | Show current mode, active fronts, protected secondary builds, gates, warning, open loops, and one next move. |
| `/system audit` | Latest System Settings integration audit | Review architecture, source ownership, contradictions, privacy, and synchronization. |
| `/source map` | `SOURCE_OF_TRUTH_MATRIX.md` | Resolve which source owns the truth when files, memory, chat, canon, or archives disagree. |
| `/project registry` | `PROJECT_REGISTRY.md` | Show project state, owner, dependency, and next gate. |
| `/90 day path` | Current ninety-day execution file | Show phases, strategic fronts, exit criteria, and current gate. |
| `/autopilot law` | `AUTOPILOT_OPERATING_LAW.md` | Apply classification, routing, privacy, canon, and project-activation rules. |
| `/integration status` | Command Center + Registry + core status files | Detect status drift and routing mismatch. |
| `/system next move` | Command Center + live status | Choose the smallest action that protects the foundation or completes an active gate. |
| `/active fronts` | Command Center | Show the three-front portfolio and any protected secondary build. |
| `/activate project: [name]` | Project Registry + Source Matrix | Validate ownership, capacity, dependency, next gate, and definition of done before activation. |
| `/incubate project: [name]` | Project Registry | Capture without adding it to current execution priorities. |
| `/archive project: [name]` | Project Registry + project changelog | Preserve history and remove from active execution. |
| `/project gate: [name]` | Project Registry + project source | Return state, dependency, next gate, and definition of done. |
| `/check drift` | Source Matrix + bridge + live status | Check presentation drift, status drift, version conflict, canon contradiction, ownership ambiguity, and privacy conflict. |
| `/privacy check` | GitHub protocol + Autopilot Law | Verify that proposed public-repo content is safe. |

## Core Repository Commands

| Command | Route To | Default Action |
|---|---|---|
| `Use GitHub` | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` | Read current sources, update the smallest useful set, and report commits. |
| `Update LUMAN OS:` | GitHub protocol + Source Matrix + bridge | Classify and route a durable update. |
| `/system update` | GitHub protocol | Perform or prepare a source-of-truth update. |
| `/create github update` | GitHub protocol | Prepare a GitHub update workflow. |
| `Create summary` | `00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md` | Create a structured update packet. |
| `Commit this summary to GitHub` | Core protocol + session logs | Convert the latest packet into repository changes. |
| `Show command routing` | This file | Display the routing map. |
| `Quality check LUMAN OS` | System audit + quality loop | Audit commands, dashboards, status, safety, and readiness. |

## Modern Section Commands

| Command | Route To | Default Action |
|---|---|---|
| `/open books` | `LUMAN_OS/book_section/BOOK_SECTION_MENU.md` | Open writing, canon, publishing, and manuscript tools. |
| `/open music` | `LUMAN_OS/music_section/MUSIC_SECTION_MENU.md` | Open Lucid Syntax, Visionary, roadmaps, promotion systems, and Infinite Bloom Music. |
| `/open life os` | `LUMAN_OS/life_os/LIFE_OS_MENU.md` | Open life, family, regulation, and embodied-action systems. |
| `/weekly sync` | Life OS | Run the weekly status, priorities, responsibilities, and next-action review. |
| `/daily embodied action` | Life OS target loop | Choose one action that improves lived physical reality. |
| `/regulation reset` | Life OS | Pause, breathe, locate the body, soften threat response, choose cleanly, and act. |
| `/money check` | Private money system + public-safe Life OS structure | Review financial peace without storing live private data in GitHub. |
| `/open work tools` | `05_WORK_QUALITY_SYSTEMS/` until modern section exists | Open reusable non-confidential quality, SPC, measurement, and career tools. |
| `/open gpt lab` | `LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md` | Open GPT modules, knowledge files, audits, and upgrades. |
| `/open creative vault` | `07_KNOWLEDGE_PACKS/` until modern section exists | Capture and classify creative seeds without activating every idea. |
| `/open records` | Private records systems + future public-safe index | Open vehicle and home maintenance structures. |

## Music Section Commands

Primary files:

```text
LUMAN_OS/music_section/MUSIC_SECTION_MENU.md
02_LUCID_SYNTAX/VISIONARY_RELEASE_CANON_2026.md
02_LUCID_SYNTAX/LUCID_SYNTAX_7_ALBUM_ROADMAP.md
02_LUCID_SYNTAX/LUCID_SYNTAX_DASHBOARD.md
LUMAN_OS/music_section/infinite_bloom_music/
```

| Command | Default Action |
|---|---|
| `/open lucid syntax` | Open the Lucid Syntax dashboard and current era. |
| `/open visionary` | Open the Visionary release canon and active assembly state. |
| `/open lucid roadmap` | Open the seven-album Working Canon roadmap. |
| `/visionary assembly` | Build or update the Ready, Missing, Needs Review, and Not Applicable inventory. |
| `/in-between campaign` | Build the next single release packet and campaign. |
| `/three colors campaign` | Build the cinematic pre-album campaign. |
| `/lucid song: [title]` | Work on a Lucid Syntax song using current project writing and sound laws. |
| `/lucid promo: [title]` | Build a song-specific promotion package. |
| `/open infinite bloom music` | Open the separate Infinite Bloom Music Project manifest. |
| `/open dragon cycle` | Open the twelve-song dragon-cycle album map. |
| `/dragon song: [dragon name]` | Build a canon-aware dragon song identity sheet or draft. |
| `/music canon status` | Show release canon, roadmap status, project separation, and unresolved music questions. |
| `/music next move` | Choose the smallest action that advances the current music gate without widening the shipping front. |

Current music rule:

```text
Visionary is Active Shipping.
Paint was released July 3, 2026.
In-Between is the next active campaign.
Visionary launches September 25, 2026.
Infinite Bloom Music is a protected secondary build, not the shipping front.
```

## Harmonic Time System Commands

Primary files:

```text
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md
```

| Command | Default Action |
|---|---|
| `/open harmonic time system` | Open the Harmonic Time System menu. |
| `/open harmonic time analyst` | Open the specialist GPT module. |
| `/harmonic intake` | Collect required identity and birth information. |
| `/soul numbers` | Calculate and interpret core numerology values. |
| `/numerology map` | Create a numerology-first map. |
| `/chart data check` | Determine whether exact astrology interpretation is supported. |
| `/astrology reading` | Interpret only documented or reliably calculated placements. |
| `/harmonic synthesis` | Combine numerology and astrology coherently. |
| `/harmonic forecast` | Create a symbolic timing forecast. |
| `/create harmonic time map` | Create a full report from the official template. |
| `/compatibility reading` | Create a reflective relationship reading. |
| `/journal prompts` | Create prompts from reading themes. |
| `/affirmation set` | Create grounded affirmations. |
| `/visual chart concept` | Create a report or visual concept. |
| `/open harmonic archive` | Open saved readings and provenance files. |
| `/open edward chart basis` | Open Edward's saved chart-basis file. |

Accuracy rule:

Do not claim newly recalculated astrology without a documented method, user-provided chart, or reliable chart-basis file.

## Loop Engineering Commands

Primary files:

```text
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
00_CORE/LUMAN_LOOP_COMMANDS.md
00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md
```

| Command | Default Action |
|---|---|
| `/start daily next move loop` | Choose one small high-impact action. |
| `/start daily next move loop: [project]` | Run the loop for the named project. |
| `/start loop: [loop name]` | Run the named standard loop. |
| `/run quality loop on this` | Find weaknesses, improve, and verify. |
| `/run decision loop` | Compare options and choose one action. |
| `/upgrade luman os` | Simplify and improve the operating system. |

## Roseborn Universe Commands

Primary modern path:

```text
LUMAN_OS/book_section/roseborn_universe/
```

Legacy history path:

```text
03_ROSEBORN_UNIVERSE/
```

| Command | Default Action |
|---|---|
| `/open roseborn canon guardian` | Open the active canon-governance module. |
| `/canoncheck` | Check proposed material against active canon and continuity. |
| `/canonstatus` | Show Locked, Working, Unresolved, and Contradiction states. |
| `/clearance` | Run chapter or scene clearance. |
| `/audit` | Audit continuity, revelation cost, source basis, and contradictions. |
| `/draft` | Draft canon-safe material from approved sources. |
| `/rewrite` | Rewrite without violating canon or style rules. |
| `/altpaths` | Generate non-canon alternatives labeled clearly. |
| `/contradiction` | Log and analyze a conflict. |
| `/reconcile` | Resolve competing versions through explicit source comparison. |
| `/revisecanon` | Revise canon only with Edward's explicit approval. |
| `/refresh` | Reassert current canon and operational law. |
| `/updatecanon` | Update continuity after approval. |
| `/sessionupdate` | Create a canon handoff record. |
| `Open Roseborn vault` | Bridge modern Canon Guardian tools with legacy project history. |
| `Build Grand Generals` | Continue from the active story bible and approved frontier. |
| `Open Infinite Bloom` | Work from current Infinite Bloom and Codex sources. |

Current Roseborn rule:

```text
The 21-book architecture is active Working Canon.
The 23-book variant is archived.
The 20-book blueprint is a non-governing unrecovered historical source.
Series planning may continue from the 21-book architecture.
```

## Life, Records, Work, and OMNI-Vault Commands

| Command | Default Action |
|---|---|
| `Life OS sync` | Run a life status and next-action review. |
| `Update Life OS:` | Route durable life-system updates safely. |
| `KIA service records` | Show private record status without publishing sensitive details. |
| `Update KIA records:` | Capture service information in the appropriate private record system. |
| `Work quality dashboard` | Open reusable non-confidential quality tools. |
| `Quality analysis:` | Analyze user-provided non-sensitive process data. |
| `OMNI-Vault template` | Build second-brain templates and vault workflows. |
| `Update OMNI-Vault:` | Classify information into permanent, active, draft, temporary, task, open-loop, archived, or sensitive states. |

## Routing Maintenance Rules

- Add new modern section commands here when their menus become active.
- Add project-specific commands in the project's own command file first, then mirror only high-value commands here.
- Use the Source-of-Truth Matrix before choosing between modern, legacy, memory, chat, canon, and archive sources.
- Preserve legacy vaults for history, but do not let historical files silently outrank current approved sources.
- Keep live priorities and open loops in `00_CORE/` until an explicit migration is approved.
- Never route sensitive private data into the public repository.
- Every command response should end with one Recommended Next Move when appropriate.

## Status

Status: Active routing source of truth  
Version: v2.1  
Last Updated: 2026-07-12  
Owner: LUMAN OS Core

## Recommended Next Move

```text
Use /in-between campaign for the current shipping gate or /clearance for Grand Generals Chapter 5.
```
