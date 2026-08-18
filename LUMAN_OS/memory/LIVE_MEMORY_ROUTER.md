# LUMAN Live Memory Router

## Purpose

Turn natural-language memory intent into a controlled, provenance-preserving memory transaction across LUMAN's public, durable-private, transient, and future erasable-memory surfaces.

## Governing Sources

```text
LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md
LUMAN_OS/skills/memory_route/SKILL.md
LUMAN_OS/memory/MEMORY_ARCHITECTURE.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/memory/ERASURE_POLICY.md
LUMAN_OS/memory/KNOWLEDGE_NOTE_SCHEMA.md
```

## Core Loop

```text
Natural-language input
-> detect memory intent
-> identify domain and owner
-> classify durability
-> classify privacy
-> classify erasure requirement
-> identify provenance
-> search for existing source of truth
-> choose smallest valid destination
-> persist only within authorized scope
-> link related nodes when useful
-> update live state only if the item creates an active commitment or open loop
-> report exactly what changed and what deletion guarantees apply
```

## Memory Intent Triggers

Explicit triggers include:

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

Implicit memory intent may be recognized when information is clearly durable and project-relevant, but persistence must remain conservative.

## Storage Classes

### PUBLIC DURABLE

Reusable architecture, public project doctrine, non-sensitive canon, templates, commands, and explicitly public project state.

### PRIVATE DURABLE

Private continuity Edward explicitly wants persisted and can tolerate remaining in private Git history.

This class is private, not guaranteed erasable.

### ERASURE-SENSITIVE PRIVATE

Information for which reliable future complete removal may matter.

Do not persist this as plaintext Git history by default. Until a verified erasable store exists, use transient handling or a minimal non-sensitive reference.

### SECRET

Credentials, passwords, API keys, seed phrases, encryption keys, recovery codes, access tokens, and similar secrets must not be stored in ordinary LUMAN Markdown.

### TRANSIENT

Do not persist when the information is useful only for the current interaction, persistence is declined, or the information is erasure-sensitive and no verified erasable store is available.

### ARCHIVE

Use when preserving superseded material is useful but it should no longer drive current state.

## Erasure Classification

Before durable private persistence, evaluate:

```text
Could Edward reasonably want this completely erased later?
```

If yes, classify it as erasure-sensitive unless Edward explicitly chooses durable Git-backed retention with the limitation understood.

## Provenance Labels

Every durable transaction should distinguish, when relevant:

```text
user-stated
sourced
calculated
generated
inferred
remembered-from-record
uncertain
```

Inference must never be silently promoted to user-stated fact.

## Existing-Source Rule

Before creating a new note:

1. Search for the existing project/domain source of truth.
2. Update that source when the new information clearly belongs there.
3. Create a new note only when the information has independent durable value or no appropriate source exists.
4. Preserve links to related nodes rather than duplicating large amounts of content.

## Correction Rule

Current explicit human correction outranks prior stored memory.

Use `CORRECT` when the same record remains the current owner and `SUPERSEDE` when a newer record replaces an older one.

Do not silently blend old and new values.

## Deletion Rule

For Git-backed memory:

```text
DELETE_CURRENT
= remove from current state
= earlier Git history may remain
```

Do not report complete erasure unless a separate purge has been verified.

## Decision Record Rule

For consequential decisions, prefer a private decision record that distinguishes Edward's decision from any LUMAN recommendation.

## Open-Loop Rule

A memory transaction updates `STATE/OPEN_LOOPS.md` only when the stored item creates a genuine unfinished commitment, follow-up, unresolved question, or future action.

Do not turn every remembered idea into a task.

## Write Confirmation

After a successful transaction, report:

```text
Memory Transaction: STORED
Storage class: [public durable/private durable/etc.]
Domain: [domain]
Destination: [repository/path]
Provenance: [label]
Erasure class: [historical retention expected / erasable / transient]
Graph links: [links or none]
Open-loop update: [yes/no]
Reason: [short explanation]
```

If nothing was written:

```text
Memory Transaction: NOT STORED
Reason: [transient / erasure-sensitive / secret / ambiguous / declined / duplicate]
```

## Sovereignty Rule

The existence of a memory record does not grant that record authority over Edward's current identity, goals, beliefs, or decisions. Current explicit instruction may correct, supersede, archive, or delete current memory.

LUMAN must not confuse private storage with guaranteed erasure.

## Status

Status: Active
Version: v1.1
Created: 2026-08-18
Updated: 2026-08-18
