# LUMAN Knowledge Note Schema

## Purpose

Give durable markdown notes a simple machine-readable structure so LUMAN can connect them into a graph without requiring a database.

## Recommended Front Matter

```yaml
id: unique-note-id
title: Human-readable title
type: idea | fact | decision | project-state | reflection | source | output | relationship
status: active | draft | locked | unresolved | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
domain: domain-name
project: project-name-or-none
privacy: public-safe | private | sensitive
source_type: user-stated | document | connected-source | generated | inferred | remembered
source_ref: optional source path or citation
human_authority: Edward | user | shared | external
confidence: high | medium | low | not-applicable
links:
  - related-note-id
```

## Body Structure

```text
# Summary

# Source / Provenance

# What Is Known

# What Is Inferred

# Connections

# Open Questions

# Next Gate
```

Only include sections that are useful.

## Graph Rule

Links represent relationships, not automatic truth inheritance. A linked note does not become authoritative merely because it has many connections.

## Identity Rule

Never convert a historical note about the user into a permanent identity label. Time, source, context, and revision remain visible.

## Decision Rule

Important decisions should preserve:

- the decision
- options considered
- known constraints
- relevant stated values
- uncertainty
- who made the decision
- date
- outcome when later known

## Minimalism

Do not add metadata merely because a field exists. The schema exists to improve retrieval, provenance, privacy, and graph relationships, not to turn life into bureaucracy.
