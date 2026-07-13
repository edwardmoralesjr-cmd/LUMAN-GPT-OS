# Gatherer's Ascension Real-Time Dashboard Telemetry

## Purpose

The Command Center now includes a dedicated real-time telemetry matrix that updates while the game is open. It separates measured game-state information from calculated projections so the interface remains dense, useful, and trustworthy.

## Measured Live Data

The dashboard reads these values directly from current game state or the browser session:

- local clock
- current session uptime
- browser visibility state
- browser online/offline state
- interface frame rate
- age of the most recent game-state change
- current save-status label
- selected soundtrack
- active automated operations
- each gatherer's current cycle position and return timer
- inventory units and cargo value
- coin reserve and total net worth
- actual resources gathered during the last 60 seconds and five minutes
- actual coins earned during the last 60 seconds
- actual cargo-value change during the last 60 seconds
- lifetime manual and automated yield
- completed automated cycles
- player level and XP
- network level and XP
- stat points and command points
- unlocked zone and biome counts
- tool mastery progression
- discovered materials and quality records
- Mythic discoveries
- discovery momentum
- active discovery-boost countdown
- recent network activity and event age

## Projected Live Data

These calculations use current gatherers, zones, equipment, progression, and resource values:

- expected units per gathering cycle
- projected units per minute
- projected market value per minute
- projected cycles per minute
- expected return order
- manual Mythic-node chance estimate
- automated-network Mythic chance estimate

Projected metrics are visibly labeled `PROJECTED`. Measured metrics are labeled `MEASURED`.

## Update Cadence

- visual telemetry refresh: 250 milliseconds
- historical flow sampling: one second
- measured rolling windows: 60 seconds and five minutes
- frame-rate sample: approximately one second

The telemetry layer automatically remounts after the tactical Command Center performs a full dashboard render.

## Trust Rule

The dashboard does not invent multiplayer populations, server activity, latency, market demand, or community statistics. Browser connectivity is labeled as client connectivity, not as proof of a multiplayer server connection.

## Future Persistent Telemetry

The following should be added only after they become real saved mechanics:

- permanent tool durability and repair history
- gatherer fatigue and recovery
- saved biome saturation and regeneration
- persistent weather history and forecasts
- real node respawn state
- real energy and power-cell consumption
- route-specific inventory capacity
- crafting queues and production timers
- persistent market-price movement
- backend-sourced player or community activity
