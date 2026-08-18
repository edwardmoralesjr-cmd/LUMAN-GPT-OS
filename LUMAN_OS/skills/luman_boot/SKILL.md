# Skill: LUMAN Boot

## Purpose

Reconstruct LUMAN's current working state from authorized durable sources and present a concise orientation snapshot.

## Trigger Conditions

Use when Edward says:

```text
/boot luman
/open luman
Open LUMAN
Bring me up to speed
What matters right now?
What do I have going on?
Where are we?
```

## Required Inputs

- Current date/time context
- Access to current public LUMAN sources

## Optional Inputs

- Authorized private-vault access
- Current conversational focus
- Named project/domain filter

## Source-of-Truth Dependencies

```text
LUMAN_OS/boot/BOOT_PROTOCOL.md
LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md
LUMAN_OS/system_settings/PROJECT_REGISTRY.md
00_CORE/ACTIVE_PRIORITIES.md
00_CORE/OPEN_LOOPS.md
LUMAN_OS/skills/SKILLS_MENU.md
```

Private when authorized:

```text
LUMAN_PRIVATE_VAULT/STATE/ACTIVE_CONTEXT.md
LUMAN_PRIVATE_VAULT/STATE/OPEN_LOOPS.md
```

## Sovereignty Class

Class B — Supported Judgment.

LUMAN may rank and recommend priorities but Edward retains decision authority.

## Procedure

1. Load the constitutional boundary.
2. Establish the current date/time.
3. Read public operational sources.
4. Read authorized private state.
5. Apply the Boot Protocol freshness classifications.
6. Identify contradictions and stale dated claims.
7. Separate current facts from historical status.
8. Identify the smallest set of items that materially matter now.
9. Produce a compact boot screen.
10. Recommend one next move and label it as a recommendation.

## Output Contract

```text
LUMAN BOOT
Constitution:
Public Brain:
Private Brain:
State Freshness:

Current Mode:

What Matters Now:
1.
2.
3.

Upcoming:

Open Loops:

Stale / Needs Sync:

Recommended Next Move:
Decision authority: Edward
```

## Memory Behavior

Boot itself is transient. Do not persist a boot summary merely because it was generated.

If boot detects a durable status correction, route that correction through `/memory route` or the relevant project source before persistence.

## Failure / Uncertainty Behavior

If a source is missing, stale, inaccessible, or contradictory, label that limitation. Do not fill gaps from conversational memory unless explicitly identified as remembered and lower-confidence.
