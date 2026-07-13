# Gatherer's Ascension Persistent Operations Systems v1

## Purpose

This phase converts major Command Center readouts into saved gameplay mechanics. The player is no longer watching decorative durability, fatigue, storage, or saturation values. These systems now affect gathering decisions, automated operations, efficiency, recovery, and maintenance.

## Save Migration

- Save version increased from 4 to 5.
- Existing saves migrate automatically.
- Existing inventory, coins, progression, tools, gear, Codex discoveries, biomes, zones, and gatherers remain intact.
- Migrated tools begin at full condition.
- Migrated gatherers begin with zero fatigue unless later save data contains fatigue.
- Every biome receives its own saved ecology record.

## Tool Durability

Every player gathering tool now has persistent condition from 0% to 100%:

- Worldroot Axe
- Veinbreaker Pick
- Dawn Sickle
- Relic Gloves

Manual gathering causes wear based on:

- specimen quality
- Mythic status
- tool level
- Field Kit level

Condition affects yield and critical-harvest potential. At zero condition, the player may still perform emergency one-unit gathering so the direct gathering loop never becomes completely unusable.

Tool upgrades restore the upgraded tool to full condition.

## Repair Economy

The Command Center now supports:

- individual tool repair
- Repair All
- condition-based repair prices
- lifetime repair count
- lifetime maintenance spending
- maintenance activity records

Repair costs scale with missing condition and tool level, creating an ongoing but transparent economy sink.

## Gatherer Fatigue

Every automated gatherer now has persistent fatigue from 0% to 100%.

Fatigue:

- increases after every automated cycle
- rises faster in higher-tier and more dangerous zones
- rises more slowly for gatherers with stronger Endurance
- reduces expected yield
- increases cycle duration
- recovers automatically while the gatherer is idle
- blocks deployment at 85% or higher
- triggers an automatic recall at 100%

Gatherer upgrades reduce current fatigue by 12 points in addition to improving equipment.

## Inventory Capacity

Worldroot storage now has a real capacity calculated from:

- base storage
- Worldpack level
- player level
- Endurance
- network level

Automated deployment is blocked when storage is full. Active automated gatherers return automatically when shared storage reaches capacity.

Manual gathering remains possible while overloaded, but it is reduced to emergency one-unit collection. This preserves smooth direct gathering while strongly encouraging liquidation or Worldpack upgrades.

## Persistent Biome Saturation

Each biome now stores its own saturation and lifetime gathering pressure.

Saturation:

- increases from direct gathering
- increases from automated cycles
- increases more from higher-tier routes and larger yields
- regenerates over real elapsed time
- affects manual yield
- affects automated yield
- affects automated cycle duration
- modifies rare-variant opportunity

Low saturation creates a modest ecological bonus. Heavy saturation reduces production and makes route rotation strategically valuable.

## Automated Operation Consequences

Automated operations now react to the persistent systems:

- full storage causes automatic return
- maximum fatigue causes automatic return
- fatigue slows gathering cycles
- saturation slows gathering cycles
- fatigue and saturation reduce expected yield
- low ecological pressure can improve rare opportunity
- every cycle records fatigue and biome pressure

Offline processing continues to work with the same 96-cycle safety cap.

## Command Center Console

A new Persistent Operations Console appears near the top of the real-time dashboard. It includes:

- storage load and remaining capacity
- cargo liquidation action
- current biome saturation
- estimated ecology recovery time
- lifetime ecological pressure
- real tool condition
- individual repair buttons
- Repair All
- gatherer fatigue
- recovery estimates
- active-zone information
- direct recall buttons
- capacity-stop and exhaustion-recall totals
- priority action warnings

The older saturation and tool-condition readouts are synchronized to the persistent values so the dashboard does not present conflicting information.

## Design Law

Every major number on the Command Center should become one of the following:

1. A saved mechanic
2. A clearly labeled projection based on saved mechanics
3. A real browser or session measurement

Decorative values must not be presented as persistent consequences.

## Next Recommended Phase

Persistent Operations Systems v2 should add:

- expedition creation
- route objectives
- team loadouts
- inventory reservations
- expedition supplies
- live decision events
- route extraction choices
- fatigue-aware team synergy
