# Unity Scene View — Inspector Panel

Authoritative reference for the Unity Inspector panel as it relates to 3D scene layout and object arrangement.

## Panel Position

**Default position:** Docked on the right side of the workspace.
**Lock:** Click the lock icon (🔒) in the Inspector tab to keep it showing the current object while you select others. A second Inspector can be opened from Window > General > Inspector to view two objects simultaneously.

## Inspector Structure

The Inspector shows the selected GameObject's name, tag, layer, and all attached components. For layout, the essential component is **Transform**.

### GameObject Header

```
┌─────────────────────────────────────────────────────────────────┐
│ ☑ [Icon] [Name_______________]  [Static ▾]                     │
│ Tag: [Untagged ▾]   Layer: [Default ▾]                          │
└─────────────────────────────────────────────────────────────────┘
```

| Field | Type | Description |
|-------|------|-------------|
| Checkbox (☑) | Toggle | Enable/disable the GameObject (disabled objects are invisible and inactive) |
| Icon | Clickable | Assign a label icon (colored dot or custom) for visibility in the Scene View |
| Name | Text input | GameObject name (shown in Hierarchy) |
| Static dropdown | Multi-flag dropdown | Flags for batching, navigation, lighting, etc. (affects optimization, not visual layout) |
| Tag | Dropdown | Assign a tag (Player, MainCamera, custom tags) |
| Layer | Dropdown | Assign a layer (Default, UI, custom layers) — affects visibility filtering and physics |

## Transform Component

Every GameObject has a Transform (or RectTransform for UI). It is always the first component shown and cannot be removed.

### Transform Fields

```
┌─ Transform ─────────────────────────────────────────────────────┐
│ Position    X [_0_____]  Y [_0_____]  Z [_0_____]              │
│ Rotation    X [_0_____]  Y [_0_____]  Z [_0_____]              │
│ Scale       X [_1_____]  Y [_1_____]  Z [_1_____]              │
│                                                    [⋮] (reset)  │
└─────────────────────────────────────────────────────────────────┘
```

| Field | Units | Description |
|-------|-------|-------------|
| **Position X** | World units (meters by convention) | Horizontal position |
| **Position Y** | World units | Vertical position (up) |
| **Position Z** | World units | Depth position (forward) |
| **Rotation X** | Degrees (0–360) | Pitch (tilt forward/back) |
| **Rotation Y** | Degrees | Yaw (turn left/right) |
| **Rotation Z** | Degrees | Roll (twist) |
| **Scale X** | Multiplier (1 = original) | Horizontal scale |
| **Scale Y** | Multiplier | Vertical scale |
| **Scale Z** | Multiplier | Depth scale |

### Transform Coordinate Space

| Selection | Position Shows | Rotation Shows |
|-----------|---------------|----------------|
| Root object (no parent) | World-space position | World-space Euler angles |
| Child object | **Local-space** position relative to parent | **Local-space** Euler angles relative to parent |

This is important: a child object's Transform values are **relative to its parent**, not the world. Moving the parent moves all children with it without changing their local transform values.

### Transform Interactions

| Action | Result |
|--------|--------|
| Click a numeric field | Select for keyboard input |
| Tab | Move to the next field |
| Enter | Apply the typed value |
| Click and drag on the field label ("X", "Y", "Z") | **Scrub** the value — drag left/right to decrease/increase |
| Alt+click and drag label | Scrub more slowly (fine adjustment) |
| Right-click field label | Context menu: Reset, Copy, Paste, Copy Component, Paste Component Values |
| Click the ⋮ menu | Reset Position / Rotation / Scale to identity (0,0,0 / 0,0,0 / 1,1,1) |
| Ctrl+click label (e.g., "Position") | Collapse/expand that row |
| Type math expressions | Fields accept arithmetic: "5+3" → 8, "90/2" → 45, "*2" → double current value |

### Reset Transform

Right-click the Transform header or click the ⋮ menu:
- **Reset** — sets Position to (0,0,0), Rotation to (0,0,0), Scale to (1,1,1)
- **Reset Position** — only resets position
- **Reset Rotation** — only resets rotation
- **Reset Scale** — only resets scale
- **Copy Component** — copy all transform values
- **Paste Component Values** — paste transform values onto this object

### Multi-Object Editing

When multiple GameObjects are selected:

- Fields that share the same value display that value
- Fields that differ display "—" (dash/mixed indicator)
- Typing a new value in a mixed field applies it to **all** selected objects
- Scrubbing a mixed field adjusts all objects by the same delta
- The Transform shows the **last-selected** object's values when in Pivot mode
- In Center mode, Position shows the combined bounding center

## RectTransform Component (UI Objects)

UI elements (Canvas children) use RectTransform instead of Transform:

### RectTransform Fields

| Field | Description |
|-------|-------------|
| Anchors (visual preset selector) | Nine-point anchor presets + stretch options; determines how the element repositions when its parent resizes |
| Pos X / Pos Y / Pos Z | Position relative to the anchor point |
| Width / Height | Element dimensions (or Left/Right/Top/Bottom offsets when stretching) |
| Pivot X / Pivot Y | The point around which the element rotates and scales (0,0 = bottom-left, 0.5,0.5 = center, 1,1 = top-right) |
| Rotation | Same as Transform |
| Scale | Same as Transform |

