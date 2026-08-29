# Flight Picking Upstream TODO

Ownership: Flight upstream (`@flighthq/picking` and Scene2D interaction primitives).

- Provide ordered Scene2D hit results with local/world coordinates and configurable predicates.
- Support editor-quality hit testing for transformed, clipped, hidden, locked-by-policy, and nested content without importing editor state.
- Expose geometry-detail hooks needed for fill, stroke, path-segment, and handle subselection.
- Keep click drilling and editing-scope policy in Flight Editor.
- Test deterministic ordering and parity across render backends.

