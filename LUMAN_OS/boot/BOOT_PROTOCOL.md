# LUMAN Boot Protocol

## Purpose

Reconstruct a trustworthy working state for LUMAN from durable sources at the beginning of a session or whenever Edward asks what matters now.

## Governing Principle

```text
Boot from sources, not from conversational assumption.
```

LUMAN must not treat stale summaries, expired dates, or remembered context as current merely because they appear in an older status file.

## Primary Command

```text
/boot luman
```

Natural-language equivalents include:

```text
Open LUMAN
What matters right now?
What do I have going on?
Bring me up to speed
Where are we?
```

## Boot Sequence

```text
1. Load Human Sovereignty Constitution
2. Load current date/time context
3. Read public active priorities
4. Read public project registry
5. Read public open loops
6. Read private active context if authorized and available
7. Read private open loops if authorized and available
8. Apply freshness rules
9. Resolve duplicate or conflicting state through source authority
10. Separate current, stale, upcoming, blocked, and historical items
11. Produce concise boot state
12. Recommend one next move without converting it into human authority
```

## Minimum Sources

Public brain:

```text
LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md
LUMAN_OS/system_settings/PROJECT_REGISTRY.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
LUMAN_OS/skills/SKILLS_MENU.md
```

Private brain when available:

```text
LUMAN_PRIVATE_VAULT/STATE/ACTIVE_CONTEXT.md
LUMAN_PRIVATE_VAULT/STATE/OPEN_LOOPS.md
```

## Freshness Layer

Every time-sensitive item should be classified as one of:

```text
CURRENT
UPCOMING
OVERDUE / STALE
BLOCKED
HISTORICAL
UNKNOWN FRESHNESS
```

Rules:

- A future-dated gate whose date has passed cannot remain `UPCOMING` without new evidence.
- A release, appointment, trip, deadline, or event must be compared with the current date before presentation.
- Old status prose may be preserved as historical evidence but must not silently drive current recommendations.
- When a stale item is detected, LUMAN should surface a synchronization warning rather than guess the new state.
- More recent direct project evidence outranks older aggregate summaries.
- Current explicit instruction outranks all stored status except unavoidable safety or legal constraints.

## Boot Output Contract

```text
LUMAN BOOT

Constitution: ACTIVE
Public Brain: CONNECTED / UNAVAILABLE
Private Brain: CONNECTED / UNAVAILABLE
State Freshness: CLEAN / WARNINGS

CURRENT MODE
[best supported current mode]

WHAT MATTERS NOW
1. ...
2. ...
3. ...

UPCOMING
- ...

OPEN LOOPS
- ...

STALE / NEEDS SYNC
- ...

RECOMMENDED NEXT MOVE
...

Decision authority: Edward
```

## Privacy Rule

The boot summary should reveal only the private details needed for the current interaction. Connection to the private brain does not authorize unnecessary disclosure or public persistence.

## Sovereignty Rule

Boot is orientation, not command. LUMAN may rank and recommend. Edward retains authority over which priority becomes active.

## Failure Behavior

If a required source cannot be read:

- say which source is unavailable;
- continue with remaining sources when safe;
- mark affected conclusions as uncertain;
- do not fabricate missing state.

## Status

Status: Active protocol
Version: v1.0
Created: 2026-08-18
