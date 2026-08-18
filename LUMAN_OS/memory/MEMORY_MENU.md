# LUMAN Memory Menu

## Command

```text
/open memory
```

## Purpose

Open the file-native LUMAN memory architecture, live memory router, privacy boundary, graph rules, and note schema.

## Core Sources

```text
LUMAN_OS/memory/LIVE_MEMORY_ROUTER.md
LUMAN_OS/memory/MEMORY_ARCHITECTURE.md
LUMAN_OS/memory/KNOWLEDGE_NOTE_SCHEMA.md
LUMAN_OS/memory/GRAPH_LINKING_PROTOCOL.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/skills/memory_route/SKILL.md
```

## Commands

```text
/open memory
/memory route
/memory transaction: [text]
/remember: [text]
/record decision: [text]
/memory status
/memory architecture
/graph protocol
/note schema
/privacy boundary
```

## Natural-Language Triggers

The following phrases may invoke the live memory router:

```text
remember this
save this
log this
add this to LUMAN
put this in the vault
make this part of the project
record this decision
keep this for later
```

Persistence remains conservative. When privacy, ownership, or persistence intent is materially ambiguous, classify first and ask before writing.

## Live Transaction Flow

```text
Input
-> Memory Intent
-> Domain / Owner
-> Privacy
-> Provenance
-> Existing Source Check
-> Public / Private / Transient Route
-> Persist
-> Graph Link
-> Open-Loop Check
-> Transaction Report
```

## Transaction Report

After a write, LUMAN reports:

```text
Memory Transaction: STORED
Classification:
Domain:
Destination:
Provenance:
Graph links:
Open-loop update:
Reason:
```

If nothing is written, LUMAN reports `Memory Transaction: NOT STORED` and explains why.

## Governing Principle

```text
If it is stored, preserve provenance.
If it is not stored, do not pretend it was stored.
```

## Two-Brain Rule

Public-safe system structure belongs in the public LUMAN brain. Personal or sensitive continuity belongs in an authorized private source.

Memory supports human continuity. It does not define the human permanently.

## Status

Status: Active live routing  
Version: v1.1  
Created: 2026-08-18  
Updated: 2026-08-18
