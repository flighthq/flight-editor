# Unity Scene View — Mouse Behaviors

Authoritative reference for all mouse interactions in the Unity Editor Scene View (Unity 2022 LTS / Unity 6), covering viewport navigation, gizmo manipulation, Hierarchy panel, Inspector scrubbing, and drag-and-drop placement.

## Cursor Vocabulary

| Cursor | Context | Meaning |
|--------|---------|---------|
| Default arrow | Over empty Scene View space, Hierarchy, Inspector, Project | Standard interaction |
| Move crosshair (four arrows) | Over a Move gizmo axis or plane handle | Drag to translate |
| Rotation arc | Over a Rotate gizmo ring | Drag to rotate |
| Scale line | Over a Scale gizmo handle | Drag to scale |
| Open hand | Hand tool (Q) active, or Alt held | Ready to orbit/pan |
| Closed hand | During pan drag | Currently panning |
| Resize arrows (↔ ↕) | Over Rect tool handles | Drag to resize |
| Crosshair dot | Vertex snapping active (V held), near a vertex | Vertex snap source |
| Eye/pointer highlight | Hovering over a gizmo axis (yellow highlight) | That axis will activate on click |
| I-beam | Over a text field in Inspector | Ready for text input |
| Horizontal resize ↔ | Over Inspector field label ("X", "Y", "Z") | Ready to scrub value |

## Scene View Navigation (all tools, always available)

Navigation works regardless of the active tool. The Hand tool (Q) makes panning the primary action; with other tools, navigation uses modifier keys.

### Orbit

