# LUMAN Memory Control Test — 2026-08-18

## Purpose

Validate correction, supersession, current-state deletion, provenance, and Git-backed retention behavior without using real personal information.

## Test Data

Synthetic-only values were used on an isolated private test branch.

No real personal, family, financial, medical, relationship, credential, or location data was created for this test.

## Test 1 — Correction

Procedure:

1. Create a synthetic private memory record.
2. Change its current synthetic value.
3. Verify retrieval sees the corrected value as current.
4. Verify the earlier committed value remains explainable through history.

Result:

```text
PASS
```

Interpretation:

Correction can update current truth without pretending the earlier state never existed.

## Test 2 — Supersession

Procedure:

1. Create a new synthetic current record.
2. Mark the prior record as `SUPERSEDED`.
3. Link the historical record to its replacement.
4. Verify retrieval prefers the replacement rather than blending both records.

Result:

```text
PASS
```

Interpretation:

LUMAN can preserve historical provenance while maintaining one clear current source.

## Test 3 — Current-State Deletion

Procedure:

1. Delete both synthetic test files from the current private branch tree.
2. Attempt to retrieve both paths from current state.

Result:

```text
PASS
```

Both current paths returned Not Found.

Interpretation:

Ordinary Git deletion successfully removes a record from current working state.

## Test 4 — Historical Erasure

Procedure:

1. After current-state deletion, inspect an earlier commit that created the synthetic record.
2. Check whether the previously committed synthetic content remains present in commit history.

Result:

```text
FAIL — ORDINARY GIT DELETE IS NOT HISTORICAL PURGE
```

The earlier commit still exposed the synthetic test content.

Interpretation:

```text
private Git repository != guaranteed erasable memory
```

A file returning Not Found in the current tree is not evidence that its prior committed versions are erased.

## Architectural Change Required

LUMAN must distinguish:

```text
DELETE_CURRENT
PURGE_REQUESTED
PURGE_VERIFIED
```

and storage must distinguish:

```text
Transient
Public Durable
Private Durable
Erasure-Sensitive Private
Secrets
```

## New Routing Rule

Erasure-sensitive private information must not be persisted as plaintext Git history unless Edward explicitly chooses that durability tradeoff after the limitation is understood.

Until a verified erasable store exists, default to transient handling or a minimal non-sensitive reference.

## Sovereignty Result

```text
PASS AFTER ARCHITECTURAL CORRECTION
```

The test exposed a real limitation rather than allowing LUMAN to make an inaccurate deletion claim.

## Next Gate

```text
Update memory routing with erasure class
-> synchronize completed development gates
-> build correction/delete commands
-> then expand operational skills
```

## Status

Status: Completed
Created: 2026-08-18
