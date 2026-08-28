# Flight Editor Codebase Map

This repository is a TypeScript monorepo for editor tooling built around the Flight SDK. Packages are published under the `@flighthq` scope. The `tool-editor` package is the primary editor application; packages prefixed with `editor-*` provide focused capabilities consumed by the editor.

## Ground Rules

- Use `npm`, not `pnpm` or `yarn`.
- After editing source files, run `npm run fix` to apply linting and formatting. Unformatted or unlinted code fails CI.
- Keep modules tree-shakable and declare `"sideEffects": false`.
- `import type { Foo }` must be on its own `import type { }` line.
- Commit messages are single-line only — no body, no `Co-Authored-By` trailers. Format: `type(scope): subject` (Conventional Commits).

## Architecture

Flight provides the substrate: scene graph, rendering, interaction, picking, serialization. The editor orchestrates these — it does not reinvent them. The scene document IS the document model (Flight's `Scene2D`); the editor adds selection, commands, tools, and host adaptation.

The editor core is host-agnostic. A desktop app renders GUI inside the Flight scene; a VSCode extension uses IDE panels. The editor exposes state and commands; the host decides presentation.

## Package Conventions

- Packages live under `packages/`.
- The primary editor tool is `packages/tool-editor` (`@flighthq/tool-editor`) — the composition layer.
- Supporting packages use the `editor-*` prefix and are bedrock cells: each is simple, with minimal cross-dependencies.
- Each package has `src/index.ts` as its entry point and colocated `*.test.ts` files.
- Every hand-authored `*.ts` or `*.tsx` file under `packages/*/src/`, including `index.ts`, has a colocated `*.test.ts` or `*.test.tsx` file. Scripts are exempt.
- Every locally declared exported function has an exact-name `describe('<exportName>', ...)` block in its colocated test file. Re-export-only entry points use package-surface tests instead of duplicating every implementation suite.
- The completeness gate proves file and suite structure, not behavioral coverage; keep substantive assertions inside the named suites.
- Follow Flight's API style: free functions, explicit inputs, `Readonly<T>` parameters, no hidden state.

## Package Map

`@flighthq/` prefix omitted.

**Bedrock cells:**

- `editor-clipboard` — clipboard state: copy/cut entries, paste-ready node references
- `editor-color` — color picker state: active packed color, saved swatches, bounded recent-color history
- `editor-command` — command history: `Command` interface, execute/undo/redo, clean tracking
- `editor-context-menu` — hierarchical context-menu registry with enabled state, open position, and active item selection
- `editor-drag-drop` — drag-and-drop state: tracks drag operations from library/hierarchy/external into the scene
- `editor-guides` — guide state: horizontal/vertical ruler guides with add/remove/lock/move and snap positions
- `editor-hierarchy` — hierarchy tree state: expand/collapse tracking, flattened visible rows for tree views
- `editor-history-state` — user-facing history panel checkpoints: labeled snapshot data, browsing, removal, version tracking
- `editor-keyboard` — keyboard shortcut registry: action bindings, modifier matching, version tracking
- `editor-lock` — lock state: tracks which nodes are locked to prevent editing
- `editor-node-factory` — node kind registry: register creation functions by category, create nodes from registered kinds
- `editor-rulers` — ruler display state: visibility, units (pixels/inches/cm), origin, tick spacing, subdivisions
- `editor-scene-state` — scene metadata: name, dimensions, background color, dirty/version tracking
- `editor-selection` — selection state: multi-select, filters by kind/hierarchy, version tracking
- `editor-snap` — snap configuration: grid and guide management, position snapping
- `editor-text-style` — active text formatting state for host property panels and Flight text formats
- `editor-tool` — tool registry: register/activate/deactivate tools, pointer dispatch lifecycle
- `editor-transform-origin` — transform-origin mode and scene-space origin computation for node bounds
- `editor-viewport` — viewport management: Camera2D wrapper with zoom limits, pan, fit-to-rect, coordinate conversion
- `editor-zoom-presets` — named viewport zoom levels and scene-fit calculations

**Composition:**

- `tool-editor` — editor application core: `EditorState` (composes command history + context menus + selection + clipboard + drag-drop + guides + hierarchy + keyboard + locks + node factory + rulers + scene metadata + snapping + text style + tool registry + transform origin + viewport + zoom presets + scene), concrete commands (add/remove/reparent node, set transform/pivot/alpha/visible/blend-mode, batch transform, rename node/scene, copy/paste, add-from-factory, group/ungroup, delete/duplicate/lock selection, z-order, align/distribute, clear scene, set scene size/color/background), concrete tools (select, marquee, move, scale, rotate, pointer — combined arrow tool with rotation, hand — viewport pan, zoom — click/drag zoom), inspector snapshot for host property panels

**Flight SDK** (`@flighthq/sdk`) — provides `Scene2D`, `Node2D`, `Sprite`, renderers, interaction, picking, scene-formats, and the full graphics substrate.

## Checkpoints

- **After any edit session, before committing** — `npm run fix`.
- **While iterating** — run the narrowest meaningful test (`npm run test --workspace=packages/<name>`).
- **Before handoff** — `npm run check` (package metadata, source/test completeness, license provenance, build-output hygiene, types, tests, lint, and formatting). Run `npm run exports:check` for the focused source/test completeness gate.
