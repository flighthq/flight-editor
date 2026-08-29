# Editor Diagnostics Proposal

Ownership: Flight Editor, with codec/runtime facts supplied by Flight upstream.

Define structured diagnostics with code, severity, message, source range, document revision, affected identities, and whether visualization or mutation is blocked. Aggregate YAML parse/schema errors, missing assets, unsupported nodes, host failures, and runtime-preview failures without coupling the core to VS Code diagnostics.

Acceptance requires stale-diagnostic rejection, deterministic ordering, last-known-good behavior, and host projection tests.

