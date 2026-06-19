# LUMAN Command Routing Index

**Purpose:** Give LUMAN OS one clean command-routing source of truth across the modern interface layer, the core protocol layer, and all active vaults.

---

## Current Routing Architecture

LUMAN OS now has two cooperating architecture layers:

```text
[1] LUMAN_OS/  = modern user interface layer
[2] 00_CORE/   = core protocol, loop, routing, status, and GitHub update layer
```

Bridge file:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
```

Default rule:

```text
Modern slash commands and screen navigation start in LUMAN_OS/.
Core protocols, GitHub updates, active priorities, open loops, and loop engineering still start in 00_CORE/.
```

---

## Routing Priority

When Edward gives a command, resolve it in this order:

1. Exact command match in this routing index.
2. Exact command or section match in `LUMAN_OS/ROOT_MENU.md` or a modern `LUMAN_OS/` section menu.
3. Bridge ownership using `LUMAN_OS/MASTER_BRIDGE_INDEX.md`.
4. Matching vault dashboard or module command file.
5. Closest known command in `COMMANDS.md` or `DEPLOYMENT_INDEX.md`.
6. If still unclear, infer the most likely vault from the command wording and proceed with a best-effort response.

Do not ask for clarification unless the request is unsafe, impossible, or would risk corrupting important project structure.

---

## Modern Root Interface Commands

Primary files:

```text
LUMAN_OS/ROOT_MENU.md
LUMAN_OS/MASTER_BRIDGE_INDEX.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

| Command | Route To | Default Action |
|---|---|---|
| `/open luman` | `LUMAN_OS/ROOT_MENU.md` | Open the clean modern root interface, then fill current priorities and open loops from `00_CORE/`. |
| `Open LUMAN OS` | `LUMAN_OS/ROOT_MENU.md` | Treat the repo as the active operating system and show status, priorities, open loops, and one next move. |
| `/dashboard` | `LUMAN_OS/ROOT_MENU.md` + `00_CORE/LUMAN_DASHBOARD.md` | Show system status, project status, open loops, active systems, and next best action. |
| `Open LUMAN dashboards` | `00_CORE/LUMAN_DASHBOARD.md` | Show system status, priorities, open loops, vault status, commands, and one next best action. |
| `/open loops` | `00_CORE/OPEN_LOOPS.md` | Show the live master open-loop list. |
| `/next move` | `00_CORE/OPEN_LOOPS.md` + `00_CORE/ACTIVE_PRIORITIES.md` | Choose the highest-leverage next action from current priorities and loops. |
| `/system update` | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` | Route a durable update into the correct file or module. |
| `/create github update` | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` | Prepare or perform the relevant GitHub update workflow. |
| `/help` | `COMMANDS.md` | Show useful available commands. |
| `/back` | Current section context | Return to the previous logical menu when possible. |
| `/main menu` | `LUMAN_OS/ROOT_MENU.md` | Return to the LUMAN OS root menu. |

---

## Core System Commands

| Command | Route To | Default Action |
|---|---|---|
| `Use GitHub` | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` | Treat repo as source of truth and perform requested repo work. |
| `Update LUMAN OS:` | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` + bridge index | Classify update, route it, and prepare or commit changes when requested. |
| `Create summary` | `00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md` | Create a LUMAN GitHub Update Packet. |
| `Commit this summary to GitHub` | Core OS / session logs | Convert latest update packet into repo changes. |
| `Show command routing` | `00_CORE/LUMAN_COMMAND_ROUTING_INDEX.md` | Display the current routing map. |
| `Quality check LUMAN OS` | Core OS | Audit commands, dashboards, open loops, safety rules, and vault readiness. |

---

## Modern Section Commands

| Command | Route To | Default Action |
|---|---|---|
| `/open books` | `LUMAN_OS/book_section/BOOK_SECTION_MENU.md` | Open the Book Section command center. |
| `/open music` | `LUMAN_OS/music_section/` or `02_LUCID_SYNTAX/` | Open Lucid Syntax and music rollout workflows. |
| `/weekly sync` | Life OS | Run Edward’s weekly Life OS sync. |
| `/money check` | Life OS / Money System | Review financial peace-system structure without storing sensitive private data. |
| `/open work tools` | `LUMAN_OS/work_quality_tools/` or `05_WORK_QUALITY_SYSTEMS/` | Open work-quality, SPC, measurement, and improvement workflows. |
| `/open gpt lab` | `LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md` | Open Edward’s GPT registry and module-development lab. |
| `/open creative vault` | `LUMAN_OS/creative_vault/` | Open creative ideas, poems, prompts, lyrics, and future concepts. |
| `/open records` | `LUMAN_OS/records/` | Open vehicle/home records and maintenance-planning structures. |
| `/system settings` | `LUMAN_OS/system_settings/` or `LUMAN_OS/MASTER_BRIDGE_INDEX.md` | Open system rules, commands, modules, versioning, and memory logic. |

