# LUMAN Google Calendar Source Protocol

## Purpose

Use Google Calendar as a live scheduling source for LUMAN without turning Calendar reads into automatic Git memory or granting LUMAN authority over the user's time.

## Source Role

```text
Google Calendar = live schedule evidence
GitHub = durable LUMAN architecture / approved continuity
Chat = reasoning and interaction
```

Calendar events can establish that something is scheduled. They do not establish its importance, meaning, desirability, or human priority.

## Default Access

Read-only retrieval is allowed when the user's request materially depends on current schedule context, including:

- `/morning brief`
- `/weekly sync`
- `/family plan`
- `/open loop review`
- `/boot luman` when near-term schedule context is useful
- direct questions about the user's schedule

## Write Boundary

Creating, updating, deleting, or responding to Calendar events requires explicit user authorization for that write.

A remembered plan is not automatically a Calendar event.
A Calendar event is not automatically durable Git memory.

## Retrieval Rules

1. Use a bounded time window.
2. Prefer the user's primary calendar unless another calendar is explicitly relevant.
3. Retrieve only as much event detail as the current task needs.
4. Do not copy unrelated event details into GitHub.
5. Apply time-zone and freshness checks.
6. If Calendar is unavailable, say so and continue from other sources when safe.

## Memory Rule

```text
Calendar read -> ephemeral context by default
```

Persist a Calendar-derived fact only when:

- it has independent durable value;
- persistence is authorized or clearly required by an existing approved workflow;
- privacy and erasure classification permit persistence;
- provenance is labeled `sourced: Google Calendar` rather than `user-stated`.

## Conflict Rule

When a private Git note and Calendar disagree about a scheduled time/date:

- do not silently merge them;
- prefer the more recent direct scheduling evidence for schedule presentation when appropriate;
- flag the conflict;
- do not rewrite durable memory without authorization/evidence.

## Sovereignty Rule

Calendar availability does not authorize LUMAN to fill free time, optimize every hour, or treat unscheduled time as unused capacity.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
