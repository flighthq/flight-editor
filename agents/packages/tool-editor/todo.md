# Tool Editor TODO

Ownership: Flight Editor composition layer.

- Keep this package as composition and public runtime facade; move reusable domain behavior into bedrock cells.
- Replace child-index paths in the public runtime API with stable identities, retaining paths only as derived addresses.
- Compose session, diagnostics, gestures, editing scopes, preview, and contribution registries.
- Keep DOM, desktop, VS Code, and in-app views outside the agnostic runtime boundary.
- Run the same conformance scenarios through every host adapter and renderer.

