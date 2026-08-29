# Editor Selection TODO

Ownership: Flight Editor; stable node identity and hit primitives are Flight upstream dependencies.

- Store persistent node identities, not child-index paths, at serialization and host boundaries.
- Make selection editing-scope aware and define hidden, locked, guide, and ancestor behavior.
- Define click drilling, marquee containment/intersection, subselection, and selection restoration after undo/reload.
- Separate object selection from vector fill, stroke, vertex, text-edit, and timeline selection modes.
- Test hierarchy reorder, external reload, scope entry/exit, and deleted/recreated identities.

