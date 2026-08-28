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
- Follow Flight's API style: free functions, explicit inputs, `Readonly<T>` parameters, no hidden state.

## Package Map

`@flighthq/` prefix omitted.

**Bedrock cells:**

- `editor-command` — command history: `Command` interface, execute/undo/redo, clean tracking
- `editor-selection` — selection state: multi-select, filters by kind/hierarchy, version tracking
- `editor-clipboard` — clipboard state: copy/cut entries, paste-ready node references
- `editor-hierarchy` — hierarchy tree state: expand/collapse tracking, flattened visible rows for tree views
- `editor-keyboard` — keyboard shortcut registry: action bindings, modifier matching, version tracking
- `editor-node-factory` — node kind registry: register creation functions by category, create nodes from registered kinds
- `editor-scene-state` — scene metadata: name, dimensions, background color, dirty/version tracking
- `editor-snap` — snap configuration: grid and guide management, position snapping
- `editor-tool` — tool registry: register/activate/deactivate tools, pointer dispatch lifecycle
- `editor-viewport` — viewport management: Camera2D wrapper with zoom limits, pan, fit-to-rect, coordinate conversion

**Composition:**

- `tool-editor` — editor application core: `EditorState` (composes command history + selection + clipboard + hierarchy + node factory + tool registry + viewport + scene), concrete commands (add/remove/reparent node, set transform, rename, copy/paste, add-from-factory, group/ungroup, delete/duplicate selection, z-order, align/distribute), concrete tools (select, move, scale, pointer — combined arrow tool with rotation), inspector snapshot for host property panels

**Flight SDK** (`@flighthq/sdk`) — provides `Scene2D`, `Node2D`, `Sprite`, renderers, interaction, picking, scene-formats, and the full graphics substrate.

## Checkpoints

- **After any edit session, before committing** — `npm run fix`.
- **While iterating** — run the narrowest meaningful test (`npm run test --workspace=packages/<name>`).
- **Before handoff** — `npm run check` (package metadata, license provenance, build-output hygiene, types, tests, lint, and formatting).
