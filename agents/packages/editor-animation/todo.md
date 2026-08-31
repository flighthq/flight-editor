# Editor Animation TODO

Ownership: Flight Editor authoring over Flight animation and timeline runtime packages.

Implemented foundation:

- Stable node/property keyframe targets with unique timeline slots.
- Deterministic track and node queries.
- Keyframe validation, collision-safe updates, and hydration diagnostics.
- Insert-time and delete-time ripple operations.
- Separate authored and playback-session revisions, so scrubbing and playback do not dirty documents.
- Finite time/duration guards and playhead clamping.

Remaining maturity:

- Editable layer and nested-timeline models.
- Tween and motion-path validation backed by upstream interpolation primitives.
- Frame-span clipboard transfer with dependency collection.
- Snapshot command adapters now provide atomic undo/redo for ripple and multi-keyframe edits; gesture-specific coalescing remains.
- Onion-skin presentation contributions and 3D transform channel metadata.
- YAML round trips once the upstream animation schema is finalized.
