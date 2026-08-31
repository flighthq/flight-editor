# Editor Preview TODO

Ownership: host-neutral preview policy over Flight runtime lifecycle APIs.

Implemented foundation:

- Explicit start, stop, pause, resume, step, restart, and hot-reload state transitions.
- Monotonic operation identities and stale completion/failure rejection.
- Revision-stamped authored snapshots and runtime revision tracking.
- Disconnect and operation-failure states with recoverable restart behavior.
- Authored-versus-runtime override inspection with selective apply/discard extraction.
- Runtime teardown clears snapshots and runtime-only values without affecting editor selection or source state.

Remaining maturity:

- Runtime transport adapter and conformance fixtures shared by in-process and remote implementations.
- Cancellation/disposal guarantees for operations in flight.
- Compatible identity mapping reports during hot reload.
- Command generation for selective runtime-value application.
- Desktop, VS Code, and embedded-host integration.
