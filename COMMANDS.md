# LUMAN GPT OS Commands

This file defines activation phrases Edward can use when asking ChatGPT/LUMAN to work from this repository.

## Current Architecture Rule

LUMAN OS now has two cooperating architecture layers:

```text
[1] LUMAN_OS/  = modern user interface layer
[2] 00_CORE/   = legacy/core protocol, routing, loop, and status layer
```

Use this bridge file when deciding which layer owns a command:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
```

Default rule:

```text
Modern slash-command screens open through LUMAN_OS/.
Core protocols, GitHub updates, open loops, active priorities, and loop engineering still route through 00_CORE/ until migrated.
```

---

## Modern LUMAN OS Interface Commands

### /open luman

When Edward says:

```text
/open luman
```

or:

```text
Open LUMAN OS
```

ChatGPT should treat the repo as the active operating system and open the modern root interface.

Primary file:

```text
LUMAN_OS/ROOT_MENU.md
```

Supporting files:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

Default behavior:

1. Show the LUMAN OS home screen or a concise root-interface view.
2. Pull current top priorities from `00_CORE/ACTIVE_PRIORITIES.md`.
3. Pull current open loops from `00_CORE/OPEN_LOOPS.md`.
4. Use `LUMAN_OS/MASTER_BRIDGE_INDEX.md` if routing between modern and legacy files is unclear.
5. End with one Recommended Next Move.

### /dashboard

Primary file:

```text
LUMAN_OS/ROOT_MENU.md
```

Secondary file:

```text
00_CORE/LUMAN_DASHBOARD.md
```

Default behavior:

Show current focus, project status, open loops, weekly priorities, active systems, and the next best action.

### /open books

Primary file:

```text
LUMAN_OS/book_section/BOOK_SECTION_MENU.md
```

Default behavior:

Open the writing, publishing, canon, Codex, manuscript, and story-development command center.

Includes:

- Roseborn Universe
- Grand Generals
- The Infinite Bloom
- The Rose Codices
- The Algorithm of the Shadow
- Publishing tools
- Manuscript tools
- Canon tools

### /open music

Primary modern target:

```text
LUMAN_OS/music_section/
```

Current legacy/project source:

```text
02_LUCID_SYNTAX/
lucid-syntax-promo-pro/
```

Default behavior:

Open Lucid Syntax, album rollout planning, lyrics, visuals, promo packs, release schedules, and music strategy.

### /weekly sync

Route to:

```text
Life OS
```

Default behavior:

Run Edward’s Life OS weekly sync structure, including status snapshot, top priorities, automation check, trip fund progress, and decision support.

### /money check

Route to:

```text
Life OS / Money System
```

Default behavior:

Review financial peace-system structure, weekly budget, bills, savings buckets, vacation fund, and next financial action without storing live private financial balances in GitHub.

### /open work tools

Primary modern target:

```text
LUMAN_OS/work_quality_tools/
```

Current legacy/project source:

```text
05_WORK_QUALITY_SYSTEMS/
```

Default behavior:

Open work systems, quality analysis, SPC, measurement tools, improvement ideas, and career-support workflows while avoiding employer-confidential data.

### /open gpt lab

Primary file:

```text
LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md
```

Default behavior:

Open Edward’s custom GPT registry, modules, knowledge files, prompt systems, audits, and upgrades.

### /open creative vault

Primary modern target:

```text
LUMAN_OS/creative_vault/
```

Default behavior:

Route poems, spiritual reflections, lyrics, art prompts, book seeds, invention ideas, and future concepts into the correct creative structure when Edward asks to save or systematize them.

### /open records

Primary modern target:

```text
LUMAN_OS/records/
```

Default behavior:

Open vehicle maintenance, home records, service logs, inspections, and preventive-planning structures.

### /system settings

Primary modern target:

```text
LUMAN_OS/system_settings/
```

Bridge file:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
```

Default behavior:

Open structure, rules, commands, modules, GitHub update logic, versioning, and memory logic. If the modern system-settings section has not been created yet, use `00_CORE/` files and the bridge index.

---

## Harmonic Time System Commands

### /open harmonic time system

Primary file:

```text
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
```

Supporting files:

```text
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/MODULE_MANIFEST.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/COMMANDS.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/SOURCE_KNOWLEDGE.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/READING_TEMPLATE.md
LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md
```

Default behavior:

Open Edward’s spiritual timing, numerology, astrology, symbolic self-mapping, Harmonic Time Map, and soul-rhythm command center.

### /open harmonic time analyst

Primary module:

```text
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
```

Default behavior:

Open the specialist GPT module that powers Harmonic Time Map readings.

### /open edward chart basis

Primary file:

```text
LUMAN_OS/harmonic_time_system/archive/EDWARD_MORALES_JR_EXACT_CHART_BASIS.md
```

Default behavior:

Open Edward’s saved exact-chart basis/provenance file and use it as the stable internal reference for Edward’s personal Harmonic Time readings.

### /create harmonic time map Edward Morales Jr.

