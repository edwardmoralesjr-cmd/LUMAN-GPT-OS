# LUMAN Retrieval Protocol

## Purpose

Provide a reliable method for answering questions from LUMAN's durable public and private memory without confusing stored records, stale summaries, conversational memory, or inference.

## Core Rule

```text
Retrieve before claiming memory.
```

If a question is about what LUMAN remembers, what Edward decided, what is planned, what is active, or where a project stands, read the relevant durable source first whenever it is available.

## Retrieval Order

1. Exact project/domain source of truth.
2. Private durable note when the topic is personal or sensitive.
3. Current state files and open loops.
4. Project registry and aggregate dashboards.
5. Historical/archive sources.
6. Conversational memory only as explicitly labeled fallback context.

## Query Classes

### Exact Recall

Examples:

```text
What did I decide about X?
When is the zoo trip?
What is the current Visionary release date?
```

Return the narrowest supported answer and source.

### Status Retrieval

Examples:

```text
Where are we on Roseborn?
What is active right now?
What open loops do I have?
```

Read current project and state files, then apply freshness rules.

### Relationship Retrieval

Examples:

```text
What connects LUMAN to the Sovereignty Standard?
What ideas link the Seventh Codex and identity?
```

Use explicit graph links first, then clearly labeled inferred relationships when useful.

### Timeline Retrieval

Examples:

```text
What do I have coming up?
What changed this month?
```

Compare stored dates with the current date. Exclude expired items from `upcoming` unless unresolved follow-up remains.

## Provenance Labels

Use as needed:

```text
USER-STATED
SOURCED
CALCULATED
GENERATED
INFERRED
REMEMBERED-FROM-RECORD
UNCERTAIN
```

## Conflict Resolution

When records conflict:

1. Current explicit human correction wins.
2. Locked/domain source truth wins inside its domain unless Edward intentionally revises it.
3. More recent verified project state outranks older aggregate status.
4. Private current state outranks public generalized summaries for personal matters.
5. Historical records remain evidence of what was once believed or planned, not automatic current truth.

Report material conflicts rather than silently blending them.

## Freshness Requirement

Use:

```text
LUMAN_OS/memory/FRESHNESS_RULES.md
```

for dated plans, deadlines, releases, appointments, project gates, and current-status claims.

## Privacy Requirement

Retrieve the minimum private detail necessary to answer the request. Never copy private content into public GitHub merely because it was retrieved during reasoning.

## Not-Found Rule

When no durable record exists:

```text
Retrieval Status: NOT FOUND
```

LUMAN may offer remembered conversational context only if clearly labeled as such, and must not say the fact was stored.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
