# Editor Vector Authoring Proposal

Ownership: Flight Editor over Flight `path`, `path-boolean`, and `shape` primitives. Conditional on vector authoring being a product goal.

Own fill/stroke/subpath/vertex selection, pen and freehand gestures, raw-shape merge behavior, Object Drawing isolation, paint-bucket gap policy, and conversion of edits into commands. Boolean operations, path evaluation, tessellation, and renderable shape data remain upstream.

Acceptance requires topology fixtures, deterministic serialization, exact gesture rollback, and undoable fill/stroke/vertex edits.

