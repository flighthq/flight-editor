# Flight for Visual Studio Code

Flight provides a visual editor for `.flight` scene files while keeping VS Code's text document as the single source of truth.

## Features

- Opens `.flight` files in the visual editor by default.
- Navigates the complete serialized node hierarchy.
- Previews nested node transforms, bounds, visibility, alpha, and packed colors using matrices calculated by the shared runtime.
- Clicks or shift-clicks to select, marquee-selects empty viewport regions, pans with Hand/Space, zooms around the pointer, and fits the scene.
- Moves with optional ten-unit grid snapping, uniformly scales, and rotates one or many nodes as single document transactions.
- Inspects and edits node name, position, scale, rotation (radians), alpha, and visibility from shared property metadata.
- Creates registered node kinds, duplicates and deletes selections, and reparents nodes by dragging the hierarchy.
- Routes visual edits through VS Code, preserving dirty state, save, undo, and redo.
- Refreshes every visual editor when its source changes, including changes made by formatters and external tools.
- Rejects edits based on stale revisions instead of overwriting newer source.
- Reports malformed JSON and incompatible Flight document versions inside the editor.

Use the editor-title actions or these commands:

- `Flight: Open Source`
- `Flight: Open Visual Editor`
- `Flight: Validate Scene`

## Development

From `extensions/vscode`:

```sh
npm run check
```

Open the same directory in VS Code and run **Run Flight Extension**. The included `fixtures/sample.flight` file is a small scene for exercising visual edits, source toggling, undo/redo, save, and external reload behavior.

## Architecture

The custom text editor deliberately lets VS Code own document persistence and history. A revisioned message protocol sends immutable snapshots to the webview. Inspector edits include the revision they were based on; the extension validates the scene and revision before applying one `WorkspaceEdit`.

The extension bundles and creates the same `EditorRuntime` from `@flighthq/tool-editor` used underneath the desktop editor. The VS Code hierarchy, canvas, and inspector are a pluggable presentation: selection, validation, scene mutation, commands, and serialization go through the shared runtime, while VS Code owns document persistence.

The current canvas presentation is bounds-oriented rather than the desktop WebGL renderer. Its traversal, visibility, dimensions, and complete nested transform matrices come from the runtime's render snapshot, keeping picking and presentation geometry consistent without coupling the shared core to DOM or VS Code APIs.
