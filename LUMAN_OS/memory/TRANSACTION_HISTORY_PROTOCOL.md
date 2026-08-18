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
SUPERSEDE
ARCHIVE
DELETE
CORRECT
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
5. Identify later corrections, supersessions, or archive events.
6. Explain current truth versus historical truth.

## Correction Rule

A correction should not silently erase provenance unless Edward explicitly requests deletion.

Preferred pattern:

```text
Old record -> superseded or corrected
New record -> current
Transaction log -> links the change
```

## Deletion Rule

When Edward explicitly requests deletion:

- delete the content within authorized scope;
- retain only the minimum audit metadata necessary if appropriate and not contrary to the deletion request;
- do not keep a hidden duplicate of deleted private content.

## Sovereignty Rule

Audit history exists to increase contestability and transparency. It does not make historical records authoritative over Edward's current identity, goals, beliefs, or decisions.

## Status

Status: Active protocol
Version: v1.0
Created: 2026-08-18
