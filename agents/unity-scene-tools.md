# Unity Scene View — Transform Tools and Gizmos

Authoritative reference for the transform tools and gizmos in the Unity Editor Scene View (Unity 2022 LTS / Unity 6), focused on 3D object arrangement.

## Tool Bar

Six tools are always available in the toolbar, each with a keyboard shortcut:

| Shortcut | Tool | Gizmo | Purpose |
|----------|------|-------|---------|
| Q | **Hand (View)** | None | Navigate the Scene View (orbit, pan, zoom) |
| W | **Move** | Translation arrows + plane squares | Translate objects along axes or planes |
| E | **Rotate** | Rotation rings | Rotate objects around axes |
| R | **Scale** | Scale handles + center cube | Scale objects along axes or uniformly |
| T | **Rect** | 2D rectangle handles | 2D positioning and sizing (mainly for UI/2D) |
| Y | **Transform** | Combined move+rotate+scale | All transforms in one gizmo |

Only one tool is active at a time. The active tool is highlighted in the toolbar.

## Hand / View Tool (Q)

The Hand tool is purely for navigating the Scene View — it does not affect any objects.

| Action | Result |
|--------|--------|
| Left-click drag | Pan the view |
| Alt+left-click drag | Orbit around the pivot point |
| Alt+right-click drag | Zoom (dolly) |
| Scroll wheel | Zoom |
| Right-click + WASD/QE | Fly-through navigation |

When any other tool is active, holding **Alt** temporarily switches to orbit/pan/zoom behavior (View Tool functionality is always accessible).

## Move Tool (W)

### Gizmo Appearance

```
         Y (green)
         ▲
         │
         │
    ─────┼─────▶ X (red)
        ╱│
       ╱ │
      ▼
     Z (blue)
```

The Move gizmo shows:
- **Three axis arrows** — red (X), green (Y), blue (Z), extending from the gizmo center
- **Three plane squares** — small squares at the intersection of two axes (XY, XZ, YZ), for movement constrained to a plane
- **Center square** — small white/gray square at the origin, for free movement on the screen plane (camera-facing)

### Interactions

| Element | Action | Result |
|---------|--------|--------|
| Axis arrow (e.g., red/X) | Drag | Move along that single axis |
| Plane square (e.g., XZ) | Drag | Move on that plane (constrained to two axes) |
| Center square | Drag | Free movement on the camera-facing plane |
| Any handle | Ctrl+drag | Snap to grid increments (when Increment Snap is configured) |

### Axis Highlighting

- Hovering over an axis arrow or plane square highlights it yellow
- The highlighted axis/plane is the one that will be affected by dragging
- During a drag, the active axis/plane stays highlighted and other handles dim

### Position Display

During a drag, a tooltip near the cursor shows the position delta or absolute position.

## Rotate Tool (E)

### Gizmo Appearance

```
        ╭───────╮
       ╱    Y    ╲       Three concentric rings:
      │   ╭───╮   │      - Red ring: rotation around X
      │  ╱     ╲  │      - Green ring: rotation around Y
      │ │   ⊕   │ │      - Blue ring: rotation around Z
      │  ╲     ╱  │      
      │   ╰───╯   │      Outer gray ring:
       ╲    X    ╱       - Free rotation (screen-space)
        ╰───────╯
```

The Rotate gizmo shows:
- **Three axis rings** — red (X rotation), green (Y rotation), blue (Z rotation)
- **Outer gray ring** — free rotation around the view axis (camera-facing)
- **Sphere area** (between rings) — can also be used for free rotation in some configurations

### Interactions

| Element | Action | Result |
|---------|--------|--------|
| Red ring (X) | Drag | Rotate around the X axis |
| Green ring (Y) | Drag | Rotate around the Y axis |
| Blue ring (Z) | Drag | Rotate around the Z axis |
| Outer gray ring | Drag | Free rotation around the camera's view axis |
| Any ring | Ctrl+drag | Snap to rotation increments (default 15°) |

### Rotation Display

During rotation, a circular arc and degree readout appear showing the angle of rotation from the starting orientation.

## Scale Tool (R)

### Gizmo Appearance

```
         ■ Y (green)
         │
         │
    ─────■─────■ X (red)
        ╱
       ╱
      ■
     Z (blue)
```

The Scale gizmo shows:
- **Three axis handles** — red (X), green (Y), blue (Z) lines ending in small cubes
- **Center cube** — gray/white cube at the origin for uniform scaling

### Interactions

| Element | Action | Result |
|---------|--------|--------|
| Axis handle (e.g., X) | Drag | Scale along that single axis (non-uniform) |
| Center cube | Drag | Scale uniformly along all three axes |
| Any handle | Ctrl+drag | Snap to scale increments |

### Scale Behavior Notes

- Scale always operates in **local space** (regardless of the Global/Local toggle) because non-uniform scale in world space would introduce shear
- Dragging away from the center increases scale; toward the center decreases
- Scale values are displayed as multipliers (1 = original size)

## Rect Tool (T)

Primarily for 2D and UI layout, but works on 3D objects too:

### Gizmo Appearance

A 2D rectangle with handles at corners and edge midpoints, projected onto the object's local plane.

### Interactions

| Element | Action | Result |
|---------|--------|--------|
| Body | Drag | Move the object on its local XY plane |
| Corner handle | Drag | Resize (changes width/height or scale) |
| Edge handle | Drag | Resize in one axis |
| Corner (outside, near) | Drag | Rotate around the Z axis |
| Pivot point (blue circle) | Drag | Move the pivot/anchor (for UI elements) |

### Use Cases for 3D

- Positioning sprites and 2D objects in 3D space
- Sizing UI Canvas elements
- Adjusting plane/quad objects

