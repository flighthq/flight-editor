# Editor Design Tokens Proposal

Ownership: Flight Editor over Flight value primitives.

Provide typed variables and compound styles with stable identity, collection membership, modes, aliases, scopes, usage, grouping, rename/delete/relink, library provenance, and propagation commands. Track bindings separately from copied literals and distinguish authored values from resolved values. Rendering consumes resolved values; panels are replaceable presentations.

Acceptance requires typed validation, mode and scope resolution, alias cycles, propagation, detach-to-literal, missing-binding diagnostics, prototype/runtime binding, clipboard dependency transfer, and serialization tests.
