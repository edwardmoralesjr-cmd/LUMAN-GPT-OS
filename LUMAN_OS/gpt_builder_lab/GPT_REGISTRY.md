# LUMAN OS GPT Registry

## File Name

GPT_REGISTRY.md

## System

LUMAN OS

## Section

GPT Builder Lab

## Purpose

This file tracks custom GPTs, specialist GPT modules, source knowledge files, commands, module paths, and current integration status inside LUMAN OS.

The GPT Registry helps Edward know:

- What GPTs exist
- Where they belong inside LUMAN OS
- What each GPT does
- What files support each GPT
- Which GPTs are active, planned, archived, or incomplete
- What should be upgraded next

---

# Registry Status

Status: Active  
Version: v1.1  
Created: 2026-06-18  
Last Integrity Scan: 2026-06-18  
Primary Section: GPT Builder Lab  

---

# Active GPT Modules

## GPT-001: Harmonic Time System Analyst

### Status

Active

### Module ID

LUMAN_GPT_HARMONIC_TIME_SYSTEM_ANALYST_001

### Primary Path

```text
LUMAN_OS / gpt_builder_lab / modules / harmonic_time_system_analyst
```

### Primary Section

GPT Builder Lab

### Dedicated LUMAN OS Section

```text
LUMAN_OS / harmonic_time_system / HARMONIC_TIME_SYSTEM_MENU.md
```

### Root Menu Integration

```text
LUMAN_OS / ROOT_MENU.md
Section [11]: Harmonic Time System
Command: /open harmonic time system
```

### Secondary Section Links

- Creative Vault
- Book Section
- Spiritual Systems
- Harmonic Time System

### Primary Purpose

Harmonic Time System Analyst is a high-level metaphysical guide specializing in numerology, astrology, and integrated Harmonic Time Maps.

It creates spiritually resonant, clearly structured readings based on birth data and present intention while maintaining clear accuracy boundaries.

### Core Functions

- Birth-data intake
- Life Path calculation
- Destiny / Expression calculation
- Soul Urge calculation
- Personal Year calculation
- Numerology-first Harmonic Time Maps
- Exact natal chart interpretation when reliable calculation support, user-approved chart data, or documented chart basis is available
- Symbolic archetypal readings when exact charting is unavailable
- 12-month harmonic flow forecasts
- Journal prompts
- Affirmation sets
- Visual chart concepts
- Compatibility reading support

### Primary Files

- `MODULE_MANIFEST.md`
- `COMMANDS.md`
- `SOURCE_KNOWLEDGE.md`
- `READING_TEMPLATE.md`

### Section Files

- `LUMAN_OS/harmonic_time_system/HARMONIC_TIME_SYSTEM_MENU.md`

### Current User-Specific Integration

Edward’s LUMAN OS homepage now includes a Mini Harmonic Time Reading under Active Focus.

Current homepage reading type:

```text
Exact natal chart + numerology snapshot
```

Known user birth data used by the system:

```text
Edward Morales Jr.
February 17, 1986
6:00 PM
Chicago, Illinois
```

Current homepage chart basis:

```text
Tropical zodiac
Placidus houses
Chicago IL
February 17 1986, 6:00 PM CST
Calculated as February 18 1986, 00:00 UTC
```

### Key Accuracy Rule

This GPT must never claim to calculate an exact natal chart without enough information and a reliable calculation basis.

When exact astrology is unavailable, it must clearly offer symbolic, numerology-first, or user-provided-placement alternatives.

When exact chart data is used, the reading must identify the calculation basis and keep interpretation framed as reflective guidance, not fixed destiny.

### Current Open Issues

1. Create a dedicated chart-basis/provenance file for Edward’s exact natal chart snapshot so future readings can reuse the same placements consistently.
2. Create a Harmonic Time System archive folder for completed readings and templates.
3. Create a Harmonic Time System book/framework file for Edward’s larger system development.
4. Decide whether Harmonic Time System should remain both a GPT Builder Lab module and a permanent root-level LUMAN OS section.

### Recently Completed

- `READING_TEMPLATE.md` was created for the full Harmonic Time Map output structure.
- `HARMONIC_TIME_SYSTEM_MENU.md` was created as a dedicated LUMAN OS section menu.
- `ROOT_MENU.md` was updated to add Harmonic Time System as section [11].
- `ROOT_MENU.md` was updated with Edward’s Mini Harmonic Time Reading.
- The homepage Mini Harmonic Time Reading was upgraded from symbolic-only astrology to an exact natal chart + numerology snapshot.

### Recommended Next Move

Create a dedicated chart-basis/provenance file for Edward’s exact natal chart snapshot.

---

# Planned GPT Modules

## GPT-002: Roseborn Canon Guardian

### Status

Active elsewhere in Book Section

### Current Path

```text
LUMAN_OS / book_section / roseborn_universe / tools / roseborn_canon_guardian
```

### Registry Note

Roseborn Canon Guardian is currently treated as a Book Section tool rather than a general GPT Builder Lab module because it is deeply tied to Roseborn Universe canon protection.

A future registry update may add a full cross-reference entry.

---

# Registry Rules

1. Every custom GPT should have a module folder or section-specific tool folder.
2. Every GPT should have a MODULE_MANIFEST.md file.
3. Every GPT should have a COMMANDS.md file if it has repeatable use.
4. Every GPT knowledge file should be preserved or summarized as SOURCE_KNOWLEDGE.md.
5. GPTs should be classified by primary LUMAN OS placement and secondary use.
6. GPTs should not be dumped into LUMAN OS without structure.
7. Every GPT should have a clear next upgrade path.
8. Exact astrology must have a documented data and calculation basis before it is treated as reusable system data.

---

# File Status

Status: Active  
Version: v1.1  
GitHub Role: Master registry for GPT modules inside LUMAN OS
