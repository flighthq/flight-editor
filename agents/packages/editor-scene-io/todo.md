# Editor Scene IO TODO

Ownership: Flight Editor orchestration over Flight codecs.

- Expand beyond pending-operation state into a load/save/reload policy coordinated with editor-session.
- Preserve the last-known-good visual document while externally edited YAML is invalid.
- Produce structured diagnostics rather than only error strings.
- Define stale completion handling, cancellation, canonical serialization, and external-change reconciliation.
- Test out-of-order async completion, invalid reload, recovery, and save/reload races.