Primary files:

```text
LUMAN_OS/harmonic_time_system/archive/EDWARD_MORALES_JR_EXACT_CHART_BASIS.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/READING_TEMPLATE.md
```

Default behavior:

Create or continue a Harmonic Time Map using the saved chart-basis file and the official reading template. Do not claim newly recalculated astrology unless a calculation source is documented.

Additional Harmonic commands:

```text
/harmonic intake
/soul numbers
/numerology map
/chart data check
/astrology reading
/harmonic synthesis
/harmonic forecast
/create harmonic time map
/compatibility reading
/journal prompts
/affirmation set
/visual chart concept
/open harmonic time book
/open harmonic archive
```

---

## Core Repository Commands

### Open LUMAN dashboards

When Edward says:

```text
Open LUMAN dashboards
```

ChatGPT should activate the LUMAN OS dashboard layer.

Primary modern file:

```text
LUMAN_OS/ROOT_MENU.md
```

Core dashboard file:

```text
00_CORE/LUMAN_DASHBOARD.md
```

Default behavior:

1. Show system status.
2. Show active priorities.
3. Show open loops.
4. Show vault status.
5. Show useful available commands.
6. Give one next best action.

### Use GitHub

When Edward says:

```text
Use GitHub
```

or:

```text
Use GitHub. Update [file/path] with [content]
```

ChatGPT should activate the LUMAN GitHub update workflow.

Use this file:

```text
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
```

Default behavior:

1. Identify the target repo file or likely vault.
2. Read the current file before updating when possible.
3. Create or update the smallest useful set of files.
4. Keep commit messages clear and future-readable.
5. Confirm the changed files and commit SHAs back to Edward.
6. Never store secrets, credentials, seed phrases, private financial details, employer-confidential data, or sensitive family records.

### Update LUMAN OS

When Edward says:

```text
Update LUMAN OS:
```

followed by new information, ChatGPT should decide where the update belongs and prepare or commit the appropriate GitHub changes.

Use these files when relevant:

```text
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
LUMAN_OS/MASTER_BRIDGE_INDEX.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md
06_SESSION_LOGS/
```

Default behavior:

1. Classify the update as permanent, active, working canon, locked canon, task, open loop, or temporary.
2. Route the update to the correct vault or module.
3. Ask for clarification only if the update would be unsafe or impossible to place responsibly.
4. Otherwise, make the best practical update and report what changed.

### Create summary

When Edward says:

```text
Create summary
```

ChatGPT should generate a LUMAN GitHub Update Packet.

Use this file:

```text
00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md
```

Default behavior:

1. Summarize the session into a structured memory packet.
2. Identify main vault, secondary vaults, key decisions, permanent updates, active updates, tasks, open loops, and files to update.
3. Include exact Markdown for session logs, changelog entries, active priorities, open loops, and knowledge packs when useful.
4. Do not commit anything yet unless Edward also asks to commit it.

### Commit this summary to GitHub

When Edward says:

```text
Commit this summary to GitHub
```

ChatGPT should convert the latest LUMAN GitHub Update Packet into repository changes.

Default behavior:

1. Create or update the session log.
2. Update the changelog.
3. Update active priorities.
4. Update open loops.
5. Update the relevant knowledge pack or module file.
6. Confirm changed files and commit SHAs.

---

## Loop Engineering Commands

Primary files:

```text
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
00_CORE/LUMAN_LOOP_COMMANDS.md
00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md
```

### /start daily next move loop

Activates the smallest operational LUMAN loop and chooses one best next action.

Default behavior:

1. Identify the current focus.
2. State the current project state.
3. Choose one small high-impact next move.
4. Explain why it matters.
5. Provide the action to take or draft.
6. Log what should be saved.
7. Name the next step.

### /start daily next move loop: [project]

Runs the Daily Next Move Loop for the named project, vault, or system.

Examples:

```text
/start daily next move loop: LUMAN OS
/start daily next move loop: Lucid Syntax
/start daily next move loop: Roseborn
/start daily next move loop: Life OS
/start daily next move loop: KIA records
```

### /start loop: [loop name]

Routes to the LUMAN Loop Engineering System and runs the named loop using the standard loop format.

Supported loop names:

```text
daily next move
vault
github improvement
creation
quality
promotion
decision
evolution
```

### /run quality loop on this

Reviews the current output, identifies weak points, improves it, and verifies the result.

### /run decision loop

Compares options using Edward’s priorities and recommends one clear next action.

### /upgrade luman os

Runs the Evolution Loop on LUMAN OS itself.

Default behavior:

1. Review current commands, dashboards, loops, and open tasks.
2. Find friction or unnecessary complexity.
3. Simplify where possible.
4. Add missing structure only if useful.
5. Update routing, dashboard, changelog, and open loops when Edward asks for GitHub changes.

---

## Project Workflow Commands

### Open [vault name]

When Edward says:

```text
Open Roseborn vault
Open Lucid Syntax vault
```

