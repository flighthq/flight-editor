# Editor Smart Guides TODO

Implemented foundation:

- Deterministic edge and center candidate matching on both axes.
- Tolerance ranking with stable tie-breaking.
- Snap deltas paired with renderer-neutral guide descriptions.
- Finite geometry, duplicate target, malformed guide, and duplicate guide validation.
- Defensive copies and no-op-safe active guide updates.

Remaining maturity:

- Equal-spacing and dimension guide inference.
- Rotated bounds, baselines, path anchors, and layout-container candidates.
- Zoom-aware screen-space tolerances and snap-engine contribution integration.
- Occlusion/ranking policy for dense scenes and multi-object drags.
