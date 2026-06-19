# Roseborn Canon Guardian Contradiction Log

## File Name

CONTRADICTION_LOG.md

## Module

Roseborn Canon Guardian

## Module ID

LUMAN_BOOK_ROSEBORN_CANON_GUARDIAN_001

## Parent Path

LUMAN_OS / book_section / roseborn_universe / tools / roseborn_canon_guardian

## Purpose

This file tracks contradictions, unresolved canon conflicts, competing versions, lore gaps, and continuity risks inside the Roseborn Universe.

It supports the `/contradiction` and `/reconcile` commands.

The purpose of this log is not to force premature answers. Its purpose is to keep every unresolved issue visible until Edward makes an intentional canon decision.

## Core Rule

Do not smooth over contradictions.

Do not silently resolve conflicts.

Do not treat Working Canon as Locked Canon.

Do not promote any solution to permanent canon unless Edward explicitly approves it.

---

# Contradiction Status Labels

## Open

The contradiction or canon conflict is active and unresolved.

## Under Review

The contradiction has been identified and is being compared against source files.

## Resolved

Edward has chosen a resolution and downstream updates have been identified.

## Deferred

The contradiction is known but intentionally left unresolved until later development.

## Superseded

The contradiction no longer applies because the affected canon branch was replaced or deprecated.

---

# Severity Levels

## Minor

Small wording, timing, naming, or continuity mismatch that can be fixed without altering major canon.

## Major

Affects story architecture, character arcs, timeline, faction logic, doctrine systems, or book planning.

## Critical

Threatens Locked Canon, published material, foundational cosmology, the main timeline, or the integrity of a major book arc.

---

# Active Contradictions

## CONTRADICTION-001: Roseborn Series Architecture Count Conflict

### Status

Open

### Severity

Major

### Date Logged

2026-06-18

### Affected Area

Roseborn Universe master series architecture

### Newer / Current Version

The current master architecture presents the Roseborn Universe as a 23-book structure across five movements:

1. Movement I: Fracture War Duology
2. Movement II: Roseborn Saga Decalogy
3. Movement III: Silent Cycle Trilogy
4. Movement IV: Grand Generals Pentalogy
5. Movement V: The Third Emergence Finale

### Older / Competing Version

Recovered prior notes preserve an earlier 20-book blueprint.

### Conflict Explanation

The uploaded Working Canon preserves both an older 20-book structure and a newer 23-book master architecture. These two structures cannot both govern the final series count unless one is reframed as an older development draft, alternate internal reading order, partial arc map, or superseded structure.

### Governing Canon Level

Unresolved Canon

No explicitly designated Locked Canon file currently governs this issue.

### Current Handling Rule

Until Edward resolves the conflict, use the 23-book structure as the active Working Canon planning model while keeping the 20-book blueprint visible as recovered prior canon.

Do not describe the 23-book structure as Locked Canon unless Edward explicitly promotes it.

### Continuity Risks

- Book numbering may drift.
- Movement names may become inconsistent.
- Grand Generals placement may shift.
- Future publishing roadmap may become unclear.
- Story bible summaries may conflict with older notes.
- Reader entry order may be confused with chronological order.

### Recommended Fix Options

#### Option A: Promote 23-Book Architecture

Treat the 23-book structure as the official Working Canon moving forward.

The older 20-book blueprint becomes archived developmental history.

Continuity Risk: Low  
Clarity: High  
Best For: Long-term master planning

#### Option B: Reframe 20-Book Blueprint as Internal Arc Map

Keep the 20-book structure as a hidden or earlier internal planning map, while the public-facing and master story bible architecture remains 23 books.

Continuity Risk: Medium  
Clarity: Medium  
Best For: Preserving older notes without deleting them

#### Option C: Rebuild the Entire Series Architecture

Perform a full canon reconciliation and create a new final architecture that either integrates, compresses, or renames both versions.

