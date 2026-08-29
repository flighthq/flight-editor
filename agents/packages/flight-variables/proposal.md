# Flight Variables Upstream Proposal

Ownership: Flight upstream if variables must resolve dynamically at runtime. Confirm existing registry/state/binding primitives cannot already satisfy this contract.

Provide typed variable identity, collections, modes, aliases, scope resolution, bindings to supported runtime properties, deterministic evaluation, cycle/missing diagnostics, and safe hot replacement. Keep design-system organization, pickers, library UX, edit commands, and literal-detach behavior in Flight Editor.

Acceptance requires mode inheritance, nested scopes, aliases and cycles, type mismatch, missing values, statechart/flow writes, serialization/reference fixup, and hot reload. If variables are compile-time-only, resolve them in the editor/format pipeline and do not add an upstream runtime package.
