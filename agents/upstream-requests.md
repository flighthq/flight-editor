# Flight Upstream Requests

This document records capabilities Flight Editor needs from the Flight runtime and model packages. It is deliberately narrower than the editor roadmap: upstream should provide durable scene, geometry, serialization, runtime, and interaction primitives, while Flight Editor owns authoring policy, commands, selection, layout, and host presentation.

## Priority requests

| Priority | Upstream area | Request | Editor capability unblocked |
| --- | --- | --- | --- |
| P0 | `@flighthq/node` and shared contracts | Stable, serializable node identity independent of hierarchy address and runtime object reference | Reload-safe selection, references, undo, diagnostics, VS Code synchronization, collaboration |
| P0 | `@flighthq/scene2d-formats` | Identity/reference round trips, structured codec diagnostics, unknown-data preservation, and migration hooks | Reliable `.flight` YAML editing, last-known-good reload, plugin data, schema evolution |
| P1 | Scene2D interaction / `@flighthq/picking` | Ordered 2D hit results with coordinate details, predicates, backend parity, and geometry-detail hooks | Mouse focus, click drilling, scoped selection, fill/stroke/path subselection |
| P1 | `@flighthq/assets` | Stable asset identity, replacement semantics, dependency metadata, cancellation, and hot reload | Authoring library, relink, usage queries, cross-document clipboard, live preview |
| P1 | Runtime/application lifecycle | Deterministic create, pause, step, restart, snapshot/reload, and disposal seams | Shared desktop, VS Code, and in-app play/edit workflow |
| P1 | Reusable scene sources/instances | Stable source and descendant identity, nesting, reference fixup, deterministic materialization, and hot reload | Components, variants, overrides, linked assets, cross-document transfer |
| P1 | `@flighthq/layout` | Deterministic authored constraint resolution, validation facts, intrinsic measurement, and transform precedence | Responsive resize, stacks, auto-layout, reusable component layout |
| P2 | `@flighthq/flow` and `@flighthq/statechart` | Stable targets/states/actions, validation, deterministic execution, and live replacement | Prototype graphs, component states, interactive preview |
| P2 | `@flighthq/shape`, `@flighthq/path`, `@flighthq/path-boolean` | Authoring-safe topology and robust query/edit primitives with deterministic tolerances | Flash-like pen, subselection, shape merge, fill, and stroke authoring |
| P2 | `@flighthq/animation` and `@flighthq/timeline` | Stable target/property references, deterministic seek/sample, validation facts, and reload behavior | Timeline, keyframe, tween, onion-skin, and runtime preview tooling |

P2 requests are conditional on vector and timeline authoring being explicit Flight Editor product goals. The runtime packages already exist; the request is to confirm or deepen their authoring-facing seams, not to duplicate them in this repository.

## Required contracts

### Stable identity

- A node identity survives serialization and deserialization.
- Identity is distinct from display name, child index, hierarchy path, and in-memory object reference.
- Clone and duplicate intentionally mint identities; reload and migration intentionally preserve them.
- References resolve by identity and report missing or duplicate targets deterministically.
- Runtime-only instances can identify their authored source without reusing its instance identity.

Flight Editor will use these identities in selection, commands, diagnostics, clipboard payloads, editing scopes, animation targets, and host messages. It will continue to derive hierarchy paths for display and traversal only.

### Serialization and diagnostics

- Semantic scene codecs expose validation and migration separately from source presentation.
- Failures carry stable codes and affected semantic identities; codecs with source text also provide ranges.
- Unknown node kinds, component properties, and plugin-owned data have an explicit preserve/reject policy.
- Reference repair and migration report changes rather than silently discarding data.
- Canonical semantic round trips are covered by fixtures reusable by Flight Editor.

Flight Editor remains responsible for the `.flight` YAML schema, YAML formatting/comment policy, source-editor diagnostics projection, and external-file conflict UX.

### Picking and geometry queries

- Scene2D picking returns all ordered candidates when requested.
- Results expose scene, parent, and local coordinates without the editor recomputing transforms inconsistently.
- Callers can filter candidates without embedding editor concepts such as lock or editing scope upstream.
- Shape queries can distinguish object, fill region, stroke, segment, vertex, and control-handle hits when supported.
- Results are deterministic across supported rendering backends within documented tolerances.

Flight Editor remains responsible for click drilling, selection policy, locked/hidden authoring rules, scope filtering, handles, and tool behavior.

### Assets and references

- Asset identities and descriptors survive manifest reload and source relocation.
- Dependencies can be enumerated without loading every asset.
- Missing, loading, failed, stale, and ready states are observable.
- Replacement and hot reload have deterministic lifetime and notification behavior.
- Cancellation and disposal are safe during document or preview shutdown.

Flight Editor remains responsible for import workflows, library organization, thumbnails, naming conflicts, relinking UX, undo, and master/instance authoring semantics.

### Preview runtime lifecycle

- A runtime scene can be created from an authored snapshot and disposed completely.
- Pause, deterministic step, restart, and snapshot replacement have explicit behavior.
- Hot reload reports preserved, replaced, and invalidated runtime identities.
- Runtime values can be inspected separately from authored values.
- Remote or in-process transports can implement the same lifecycle contract.

Flight Editor remains responsible for play-mode state, runtime override presentation, apply/discard policy, host transport, and editor command generation.

### Reusable scene sources and instances

- A reusable source and each placed instance have distinct stable identities.
- Descendants have stable source identities that instance overrides can target through source reordering.
- Nested instances are supported or rejected explicitly; cycles are always diagnosed deterministically.
- Missing sources and incompatible source updates remain inspectable rather than silently flattening or deleting data.
- Hot reload reports how authored source and instance identities map to runtime identities.

Flight Editor remains responsible for component creation, overrides, named variants, reset/detach/swap commands, library organization, and presentation.

### Responsive layout and interactive flows

- Layout resolution is deterministic and reports contradictory or unsupported constraints.
- Manual transforms, intrinsic measurement, and layout-controlled values have explicit precedence.
- Flow/statechart targets and actions use stable identities and validate missing references.
- Runtime active state is distinct from authored definitions and can be replaced safely during preview.

Flight Editor remains responsible for constraint inference and handles, stack/property UI, prototype wires, graph commands, transition presentation, and preview navigation UX.

## Explicitly not upstream requests

These concerns belong in Flight Editor even when they consume upstream primitives:

- selection and editing-scope policy
- undo/redo commands and gesture transaction boundaries
- inspector drafts, mixed values, and property presentation
- menus, toolbars, panels, layouts, keyboard routing, and focus restoration
- VS Code views, desktop Flight-scene UI, and in-app editor UI
- `.flight` YAML formatting and source/visual toggle behavior
- library-panel organization and asset import UX
- timeline/layer/frame presentation and animation authoring commands
- vector-tool behavior and Flash-compatible raw-shape merge policy
- session recovery, dirty prompts, and external-change UX

## Tracking

Detailed package notes live under:

- `agents/packages/flight-node/todo.md`
- `agents/packages/flight-scene2d-formats/todo.md`
- `agents/packages/flight-picking/todo.md`
- `agents/packages/flight-assets/todo.md`
- `agents/packages/flight-shape/todo.md`
- `agents/packages/flight-animation/todo.md`
- `agents/packages/flight-layout/todo.md`
- `agents/packages/flight-flow/todo.md`
- `agents/packages/flight-statechart/todo.md`
- `agents/packages/flight-scene-instance/proposal.md`

Before filing an upstream issue, validate the installed SDK surface and replace a request with a concrete API gap and a minimal editor use case. Once an upstream contract exists, add a Flight Editor integration test before considering the request complete.
