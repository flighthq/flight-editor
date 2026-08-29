# Spline — Properties Inspector

Authoritative reference for the Spline Properties panel (circa 2024–2025), which appears on the right side of the workspace and is context-sensitive to the selected object.

## Panel Structure

The Properties panel is divided into collapsible sections. Which sections appear depends on the selected object type.

## No Selection

When nothing is selected, the Properties panel shows scene-level settings:

| Section | Contents |
|---------|----------|
| Scene | Background color/gradient, environment map, environment intensity |
| Post-Processing | Bloom, Depth of Field, Vignette, Noise, Chromatic Aberration, Tone Mapping |
| Physics | Enable/disable, gravity direction, gravity strength |
| Export | Export settings, public URL |

## Transform Section (all objects)

Every object shows a Transform section at the top:

```
┌─ Transform ───────────────────────────────────────────┐
│ Position   X [___0___]  Y [___0___]  Z [___0___]      │
│ Rotation   X [___0___]  Y [___0___]  Z [___0___]      │
│ Scale      X [___1___]  Y [___1___]  Z [___1___]      │
│                                                        │
│ [🔗 Lock proportions]                                  │
└────────────────────────────────────────────────────────┘
```

### Transform Fields

| Field | Units | Description |
|-------|-------|-------------|
| Position X/Y/Z | Scene units | World-space position (or local-space if parented) |
| Rotation X/Y/Z | Degrees | Euler rotation angles |
| Scale X/Y/Z | Multiplier | Scale factor (1 = original size) |

### Transform Interactions

| Action | Result |
|--------|--------|
| Click a field | Select for keyboard input |
| Tab | Move to next field |
| Enter | Apply value |
| Drag on the field label | Scrub the value (drag left/right to decrease/increase) |
| Click the lock icon (🔗) | Toggle proportional scaling (when locked, changing one scale axis changes all three) |
| Type arithmetic | Fields accept expressions: "5+3" → 8, "*2" → double |

### Parented Objects

For child objects, the Transform shows **local-space** values relative to the parent. Moving the parent moves all children without changing their local values.

## 3D Primitives

### Cube

| Section | Fields |
|---------|--------|
| Shape | Width, Height, Depth, Corner Radius (per edge), Subdivisions |
| Material | (see Material section below) |

### Sphere

| Section | Fields |
|---------|--------|
| Shape | Radius, Width Segments, Height Segments |
| Material | (see below) |

### Cylinder

| Section | Fields |
|---------|--------|
| Shape | Radius Top, Radius Bottom, Height, Radial Segments, Height Segments, Open Ended (toggle) |
| Material | (see below) |

### Torus

| Section | Fields |
|---------|--------|
| Shape | Radius, Tube Radius, Radial Segments, Tubular Segments, Arc (0–360) |
| Material | (see below) |

### Cone

| Section | Fields |
|---------|--------|
| Shape | Radius, Height, Radial Segments |
| Material | (see below) |

### Plane

| Section | Fields |
|---------|--------|
| Shape | Width, Height, Width Segments, Height Segments |
| Material | (see below) |

### Capsule

| Section | Fields |
|---------|--------|
| Shape | Radius, Height, Radial Segments, Height Segments |
| Material | (see below) |

## 2D Shapes

### Rectangle

| Section | Fields |
|---------|--------|
| Shape | Width, Height, Corner Radius (all four corners independently) |
| Fill | Color, gradient, or image fill |
| Stroke | Color, width, dash pattern |

### Ellipse

| Section | Fields |
|---------|--------|
| Shape | Width, Height |
| Fill | Color, gradient, or image |
| Stroke | Color, width |

### Polygon

| Section | Fields |
|---------|--------|
| Shape | Sides (3–100), Radius, Inner Radius (for star shapes) |
| Fill | Color, gradient, or image |
| Stroke | Color, width |

## Material Section

The Material section appears for all 3D objects and controls their visual appearance:

### Material Types

| Type | Description |
|------|-------------|
| Standard | PBR (Physically Based Rendering) material with metalness/roughness |
| Unlit | Flat color, not affected by lighting |
| Glass | Transparent with refraction and reflection |
| Matcap | Material capture — uses a sphere texture for shading (lighting baked into the texture) |
| Gradient | Color gradient mapped to the object surface |
| Custom Shader | Advanced: write custom GLSL fragment shaders |

### Standard Material Fields

