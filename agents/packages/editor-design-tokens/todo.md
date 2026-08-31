# Editor Design Tokens Follow-up

Implemented in `@flighthq/editor-design-tokens`: typed literals and compound styles; stable collections, groups, modes, aliases, scopes, provenance, and bindings; mode inheritance; cycle/missing/type diagnostics; relink/delete policy; detach-to-literal; deterministic authoring resolution; serialization; and undo commands.

Remaining integration work:

- Add clipboard dependency-closure transfer alongside the shared asset transfer protocol.
- Bind supported Flight node properties through canonical reference descriptors when those land upstream.
- Decide whether prototype/statechart writes require runtime variables; keep `agents/packages/flight-variables/proposal.md` open until Flight registry/state primitives are assessed.
- Add runtime hot-reload and serialization fixup fixtures only if dynamic runtime resolution is adopted upstream.