---

## Harmonic Time System Commands

Primary files:

```text
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md
```

| Command | Route To | Default Action |
|---|---|---|
| `/open harmonic time system` | `LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md` | Open the Harmonic Time System section menu. |
| `/open harmonic time analyst` | `LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/` | Open the specialist GPT module for Harmonic Time Map readings. |
| `/harmonic intake` | Harmonic Time System Analyst | Collect name, birth date, birth time, birth place, and optional intention. |
| `/soul numbers` | Harmonic Time System Analyst | Calculate and interpret Life Path, Expression, Soul Urge, and Personal Year. |
| `/numerology map` | Harmonic Time System Analyst | Create a numerology-first Harmonic Time Map. |
| `/chart data check` | Harmonic Time System Analyst | Determine whether exact astrology interpretation is supported. |
| `/astrology reading` | Harmonic Time System Analyst | Interpret astrology placements only when reliable data or documented basis exists. |
| `/harmonic synthesis` | Harmonic Time System Analyst | Weave numerology and astrology into one coherent reading. |
| `/harmonic forecast` | Harmonic Time System Analyst | Create a 12-month symbolic timing forecast. |
| `/create harmonic time map` | `READING_TEMPLATE.md` | Create the full Harmonic Time Map report. |
| `/create harmonic time map Edward Morales Jr.` | Edward chart basis + `READING_TEMPLATE.md` | Create Edward’s full map using the saved chart-basis file. |
| `/compatibility reading` | Harmonic Time System Analyst | Create a reflective relationship reading without fixed-fate framing. |
| `/journal prompts` | Harmonic Time System Analyst | Create reflective prompts from reading themes. |
| `/affirmation set` | Harmonic Time System Analyst | Create grounded affirmations from the central themes. |
| `/visual chart concept` | Harmonic Time System Analyst | Create a visual/PDF concept for a Harmonic Time Map. |
| `/open harmonic time book` | Harmonic Time System book/framework target | Open or create the Harmonic Time System book/framework area. |
| `/open harmonic archive` | `LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md` | Open saved Harmonic Time archive files. |
| `/open edward chart basis` | `EDWARD_MORALES_JR_EXACT_CHART_BASIS.md` | Open Edward’s saved exact chart-basis/provenance file. |

Accuracy rule:

Do not claim newly recalculated astrology unless a calculation method, user-provided chart, or reliable chart-basis file is documented.

---

## Loop Engineering Commands

Primary files:

```text
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
00_CORE/LUMAN_LOOP_COMMANDS.md
00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md
```

| Command | Route To | Default Action |
|---|---|---|
| `/start daily next move loop` | `00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md` | Pick one small high-impact action and return current focus, current state, best next move, action, log, and next step. |
| `/start daily next move loop: [project]` | `00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md` | Run the Daily Next Move Loop for the named project or vault. |
| `/start loop: [loop name]` | `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md` | Start the named loop using the standard LUMAN loop format. |
| `/run quality loop on this` | `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md` | Review the current output, find weak points, improve it, and verify the result. |
| `/run decision loop` | `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md` | Compare options using Edward's filters and choose one next action. |
| `/upgrade luman os` | `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md` | Run the Evolution Loop to simplify, improve, and update the operating system. |

---

## Roseborn Universe Commands

Modern primary path:

```text
LUMAN_OS/book_section/roseborn_universe/
```

Legacy/project path:

```text
03_ROSEBORN_UNIVERSE/
```

Primary files:

```text
LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/
03_ROSEBORN_UNIVERSE/ROSEBORN_DASHBOARD.md
03_ROSEBORN_UNIVERSE/ROSEBORN_COMMANDS.md
03_ROSEBORN_UNIVERSE/CHANGELOG.md
```

