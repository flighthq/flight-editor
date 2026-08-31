# Editor Gesture TODO

Implemented foundation: exclusive typed transactions, unique IDs, preview tracking, exact initial-state rollback, explicit commit, and classified interruption. The cell is composed into `tool-editor`.

Next maturity work:

- Connect tool pointer capture and inspector scrubbing to the shared lifecycle.
- Pair completed gestures with one command-history transaction and enforce rollback on command failure.
- Add coordinate/pointer metadata without coupling the package to DOM events.
- Add cross-tool tests for blur, document replacement, pointer cancellation, and temporary tools.
