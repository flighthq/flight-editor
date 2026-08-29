# Flight Statechart Upstream TODO

Ownership: Flight upstream (`@flighthq/statechart`).

- Provide stable state/event/action identities and deterministic execution suitable for component states and prototypes.
- Define serialization, validation, missing-action behavior, and live replacement.
- Separate authored state definitions from transient active runtime state.
- Keep component-state editing, graph presentation, commands, and preview UX in Flight Editor.
- Test nested machines, invalid transitions, replacement while active, and deterministic replay.

