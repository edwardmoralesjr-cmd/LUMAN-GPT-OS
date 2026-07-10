# LUMAN OS Source-of-Truth Matrix

## Purpose

This file defines which source owns each type of information inside LUMAN OS and what wins when sources disagree.

## Authority Order

Use this order unless a project-specific canon file defines a stricter rule:

```text
1. Published or explicitly Locked Canon material
2. Explicitly approved current source-of-truth file
3. Current project continuity, registry, or active module file
4. Current GitHub status and command files
5. User instruction in the active conversation
6. Saved memory and prior conversation summaries
7. Historical drafts, legacy alternatives, and archived files
8. Inference
```

A newer timestamp alone does not create authority. A copied or recently modified historical document may still be outdated.

## System Matrix

| Information Type | Primary Owner | Supporting Sources | Conflict Rule |
|---|---|---|---|
| LUMAN interface and menus | `LUMAN_OS/` | Root command surfaces | Modern interface wins for presentation |
| GitHub update protocol | `00_CORE/LUMAN_GITHUB_UPDATE_PROTOCOL.md` | System Settings | Core protocol wins for write discipline and security |
| Command routing | `00_CORE/LUMAN_COMMAND_ROUTING_INDEX.md` and `LUMAN_OS/MASTER_BRIDGE_INDEX.md` | Root menus and `COMMANDS.md` | Explicit routing index wins |
| Live priorities | `00_CORE/ACTIVE_PRIORITIES.md` | Master Command Center | Core file wins until formally migrated |
| Live open loops | `00_CORE/OPEN_LOOPS.md` | Project registries and dashboards | Core file wins until formally migrated |
| Cross-project orchestration | `LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md` | Project registry | Command center coordinates but never replaces project sources |
| Project state and ownership | `LUMAN_OS/system_settings/PROJECT_REGISTRY.md` | Project dashboards and changelogs | Project source controls content; registry controls portfolio state |
| Roseborn canon | Explicit Locked Canon, then active Roseborn continuity and Canon Guardian files | Legacy Roseborn vault | Do not infer resolution when conflicting structures remain open |
| Grand Generals continuity | Active Roseborn continuity and approved manuscript files | Chapter snapshots | New drafting must pass Canon Guardian clearance |
| Lucid Syntax lyrics and assets | Final approved asset files and release metadata | Music dashboards and session materials | Final approved asset outranks planning notes |
| Album roadmap | Current approved roadmap file or explicit Edward decision | Older concept lists | Preserve older versions as history, not active roadmap |
| Book project thesis and outline | Dedicated project command center | System registry and conversation memory | Dedicated project file wins once created |
| Life OS doctrine | `LUMAN_OS/life_os/` | Legacy Life OS | Modern doctrine wins unless a legacy source is explicitly preserved |
| Private financial state | Edward's private financial apps and current statements | Chat when explicitly supplied | Never treat public GitHub as the live financial ledger |
| Vehicle and home records | Private master records and original receipts | Public-safe templates | Original record wins; public GitHub stores structure only |
| Work and quality data | Approved non-confidential tools and current user-provided data | Generic templates | Never infer or publish employer-confidential information |
| Harmonic Time calculations | Documented chart-basis or reliable calculation source | Interpretive files | Provenance file wins; symbolic interpretation must be labeled |
| Session history | `06_SESSION_LOGS/` and project changelogs | Chat summaries | History informs but does not override current sources |

## Chat, Memory, and GitHub Roles

### Chat

```text
Living intelligence layer
```

Use for reasoning, creation, decision support, tool operation, and active updates.

### Memory

```text
Continuity and personalization layer
```

Use for durable preferences, active project context, and relevant life facts. Memory is not a substitute for detailed canon files, manuscripts, ledgers, or source documents.

### GitHub

```text
Durable public-safe external brain
```

Use for commands, governance, project structures, public-safe status, templates, canon systems, and reusable knowledge. Do not store secrets or private ledgers.

## Conflict Classification

When two sources disagree, classify the conflict as:

```text
Presentation Drift       = menus or commands describe the same function differently
Status Drift             = project stage or next action differs
Version Conflict         = competing drafts or structures claim current authority
Canon Contradiction      = two story facts cannot both be true
Ownership Ambiguity      = no source clearly owns the information
Privacy Boundary Conflict = useful information is unsafe for public storage
```

## Resolution Procedure

1. Identify the conflicting statements.
2. Cite the source path and authority level of each.
3. Check for explicit approval, publication, or Locked Canon status.
4. Select the winner only when authority is clear.
5. Preserve the losing version as archived history when useful.
6. Record unresolved conflicts instead of silently choosing.
7. Update routing, registry, continuity, and changelog files as needed.

## Non-Negotiable Security Rule

Never commit credentials, encryption seeds, account numbers, live balances, private medical records, confidential employer data, or sensitive family records to the public repository.

## Status

Status: Active  
Version: v1.0  
Created: 2026-07-10  
Owner: LUMAN OS System Settings

## Recommended Next Move

```text
Apply this matrix during the Roseborn architecture reconciliation and sovereignty-book ownership decision.
```