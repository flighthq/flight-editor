# flight-editor

Editor tooling for the Flight SDK.

## Setup

```bash
npm install
```

## Development

```bash
npm run build        # Build all packages
npm run check        # Run the full repository quality gate
npm run test         # Run tests
npm run fix          # Lint + format
npm run typecheck    # Type check
```

## Code Quality

- **Formatter**: oxfmt
- **Linter**: oxlint
- **Commit style**: Conventional Commits (`type(scope): subject`)
- **Git hooks**: husky (pre-commit: lint-staged, commit-msg: commitlint)
- **Repository hygiene**: package/lock consistency, license provenance, and orphaned build-output checks
