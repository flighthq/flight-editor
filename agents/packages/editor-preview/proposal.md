# Editor Preview Proposal

Ownership: Flight Editor over Flight runtime lifecycle APIs.

Define the authoring/runtime boundary for desktop preview, VS Code preview, and an embedded in-game editor. Own start, stop, pause, restart, hot reload, authored-versus-runtime values, runtime inspection, and explicit apply/discard of runtime overrides. Transport belongs to the host adapter; runtime simulation belongs upstream.

Acceptance requires identical state transitions with an in-process runtime and a mocked remote runtime, including disconnect and incompatible-revision recovery.

