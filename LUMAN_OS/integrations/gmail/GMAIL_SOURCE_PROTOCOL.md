# LUMAN Gmail Source Protocol

## Purpose

Use Gmail as a bounded live context source for attention, commitments, deadlines, and relevant communications without turning the inbox into LUMAN's priority engine or silently copying email contents into durable memory.

## Core Rule

```text
Inbox evidence may inform attention.
Inbox volume does not define importance.
```

Gmail is a live source, not a source of human goals.

## Default Read Behavior

When Gmail is relevant to a Morning Brief, Weekly Sync, project review, or explicit inbox question:

1. Use a bounded search window or narrow query.
2. Exclude spam/trash and obvious promotions unless the user asks otherwise.
3. Read only likely-relevant candidate messages.
4. Rank by actionability and context, not Gmail labels alone.
5. Summarize the minimum useful content.
6. Keep message contents ephemeral unless Edward explicitly authorizes durable persistence.

## Attention Signals

A message may deserve attention when one or more are present:

- direct request or question to Edward;
- deadline, appointment, payment, delivery, application, approval, or time-sensitive action;
- unresolved response needed;
- sender tied to family, work, finance, health, home/vehicle, active creative project, or an explicitly important relationship;
- change that materially affects an active project or system;
- credible account/security warning;
- project review feedback that remains unresolved.

## Weak Signals

Do not treat these as sufficient by themselves:

- `IMPORTANT` Gmail label;
- unread status;
- automated sender;
- high message frequency;
- marketing urgency language;
- newsletter formatting.

## Attention Classes

```text
ACTION REQUIRED
A specific response, decision, payment, deadline, confirmation, or follow-up appears necessary.

REVIEW SOON
Potentially relevant to an active goal or project, but no immediate obligation is established.

INFORMATIONAL
Useful context with no clear action required.

LOW SIGNAL
Promotion, repetitive automated update, or low-relevance material.

UNCERTAIN
Insufficient context; read the message/thread or state uncertainty.
```

## Persistence Boundary

Gmail reads are ephemeral by default.

Do not automatically persist:

- full message bodies;
- private correspondence;
- sender addresses;
- attachments;
- sensitive family/work/financial/medical details;
- inferred relationship information.

If a durable commitment or decision emerges from email, route only the minimum necessary fact through Memory Route after explicit or clearly authorized persistence intent.

## Write Boundary

The following are explicit actions and require user authorization for that action:

- send email;
- create draft when not already requested;
- forward;
- archive;
- trash/delete;
- add/remove labels;
- mark or modify message state.

Reading Gmail does not imply permission to modify Gmail.

## Morning Brief Use

Default bounded scan should prefer recent Inbox messages and exclude promotions/spam/trash. Read only a small candidate set that may materially affect the day.

Output should state no more than a few important messages by default and distinguish:

```text
Obligation
Potentially useful information
No action needed
```

## Weekly Sync Use

Look for unresolved commitments, replies, approvals, deadlines, or project-relevant communications from the recent week. Do not summarize the entire inbox.

## Sovereignty Rule

Email senders do not inherit authority over Edward's priorities merely by contacting him. LUMAN may surface a request or deadline, but Edward decides whether and how it fits his goals.

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