| Command | Route To | Default Action |
|---|---|---|
| `Open Roseborn vault` | Modern Roseborn path + legacy vault | Show Roseborn status and continue from the most relevant modern or legacy file. |
| `Open Roseborn dashboard` | `03_ROSEBORN_UNIVERSE/ROSEBORN_DASHBOARD.md` | Show Roseborn mission, canon status, projects, open loops, commands, and next action. |
| `Roseborn canon` | Roseborn Canon Guardian workflow | Summarize locked canon, working canon, contradictions, and next canon action. |
| `Update Roseborn canon:` | Roseborn Canon Guardian workflow | Classify the update as locked, working, contradiction, task, or open loop. |
| `Lock this as Roseborn canon` | Roseborn Canon Guardian workflow | Treat provided item as finalized unless it conflicts with existing canon. |
| `Add this to working Roseborn canon` | Roseborn Canon Guardian workflow | Store as active working canon rather than finalized canon. |
| `Build Grand Generals` | Roseborn dashboard / Grand Generals section | Continue Grand Generals development from active story bible context. |
| `Open Dragon Doctrine` | Dragon doctrine workflow | Open or create Dragon Doctrine index/pages. |
| `Open Infinite Bloom` | Infinite Bloom workflow | Work from Infinite Bloom, Architect Layer, Codex Fracture, and Codex structure. |
| `Create Roseborn session summary` | Session logs / Roseborn vault | Create a Roseborn-focused update packet or session log. |

---

## Lucid Syntax Commands

Primary files:

```text
lucid-syntax-promo-pro/deployment_instructions.md
lucid-syntax-promo-pro/promo_output_format.md
lucid-syntax-promo-pro/album_metadata.md
02_LUCID_SYNTAX/
```

| Command | Route To | Default Action |
|---|---|---|
| `Open Lucid Syntax vault` | Lucid Syntax module | Show Lucid Syntax campaign status and next action. |
| `Lucid Syntax promotion` | Lucid Syntax Promo Pro | Default to Visionary era and Paint unless Edward names another song. |
| `Lucid Syntax promotion for [song title]` | Lucid Syntax Promo Pro | Build song-specific promo package. |
| `Visionary rollout` | Lucid Syntax / Visionary | Work on Visionary album rollout strategy and promo plan. |
| `Paint promo pack` | Lucid Syntax / Paint | Build or refine Paint promotional assets. |

---

## Life OS Commands

| Command | Route To | Default Action |
|---|---|---|
| `Life OS sync` | Life OS | Show status snapshot, priorities, automation check, trip fund progress, and decision support. |
| `Run Weekly Sync` | Life OS | Run Edward’s weekly Life OS sync structure. |
| `Update Life OS:` | Life OS | Classify and store durable life-system updates when requested. |

---

## Vehicle / KIA Commands

| Command | Route To | Default Action |
|---|---|---|
| `KIA service records` | KIA service workflow | Show vehicle service status, completed items, open diagnostics, and next action. |
| `Update KIA records:` | KIA service workflow | Capture date, mileage, work, findings, cost, and next recommendation. |

---

## Work Quality Commands

| Command | Route To | Default Action |
|---|---|---|
| `Work quality dashboard` | Work Quality systems | Help structure dashboards, SPC, measurement systems, and process improvement. |
| `Quality analysis:` | Work Quality systems | Analyze quality/process problem using non-sensitive data. |

---

## OMNI-Vault Commands

| Command | Route To | Default Action |
|---|---|---|
| `OMNI-Vault template` | OMNI-Vault / GPT Builder | Build or refine second-brain templates and vault workflows. |
| `Update OMNI-Vault:` | OMNI-Vault | Classify information into permanent, active, draft, temporary, task, or open-loop status. |

---

## Routing Maintenance Rules

- When a new modern menu is created under `LUMAN_OS/`, add its open command here.
- When a new dashboard is created under legacy numbered vaults, add its open command here.
- When a new vault command is created, add it here and in that vault’s command file.
- When a new loop is created, add it to `00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md`, `00_CORE/LUMAN_LOOP_COMMANDS.md`, and this routing index if it needs a command.
- Keep `COMMANDS.md`, `DEPLOYMENT_INDEX.md`, `LUMAN_OS/ROOT_MENU.md`, and section menus aligned with this index when possible.
- If safety checks block a large root-file update, create or update the relevant module command file and record the routing here.
- Prefer small, focused updates over large rewrites.
- Use `LUMAN_OS/MASTER_BRIDGE_INDEX.md` before duplicating source-of-truth files across old and new architectures.

---

## Current Routing Gaps

- Create a modern `LUMAN_OS/system_settings/` section.
- Create modern section indexes for Music, Life OS, Money System, Work / Quality Tools, Creative Vault, and Vehicle / Home Records when needed.
- Create `LUMAN_OS/book_section/roseborn_universe/ROSEBORN_BRIDGE_INDEX.md` to reconcile the modern Roseborn Canon Guardian tool layer with the older `03_ROSEBORN_UNIVERSE/` vault.
- Update changelog layers after this routing reconciliation.
