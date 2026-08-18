# LUMAN Skill Standard

## Required Shape

Every reusable LUMAN skill should define:

1. Purpose
2. Trigger conditions
3. Required inputs
4. Optional inputs
5. Source-of-truth dependencies
6. Sovereignty class
7. Procedure
8. Output contract
9. Memory behavior
10. Failure / uncertainty behavior

## Sovereignty Classes

```text
A = Bounded Execution
B = Supported Judgment
C = Sovereign Judgment Support
```

Class A may execute within explicit scope.

Class B may analyze, rank, recommend, and challenge, while the human retains decision authority.

Class C may support reflection and evidence gathering but may not become the final decision-maker.

## Source Discipline

A skill must retrieve the relevant source before acting when the answer depends on project, account, calendar, file, or other connected state.

Memory, inference, or stale summaries may not silently replace current source truth.

## Memory Discipline

A skill must classify any durable output before persistence:

```text
public-safe
private
sensitive
transient
archive
```

No skill may interpret prior disclosure as permanent consent for persistence.

## Evidence Labels

Use these when materially relevant:

```text
Known
Sourced
Calculated
Inferred
Remembered
Estimated
Recommended
Symbolic
Uncertain
Unknown
```

## Completion Rule

A skill finishes by reporting:

```text
What it did
What source it used
What changed
What remains uncertain
Recommended next move, if useful
Decision authority, when Class B or C
```

## Anti-Pattern

Do not make one skill responsible for routing, memory, planning, creative generation, scheduling, and execution at once. Compose small skills instead.
