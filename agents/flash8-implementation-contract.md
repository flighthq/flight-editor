# Flash 8-Inspired Flight Editor Implementation Contract

The `flash8-*.md` documents describe Macromedia Flash Professional 8 as a behavioral and information-architecture reference. This document defines how that reference is applied to Flight. It is normative for new Flight editor work; historical details in the other documents are not automatically implementation requirements.

## Product Intent

Flight should inherit the parts of Flash 8 that made authoring legible: a persistent stage, direct manipulation, obvious tools, contextual properties, stable panel locations, discoverable menus, and consistent shortcuts. Flight is not an FLA emulator. Features that depend on Flash-specific concepts such as ActionScript, SWF publishing, frames, layers, symbols, or shape-merging remain out of scope until Flight has an explicit corresponding domain model.

When references conflict, use this order:

1. Flight's document model and safety requirements
2. Shared editor runtime semantics
3. Host platform conventions and accessibility
4. This implementation contract
5. Historical Flash 8 behavior
6. Cosmetic resemblance

Do not add an enabled control merely because Flash had one. An unavailable feature must be omitted, disabled with an explanation, or explicitly marked as a prototype. It must never silently do nothing.

## Shared Architecture Boundary

Behavior is divided into four layers:

| Layer | Owns | Must not own |
|-------|------|--------------|
| `@flighthq/scene-format` | Canonical YAML parsing, validation, serialization, versioning | Editor selection, panels, host APIs |
| Shared editor packages / `tool-editor` | Scene operations, commands, history, selection, tools, viewport math, property metadata, host-neutral presentation snapshots | DOM, VS Code APIs, Tauri APIs, platform menus |
| Pluggable UI | Panels, tool chrome, menu contributions, layouts, inspectors, status presenters | Canonical document parsing or host lifecycle |
| Host adapter | File dialogs, clipboard, native menus, window lifecycle, webview/Tauri/game integration | Reimplementation of editor commands |

Desktop, VS Code, web test harnesses, and in-app editors must invoke the same shared commands. Host UI may differ in arrangement and chrome, but a command's validation, transaction boundaries, history behavior, and resulting scene mutation must not vary by host.

## Capability and Command Model

Every interactive item maps to a stable command or tool identifier. UI surfaces query shared state for `visible`, `enabled`, `checked`, label, shortcut, and disabled reason. Menus, toolbar buttons, context menus, shortcuts, and command-palette entries invoke the same command.

Commands that mutate a document must:

1. Validate the current selection and editing scope.
2. Begin one logical history transaction for one user gesture.
3. Apply the mutation through the shared editor runtime.
4. Update selection and dirty state consistently.
5. Emit one coherent presentation-state update.
6. Be undoable unless explicitly documented otherwise.

Continuous gestures such as drag, scale, rotate, scrub, or slider changes preview continuously but commit as one undo step. Escape cancels and restores the pre-gesture state. Pointer cancellation, focus loss, and document replacement must end the gesture deterministically rather than leaving a partial transaction.

## Document and Reload Contract

The `.flight` source is canonical YAML. UI layers never parse it independently. They receive validated scene data and diagnostics from the shared format/runtime boundary.

- Visual edits update the host's text document, so native dirty tracking, save, undo, and external-change handling remain authoritative.
- A valid external change reloads the scene and preserves selection, editing scope, and viewport when their referenced identities remain valid.
- An invalid intermediate source edit keeps the last valid visual scene visible where practical, marks it stale, and presents diagnostics. Visual mutation is disabled until the source becomes valid; it must not overwrite invalid source.
- Unknown supported extension data must survive a visual round trip. YAML comments and scalar formatting are preserved only when a source-preserving document-edit strategy exists; otherwise the UI must be clear that a visual save canonicalizes formatting.
- Format migration requires an explicit versioned migration path. A second undocumented `.flight` dialect is not permitted.

## Coordinate and Selection Semantics

