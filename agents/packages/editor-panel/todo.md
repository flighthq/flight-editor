# Editor Panel TODO

Ownership: Flight Editor.

- Add presentation-neutral panel contributions with identity, title, icon, placement hints, visibility, and capabilities.
- Separate panel model/controller state from the host-specific view implementation.
- Define focus restoration, panel activation, collapse, close, and reopen behavior.
- Support host substitution: a VS Code tree view may replace an in-canvas hierarchy panel while using the same editor state.
- Test duplicate registration, unavailable contributions, and persisted state for removed plugins.

