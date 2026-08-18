# LUMAN OS Skills

## Purpose

Skills are small, single-purpose operating units that LUMAN can route to when a request matches a known workflow.

Core loop:

```text
Intent -> Sovereignty Check -> Context Retrieval -> Skill Selection -> Execute or Recommend -> Memory Route -> Report
```

Skills do not replace project sources of truth. They define repeatable behavior for working with those sources.

## Governing Authority

All skills inherit:

```text
LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md
LUMAN_OS/gpt_builder_lab/GPT_SOVEREIGNTY_INHERITANCE_STANDARD.md
```

A skill may automate bounded execution. It may not silently take over human goal authority, identity authority, creative authorship, or consequential judgment.

## Initial Skill Set

```text
memory_route       = classify and route durable information
project_status     = assemble current project state from source files
decision_support   = compare options without replacing the human decision-maker
sovereignty_audit  = test a workflow or recommendation for authority drift
morning_brief      = assemble a concise start-of-day briefing from available sources
```

## Skill Rule

Prefer a small skill with a clear input/output contract over one giant prompt that tries to do everything.

## Status

Status: Active foundation  
Version: v1.0  
Created: 2026-08-18
