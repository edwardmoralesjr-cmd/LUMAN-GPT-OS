# LUMAN Skills Menu

## Command

```text
/open skills
```

## Foundation Skills

### `/boot luman`
Reconstruct current working state from authorized public/private sources with freshness checks.

Source: `LUMAN_OS/skills/luman_boot/SKILL.md`

### `/recall: [topic]`
Retrieve durable source-grounded context.

Source: `LUMAN_OS/skills/retrieve_context/SKILL.md`

### `/explain memory: [topic]`
Explain provenance, owning source, and transaction history.

Source: `LUMAN_OS/skills/explain_memory/SKILL.md`

### `/memory route`
Classify durability, privacy, erasure class, provenance, and destination.

Source: `LUMAN_OS/skills/memory_route/SKILL.md`

### Memory Control

```text
/correct memory: [topic] -> [replacement]
/supersede memory: [topic] -> [replacement]
/delete memory: [topic]
/purge memory: [topic]
```

Source: `LUMAN_OS/skills/memory_control/SKILL.md`

### `/calendar context: [window or purpose]`
Retrieve bounded Google Calendar context without persisting event contents by default or performing writes.

Source: `LUMAN_OS/skills/calendar_context/SKILL.md`

### `/inbox context: [window or purpose]`
Retrieve a bounded Gmail candidate set, read only what is needed to interpret actionability, and separate genuine attention needs from inbox noise.

Source: `LUMAN_OS/skills/inbox_context/SKILL.md`

## Daily / Weekly Operational Skills

### `/morning brief`
Combine current schedule, inbox attention context, priorities, open loops, project gates, and useful live context into a start-of-day orientation.

Source: `LUMAN_OS/skills/morning_brief/SKILL.md`

### `/weekly sync`
Run the recurring Life OS review across human foundation, family, money, health-supporting routines, home/vehicle, creative work, important communications, automation, and open loops.

Source: `LUMAN_OS/skills/weekly_sync/SKILL.md`

### `/family plan: [plan]`
Turn a family intention or outing into a private, practical plan with schedule/conflict checking and explicit-write boundaries.

Source: `LUMAN_OS/skills/family_plan/SKILL.md`

### `/project review: [project]`
Review one project's current truth, changes, blockers, open loops, freshness, and next gate.

Source: `LUMAN_OS/skills/project_review/SKILL.md`

### `/open loop review`
Review public and authorized private open loops; identify due, blocked, stale, closable, or incubating items without inventing completion.

Source: `LUMAN_OS/skills/open_loop_review/SKILL.md`

### `/capture idea: [idea]`
Capture, classify, connect, and preserve an idea without automatically activating a new project.

Source: `LUMAN_OS/skills/capture_idea/SKILL.md`

### `/release status: [release]`
Distinguish planned, assembly, upload-unverified, scheduled, released, historical, or blocked release states using current sources.

Source: `LUMAN_OS/skills/release_status/SKILL.md`

### `/evening close`
Close the day with evidence-based completion, carry-forward loops, durable-memory routing, and one next-session first move.

Source: `LUMAN_OS/skills/evening_close/SKILL.md`

## Existing Decision / Project Skills

### `/project status: [project]`
Read current project sources and return live operating state.

Source: `LUMAN_OS/skills/project_status/SKILL.md`

### `/decision support`
Compare meaningful options while preserving human decision authority.

Source: `LUMAN_OS/skills/decision_support/SKILL.md`

### `/sovereignty audit`
Evaluate behavior, workflows, memory practices, or modules against the Human Sovereignty Constitution.

Source: `LUMAN_OS/skills/sovereignty_audit/SKILL.md`

## Composition Rule

Complex workflows should compose small skills rather than expanding one opaque general agent.

```text
/open luman
-> Boot
-> Calendar Context when relevant
-> Inbox Context when relevant
-> Open Loop Review
-> Stable Root Shell
```

```text
Morning Brief
-> Calendar Context
-> Inbox Context
-> Retrieve Context
-> Open Loop Review
-> Project Status
-> Decision Support
```

```text
Weekly Sync
-> Boot
-> Calendar Context
-> Inbox Context
-> Project Review
-> Open Loop Review
-> Decision Support
```

```text
Family Plan
-> Retrieve Context
-> Calendar Context
-> Memory Route
-> Open Loop Review
```

```text
Evening Close
-> Calendar Context
-> Retrieve Context
-> Memory Route
-> Open Loop Review
```

## Live-Source Boundaries

### Calendar
Calendar reads are ephemeral context by default. Calendar create/update/delete/respond actions require explicit user authorization for that write.

Primary protocol:

```text
LUMAN_OS/integrations/google_calendar/CALENDAR_SOURCE_PROTOCOL.md
```

### Gmail
Gmail reads are ephemeral context by default. Inbox volume, unread status, and Gmail `IMPORTANT` labels do not define Edward's priorities. Sending, drafting, forwarding, archiving, trashing, or labeling messages requires explicit user authorization for that write.

Primary protocol:

```text
LUMAN_OS/integrations/gmail/GMAIL_SOURCE_PROTOCOL.md
```

## Status

Status: Active  
Version: v2.1-operational-live-sources  
Created: 2026-08-18  
Updated: 2026-08-18
