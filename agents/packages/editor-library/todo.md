# Editor Library TODO

Ownership: searchable editor presentation and source reconciliation for reusable components, symbols, assets, and other insertable resources.

Implemented foundation:

- Collision-safe item identities and validated required metadata.
- Source-scoped atomic reconciliation without disturbing unrelated sources.
- Cached missing-source entries rather than destructive removal.
- Search across names, categories, kinds, descriptions, and tags.
- Independent session revision for search/category UI state.
- Defensive tag copying and deterministic hydration validation.

Remaining maturity:

- Async source/provider registration with cancellation and stale-result rejection.
- Thumbnail lifecycle, virtualization metadata, favorites, recents, and team-library permissions.
- Drag/create contributions and clipboard dependency transfer.
- Integration with component variants, assets, design tokens, and cross-document sources.
