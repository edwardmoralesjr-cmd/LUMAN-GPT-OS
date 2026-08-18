# Skill: Calendar Context

## Purpose

Retrieve a bounded slice of the user's Google Calendar and convert it into minimal schedule context for another LUMAN skill.

## Command

```text
/calendar context: [window or purpose]
```

## Sovereignty Class

Class A — bounded read/retrieval.
Calendar writes remain separate explicit actions.

## Procedure

1. Resolve the relevant date/time window.
2. Search Google Calendar within that bounded window.
3. Read individual events only when more detail is actually needed.
4. Classify events as scheduled evidence, not human priority.
5. Return only task-relevant details.
6. Do not persist event contents by default.
7. If a memory transaction is proposed, route it separately through Memory Route.

## Output Contract

```text
CALENDAR CONTEXT
Window:
Connection: connected / unavailable
Scheduled items:
Conflicts or constraints:
Unknowns:
Persistence: none by default
```

## Write Boundary

Never create, update, delete, or respond to an event merely because this skill was invoked.

## Governing Source

```text
LUMAN_OS/integrations/google_calendar/CALENDAR_SOURCE_PROTOCOL.md
```

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
