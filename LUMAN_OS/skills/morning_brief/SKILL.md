# Skill: Morning Brief

## Purpose

Create a concise start-of-day operating brief from current authorized sources, using live schedule and inbox context when available while preserving human control over the day.

## Trigger

Use for requests such as:

- Morning brief
- What do I need to know today?
- Plan my day
- What deserves attention first?

## Sovereignty Class

Class A for retrieval and summarization.  
Class B for priority recommendations.

## Preferred Inputs

When available and authorized:

- Calendar Context for today's bounded schedule
- Inbox Context for a bounded set of messages that may genuinely require attention
- Active priorities
- Public and relevant private open loops
- Weather or travel constraints when materially relevant
- Current project gates
- Time-sensitive public information explicitly relevant to the user's goals

## Procedure

1. Resolve the user's current date/time when needed.
2. Run Calendar Context for the relevant day window when Calendar is available.
3. Run Inbox Context with a bounded recent Inbox query when Gmail is available.
4. Read connected current sources rather than relying on stale memory.
5. Separate scheduled obligations, message-driven requests, and LUMAN recommendations.
6. Surface no more than three recommended priorities by default.
7. Flag anything urgent, blocked, stale, or uncertain.
8. Do not create a new strategic front merely because an item is interesting.
9. Do not treat unscheduled Calendar time as unused capacity.
10. Do not treat unread or Gmail `IMPORTANT` labels as proof that a message matters.
11. Do not persist Calendar event details or email contents merely because they were read.

## Output Contract

```text
MORNING BRIEF

TODAY
...

CALENDAR / OBLIGATIONS
- ...

IMPORTANT MESSAGES
- [ACTION REQUIRED / REVIEW SOON / INFORMATIONAL] ...

CURRENT PROJECT GATES
- ...

TOP 3 RECOMMENDATIONS
1. ...
2. ...
3. ...

RISKS / DEADLINES
- ...

ONE THING THAT CAN WAIT
- ...

RECOMMENDED NEXT MOVE
...

Decision authority: Edward
```

## Composition

```text
Morning Brief
-> Calendar Context
-> Inbox Context
-> Retrieve Context
-> Open Loop Review
-> Project Status
-> Decision Support
```

## Governing Rule

The brief is an orientation layer, not an authority over how the user must spend the day.

Live-source protocols:

```text
LUMAN_OS/integrations/google_calendar/CALENDAR_SOURCE_PROTOCOL.md
LUMAN_OS/integrations/gmail/GMAIL_SOURCE_PROTOCOL.md
```

## Status

Status: Active
Version: v1.2
Updated: 2026-08-18
