# Adobe XD-Inspired Flight Editor Implementation Contract

The `adobe-xd-*.md` documents are a behavioral reference for a mature direct-manipulation design tool. This document defines how that reference applies to Flight. Historical XD behavior is not automatically a Flight requirement.

## Product Intent

XD contributes patterns that complement the Flash reference: an infinite multi-artboard workspace, compact contextual inspection, responsive layout, reusable components and design tokens, prototype wiring, and a tight edit/preview loop. Flight is not an XD clone and does not reproduce Adobe cloud, publishing, plugin-marketplace, or file-format behavior.

When references conflict, use this order:

1. Flight document and runtime correctness
2. Shared editor command and session semantics
3. Host conventions and accessibility
4. This adaptation contract
5. Historical XD behavior
6. Cosmetic resemblance

## Shared Versus Optional Domains

The following are shared editor infrastructure even when a host presents them differently:

- artboard/page identity and containment
- commands, history, selection, gestures, viewport, snapping, and property metadata
- components, instances, overrides, design tokens, responsive constraints, and prototype graph data once implemented
- preview lifecycle and authored/runtime value separation
- diagnostics and canonical `.flight` YAML persistence

The following are optional presentations or integrations:

- XD's exact toolbar and fixed inspector arrangement
- Share-mode publishing, comments, cloud documents, and developer-link hosting
- plugin discovery or marketplace UI
- device chrome and Adobe-specific export presets

Unavailable domains must not appear as enabled controls. Each optional capability is contributed and capability-gated.

## Artboards and Infinite Canvas

Artboards are document objects with stable identity, name, scene-space position, size, background, clipping, viewport/scroll behavior, and ordered content. They are not interchangeable with editor workspace panels or open files.

- The pasteboard is unbounded scene space; viewport navigation is session state.
- Reparenting across artboard boundaries preserves world position unless the invoked command explicitly says otherwise.
- Artboard labels and authoring handles are overlays and do not serialize as scene content.
- Selecting an artboard exposes artboard properties; it must not expose meaningless node X/Y fields for a root scene with no transform.
- Guides, grids, export settings, home-flow designation, and scroll viewport may be artboard-scoped.
- Fit-all and spatial navigation operate on artboard bounds, not arbitrary transient overlays.

## Components, Instances, and Tokens

A component has stable source identity. An instance references that source and records explicit overrides; it is not a detached deep copy disguised by matching names.

- Source edits propagate to non-overridden instance values.
- Overrides target stable descendant/property identities and survive source reordering.
- Reset, detach, swap source, delete source, missing source, nesting, and cyclic-reference behavior are explicit commands.
- Component states are named authored variants, distinct from runtime state-machine state unless an adapter deliberately maps them.
- Colors, text styles, and future tokens are referenced assets. Editing a token propagates; copying a literal value does not create an implicit reference.
- Clipboard and duplicate operations include or remap the complete reference dependency closure.

The runtime representation of reusable scene sources and instances is an upstream concern. Override editing, library organization, commands, and presentation belong to Flight Editor.

## Responsive and Stack Layout

Responsive behavior is persisted as explicit constraints or layout declarations. Inference may propose initial values but cannot remain the only source of truth.

- Manual transform and layout-controlled values have a documented precedence model.
- A resize gesture previews layout continuously and commits one command.
- Fixed, pinned, stretched, intrinsic, and content-sized behavior are representable without host-specific state.
- Stack ordering follows document order; changing visual order and hierarchy order cannot silently diverge.
- Invalid or over-constrained layouts produce diagnostics and deterministic fallback.

Flight upstream owns deterministic layout resolution. Flight Editor owns authoring handles, inferred-constraint UX, property editing, and undo.

## Prototype Graph and Preview

Prototype interactions form an authored graph: stable source identity, trigger, conditions, action, destination, transition, and options. A wire is a presentation of that graph, not the graph itself.

- Creating, editing, reconnecting, or deleting a wire uses shared commands and history.
- Home nodes and named flows are explicit document data.
- Broken destinations remain diagnosable rather than being silently discarded.
- Preview runs from a document revision and reports when it becomes stale.
- Navigation history, current preview target, hover state, and playhead-like preview state do not dirty the document.
- Auto-animation matching uses stable identity or an explicit mapping. Display names alone are insufficient.
- Runtime inspection and apply/discard of runtime overrides follow the shared preview contract.

## Repeat Grid

Repeat Grid is treated as a parametric authored construct, not merely repeated copies. Its source subtree, repetition axes/count or extent, gaps, and per-instance data overrides are explicit. Detaching expands it through one undoable command. Reordering, resizing, clipboard transfer, and export must be deterministic.

If this domain is not selected for the Flight roadmap, omit its controls rather than simulating them with non-editable duplicates.

## Plugins and Contributions

Plugins contribute commands, panels, property editors, node factories, importers/exporters, diagnostics, and optional document data through declared capabilities.

- Plugins mutate documents only through shared commands and transactions.
- Plugin data is namespaced, versioned, preserved by the scene format, and migratable.
- Contributions have stable IDs and deterministic conflict handling.
- Unavailable plugins leave recoverable placeholders or diagnostics for their document data.
- Host permissions, network access, installation, and marketplace UX are outside the shared editor core.

## Interaction and Focus

XD's direct-manipulation details use the shared gesture and focus contracts:

- click, double-click, and drag are separated by explicit timing and movement thresholds
- duplicate-drag creates the copy at gesture begin but rolls it back completely on cancel
- isolation, path editing, text editing, and prototype wiring are explicit modes with predictable Escape behavior
- smart guides are transient results from a shared snap query and never mutate the document by themselves
- text editing and IME own normal typing shortcuts while focused
- canvas-only handles have command or structured-panel equivalents

## Test Contract

In addition to the shared Flash-inspired contract, implemented XD-inspired domains require:

- artboard create, move, resize, reparent, clip, scroll, and fit-all tests
- component propagation, override, reset, detach, nesting, missing-source, and cycle tests
- token reference versus literal-value propagation tests
- responsive and stack layout fixtures across nested containers and contradictory constraints
- prototype graph creation, broken-reference diagnostics, preview navigation, and stale-revision tests
- repeat-grid resize, data override, detach, clipboard, and serialization tests
- plugin contribution conflict, missing-plugin data, migration, transaction, and disposal tests
- host conformance proving different UI presentations produce the same document mutations

## Definition of Done

An XD-inspired feature is complete only when its durable document representation, shared commands, history boundary, diagnostics, serialization, host-neutral state, keyboard path, accessible presentation, and automated tests are defined. A polished panel backed by host-local state is not a completed editor feature.

