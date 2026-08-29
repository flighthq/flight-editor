# Editor embedding architecture

Flight has one editor core and multiple presentations.

```text
                         @flighthq/tool-editor
                    EditorRuntime + EditorState
                  commands, tools, scene, history, I/O
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
       Desktop host       VS Code host      In-app host
       Flight-native      IDE webview        game overlay
       presentation       presentation       presentation
       Tauri adapter      document bridge    game adapter
```

`createEditorRuntime()` is the embedding boundary. It owns the editor state, default commands and tools, scene serialization, selection, and mutation. A host may provide an `editor-host` adapter for filesystem, clipboard, dialogs, titles, and messages. Presentation remains pluggable and does not own a second editor model.

## Desktop

`createDesktopEditor()` creates an `EditorRuntime` and adds session lifecycle and ticking. The Tauri application adds the Tauri host adapter, Flight renderer, DOM input binding, and desktop layout.

## Visual Studio Code

The extension creates one `EditorRuntime` for each custom editor panel. Its revisioned bridge loads VS Code's current text document into that runtime. Hierarchy selection and inspector edits are sent to the runtime; accepted edits are serialized by the runtime and applied as VS Code `WorkspaceEdit` operations. VS Code therefore remains responsible for dirty state, undo/redo, saving, and external file changes.

The hierarchy/canvas/inspector webview is intentionally VS Code-specific. It is a presentation plug-in over the shared runtime, not an alternative implementation of scene editing.

## In-app or in-game

An application can embed the same runtime directly:

```ts
import { createEditorRuntime } from '@flighthq/tool-editor';

const editor = createEditorRuntime({
  hostAdapter: gameHostAdapter,
  viewportWidth: gameViewport.width,
  viewportHeight: gameViewport.height,
});

gameOverlay.attach(editor);
```

The game overlay chooses its own presentation and input routing. It operates on `editor.state` and the runtime command API, so documents and editing behavior stay compatible with desktop and VS Code.

## Boundary rule

Host packages may implement presentation, transport, and platform I/O. Scene mutation, command semantics, selection, tools, history, and serialization belong in `tool-editor`. If two hosts need the same behavior, move it into the runtime instead of copying it between hosts.
