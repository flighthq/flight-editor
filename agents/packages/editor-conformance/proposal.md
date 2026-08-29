# Editor Conformance Proposal

Ownership: Flight Editor test tooling.

Publish reusable behavioral scenarios and adapter fixtures rather than product code. Every target should prove common load/edit/undo/save, focus, gesture cancellation, external reload, diagnostics, layout contribution, clipboard, and preview lifecycle behavior while remaining free to render different UI.

The suite should distinguish mandatory core behavior, optional host capabilities, and target-specific assertions, and run in CI against desktop, VS Code, web/test, and in-app adapters.

