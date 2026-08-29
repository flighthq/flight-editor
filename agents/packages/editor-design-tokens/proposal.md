# Editor Design Tokens Proposal

Ownership: Flight Editor over Flight value primitives.

Provide document-level named tokens for color, text style, spacing, and future typed values. Track references separately from copied literals, usage, grouping, rename/delete/relink, library provenance, and propagation commands. Rendering consumes resolved values; panels are replaceable presentations.

Acceptance requires typed validation, cycles/aliases policy, token propagation, detach-to-literal, missing-token diagnostics, clipboard dependency transfer, and serialization tests.

