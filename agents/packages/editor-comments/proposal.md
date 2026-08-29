# Editor Comments Proposal

Ownership: Flight Editor review integration; comments are not scene nodes.

Model stable comment threads and anchors to document revision, page/frame/node identity, and optional local or normalized position. Expose create, reply, resolve, reopen, move, filter, and visibility through a service-neutral adapter while keeping drafts and active-thread state local.

Acceptance requires deleted/moved anchor targets, migrations, offline and permission failure, retry/idempotency, resolve/reopen, service absence, and proof comment actions do not enter scene undo or `.flight` serialization.

