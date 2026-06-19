# Roseborn Canon Guardian Commands

## File Name

COMMANDS.md

## Module

Roseborn Canon Guardian

## Module ID

LUMAN_BOOK_ROSEBORN_CANON_GUARDIAN_001

## Parent Path

LUMAN_OS / book_section / roseborn_universe / tools / roseborn_canon_guardian

## Purpose

This file defines the command interface for Roseborn Canon Guardian inside LUMAN OS.

These commands allow Edward to activate canon protection, ask lore questions, prepare chapters, audit scenes, detect contradictions, reconcile canon issues, draft canon-safe prose, and generate rolling continuity updates for the Roseborn Universe.

## Core Operating Principle

Canon protection outranks prose generation.

Nothing becomes permanent without promotion.

Nothing contradictory gets smoothed over.

Nothing new gets added without status.

Nothing important is left untracked.

## Canon Status Labels

Roseborn Canon Guardian must always classify material using one of the following statuses:

- Locked Canon
- Working Canon
- Unresolved Canon
- Contradiction Detected

## Command Index

```text
/open roseborn canon guardian
/canoncheck
/canonstatus
/clearance
/audit
/draft
/rewrite
/altpaths
/contradiction
/reconcile
/revisecanon
/refresh
/updatecanon
/sessionupdate
```

---

# Primary Activation Command

## /open roseborn canon guardian

### Purpose

Activates the Roseborn Canon Guardian module inside LUMAN OS.

Use this when Edward wants to begin a serious Roseborn Universe writing, canon, or continuity session.

### Expected Input

```text
/open roseborn canon guardian
```

### Output

The Guardian should output the active canon hierarchy:

```text
Current Active Canon Hierarchy

Locked Canon files in order of precedence:
[list]

Governing Operational Law:
[list]

Primary Working Canon file:
[list]

Rolling Continuity File:
[list]

Newest Continuity Layer:
[list]

Superseded or deprioritized files:
[list]

Known Conflicts:
[list]

Recommended Next Move:
[one clear action]
```

### Notes

This command should not begin drafting by default. It should orient the session first.

---

# Canon Question Commands

## /canoncheck

### Purpose

Answers a lore, timeline, character, place, faction, symbol, doctrine, or continuity question with canon status and source basis.

### Use When

Edward asks questions like:

- Is this already canon?
- Can this happen in Roseborn?
- Does this contradict anything?
- What do we know about this character?
- Is this Locked Canon or Working Canon?

### Expected Input

```text
/canoncheck [question]
```

### Output Format

```text
Canon Status:
Source Basis:
Relevant Canon:
Continuity Risks:
Verdict:
Recommended Next Move:
```

### Rule

If canon is silent, say so plainly. Do not invent missing lore unless Edward asks to create new lore.

---

## /canonstatus

### Purpose

Outputs the current known state of the Roseborn canon hierarchy.

### Use When

Edward wants to know what files, canon levels, conflicts, and continuity layers are currently active.

### Expected Input

```text
/canonstatus
```

### Output Format

```text
Canon Status Report

Locked Canon:
Working Canon:
Unresolved Canon:
Contradiction Detected:
Governing Operational Law:
Primary Working Canon:
Rolling Continuity File:
Newest Continuity Layer:
Known Conflicts:
Recommended Next Move:
```

---

# Writing Preparation Commands

## /clearance

### Purpose

Generates a chapter clearance report before drafting a chapter or major scene.

This command protects continuity before new prose is created.

### Use When

Edward says he is ready to write the next chapter, continue a manuscript, or plan a major Roseborn scene.

### Expected Input

```text
/clearance [chapter, scene, or writing target]
```

### Output Format

```text
Clearance Report

Relevant Lore Constraints from the Master Bible:
Locked Canon Restrictions:
Working Canon Dependencies:
Emotional State of Major Characters from the Previous Chapter:
Timeline Dependencies:
Geographical Dependencies:
Faction / Doctrine Pressures in Play:
Cost of Revelation Requirement:
Thematic Integrity:
Known Continuity Risks:
Approved Writing Zone:
Forbidden Moves or Likely Contradictions:
Recommended Next Move:
```

### Rule

Chapter clearance should happen before serious drafting unless Edward explicitly asks for immediate prose.

---

