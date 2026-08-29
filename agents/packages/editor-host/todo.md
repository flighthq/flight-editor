# Editor Host TODO

Ownership: Flight Editor.

- Define capabilities for filesystem watching, clipboard MIME, dialogs, focus, commands, panels, preview transport, and persistence.
- Prefer capability negotiation over target-name conditionals in shared core.
- Define disposal and cancellation for every subscription and asynchronous request.
- Make host UI contributions replaceable while retaining shared command and editor state.
- Provide conformance tests that every adapter must pass.

