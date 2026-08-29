# Spline-Inspired Flight Editor Implementation Contract

The `spline-*.md` documents describe an approachable collaborative 3D authoring tool. This contract applies its interaction and information-architecture lessons to Flight while retaining Flight's shared runtime/editor boundary.

## Product Intent

Spline reinforces that useful 3D authoring need not expose engine complexity first. Flight should offer direct primitive creation, clear transform gizmos, approachable materials/lights/cameras, state-driven interactions, immediate preview, and exportable/embed-ready results. Advanced engine systems remain progressive capabilities.

## 3D Objects, Materials, and Environment

- Primitive parameters are authored data and remain editable until explicitly converted or baked.
- Material slots reference stable material assets or own explicit inline material data; copied literals and shared references are distinct.
- Material types and properties come from upstream schemas and renderer capabilities, not hard-coded independently per host.
- Texture references use the asset system and expose loading, missing, color-space, sampling, and compatibility diagnostics.
- Scene environment, background, fog, post-processing, and renderer settings are document data with capability-gated properties.
- Lights and cameras are ordinary typed scene nodes with specialized inspector metadata and optional authoring gizmos.

## States and Interactions

- States are named authored property sets or variants with stable identity. Active state is runtime/session state.
- Events, conditions, actions, targets, transitions, and variable writes form a validated authored graph; UI rows and wires are projections.
- Hover, click, pointer, scroll, keyboard, timer, and scene-start triggers declare platform/input requirements.
- State transitions compile to upstream animation/statechart/flow primitives and use explicit property mappings.
- Preview runs from a document revision; runtime interaction never dirties authored data unless an explicit apply-back command is invoked.

## Animation, Physics, and Runtime Export

- Timeline authoring uses the shared editor-animation proposal; motion paths reference stable path and target identities.
- Physics authoring contributes validated collider/body/joint properties and debug overlays while upstream owns deterministic simulation.
- Export targets are versioned contributions over a validated snapshot. Generated code, embeds, packages, images, and video are outputs, never canonical state.
- Export declares renderer/runtime requirements, unsupported features, asset closure, coordinate/unit conversion, and reproducibility metadata.
- Collaboration, comments, and version history follow the Figma-derived optional service contracts.

## Interaction Contract

- Orbit, pan, zoom, framing, object selection, transforms, path editing, material scrubbing, and interaction wiring use shared viewport, picking, gesture, and command primitives.
- Touch and pen mappings are explicit; browser gestures and in-game input ownership are negotiated by the host.
- On-canvas controls and gizmos have inspector/keyboard alternatives and remain readable at different zoom, DPR, and accessibility settings.
- Shape creation, booleans, extrusion, paths, and text use upstream geometry and text primitives rather than host-local approximations.

## Test Contract

Implemented Spline-inspired capabilities require primitive parameter round trips; shared versus inline materials; texture failure; light/camera/environment schemas; state graph validation and transition playback; touch/mouse parity; animation/physics preview isolation; export reproducibility and unsupported-feature diagnostics; plus host conformance for desktop, VS Code, and in-app presentations.

## Definition of Done

A Spline-inspired feature is complete only when its upstream runtime representation, editor command model, preview/runtime separation, serialization, diagnostics, host capability, accessible presentation, and tests are defined. An attractive inspector mock without shared runtime semantics is not complete.