## Transform Tool (Y)

Combines Move, Rotate, and Scale into a single gizmo:

### Gizmo Appearance

A combined gizmo showing move arrows, rotation arcs, and scale handles simultaneously.

| Element | Action |
|---------|--------|
| Arrow tips | Move along axis |
| Plane squares | Move on plane |
| Arc segments (between arrows) | Rotate around the perpendicular axis |
| Scale cubes (at handle ends, further out) | Scale along axis |
| Center | Uniform scale or free move |

The combined gizmo is denser but eliminates tool-switching for rapid iteration.

## Gizmo Behavior Settings

### Pivot vs Center (toolbar toggle)

| Mode | Gizmo Position | Multi-Select Behavior |
|------|---------------|----------------------|
| **Pivot** | At each object's authored pivot point | Gizmo at the last-selected object's pivot |
| **Center** | At the bounding box center of the selection | Gizmo at the center of all selected objects' combined bounds |

### Global vs Local (toolbar toggle)

| Mode | Gizmo Orientation | When to Use |
|------|-------------------|-------------|
| **Global** | World-aligned (X=right, Y=up, Z=forward) | Moving along absolute directions |
| **Local** | Aligned to the selected object's rotation | Moving "forward" or "right" relative to a tilted object |

For multi-selection, Local uses the last-selected object's orientation.

## Snapping

### Increment Snapping (Ctrl held during transform)

Hold **Ctrl** while dragging any gizmo handle to snap to increments:

| Transform | Default Increment | Configurable In |
|-----------|-------------------|-----------------|
| Move | Grid size (e.g., 0.25 units) | Edit > Grid and Snap Settings > Increment Snap > Move |
| Rotate | 15° | Edit > Grid and Snap Settings > Increment Snap > Rotate |
| Scale | 0.1 | Edit > Grid and Snap Settings > Increment Snap > Scale |

### Grid Snapping (Scene View footer toggle)

When grid snap is enabled, objects snap to world grid intersections. This differs from increment snap:

| Snap Type | Behavior |
|-----------|----------|
| Increment Snap (Ctrl) | Moves in fixed steps relative to the current position |
| Grid Snap (toggle) | Snaps to absolute grid positions (world-aligned grid intersections) |

### Vertex Snapping (V key)

Hold **V** to activate vertex snapping:

1. Hold V — vertex snap mode activates
2. Move the cursor near a vertex on the selected object — the gizmo jumps to that vertex
3. Drag — the object moves, snapping the chosen vertex to the nearest vertex on any other object
4. Release — the vertex is snapped precisely

This allows pixel-perfect alignment of mesh geometry corners, edges, and points.

| Action | Result |
|--------|--------|
| V + hover over vertex + drag | Snap that vertex to target vertices |
| Ctrl+Shift + drag | Surface snapping (snap to the surface of other colliders/meshes) |

### Surface Snapping

Hold **Ctrl+Shift** while moving to snap the object's pivot to the surface of other objects (meshes with colliders). The object "sticks" to surfaces as you move across them.

## Multi-Object Transform

When multiple objects are selected:

| Behavior | Description |
|----------|-------------|
| Move | All selected objects move together by the same delta |
| Rotate | All objects rotate around the gizmo position (Pivot or Center) |
| Scale | All objects scale relative to the gizmo position |
| Gizmo position | Determined by Pivot/Center mode (see above) |
| Individual origins | Not natively supported in a single gizmo drag; use individual mode (requires entering/exiting selection) |

## Transform Handles Interaction Summary

| Axis/Element | Color | Move (W) | Rotate (E) | Scale (R) |
|-------------|-------|----------|------------|-----------|
| X axis | Red | Translate along X | Rotate around X | Scale along X |
| Y axis | Green | Translate along Y | Rotate around Y | Scale along Y |
| Z axis | Blue | Translate along Z | Rotate around Z | Scale along Z |
| XY plane | Red+Green | Move on XY plane | — | — |
| XZ plane | Red+Blue | Move on XZ plane | — | — |
| YZ plane | Green+Blue | Move on YZ plane | — | — |
| Center | White/Gray | Free move (screen plane) | Free rotate (view axis) | Uniform scale |
| Outer ring | Gray | — | Screen-space rotation | — |

## Gizmo Display Settings

Via the **Gizmos** dropdown in the Scene View footer:

| Setting | Description |
|---------|-------------|
| 3D Icons | Toggle between 3D and 2D gizmo icons for components (cameras, lights, etc.) |
| Icon size slider | Adjust the display size of component gizmos |
| Per-component toggles | Show/hide gizmo icons for specific component types (Light, Camera, AudioSource, Collider, etc.) |
| Fade Gizmos | Gizmos fade as they get further from the camera |
| Selection Outline | Toggle the orange/blue outline on selected objects |
| Selection Wire | Toggle wireframe overlay on selected objects |

## Component Gizmos (non-transform)

These gizmos appear in the Scene View to visualize components, aiding layout:

| Component | Gizmo | Purpose |
|-----------|-------|---------|
| Camera | Frustum wireframe | Shows the camera's field of view, near/far planes, and aspect ratio |
| Light (Directional) | Arrow + circle | Shows light direction |
| Light (Point) | Sphere wireframe | Shows light range |
| Light (Spot) | Cone wireframe | Shows light cone angle and range |
| Collider (Box/Sphere/Capsule) | Green wireframe | Shows collision boundary shape |
| AudioSource | Sphere wireframes | Shows min/max distance spheres |
| ReflectionProbe | Box wireframe | Shows probe influence area |

These are display-only (not interactive) — they help with spatial arrangement by showing invisible boundaries and influence zones.
