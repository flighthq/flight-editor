# Editor Collaboration Proposal

Ownership: Flight Editor/service integration over stable editor operations; not Flight runtime scene state.

Provide optional document-revision transport, attributable ordered operations, optimistic acknowledgement/rejection, reconnect, permissions, and transient presence for cursor, selection, viewport, page, and editing scope. Preserve identical local commands when no service exists and keep presence outside `.flight`, dirty state, and undo history.

Acceptance requires concurrent ordering, rejected optimistic edits, reconnect/rebase, permission changes, presence expiry, remote deletion of local selection/scope, operation-aware local undo, and transport disposal tests.

