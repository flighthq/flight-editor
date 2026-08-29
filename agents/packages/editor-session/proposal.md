# Editor Session Proposal

Ownership: Flight Editor.

Provide host-neutral multi-document orchestration: active document, untitled documents, close/save/revert decisions, external revisions, last-known-good snapshots, crash recovery, and per-document disposal. It should coordinate `editor-document`, `editor-file`, `editor-scene-io`, diagnostics, and command checkpoints without absorbing their primitive state.

Acceptance requires deterministic state-machine tests for concurrent saves/reloads, invalid external edits, deleted files, recovery, and switching among dirty documents.

