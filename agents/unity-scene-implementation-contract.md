# Unity Scene-Inspired Flight Editor Implementation Contract

The `unity-scene-*.md` documents describe a mature scene-authoring workflow. This contract applies its useful semantics to Flight without reproducing Unity's product, asset database, component ecosystem, or serialization model.

## Product Intent and Ownership

Unity contributes strong patterns for 3D navigation, transform gizmos, scene hierarchy, component inspection, reusable prefabs, project assets, and edit/play separation.

- Flight upstream owns Scene3D, transforms, cameras, picking, bounds, materials, lighting, animation, physics, serialization primitives, and deterministic runtime lifecycle.
- Flight Editor owns selection, editing scopes, gizmo gestures, commands/history, component property metadata, prefab authoring, asset workflows, diagnostics, overlays, and host presentation.
- Host adapters own filesystem/project discovery, native drag/drop, build/run launch, clipboard, windows, and target-specific panels.

Unavailable runtime systems are capability-gated. Console, animation, navigation, physics, profiler, lighting, and debugger panels do not exist merely because Unity has them.

## Scene, Project, and Play State

- An open editor document, a runtime scene instance, and a project asset are distinct identities.
- Edit mode mutates canonical authored data. Play mode runs an isolated runtime instance from a specific document revision.
- Runtime changes do not silently write into authored data. Apply-back is explicit, validated, selective, and undoable.
- Stopping play disposes runtime state and restores edit selection, viewport, scope, and unsaved source state.
- External source changes and asset reloads use stable identities and report preserved, replaced, or invalidated runtime objects.
- Scene View cameras are session state; authored Camera nodes are document state.

## 3D Viewport and Gizmos

- Editor camera orbit, pan, dolly, fly, framing, orthographic views, speed, and projection are host-neutral viewport state.
- Gizmos operate in explicit world/local and pivot/center modes. Display scale remains usable independent of scene distance.
- Axis, plane, free, screen-space, vertex, surface, increment, and grid manipulations use one `begin -> preview -> commit | cancel` gesture.
- Coordinate conversion, ray generation, picking, bounds, snapping, and transform math come from shared/upstream primitives.
- Multi-selection defines its aggregate pivot, orientation, and per-object transform result explicitly.
- Component gizmos and icons are contributed overlays keyed by component type; they are not renderable scene children.

## Components and Inspector

Runtime components/traits and reusable component instances are different domains. The inspector enumerates actual runtime node/component schemas; the reusable-components package manages prefab-like sources and overrides.

- Every component type contributes stable property IDs, types, defaults, applicability, validation, serialization, and optional gizmos.
- Add, remove, reorder where meaningful, enable/disable, reset, copy, paste, and multi-edit are shared commands.
- Object and asset references use stable typed identities and surface missing or incompatible targets.
- Inspector lock is presentation/session state and never changes selection or document history.
- Debug/raw inspection is read-only unless a property is explicitly safe and command-backed.
- Numeric precision in UI never truncates persisted values.

## Prefabs and Reusable Scene Sources

- A prefab source and each instance have distinct stable identities with stable descendant/property mapping.
- Overrides distinguish added/removed child, added/removed component, property value, and nested-source changes.
- Apply, revert, unpack/detach, variant, nesting, missing source, and cyclic dependency behavior are explicit commands.
- Opening a prefab enters an isolated editing scope; applying changes validates all affected instances before commit.
- Runtime instancing/materialization remains upstream; override policy and UI remain in Flight Editor.

## Assets and Project Integration

- Runtime asset loading is upstream; import, metadata, source/watch state, thumbnail, dependency/usage queries, rename/move/delete/relink, and placement are editor workflows.
- Dragging an asset into a scene invokes a typed placement command and one history transaction.
- Asset identities survive path changes. Paths are locators, not identity.
- Import failures, missing dependencies, stale derived data, and unsupported types produce structured diagnostics.
- Project panels are host contributions and may be replaced by VS Code's explorer or an in-game asset picker.

## Test Contract

Implemented Unity-inspired capabilities require tests for 3D camera navigation; projection and ray/pick parity; every gizmo axis/plane/free mode; local/world and pivot/center; nested and negative transforms; snap priority; cancellation; component schema/add/remove/reset/multi-edit; prefab override/apply/revert/nesting; asset relocation/reimport; and edit/play/apply-back lifecycle. The same mutation scenarios run through desktop, VS Code, and in-app adapters where supported.

## Definition of Done

A Scene-authoring feature is complete only when document versus session/runtime state, stable identity, command/history semantics, coordinate space, diagnostics, serialization, capability gating, accessible alternate control, and automated tests are explicit.