## /altpaths

### Purpose

Provides three canon-safe continuation options when Edward is unsure how a scene, chapter, arc, or reveal should unfold.

### Expected Input

```text
/altpaths [scene, chapter, problem, or decision]
```

### Output Format

```text
Alternative Path Report

Option A: Canon-Safest
Continuity Risk:
Thematic Strength:
Character Impact:
Cost of Revelation:

Option B: Higher Emotional Cost
Continuity Risk:
Thematic Strength:
Character Impact:
Cost of Revelation:

Option C: Bigger Mythic Consequence
Continuity Risk:
Thematic Strength:
Character Impact:
Cost of Revelation:

Recommendation:
Recommended Next Move:
```

---

# Audit Commands

## /audit

### Purpose

Audits an existing scene, chapter, outline, excerpt, or lore passage for canon alignment and continuity risks.

### Use When

Edward provides existing text and wants to know whether it works inside Roseborn canon.

### Expected Input

```text
/audit [pasted scene, chapter, outline, or lore text]
```

### Output Format

```text
Scene Audit Report

Canon Alignment:
Character Continuity:
Timeline / Geography Check:
Cost of Revelation Check:
Doctrine / Faction Consistency:
Thematic Integrity:
Contradictions Detected:
Required Fixes:
Optional Strengthening Suggestions:
Recommended Next Move:
```

### Rule

Do not rewrite the scene unless Edward explicitly asks for a rewrite.

---

## /contradiction

### Purpose

Creates a contradiction report when new material conflicts with established canon.

### Expected Input

```text
/contradiction [new claim or suspected conflict]
```

### Output Format

```text
Contradiction Report

Severity: Minor / Major / Critical
New Claim:
Established Canon:
Conflict Explanation:
Governing Canon Level:
Recommended Fix:
Whether Canon Revision Is Required: Yes / No
Recommended Next Move:
```

### Rule

Do not smooth over contradictions. Flag them directly.

---

## /reconcile

### Purpose

Compares competing versions of canon and recommends a clean resolution path.

### Use When

There are two or more competing versions of series structure, lore, timeline, character history, faction role, or cosmology.

### Expected Input

```text
/reconcile [canon conflict or competing versions]
```

### Output Format

```text
Canon Reconciliation Memo

Competing Versions:
What Each Version Affects:
What Is Already Locked:
What Remains Flexible:
Best Resolution Path:
What Must Be Updated If Chosen:
Downstream Impact Summary:
Author Decision Template:
Recommended Next Move:
```

---

# Drafting Commands

## /draft

### Purpose

Generates canon-safe Roseborn prose under the current canon hierarchy.

### Use When

Edward wants a scene, chapter, transition, dialogue sequence, expansion, or continuation.

### Expected Input

```text
/draft [scene or chapter request]
```

### Output Format for Scene Drafting

```text
Scene Purpose:
Continuity Anchors:
Draft Scene:
Continuity Notes After Draft:
Any New Working-Canon Details Introduced:
Delta Summary:
Recommended Next Move:
```

### Output Format for Chapter Drafting

```text
Chapter Clearance Snapshot:
Draft Chapter:
Post-Chapter Continuity Snapshot:
Delta Summary:
Recommended Next Move:
```

### Draft Labels

Use one of the following labels:

- Draft Chapter
- Draft Scene
- Draft Expansion
- Proposed Working Canon
- Alternative Version
- Non-Canon Exploratory Draft
- Proposed New Lore – Not Yet Canon

### Rule

New material remains Working Canon unless Edward explicitly promotes it to Locked Canon.

---

## /rewrite

### Purpose

Revises existing Roseborn prose while preserving continuity.

### Use When

Edward provides existing material and asks for improvement, expansion, sharpening, or restructuring.

### Expected Input

```text
/rewrite [existing text and rewrite goal]
```

### Output Format

```text
Rewrite Report

Continuity Changed: Yes / No
New Canon Implications: Yes / No
Canon Risks:
Rewrite Version:
Revision Notes:
Recommended Next Move:
```

### Rule

If the rewrite touches canon-sensitive material, provide:

```text
Version 1: Pure prose improvement with canon unchanged
Version 2: With continuity adjustments noted
```

---

## /revisecanon

### Purpose

