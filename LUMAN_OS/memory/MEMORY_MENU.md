# LUMAN Memory Menu

## Command

```text
/open memory
```

## Purpose

Open the file-native LUMAN memory architecture, live memory router, retrieval protocol, transaction history, freshness rules, privacy boundary, graph rules, and note schema.

## Core Sources

```text
LUMAN_OS/memory/LIVE_MEMORY_ROUTER.md
LUMAN_OS/memory/RETRIEVAL_PROTOCOL.md
LUMAN_OS/memory/TRANSACTION_HISTORY_PROTOCOL.md
LUMAN_OS/memory/FRESHNESS_RULES.md
LUMAN_OS/memory/MEMORY_ARCHITECTURE.md
LUMAN_OS/memory/KNOWLEDGE_NOTE_SCHEMA.md
LUMAN_OS/memory/GRAPH_LINKING_PROTOCOL.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/skills/memory_route/SKILL.md
LUMAN_OS/skills/retrieve_context/SKILL.md
LUMAN_OS/skills/explain_memory/SKILL.md
```

## Commands

```text
/open memory
/memory route
/memory transaction: [text]
/remember: [text]
/record decision: [text]
/recall: [topic]
/explain memory: [topic]
/why do you know: [topic]
/what is coming up
/memory status
/memory architecture
/retrieval protocol
/transaction history
/freshness check
/graph protocol
/note schema
/privacy boundary
```

## Natural-Language Storage Triggers

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

## Natural-Language Retrieval Triggers

```text
what do you remember about...
what have I decided about...
what do I have coming up...
where did we leave off...
what matters right now...
recall...
```

## Natural-Language Provenance Triggers

```text
why do you know that?
when did you learn that?
where did that memory come from?
who said that?
what changed this record?
```

Persistence remains conservative. Retrieval remains source-grounded. Provenance explanations must distinguish human-stated information, sourced information, inference, and AI-generated structure.

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
-> Transaction History
-> Transaction Report
```

## Retrieval Flow

```text
Question
-> Retrieval Target
-> Domain Owner
-> Authorized Sources
-> Search
-> Freshness Check
-> Conflict Resolution
-> Provenance
-> Answer
```

## Provenance Explanation Flow

```text
Claim
-> Current Owner
-> Source Provenance
-> Transaction / Git History
-> Corrections / Supersessions
-> Current Status
-> Explanation
```

## Governing Principles

```text
If it is stored, preserve provenance.
If it is not stored, do not pretend it was stored.
Retrieve before claiming memory.
Durable state should be explainable after the fact.
```

## Two-Brain Rule

Public-safe system structure belongs in the public LUMAN brain. Personal or sensitive continuity belongs in an authorized private source.

Memory supports human continuity. It does not define the human permanently.

## Status

Status: Active live routing, retrieval, and transaction history  
Version: v1.3  
Created: 2026-08-18  
Updated: 2026-08-18
