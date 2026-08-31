# Editor Align TODO

Implemented foundation:

- Deterministic alignment mutation plans against selection, artboard, or key-object bounds.
- Horizontal and vertical equal-gap distribution.
- Equal-size plans using deterministic average dimensions.
- Stable item identity, duplicate, finite-bounds, and reference validation.
- No-op-safe alignment preference state.

Remaining maturity:

- Rotated/world-space bounds and parent-coordinate conversion.
- Locked/layout-controlled applicability and disabled-reason projection.
- Command generation, preview overlays, and multi-selection integration.
- Pixel rounding policy and tolerance fixtures across renderer scales.
