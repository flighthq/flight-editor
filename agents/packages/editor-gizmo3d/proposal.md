# Editor Gizmo3D Proposal

Ownership: Flight Editor over Flight transform/math/picking primitives and editor-gesture.

Provide move, rotate, scale, rect/plane, and combined gizmos with axis/plane/free/screen modes, local/world orientation, pivot/center placement, stable screen-space sizing, hover feedback, snapping, and multi-selection transforms. Component gizmos are contributions using the same overlay/picking protocol.

Acceptance requires nested/rotated/negative transforms, perspective and orthographic views, axis degeneracy, cancellation, pointer loss, multi-selection, vertex/surface snapping, and one history entry per gesture.

