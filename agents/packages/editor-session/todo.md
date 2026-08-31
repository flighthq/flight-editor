# Editor Session TODO

Implemented foundation: ordered multi-document state, active-document fallback, identity/URI uniqueness, dirty-close decisions, monotonic revisions, external status, and last-known-good revision tracking. The cell is composed into `tool-editor`.

Next maturity work:

- Coordinate concrete document/file/scene-IO states and asynchronous cancellation tokens.
- Add save/revert/save-as/recovery decisions and untitled URI assignment.
- Persist safe recovery metadata through host adapters.
- Add integration tests for concurrent save/reload, deleted files, invalid YAML, and document switching.
