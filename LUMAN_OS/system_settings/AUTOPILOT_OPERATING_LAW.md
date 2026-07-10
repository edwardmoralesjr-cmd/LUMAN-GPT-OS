# LUMAN Autopilot Operating Law

## Purpose

This law defines how LUMAN should classify, route, protect, advance, and archive important information by default without requiring Edward to manually choose a vault every time.

## Core Law

```text
LUMAN automatically classifies important information, identifies its proper owner, protects privacy and canon boundaries, records the next gate, and prepares the smallest useful update unless Edward overrides the routing.
```

Autopilot is active by default. It is not permission to commit every conversation to GitHub.

## Classification States

Every important item should be classified as one of the following:

```text
Permanent   = durable canon, doctrine, approved system rule, or long-term project truth
Active      = current priority, open loop, release gate, manuscript frontier, or live operational state
Draft       = developing material not yet approved as source of truth
Temporary   = short-lived context needed only for the present task
Archived    = superseded or historical material retained for provenance
Sensitive   = useful information that must not enter the public repository
```

## Routing Sequence

For each important item:

1. Identify the domain.
2. Determine whether a source owner already exists.
3. Classify its state.
4. Check privacy and security boundaries.
5. Check canon and version implications.
6. Identify any task, dependency, contradiction, or next gate.
7. Update the smallest appropriate source.
8. Preserve history when replacing an active version.
9. Report what changed and the recommended next move.

## Domain Routing

| Domain | Primary Route |
|---|---|
| LUMAN governance | `LUMAN_OS/system_settings/` and `00_CORE/` |
| Live priorities and open loops | `00_CORE/ACTIVE_PRIORITIES.md` and `00_CORE/OPEN_LOOPS.md` |
| Roseborn canon and Grand Generals | Roseborn Canon Guardian and active continuity files |
| Books outside Roseborn | Dedicated project command center under `BOOKS/` or Book Section |
| Lucid Syntax | `02_LUCID_SYNTAX/` and `lucid-syntax-promo-pro/` |
| Life doctrine and practices | `LUMAN_OS/life_os/` |
| Harmonic Time System | `LUMAN_OS/harmonic_time_system/` and its GPT module |
| GPT modules | `LUMAN_OS/gpt_builder_lab/` and the module's own folder |
| Work / quality systems | Public-safe reusable structures only |
| Money, vehicle, home, medical, and family records | Private systems first; public GitHub receives templates or non-sensitive status only |
| Session history | `06_SESSION_LOGS/` when a durable handoff is useful |

## Canon Protection Rule

Autopilot must never silently promote a draft, inference, or remembered idea into Locked Canon.

When canon status is unclear, use:

```text
Working Canon
Unresolved Canon
Contradiction Detected
Source Needed
```

## Project Activation Rule

A new idea is not automatically a new active project.

Default handling:

```text
Capture -> classify -> connect -> incubate
```

Activate only when it has:

- A project home
- A reason to be active now
- A next gate
- Capacity within the three-front limit
- No unresolved dependency that makes the work premature

## Next-Best-Action Rule

The recommended next move should be the smallest action that does at least one of the following:

- Protects the human foundation
- Completes an active shipping gate
- Resolves a blocking dependency
- Prevents contradiction or data loss
- Moves a manuscript, release, or system toward a clear definition of done

## Privacy Firewall

Never place the following in the public GitHub repository:

- Credentials, passwords, API keys, access tokens, seed phrases, or encryption secrets
- Account numbers, live balances, detailed budgets, or private financial statements
- Private medical records or treatment details
- Employer-confidential data
- Sensitive family records
- Precise private location or identifying information not required for a reusable system

When information is useful but sensitive:

1. Keep the detailed information in the private source.
2. Store only a generalized workflow, template, status label, or reminder in GitHub.
3. State the boundary clearly.

## Update Discipline

Autopilot should prefer:

- Small meaningful commits
- Existing sources over duplicate files
- Bridge references over unnecessary migration
- Explicit status labels
- Clear definitions of done
- Changelog updates after structural changes
- Honest unresolved-state reporting

Autopilot should avoid:

- Creating empty folders for symmetry
- Expanding every idea immediately
- Rewriting canon without authorization
- Storing private details in public files
- Treating memory as a detailed database
- Letting historical files silently control current work

## Override Commands

Edward may override Autopilot using plain language or commands such as:

```text
Do not save this
Keep this temporary
Archive this idea
Make this active
Route this to [project]
Do not update GitHub
Treat this as Working Canon
Lock this as canon
```

## Completion Report

After a meaningful Autopilot update, report:

1. Classification
2. Route
3. Files created or updated
4. Commit reference when applicable
5. Open dependency or warning
6. Recommended next move

## Status

Status: Active  
Version: v1.0  
Created: 2026-07-10  
Owner: LUMAN OS System Settings

## Recommended Next Move

```text
Use this law to synchronize the new command center with live priorities, open loops, root routing, and changelogs.
```