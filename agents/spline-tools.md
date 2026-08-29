# Spline — Tools

Authoritative reference for all tools in the Spline toolbar (circa 2024–2025).

## Toolbar Organization

The toolbar is positioned at the bottom of the viewport. Tools are arranged left-to-right:

```
[Move] [Scale] [Rotate] [Path] [Pen] [Pencil] [Text] [Shape▾] [Boolean▾] [⚡ Interactions]
  V       S       R       P      B                T
```

Only one tool is active at a time. The active tool is highlighted.

## Move Tool (V)

### Purpose
The default selection and translation tool. Select objects and move them in 3D space.

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

Three axis arrows with colored cones:
- **Red arrow** — X axis (right/left)
- **Green arrow** — Y axis (up/down)
- **Blue arrow** — Z axis (forward/back)

Plus plane handles at axis intersections for 2-axis constrained movement:
- **XY plane** (red-green square)
- **XZ plane** (red-blue square)
- **YZ plane** (green-blue square)

### Interactions

| Action | Result |
|--------|--------|
| Click object | Select it |
| Click empty space | Deselect all |
| Shift+click | Add to / remove from selection |
| Drag red arrow | Move along X axis |
| Drag green arrow | Move along Y axis |
| Drag blue arrow | Move along Z axis |
| Drag plane handle | Move on that 2-axis plane |
| Drag object body (not gizmo) | Free move on the camera-facing plane |
| Alt/Option+drag | Duplicate and move |
| Shift+drag on axis | Snap to grid increments |

### Axis Highlighting

Hovering over an axis arrow or plane handle highlights it in a brighter shade. The highlighted element is the one that will constrain the movement.

## Scale Tool (S)

### Purpose
Resize objects along individual axes or uniformly.

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

Three axis lines ending in small cubes, plus a center cube for uniform scaling.

### Interactions

| Action | Result |
|--------|--------|
| Drag red handle | Scale along X |
| Drag green handle | Scale along Y |
| Drag blue handle | Scale along Z |
| Drag center cube | Uniform scale on all axes |
| Shift+drag | Snap to scale increments |

### Scale Behavior

- Drag away from center to increase, toward center to decrease
- Non-uniform scale is fully supported (each axis independent)
- Center cube preserves aspect ratio across all axes

## Rotate Tool (R)

### Purpose
Rotate objects around individual axes or freely.

### Gizmo Appearance

Three concentric rings:
- **Red ring** — rotation around the X axis
- **Green ring** — rotation around the Y axis
- **Blue ring** — rotation around the Z axis

Plus an outer ring for free (screen-space) rotation.

### Interactions

| Action | Result |
|--------|--------|
| Drag red ring | Rotate around X axis |
| Drag green ring | Rotate around Y axis |
| Drag blue ring | Rotate around Z axis |
| Drag outer ring | Free rotation around the camera's view axis |
| Shift+drag | Snap to angle increments (15° default) |

### Rotation Feedback

During rotation, a degree readout appears showing the angle of rotation from the starting orientation.

## Path Tool (P)

### Purpose
Create and edit 3D paths — spline curves in 3D space. This is Spline's signature feature (the tool is named after it).

### Creation

| Action | Result |
|--------|--------|
| Click in viewport | Place a point on the path |
| Click and drag | Place a point with Bezier handles (creates a curve) |
| Click on the first point | Close the path |
| Enter or Escape | Finish the open path |
| Backspace | Remove the last placed point |

### Path Properties

Paths have unique properties in the Properties panel:

| Property | Description |
|----------|-------------|
| Points list | Each point can be individually positioned in 3D space |
| Handle type per point | Smooth (aligned handles), Corner (broken handles), or Linear (no handles) |
| Extrude | Extrude the path into a 3D shape along a direction |
| Revolve | Revolve the path around an axis to create a surface of revolution |
| Sweep | Sweep a cross-section shape along the path |
| Geometry | Convert the path into a tube, ribbon, or plane |
| Subdivisions | Control smoothness (number of segments between control points) |
| Close path | Toggle whether the path forms a closed loop |

### Path Editing (select a path, then edit points)

| Action | Result |
|--------|--------|
| Click a control point | Select it |
| Drag a control point | Move it in 3D space |
| Drag a Bezier handle | Adjust the curve |
| Double-click a smooth point | Convert to corner |
| Double-click a corner point | Convert to smooth |
| Click on the path between points | Add a new point |
| Select point + Delete | Remove the point |

### Path as a Motion Track

Paths can serve as animation motion paths — an object can be set to follow a path over time.

## Pen Tool (B)