Continuity Risk: Medium to High  
Clarity: Potentially High  
Best For: Major story bible revision

### Recommended Resolution Path

Recommended path: Option A.

Promote the 23-book architecture as the active master Working Canon and mark the 20-book blueprint as archived recovered prior canon.

This keeps the current master bible coherent and prevents future drift.

### Files That Need Updating If Resolved

- Roseborn Universe Master Story Bible
- Roseborn Working Canon Rolling Continuity File
- Roseborn Canon Guardian MODULE_MANIFEST.md
- Roseborn Canon Guardian SESSION_UPDATE_TEMPLATE.md, if needed
- Any future series architecture file
- Any public-facing Roseborn roadmap

### Author Decision Required

Edward must choose one:

```text
[ ] Option A: Promote 23-book architecture as active master structure
[ ] Option B: Reframe 20-book blueprint as internal arc map
[ ] Option C: Rebuild architecture from both versions
[ ] Defer decision
```

### Recommended Next Move

Run:

```text
/reconcile 20-book vs 23-book Roseborn series architecture
```

---

# Contradiction Entry Template

Use this template for future contradictions.

```text
## CONTRADICTION-###: [Short Title]

### Status

Open / Under Review / Resolved / Deferred / Superseded

### Severity

Minor / Major / Critical

### Date Logged

YYYY-MM-DD

### Affected Area

[Series architecture / timeline / character / faction / doctrine / location / symbol / manuscript / Codex / other]

### New Claim

[State the new claim, proposed change, or newer version.]

### Established Canon

[State the older, stronger, or governing canon.]

### Conflict Explanation

[Explain exactly why both cannot stand as written.]

### Governing Canon Level

Locked Canon / Working Canon / Unresolved Canon / Mixed, with Locked Canon governing

### Continuity Risks

- [Risk]
- [Risk]
- [Risk]

### Recommended Fix Options

#### Option A

Description:

Continuity Risk:

Downstream Impact:

#### Option B

Description:

Continuity Risk:

Downstream Impact:

#### Option C

Description:

Continuity Risk:

Downstream Impact:

### Recommended Resolution Path

[State the cleanest fix.]

### Files That Need Updating If Resolved

- [File]
- [File]
- [File]

### Author Decision Required

[What must Edward decide?]

### Resolution Chosen

[Fill this in only after Edward chooses.]

### Date Resolved

YYYY-MM-DD

### Recommended Next Move

[One clear action.]
```

---

# Lore Gap Entry Template

Use this when no contradiction exists yet, but canon is silent or incomplete.

```text
## LORE-GAP-###: [Short Title]

### Status

Open / Under Review / Resolved / Deferred

### Date Logged

YYYY-MM-DD

### Affected Area

[Character / location / faction / doctrine / timeline / symbol / manuscript / other]

### Gap Description

[What is missing?]

### Why It Matters

[Why the missing canon matters for future writing.]

### Risk If Ignored

[What could go wrong if the gap remains unresolved?]

### Current Source Basis

Locked Canon / Working Canon / Unresolved Canon / Insufficient source basis

### Recommended Development Options

#### Option A

#### Option B

#### Option C

### Author Decision Required

[What must Edward define?]

### Recommended Next Move

[One clear action.]
```

---

# Resolved Contradictions

No contradictions have been resolved yet.

---

# Deferred Contradictions

No contradictions have been deferred yet.

---

# Superseded Contradictions

No contradictions have been superseded yet.

---

# Current Priority

The highest-priority active contradiction is:

CONTRADICTION-001: Roseborn Series Architecture Count Conflict

## Recommended Next Move

Run:

```text
/reconcile 20-book vs 23-book Roseborn series architecture
```

---

# File Status

Status: Active  
Version: v1.0  
Installed In: LUMAN OS Book Section  
Module: Roseborn Canon Guardian  
GitHub Role: Active contradiction and unresolved-canon tracking file for Roseborn Canon Guardian
