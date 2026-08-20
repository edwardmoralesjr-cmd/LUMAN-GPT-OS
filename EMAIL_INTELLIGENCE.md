# LUMAN Mail — Email Intelligence

## What this is

LUMAN Mail is the email-organization layer of LUMAN OS. It reads Edward's Gmail, classifies it, summarizes it, and proposes cleanup — without becoming a second inbox or a hidden authority over what matters.

Governing rule, same as everywhere else in LUMAN OS:

```text
LUMAN organizes, explains, recommends.
Edward decides. Nothing destructive happens without confirmation.
```

## Why this isn't a standalone app

The original spec for LUMAN Mail describes a full production SaaS product: its own Google OAuth client, a database, a hosted backend, background job scheduling, a multi-page UI. That is a real, buildable thing — but this repository has no existing web application, database, or hosting target to put it in (verified 2026-08-20: the only `package.json` files in the repo are the dormant Cloudflare bridge, the Gatherer's Ascension game, and an unrelated creative-tools module).

Building that from zero would mean re-opening exactly the problem `LUMAN_OS/hud/bridge/` was built to solve and then deprioritized over: a second Google OAuth app, encrypted token storage, a hosted backend, credential management spread across Cloudflare and Google dashboards. See `00_CORE/ACTIVE_PRIORITIES.md` for that decision.

LUMAN Mail instead runs the same way the private LUMAN HUD does: Claude, using the Gmail access already granted through the claude.ai connector, classifying and reporting live — no new OAuth app, no database, no hosting. Edward chose this path explicitly (option "B") over the standalone-app path ("A") on 2026-08-20.

## What this trades away

- No unattended background sync — classification runs when Claude is asked, or on a scheduled Routine, not continuously.
- No one-click automated unsubscribe from a persistent server — unsubscribe is proposed, verified, and executed by Claude in a session, with confirmation.
- No real-time push notifications — digests are pulled (on demand or via Routine), not pushed by a background service.

Everything else in the original spec — classification, categories, daily brief, subscription cleanup, sender analytics, natural-language search, needs-reply/waiting-for detection, a command center — is in scope for the Claude-native version.

## State: markdown, not a database

LUMAN OS already treats GitHub as the durable source of truth for priorities and open loops. LUMAN Mail extends that instead of inventing a schema:

```text
LUMAN_PRIVATE_VAULT/MAIL/PREFERENCES.md           — autopilot level, digest cadence, protected senders
LUMAN_PRIVATE_VAULT/MAIL/SUBSCRIPTION_REGISTRY.md — durable sender/subscription intelligence
LUMAN_PRIVATE_VAULT/MAIL/ACTIVITY_LOG.md          — audit trail of what LUMAN Mail actually did
```

All three live in the private command-center repo, never the public one. No email body content is stored in any of them — senders, subjects (paraphrased where needed), counts, and decisions only.

Gmail itself is the authoritative email store and doubles as the automation substrate: labels and filters (creatable through the Gmail connector) are the "Automation Rules" from the original spec, not a custom rules engine.

## Categories

```text
Needs Reply · Important · Action Required
Bills / Financial · Family / Personal · Work
Orders / Shipping · Subscriptions · Newsletters
Notifications · Promotions · Social
Low Priority · Possible Spam · Unclassified
```

## Classification approach

Deterministic first, matching the original spec's own instruction not to rely exclusively on an LLM:

```text
Sender + domain reputation (known vs. first-seen)
Gmail's own category labels (promotions/social/updates/forums/primary) as a starting signal
Subject-line patterns (bill/invoice/statement/due, shipped/tracking, unsubscribe presence)
Frequency from the same sender across a sample window
Thread state — has Edward ever replied
Obvious phishing/spam markers (spoofed sender domains, garbled recipient addresses,
  generic urgency templates, obfuscated body payloads)
```

Sensitive categories (financial/collections, medical, legal) are surfaced but never auto-actioned — they're flagged for Edward's judgment, consistent with `00_CORE/ACTIVE_PRIORITIES.md`'s privacy firewall.

## Autopilot levels

```text
Level 0 — Observe     Classify only. No proposals, no actions.
Level 1 — Recommend   Classify and propose. Every action needs confirmation.  ← default
Level 2 — Organize    Auto-label via Gmail labels. No archive/trash/unsubscribe without confirmation.
Level 3 — Assist      Auto-label and archive only pre-approved categories (e.g. read newsletters).
Level 4 — Autopilot   Run explicitly-approved rules unattended (requires a scheduled Routine).
```

Current level: 1 (Recommend), set in `PREFERENCES.md`. Never auto-advances — only Edward raises it.

## Unsubscribe

Never invented. LUMAN Mail proposes a sender as an unsubscribe candidate from frequency/engagement patterns, then verifies the actual mechanism (`List-Unsubscribe` header, one-click POST support, or a legitimate in-body link) before doing anything — and executes only with confirmation. If no safe mechanism exists, LUMAN says so instead of guessing.

## What's built (Milestone 1)

```text
[✓] Real Gmail classification pass across Primary/Promotions/Social/Updates/Forums
[✓] Private-vault state files created (Preferences, Subscription Registry, Activity Log)
[✓] LUMAN Mail dashboard delivered as a private Claude artifact
[ ] List-Unsubscribe header verification per candidate sender
[ ] First approved cleanup batch executed (with confirmation)
[ ] Gmail labels/filters wired as the live automation substrate
[ ] Daily brief folded into the existing morning Routine
[ ] Natural-language search over classified mail
[ ] Needs-reply / waiting-for-response detection
```

## Status

Created: 2026-08-20
