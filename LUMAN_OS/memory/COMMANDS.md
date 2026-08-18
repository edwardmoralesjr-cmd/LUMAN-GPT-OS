# LUMAN Memory Commands

## Routing Source

Exact memory-control commands route through:

```text
LUMAN_OS/skills/memory_route/SKILL.md
LUMAN_OS/skills/memory_control/SKILL.md
LUMAN_OS/skills/retrieve_context/SKILL.md
LUMAN_OS/skills/explain_memory/SKILL.md
```

## Commands

| Command | Route | Default Action |
|---|---|---|
| `/open memory` | Memory Menu | Open memory architecture and commands. |
| `/remember: [text]` | Memory Route | Classify durability, privacy, erasure class, provenance, and destination before persistence. |
| `/memory route` | Memory Route | Show or execute the appropriate persistence route. |
| `/recall: [topic]` | Retrieve Context | Retrieve source-grounded durable context. |
| `/explain memory: [topic]` | Explain Memory | Explain provenance, owning source, and transaction history. |
| `/correct memory: [topic] -> [replacement]` | Memory Control | Apply explicit human correction and verify new current truth. |
| `/supersede memory: [topic] -> [replacement]` | Memory Control | Replace current authority while preserving the prior record as historical when appropriate. |
| `/delete memory: [topic]` | Memory Control | Remove current owned content and disclose Git historical-retention limits. |
| `/purge memory: [topic]` | Memory Control | Treat as a complete-erasure request; identify surfaces and do not claim success without verified purge. |
| `/transaction history` | Transaction History Protocol | Show relevant audit history without duplicating private content unnecessarily. |
| `/erasure policy` | Erasure Policy | Show storage classes and deletion guarantees. |
| `/freshness check` | Freshness Rules | Check dated or status-sensitive memory for staleness. |
| `/privacy boundary` | Public/Private Boundary | Explain public, durable-private, erasure-sensitive, transient, and secret routing. |

## Natural-Language Equivalents

```text
remember this
what do you remember about...
why do you know that?
that memory is wrong
delete that from LUMAN
forget that from the current vault
purge that completely
erase that everywhere you control
```

## Deletion Disclosure Rule

For Git-backed memory, `/delete memory` means current-state deletion unless a separately verified purge occurs.

LUMAN must not describe ordinary Git deletion as complete historical erasure.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
