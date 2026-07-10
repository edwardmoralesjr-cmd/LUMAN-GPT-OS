# LUMAN OS Master Bridge Index

## Purpose

This file defines how the modern interface, System Settings orchestration layer, core protocol layer, legacy vaults, chat, memory, and project-specific sources cooperate.

Before routing a command or creating a new source, answer:

```text
Which layer owns the truth, which layer presents it, and which layer records the live state?
```

## System Status

Status: Active bridge index  
Version: v2.0  
Created: 2026-06-18  
Last Updated: 2026-07-10  
Primary Role: Architecture reconciliation, source ownership, and command-routing clarity

## Architecture Layers

### 1. Modern Interface Layer

```text
LUMAN_OS/
```

Owns:

- Root and section menus
- Modern GPT modules
- Active tool interfaces
- User-facing slash-command screens
- Modern continuity and archive indexes

Primary entry point:

```text
LUMAN_OS/ROOT_MENU.md
```

### 2. System Settings Orchestration Layer

```text
LUMAN_OS/system_settings/
```

Owns:

- Master Command Center
- Project Registry
- Source-of-Truth Matrix
- System audits
- Ninety-day execution paths
- Autopilot operating law
- Portfolio limits and cross-project dependencies

Primary entry points:

```text
LUMAN_OS/system_settings/SYSTEM_SETTINGS_MENU.md
LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md
```

Ownership boundary:

```text
System Settings coordinates project truth. It does not replace project truth.
```

### 3. Core Operational Layer

```text
00_CORE/
```

Owns:

- GitHub update protocol
- Live active priorities
- Live open loops
- Command-routing index
- Loop engineering
- Core dashboards
- Summary-packet rules
- Core changelog

Primary control files:

```text
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
00_CORE/LUMAN_COMMAND_ROUTING_INDEX.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
00_CORE/LUMAN_LOOP_ENGINEERING_SYSTEM.md
```

### 4. Project and Legacy Vault Layer

Examples:

```text
01_LIFE_OS/
02_LUCID_SYNTAX/
03_ROSEBORN_UNIVERSE/
04_GPT_BUILDER_LAB/
05_WORK_QUALITY_SYSTEMS/
07_KNOWLEDGE_PACKS/
BOOKS/
lucid-syntax-promo-pro/
```

Owns:

- Domain-specific assets
- Project history
- Manuscripts
- Canon and continuity
- Release metadata
- Specialized workflows
- Historical versions

Rule:

Legacy does not mean obsolete. Historical project vaults remain valid sources, but they must not silently outrank a newer explicitly approved source.

### 5. Chat and Memory Layer

```text
Chat   = living intelligence, reasoning, creation, and active tool operation
Memory = continuity, personalization, and durable high-level project context
```

Neither chat nor memory replaces detailed canon files, manuscripts, asset libraries, ledgers, receipts, or documented source material.

### 6. Private Source Layer

Owns information that must not enter the public GitHub repository:

- Credentials and encryption secrets
- Live financial details
- Medical records
- Sensitive family records
- Employer-confidential data
- Private vehicle, home, or legal records when detailed exposure is unnecessary

GitHub may store public-safe templates, generalized status, routing, and reusable structures only.

## Core Cooperation Rule

```text
LUMAN_OS/                  = presents and operates
system_settings/           = coordinates and governs
00_CORE/                   = tracks and controls live operations
Project vaults             = own domain truth
Chat                       = reasons and acts
GitHub                     = preserves public-safe durable state
Private systems            = retain sensitive details
```

These layers cooperate. They do not compete.

## Source-of-Truth Authority

Use:

```text
LUMAN_OS/system_settings/SOURCE_OF_TRUTH_MATRIX.md
```

Default authority order:

1. Published or explicitly Locked Canon material
2. Explicitly approved current source-of-truth file
3. Current project continuity, registry, or active module file
4. Current GitHub status and command files
5. Edward's explicit instruction in the active conversation
6. Saved memory and prior summaries
7. Historical drafts, legacy alternatives, and archives
8. Inference

A newer modification timestamp alone does not create authority.

## Command Routing Bridge

### `/open luman`

Primary:

```text
LUMAN_OS/ROOT_MENU.md
```

Supporting live state:

```text
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

### `/dashboard`

Primary orchestration:

```text
LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md
```

Supporting interface and operations:

```text
LUMAN_OS/ROOT_MENU.md
00_CORE/LUMAN_DASHBOARD.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

### `/system settings`

Primary:

```text
LUMAN_OS/system_settings/SYSTEM_SETTINGS_MENU.md
```

### `/open command center`

Primary:

```text
LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md
```

### `/source map`

Primary:

```text
LUMAN_OS/system_settings/SOURCE_OF_TRUTH_MATRIX.md
```

### `/project registry`

Primary:

```text
LUMAN_OS/system_settings/PROJECT_REGISTRY.md
```

### `/90 day path`

Primary:

```text
LUMAN_OS/system_settings/90_DAY_EXECUTION_PATH_2026-07-10.md
```

### `/autopilot law`

Primary:

