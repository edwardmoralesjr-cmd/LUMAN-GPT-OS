# LUMAN Memory Menu

## Command

```text
/open memory
```

## Purpose

Open the LUMAN memory architecture, live router, retrieval protocol, transaction history, erasure policy, freshness rules, privacy boundary, graph rules, and memory-control tools.

## Core Sources

```text
LUMAN_OS/memory/LIVE_MEMORY_ROUTER.md
LUMAN_OS/memory/RETRIEVAL_PROTOCOL.md
LUMAN_OS/memory/TRANSACTION_HISTORY_PROTOCOL.md
LUMAN_OS/memory/ERASURE_POLICY.md
LUMAN_OS/memory/FRESHNESS_RULES.md
LUMAN_OS/memory/MEMORY_ARCHITECTURE.md
LUMAN_OS/memory/KNOWLEDGE_NOTE_SCHEMA.md
LUMAN_OS/memory/GRAPH_LINKING_PROTOCOL.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/skills/memory_route/SKILL.md
LUMAN_OS/skills/memory_control/SKILL.md
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
/correct memory: [topic] -> [replacement]
/supersede memory: [topic] -> [replacement]
/delete memory: [topic]
/purge memory: [topic]
/what is coming up
/memory status
/memory architecture
/retrieval protocol
/transaction history
/erasure policy
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

## Natural-Language Memory-Control Triggers

```text
that memory is wrong
correct what you remember about...
replace that memory
that is no longer true
forget that from LUMAN
delete that memory
purge that completely
erase that everywhere you control
```

## Storage Classes

```text
Public Durable
Private Durable
Erasure-Sensitive Private
Transient
Archive
Secret / External Secure Store
```

Private Git-backed memory is durable but not guaranteed erasable. Erasure-sensitive private information must not be routed into plaintext Git history by default.

## Live Transaction Flow

```text
Input
-> Memory Intent
-> Domain / Owner
-> Privacy
-> Erasure Class
-> Provenance
-> Existing Source Check
-> Public / Private-Durable / Transient / External-Secure Route
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

## Memory-Control Flow

```text
Correction / deletion intent
-> Retrieve current owner
-> Determine CORRECT / SUPERSEDE / DELETE_CURRENT / PURGE_REQUESTED
-> Apply authorized change
-> Remove active references when appropriate
-> Record minimum transaction metadata
-> Verify current state
-> Disclose historical-retention status
```

## Provenance Explanation Flow

```text
Claim
-> Current Owner
-> Source Provenance
-> Transaction / Git History
-> Corrections / Supersessions / Deletions
-> Current Status
-> Explanation
```

## Governing Principles

```text
If it is stored, preserve provenance.
If it is not stored, do not pretend it was stored.
Retrieve before claiming memory.
Durable state should be explainable after the fact.
Private does not mean guaranteed erasable.
A 404 current path does not prove historical purge.
```

## Two-Brain Rule

Public-safe system structure belongs in the public LUMAN brain. Durable personal continuity may belong in the authorized private Git-backed brain when historical retention is acceptable.

Information that may require reliable complete erasure later should remain transient or use a future verified erasable store.

Memory supports human continuity. It does not define the human permanently.

## Status

Status: Active routing, retrieval, provenance, and memory control  
Version: v1.4  
Created: 2026-08-18  
Updated: 2026-08-18
