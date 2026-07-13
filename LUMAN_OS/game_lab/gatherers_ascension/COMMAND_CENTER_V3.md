# Gatherer's Ascension — Command Center V3

## Purpose

Command Center V3 replaces the previous layered dashboard implementation with one stable, functional command interface. It is designed around clear decisions rather than maximum panel density.

## Architecture

Only one dashboard component owns the Dashboard view:

- `CommandCenterDashboardV3.ts`
- `command-center-v3.css`
- `command-center-v3-brand.css`
- `command-center-v3-assets.css`
- `command-center-v3-fit.css`

The older V2 dashboard, live telemetry deck, persistent operations console, stability controller, and stable telemetry patch are no longer initialized from `main.ts`.

## Functional Layout

### Header and Treasury

The existing navigation, save state, music controls, coin reserve, cargo value, net worth, production rate, next investment, and liquidation controls remain active.

### Left Operations Rail

- Current biome and network level
- Network XP and connected-zone count
- Current environmental profile
- Persistent biome saturation
- Three selectable biome routes
- Route activity and cycle timing
- Direct Field, Network, Codex, liquidation, maintenance, and Upgrades commands

### Central Tactical Map

- Bundled vector Worldroot terrain artwork
- Central biome command core
- Three selectable gathering nodes
- Real unlocked, locked, ready, and active states
- Real cycle countdowns
- Clickable map nodes
- Zoom controls
- Active-expedition summary
- Context-sensitive primary command

### Right Intelligence Rail

- Selected-node intelligence
- Stability, projected yield, cycle timing, resource focus, and danger
- Link status for each biome node
- Real storage, fatigue, equipment, ecology, and threat alerts
- Context-sensitive command recommendation

### Bottom Tactical Analytics

- Rolling yield trend
- Net-worth trend
- Projected production rate
- Biome efficiency based on real saturation, fatigue, and tool condition
- Threat monitor based on selected route danger, stability, and ecology

## Functional Commands

Dashboard actions connect directly to existing systems:

- Enter Field
- Open Network route controls
- Open Codex
- Open Upgrades
- Liquidate cargo
- Repair all tools
- Select route/node
- Adjust tactical-map zoom

The primary command changes according to current conditions:

1. Liquidate cargo when storage pressure is high
2. Repair equipment when tool condition is critical and funds are available
3. Deploy a team when no automated operation is active
4. Rotate routes when biome saturation is high
5. Enter the Field when systems are stable

## Stability Law

- The dashboard structure mounts once per Dashboard visit.
- One-second updates change text, classes, SVG points, gauges, and progress widths in place.
- No mutation observer is used.
- No automated scroll restoration is used.
- No V2 dashboard or overlapping telemetry renderer runs in the background.
- The desktop command center is fitted to the browser viewport.

## Art Direction

The supplied Gatherer's Ascension artwork established the visual direction:

- black and deep-green command surfaces
- luminous emerald and teal signals
- metallic Worldroot ornament
- elegant gothic-fantasy typography
- tactical nature-tech map language

The implementation includes bundled SVG assets for the Worldroot emblem and tactical map so GitHub Pages can load the art reliably with Vite's relative production base.