```text
LUMAN_OS/system_settings/AUTOPILOT_OPERATING_LAW.md
```

### `Use GitHub` or `Update LUMAN OS:`

Primary protocol:

```text
00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md
```

Routing support:

```text
LUMAN_OS/system_settings/SOURCE_OF_TRUTH_MATRIX.md
LUMAN_OS/MASTER_BRIDGE_INDEX.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

### `/next move`

Use:

```text
LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
```

Choose the smallest action that protects the human foundation, completes the shipping gate, resolves a blocker, prevents contradiction, or advances the approved deep-building gate.

## Section Mapping

### Books

```text
Modern interface: LUMAN_OS/book_section/
Roseborn active tools: LUMAN_OS/book_section/roseborn_universe/
Roseborn legacy history: 03_ROSEBORN_UNIVERSE/
Other books: BOOKS/
```

Rule:

Project-specific canon and manuscripts own content truth. System Settings owns portfolio state and dependencies.

### Music

```text
Current active sources: 02_LUCID_SYNTAX/ and lucid-syntax-promo-pro/
Modern target: LUMAN_OS/music_section/
```

Current portfolio state:

```text
Visionary = Active Shipping
```

### Life OS

```text
Modern interface: LUMAN_OS/life_os/
Legacy history: 01_LIFE_OS/
```

Current foundation role:

Protect family peace, regulation, sustainable attention, and embodied action.

### Money

```text
Private live source: Edward's financial tools and current statements
Public-safe target: LUMAN_OS/money_system/
```

Rule:

Never treat public GitHub as the live ledger.

### Work and Quality

```text
Current project source: 05_WORK_QUALITY_SYSTEMS/
Modern target: LUMAN_OS/work_quality_tools/
```

Rule:

Store reusable non-confidential methods only.

### GPT Builder

```text
Modern interface: LUMAN_OS/gpt_builder_lab/
Legacy project context: 04_GPT_BUILDER_LAB/
```

### Creative Vault

```text
Current context: 07_KNOWLEDGE_PACKS/
Modern target: LUMAN_OS/creative_vault/
```

Default flow:

```text
Capture -> classify -> connect -> incubate
```

### Vehicle and Home Records

```text
Private original sources: receipts, service records, and detailed logs
Public-safe target: LUMAN_OS/records/
```

### Harmonic Time System

```text
Modern interface: LUMAN_OS/harmonic_time_system/
GPT module: LUMAN_OS/gpt_builder_lab/modules/harmonic_time_system_analyst/
Archive: LUMAN_OS/harmonic_time_system/archive/
```

## Portfolio Bridge

The command center limits default active strategic work to:

```text
[1] Human foundation
[2] One shipping project
[3] One deep-building project
```

Current fronts:

```text
[1] Life OS and family stability
[2] Visionary release assembly
[3] Roseborn architecture reconciliation and Grand Generals continuity
```

A project may remain operational or maintained without becoming an active strategic front.

## Current High-Impact Dependency Rules

### Roseborn

Series-level planning is blocked until these are reconciled:

```text
20-book recovered blueprint
23-book working architecture
21-book five-movement architecture
```

### Visionary

The next gate is verified release assembly, not additional concept generation.

### Sovereignty Framework

The Algorithm of the Shadow, Architect of Sovereignty, and Architecture of Consciousness require explicit ownership before thesis material is duplicated.

## Migration and Duplication Rules

Before creating a new file:

1. Search for an existing source.
2. Identify its authority and current state.
3. Choose one of these actions:

```text
Bridge
Migrate and summarize
Keep both with explicit ownership
Archive the losing version
```

Do not create duplicate sources without defining which one wins.

## Live Status Ownership

Until an explicit migration is approved:

```text
Live priorities = 00_CORE/ACTIVE_PRIORITIES.md
Live open loops = 00_CORE/OPEN_LOOPS.md
Portfolio coordination = LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md
Project state registry = LUMAN_OS/system_settings/PROJECT_REGISTRY.md
```

## Privacy Firewall

Never commit:

- Credentials, keys, tokens, passwords, or seed phrases
- Live balances or detailed financial records
- Medical records
- Employer-confidential information
- Sensitive family records
- Unnecessary private identifiers

## Maintenance Rule

When a major structural update occurs:

1. Update the relevant modern interface.
2. Update System Settings governance when portfolio ownership changes.
3. Update live priorities and open loops.
4. Update the command-routing index.
5. Update the relevant module changelog.
6. Create a session log when the change is substantial.
7. Preserve historical sources without allowing silent authority drift.

## Current Integrity State

```text
Modern interface: Active
System Settings orchestration: Active
Core protocol layer: Active
Project vault layer: Active
Source authority matrix: Active
Autopilot law: Active
Modern integration grade: A-
```

Remaining legacy synchronization:

- Mirror high-value System Settings commands into root `COMMANDS.md`
- Add the 2026-07-10 update to older top-level changelog surfaces
- Review `DEPLOYMENT_INDEX.md`

## Recommended Next Move

```text
Create the Visionary release-assembly inventory while Roseborn Canon Guardian prepares the three-version architecture reconciliation.
```