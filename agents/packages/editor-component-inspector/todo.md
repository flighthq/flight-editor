# Editor Component Inspector Follow-up

Implemented in `@flighthq/editor-component-inspector`: owner-scoped typed schemas, field defaults and validation, schema migration, unknown component preservation and raw inspection, mixed/multi-target projections, locked-target behavior, add/remove/reset/enable/set mutations, deep-copy clipboard, plugin unload, and undoable commands.

Remaining integration work:

- Add typed reference resolution once Flight publishes canonical node, asset, and component reference descriptors.
- Let packages contribute optional scene gizmo factories through the future plugin registry.
- Bind the projection to default Flight GUI and VS Code property panel renderers for cross-host conformance fixtures.
