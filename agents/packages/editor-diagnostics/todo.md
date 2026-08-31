# Editor Diagnostics TODO

Implemented foundation: revision-aware source batches, stale-update rejection, validation, deterministic aggregation, and blocking summaries. The cell is composed into `tool-editor`.

Next maturity work:

- Add semantic identity and source-range remapping helpers across YAML edits and migrations.
- Integrate parse/schema/asset/runtime producers and host diagnostic projections.
- Define stale last-known-good presentation and mutation gating at the runtime facade.
- Add end-to-end tests for invalid source, recovery, external replacement, and VS Code ranges.
