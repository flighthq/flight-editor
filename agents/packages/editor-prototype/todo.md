# Editor Prototype TODO

Ownership: authored flows and interactions over Flight flow/statechart/runtime primitives.

Implemented foundation:

- Stable flow and interaction identities with duplicate and numeric guards.
- Typed triggers/actions/transitions plus optional conditions and action parameters.
- Reconnectable interaction targets and deterministic graph queries.
- Broken source/target, invalid flow, duration, and ambiguous trigger diagnostics.
- Deterministic revision-stamped compilation snapshots.
- Independent preview/active-flow session revision.

Remaining maturity:

- Typed variable registry and condition operators.
- Overlay geometry, scroll targets, URL validation, and navigation history.
- Named object states and explicit auto-animation mappings.
- Command/gesture adapters for connect, reconnect, cancel, and undo.
- Component-scope target resolution, runtime preview compilation, and YAML round trips.
