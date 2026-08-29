# Editor Responsive Layout Proposal

Ownership: Flight Editor authoring over `@flighthq/layout` resolution.

Expose explicit pins; fixed, fill, hug/intrinsic, and min/max sizing; horizontal, vertical, and wrapping layout; order, row/column gap, padding, alignment, baseline, absolute children; and optional constraint inference. Convert property and canvas edits into commands, show layout-controlled fields clearly, and report contradictory constraints. Do not fork layout resolution in the editor.

Acceptance requires nested and wrapping fixtures, hug/fill/min/max behavior, absolute children, manual-transform precedence, drag reordering, resize versus scale gestures, over-constraints, serialization, and parity with upstream runtime resolution.
