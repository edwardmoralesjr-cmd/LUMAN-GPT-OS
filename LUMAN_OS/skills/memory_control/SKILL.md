# Skill: Memory Control

## Purpose

Apply explicit human corrections, supersessions, current-state deletions, and purge requests to durable LUMAN memory while preserving provenance and accurately describing storage limits.

## Trigger

Use when Edward says or clearly means:

```text
correct that memory
update what you remember
that is no longer true
supersede that
replace that memory
delete that memory
forget that from LUMAN
purge that completely
erase that everywhere you control
```

## Sovereignty Class

Class A for bounded correction, supersession, and `DELETE_CURRENT` within an identified authorized source.

Class B for purge planning or when the target/source scope is materially ambiguous.

Complete history rewriting is high impact and must not be treated as an ordinary memory edit.

## Required Inputs

- Memory target or topic
- Requested action
- Authorized source scope
- Replacement value when correcting or superseding

## Procedure

### Correction

1. Retrieve the current owning record.
2. Confirm provenance and source authority.
3. Apply the human-provided correction.
4. Record `CORRECT` in transaction history when materially useful.
5. Preserve prior history as historical unless deletion was separately requested.
6. Return the new current truth.

### Supersession

1. Retrieve the existing current record.
2. Create or identify the replacement record.
3. Mark the old record `SUPERSEDED` or otherwise remove it from current authority.
4. Link old -> new when useful.
5. Record `SUPERSEDE`.
6. Verify retrieval prefers the replacement.

### Delete Current

1. Retrieve every current owned record for the target within authorized scope.
2. Remove active content and active graph/open-loop references when appropriate.
3. Record `DELETE_CURRENT` using minimum necessary metadata if allowed.
4. Do not create a hidden duplicate.
5. Verify the current path/state no longer exposes the content.
6. Disclose that prior Git history may still retain committed versions.

### Purge Request

1. Treat complete purge as distinct from ordinary deletion.
2. Identify all known storage surfaces and Git refs that may contain the target.
3. Determine whether available tooling can actually rewrite/remove historical retention safely.
4. Do not claim success until historical erasure or practical irrecoverability is independently verified.
5. If the current toolchain cannot provide that guarantee, say so and preserve the request as `PURGE_REQUESTED` only if the user wants the request persisted.

## Erasure Vocabulary

```text
CORRECT
= change current truth

SUPERSEDE
= replace current authority while preserving historical provenance

DELETE_CURRENT
= remove from current state; Git history may remain

PURGE_REQUESTED
= user asked for complete erasure, not yet verified

PURGE_VERIFIED
= historical copies removed or rendered irrecoverable and verification completed
```

## Failure / Safety Behavior

- Never claim `PURGE_VERIFIED` because a current file returns 404.
- Never silently rewrite broad repository history to satisfy a casual delete request.
- Never preserve deleted private content in a new audit note.
- Never let an old memory outrank Edward's explicit current correction.
- If the target spans external systems LUMAN cannot control, state that scope limitation.

## Output Contract

```text
Memory Control: [CORRECTED / SUPERSEDED / DELETED_CURRENT / PURGE_REQUESTED / PURGE_VERIFIED / NOT CHANGED]
Target:
Current owner:
Current-state result:
Historical-retention status:
Transaction recorded: [yes/no]
Remaining uncertainty:
Decision authority: Edward
```

## Governing Sources

```text
LUMAN_OS/memory/ERASURE_POLICY.md
LUMAN_OS/memory/TRANSACTION_HISTORY_PROTOCOL.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
```

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
