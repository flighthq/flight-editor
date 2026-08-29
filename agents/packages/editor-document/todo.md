# Editor Document TODO

Ownership: Flight Editor.

- Give each open document stable session identity distinct from its file path and scene root.
- Define dirty state from command-history checkpoints instead of overlapping independent flags.
- Coordinate lifecycle, metadata, diagnostics, external revisions, and recovery state with editor-session.
- Specify close, revert, save-as, untitled, deleted-file, and migrated-format behavior.
- Test lifecycle transitions as a state machine, including rejected and retried operations.

