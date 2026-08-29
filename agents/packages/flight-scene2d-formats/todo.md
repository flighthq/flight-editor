# Flight Scene2D Formats Upstream TODO

Ownership: Flight upstream (`@flighthq/scene2d-formats`).

- Expose authoring-safe serialization primitives with stable identities and reference fixups.
- Return structured codec diagnostics, including machine-readable codes and source locations where the source codec supports them.
- Define unknown node/component/property preservation and schema migration hooks.
- Separate semantic scene serialization from Flight Editor's YAML syntax and formatting policy.
- Provide fixtures that prove clone, migration, identity, references, and unknown-data round trips.

