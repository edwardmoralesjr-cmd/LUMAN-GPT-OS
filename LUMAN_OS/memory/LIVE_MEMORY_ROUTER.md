# LUMAN Live Memory Router

## Purpose

Turn natural-language memory intent into a controlled, provenance-preserving memory transaction across LUMAN's public and private brains.

## Governing Sources

```text
LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md
LUMAN_OS/skills/memory_route/SKILL.md
LUMAN_OS/memory/MEMORY_ARCHITECTURE.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/memory/KNOWLEDGE_NOTE_SCHEMA.md
```

## Core Loop

```text
Natural-language input
-> detect memory intent
-> identify domain and owner
-> classify durability
-> classify privacy
-> identify provenance
-> search for existing source of truth
-> choose smallest valid destination
-> persist only within authorized scope
-> link related nodes when useful
-> update live state only if the item creates an active commitment or open loop
-> report exactly what changed
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

Implicit memory intent may be recognized when information is clearly durable and project-relevant, but persistence must remain conservative. If privacy, ownership, or persistence intent is materially ambiguous, classify first and ask before writing.

## Transaction Classes

### PUBLIC-SAFE

Use for reusable architecture, public project doctrine, non-sensitive canon, templates, commands, and explicitly public project state.

Default repository:

```text
edwardmoralesjr-cmd/LUMAN-GPT-OS
```

### PRIVATE

Use for personal reflections, private life context, family information, private financial state, health context, sensitive decisions, raw transcripts, and other personal continuity.

Default repository:

```text
edwardmoralesjr-cmd/LUMAN-GPT-Command-Center
LUMAN_PRIVATE_VAULT/
```

### SENSITIVE / SECRET

Credentials, passwords, API keys, seed phrases, encryption keys, access tokens, and similar secrets must not be stored in ordinary markdown memory.

### TRANSIENT

Do not persist when the information is useful only for the current interaction or the user declines persistence.

### ARCHIVE

Use when preserving superseded material is useful but it should no longer drive current state.

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

## Decision Record Rule

For consequential decisions, prefer a private decision record containing:

```text
Decision
Date
Goal / objective
Known facts
Uncertainties
Options considered
Tradeoffs
Edward's decision
AI recommendation, if any
Provenance
Related nodes
Review trigger, if any
```

LUMAN's recommendation must remain distinguishable from Edward's decision.

## Open-Loop Rule

A memory transaction updates `STATE/OPEN_LOOPS.md` only when the stored item creates a genuine unfinished commitment, follow-up, unresolved question, or future action.

Do not turn every remembered idea into a task.

## Write Confirmation

After a successful transaction, report:

```text
Memory Transaction: STORED
Classification: [public-safe/private/archive/etc.]
Domain: [domain]
Destination: [repository/path]
Provenance: [label]
Graph links: [links or none]
Open-loop update: [yes/no]
Reason: [short explanation]
```

If nothing was written:

```text
Memory Transaction: NOT STORED
Reason: [transient / ambiguous / sensitive-secret / declined / duplicate]
```

## Sovereignty Rule

The existence of a memory record does not grant that record authority over Edward's current identity, goals, beliefs, or decisions. Current explicit instruction may correct, supersede, archive, or delete prior memory.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
