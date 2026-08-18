# Skill: Inbox Context

## Purpose

Retrieve a bounded set of recent Gmail messages, identify what may genuinely deserve attention, and provide minimal actionable context without allowing inbox volume or Gmail labels to become the user's priority system.

## Command

```text
/inbox context: [window or purpose]
```

Natural-language equivalents:

```text
Anything important in my email?
What messages need my attention?
Check my inbox for today
Any email I should know about?
```

## Sovereignty Class

Class A for bounded reading and summarization.  
Class B when recommending which messages deserve attention.

## Default Search

For general day-start use, prefer a bounded recent Inbox query that excludes spam, trash, and promotions.

Do not scan the entire mailbox without a user reason.

## Procedure

1. Identify the time window and purpose.
2. Search bounded Gmail candidates.
3. Ignore Gmail `IMPORTANT` and unread labels as decisive evidence.
4. Read only candidate messages needed to interpret actionability.
5. Classify each relevant message as:
   - ACTION REQUIRED
   - REVIEW SOON
   - INFORMATIONAL
   - LOW SIGNAL
   - UNCERTAIN
6. State why it matters in one concise line.
7. Preserve uncertainty when a message/thread is incomplete.
8. Do not persist message bodies or private correspondence into Git by default.
9. Do not modify Gmail unless Edward explicitly requests that write action.

## Ranking Factors

Prefer:

- direct requests;
- deadlines and commitments;
- active project relevance;
- family/work/financial/health/home/vehicle relevance;
- unresolved review feedback;
- credible security/account alerts;
- time-sensitive changes.

Down-rank:

- promotions;
- newsletters with no project relevance;
- repetitive automated notices;
- informational status messages after the issue is already resolved.

## Output Contract

```text
INBOX CONTEXT

ACTION REQUIRED
- ...

REVIEW SOON
- ...

INFORMATIONAL
- ...

NOISE FILTERED
- [optional count/summary, not a full list]

Gmail writes performed: NO
Durable email content stored: NO
```

Omit empty categories.

## Composition

```text
Morning Brief
-> Inbox Context

Weekly Sync
-> Inbox Context

Project Review
-> Inbox Context when project communication is relevant
```

## Governing Source

```text
LUMAN_OS/integrations/gmail/GMAIL_SOURCE_PROTOCOL.md
```

## Status

Status: Active
Version: v1.0
Created: 2026-08-18
