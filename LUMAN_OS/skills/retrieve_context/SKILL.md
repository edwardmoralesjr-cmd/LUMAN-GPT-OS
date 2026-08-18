# Skill: Retrieve Context

## Purpose

Answer questions about what LUMAN currently knows, remembers, has planned, or has left open by retrieving authorized public and private sources instead of relying on conversational memory alone.

## Trigger Conditions

Use for questions such as:

```text
What do you remember about [topic]?
What have I decided about [topic]?
What do I have coming up?
What are my open family plans?
Where did we leave off on [project]?
What matters right now?
Recall [topic]
```

## Required Inputs

- Retrieval question
- Domain/topic if supplied
- Current date when time relevance matters

## Optional Inputs

- Project filter
- Time range
- Public/private scope preference

## Source-of-Truth Dependencies

```text
LUMAN_OS/memory/RETRIEVAL_PROTOCOL.md
LUMAN_OS/memory/GRAPH_LINKING_PROTOCOL.md
LUMAN_OS/memory/PUBLIC_PRIVATE_MEMORY_BOUNDARY.md
LUMAN_OS/system_settings/SOURCE_OF_TRUTH_MATRIX.md
```

## Sovereignty Class

Class A for factual retrieval and summarization.
Class B when the user asks LUMAN to rank, interpret, or recommend based on retrieved context.

## Procedure

1. Parse the retrieval target.
2. Determine likely domain owners.
3. Select authorized public/private sources.
4. Search the narrowest relevant source first.
5. Expand only if evidence is incomplete.
6. Apply freshness checks to dates, project status, and future plans.
7. Distinguish user-stated, sourced, generated, inferred, remembered-from-record, and uncertain material.
8. Resolve conflicts through source authority and recency.
9. Summarize the answer without exposing unnecessary private details.
10. Cite or identify the source path when useful.

## Output Contract

```text
Retrieval Status: FOUND / PARTIAL / NOT FOUND
Topic:
Current Answer:
Source Basis:
Freshness:
Conflicts / Uncertainty:
Related Context:
```

When interpretation or recommendation is requested, add:

```text
Recommendation:
Strongest counterpoint:
Decision authority: Edward
```

## Memory Behavior

Retrieval does not create new memory by default.

If the user corrects retrieved information, route the correction through Memory Route and preserve the old record as corrected, superseded, archived, or deleted according to the user's instruction.

## Failure / Uncertainty Behavior

If no durable record is found, say so. Do not convert general model memory or conversational familiarity into a claim that LUMAN stored the information.
