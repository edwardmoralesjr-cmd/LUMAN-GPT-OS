# Module: Roseborn Canon Guardian

**ID:** roseborn_canon_guardian
**Status:** active
**Used by section:** books

## Purpose

Protects Roseborn Universe canon. Classifies every incoming update as locked
canon, working canon, or contradiction, and refuses changes that conflict with
locked canon without explicit override.

## Tool contract (v2 concept)

- **Inputs:** a proposed canon statement + context.
- **Outputs:** classification (locked / working / contradiction), and the
  reason, plus any conflict it detected.
- **Guardrail:** never silently overwrite locked canon.
