# LUMAN OS Source-of-Truth Matrix

## Purpose

Define which source owns each type of information inside LUMAN OS and what wins when sources disagree.

## Authority Order

Use this order unless a project-specific canon file defines a stricter rule:

```text
1. Published or explicitly Locked Canon material
2. Explicitly approved current source-of-truth file
3. Current project continuity, release canon, registry, or active module file
4. Current GitHub status and command files
5. Edward's instruction in the active conversation
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
| Cross-project orchestration | `LUMAN_OS/system_settings/MASTER_COMMAND_CENTER.md` | Project Registry | Command Center coordinates but never replaces project sources |
| Project state and ownership | `LUMAN_OS/system_settings/PROJECT_REGISTRY.md` | Project dashboards and changelogs | Project source controls content; registry controls portfolio state |
| Roseborn canon | Explicit Locked Canon, then active Roseborn continuity and Canon Guardian files | Legacy Roseborn vault | Active approved canon wins; unresolved material must be labeled |
| Roseborn series architecture | `BOOKS/roseborn-universe/MASTER_SERIES_ARCHITECTURE_21_BOOK_WORKING_CANON.md` | Decision records and archives | 21-book structure is active Working Canon; 23 is archived; unrecovered 20 is non-governing history |
| Grand Generals continuity | Active Roseborn continuity and approved manuscript files | Chapter snapshots | New drafting must pass Canon Guardian clearance |
| Music section navigation and portfolio state | `LUMAN_OS/music_section/MUSIC_SECTION_MENU.md` | Command Center and Registry | Modern Music Section wins for presentation and project routing |
| Lucid Syntax release dates and sequence | `02_LUCID_SYNTAX/VISIONARY_RELEASE_CANON_2026.md` | Dashboard and distribution records | Release-canon file wins until Edward explicitly revises it |
| Lucid Syntax lyrics and final assets | Final approved asset files and release metadata | Music dashboards and session materials | Final approved asset outranks planning notes |
| Lucid Syntax album roadmap | `02_LUCID_SYNTAX/LUCID_SYNTAX_7_ALBUM_ROADMAP.md` | Older concept lists | Current roadmap is Working Canon; preserve older versions as history |
| Lucid Syntax promotion system | `lucid-syntax-promo-pro/` plus current release canon | Music Section and dashboard | Promo system controls output structure; release canon controls current dates and focus |
| Infinite Bloom Music project identity | `LUMAN_OS/music_section/infinite_bloom_music/PROJECT_MANIFEST.md` | Music Section and Registry | Manifest wins for project identity and separation from Lucid Syntax |
| Infinite Bloom Music sound | `LUMAN_OS/music_section/infinite_bloom_music/CANONICAL_SOUND_LAW.md` | Song identity sheets | Sound law wins unless Edward explicitly revises it |
| Infinite Bloom dragon-cycle album order | `LUMAN_OS/music_section/infinite_bloom_music/DRAGON_CYCLE_ALBUM_MAP.md` | Roseborn dragon sources | Album map controls music order; Roseborn canon controls lore truth |
| Dragon lore used in music | Roseborn Canon Guardian and active Roseborn canon sources | Music interpretation files | Music may interpret canon but may not silently invent it |
| Book project thesis and outline | Dedicated project command center | System Registry and conversation memory | Dedicated project file wins once created |
| Life OS doctrine | `LUMAN_OS/life_os/` | Legacy Life OS | Modern doctrine wins unless a legacy source is explicitly preserved |
| Private financial state | Edward's private financial apps and current statements | Chat when explicitly supplied | Never treat public GitHub as the live financial ledger |
| Vehicle and home records | Private master records and original receipts | Public-safe templates | Original record wins; public GitHub stores structure only |
| Work and quality data | Approved non-confidential tools and current user-provided data | Generic templates | Never infer or publish employer-confidential information |
| Harmonic Time calculations | Documented chart-basis or reliable calculation source | Interpretive files | Provenance file wins; symbolic interpretation must be labeled |
| Session history | `06_SESSION_LOGS/` and project changelogs | Chat summaries | History informs but does not override current sources |

## Current Music Authority Snapshot

```text
Paint          Released July 3, 2026
In-Between     Next single, late July 2026 target
Three Colors   Pre-album single, late August or early September target
Visionary      Album launch September 25, 2026
```

```text
Lucid Syntax = Active Shipping
Infinite Bloom Music = Protected secondary build
```

The separate Infinite Bloom project does not replace or rename Lucid Syntax Album 6. They are distinct music projects even when both draw from the Infinite Bloom cosmology.

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
Presentation Drift        = menus or commands describe the same function differently
Status Drift              = project stage, date, or next action differs
Version Conflict          = competing drafts or structures claim current authority
Canon Contradiction       = two story facts cannot both be true
Ownership Ambiguity       = no source clearly owns the information
Project Identity Collision = two distinct projects are being merged or mislabeled
Privacy Boundary Conflict = useful information is unsafe for public storage
```

## Resolution Procedure

1. Identify the conflicting statements.
2. Cite the source path and authority level of each.
3. Check for explicit approval, publication, Locked Canon, release canon, or Working Canon status.
4. Select the winner only when authority is clear.
5. Preserve the losing version as archived history when useful.
6. Record unresolved conflicts instead of silently choosing.
7. Update routing, registry, continuity, release-canon, and changelog files as needed.

## Non-Negotiable Security Rule

Never commit credentials, encryption seeds, account numbers, live balances, private medical records, confidential employer data, sensitive family records, or private distribution credentials to the public repository.

## Status

Status: Active  
Version: v1.1  
Created: 2026-07-10  
Updated: 2026-07-12  
Owner: LUMAN OS System Settings

## Recommended Next Move

```text
Use the release canon for the In-Between packet and Roseborn Canon Guardian for the Elarion lore audit.
```
