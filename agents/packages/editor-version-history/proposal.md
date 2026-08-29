# Editor Version History Proposal

Ownership: Flight Editor orchestration over host or service revision storage.

Represent immutable canonical document revisions with identity, parent/revision relation, format version, timestamp, optional author, and label. Support read-only preview, naming, compare inputs, duplicate, and restore-as-a-new-revision while explicitly resolving dirty local work. Keep this separate from command undo and the mutable history panel.

Acceptance requires immutable preview, restore without destroying later history, format migration, dirty-work decisions, missing assets/plugins, service failure, local storage adapters, and comparison of semantic revisions.

