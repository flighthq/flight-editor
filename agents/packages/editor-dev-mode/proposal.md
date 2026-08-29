# Editor Dev Mode Proposal

Ownership: Flight Editor read-only projection and contribution layer.

Expose resolved geometry, spacing, layout, typography, colors/tokens, component metadata, asset exports, and revision comparison without creating a parallel document model. Register versioned code generators by target/language/MIME with diagnostics and deterministic inputs. Generators cannot mutate documents through inspection callbacks.

Acceptance requires nested-transform measurements, resolved variable modes, layout-derived values, generator failures and unsupported targets, deterministic clipboard/export, read-only enforcement, missing fonts/assets, and host presentation parity.

