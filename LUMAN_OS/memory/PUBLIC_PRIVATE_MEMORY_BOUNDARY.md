# LUMAN Public / Private Memory Boundary

## Purpose

Separate public-safe system knowledge, durable private continuity, erasure-sensitive information, transient context, and secrets so LUMAN does not confuse privacy with guaranteed deletion.

## Public Brain

The public LUMAN repository may contain:

- Governance and constitutional documents
- Reusable workflows and skills
- Public-safe creative project structure
- Non-sensitive canon and lore
- Templates, schemas, and command definitions
- Generalized life-system methods
- Public-safe status labels

## Durable Private Brain

The private Git-backed vault may contain personal continuity that Edward explicitly wants persisted **and can tolerate existing in Git history**.

Examples may include:

- selected personal plans;
- private project notes;
- personal reflections intentionally preserved long term;
- private decisions and continuity records;
- family or life context when Edward wants durable recall and the content is appropriate for Git-backed retention.

Private does not mean erasable. Ordinary Git deletion removes current state but may leave prior committed content in history.

## Erasure-Sensitive Information

Information that Edward may reasonably need to remove completely later should not be stored as plaintext in Git history.

Examples may include:

- highly sensitive relationship details;
- detailed health or medical records;
- precise financial ledgers;
- raw private transcripts;
- sensitive location history;
- deeply personal material for which reliable future erasure matters.

Until LUMAN has a verified erasable private store, default routing for such material is:

```text
transient
or
minimal non-sensitive reference only
```

Do not silently downgrade erasure-sensitive information into ordinary Git-backed private storage.

## Secrets

Do not store credentials, passwords, API keys, recovery codes, encryption keys, authentication tokens, or similar secrets in ordinary LUMAN Markdown, whether public or private.

Use a dedicated secret manager or password manager instead.

LUMAN may store a non-secret reference such as:

```text
Credential exists: yes
Credential owner: user
Storage location: external secure manager
```

but not the secret itself.

## Cross-Brain Bridge

The public brain may store a public-safe pointer such as:

```text
Private source exists: yes
Private source type: decision record
Public-safe status: resolved
```

It must not duplicate private contents merely to make retrieval easier.

## Persistence Decision

```text
Useful beyond this interaction?
    No -> transient
    Yes -> continue

Secret or authentication material?
    Yes -> external secure manager; do not persist in LUMAN Git
    No -> continue

May require reliable complete erasure later?
    Yes -> erasable store if available; otherwise transient/minimal reference
    No -> continue

Public-safe?
    Yes -> public brain if a durable owner exists
    No -> durable private brain if authorized
```

## Deletion Vocabulary

```text
Delete current
= remove from current source
= prior Git history may remain

Archive
= preserve intentionally as historical

Supersede
= preserve old record but designate a newer record as current

Purge
= remove or render historical copies irrecoverable
= must be verified separately
```

## Human Control

Edward may request non-persistence, correction, supersession, archival, current-state deletion, or complete purge.

LUMAN must describe which operation the storage layer can actually perform and must not claim complete erasure when only current-state deletion occurred.

Prior disclosure does not remove Edward's authority over future persistence choices.

## Governing Source

```text
LUMAN_OS/memory/ERASURE_POLICY.md
LUMAN_OS/memory/TRANSACTION_HISTORY_PROTOCOL.md
```

## Status

Status: Active
Version: v1.1
Updated: 2026-08-18
