# Figma-Inspired Flight Editor Implementation Contract

The `figma-*.md` documents describe a mature collaborative design environment. This contract defines which ideas apply to Flight and where they belong. Historical Figma behavior is reference material, not an automatic feature list.

## Product Intent

Figma deepens several domains already identified through Flash and Adobe XD: direct manipulation, multi-frame documents, reusable components, responsive layout, design tokens, prototype graphs, and pluggable tools. Its distinctive additions are multiplayer presence, durable comments, version history, variable collections and modes, and a developer-inspection surface.

Flight is not a Figma clone. Community hosting, accounts, billing, cloud file storage, plugin marketplaces, and Figma-specific code generation are integrations outside the shared editor core.

When references conflict, use this order:

1. Flight document/runtime correctness and data safety
2. Shared editor commands, identity, and session semantics
3. Host conventions, permissions, and accessibility
4. This adaptation contract
5. Historical Figma behavior
6. Cosmetic resemblance

## Frames, Pages, and Sections

- A page is an organizational document partition; a frame is a renderable container with stable identity, transform, clipping, layout, and prototype behavior.
- A section is authoring organization metadata over a spatial region. It does not implicitly reparent, clip, render, export, or enter prototype flow.
- Groups derive bounds from content; frames own bounds. Commands must not treat them interchangeably.
- Converting among group, frame, component, and section is explicit and undoable.
- Frame labels, section labels, collaborator cursors, measurements, and handles are editor overlays rather than scene content.
- Page/frame/section identity survives rename, reorder, reload, and collaboration.

## Components, Variants, and Properties

The XD component contract remains authoritative and is extended as follows:

- Component sets define variant dimensions and allowed values; a selected variant is an identity-backed reference, not name parsing.
- Component properties are typed: text, boolean/visibility, instance swap, variant selection, or future declared types.
- Overrides target stable source descendant and property identities and distinguish explicit override from inherited value.
- Preferred instance values, exposed nested properties, slots, and instance swaps must not break encapsulation or create cycles.
- Source changes, variant schema changes, and missing nested sources produce repairable diagnostics.
- Main-component editing is an editing scope; navigating to it is not a document mutation.

## Variables, Styles, Collections, and Modes

Variables are typed authored data with stable identity, collection membership, optional aliases, scopes, and values per mode. Styles are reusable compound appearance/text/effect/grid records. Neither is merely a panel swatch.

- A property records either a literal value or a binding; resolved values are derived.
- Collection mode selection is explicit at the applicable page/frame/component/runtime scope.
- Aliases have deterministic resolution, type compatibility, cycle detection, and missing-reference diagnostics.
- Rename and reorganization do not break bindings.
- Detaching a binding writes the currently resolved literal in one command.
- Prototype actions may set variables only when the runtime variable contract exists.
- Clipboard and library transfer include dependency closure and remap identities without silently flattening bindings.

## Auto Layout and Constraints

The XD responsive-layout contract is extended with horizontal, vertical, and wrapping flow; padding; fixed, fill, hug/intrinsic, min/max sizing; baseline/cross-axis alignment; absolute-positioned children; and nested layouts.

- Runtime and editor use the same deterministic upstream layout resolver.
- Drag reordering follows layout order and commits one command.
- Canvas resizing, Scale-tool scaling, and layout reflow are distinct operations with distinct commands.
- Layout-controlled properties expose why direct editing is unavailable or how the edit changes constraints.
- Over-constrained or non-convergent layouts produce diagnostics and deterministic fallback.

## Collaboration and Presence

Collaboration is an optional service capability over stable document operations; it is not embedded into node, tool, or panel state.

- Presence contains user identity, cursor, selection, viewport, active page/scope, and expiration. It is transient and never serialized into `.flight` or undo history.
- Authored changes use ordered, attributable operations with document revision and stable target identity.
- Local optimistic changes, acknowledgement, rejection, retry, reconnect, and conflict resolution are explicit states.
- Remote operations do not create local undo entries indistinguishable from the local user's work. Undo policy is operation-aware.
- Following another viewport never mutates the document and can be exited locally at any time.
- Permissions are enforced before mutation and represented in command enablement.

No collaboration transport is required for local desktop, VS Code, or in-app editing. Those hosts retain identical local command semantics without the service.

## Comments

Comments are review records anchored to stable document identity plus a page/frame/node identity and optional normalized/local position. They are not scene nodes.

- Threads have stable identity, author, timestamps, messages, resolved state, and optional mentions/reactions supplied by an integration.
- Anchor movement, target deletion, document migration, branches, and inaccessible authors have explicit behavior.
- Comment visibility, filtering, draft text, and active thread are session/presentation state.
- Comment actions are not scene undo commands; service failures do not corrupt the scene document.
- In-game/offline hosts may omit comments entirely.

## Version History

Version history records immutable canonical document revisions with identity, parent/revision relationship, timestamp, author where available, label, and format version.

- Previewing a revision is read-only session state.
- Restore creates a new current revision; it does not destroy later history.
- Dirty local work is saved, discarded, or retained through an explicit decision before restore.
- Migrations occur through the canonical format contract and never rewrite historical blobs silently.
- Branching, remote retention, and autosave cadence are service policies rather than editor-core assumptions.

Command undo and version history are separate: undo is an active editing transaction model; history is durable document revision storage.

## Developer Inspection and Code Generation

Developer mode is a read-only projection over the validated document, resolved layout, tokens, components, assets, and selection.

- Measurements and computed properties come from shared scene/layout queries.
- Export and code generators are versioned contributions declaring target, inputs, diagnostics, and output MIME/language.
- Generated output is never treated as canonical document state.
- A generator cannot mutate the document unless it separately invokes an authorized shared command.
- Copy and export use host capabilities and report partial or unsupported results.

## Plugins, Widgets, and Resources

Extend the XD plugin contract with resource search and optional widgets. Resource search aggregates registered components, tools, commands, assets, and plugins through a presentation-neutral query. A widget that persists interactive content requires an explicit versioned document schema and runtime contract; arbitrary host UI state cannot masquerade as a scene node.

## Test Contract

In addition to prior implementation contracts, implemented Figma-inspired domains require:

- page/frame/section conversion, containment, spatial organization, and reload tests
- component variant/property/instance-swap/override and schema-migration matrices
- variable mode, scope, alias, cycle, detach, transfer, and resolved-value tests
- Auto Layout wrap, hug/fill, min/max, absolute child, reordering, and nested-layout fixtures
- collaboration operation ordering, optimistic rejection, reconnect, permission, presence expiry, and local-undo tests
- comment anchor deletion/migration, service failure, resolve/reopen, and offline capability tests
- immutable revision preview/restore/migration and dirty-work decision tests
- developer measurement, generator contribution, diagnostics, clipboard, and no-mutation tests
- host conformance proving absent optional services do not alter core editing results

## Definition of Done

A Figma-inspired feature is complete only when its durable or transient state classification, stable identities, shared commands, history semantics, diagnostics, serialization, permissions/capabilities, accessible presentation, and automated tests are explicit. A cloud-shaped mock UI is not a completed capability.