Use explicit coordinate spaces: client, canvas pixels, viewport, scene, parent-local, and node-local. Conversion belongs in shared viewport/runtime helpers. Device-pixel ratio affects rendering resolution, not scene coordinates.

- Scene roots have dimensions and viewport settings but no editable transform unless the scene model explicitly defines one.
- Selection identity uses stable node identity where available; child-index paths are transport snapshots and must be revalidated after hierarchy mutation or reload.
- Locked nodes cannot be mutated. Hidden or non-rendered nodes are not pointer targets unless a dedicated hierarchy action selects them.
- Multi-selection property fields show a mixed state. Editing a mixed field applies one value to all eligible selected nodes in one transaction.

## Focus, Input, and Shortcut Routing

Keyboard input routes by context:

1. Active modal dialog or popup
2. Text/code input and IME composition
3. Focused panel-specific commands
4. Stage/tool commands
5. Application commands

Typing in an input must not switch tools or delete scene nodes. Platform primary-modifier conventions apply (`Ctrl` on Windows/Linux, `Cmd` on macOS). Browser and VS Code reserved shortcuts win unless the host offers a safe override. Temporary tools restore the previous tool on key release, window blur, or cancellation.

All stage operations must have a keyboard-accessible equivalent. Focus indicators may not rely solely on selection color, and focus must return predictably when a popup or modal closes.

## Layout and Responsive Behavior

The default desktop layout is Flash-inspired, but layout is contributed data rather than hard-coded editor logic. Hosts may provide a different default layout using the same panel and command registries.

- The stage remains usable at the minimum supported window size.
- Panels define minimum, preferred, and maximum sizes; overflow scrolls rather than covering the stage.
- Narrow hosts collapse secondary panels before shrinking primary controls below usable sizes.
- Docking, panel visibility, sizes, active tabs, and collapsed state are persisted per host/workspace and can be reset to the host default.
- Hiding panels does not destroy panel state.
- The canvas backing store follows CSS size multiplied by device-pixel ratio, while layout measurements remain CSS pixels.

## Accessibility and Localization

- Use semantic buttons, menus, trees, tabs, forms, and separators; canvas-only affordances require an accessible command or structured-view equivalent.
- Every icon-only control has an accessible name and tooltip. Tooltips include the resolved platform shortcut when one exists.
- Selection, errors, disabled reasons, and operation results cannot be conveyed by color alone.
- Status changes that require attention use a polite live region; high-frequency coordinates and pointer motion do not spam assistive technology.
- Layout tolerates translated labels and 200% text zoom without clipping critical actions.
- Reduced-motion and high-contrast preferences are respected.

## Test Contract

Each implemented behavior needs tests at the lowest stable layer plus one host integration test when wiring is host-specific.

Required coverage includes:

- Command enablement and checked state for empty, single, mixed, locked, and invalid-source contexts
- One history entry per gesture, including cancellation and redo
- Coordinate transforms at non-100% zoom, pan, nested transforms, and non-1 device-pixel ratio
- Focus routing so text inputs do not trigger stage shortcuts
- Pointer capture/cancel behavior and click-versus-drag thresholds
- Valid, invalid, and externally replaced YAML documents
- Selection and viewport restoration across reload
- Panel layout persistence, reset, and narrow-window fallback
- Accessible names, keyboard traversal, and mixed-value inspector fields
- Shared conformance fixtures proving desktop, VS Code, web, and in-app hosts produce equivalent scene mutations

Visual regression tests are appropriate for layout and states, but they do not replace behavioral assertions. Tests must not encode inert prototype controls as completed features.

## Definition of Done for a UI Feature

A Flash-inspired feature is complete only when its shared command/tool behavior, host presentation, enablement, undo/redo, persistence implications, keyboard path, accessibility, diagnostics, and automated tests are all defined. If some pieces are intentionally deferred, the UI and documentation must name the limitation.
