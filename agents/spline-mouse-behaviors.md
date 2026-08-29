# Spline — Mouse Behaviors

Authoritative reference for all mouse interactions in Spline (circa 2024–2025), organized by tool, context, and panel.

## Cursor Vocabulary

| Cursor | Context | Meaning |
|--------|---------|---------|
| Default arrow | Move tool over empty viewport or panel area | Ready to select |
| Move crosshair | Over a Move gizmo axis arrow or plane handle | Drag to translate |
| Scale handle | Over a Scale gizmo handle | Drag to scale |
| Rotation arc | Over a Rotate gizmo ring | Drag to rotate |
| Open hand | Hand tool active, or Space held | Ready to pan |
| Closed hand | During pan drag | Currently panning |
| Crosshair | Path/Pen tool active | Place a point |
| I-beam | Over a text input field | Ready for text input |
| Resize arrows | Over a resize handle (Properties panel divider, etc.) | Drag to resize |
| Pointer | Over a clickable button or interactive element | Ready to click |

## Viewport Navigation (always available, any tool)

### Orbit

| Input | Result |
|-------|--------|
| Right-click drag | Orbit around the focal point |
| Alt+left-click drag | Orbit (alternative) |

The focal point is:
- The selected object's position (if any)
- The last framed point (after pressing F)
- The scene center (default)

### Pan

| Input | Result |
|-------|--------|
| Middle-click drag | Pan the viewport |
| Space+left-click drag | Pan (from any tool) |
| Two-finger drag (trackpad) | Pan |
| Hand tool (H) + left-click drag | Pan |

### Zoom

| Input | Result |
|-------|--------|
| Scroll wheel | Zoom in/out (centered on cursor position) |
| Pinch (trackpad) | Zoom in/out |
| Ctrl/Cmd+= | Step zoom in |
| Ctrl/Cmd+- | Step zoom out |

### Framing

| Input | Result |
|-------|--------|
| F | Frame selected — zoom and center on the selected object(s) |
| Shift+F or Home | Frame all — zoom to fit all objects |
| Double-click in Layers panel | Frame that object |

## Move Tool (V)

### Selection

| Input | Result |
|-------|--------|
| Click an object | Select it (deselects others) |
| Click empty space | Deselect all |
| Shift+click | Add to / remove from selection |
| Ctrl/Cmd+click | Toggle individual selection |
| Click a group (first click) | Select the group |
| Double-click a group | Enter the group (select children directly) |
| Escape | Exit the group, or deselect |

### Marquee Selection

| Input | Result |
|-------|--------|
| Left-click drag on empty space | Draw a selection rectangle |
| Objects that intersect the rectangle | Are selected |
| Shift+drag on empty space | Add to existing selection |

### Move (Gizmo Interactions)

| Element | Drag Result |
|---------|-------------|
| Red arrow (X) | Translate along the X axis |
| Green arrow (Y) | Translate along the Y axis |
| Blue arrow (Z) | Translate along the Z axis |
| XY plane handle | Translate on the XY plane |
| XZ plane handle | Translate on the XZ plane |
| YZ plane handle | Translate on the YZ plane |
| Object body (not gizmo) | Free translate on the camera-facing plane |

### Move Modifiers

| Modifier | Effect |
|----------|--------|
| Shift (held during drag) | Snap to grid increments |
| Alt/Option (held during drag) | Duplicate the object and move the copy |
| Alt+Shift (held during drag) | Duplicate and snap |

### Gizmo Highlighting

| State | Visual |
|-------|--------|
| Hover over an axis | That axis highlights (brighter color) |
| During drag | Active axis stays highlighted, others dim |
| Hover over a plane handle | That plane highlights |

## Scale Tool (S)

### Gizmo Interactions

| Element | Drag Result |
|---------|-------------|
| Red cube (X) | Scale along X axis |
| Green cube (Y) | Scale along Y axis |
| Blue cube (Z) | Scale along Z axis |
| Center cube | Uniform scale on all axes |

### Scale Behavior

- Drag **away** from the gizmo center to increase scale
- Drag **toward** the center to decrease scale
- Shift+drag snaps to scale increments

