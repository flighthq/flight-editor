# Unity Scene View — Workspace Layout

Authoritative reference for the Unity Editor workspace as it relates to 3D scene layout and object arrangement (Unity 2022 LTS / Unity 6). This document covers only the scene-arrangement UX — not scripting, physics, animation, or play mode.

## Top-Level Frame

The Unity Editor uses a flexible docking panel system. The default layout contains:

1. **Menu Bar** — File, Edit, Assets, GameObject, Component, Window, Help
2. **Toolbar** — transform tools, pivot/space toggles, play controls, layout selector
3. **Work Area** — configurable panel layout:
   - **Scene View** — 3D viewport for arranging objects (center)
   - **Game View** — runtime camera preview (tabbed with Scene, or separate)
   - **Hierarchy** — scene object tree (left)
   - **Inspector** — property editor for the selected object (right)
   - **Project** — asset browser (bottom)
   - **Console** — log output (bottom, tabbed with Project)

## Toolbar

Spans the full width below the menu bar.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [Q][W][E][R][T][Y]  [Center|Pivot] [Global|Local]  [▶ ⏸ ⏭]  [Layers▾] [Layout▾]       │
│  Hand/Move/Rot/Scl/  Pivot mode     Coordinate      Play        Layer     Layout         │
│  Rect/Transform      toggle         space toggle     controls    filter    presets        │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Elements (left to right)

