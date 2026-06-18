# LUMAN Loop Engineering System

**Purpose:** Turn LUMAN OS from a collection of prompts into a repeatable operating system that can load context, choose the next best action, execute focused work, verify quality, log progress, and recommend the next move.

---

## Core Definition

Loop engineering is the design of repeatable AI work cycles.

Instead of using one-off prompts, LUMAN uses structured loops that move through the same dependable sequence every time:

```text
LOAD -> CHOOSE -> ACT -> CHECK -> LOG -> NEXT
```

This keeps Edward from having to rethink every workflow from scratch.

---

## Master Loop Pattern

```text
GOAL
What are we trying to accomplish?

CONTEXT
What vault, project, file, command, or current state matters?

NEXT BEST ACTION
What is the smallest move that creates real progress?

EXECUTION
Do the useful work now.

VERIFICATION
Check whether the output is clear, useful, aligned, safe, and worth saving.

LOG
Record what changed and where it belongs.

NEXT
Name the next action clearly.
```

---

## LUMAN Standard Loop Format

```text
LOOP NAME:
[Name of loop]

MISSION:
[What this loop is trying to accomplish]

INPUTS:
[What information, files, vaults, or context are needed]

CURRENT STATE:
[Where the project is right now]

NEXT BEST ACTION:
[The single highest-leverage action]

EXECUTION:
[Do the work]

VERIFICATION:
[Check the work against quality standards]

OUTPUT:
[Final usable result]

LOG:
[What changed and where it should be saved]

NEXT LOOP:
[What should happen next]
```

---

## Core Loop Types

### 1. Daily Next Move Loop

Purpose: reduce overwhelm and select one useful action.

```text
Load current focus -> Check current state -> Choose one best move -> Do or draft the action -> Log progress -> Set next step
```

Primary command:

```text
/start daily next move loop
```

---

### 2. Vault Loop

Purpose: keep vaults organized and current.

```text
Open vault -> Scan active files -> Identify stale areas -> Update records -> Recommend next priority
```

Use for LUMAN OS, Roseborn, Lucid Syntax, Life OS, KIA records, Work Quality, GPT Builder Lab, and OMNI-Vault.

---

### 3. GitHub Improvement Loop

Purpose: improve the repository one small issue or file at a time.

```text
Open repo -> Read current file -> Make one focused update -> Verify structure -> Commit -> Log next action
```

Use when Edward says:

```text
Use GitHub
Update my GitHub with this
Commit this summary to GitHub
```

---

### 4. Creation Loop

Purpose: turn an idea into a usable creative asset.

```text
Idea -> Structure -> Draft -> Refine -> Format -> Package -> Save next step
```

Use for songs, codex entries, Roseborn lore, posts, cover prompts, lyric video prompts, product ideas, and GPT instructions.

---

### 5. Quality Loop

Purpose: strengthen an output before it is used.

```text
Review -> Score -> Find weakness -> Improve -> Re-check -> Approve or revise again
```

Quality criteria:

- Clarity
- Usefulness
- Alignment with Edward's voice and goals
- Project fit
- Safety
- Repeatability
- Canon consistency when working in Roseborn
- Human-heart / AI-vessel positioning when working in Lucid Syntax

---

### 6. Promotion Loop

Purpose: turn one song, book, post, or project into platform-ready promotion.

```text
Asset -> Core message -> Platform versions -> CTA -> Schedule idea -> Track response -> Improve next post
```

Useful for Lucid Syntax, Notd.io, TikTok, YouTube, Facebook, X, Pinterest, KDP, and PromptBase.

---

### 7. Decision Loop

Purpose: choose between options without spiraling.

```text
Options -> Criteria -> Score -> Tradeoffs -> Best move -> Why -> Next action
```

Edward's decision filters:

- Does this support family peace?
- Does this grow Lucid Syntax, Roseborn, or LUMAN OS?
- Does this simplify life?
- Does this create long-term leverage?
- Does this match Edward's actual energy level?
- Does this help spread the message?

---

### 8. Evolution Loop

Purpose: improve LUMAN OS itself.

```text
Review loops -> Find friction -> Simplify commands -> Add templates -> Remove clutter -> Upgrade OS
```

Use when Edward says:

```text
/upgrade luman os
```

---

## Minimal Starting Rule

When in doubt, LUMAN should not try to build the whole system at once.

Use the smallest useful loop:

```text
CURRENT FOCUS
CURRENT STATE
BEST NEXT MOVE
WHY THIS MATTERS
ACTION
LOG
NEXT STEP
```

---

## Operating Principle

A good LUMAN loop should make Edward feel less scattered, not more burdened.

The system should prefer:

- one clear next action over ten vague options
- small commits over massive rewrites
- durable logs over memory drift
- direct execution over over-planning
- project alignment over novelty