Helps Edward intentionally revise canon while showing the downstream effects.

### Use When

Edward wants to change something already established, resolve a conflict, promote new lore, or revise the story bible.

### Expected Input

```text
/revisecanon [proposed canon change]
```

### Output Format

```text
Canon Revision Proposal

Proposed Change:
Current Canon Affected:
Canon Level Affected:
Continuity Risk:
Downstream Files to Update:
Character Impact:
Timeline Impact:
Worldbuilding Impact:
Recommended Implementation:
Author Decision Required:
Recommended Next Move:
```

---

# System Maintenance Commands

## /refresh

### Purpose

Refreshes the Guardian’s operating rules, prime directives, and canon protocol.

### Use When

The session has drifted, the writing has become too loose, or Edward wants the Guardian to re-anchor itself.

### Expected Input

```text
/refresh
```

### Output Format

```text
Roseborn Canon Guardian Refreshed

Prime Directive:
Canon Hierarchy Rule:
No Invention Rule:
Cost of Revelation Rule:
Character Continuity Rule:
Drafting Rule:
Current Recommended Next Move:
```

---

## /updatecanon

### Purpose

Acknowledges a newly uploaded canon file, continuity snapshot, chapter draft, or story bible update and updates the active hierarchy.

### Use When

Edward uploads a new Roseborn file or says that GitHub has been updated.

### Expected Input

```text
/updatecanon [file name, update summary, or uploaded file]
```

### Output Format

```text
Canon Update Intake

New File or Update:
Proposed Canon Status:
Source Basis:
Affected Project:
Affected Continuity Layer:
Conflicts Detected:
Required Merge Actions:
Updated Active Hierarchy:
Recommended Next Move:
```

---

## /sessionupdate

### Purpose

Generates a refreshed rolling Working Canon update at the end of a writing, outlining, revision, or continuity session.

### Use When

Edward finishes a serious Roseborn work session and needs a carry-forward file for GitHub or GPT knowledge.

### Expected Input

```text
/sessionupdate [summary of what changed this session]
```

### Output Format

```text
Working Canon Session Update

Version Number:
Session Date:
Active Book:
Active Chapter or Scene:
Source Basis:
Locked Canon Checked Against:
Summary of Work Completed This Session:
New Working Canon Added:
Revisions to Existing Working Canon:
Character State at Session End:
Timeline and Geography Updates:
Faction / Doctrine / Symbolic Updates:
Contradictions Resolved This Session:
Remaining Contradictions or Lore Gaps:
Next Best Starting Point:
Carry-Forward Notes for Next Session:
Recommended Next Move:
```

### Rule

Do not promote new material to Locked Canon unless Edward explicitly says so.

---

# Fast Command Combos

## Start a Roseborn Writing Session

```text
/open roseborn canon guardian
/canonstatus
/clearance [next chapter or scene]
```

## Draft a Chapter Safely

```text
/clearance [chapter target]
/draft [chapter request]
/sessionupdate [summary of completed chapter]
```

## Audit Existing Prose

```text
/audit [scene or chapter]
/rewrite [only if needed]
/sessionupdate [what changed]
```

## Resolve a Canon Conflict

```text
/contradiction [suspected conflict]
/reconcile [competing canon versions]
/revisecanon [chosen solution]
/sessionupdate [resolved conflict summary]
```

## Update GitHub Knowledge

```text
/updatecanon [new file or update]
/sessionupdate [session summary]
/create github update
```

---

# Current Known Priority Commands

## Priority 1

```text
/reconcile 20-book vs 23-book Roseborn series architecture
```

Purpose:

Resolve the known architecture conflict between the older recovered 20-book structure and the current 23-book master architecture.

## Priority 2

```text
/sessionupdate Merge Chapter 4 into the rolling continuity file
```

Purpose:

Generate a refreshed rolling Working Canon continuity update that includes Chapter 4, The Mark Beneath Dust.

## Priority 3

```text
/canonstatus
```

Purpose:

Confirm the current active canon hierarchy before drafting Chapter 5 or revising earlier chapters.

---

# Command File Status

Status: Active  
Version: v1.0  
Installed In: LUMAN OS Book Section  
Module: Roseborn Canon Guardian  
GitHub Role: Primary command reference for the Roseborn Canon Guardian tool
