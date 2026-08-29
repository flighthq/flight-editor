# Editor Assets Proposal

Ownership: Flight Editor over `@flighthq/assets`.

Add authoring behavior absent from a runtime asset loader: project discovery, import/reimport, source and derived metadata, rename/move, folders/tags, thumbnails, dependency and usage queries, deletion policy, relinking, typed scene placement, master/instance relationships, overrides, and cross-document transfer. Runtime acquisition, caching, and disposal remain Flight upstream responsibilities.

Acceptance requires reference-integrity tests for rename, delete, relink, duplicate, clipboard transfer, reload, and missing assets.
