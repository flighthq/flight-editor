# Editor Boolean TODO

Implemented foundation:

- Validated compound identities and minimum operand arity.
- Stable operand identities, self-reference rejection, and duplicate guards.
- Deterministic operand-order normalization and result ordering.
- Replacement semantics and malformed hydration diagnostics.
- Independent session revision for the active boolean tool.

Remaining maturity:

- Atomic snapshot commands cover compound state changes; upstream vector boolean execution remains.
- Live/non-destructive compound expansion, release, and operand reordering.
- Geometry failure diagnostics and selection restoration across undo.