| Field | Type | Description |
|-------|------|-------------|
| Color | Color picker | Base color of the material |
| Texture | Image | Texture map applied to the surface |
| Metalness | Slider (0–1) | 0 = dielectric (plastic/wood), 1 = metal |
| Roughness | Slider (0–1) | 0 = mirror-smooth, 1 = fully rough/matte |
| Normal map | Image | Bump/detail texture (adds surface detail without geometry) |
| Emissive | Color + intensity | Self-illumination color (object glows) |
| Opacity | Slider (0–1) | Transparency (0 = invisible, 1 = opaque) |
| Fresnel | Toggle + intensity | Edge glow effect (brighter at glancing angles) |
| Environment map | Image | Per-object environment reflection override |
| Side | Front / Back / Both | Which faces to render |

### Glass Material Fields

| Field | Description |
|-------|-------------|
| Color | Tint color of the glass |
| IOR (Index of Refraction) | How much light bends through the glass (1.0 = no refraction, 1.5 = glass) |
| Opacity | Transparency level |
| Roughness | Surface roughness (frosted glass effect) |
| Thickness | Glass thickness (affects refraction) |

### Gradient Material Fields

| Field | Description |
|-------|-------------|
| Gradient type | Linear, Radial |
| Color stops | Configurable color stops along the gradient |
| Angle/direction | Orientation of the gradient |
| Offset | Position offset of the gradient center |

### Color Picker

Clicking any color swatch opens the color picker:

| Element | Description |
|---------|-------------|
| Color field (large square) | Click/drag for saturation (X) and brightness (Y) |
| Hue slider | Rainbow strip to select hue |
| Opacity slider | Transparency slider |
| Hex input | Type a hex color code |
| RGB inputs | Individual Red, Green, Blue values |
| HSL inputs | Hue, Saturation, Lightness |
| Eyedropper | Sample a color from the viewport |
| Saved colors | Swatches of previously used colors |
| Preset palettes | Built-in color palettes |

## Text Properties

| Section | Fields |
|---------|--------|
| Content | Text string (editable inline or in panel) |
| Font | Font family (Google Fonts available) |
| Size | Font size in scene units |
| Weight | Light, Regular, Medium, Semi-Bold, Bold, Extra-Bold, Black |
| Style | Normal, Italic |
| Letter spacing | Horizontal spacing between characters |
| Line height | Vertical spacing between lines |
| Alignment | Left, Center, Right, Justify |
| Vertical alignment | Top, Middle, Bottom |
| Extrude | Depth of the 3D extrusion (0 = flat text) |
| Bevel | Edge bevel width and depth |
| Material | Full material properties (color, metalness, roughness, etc.) |

## Light Properties

### Directional Light

| Field | Description |
|-------|-------------|
| Color | Light color |
| Intensity | Brightness |
| Shadow | Enable/disable shadow casting |
| Shadow opacity | How dark the shadow is |
| Shadow blur | Softness of the shadow edges |
| Shadow bias | Offset to prevent shadow artifacts |
| Shadow map size | Resolution of the shadow map |
| Helper | Show/hide the directional light gizmo in the viewport |

### Point Light

| Field | Description |
|-------|-------------|
| Color | Light color |
| Intensity | Brightness |
| Range | Maximum distance the light reaches |
| Decay | How quickly the light falls off with distance |
| Shadow | Enable/disable |
| Helper | Show/hide the light sphere gizmo |

### Spot Light

| Field | Description |
|-------|-------------|
| Color | Light color |
| Intensity | Brightness |
| Range | Maximum distance |
| Angle | Cone angle (degrees) |
| Penumbra | Softness of the cone edge |
| Decay | Falloff rate |
| Shadow | Enable/disable |
| Helper | Show/hide the cone gizmo |

### Hemisphere Light

| Field | Description |
|-------|-------------|
| Sky color | Color from above |
| Ground color | Color from below |
| Intensity | Brightness |

## Camera Properties

| Field | Description |
|-------|-------------|
| Type | Perspective or Orthographic |
| FOV | Field of view in degrees (Perspective) or Size (Orthographic) |
| Near clip | Near clipping plane distance |
| Far clip | Far clipping plane distance |
| Zoom | Camera zoom level |
| Controls | Orbit (default), Fly, or Custom |
| Enable zoom | Allow viewer to zoom (for published scenes) |
| Enable pan | Allow viewer to pan |
| Enable rotate | Allow viewer to orbit/rotate |
| Damping | Smoothness of camera movement for published interactions |

## Events / Interactions Section

Appears on all objects. Shows a list of attached events:

```
┌─ Events ──────────────────────────────────────────────┐
│                                                        │
│ ▾ Mouse Hover                                          │
│   Type: [Mouse Hover ▾]                                │
│   Action: [Move To ▾]                                  │
│   Target: [Self ▾]                                     │
│   Position: X [0] Y [5] Z [0]                          │
│   Duration: [0.3s]                                     │
│   Easing: [Ease Out ▾]                                 │
│                                                        │
│ ▾ Mouse Click                                          │
│   Type: [Mouse Down ▾]                                 │
│   Action: [Change State ▾]                             │
│   State: [Active ▾]                                    │
│                                                        │
│ [+ Add Event]                                          │
└────────────────────────────────────────────────────────┘
```

### Event Configuration

| Field | Description |
|-------|-------------|
| Type | The trigger: Mouse Hover, Mouse Down, Mouse Up, Scroll, Key Down, Key Up, Start, Look At, Follow |
| Action | What happens: Move To, Rotate, Scale, Change Material, Toggle, Open URL, Play Animation, Play Sound, Show/Hide, Change State |
| Target | Which object is affected: Self, Another Object (select from scene), All in Group |
| Duration | Animation duration in seconds |
| Easing | Animation curve: Linear, Ease In, Ease Out, Ease In-Out, Bounce, Elastic, Back, Custom |
| Delay | Time before the action starts |

## States Section

Below Events, the States section defines object states:

```
┌─ States ──────────────────────────────────────────────┐
│ [Default] [Hover] [Active] [+ New State]               │
│                                                        │
│ Currently editing: Hover                               │
│ (Properties below reflect the Hover state values)      │
└────────────────────────────────────────────────────────┘
```

When you select a state tab:
- The Properties panel shows the property values **for that state**
- Modify Transform, Material, or other properties to define what the object looks like in that state
- Transitions between states are animated with the configured easing and duration

## Physics Section (when physics is enabled)

| Field | Description |
|-------|-------------|
| Enable physics | Toggle physics on this object |
| Mass | Object weight (affects gravity and collisions) |
| Friction | Surface friction (0 = ice, 1 = rubber) |
| Restitution | Bounciness (0 = no bounce, 1 = perfect bounce) |
| Fixed | Toggle: if true, the object doesn't move (acts as a wall/floor) |
| Collider type | Box, Sphere, or Mesh (for complex shapes) |

## Clipping Section (Clipping Mask objects)

| Field | Description |
|-------|-------------|
| Shape | The clipping shape (Rectangle, Ellipse, Custom) |
| Size | Width and height of the clipping region |
| Corner radius | Rounded corners (Rectangle only) |
| Invert | Clip inside (default) or outside the shape |

## Group Properties

When a group is selected:

| Section | Fields |
|---------|--------|
| Transform | Position, Rotation, Scale of the group (applies to all children) |
| Material (optional) | If applied, overrides material on all children |
| Events | Events on the group trigger for any child interaction |

## Component Instance Properties

When a component instance is selected:

| Section | Fields |
|---------|--------|
| Component header | Name, link to main component |
| Transform | Position, Rotation, Scale (always overridable) |
| Overridable properties | Properties exposed by the main component definition |
| Detach | Button to convert the instance to a standalone object |
| Go to Main | Button to navigate to and select the main component |

## Multi-Selection Properties

When multiple objects are selected:

- Transform shows mixed values as "—" for differing fields
- Setting a value applies it to all selected objects
- Material section shows only properties shared by all selected object types
- If all selected objects share the same material type, its fields are editable in batch

## Property Panel Interactions

| Action | Result |
|--------|--------|
| Click a numeric field | Select for keyboard input |
| Tab | Next field |
| Drag on a field label | Scrub the value |
| Click a color swatch | Open the color picker |
| Click a dropdown | Open the selection menu |
| Click a toggle/checkbox | Toggle the value |
| Drag a slider | Adjust the value |
| Click the section header | Collapse/expand that section |
| Right-click a field | Reset to default |

## Flight Adaptation Notes

Apply [the Spline-inspired schema-driven material, environment, state, and physics contract](./spline-implementation-contract.md).

- Transform, primitive, material, light, camera, physics, and interaction sections derive from typed shared/upstream schemas.
- Drafts, label scrubs, sliders, gradients, and complex controls preview safely and commit one command or cancel exactly.
- Parent/local/world coordinate semantics and mixed/partial applicability are always explicit.
- Shared material/texture references differ from inline values; reset uses schema defaults and is undoable.
- State property sets and interaction targets use stable identities with validation; active state is runtime state.
- Unsupported renderer/physics properties explain why they are unavailable and never silently no-op.