### Anchor Presets

A clickable grid in the Inspector showing common anchor configurations:

```
┌─────────────────────────────────┐
│ ┌───┬───┬───┬───┐              │
│ │TL │TC │TR │T─ │  Top row     │
│ ├───┼───┼───┼───┤              │
│ │ML │MC │MR │M─ │  Middle row  │
│ ├───┼───┼───┼───┤              │
│ │BL │BC │BR │B─ │  Bottom row  │
│ ├───┼───┼───┼───┤              │
│ │ │L│ │C│ │R│ ─ │  Stretch row │
│ └───┴───┴───┴───┘              │
└─────────────────────────────────┘
```

| Position | Meaning |
|----------|---------|
| TL/TC/TR/etc. | Anchor to that corner/edge — position is offset from there |
| T─, M─, B─ | Stretch horizontally (anchored to top/middle/bottom) |
| │L, │C, │R | Stretch vertically (anchored to left/center/right) |
| ─ (bottom-right) | Stretch in both directions (fills parent, with margin offsets) |

Hold **Alt** when clicking a preset to also set the position. Hold **Shift** to also set the pivot.

## Layout-Relevant Components

Beyond Transform, these components affect spatial arrangement:

### Renderer Components (visual representation)

| Component | Purpose |
|-----------|---------|
| MeshRenderer | Renders a 3D mesh with materials |
| SkinnedMeshRenderer | Renders an animated/deformable mesh |
| SpriteRenderer | Renders a 2D sprite in 3D space |
| LineRenderer | Renders a line between points |
| TrailRenderer | Renders a trail following movement |

The Inspector shows:
- Materials list (drag materials to assign)
- Bounds display
- Shadow casting/receiving
- Sorting layer/order (for rendering order)

### Light Components

| Field | Description |
|-------|-------------|
| Type | Directional, Point, Spot, Area |
| Color | Light color |
| Intensity | Brightness |
| Range | Distance the light reaches (Point, Spot) |
| Spot Angle | Cone angle (Spot) |
| Shadow Type | None, Hard, Soft |

Light gizmos in the Scene View update in real time as you adjust these values.

### Camera Component

| Field | Description |
|-------|-------------|
| Clear Flags | How the camera clears the background (Skybox, Solid Color, Depth Only, Don't Clear) |
| Background | Background color (if Solid Color) |
| Projection | Perspective or Orthographic |
| Field of View | Vertical FOV in degrees (Perspective) or Size (Orthographic) |
| Clipping Planes | Near and Far — objects outside this range are not rendered |
| Viewport Rect | X, Y, W, H — portion of the screen this camera renders to (for split-screen, mini-maps) |
| Depth | Rendering order relative to other cameras |

The Camera's frustum gizmo in the Scene View is extremely useful for layout — it shows exactly what the player will see.

## Prefab Instance Overrides

When the selected object is a Prefab instance:

| Element | Description |
|---------|-------------|
| Prefab header bar (blue) | Shows "Prefab" label with Open / Select / Overrides buttons |
| Open button | Enter Prefab editing mode (isolated context) |
| Select button | Highlight the Prefab asset in the Project panel |
| Overrides dropdown | List all property overrides vs the Prefab source; Apply/Revert individual or all overrides |
| Blue margin line | Modified components/fields show a blue left-margin indicator |

For layout: overriding a Prefab instance's Transform is the most common override — you place instances around the scene at different positions while sharing the same visual/structural definition.

## Inspector Behavior Notes

- **Undo**: Ctrl+Z undoes Inspector changes (same undo stack as Scene View manipulations)
- **Multi-edit**: when multiple objects are selected, Inspector shows shared components and allows batch editing
- **Lock Inspector**: click the lock icon to freeze the Inspector on the current object while selecting others (useful for drag-and-drop assignments)
- **Add Component**: button at the bottom of the Inspector to attach new components to the selected GameObject
- **Debug mode**: click the Inspector tab's ⋮ menu > Debug to show raw serialized values (useful for troubleshooting transform issues)
- **Numeric precision**: Transform fields display to 6 decimal places; higher precision is stored internally
- **Negative scale**: a negative scale value flips/mirrors the object on that axis (e.g., Scale X = -1 mirrors horizontally)

## Flight Adaptation Notes

Apply [the Unity-inspired component and inspector contract](./unity-scene-implementation-contract.md).

- Inspector UI projects shared component schemas and commands; Unity's exact component set is not implied.
- Transform fields use explicit local/world semantics and retain full stored precision through drafts and undo.
- Multi-edit distinguishes mixed, partially applicable, read-only, missing-reference, and layout/runtime-controlled values.
- Inspector lock is session state; add/remove/reset/reorder/enable component actions are document commands.
- Prefab overrides use stable source/property identities and explicit apply/revert commands.
- Raw/debug mode is read-only unless an edit is validated and command-backed.
