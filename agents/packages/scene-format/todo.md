# Scene Format TODO

Ownership: Flight Editor's `.flight` YAML document contract, built on Flight upstream scene serialization primitives.

- Stable node identities can now be validated and immutably minted with an explicit migration report; document, asset, and reference identity schemas remain.
- YAML syntax diagnostics now carry line/column locations and semantic validation returns stable codes/paths; semantic source ranges remain.
- Version-1 identity migration, unknown/plugin data preservation, and canonical known/unknown field ordering are implemented; future schema-version migration remains.
- Decide the explicit policy for comments, anchors, aliases, ordering, and formatting during visual edits.
- Semantic round trips, identity migration, syntax failures, duplicate identities, unknown data, and deterministic output have fixtures; richer partial-document recovery remains.
