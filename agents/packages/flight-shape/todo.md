# Flight Shape Upstream TODO

Ownership: Flight upstream (`@flighthq/shape`, `@flighthq/path`, and `@flighthq/path-boolean`).

- Ensure editable path topology can round-trip without losing segment identity or authoring precision.
- Expose robust nearest-segment, nearest-control-point, containment, intersection, split, join, and boolean primitives.
- Define deterministic tolerances and results across platforms and renderers.
- Keep tool gestures, raw-shape merge policy, selection, and undo in Flight Editor.
- Add adversarial topology fixtures covering holes, self-intersections, degenerate segments, and transforms.

