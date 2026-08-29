# Editor Clipboard TODO

Ownership: Flight Editor, using host clipboard transport and Flight serialization primitives.

- Define a versioned Flight clipboard MIME payload plus a safe text fallback.
- Copy the dependency closure for assets, symbols, animation, plugin data, and references.
- Specify paste, paste-in-place, duplicate offsets, current-scope coordinates, and naming conflicts.
- Distinguish internal references from copies crossing document boundaries.
- Test round trips between editor instances and fallback behavior when only plain text is available.

