# Gatherer's Ascension Command Center Master Specification

## Locked Core Identity

The Command Center is the central operational hub of Gatherer's Ascension. It must feel like a living world-monitoring and strategic gathering system rather than a traditional menu.

A player opening the Command Center should immediately understand:

- their active biome and its identity
- currently available and unidentified resources
- active gathering routes and their expected outcome
- gatherer, tool, and equipment performance
- environmental conditions and explicit gameplay modifiers
- biome saturation, recovery, and operational pressure
- threats, anomalies, respawn timing, and expedition status
- the most important action or objective to take next

## Information Priority Law

### Primary

- selected biome
- tactical map
- active route
- expedition status
- efficiency
- major threats

### Secondary

- environmental conditions
- tool condition
- respawn timers
- projected yield
- biome saturation

### Detailed

- formulas and probability breakdowns
- historical graphs
- individual gatherer calculations
- route comparisons
- full tool statistics

The interface may be information-dense, but it must remain readable and clearly prioritized.

## Current Playable Command Center V2

The current implementation includes:

- biome intelligence identity and level presentation
- biome saturation and recovery telemetry
- weather, temperature, wind, time, season, visibility, and instability readouts
- explicit positive and negative biome modifiers
- interactive tactical biome map
- unlocked, locked, active, selected, and unidentified node states
- animated radar and manual scan pulse
- route optimization modes for resources, rarity, speed, safety, value, and experience
- route distance, time, expected yield, market value, durability cost, energy cost, threat, and rare potential
- harvest efficiency and threat gauges
- anomaly waveform monitor
- harvest trend graph
- projected harvest by material
- resource respawn timers
- expedition clock and active-team readouts
- tool and equipment condition presentation
- commander status and reputation rank
- resource currency matrix
- direct quick actions into Field, Network, Gatherers, Codex, and Upgrades
- responsive desktop and mobile layouts

This dashboard is implemented as a non-destructive presentation layer and does not alter existing save data.

## Current Simulation Boundary

Several V2 values are currently derived telemetry rather than permanent systems. They provide a playable interface foundation but are not yet saved as independent world-state variables.

Derived systems currently include:

- biome saturation
- weather and environmental profiles
- tool condition
- respawn countdowns
- anomaly waveform
- historical production trend
- secondary progression currencies
- projected route distance and energy costs

These values must become persistent mechanics in later development phases before they can create permanent depletion, damage, repair, weather history, currency spending, or world-event consequences.

## Required Future Mechanics

### Phase 2: Persistent World Ecology

- saved biome saturation
- biome regeneration over real time
- dynamic weather and seasons
- resource-node respawn state
- anomaly buildup and event resolution
- biome XP and biome-specific unlocks

### Phase 3: Route and Expedition Simulation

- player-created route paths
- multiple target nodes per route
- route presets
- inventory capacity requirements
- actual energy consumption
- tool durability loss
- gatherer fatigue and recovery
- expedition phases and extraction windows

### Phase 4: Equipment and Economy Integration

- persistent durability
- repairs and repair costs
- consumable power cells
- scanners and scan levels
- real secondary currencies
- crafting costs and tracked upgrade requirements
- projected market-value history

### Phase 5: Living World Events

- temporary anomaly resources
- severe weather hazards
- migration and creature-resource events
- limited-time Codex discoveries
- biome-wide events
- asynchronous community activity only when a real backend exists

## Trustworthiness Rule

The game must not display fake real-player counts or pretend local simulation data is live multiplayer information. Until a real backend exists, global activity should be presented as world ecology, network activity, or simulation intelligence rather than verified online-player data.

## Visual Language

- deep forest green and near-black foundation
- muted gold, pale green, ivory, cyan, and rarity colors
- thin illuminated borders
- subtle glass panels
- animated scan lines and radar sweeps
- rotating gauges and smooth progress movement
- warning flashes only when meaningful
- natural fantasy fused with advanced Worldroot monitoring technology

## Final Purpose

The Command Center must transform gathering from repeated collection into strategic world management. The player commands explorers, routes, tools, biomes, discoveries, automation, and long-term mastery through one advanced operational interface.
