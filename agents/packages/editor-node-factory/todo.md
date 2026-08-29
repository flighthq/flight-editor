# Editor Node Factory TODO

Ownership: Flight Editor contribution registry.

- Add stable contribution ownership, schema/version metadata, availability, icon/title/category, and property capability declarations.
- Define duplicate-ID conflicts and deterministic registration order.
- Preserve unsupported plugin node data and expose a recoverable placeholder rather than dropping it.
- Route creation through shared commands, stable identity allocation, and current editing scope.
- Test plugin unload/reload, missing factories, migration, conflicts, and failed creation rollback.

