# Flight Editor Codebase Map

This repository is a TypeScript monorepo for editor tooling built around the Flight SDK. Packages are published under the `@flighthq` scope. The `tool-editor` package is the primary editor application; packages prefixed with `editor-*` provide focused capabilities consumed by the editor.

## Ground Rules

- Use `npm`, not `pnpm` or `yarn`.
- After editing source files, run `npm run fix` to apply linting and formatting. Unformatted or unlinted code fails CI.
- Keep modules tree-shakable and declare `"sideEffects": false`.
- `import type { Foo }` must be on its own `import type { }` line.
- Commit messages are single-line only — no body, no `Co-Authored-By` trailers. Format: `type(scope): subject` (Conventional Commits).

## Package Conventions

- Packages live under `packages/`.
- The primary editor tool is `packages/tool-editor` (`@flighthq/tool-editor`).
- Supporting packages use the `editor-*` prefix: `packages/editor-canvas`, `packages/editor-timeline`, etc. (`@flighthq/editor-canvas`, `@flighthq/editor-timeline`).
- Each package has `src/index.ts` as its entry point and colocated `*.test.ts` files.

## Checkpoints

- **After any edit session, before committing** — `npm run fix`.
- **While iterating** — run the narrowest meaningful test (`npm run test --workspace=packages/<name>`).
- **Before handoff** — `npm run typecheck && npm run test`.