| Element | Description |
|---------|-------------|
| **Transform tools** (Q/W/E/R/T/Y) | Six tool buttons — Hand, Move, Rotate, Scale, Rect, Transform |
| **Pivot / Center toggle** | Switch between Pivot (use object's pivot point) and Center (use bounding box center) as the gizmo position |
| **Global / Local toggle** | Switch between Global (world axes) and Local (object-local axes) for the gizmo orientation |
| **Play / Pause / Step** | Enter/exit Play Mode (not relevant to layout, but always visible) |
| **Layers dropdown** | Filter which layers are visible in the Scene View |
| **Layout dropdown** | Switch between saved window layouts (Default, 2 by 3, 4 Split, Tall, Wide, etc.) |

### Pivot vs Center

| Mode | Gizmo Position | Use Case |
|------|---------------|----------|
| **Pivot** | At the object's defined pivot/origin point | Precise transforms around the authored origin |
| **Center** | At the center of the selection's bounding box | Transforming from the visual center, especially for multi-selection |

### Global vs Local

| Mode | Gizmo Orientation | Use Case |
|------|-------------------|----------|
| **Global** | Aligned to world X/Y/Z axes | Moving along world-space directions (always consistent) |
| **Local** | Aligned to the object's own rotation | Moving "forward" relative to a rotated object |

## Scene View

The Scene View is the primary 3D viewport for arranging objects. It shows the scene from an editable camera angle (independent of any in-scene Camera).

### Scene View Elements

```
┌───────────────────────────────────────────────────────────────┐
│ [Scene] [Game] [+]                              [🔍][fx][☰]  │
├───────────────────────────────────────────────────────────┬───┤
│                                                           │ Y │
│                                                           │ ╱ │
│              3D Viewport                                  │╱──│→ X
│                                                           │ Z │
│       ┌─ Grid ─────────────────────────────────┐         │   │
│       │                                         │         │   │
│       │     [selected object with gizmo]        │         │   │
│       │              ↕ ↔                        │         │   │
│       │                                         │         │   │
│       └─────────────────────────────────────────┘         │   │
│                                                           │   │
├───────────────────────────────────────────────────────────┴───┤
│ [2D] [Lighting] [Audio] [Effects] [Gizmos▾]   [Grid][Snap]   │
└───────────────────────────────────────────────────────────────┘
```

### Scene View Header (tab bar)

| Element | Description |
|---------|-------------|
| Tab name | "Scene" — click to focus; can have multiple Scene Views |
| Search field (🔍) | Filter visible objects by name |
| Effects (fx) | Toggle post-processing effects in the editor view |
| Menu (☰) | Scene View settings (camera speed, field of view, dynamic clipping, etc.) |

### Scene View Footer (overlay toolbar)

| Element | Description |
|---------|-------------|
| **2D toggle** | Switch between 3D perspective and 2D orthographic top-down view |
| **Lighting toggle** | Toggle scene lighting in the viewport (on = lit, off = unlit/flat) |
| **Audio toggle** | Toggle audio preview |
| **Effects toggle** | Toggle visual effects (fog, skybox, particles) |
| **Gizmos dropdown** | Show/hide gizmo icons per component type (cameras, lights, colliders, etc.) |
| **Grid toggle** | Show/hide the world grid plane |
| **Snap toggle** | Enable/disable grid snapping |

### Scene Gizmo (orientation cube, top-right corner)

A 3D orientation indicator in the top-right corner of the Scene View:

```
        Y
        │
        │   
    ────┼──── X
       ╱
      Z
```

| Action | Result |
|--------|--------|
| Click an axis label (X, Y, Z) | Snap the view to that axis-aligned orthographic view (Front, Right, Top, etc.) |
| Click the cube center | Toggle between perspective and isometric (orthographic) projection |
| Click a corner/edge of the cube | Snap to that diagonal view |
| Drag the gizmo | Orbit the view |
| Shift+click axis | Snap to the opposite axis view (e.g., Shift+click Y → look from below) |

The cube faces are labeled: Front/Back, Right/Left, Top/Bottom.

### Perspective vs Orthographic

| Mode | Description |
|------|-------------|
| **Perspective** | Objects appear smaller with distance; natural 3D depth |
| **Orthographic (Isometric)** | No perspective foreshortening; parallel projection; useful for precise alignment |

Toggle by clicking the center of the Scene Gizmo or pressing Numpad 5.

## Scene View Navigation

| Action | Result |
|--------|--------|
| Alt+left-click drag | **Orbit** around the current pivot point |
| Alt+right-click drag | **Zoom** (dolly) in/out |
| Scroll wheel | **Zoom** in/out |
| Alt+middle-click drag | **Pan** the view |
| Middle-click drag | **Pan** the view |
| Right-click+WASD/QE | **Fly** through the scene (FPS-style); QE for up/down; Shift = faster; scroll = speed adjust |
| F | **Frame** the selected object (center and zoom to fit) |
| Shift+F | **Lock view** to the selected object (follow it as it moves) |
| Numpad 0 | Align Scene camera to the selected Camera object's view |

### Fly-Through Speed

While holding right-click in fly mode, the mouse scroll wheel adjusts movement speed. The speed is retained per Scene View.

## Hierarchy Panel

**Default position:** Left side of the workspace.

Shows every GameObject in the loaded scene(s) as a tree:

```
┌─ Hierarchy ──────────────────────────┐
│ 🔍 Search                            │
│                                       │
│ ▾ 📦 SampleScene                     │
│   ├ Main Camera                      │
│   ├ Directional Light                │
│   ├ ▾ Environment                    │
│   │   ├ Ground Plane                 │
│   │   ├ Building_A                   │
│   │   └ Building_B                   │
│   ├ ▾ Characters                     │
│   │   ├ Player                       │
│   │   └ NPC_Guard                    │
│   └ ▾ UI Canvas                     │
│       └ HUD                          │
│                                       │
│ ▾ 📦 LightingScene (additive)       │
│   └ Post Processing Volume           │
└───────────────────────────────────────┘
```

### Hierarchy Interactions

| Action | Result |
|--------|--------|
| Click an object | Select it; gizmo appears in Scene View; Inspector shows its properties |
| Shift+click | Range select |
| Ctrl+click | Toggle in/out of selection |
| Drag object up/down | Reorder within the same parent (affects rendering order for some systems) |
| Drag object onto another | Parent the dragged object to the target (becomes a child) |
| Drag object to empty space | Unparent (move to scene root) |
| Double-click | Frame the object in the Scene View (same as selecting + F) |
| F2 / slow double-click | Rename |
| Right-click | Context menu |
| Alt+click collapse triangle | Collapse/expand all children recursively |
| Delete | Delete the selected GameObjects |

### Hierarchy Context Menu

- Copy / Paste / Paste as Child
- Rename
- Duplicate (Ctrl+D)
- Delete
- ─
- Select Children / Select Prefab Root
- ─
- Create Empty (Ctrl+Shift+N)
- Create Empty Child
- 3D Object ▸ (Cube, Sphere, Capsule, Cylinder, Plane, Quad, etc.)
- 2D Object ▸
- Effects ▸ (Particle System, Trail, Line)
- Light ▸ (Directional, Point, Spot, Area)
- Audio ▸
- Video ▸
- UI ▸ (Canvas, Panel, Button, Text, Image, etc.)
- Camera
- ─
- Move to View (Ctrl+Alt+F — place object at the Scene camera position)
- Align with View (Ctrl+Shift+F — match object's transform to the Scene camera)
- Align View to Selected (match Scene camera to the object's position/rotation)
- ─
- Prefab ▸ (Unpack, Open, Select in Project, Overrides)
- ─
- Properties... (open dedicated properties window)

### Search

The search bar at the top filters the Hierarchy by name. Type "t:Light" to filter by component type, or "l:LayerName" to filter by layer.

## Inspector Panel

**Default position:** Right side of the workspace.

Shows all components attached to the selected GameObject. For layout purposes, the key component is **Transform**. Full detail in `unity-scene-inspector.md`.

## Project Panel

**Default position:** Bottom of the workspace.

The asset browser — shows all files in the project (models, textures, prefabs, scenes, scripts, etc.). For layout:

- **Drag a Prefab from Project to Hierarchy or Scene View** to instantiate it in the scene
- **Drag a model asset (FBX, OBJ)** to place it in the scene
- **Drag a material onto an object in the Scene View** to assign it

## Grid

The Scene View shows an infinite grid on the XZ plane (horizontal ground) by default:

| Setting | Description |
|---------|-------------|
| Grid visibility | Toggle via the Grid button in the Scene View footer |
| Grid size | Configurable in the Grid and Snap Settings window (Edit > Grid and Snap Settings) |
| Grid opacity | Adjustable in Grid and Snap Settings |
| Grid axis | Default XZ; can be changed to XY or YZ |
| Move to grid | Snap selected objects to the grid plane |

### Grid and Snap Settings (Edit > Grid and Snap Settings)

| Section | Fields |
|---------|--------|
| **Grid** | Grid size (X, Y, Z), Grid Axis (XZ/XY/YZ), Opacity |
| **Increment Snap** | Move (X, Y, Z increments), Rotate (degrees), Scale (increment) |
| **Grid Snap** | Toggle grid snapping; aligns to world grid intersections |

## Coordinate Spaces

Unity uses a left-handed coordinate system:

| Axis | Direction | Color |
|------|-----------|-------|
| X | Right (red) | Red |
| Y | Up (green) | Green |
| Z | Forward (blue) | Blue |

All gizmo handles are color-coded to match these axis colors.

## Workspace Layout Presets

| Layout | Description |
|--------|-------------|
| Default | Scene and Game Views tabbed (center), Hierarchy (left), Inspector (right), Project + Console (bottom) |
| 2 by 3 | Scene (left), Game (right), plus panels |
| 4 Split | Four Scene Views showing top, front, right, and perspective simultaneously |
| Tall | Taller Scene View for vertical work |
| Wide | Wider Scene View for horizontal work |
| Custom | Save any arrangement as a named layout |

Panels can be dragged, docked, tabbed, and floated. Save custom layouts via Window > Layouts > Save Layout.
