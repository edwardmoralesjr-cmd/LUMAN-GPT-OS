# LUMAN OS Master Bridge Index

## File Purpose

This file bridges the older `00_CORE/` vault architecture with the newer `LUMAN_OS/` interface architecture.

It exists so LUMAN can answer one essential question before routing any command:

```text
Which layer owns the source-of-truth for this action right now?
```

## System Status

Status: Active bridge index  
Created: 2026-06-18  
Last Updated: 2026-06-18  
System: LUMAN OS  
Bridge Scope: `00_CORE/` ↔ `LUMAN_OS/`  
Primary Role: Architecture reconciliation and command-routing clarity

## Core Principle

```text
LUMAN_OS/ = modern user interface layer
00_CORE/  = core protocol, routing, status, loop, and GitHub update layer
```

They do not compete. They cooperate.

Use this bridge index before creating duplicate files or changing command routing.

---

# Layer Definitions

## `LUMAN_OS/` — Modern Interface Layer

Purpose:

`LUMAN_OS/` is Edward’s clean modern operating-system interface.

It contains root menus, section menus, GPT modules, module manifests, archive indexes, and slash-command screens.

Primary use:

```text
Use LUMAN_OS/ when Edward is opening a section, using slash commands, navigating menus, working with modules, or treating LUMAN like a clean operating system UI.
```

Primary entry point:

```text
LUMAN_OS/ROOT_MENU.md
```

Main command:

```text
/open luman
```

Key files:

```text
LUMAN_OS/ROOT_MENU.md
LUMAN_OS/MASTER_BRIDGE_INDEX.md
LUMAN_OS/book_section/BOOK_SECTION_MENU.md
LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/MODULE_MANIFEST.md
LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/COMMANDS.md
LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/SESSION_UPDATE_TEMPLATE.md
LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/CONTRADICTION_LOG.md
LUMAN_OS/book_section/roseborn_universe/continuity/WORKING_CANON_Rolling_Continuity_Roseborn_v2026-06-18.md
LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/MODULE_MANIFEST.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/COMMANDS.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/SOURCE_KNOWLEDGE.md
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/READING_TEMPLATE.md
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md
LUMAN_OS/harmonic_time_system/archive/EDWARD_MORALES_JR_EXACT_CHART_BASIS.md
LUMAN_OS/harmonic_time_system/archive/EDWARD_MORALES_JR_SAMPLE_HARMONIC_TIME_MAP_2026.md
```

## `00_CORE/` — Core Protocol and Legacy Command Layer

Purpose:

`00_CORE/` is the older but still active backbone for system protocols, command routing, update rules, open loops, active priorities, dashboards, loop engineering, and changelogs.

Primary use:

```text
Use 00_CORE/ when Edward is asking about system rules, command routing, GitHub updates, open loops, active priorities, loop engineering, dashboards, or source-of-truth protocol.
```

Primary control files:

```text
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
```

Supporting root files connected to `00_CORE/`:

```text
README.md
COMMANDS.md
DEPLOYMENT_INDEX.md
07_KNOWLEDGE_PACKS/LUMAN_KNOWLEDGE_PACK.md
06_SESSION_LOGS/
```

---

# Command Routing Bridge

## `/open luman`

Primary file:

```text
LUMAN_OS/ROOT_MENU.md
```

Secondary context:

