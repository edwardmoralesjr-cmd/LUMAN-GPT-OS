# LUMAN HUD

## Purpose

Provide a visual, read-first command surface over LUMAN OS without turning the interface into a new source of truth.

## V1 Scope

The first deployed HUD is intentionally public-safe.

It can read current public LUMAN state directly from the public GitHub brain:

- `00_CORE/ACTIVE_PRIORITIES.md`
- `00_CORE/OPEN_LOOPS.md`
- `LUMAN_OS/system_settings/PROJECT_REGISTRY.md`
- `LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md`

It renders:

- sovereignty / source status;
- current Top 3;
- current strategic fronts;
- selected active projects and next gates;
- selected public open loops;
- current LUMAN system-development gate;
- bounded command controls.

## Critical Security Boundary

The public HUD must **not** fetch or expose:

- private-vault contents;
- Gmail message contents;
- Google Calendar event contents;
- private financial, health, family, vehicle/home, employer-confidential, or credential data.

Those sources require an authenticated LUMAN bridge in a later phase.

```text
Public GitHub brain -> browser-safe direct read
Private brain       -> authenticated bridge only
Google Calendar     -> authenticated bridge only
Gmail               -> authenticated bridge only
```

## Action Boundary

V1 command controls prepare/copy LUMAN commands. They do not silently execute them.

Examples:

```text
/morning brief
/weekly sync
/capture idea:
/remember:
/project review:
/family plan:
/release status:
/decision support
```

Execution remains in connected LUMAN/ChatGPT until a separately authenticated action bridge is built.

## Run Locally

Serve the `app/` directory with any static web server. Example:

```bash
cd LUMAN_OS/hud/app
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

The existing repository Pages deployment remains owned by the Gatherer's Ascension workflow. The workflow packages this HUD alongside the game under:

```text
/luman-hud/
```

The game remains at the existing root deployment.

## Governing Law

```text
HUD = interface
Sources = truth owners
LUMAN = synthesis / recommendation / authorized action
Edward = final human authority
```

The HUD must never become an independent memory store or silently infer that visible free time, inbox volume, or interface prominence equals human priority.

## Status

Status: V1 read-first prototype
Created: 2026-08-18