### Purpose
Draw 2D vector paths (like Figma/Illustrator's Pen tool) that exist as flat shapes in 3D space.

### Creation

| Action | Result |
|--------|--------|
| Click | Place a corner point |
| Click and drag | Place a smooth point with Bezier handles |
| Click on start point | Close the path |
| Enter or Escape | End the open path |

### Differences from Path Tool

| Path Tool (P) | Pen Tool (B) |
|----------------|-------------|
| Creates 3D spline curves | Creates 2D vector paths |
| Points exist in full 3D space | Points are on a 2D plane (projected onto an axis-aligned plane) |
| Used for 3D geometry generation (extrude, revolve, sweep) | Used for flat shape creation (filled/stroked) |
| Wire/tube appearance by default | Filled shape appearance by default |

## Pencil Tool

### Purpose
Freehand 3D drawing — create paths by drawing with the mouse.

| Action | Result |
|--------|--------|
| Click and drag | Draw a freehand path |
| Release | Path is auto-smoothed |

The resulting path can be edited with the Path tool.

## Text Tool (T)

### Purpose
Create 3D text objects.

### Creation

| Action | Result |
|--------|--------|
| Click in viewport | Place a 3D text object at the click position |
| Type | Enter the text content |
| Enter (twice) or Escape | Exit text editing |

### Text Properties

| Property | Description |
|----------|-------------|
| Content | The text string |
| Font | Choose from available fonts (Google Fonts integration) |
| Size | Font size in scene units |
| Weight | Font weight (Light, Regular, Bold, etc.) |
| Letter spacing | Horizontal spacing between characters |
| Line height | Vertical spacing between lines |
| Alignment | Left, Center, Right, Justify |
| Extrude | Depth of the 3D extrusion |
| Bevel | Edge bevel on the extruded text |
| Material | Full material properties (color, metalness, roughness, etc.) |

### Text as 3D Object

Text in Spline is fully 3D — it has depth (extrusion), can cast shadows, receive lighting, and has material properties. It can be rotated and positioned freely in 3D space.

## Shape Tools (dropdown)

A dropdown menu in the toolbar provides quick-add for 3D primitives:

### 3D Primitives

| Shape | Description |
|-------|-------------|
| Cube | Box with configurable width, height, depth |
| Sphere | Sphere with configurable radius and segments |
| Cylinder | Cylinder with configurable radius, height, segments |
| Torus | Donut shape with configurable radius and tube radius |
| Plane | Flat rectangular surface |
| Capsule | Rounded cylinder |
| Cone | Cone with configurable radius and height |

### 2D Shapes

| Shape | Description |
|-------|-------------|
| Rectangle | 2D rectangle (flat, with optional corner radius) |
| Ellipse | 2D ellipse/circle |
| Polygon | Configurable number of sides |
| Star | Star shape with configurable points and inner radius |

### Special Objects

| Object | Description |
|--------|-------------|
| Camera | Add a camera to the scene |
| Directional Light | Sun-like infinite light |
| Point Light | Omnidirectional light at a point |
| Spot Light | Cone-shaped light |
| Hemisphere Light | Sky light (color above, ground color below) |
| Particle System | Particle emitter |
| 3D Model (Import) | Import external 3D models (GLB, GLTF, FBX, OBJ) |
| Image | Place an image as a 2D plane in 3D space |
| Video | Place a video as a textured plane |
| Screen | A plane that acts as a screen for media |
| Clipping Mask | Clip children to a shape boundary |
| Spline Component | Reusable component (like Figma components) |

### Add Menu (+)

The **+** button in the menu bar provides the same creation options as the Shape dropdown, organized by category:
- 3D Objects
- 2D Shapes
- Lights
- Camera
- Effects
- Interactive
- Import

## Boolean Operations (dropdown)

When 2+ objects are selected, the Boolean dropdown becomes active:

| Operation | Description |
|-----------|-------------|
| Union | Combine objects into one shape |
| Subtract | Cut the second shape from the first |
| Intersect | Keep only overlapping geometry |

Boolean results are live and editable — you can adjust the original shapes and the boolean updates. Enter the boolean group to modify individual shapes.

## Interactions Tool (⚡)

### Purpose
Attach event-driven behaviors to objects without code.

### Event Types

| Event | Description |
|-------|-------------|
| Mouse Hover | Triggered when the cursor enters/leaves the object |
| Mouse Down / Up | Triggered on click/release |
| Scroll | Triggered on scroll input |
| Look At | Object rotates to face the cursor or another object |
| Follow | Object follows cursor position |
| Key Down / Up | Triggered on keyboard input |
| Start | Triggered when the scene loads |

### Action Types

| Action | Description |
|--------|-------------|
| Move To | Animate position to a target |
| Rotate | Animate rotation |
| Scale | Animate scale |
| Change Material | Swap material properties (color, opacity, etc.) |
| Toggle | Toggle between two states |
| Open URL | Navigate to a URL |
| Play Animation | Trigger a named animation |
| Play Sound | Play an audio file |
| Show / Hide | Toggle visibility |

### State System

Objects can have multiple **states** (like Figma component variants). Interactions transition between states with configurable easing and duration:

| State Property | Description |
|----------------|-------------|
| Default | The initial state |
| Hover | State when the cursor is over the object |
| Click | State while the mouse button is held |
| Custom states | User-defined named states |

Each state can have different Transform, Material, and visibility values. Transitions animate between states.

## Tool Persistence

- Move, Scale, and Rotate tools stay active until you switch
- Path and Pen tools stay active for multi-point placement until Enter/Escape
- Text tool switches to text editing on the created object; Escape returns to Move
- Shape creation is a single-click action; the tool does not stay active (returns to Move after placing)

## Flight Adaptation Notes

Apply [the Spline-inspired 3D tool and runtime contract](./spline-implementation-contract.md).

- Move, Scale, Rotate, Path, Pen, Text, primitive, boolean, and interaction tools are shared state machines with host-specific chrome.
- Primitive creation preserves editable parameters; booleans/path/text rely on upstream geometry/text and report destructive conversion explicitly.
- Transform and path gestures use editor-gizmo3d/editor-gesture and one undo boundary.
- Interaction tools author stable event/state graphs compiled to Flight flow/statechart/animation primitives.
- Physics, media, special objects, and exporters appear only when registered and supported.
- Test incomplete paths, transform cancellation, primitive defaults, state transition validation, missing targets, and runtime preview isolation.
