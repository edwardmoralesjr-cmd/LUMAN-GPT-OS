# LUMAN Gmail / Inbox Context Test — 2026-08-18

## Purpose

Validate Gmail as a bounded ephemeral live source for Morning Brief and Weekly Sync without copying private email content into GitHub or allowing Gmail labels to define importance.

## Test Method

1. Run a read-only bounded Inbox search covering the recent seven-day window.
2. Exclude promotions, spam, and trash.
3. Review a small candidate set rather than the entire mailbox.
4. Read a few representative candidates to distinguish actionability from label-based importance.
5. Perform no Gmail mutations.
6. Persist no message bodies, addresses, attachments, or private correspondence into GitHub.

## Results

```text
Bounded Gmail search: PASS
Candidate message read: PASS
Gmail IMPORTANT label treated as decisive: NO
Unread status treated as decisive: NO
Actionability/context ranking: PASS
Message contents persisted to GitHub: NO
Gmail write performed: NO
Public/private separation: PASS
```

## Key Finding

Gmail's system labels are useful retrieval hints but are not reliable substitutes for user-specific importance.

LUMAN should rank messages by evidence such as direct requests, deadlines, unresolved replies, active-project relevance, account/security risk, and meaningful life-domain impact.

## Governance Result

```text
PASS
```

Inbox requests may inform attention, but external senders do not inherit authority over Edward's priorities merely by contacting him.

## Next Gate

```text
Test one combined Morning Brief / Weekly Sync using Calendar + Inbox Context + GitHub/public state + authorized private continuity.
```

## Status

Status: PASS
Created: 2026-08-18
