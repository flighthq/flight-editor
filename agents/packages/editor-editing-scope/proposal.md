# Editor Editing Scope Proposal

Ownership: Flight Editor.

Model the stack of scene, group, symbol, component, or nested-scene editing contexts. Expose breadcrumbs, scope-local/world coordinate conversion, dimming policy, scoped hit testing, selection rules, and enter/exit commands. Scope navigation itself is session state; mutations performed inside the scope remain ordinary document commands.

Acceptance requires nested-scope tests covering reload, undo, deleted scope roots, locked ancestors, and coordinate conversion.

