# LUMAN GPT OS Deployment Index

## Current Deployment Architecture

LUMAN OS now runs through two cooperating layers:

```text
[1] LUMAN_OS/  = modern user interface, menus, modules, and slash-command screens
[2] 00_CORE/   = core protocols, command routing, GitHub update workflow, loops, priorities, open loops, and changelog
```

Bridge file:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
```

Default deployment rule:

```text
Deploy modern user-facing screens from LUMAN_OS/.
Deploy core protocols, safety rules, update rules, and loop logic from 00_CORE/ until they are migrated.
```

---

## Core LUMAN OS Protocols

```text
LUMAN_OS/ROOT_MENU.md
LUMAN_OS/MASTER_BRIDGE_INDEX.md
00_CORE/LUMAN_DASHBOARD.md
00_CORE/LUMAN_COMMAND_ROUTING_INDEX.md
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
00_CORE/LUMAN_LOOP_COMMANDS.md
00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
00_CORE/CHANGELOG.md
07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md
```

---

## Modern LUMAN OS Interface Files

```text
LUMAN_OS/ROOT_MENU.md
LUMAN_OS/MASTER_BRIDGE_INDEX.md
LUMAN_OS/book_section/BOOK_SECTION_MENU.md
LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md
```

## Modern GPT Modules

```text
LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
```

---

## Deployment-Ready GPTs / Systems

- Roseborn Canon Guardian
- Harmonic Time System Analyst
- Lucid Syntax Promo Pro
- Life Operating System
- OMNI-Vault GPT
- KIA Service Records GPT
- Work Quality Dashboard GPT

---

## Activation Commands

Edward can use short command phrases or slash commands to activate a workflow.

### /open luman

Activates the modern LUMAN OS root interface.

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

1. Open the clean root interface.
2. Show current top priorities.
3. Show current open loops.
4. Offer one Recommended Next Move.
5. Use the bridge index when routing is unclear.

### /dashboard / Open LUMAN dashboards

Activates the LUMAN OS dashboard layer.

Primary modern file:

```text
LUMAN_OS/ROOT_MENU.md
```

Core dashboard file:

```text
00_CORE/LUMAN_DASHBOARD.md
```

Default behavior:

1. Show the current system status.
2. Summarize active priorities.
3. Summarize open loops.
4. Show vault status.
5. List useful commands.
6. Give one next best action.

### Use GitHub

Activates the LUMAN GitHub update workflow.

Use this file:

```text
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
```

Supporting bridge:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
```

Default behavior:

1. Treat the repository as the source of truth for LUMAN GPT OS instructions and reusable systems.
2. Read the current target file before updating it when possible.
3. Keep updates clean, specific, and version-aware.
4. Avoid storing sensitive private material, employer-confidential data, or private family records.
5. Use platform-neutral language unless Edward names a specific tool for the task.

### Update LUMAN OS

Activates a direct memory/update workflow.

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

1. Determine which modern interface, legacy vault, or module the update belongs to.
2. Preserve durable facts in the correct knowledge pack, module file, archive file, or interface file.
3. Add active work to `00_CORE/ACTIVE_PRIORITIES.md` when it affects current focus.
4. Add unresolved work to `00_CORE/OPEN_LOOPS.md` when it needs follow-up.
5. Create a session log when the update represents a meaningful conversation or system change.

### Create summary

Activates the LUMAN session-summary workflow.

Use this file:

```text
00_CORE/LUMAN_CREATE_SUMMARY_PACKET_TEMPLATE.md
```

Default behavior:

1. Generate a LUMAN GitHub Update Packet.
2. Identify the main vault, secondary vaults, permanent updates, active updates, tasks, open loops, and files to update.
3. Provide exact Markdown for session logs, changelogs, active priorities, open loops, and knowledge packs when relevant.
4. Keep the packet usable for direct GitHub updates.

### Commit this summary to GitHub

Activates the summary-commit workflow.

Default behavior:

1. Convert the latest LUMAN GitHub Update Packet into real repository changes.
2. Create or update the session log, changelog, open loops, active priorities, and knowledge pack files.
3. Confirm changed files and commit SHAs back to Edward.
4. Do not add sensitive private information to repository files.

---

## Section Activation Commands

### /open books

Primary file:

```text
LUMAN_OS/book_section/BOOK_SECTION_MENU.md
```

Default behavior:

Open the writing, publishing, canon, Codex, manuscript, and story-development command center.

### /open roseborn vault

