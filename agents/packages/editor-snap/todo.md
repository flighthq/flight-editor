# Editor Snap TODO

Ownership: Flight Editor, consuming Flight bounds and geometry queries.

- Replace a single position snap with ranked candidates for edges, centers, gaps, guides, grid, pixels, angles, and geometry.
- Return the winning target, axis, distance, and presentation geometry for smart-guide overlays.
- Define tolerance in viewport pixels and convert it consistently at zoom and device-pixel ratios.
- Make candidate filtering editing-scope, lock, visibility, and moving-selection aware.
- Test deterministic priority, equidistant candidates, multi-selection resize, rotation, and nested transforms.

