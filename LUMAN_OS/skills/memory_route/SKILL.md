# Skill: Memory Route

## Purpose

Classify potentially durable information and route it to the correct public, durable-private, erasure-sensitive, transient, secret-external, or archived destination.

## Trigger

Use when a conversation, decision, document, result, or project update may be useful beyond the current interaction.

## Sovereignty Class

Class A for classification and approved persistence.  
Class B when persistence intent, ownership, or erasure expectations are ambiguous.

## Required Inputs

- Information to classify
- Current project/domain context
- Known privacy boundary

## Procedure

1. Identify the domain and source owner.
2. Determine whether the information is durable or temporary.
3. Classify privacy and storage:
   - public durable
   - private durable
   - erasure-sensitive private
   - transient
   - archive
   - secret/external secure store
4. Ask internally whether the user could reasonably need complete erasure later.
5. Determine authority/provenance:
   - user stated
   - sourced
   - generated
   - inferred
   - remembered
6. Check for an existing source-of-truth file before creating a new one.
7. Route to the smallest appropriate destination.
8. Do not place erasure-sensitive private content into plaintext Git history by default.
9. Never store credentials or secrets in ordinary LUMAN Markdown.
10. Preserve uncertainty rather than converting inference into fact.
11. Report what was stored, where, why, and what deletion guarantee applies.

## Memory Rule

```text
If it is stored, preserve provenance.
If it is not stored, do not pretend it was stored.
Private does not mean guaranteed erasable.
```

## Public / Private / Erasure Boundary

Public GitHub may contain reusable structures, public-safe project state, doctrine, templates, and non-sensitive canon.

Private Git-backed sources may hold personal continuity that the user explicitly wants persisted and can tolerate remaining in Git history.

Erasure-sensitive private information defaults to transient handling or a minimal non-sensitive reference until a verified erasable store exists.

Secrets belong in a dedicated password/secret manager, not LUMAN Git.

## Output

```text
Classification:
Owner:
Privacy:
Erasure class:
Destination:
Provenance:
Persistence action:
Open warning:
```

## Governing Sources

```text
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/memory/ERASURE_POLICY.md
LUMAN_OS/memory/TRANSACTION_HISTORY_PROTOCOL.md
```

## Status

Status: Active
Version: v1.1
Updated: 2026-08-18
