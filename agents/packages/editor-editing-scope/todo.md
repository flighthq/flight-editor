# Editor Editing Scope TODO

Implemented foundation: validated stable-identity scope stacks, cycle prevention, breadcrumb navigation, guarded root exit, and reload reconciliation. The cell is composed into `tool-editor`.

Next maturity work:

- Integrate selection filtering, hierarchy projection, hit testing, dimming, and local/world coordinate conversion.
- Restore scope through YAML reload using persistent node identity.
- Define component/prefab source navigation and missing-scope diagnostics.
- Add host conformance tests for breadcrumbs, Escape, focus restoration, undo, and external deletion.
