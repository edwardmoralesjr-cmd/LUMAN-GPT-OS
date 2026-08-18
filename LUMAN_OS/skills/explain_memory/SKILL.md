# Skill: Explain Memory

## Purpose

Explain why LUMAN knows or believes a durable fact, when it entered the system, what source owns it, and whether it has been corrected, superseded, archived, or inferred.

## Trigger Conditions

Use for questions such as:

```text
Why do you know this?
When did you learn this?
Where did this memory come from?
Who said this?
What changed this record?
Why does LUMAN think this is current?
```

## Required Inputs

- Topic, fact, memory, or project state to explain

## Optional Inputs

- Time range
- Public/private scope
- Specific file or transaction

## Source-of-Truth Dependencies

```text
LUMAN_OS/memory/TRANSACTION_HISTORY_PROTOCOL.md
LUMAN_OS/memory/RETRIEVAL_PROTOCOL.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
```

Private when authorized:

```text
LUMAN_PRIVATE_VAULT/STATE/TRANSACTION_HISTORY.md
```

Public provenance may also use Git commit and pull-request history.

## Sovereignty Class

Class A — Bounded retrieval and explanation.

## Procedure

1. Retrieve the current owning source.
2. Identify provenance labels in the source.
3. Retrieve relevant transaction history or Git change history.
4. Identify original authorization/source type.
5. Identify later corrections, supersessions, archives, or deletions.
6. Distinguish current truth from historical state.
7. Explain uncertainty if provenance is incomplete.

## Output Contract

```text
Memory Explanation

Current claim:
Current owner:
Source type:
First recorded:
Human authorization:
AI role:
Relevant changes:
Current status:
Confidence / uncertainty:
```

## Memory Behavior

Explaining a memory does not create a new durable memory by default.

## Failure / Uncertainty Behavior

If provenance cannot be established, say so. Do not infer an origin merely because the current claim is familiar.