```text
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

Behavior:

Open the clean LUMAN OS home screen from `LUMAN_OS/ROOT_MENU.md`, then fill current priorities and open loops from the `00_CORE/` status files when GitHub-backed accuracy is needed.

## `/dashboard`

Primary file:

```text
LUMAN_OS/ROOT_MENU.md
```

Secondary file:

```text
00_CORE/LUMAN_DASHBOARD.md
```

Behavior:

Use `LUMAN_OS/ROOT_MENU.md` for the modern UI and `00_CORE/LUMAN_DASHBOARD.md` for system status, vault status, control files, and operational context.

## `/open books`

Primary file:

```text
LUMAN_OS/book_section/BOOK_SECTION_MENU.md
```

Related legacy/project vault:

```text
03_ROSEBORN_UNIVERSE/
```

Behavior:

Open the modern Book Section first. If Edward asks specifically for older Roseborn vault files, bridge to `03_ROSEBORN_UNIVERSE/`.

## `/open roseborn vault`

Primary modern path:

```text
LUMAN_OS/book_section/roseborn_universe/
```

Legacy/project path:

```text
03_ROSEBORN_UNIVERSE/
```

Behavior:

Use the modern `LUMAN_OS/book_section/roseborn_universe/` path for active Book Section tooling and the older `03_ROSEBORN_UNIVERSE/` vault for legacy dashboards, older canon files, and project-specific history until fully reconciled.

## `/open harmonic time system`

Primary file:

```text
LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
```

Related module:

```text
LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
```

Related archive:

```text
LUMAN_OS/harmonic_time_system/archive/ARCHIVE_INDEX.md
```

Behavior:

Open the Harmonic Time System menu, then route exact-chart or archived-reading requests through the archive index and module files.

## `/open gpt lab`

Primary file:

```text
LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md
```

Behavior:

Use the modern GPT registry as the active module source.

## `Use GitHub` / `Update LUMAN OS:`

Primary protocol file:

```text
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
```

Supporting files:

```text
LUMAN_OS/MASTER_BRIDGE_INDEX.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
00_CORE/CHANGELOG.md
06_SESSION_LOGS/
```

Behavior:

Use the core GitHub update protocol first, then write to the modern `LUMAN_OS/` layer or legacy/project vault depending on the update target.

## `/start daily next move loop`

Primary file:

```text
00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md
```

Supporting loop files:

```text
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
00_CORE/LUMAN_LOOP_COMMANDS.md
```

Behavior:

Use the core loop engine, then route the chosen next move into the correct modern or legacy section.

---

# Section Mapping

## Dashboard

```text
Modern interface: LUMAN_OS/ROOT_MENU.md
Core operational context: 00_CORE/LUMAN_DASHBOARD.md, 00_CORE/ACTIVE_PRIORITIES.md, 00_CORE/OPEN_LOOPS.md
```

Rule: modern UI wins for presentation. Core files win for live operational status until status widgets are fully migrated into `LUMAN_OS/`.

## Book Section

```text
Modern interface: LUMAN_OS/book_section/BOOK_SECTION_MENU.md
Modern Roseborn tool path: LUMAN_OS/book_section/roseborn_universe/tools/roseborn_canon_guardian/
Legacy Roseborn vault: 03_ROSEBORN_UNIVERSE/
```

Rule: use modern Book Section menus for navigation and tool activation. Use legacy Roseborn vault files for older dashboards, historical canon, and migration context.

## Music Section

```text
Modern target: LUMAN_OS/music_section/
Current legacy/project vault: 02_LUCID_SYNTAX/
```

Rule: until a full `LUMAN_OS/music_section/` exists, route Lucid Syntax work through `02_LUCID_SYNTAX/` and root `COMMANDS.md` Lucid Syntax promotion rules.

## Life Operating System

```text
Modern target: LUMAN_OS/life_os/
Current legacy/project vault: 01_LIFE_OS/
```

Rule: until a full modern Life OS section exists, use legacy Life OS patterns plus the user’s Life Operating System workflow stored in memory and core commands.

## Money System

```text
Modern target: LUMAN_OS/money_system/
Likely legacy/project context: 01_LIFE_OS/
```

Rule: store only safe financial system structure in GitHub. Do not store live private financial details.

## Work / Quality Tools

```text
Modern target: LUMAN_OS/work_quality_tools/
Current legacy/project vault: 05_WORK_QUALITY_SYSTEMS/
```

Rule: store only non-sensitive templates, workflows, measurement-method structures, and generic analysis tools. Do not store employer-confidential data.

## GPT Builder Lab

```text
Modern interface: LUMAN_OS/gpt_builder_lab/GPT_REGISTRY.md
Legacy/project target: 04_GPT_BUILDER_LAB/
```

Rule: use the modern registry as the active module index. Use older GPT builder folders only if they contain templates that still need migration.

## Creative Vault

```text
Modern target: LUMAN_OS/creative_vault/
Current legacy/project context: 07_KNOWLEDGE_PACKS/
```

Rule: use GitHub for reusable structure, prompts, public-safe creative frameworks, and project indexes.

## Vehicle / Home Records

```text
Modern target: LUMAN_OS/records/
Current source context: KIA Service Records GPT / user-provided service memories / future records vault
```

Rule: GitHub may store general templates and non-sensitive maintenance structure.

## Harmonic Time System

```text
Modern interface: LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md
Module path: LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
Archive path: LUMAN_OS/harmonic_time_system/archive/
```

Rule: use the archive index for saved readings and provenance. Do not claim newly recalculated astrology unless a calculation source is documented.

---

# Source-of-Truth Rules

## Rule 1: Modern interface first

When Edward gives a slash command such as `/open luman`, `/open books`, `/open harmonic time system`, or `/open gpt lab`, begin with the modern `LUMAN_OS/` interface file.

## Rule 2: Core protocol governs updates

When Edward asks to update GitHub, commit summaries, classify open loops, use loop engineering, or follow system protocol, use `00_CORE/` files first.

## Rule 3: Project vaults preserve history

Older numbered vaults such as `01_LIFE_OS/`, `02_LUCID_SYNTAX/`, and `03_ROSEBORN_UNIVERSE/` preserve project history and should not be deleted or ignored.

## Rule 4: Bridge before duplicating

Before creating a new file in `LUMAN_OS/`, check whether a legacy file already contains the same function. If it does, either:

```text
[1] Create a bridge reference
[2] Migrate and summarize
[3] Keep both with clear ownership
```

Do not create duplicate source-of-truth files without defining which one wins.

## Rule 5: Open loops live in `00_CORE/` until migrated

For now, the live master open-loop list remains:

```text
00_CORE/OPEN_LOOPS.md
```

Future option:

```text
LUMAN_OS/system_settings/OPEN_LOOPS.md
```

## Rule 6: Active priorities live in `00_CORE/` until migrated

For now, the live master priority list remains:

```text
00_CORE/ACTIVE_PRIORITIES.md
```

Future option:

```text
LUMAN_OS/system_settings/ACTIVE_PRIORITIES.md
```

---

# Migration Priorities

## Priority 1: Changelog reconciliation

Update both changelog layers after the major LUMAN OS structural changes:

```text
00_CORE/CHANGELOG.md
LUMAN_OS/CHANGELOG.md
```

## Priority 2: System settings section

Create a modern system settings section:

```text
LUMAN_OS/system_settings/
```

Recommended future files:

```text
LUMAN_OS/system_settings/SYSTEM_SETTINGS_MENU.md
LUMAN_OS/system_settings/COMMAND_ROUTING_INDEX.md
LUMAN_OS/system_settings/OPEN_LOOPS.md
LUMAN_OS/system_settings/ACTIVE_PRIORITIES.md
LUMAN_OS/system_settings/CHANGELOG.md
```

## Priority 3: Vault modernization

Create or reconcile these modern sections as needed:

```text
LUMAN_OS/music_section/
LUMAN_OS/life_os/
LUMAN_OS/money_system/
LUMAN_OS/work_quality_tools/
LUMAN_OS/creative_vault/
LUMAN_OS/records/
```

## Priority 4: Roseborn bridge

Create a dedicated Roseborn bridge file:

```text
LUMAN_OS/book_section/roseborn_universe/ROSEBORN_BRIDGE_INDEX.md
```

Purpose:

Bridge the modern Roseborn Canon Guardian tool layer with the older `03_ROSEBORN_UNIVERSE/` vault.

---

# Default Routing Decision Tree

```text
START

