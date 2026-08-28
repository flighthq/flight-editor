# Flight for Visual Studio Code

Flight provides a visual editor for `.flight` scene files while keeping VS Code's text document as the single source of truth.

## Features

- Opens `.flight` files in the visual editor by default.
- Navigates the complete serialized node hierarchy.
- Previews nested node transforms, bounds, visibility, alpha, and packed colors.
- Pans with pointer drag, zooms around the pointer with the wheel, and fits the scene to the viewport.
- Inspects and edits node name, position, scale, rotation (radians), alpha, and visibility.
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

The current canvas is a format-compatible scene preview, not the full Flight renderer. It covers hierarchy, transforms, bounds, and editor interaction without duplicating document ownership. A future browser bootstrap exported by `@flighthq/tool-editor` can replace the preview behind the same document protocol.
