# LUMAN Skills Menu

## Command

```text
/open skills
```

## Available Skills

### `/boot luman`

Reconstruct LUMAN's current working state from authorized public and private sources, apply freshness checks, and present a concise orientation snapshot.

Source:

```text
LUMAN_OS/skills/luman_boot/SKILL.md
```

### `/recall: [topic]`

Retrieve durable context about a topic, project, decision, plan, or open loop from authorized sources rather than relying on conversational memory alone.

Source:

```text
LUMAN_OS/skills/retrieve_context/SKILL.md
```

### `/memory route`

Classify durable information, preserve provenance, and route it to the correct public/private/transient owner.

Source:

```text
LUMAN_OS/skills/memory_route/SKILL.md
```

### `/project status: [project]`

Read current project sources and return the live operating state.

Source:

```text
LUMAN_OS/skills/project_status/SKILL.md
```

### `/decision support`

Compare meaningful options while preserving human decision authority.

Source:

```text
LUMAN_OS/skills/decision_support/SKILL.md
```

### `/sovereignty audit`

Evaluate a module, workflow, memory practice, or recommendation against the Human Sovereignty Constitution.

Source:

```text
LUMAN_OS/skills/sovereignty_audit/SKILL.md
```

### `/morning brief`

Assemble a concise day-start briefing from currently authorized and available sources.

Source:

```text
LUMAN_OS/skills/morning_brief/SKILL.md
```

## Composition Rule

Complex workflows should compose several small skills rather than expanding one skill until it becomes an opaque general agent.

Examples:

```text
LUMAN Boot
-> Retrieve Context
-> Project Status
-> Decision Support
```

```text
Morning Brief
-> Retrieve Context
-> Project Status
-> Decision Support
-> Memory Route
```

## Status

Status: Active  
Version: v1.1  
Created: 2026-08-18  
Updated: 2026-08-18
