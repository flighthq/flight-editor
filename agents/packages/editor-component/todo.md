# Editor Component TODO

Canonical package: `@flighthq/editor-component` (singular).

Ownership: reusable component definitions and editor-side instance authoring over an upstream reusable-scene contract.

Implemented foundation:

- Stable definition, instance, descendant, and property override identities.
- Explicit property, added/removed descendant, and component override kinds.
- Collision guards for definitions, instances, and override targets.
- Broken-source preservation, deterministic diagnostics, and atomic relinking.
- Instance swap with override preservation/reset and detach materialization payloads.
- Nested-definition cycle detection and deterministic definition/instance queries.
- No-op override updates avoid spurious document revisions.

Remaining maturity:

- Variant dimensions/defaults and deterministic instance migration are implemented; variant-set presentation, typed properties, preferred swaps, and named states remain.
- Component snapshot commands provide atomic undo for swaps, override resets, and future propagation; apply-to-source/revert policy and editing-scope integration remain.
- Source updates now reconcile variant selections and preserve/report orphaned stable-descendant overrides; runtime materialization and reordered-descendant propagation still depend on the upstream reusable-scene contract.
- Clipboard dependency transfer and YAML round trips.
- Component library presentation and cross-document source resolution.
