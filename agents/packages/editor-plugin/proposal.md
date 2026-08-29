# Editor Plugin Proposal

Ownership: Flight Editor contribution and document-extension layer; installation and permissions are host concerns.

Define versioned plugin contributions for commands, panels, inspectors, tools, node factories, import/export, diagnostics, developer code generators, resource search, optional widgets, and namespaced document data. Require capability declarations, deterministic conflicts, disposal, migration, and command-only document mutation. Do not embed a marketplace or network authority in core.

Acceptance requires load/unload, duplicate IDs, failed activation, missing-plugin document data, migrations, transaction enforcement, generator no-mutation guarantees, widget schema validation, subscription disposal, and host capability tests.
