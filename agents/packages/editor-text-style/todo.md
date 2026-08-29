# Editor Text Style TODO

Ownership: Flight Editor over Flight text shaping/layout primitives.

- Distinguish literal formatting from references to reusable text-style tokens.
- Cover point text, area text, auto/fixed height, overflow, paragraph spacing, vertical alignment, and text transforms.
- Represent mixed formatting and partial text-range selection without flattening rich text.
- Resolve missing fonts and unsupported variations through diagnostics and deterministic fallback.
- Test token propagation, range edits, clipboard, layout reflow, reload, and host inspector parity.

