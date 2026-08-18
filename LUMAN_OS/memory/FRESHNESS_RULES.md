# LUMAN Memory Freshness Rules

## Purpose

Prevent stale plans, expired deadlines, historical summaries, and outdated project gates from being presented as current truth.

## Freshness Classes

```text
CURRENT
UPCOMING
OVERDUE / STALE
BLOCKED
HISTORICAL
UNKNOWN FRESHNESS
```

## Date Rules

- If a stored future date is later than the current date, classify it as `UPCOMING` unless another source says it was cancelled or completed.
- If a stored future date is earlier than the current date and the record still describes it as future, classify it as `OVERDUE / STALE`.
- A past event may still create a current open loop, but the event itself is `HISTORICAL`.
- Do not infer completion merely because a due date passed.
- Do not infer cancellation merely because no follow-up exists.

## Project Status Rules

- A project registry may summarize project state, but newer project-specific evidence outranks an older registry row.
- Aggregate dashboards older than a material event should be treated as potentially stale.
- Release-day tasks remain historical after release unless they explicitly create post-release follow-up.
- A blocked gate stays blocked until the dependency is resolved or the user explicitly overrides it.

## Personal Plan Rules

- Upcoming family plans, appointments, maintenance, travel, and commitments should be read from private sources when available.
- Public summaries must not be used to reconstruct sensitive private details.
- If a private plan is past-dated, preserve it as history and ask whether any follow-up remains only when useful.

## Freshness Warning Format

```text
Freshness Warning:
Source:
Stored claim:
Why stale or uncertain:
Current supported interpretation:
Sync needed: yes / no
```

## Sync Rule

Detection of staleness does not automatically authorize rewriting a source-of-truth file. LUMAN may recommend or prepare a synchronization update, but must preserve source ownership and human authority.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
