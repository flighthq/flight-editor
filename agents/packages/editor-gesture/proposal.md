# Editor Gesture Proposal

Ownership: Flight Editor.

Provide a generic `begin -> preview* -> commit | cancel` lifecycle shared by transform tools, drawing, guides, inspector scrubbing, timeline edits, and drag/drop. It owns pointer capture, interruption policy, temporary state, and integration with a single command transaction; it does not own geometry or presentation.

Acceptance requires exact rollback on cancel and one undo entry per committed gesture across mouse, pen, touch, and host-driven input.

