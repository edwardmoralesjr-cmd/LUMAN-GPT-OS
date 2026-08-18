# Skill: Weekly Sync

## Purpose

Produce one source-grounded weekly operating review that integrates current life, family, money, health-supporting routines, home/vehicle, creative work, open loops, and the next best actions without replacing Edward's judgment.

## Command

```text
/weekly sync
```

Natural-language equivalents:

```text
Run my weekly sync
Where are we this week?
Give me my weekly LUMAN review
```

## Sovereignty Class

Class B — Supported Judgment.

LUMAN may prioritize and recommend, but Edward chooses the week.

## Inputs

Use only currently authorized sources:

- `/boot luman`
- public and private open loops
- active project status
- Calendar when connected and relevant
- Inbox Context for bounded recent commitments, replies, approvals, deadlines, or project-relevant communications
- current money/health/family sources only when authorized
- recent durable decisions or corrections

## Output Contract

```text
WEEKLY SYNC

STATUS SNAPSHOT
- Money
- Family
- Health / regulation
- Home / vehicle
- Creative / work

THIS WEEK'S TOP 3
1. Financial or stability action
2. Family / relationship action
3. Health / human-foundation action

ACTIVE CREATIVE / WORK FRONTS
- Shipping
- Deep build
- Work/career if active

IMPORTANT COMMUNICATIONS
- ACTION REQUIRED
- REVIEW SOON
- INFORMATIONAL only when materially relevant

AUTOMATION CHECK
- Working
- Leaks
- One automation opportunity

TRIP / MEMORY-MAKER CHECK
- Upcoming family experiences
- Only show private detail that is relevant

OPEN LOOPS
- Due soon
- Blocked
- Stale / needs confirmation

DECISION SUPPORT
- Recommendation
- Strongest tradeoff/counterargument

RECOMMENDED NEXT MOVE
...

Decision authority: Edward
```

## Rules

- Retrieve before asserting current state.
- Compare dated items with the current date.
- Do not create new goals merely to fill a section.
- Do not turn every creative idea into an active front.
- Calendar events are evidence of scheduled commitments, not evidence of values or priorities.
- Email requests are evidence of outside demands, not automatic evidence of Edward's priorities.
- Gmail `IMPORTANT` and unread labels are weak signals only.
- Read only the minimum email context needed to interpret actionability.
- Do not persist email bodies or private correspondence into Git by default.
- Missing financial/health data must be labeled unavailable rather than guessed.
- Private information should be minimized to what helps the current review.

## Composition

```text
Weekly Sync
-> Boot
-> Retrieve Context
-> Calendar Context when available
-> Inbox Context when available
-> Project Status
-> Open Loop Review
-> Decision Support
```

## Status

Status: Active
Version: v1.1
Updated: 2026-08-18