## Rotate Tool (R)

### Gizmo Interactions

| Element | Drag Result |
|---------|-------------|
| Red ring | Rotate around the X axis |
| Green ring | Rotate around the Y axis |
| Blue ring | Rotate around the Z axis |
| Outer ring (gray) | Free rotation around the camera view axis |

### Rotation Modifiers

| Modifier | Effect |
|----------|--------|
| Shift (held during drag) | Snap to 15° increments |

### Rotation Feedback

During rotation, a degree readout appears showing the swept angle.

## Path Tool (P)

### Creating Paths

| Input | Result |
|-------|--------|
| Click in viewport | Place a corner control point |
| Click and drag | Place a smooth point with Bezier handles (drag sets handle direction and length) |
| Click on the first point | Close the path (loop) |
| Enter or Escape | Finish the open path |
| Backspace | Remove the last placed point |
| Shift+click | Constrain angle to 45° increments from the previous point |

### Editing Points (select a path, then click a point)

| Input | Result |
|-------|--------|
| Click a control point | Select it |
| Shift+click | Multi-select points |
| Drag a point | Move it in 3D space (constrained by the gizmo or free) |
| Drag a Bezier handle | Adjust the curve curvature and direction |
| Alt/Option+drag a handle | Break handle symmetry (independent control of each side) |
| Double-click a smooth point | Convert to a corner point |
| Double-click a corner point | Convert to a smooth point |
| Click on the path between points | Add a new control point |
| Select point + Delete | Remove the point |

### Path Hover Feedback

| State | Cursor | Meaning |
|-------|--------|---------|
| Over a control point | Highlight dot | Select or move the point |
| Over a handle | Small circle | Drag to adjust curve |
| Over the path line | + cursor | Click to add a point |
| Over the start point (while drawing) | Circle | Click to close the path |

## Pen Tool (B)

Same interaction model as the Path tool, but creates 2D vector shapes (flat paths projected onto a plane) rather than 3D spline curves.

| Input | Result |
|-------|--------|
| Click | Place a corner point (2D) |
| Click and drag | Place a smooth point with handles |
| Click start point | Close the shape |
| Enter or Escape | Finish the path |

The resulting shape has fill and stroke properties (like Figma), unlike the 3D Path tool which creates geometry.

## Pencil Tool

| Input | Result |
|-------|--------|
| Click and drag | Draw a freehand path |
| Release | Path is auto-smoothed |

The path can be edited afterward with the Path tool.

## Text Tool (T)

| Input | Result |
|-------|--------|
| Click in viewport | Create a 3D text object at the click point |
| Type | Enter text content |
| Enter (twice) or Escape | Exit text editing |
| Double-click existing text | Enter text editing mode |
| Click and drag to select text | Highlight characters for formatting |
| Triple-click | Select entire text content |

## Shape Creation (+ menu or Shape dropdown)

| Input | Result |
|-------|--------|
| Click a shape in the menu | Create the shape at the center of the viewport (at the world origin or near the camera focus) |

Shape creation is a single click — the shape appears at a default size and can be immediately modified in the Properties panel or with gizmo handles.

## Boolean Operations

When 2+ objects are selected:

| Input | Result |
|-------|--------|
| Click Union in toolbar | Combine objects into one |
| Click Subtract in toolbar | Cut second from first |
| Click Intersect in toolbar | Keep only overlapping region |
| Double-click the boolean result | Enter the boolean to edit individual shapes |
| Escape (while inside boolean) | Exit to the boolean group level |

Boolean results are live — moving or reshaping a sub-object updates the result in real time.

## Layers Panel Mouse Behaviors

### Selection

| Input | Result |
|-------|--------|
| Click a row | Select that object (viewport highlights it, Properties panel updates) |
| Shift+click | Range select |
| Ctrl/Cmd+click | Toggle individual items |
| Double-click | Frame the object in the viewport |

### Drag and Drop

| Input | Result |
|-------|--------|
| Drag a layer row up/down | Reorder siblings (affects render order) |
| Drag onto another object | Parent the dragged object inside the target (nest) |
| Drag to empty space below | Unparent (move to scene root) |

### Inline Operations

