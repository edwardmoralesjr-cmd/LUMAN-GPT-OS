# GPT Builder Lab

Registry and development of LUMAN's specialist modules.

Modules are declared in `luman.json` and validated by `luman doctor`. Each
module points to a manifest in `modules/`. A module that no section uses is
flagged as an orphan — structure is enforced, not assumed.

## Current modules

- `harmonic_time_analyst` — used by the Harmonic Time System section.
- `roseborn_canon_guardian` — used by the Book Section.
