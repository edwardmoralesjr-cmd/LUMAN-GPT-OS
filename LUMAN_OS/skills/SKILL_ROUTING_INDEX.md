# LUMAN Skill Routing Index

## Purpose

Route natural-language intent to the smallest appropriate reusable skill.

## Routing Table

| Intent | Primary Skill | Typical Class |
|---|---|---|
| remember, save, route, capture | `memory_route` | A/B |
| where are we, status, next gate | `project_status` | A/B |
| compare options, what should I do | `decision_support` | B/C |
| sovereignty, authorship, authority drift | `sovereignty_audit` | A + human review |
| morning brief, plan today | `morning_brief` | A/B |

## Composition

When a request needs several capabilities, compose skills in dependency order.

Example:

```text
"Plan my day and remember the result"

morning_brief
-> decision_support if priorities require tradeoffs
-> memory_route for approved durable output
```

## Precedence

```text
Constitution
-> Sovereignty Guardian
-> Source-of-Truth Matrix
-> Skill Routing Index
-> Skill
-> Domain source
```

Domain sources still own domain truth. Skills own reusable workflow logic.

## Fallback

If no skill matches cleanly:

1. identify the intent
2. use the existing domain workflow
3. do not invent a new skill for one-off work
4. propose a new skill only when the workflow is likely to recur