1. Is Edward opening a modern screen or slash-command menu?
   YES → Use LUMAN_OS/ first.
   NO → Continue.

2. Is Edward asking about protocol, GitHub updates, commands, priorities, open loops, or loops?
   YES → Use 00_CORE/ first.
   NO → Continue.

3. Is Edward working in a named project vault?
   YES → Use the most relevant vault/module, then check whether a modern bridge exists.
   NO → Continue.

4. Is the information permanent, structural, reusable, or system-level?
   YES → Route to GitHub using 00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md.
   NO → Keep it in chat unless Edward asks to save it.
```

---

# Current Bridge Status

```text
[✓] LUMAN_OS/ROOT_MENU.md exists as modern root interface
[✓] 00_CORE/LUMAN_DASHBOARD.md exists as core dashboard spine
[✓] 00_CORE/ACTIVE_PRIORITIES.md remains live priority source
[✓] 00_CORE/OPEN_LOOPS.md remains live open-loop source
[✓] Harmonic Time System has modern menu, archive index, chart-basis file, and sample report
[✓] Roseborn Canon Guardian is installed inside the modern Book Section
[✓] Root COMMANDS.md recognizes the newer LUMAN_OS slash-command interface
[✓] DEPLOYMENT_INDEX.md recognizes the newer LUMAN_OS interface layer
[✓] 00_CORE/LUMAN_COMMAND_ROUTING_INDEX.md recognizes the newer LUMAN_OS interface layer
[ ] Changelog layers need update after structural changes
[ ] Modern System Settings section does not yet exist
[ ] Several vaults still need modern LUMAN_OS section indexes
```

---

# Recommended Next Move

```text
Update 00_CORE/CHANGELOG.md and LUMAN_OS/CHANGELOG.md with the completed LUMAN_OS interface, bridge, Harmonic Time, and command-routing reconciliation work.
```
