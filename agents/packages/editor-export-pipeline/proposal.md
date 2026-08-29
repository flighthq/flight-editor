# Editor Export Pipeline Proposal

Ownership: Flight Editor contribution/orchestration layer over Flight renderers, codecs, runtime packaging, and host filesystem capabilities.

Register versioned exporters for runtime bundles, web/embed code, platform packages, models, images, video, and code. Resolve dependency closure, validate target capabilities, report unsupported features, support cancellation/progress, and emit reproducibility metadata. Outputs never become canonical document state.

Acceptance requires deterministic repeated export, missing assets, partial failure, cancellation, target version mismatch, coordinate/unit conversion, plugin exporter disposal, and cross-host capability tests.

