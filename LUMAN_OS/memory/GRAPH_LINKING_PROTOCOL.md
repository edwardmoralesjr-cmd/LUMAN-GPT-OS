# LUMAN Graph Linking Protocol

## Purpose

Turn ordinary markdown files into a lightweight knowledge graph through explicit IDs, typed links, source references, and project/domain relationships.

## Node Types

Recommended node types:

```text
person
project
idea
fact
decision
source
artifact
belief
value
open-loop
milestone
canon
skill
system
```

## Relationship Types

Use plain-language relationships when useful:

```text
supports
contradicts
extends
derived-from
belongs-to
blocks
depends-on
replaces
references
inspired-by
resolved-by
created-for
```

## Linking Rule

Links help retrieval and reasoning. They do not create authority.

A highly connected inference remains an inference until supported by the appropriate source.

## Provenance Rule

Whenever a claim can materially affect later reasoning, preserve its source type and source reference where practical.

## Update Rule

When a note changes materially:

- update its date
- preserve the prior decision/history when useful
- mark superseded claims rather than silently rewriting history
- repair links that would otherwise become misleading

## Query Pattern

A LUMAN graph query should conceptually perform:

```text
Find relevant nodes
-> rank by source authority and recency
-> traverse directly related nodes
-> separate fact from inference
-> return the smallest useful context set
```

## No-Database Principle

The initial LUMAN graph is file-native. Markdown and explicit metadata remain human-readable and portable. A database or vector index may be added later as an acceleration layer, but it must not become the only readable source of truth.
