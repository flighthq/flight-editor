# Editor Responsive Layout Proposal

Ownership: Flight Editor authoring over `@flighthq/layout` resolution.

Expose explicit pins, stretch/fixed/intrinsic sizing, stack direction/order/gap/padding/alignment, and optional constraint inference. Convert property and canvas edits into commands, show layout-controlled fields clearly, and report contradictory constraints. Do not fork layout resolution in the editor.

Acceptance requires nested-layout fixtures, manual-transform precedence, reordering, resize gestures, over-constraints, serialization, and parity with upstream runtime resolution.

