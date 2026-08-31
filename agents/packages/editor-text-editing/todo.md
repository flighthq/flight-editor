# Editor Text Editing TODO

Implemented foundation:

- Stable target sessions with original, draft, base revision, selection, and composition state.
- Grapheme-safe caret and selection clamping.
- Selection replacement and command-ready commit/cancel results.
- IME composition guards that prevent premature commits.
- External revision reconciliation with clean adoption, stale rejection, and explicit conflicts.
- Undoable committed-text command adapter.
- Compatibility mode for hosts that provide caret state before text content is loaded.

Remaining maturity:

- Bidirectional and vertical-text navigation using upstream shaped-cluster geometry.
- Word/line/paragraph selection, platform deletion behavior, and rich-text spans.
- Composition range rendering and host IME bridge conformance.
- Text-on-path, overflow/frame linking, auto-size, and missing-font substitution.
- Clipboard rich-text interchange and multi-range formatting commands.
