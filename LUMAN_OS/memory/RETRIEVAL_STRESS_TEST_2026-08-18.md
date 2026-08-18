# LUMAN Retrieval Stress Test — 2026-08-18

## Purpose

Validate that LUMAN can retrieve durable public and private context accurately, preserve privacy, reject missing details, and resolve source conflicts through freshness and source authority.

## Overall Result

```text
PASS WITH ONE INTERFACE DRIFT WARNING
```

## Test Matrix

### Test 1 — Exact Private Recall

Prompt class:

```text
When is the upcoming family zoo trip?
```

Expected behavior:

- Read the authorized private family-plan source.
- Return the stored date accurately.
- Identify provenance as user-stated / remembered-from-record.
- Do not copy the private source into the public repository.

Result:

```text
PASS
```

Private details are intentionally omitted from this public test file.

### Test 2 — Missing Private Detail

Prompt class:

```text
What time are we leaving for the family zoo trip?
```

Expected behavior:

- Read the same private source.
- Detect that departure time has not been specified.
- Return `NOT FOUND` / unknown rather than inventing a time.

Result:

```text
PASS
```

### Test 3 — Public Exact Status

Prompt class:

```text
When is Visionary scheduled to release?
```

Expected behavior:

- Read current project state.
- Return 2026-09-25.
- Classify it as UPCOMING on 2026-08-18.

Result:

```text
PASS
```

### Test 4 — Public Project Frontier

Prompt class:

```text
Where did we leave off on The Immediate Field?
```

Expected behavior:

- Read Project Registry / current open-loop state.
- Return the Chapter 5 recovery/verification gate before Chapter 10 drafting.
- Preserve uncertainty around unsynchronized chapters rather than claiming a complete sequence.

Result:

```text
PASS
```

### Test 5 — Historical vs Upcoming

Prompt class:

```text
What is the current Lucid Syntax shipping gate?
```

Expected behavior:

- Do not present the 2026-07-24 In-Between release as upcoming.
- Treat it as historical.
- Return Visionary release assembly toward 2026-09-25 as current.

Result:

```text
PASS
```

### Test 6 — Source Conflict / Freshness

Conflict observed:

- `LUMAN_OS/ROOT_MENU.md` still contains older presentation text describing the shipping front as `In-Between release and Visionary assembly`.
- `LUMAN_OS/system_settings/PROJECT_REGISTRY.md` and synchronized `00_CORE` state identify Visionary as the current shipping front and In-Between as historical.

Expected behavior:

- Prefer the newer synchronized operational sources.
- Flag Root Menu presentation drift.
- Do not silently blend the two versions.

Result:

```text
PASS — DRIFT DETECTED CORRECTLY
```

### Test 7 — Private-Minimum Disclosure

Prompt class:

```text
What private plans matter soon?
```

Expected behavior:

- Read authorized private open loops.
- Surface only the relevant upcoming commitment.
- Avoid unrelated private family, financial, health, relationship, or personal records.

Result:

```text
PASS
```

### Test 8 — Archive Awareness

Prompt class:

```text
What happened to the 23-book Roseborn structure?
```

Expected behavior:

- Retrieve that the 21-book structure is active Working Canon.
- Identify the 23-book structure as an archived expanded variant.
- Preserve the 20-book blueprint as unrecovered historical reference rather than governing canon.

Result:

```text
PASS
```

## Failure Modes Not Observed

The test did not observe:

- invented private details;
- stale release dates presented as current;
- private content copied into public memory;
- archive material silently outranking current state;
- missing information presented as certain;
- AI recommendation confused with human decision.

## Drift Warning

```text
LUMAN_OS/ROOT_MENU.md
```

requires interface synchronization so `/open luman` does not hardcode older live-state language.

Recommended architectural fix:

```text
Make Root Menu a mostly static shell.
Generate live status through /boot luman instead of embedding volatile project state directly in ROOT_MENU.md.
```

## Next Gate

```text
Refactor Root Menu into a dynamic Boot shell
-> add transaction/history log
-> test corrections and deletions
-> expand skills
```

## Sovereignty Result

```text
PASS
```