| Input | Result |
|-------|--------|
| Double-click layer name | Rename inline |
| Click eye icon (on hover) | Toggle visibility |
| Click lock icon (on hover) | Toggle lock |
| Click expand triangle | Expand/collapse children |
| Alt+click expand triangle | Expand/collapse all descendants |

### Context Menu

| Input | Result |
|-------|--------|
| Right-click a row | Open context menu (Copy, Paste, Duplicate, Delete, Group, Ungroup, Lock, Hide, Create Component, Rename) |

## Properties Panel Mouse Behaviors

### Field Interactions

| Input | Result |
|-------|--------|
| Click a numeric field | Select for keyboard input |
| Tab | Move to the next field |
| Enter | Apply the typed value |
| Escape | Cancel editing, revert to previous value |
| Drag on the field label (e.g., "X") | Scrub — decrease/increase proportionally to drag distance |
| Click a color swatch | Open the color picker |
| Click a dropdown | Open the selection menu |
| Drag a slider | Adjust the value |
| Click a toggle/checkbox | Toggle the boolean value |
| Click a section header (▸/▾) | Collapse/expand that section |
| Right-click a field | Reset to default value |

### Color Picker Interactions

| Element | Input | Result |
|---------|-------|--------|
| Color field (large square) | Click/drag | Set saturation (X) and brightness (Y) |
| Hue slider (rainbow bar) | Click/drag | Select hue |
| Opacity slider | Click/drag | Set transparency |
| Hex input | Click and type | Enter a hex color code |
| Eyedropper button | Click, then click in viewport | Sample a color from the 3D scene |
| Preset palette swatch | Click | Apply that preset color |
| Saved color swatch | Click | Apply a previously saved color |

### Material Texture Fields

| Input | Result |
|-------|--------|
| Click a texture slot | Open the texture picker (browse uploaded images) |
| Drag an image from Assets panel | Apply the image as a texture |
| Click × on a texture | Remove the texture |

## Multi-Object Interactions

When multiple objects are selected:

### Move

All selected objects translate together by the same delta.

### Scale

All objects scale relative to the gizmo center (which is the center of the combined selection).

### Rotate

All objects rotate around the gizmo center.

### Properties

- Transform fields show mixed values as "—" for differing fields
- Setting a value in a mixed field applies it to all selected objects
- Material properties show only if all objects share the same material type

## Interactions / Events (⚡ mode)

When setting up interactions:

| Input | Result |
|-------|--------|
| Click + Add Event on an object | Add a new event trigger to the object |
| Select an event type from the dropdown | Choose the trigger (Mouse Hover, Mouse Down, Scroll, etc.) |
| Select an action from the dropdown | Choose the response (Move To, Rotate, Change Material, etc.) |
| Click the target selector | Choose which object the action affects (Self, or click another object) |
| Drag duration/easing sliders | Configure animation timing |
| Click Play to preview | Test the interaction in the viewport |

## Published Scene Interactions (viewer/runtime)

When a scene is published and viewed at a public URL:

| Input | Result |
|-------|--------|
| Mouse hover on interactive object | Triggers hover events/states |
| Click on interactive object | Triggers click events/states |
| Scroll | Triggers scroll events (or camera zoom if camera controls are enabled) |
| Drag (if orbit controls enabled) | Orbit the camera |
| Pinch (mobile) | Zoom |
| Touch and drag (mobile) | Pan or orbit depending on configuration |

## Flight Adaptation Notes

Apply [the Spline-inspired viewport, gesture, state, and runtime contract](./spline-implementation-contract.md).

- Orbit/pan/zoom, transforms, path editing, field scrubs, texture drops, and interaction wiring use shared cancellable gestures.
- Mouse, touch, pen, browser gesture, and in-game input ownership are explicit host mappings.
- Material and texture drops validate stable asset/slot types before one undoable assignment.
- Interaction authoring edits a stable graph; published hover/click/scroll changes runtime state only.
- Gizmo/picking math comes from shared 3D camera and geometry primitives.
- Test pointer capture loss, multitouch cancellation, occlusion, orthographic views, runtime/editor focus, and non-1 DPR.
