# LUMAN Command Routing Index

**Purpose:** Give LUMAN OS one clean command-routing source of truth across the core system and all active vaults.

---

## Routing Priority

When Edward gives a command, resolve it in this order:

1. Exact command match in this routing index.
2. Matching vault dashboard or module command file.
3. Closest known command in `COMMANDS.md` or `DEPLOYMENT_INDEX.md`.
4. If still unclear, infer the most likely vault from the command wording and proceed with a best-effort response.

Do not ask for clarification unless the request is unsafe, impossible, or would risk corrupting important project structure.

---

## Core System Commands

| Command | Route To | Default Action |
|---|---|---|
| `Open LUMAN OS` | Core OS | Show status snapshot, active priorities, open loops, and next best action. |
| `Open LUMAN dashboards` | `00_CORE/LUMAN_DASHBOARD.md` | Show system status, priorities, open loops, vault status, commands, and one next best action. |
| `Use GitHub` | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` | Treat repo as source of truth and perform requested repo work. |
| `Update LUMAN OS:` | Core OS / target vault | Classify update, route it, and prepare or commit changes when requested. |
| `Create summary` | `00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md` | Create a LUMAN GitHub Update Packet. |
| `Commit this summary to GitHub` | Core OS / session logs | Convert latest update packet into repo changes. |
| `Show command routing` | `00_CORE/LUMAN_COMMAND_ROUTING_INDEX.md` | Display the current routing map. |
| `Quality check LUMAN OS` | Core OS | Audit commands, dashboards, open loops, safety rules, and vault readiness. |

---

## Roseborn Universe Commands

Primary files:

- `03_ROSEBORN_UNIVERSE/ROSEBORN_DASHBOARD.md`
- `03_ROSEBORN_UNIVERSE/ROSEBORN_COMMANDS.md`
- `03_ROSEBORN_UNIVERSE/CHANGELOG.md`

| Command | Route To | Default Action |
|---|---|---|
| `Open Roseborn vault` | Roseborn dashboard | Show Roseborn status and continue from the most relevant file. |
| `Open Roseborn dashboard` | `03_ROSEBORN_UNIVERSE/ROSEBORN_DASHBOARD.md` | Show Roseborn mission, canon status, projects, open loops, commands, and next action. |
| `Roseborn canon` | Roseborn canon workflow | Summarize locked canon, working canon, contradictions, and next canon action. |
| `Update Roseborn canon:` | Roseborn canon workflow | Classify the update as locked, working, contradiction, task, or open loop. |
| `Lock this as Roseborn canon` | Roseborn canon workflow | Treat provided item as finalized unless it conflicts with existing canon. |
| `Add this to working Roseborn canon` | Roseborn canon workflow | Store as active working canon rather than finalized canon. |
| `Build Grand Generals` | Roseborn dashboard / Grand Generals section | Continue Grand Generals development from active story bible context. |
| `Open Dragon Doctrine` | Dragon doctrine workflow | Open or create Dragon Doctrine index/pages. |
| `Open Infinite Bloom` | Infinite Bloom workflow | Work from Infinite Bloom, Architect Layer, Codex Fracture, and Codex structure. |
| `Create Roseborn session summary` | Session logs / Roseborn vault | Create a Roseborn-focused update packet or session log. |

---

## Lucid Syntax Commands

Primary files:

- `lucid-syntax-promo-pro/deployment_instructions.md`
- `lucid-syntax-promo-pro/promo_output_format.md`
- `lucid-syntax-promo-pro/album_metadata.md`

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

- When a new dashboard is created, add its open command here.
- When a new vault command is created, add it here and in that vault’s command file.
- Keep `COMMANDS.md`, `DEPLOYMENT_INDEX.md`, and dashboard command lists aligned with this index when possible.
- If safety checks block a large root-file update, create or update the relevant module command file and record the routing here.
- Prefer small, focused updates over large rewrites.

---

## Current Routing Gaps

- Root `COMMANDS.md` does not yet mirror every Roseborn-specific command listed here.
- `DEPLOYMENT_INDEX.md` does not yet contain a full Roseborn dashboard activation section.
- Future vault dashboards still need matching command routes as they are created.