| Input | Result |
|-------|--------|
| Alt+left-click drag | Orbit around the scene pivot (the selected object, or the view's last frame target) |
| Middle-click drag on Scene Gizmo (top-right cube) | Orbit (equivalent) |

The orbit pivot is:
- The position of the selected object (if any)
- The last framed point (after pressing F)
- Otherwise, the center of the visible scene

### Pan

| Input | Result |
|-------|--------|
| Alt+middle-click drag | Pan the view (slide the camera without changing the orbit target) |
| Middle-click drag | Pan (shorthand, works in any tool) |
| Hand tool (Q) + left-click drag | Pan |
| Two-finger drag (trackpad) | Pan |

### Zoom

| Input | Result |
|-------|--------|
| Scroll wheel up/down | Zoom in / zoom out (centered on cursor) |
| Alt+right-click drag up/down | Dolly zoom (drag up = zoom in, down = out) |
| Pinch (trackpad) | Zoom |

Zoom speed increases in perspective mode as the camera moves further from the pivot.

### Fly-Through (FPS-Style)

| Input | Result |
|-------|--------|
| Right-click (hold) + WASD | Fly: W = forward, S = backward, A = left, D = right |
| Right-click + Q | Fly down |
| Right-click + E | Fly up |
| Right-click + Shift | Fly at double speed |
| Right-click + Scroll wheel | Adjust fly speed (retained per Scene View) |

Release right-click to stop flying and return to the current tool.

### Frame and Align

| Input | Result |
|-------|--------|
| F | Frame selected — centers and zooms the Scene View to encompass the selected object(s) |
| Shift+F | Lock view to selected — the Scene View follows the object as it moves (toggle) |
| Double-click in Hierarchy | Frame that object in the Scene View |
| Numpad 0 | Snap Scene camera to match the selected Camera component's view |

### Scene Gizmo (Orientation Cube)

Located in the top-right corner of the Scene View:

| Input | Result |
|-------|--------|
| Click a face label (Front, Back, Right, Left, Top, Bottom) | Snap to that axis-aligned orthographic view |
| Shift+click a face label | Snap to the opposite view |
| Click the center of the cube | Toggle perspective / isometric (orthographic) |
| Drag the cube | Orbit the view smoothly |

## Move Tool (W) — Gizmo Interactions

### Axis Arrows

| Input | Result |
|-------|--------|
| Hover over an axis arrow | Arrow highlights yellow — that axis will be constrained |
| Left-click drag on red arrow (X) | Translate along the X axis only |
| Left-click drag on green arrow (Y) | Translate along the Y axis only |
| Left-click drag on blue arrow (Z) | Translate along the Z axis only |

### Plane Squares

Small translucent squares appear where two axes meet:

| Input | Result |
|-------|--------|
| Hover over a plane square (e.g., XZ) | Square highlights yellow — movement constrained to that plane |
| Drag the XZ square | Move on the horizontal plane (X and Z, no Y) |
| Drag the XY square | Move on the vertical plane facing forward |
| Drag the YZ square | Move on the vertical plane facing right |

### Center Square

| Input | Result |
|-------|--------|
| Drag the small center square | Free movement on the screen-facing plane (camera-aligned) |

### Snap Modifiers

| Input | Result |
|-------|--------|
| Ctrl+drag | Snap to increment values (configured in Edit > Grid and Snap Settings) |
| V (hold) + hover over vertex + drag | Vertex snap — the selected object's nearest vertex snaps to vertices on other objects |
| Ctrl+Shift+drag | Surface snap — the object's pivot snaps to mesh surfaces |

### Position Feedback

During a drag, a tooltip near the gizmo shows the position delta (world-space distance moved).

## Rotate Tool (E) — Gizmo Interactions

### Axis Rings

| Input | Result |
|-------|--------|
| Hover over red ring | Highlights — rotation will be constrained to the X axis |
| Drag on red ring | Rotate around the X axis (pitch) |
| Drag on green ring | Rotate around the Y axis (yaw) |
| Drag on blue ring | Rotate around the Z axis (roll) |

### Outer Ring (Screen-Space)

| Input | Result |
|-------|--------|
| Drag on the outer gray ring | Free rotation around the camera's view axis |

### Free Rotation

| Input | Result |
|-------|--------|
| Drag on the sphere area between rings | Free rotation (trackball-style) in some configurations |

### Snap Modifier

| Input | Result |
|-------|--------|
| Ctrl+drag on any ring | Snap rotation to increments (default 15°) |

### Rotation Feedback

During rotation, a circular arc appears showing the swept angle with a degree readout.

## Scale Tool (R) — Gizmo Interactions

### Axis Handles

| Input | Result |
|-------|--------|
| Drag the red handle (X) | Non-uniform scale along X |
| Drag the green handle (Y) | Non-uniform scale along Y |
| Drag the blue handle (Z) | Non-uniform scale along Z |

### Center Cube

| Input | Result |
|-------|--------|
| Drag the center cube | Uniform scale on all three axes simultaneously |

### Scale Behavior

- Drag **away** from the gizmo center to increase scale
- Drag **toward** the center to decrease scale
- Scale always operates in **local space** regardless of the Global/Local toggle
- Ctrl+drag snaps to scale increments

## Rect Tool (T) — Gizmo Interactions

Primarily for 2D/UI but works on 3D objects projected onto their local plane:

| Input | Result |
|-------|--------|
| Drag the body | Move on the local XY plane |
| Drag a corner handle | Resize width and height |
| Drag a side handle | Resize in one axis |
| Drag just outside a corner | Rotate around the local Z axis |
| Drag the blue pivot circle | Reposition the pivot point (for RectTransform/UI objects) |

## Transform Tool (Y) — Combined Gizmo

The combined gizmo merges Move, Rotate, and Scale handles:

| Element | Click/Drag Result |
|---------|------------------|
| Arrow tips (inner) | Move along that axis |
| Plane squares | Move on that plane |
| Arc segments (between arrows) | Rotate around the perpendicular axis |
| Handle cubes (outer ends) | Scale along that axis |
| Center | Uniform scale or free move |

The element that highlights on hover is the one that will activate.

## Object Selection in Scene View

### Click Selection

| Input | Result |
|-------|--------|
| Left-click an object | Select it (deselects others) |
| Shift+left-click | Add to selection (or remove if already selected) |
| Ctrl+left-click | Toggle in/out of selection |
| Left-click empty space | Deselect all |

### Marquee Selection (Box Select)

| Input | Result |
|-------|--------|
| Left-click drag on empty space | Draw a selection rectangle; all objects intersecting it are selected |
| Shift+drag | Add to existing selection |

### Picking Behavior

Unity picks the object whose mesh or collider is under the cursor. For overlapping objects:

| Input | Result |
|-------|--------|
| Click on overlapping objects | Selects the frontmost (nearest to camera) object |
| Click again on the same spot | Cycles to the next object behind the first one |
| Repeated clicks | Continue cycling through overlapping objects |

## Hierarchy Panel Mouse Behaviors

### Selection

| Input | Result |
|-------|--------|
| Left-click a row | Select that GameObject; Inspector shows its properties; Scene View highlights it |
| Shift+click | Range select (from last clicked to current) |
| Ctrl+click | Toggle individual items in/out of selection |
| Double-click | Frame the object in the Scene View (centers and zooms) |

### Drag and Drop (Reparenting)

| Input | Result |
|-------|--------|
| Drag an object onto another object | Parent the dragged object to the target (becomes a child) |
| Drag and hover between objects | Reorder siblings (a blue insertion line appears) |
| Drag to empty space below the list | Unparent (move to scene root) |
| Ctrl+drag | Drag without parenting (reorder only) |

### Expand / Collapse

| Input | Result |
|-------|--------|
| Click the expand triangle (▸/▾) | Toggle expand/collapse for that object's children |
| Alt+click the expand triangle | Recursively expand/collapse all descendants |
| Right arrow (keyboard) | Expand children |
| Left arrow (keyboard) | Collapse children or move to parent |

### Rename

| Input | Result |
|-------|--------|
| F2 | Enter rename mode for the selected object |
| Slow double-click (click, pause, click on name) | Enter rename mode |

### Context Menu

| Input | Result |
|-------|--------|
| Right-click | Open the context menu (Create, Copy, Paste, Duplicate, Delete, Prefab operations, etc.) |

## Inspector Panel Mouse Behaviors

### Numeric Field Interactions

| Input | Result |
|-------|--------|
| Click a field | Select it for keyboard input; existing value is highlighted |
| Tab | Move to the next field |
| Shift+Tab | Move to the previous field |
| Enter | Apply the typed value |
| Escape | Cancel editing, revert to the previous value |
| Drag left/right on the field label (e.g., "X") | **Scrub** — decrease/increase the value proportionally to drag distance |
| Alt+drag on label | Fine scrub (slower, more precise) |
| Right-click on a label | Context menu (Reset, Copy, Paste) |

### Component Headers

| Input | Result |
|-------|--------|
| Click the foldout triangle (▸/▾) | Expand/collapse the component's fields |
| Click the checkbox (☑) | Enable/disable the component |
| Right-click the component header | Context menu: Reset, Remove Component, Move Up/Down, Copy/Paste Component, Paste Component Values |
| Drag the component header (≡ icon) | Reorder components in the Inspector |

### Color Fields

| Input | Result |
|-------|--------|
| Click a color swatch | Open the Color Picker window |
| Eyedropper (in Color Picker) | Click anywhere on screen to sample a color |

### Drag-and-Drop Assignments

| Input | Result |
|-------|--------|
| Drag an asset from Project panel to a field | Assign it (e.g., drag a Material to a Renderer's material slot) |
| Drag a GameObject from Hierarchy to a reference field | Assign the reference |
| Drag from Inspector field to another Inspector field | Copy the reference |

### Object Picker

| Input | Result |
|-------|--------|
| Click the small circle/dot next to an object reference field | Open the object picker (search and select from all scene or project assets of the correct type) |

## Project Panel Mouse Behaviors

### Asset Interaction

| Input | Result |
|-------|--------|
| Single click | Select the asset (Inspector shows its import settings) |
| Double-click a scene asset | Open that scene |
| Double-click a prefab | Enter Prefab editing mode |
| Double-click a script | Open in the configured code editor |
| Drag an asset to the Scene View | Instantiate it at the drop point (for models, prefabs) |
| Drag an asset to the Hierarchy | Instantiate it in the scene (position defaults to origin) |
| Drag a material to an object in Scene View | Apply the material to that object |

### Drag-and-Drop Placement Details

When dragging a Prefab or model from the Project panel to the Scene View:

| Behavior | Description |
|----------|-------------|
| Drop on empty space | Places at the world-space point under the cursor on the grid plane |
| Drop on an existing object surface | Places at the surface point (if the surface has a collider) |
| Hold Ctrl while dropping | Snap to grid |
| Preview ghost | A translucent preview of the object follows the cursor before release |

## Scene View Context Menu (Right-Click)

Right-clicking in the Scene View (not on a gizmo) opens a context menu:

| Menu Item | Description |
|-----------|-------------|
| Move to View (Ctrl+Alt+F) | Place the selected object at the Scene camera's position |
| Align with View (Ctrl+Shift+F) | Match the object's position and rotation to the Scene camera |
| Align View to Selected | Match the Scene camera to the object's position and rotation |
| Properties... | Open a floating Inspector for the selected object |

## Multi-Object Drag Behavior

When multiple objects are selected and you drag:

| Tool | Behavior |
|------|----------|
| Move | All selected objects translate by the same delta |
| Rotate | All objects rotate around the gizmo center (determined by Pivot/Center mode) |
| Scale | All objects scale relative to the gizmo center |

The gizmo position for multi-selection:

| Pivot Mode | Gizmo At |
|------------|----------|
| Pivot | The last-selected object's pivot point |
| Center | The center of the combined bounding box of all selected objects |

## Gizmo Highlighting and Feedback

### Hover Feedback

| State | Visual |
|-------|--------|
| No hover | All axis handles show their assigned colors at normal opacity |
| Hover over an axis | That axis/plane highlights **yellow**; other handles dim |
| During drag | The active axis stays highlighted; others are fully dimmed |

### During Transform

| Tool | Feedback |
|------|----------|
| Move | Tooltip near the gizmo shows position delta (e.g., "X: +2.50") |
| Rotate | Arc sweep + degree label (e.g., "45.0°") |
| Scale | Scale factor readout near the handle |
| Snap active (Ctrl held) | Values jump in discrete increments; the readout reflects snapped values |
