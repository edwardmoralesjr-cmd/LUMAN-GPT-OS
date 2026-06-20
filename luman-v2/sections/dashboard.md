# Dashboard

The dashboard is rendered live by the runtime from `state/priorities.json` and
`state/loops.json`. There is no static status to maintain here — this file holds
only the *narrative* notes that don't belong in structured state.

## Notes

- Status numbers (open loops, priorities, next move) are always computed, never typed.
- To change what shows on the home screen, edit the state files, not the menus.
