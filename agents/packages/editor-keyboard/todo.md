# Editor Keyboard TODO

Ownership: Flight Editor, with host-reserved shortcut information supplied by adapters.

- Add routing scopes for canvas, inspector, text editing, modal tools, panels, and menus.
- Define conflict resolution, chords, key repeat, temporary tool overrides, and platform display strings.
- Never consume ordinary text-entry shortcuts when a field or source editor owns focus.
- Allow hosts to reserve or remap bindings without forking command behavior.
- Test focus transitions and the same logical shortcut on desktop, VS Code, and web-like hosts.