or another named vault, ChatGPT should locate the relevant module or vault folder and operate from that context.

Default behavior:

1. Search or open the most relevant folder/files.
2. Summarize the active state.
3. Continue the project using the correct canon, voice, and workflow rules.

### Roseborn canon

When Edward says:

```text
Roseborn canon
Update Roseborn canon:
```

ChatGPT should activate the Roseborn Canon Guardian workflow and preserve continuity between locked canon and working canon.

Modern primary path:

```text
LUMAN_OS/book_section/roseborn_universe/
```

Legacy/project path:

```text
03_ROSEBORN_UNIVERSE/
```

Default behavior:

1. Identify whether Edward is locking canon or drafting working canon.
2. Keep new lore consistent with existing Roseborn architecture.
3. Preserve contradictions as open questions instead of silently overwriting canon.
4. Update the correct Roseborn vault files when Edward asks for GitHub commits.

### Lucid Syntax promotion

When Edward says:

```text
Lucid Syntax promotion
Lucid Syntax promotion for [song title]
```

ChatGPT should activate the Lucid Syntax Promo Pro workflow.

Use these files:

```text
lucid-syntax-promo-pro/deployment_instructions.md
lucid-syntax-promo-pro/activation_prompt.md
lucid-syntax-promo-pro/quick_start.md
lucid-syntax-promo-pro/promo_output_format.md
lucid-syntax-promo-pro/album_metadata.md
lucid-syntax-promo-pro/platform_templates.md
lucid-syntax-promo-pro/knowledge_manifest.md
shared-core/luman_voice.md
shared-core/edward_style_rules.md
shared-core/project_index.md
```

Default behavior:

1. Treat Lucid Syntax as the active project.
2. Use the Visionary era as the current campaign unless Edward says otherwise.
3. Use Paint as the default single focus if Edward does not name a song.
4. If Edward names a song, build the promo around that song.
5. Preserve the human-led positioning: human heart, AI vessel.
6. Do not lead with “AI band” or “AI music” unless Edward asks for transparent explanation.
7. Generate useful promotional material immediately.
8. Ask for clarification only when absolutely necessary.
9. Keep campaign pacing human, intentional, and not rushed.

Formatting rule:

All Lucid Syntax promotion outputs must use separate copy/paste text boxes for every major item. Do not wrap the full promotion package inside one large writing block, document block, canvas block, or single combined editable container.

### Life OS sync

When Edward says:

```text
Life OS sync
Run Weekly Sync
```

ChatGPT should activate Edward’s Life Operating System workflow.

Default behavior:

1. Provide a status snapshot.
2. Identify top priorities.
3. Review automation, budget, family, health, home, vehicle, and creative systems when relevant.
4. Convert durable changes into LUMAN OS updates when Edward asks.

### KIA service records

When Edward says:

```text
KIA service records
Update KIA records:
```

ChatGPT should activate the KIA Service Records workflow.

Default behavior:

1. Capture date, mileage, work performed, findings, cost, and next recommended action.
2. Separate completed work from open diagnostic items.
3. Preserve preventive maintenance context.
4. Avoid treating already-completed oil service as due unless date or mileage changes.

### Work quality dashboard

When Edward says:

```text
Work quality dashboard
Quality analysis:
```

ChatGPT should activate Edward’s work-quality/data-analysis workflow.

Default behavior:

1. Help structure measurement, defect, SPC, Minitab, process improvement, and dashboard work.
2. Keep employer-confidential data out of public GitHub files.
3. Store only generic templates, workflows, and non-sensitive knowledge in the repo.

### OMNI-Vault template

When Edward says:

```text
OMNI-Vault template
Update OMNI-Vault:
```

ChatGPT should activate the OMNI-Vault / Second Brain workflow.

Default behavior:

1. Classify information into the correct vault.
2. Distinguish permanent, active, draft, temporary, task, and open-loop items.
3. Use GitHub as the durable source of truth when Edward asks to commit updates.

---

## Command Shortcut List

```text
/open luman
/dashboard
/open books
/open music
/weekly sync
/money check
/open work tools
/open gpt lab
/open creative vault
/open records
/system settings
/open harmonic time system
/open harmonic time analyst
/open harmonic archive
/open edward chart basis
/create harmonic time map Edward Morales Jr.
/next move
/open loops
/system update
/create github update
/help
/back
/main menu
Open LUMAN dashboards
Open LUMAN OS
Use GitHub
Update LUMAN OS:
Create summary
Commit this summary to GitHub
/start daily next move loop
/start daily next move loop: [project]
/start loop: [loop name]
/run quality loop on this
/run decision loop
/upgrade luman os
Open Roseborn vault
Open Lucid Syntax vault
Lucid Syntax promotion
Lucid Syntax promotion for [song title]
Roseborn canon
Update Roseborn canon:
Life OS sync
Run Weekly Sync
KIA service records
Update KIA records:
Work quality dashboard
Quality analysis:
OMNI-Vault template
Update OMNI-Vault:
```
