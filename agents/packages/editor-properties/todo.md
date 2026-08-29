# Editor Properties TODO

Ownership: Flight Editor.

- Add property applicability, read-only reasons, validation diagnostics, units, and editor hints.
- Model draft, commit, and cancel explicitly; do not mutate the document for every invalid intermediate string.
- Define multi-selection writes and mixed-value replacement behavior.
- Coalesce a committed field edit into one command while allowing live canvas preview.
- Keep property definitions presentation-neutral so desktop, VS Code, and in-app inspectors can render them differently.

