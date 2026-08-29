# Change Log

## Unreleased

- Drive selection, validation, edits, commands, and serialization through the shared `tool-editor` runtime.
- Bundle the shared editor core into the extension while retaining the VS Code-specific presentation.
- Select the topmost transformed scene node by clicking it in the canvas.
- Keep click selection distinct from viewport dragging.
- Show scene metadata for the root instead of inapplicable node transform controls.

## 0.1.0

- Open `.flight` scenes in a custom visual editor by default.
- Navigate the scene hierarchy and inspect common node properties.
- Preview scene bounds with nested transforms, pan, zoom, and fit controls.
- Edit node properties through VS Code's document undo, redo, dirty, and save lifecycle.
- Toggle between visual and JSON source editors.
- Refresh visual editors after source, formatter, Git, or external file changes.
- Reject stale visual edits when the source changes concurrently.
- Validate Flight scene format version 1 from the command palette.
