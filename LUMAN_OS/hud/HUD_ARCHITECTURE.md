# LUMAN HUD Architecture

## Constitutional Role

The HUD is a presentation and command surface. It is not a source of truth, a memory authority, or a decision authority.

```text
Edward
  ↓
LUMAN
  ↓
Source retrieval / live connectors
  ↓
HUD render
```

The HUD may visualize current state and prepare bounded actions, but it must not create facts merely because something is displayed.

## Source Contract

### Browser-Safe Direct Sources

The V1 public HUD may directly read public-safe repository state from the public GitHub `main` branch.

```text
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
LUMAN_OS/system_settings/PROJECT_REGISTRY.md
LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md
```

These direct reads are intentionally read-only.

### Authenticated Sources

The following sources are **not** browser-direct in a public deployment:

```text
Private GitHub vault
Google Calendar
Gmail
future sensitive integrations
```

They require an authenticated LUMAN bridge that applies the existing privacy, sovereignty, retrieval, and write-authorization rules before returning minimum necessary display data.

## Future Bridge Contract

A future authenticated bridge should return a minimum-data view model rather than raw source dumps.

Example shape:

```json
{
  "generated_at": "2026-08-18T10:45:00-05:00",
  "sources": {
    "public_brain": { "status": "connected" },
    "private_brain": { "status": "connected" },
    "calendar": { "status": "connected" },
    "gmail": { "status": "connected" }
  },
  "today": {
    "calendar_summary": [],
    "important_message_summary": []
  },
  "private_minimum": {
    "upcoming_commitments": []
  }
}
```

The bridge should minimize source content before it reaches the browser. Raw email bodies, raw private notes, and complete calendar descriptions should not be sent when a short summary is sufficient.

## Read Path

```text
HUD refresh
  ↓
Public GitHub direct reads
  +
Authenticated bridge reads (future)
  ↓
Freshness / source labels
  ↓
Render
```

Source failures should be visible as source failures. Missing connector data must never be filled with guesses.

## Action Path

V1:

```text
HUD button
  ↓
Prepare/copy LUMAN command
  ↓
Connected LUMAN/ChatGPT
  ↓
Existing skill / sovereignty / write controls
```

Future:

```text
HUD bounded action
  ↓
Authenticated LUMAN action bridge
  ↓
Intent router
  ↓
Sovereignty Guardian
  ↓
Skill
  ↓
Explicit write authorization where required
  ↓
Tool action
  ↓
Transaction / provenance report
```

## Non-Negotiable Rules

1. HUD prominence does not grant priority authority.
2. Inbox urgency does not become human priority automatically.
3. Unscheduled calendar time is not treated as unused capacity.
4. Private data is minimized and never copied into public GitHub state.
5. HUD cache/state is disposable; authoritative state remains with owning sources.
6. Actions that write to Calendar, Gmail, GitHub, memory, or another external system retain their existing authorization rules.
7. A disconnected source is labeled disconnected or bridge-required rather than simulated.
8. Human Authority status must remain visible in the primary interface.

## V1 Information Architecture

```text
Header / local time
  ↓
Sovereignty + source status
  ↓
Top 3 + Three Strategic Fronts
  ↓
Active Projects + Open Loops
  ↓
Current LUMAN Build Gate
  ↓
Bounded Command Deck
```

## V2 Gate

V2 begins only after V1 public-state rendering is reliable in production.

Next capabilities:

1. authenticated minimum-data bridge for private brain;
2. authenticated Calendar summary;
3. authenticated Inbox Context summary;
4. bounded action dispatch;
5. optional local/session-only HUD preferences;
6. voice only after HUD/data/action boundaries remain stable.

## Status

Status: Active architecture
Version: v1.0
Created: 2026-08-18
