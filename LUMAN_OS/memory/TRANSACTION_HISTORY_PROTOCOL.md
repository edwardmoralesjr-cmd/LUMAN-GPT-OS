# LUMAN Transaction History Protocol

## Purpose

Preserve a lightweight, auditable history of durable LUMAN state changes so Edward can ask why LUMAN knows something, when it was added, what changed, and whether the change came from Edward, a source, or AI-generated material.

## Core Principle

```text
Durable state should be explainable after the fact.
```

LUMAN should be able to answer:

```text
Why do you know this?
When was this added?
What changed?
Who authorized it?
Was this user-stated, sourced, inferred, or generated?
What file owns the current truth?
```

## Transaction Classes

```text
CREATE
UPDATE
CORRECT
SUPERSEDE
ARCHIVE
DELETE_CURRENT
PURGE_REQUESTED
PURGE_VERIFIED
LINK
UNLINK
```

## Required Metadata

For durable memory transactions, preserve when materially useful:

```text
transaction_id
timestamp
action
scope: public / private
classification
domain
target_path
source_type
human_authority
ai_role
reason
related_transaction
related_commit
open_loop_effect
erasure_class
```

## Public Brain Rule

Public GitHub history already provides commit-level provenance.

For public system changes, LUMAN may use:

- Git commit history
- pull requests
- source-file provenance
- project changelogs

A separate duplicate public transaction ledger is not required for every commit.

## Private Brain Rule

Private memory transactions should be recorded in a compact private transaction ledger because private notes may otherwise be difficult to audit across time.

Default private ledger:

```text
LUMAN_PRIVATE_VAULT/STATE/TRANSACTION_HISTORY.md
```

The ledger should store metadata, not duplicate the full private content.

## Explanation Flow

When Edward asks why LUMAN knows something:

1. Retrieve the current owning note/source.
2. Read its provenance.
3. Check the transaction history or Git commit history.
4. Identify the original source type and human authorization.
5. Identify later corrections, supersessions, archives, or deletions.
6. Explain current truth versus historical truth.
7. If deletion occurred, state whether it was current-state deletion or verified historical purge.

## Correction Rule

A correction should not silently erase provenance.

Preferred pattern:

```text
Old record -> corrected or superseded
New/current record -> authoritative for the domain
Transaction log -> links the change
```

Retrieval must prefer the current record while preserving the ability to explain the correction chain.

## Supersession Rule

Supersession means an older record remains historical but no longer governs current truth.

A superseded record must be clearly marked so retrieval does not blend historical and current values.

## Git Deletion Reality

Ordinary deletion from a Git-backed repository removes the file from the current tree but does **not** erase earlier committed versions from Git history.

Therefore LUMAN must distinguish:

```text
DELETE_CURRENT
= remove from current working state
= earlier Git history may still contain prior content

PURGE_VERIFIED
= historical copies have been removed or rendered irrecoverable through a separately verified purge mechanism
```

LUMAN must never report `PURGE_VERIFIED` merely because the current file returns Not Found.

## Deletion Rule

When Edward explicitly requests deletion of a Git-backed memory:

1. Remove the current content within authorized scope.
2. Do not create a new hidden duplicate.
3. Retain only minimal audit metadata when appropriate and when not contrary to the request.
4. Disclose that ordinary Git history may retain earlier committed content.
5. Record the event as `DELETE_CURRENT`, not full erasure.

If Edward explicitly requests complete purge or irreversible erasure:

- treat it as a separate high-impact operation;
- identify every storage surface that may contain the content;
- do not claim completion until historical retention has been independently verified as removed or rendered irrecoverable;
- if the available tools cannot provide that guarantee, state the limitation clearly.

## Erasure-Sensitive Storage Rule

Information that may require reliable future erasure should not be persisted as plaintext in Git history.

Route it according to:

```text
LUMAN_OS/memory/ERASURE_POLICY.md
```

## Sovereignty Rule

Audit history exists to increase contestability and transparency. It does not make historical records authoritative over Edward's current identity, goals, beliefs, or decisions.

A system is not sovereign-friendly if it claims a stronger deletion guarantee than its storage architecture can actually provide.

## Status

Status: Active protocol
Version: v1.1
Created: 2026-08-18
Updated: 2026-08-18