Modern path:

```text
LUMAN_OS/book_section/roseborn_universe/
```

Legacy/project vault:

```text
03_ROSEBORN_UNIVERSE/
```

Default behavior:

Use the modern Book Section tooling first, then bridge to older Roseborn vault files when needed.

### /open harmonic time system

Primary file:

```text
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
```

Related module:

```text
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
```

Archive index:

```text
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

Open Edward’s saved chart-basis/provenance file for exact-chart-supported readings.

### /create harmonic time map Edward Morales Jr.

Primary files:

```text
LUMAN_OS/harmonic_time_system/archive/EDWARD_MORALES_JR_EXACT_CHART_BASIS.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/READING_TEMPLATE.md
```

Default behavior:

Create a Harmonic Time Map using Edward’s saved chart basis and the official reading template. Do not claim newly recalculated astrology unless an actual calculation source is documented.

### /open gpt lab

Primary file:

```text
LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md
```

Default behavior:

Open Edward’s custom GPT registry, modules, knowledge files, prompt systems, audits, and upgrades.

---

## Loop Engineering Commands

Activates the LUMAN loop engineering layer.

Use these files:

```text
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
00_CORE/LUMAN_LOOP_COMMANDS.md
00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md
```

Available commands:

```text
/start daily next move loop
/start daily next move loop: [project]
/start loop: [loop name]
/run quality loop on this
/run decision loop
/upgrade luman os
```

Default behavior:

1. Load the relevant LUMAN context or vault.
2. Choose the smallest useful next action.
3. Execute or draft the action when possible.
4. Check the result for clarity, usefulness, safety, and project fit.
5. Log what changed.
6. Name the next step.

Core loop formula:

```text
LOAD -> CHOOSE -> ACT -> CHECK -> LOG -> NEXT
```

---

## Lucid Syntax Promotion

Activates:

```text
lucid-syntax-promo-pro/
```

Primary files:

```text
lucid-syntax-promo-pro/deployment_instructions.md
lucid-syntax-promo-pro/activation_prompt.md
lucid-syntax-promo-pro/quick_start.md
lucid-syntax-promo-pro/promo_output_format.md
lucid-syntax-promo-pro/album_metadata.md
lucid-syntax-promo-pro/platform_templates.md
lucid-syntax-promo-pro/knowledge_manifest.md
```

All-In-One Knowledge File:

```text
lucid-syntax-promo-pro/Lucid_Syntax_All_In_One_Knowledge_File_v5.txt
```

Use this file when building Words That Breathe song-specific promo packs.

Default behavior:

Generate Lucid Syntax promotional material using the standard promo package format.

If Edward says only:

```text
Lucid Syntax promotion
```

default to the Visionary era and Paint as the single focus.

If Edward says:

```text
Lucid Syntax promotion for [song title]
```

make that song the promo focus.

Required output sections:

1. Campaign Angle
2. Emotional Hook
3. Main Promo Caption
4. Platform Versions With Titles
5. Short-Form Video Script
6. Visual Direction
7. CTA
8. Exactly 5 Hashtags
9. Next Best Use

Formatting rule:

All full Lucid Syntax promotion packages must use separate copy/paste text boxes. Do not wrap the full promotion package inside one large writing block, document block, canvas block, or single combined editable container.

---

## Other Active Workflow Commands

```text
Life OS sync
Run Weekly Sync
KIA service records
Update KIA records:
Work quality dashboard
Quality analysis:
OMNI-Vault template
Update OMNI-Vault:
Roseborn canon
Update Roseborn canon:
Open Lucid Syntax vault
Open Roseborn vault
```

---

## How To Use

1. Open the desired GPT folder or LUMAN OS section in this repository.
2. For modern interface work, start from `LUMAN_OS/ROOT_MENU.md` or the relevant `LUMAN_OS/` section menu.
3. For command routing, update workflows, open loops, or loop engineering, start from `00_CORE/`.
4. Copy the full content of a deployment instruction file into the Custom GPT instruction field when deploying a standalone GPT.
5. Upload or reference supporting knowledge files from that same GPT folder, such as canon, metadata, templates, or safety rules.
6. Run the test prompts included in the deployment file to verify behavior.
7. Record changes, improvements, or issues in the relevant changelog.

---

## Safety Reminder

Keep private/sensitive information out of this repository and out of any Custom GPT connected to it. Each deployment file contains strict safety boundaries appropriate to its domain. Always follow those boundaries when using the GPTs.
