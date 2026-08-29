# Editor Assets Proposal

Ownership: Flight Editor over `@flighthq/assets`.

Add authoring behavior absent from a runtime asset loader: import, rename, folders/tags, thumbnails, dependency and usage queries, deletion policy, relinking, master/instance relationships, overrides, and cross-document transfer. Runtime acquisition, caching, and disposal remain Flight upstream responsibilities.

Acceptance requires reference-integrity tests for rename, delete, relink, duplicate, clipboard transfer, reload, and missing assets.

