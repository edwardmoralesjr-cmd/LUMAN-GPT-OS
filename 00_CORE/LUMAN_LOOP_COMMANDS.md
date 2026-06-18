# LUMAN Loop Commands

**Purpose:** Define the small command set for LUMAN loop engineering.

This file should stay simple. It is the active command surface for repeatable loops.

---

## Core Loop Commands

### `/start daily next move loop`

Finds the single best next action for the current context.

Routes to:

- `00_CORE/LUMAN_DAILY_NEXT_MOVE_LOOP.md`

Default output:

```text
CURRENT FOCUS:
CURRENT STATE:
BEST NEXT MOVE:
WHY THIS MATTERS:
ACTION:
LOG:
NEXT STEP:
```

---

### `/start daily next move loop: [project]`

Runs the Daily Next Move Loop for a specific project or vault.

Examples:

```text
/start daily next move loop: LUMAN OS
/start daily next move loop: Lucid Syntax Visionary rollout
/start daily next move loop: Roseborn
/start daily next move loop: Life OS
/start daily next move loop: GitHub
```

---

### `/start loop: [loop name]`

Starts a named loop from the LUMAN Loop Engineering System.

Supported loop names:

- daily next move
- vault
- github improvement
- creation
- quality
- promotion
- decision
- evolution

---

### `/run quality loop on this`

Reviews the current output for clarity, usefulness, alignment, safety, and project fit.

Use this before saving, posting, publishing, or committing important work.

---

### `/run decision loop`

Compares options and chooses the best next move using Edward's priorities:

- family peace
- creative growth
- simplification
- long-term leverage
- realistic energy
- message impact

---

### `/upgrade luman os`

Runs the Evolution Loop on LUMAN OS itself.

Default behavior:

1. Review current commands.
2. Find friction.
3. Simplify where needed.
4. Add missing structure only if useful.
5. Update routing, dashboard, changelog, and open loops when Edward asks for GitHub changes.

---

## Minimal Loop Formula

```text
LOAD -> CHOOSE -> ACT -> CHECK -> LOG -> NEXT
```

---

## Command Design Rule

Every new loop command should answer this question:

```text
Does this make Edward's next action easier to see and easier to do?
```

If not, it should not be added yet.
