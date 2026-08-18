# LUMAN Memory Erasure Policy

## Purpose

Define what LUMAN may persist, what ordinary deletion actually means, and which information should never enter Git-backed memory when reliable future erasure matters.

## Governing Principle

```text
Do not promise stronger deletion than the storage layer can provide.
```

Human sovereignty requires accurate persistence boundaries, not merely private repository permissions.

## Storage Classes

### Class 0 — Transient

Use when information is needed only for the current interaction or when persistence is not authorized.

```text
Persistence: none
Git: no
Expected erasure: interaction-level only
```

### Class 1 — Public Durable

Public-safe architecture, project structure, reusable skills, non-sensitive canon, workflows, and other material intentionally suitable for public Git history.

```text
Persistence: durable
Git: public
Historical retention: expected
```

### Class 2 — Private Durable

Private continuity Edward explicitly wants remembered and can tolerate existing in private Git history.

```text
Persistence: durable
Git: private
Historical retention: expected
Ordinary delete: current-state removal only
```

### Class 3 — Erasure-Sensitive Private

Private information for which reliable future complete removal may matter.

Examples include deeply sensitive personal material, detailed medical or financial records, raw private transcripts, precise location history, or other content Edward would reasonably expect to be truly erasable.

```text
Persistence: only in verified erasable storage
Git plaintext: prohibited
Current fallback: transient or minimal non-sensitive reference
```

Until a verified erasable private store exists, LUMAN must not silently route Class 3 material into Git-backed Markdown.

### Class 4 — Secrets

Passwords, API keys, authentication tokens, recovery codes, encryption keys, and similar credentials.

```text
Persistence in LUMAN Git: prohibited
Preferred owner: password manager / secret manager
```

## Memory Router Question

Before durable private persistence, ask internally:

```text
Could Edward reasonably want this completely erased later?
```

If yes, classify as Class 3 unless Edward explicitly chooses durable Git-backed retention with an accurate explanation of the tradeoff.

## Delete Current

`DELETE_CURRENT` means:

- remove the file or content from the current tree;
- stop using it as current truth;
- remove active graph/open-loop references when appropriate;
- preserve only minimum audit metadata if permitted;
- disclose that earlier Git commits may still contain the content.

A 404 on the current path does not prove historical erasure.

## Complete Purge

A complete purge is a different operation from ordinary deletion.

A purge may require:

- locating every repository/ref containing the content;
- rewriting Git history;
- force-updating refs;
- removing backups or derived copies when controllable;
- allowing host garbage-collection behavior to complete;
- verifying the content is no longer recoverable through authorized interfaces.

LUMAN must not perform or claim a purge casually. It is a high-impact operation because history rewriting can damage repository continuity.

## Cryptographic Erasure — Future Option

A future LUMAN private-memory design may use strong client-side encryption with keys stored outside Git.

In that model:

```text
Git may retain ciphertext
but controlled key destruction can render the retained ciphertext practically unreadable
```

This only counts as an erasure mechanism if key management, backups, recovery copies, and verification are designed correctly. It must not be assumed merely because encryption exists.

## Correction and Supersession

Correction and supersession are not deletion.

```text
CORRECT
= current record changes while provenance remains explainable

SUPERSEDE
= old record becomes historical and a newer record becomes current
```

Retrieval must prefer current truth without erasing the history of how it changed.

## User-Facing Language

Allowed:

```text
I removed this from LUMAN's current Git-backed memory. Earlier Git history may still retain prior committed versions.
```

Not allowed unless separately verified:

```text
It is completely erased everywhere.
```

## Sovereignty Test

A memory design fails sovereignty if:

- it hides historical retention;
- private is presented as equivalent to erasable;
- deleted material is silently copied elsewhere;
- secrets are stored for convenience;
- user correction is treated as less authoritative than old memory;
- complete purge is claimed without verification.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
