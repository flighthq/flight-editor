# Scene Format TODO

Ownership: Flight Editor's `.flight` YAML document contract, built on Flight upstream scene serialization primitives.

- Persist stable document, node, asset, and reference identities.
- Emit source-ranged parse and schema diagnostics suitable for VS Code.
- Define schema versions, migrations, unknown/plugin data preservation, and canonical output.
- Decide the explicit policy for comments, anchors, aliases, ordering, and formatting during visual edits.
- Test semantic round trips, migration fixtures, invalid partial documents, and deterministic output.

