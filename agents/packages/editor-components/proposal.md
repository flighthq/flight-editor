# Editor Components Proposal

Ownership: Flight Editor over an upstream reusable-scene-source/instance contract.

Model component source records, placed instances, stable descendant/property overrides, variant sets/dimensions, typed component properties, preferred instance swaps, named states, reset, detach, swap, nesting, and broken sources. Own commands, selection/editing-scope integration, library presentation data, dependency transfer, and diagnostics; do not implement runtime scene instancing locally.

Track prefab-style added/removed descendants and components as explicit override kinds. Acceptance requires propagation and override matrices, apply/revert/unpack, variant-schema migration, typed property exposure, instance swaps, reordered source descendants, nesting/cycle handling, delete/relink, clipboard, undo, and YAML round trips.
