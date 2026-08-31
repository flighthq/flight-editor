# Editor Command TODO

Ownership: Flight Editor.

- Make commands the single authority for label, enabled, visible, checked, shortcut, invocation, and disabled reason.
- Let menus, toolbars, context menus, and command palettes project command state instead of duplicating it.
- Failure-atomic compound batches and explicit keyed coalescing are implemented; gesture/inspector/drawing packages still need to choose and test their boundaries.
- Specify whether selection, playhead movement, and editing-scope navigation participate in document history.
- Core execution, branching clean-state, failure-safe undo/redo, batches, and coalescing are host-independent and tested; command-state projections remain.
