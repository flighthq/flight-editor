# Unity Scene View — Panels

Authoritative reference for the Unity Editor panels (Unity 2022 LTS / Unity 6) as they relate to scene layout and object arrangement. Each panel's position, contents, and interactions relevant to spatial arrangement are documented.

## Panel System

Unity uses a flexible docking system. Panels can be:
- **Tabbed** — multiple panels share the same area, switchable via tabs
- **Docked** — snapped to edges or split areas of the workspace
- **Floated** — detached windows
- **Maximized** — Shift+Space toggles a panel to fill the full editor window

Panels can be opened from the Window menu. Custom arrangements can be saved as named layouts.

## Scene View

**Default position:** Center of the workspace (largest area).
**Multiple instances:** You can open multiple Scene Views (Window > General > Scene) for simultaneous angles.

### Scene View Toolbar (Header)

| Element | Description |
|---------|-------------|
| Tab name | "Scene" — click to focus; right-click for tab options |
| Draw Mode dropdown | Default is "Shaded"; other modes: Wireframe, Shaded Wireframe, Shadow Cascades, Overdraw, Mipmaps |
| 2D toggle | Switch between 3D perspective and 2D orthographic top-down |
| Lighting toggle | Toggle scene lighting preview |
| Audio toggle | Toggle audio preview |
| Effects toggle | Toggle visual effects (fog, skybox, particles) |
| Search field (🔍) | Filter visible objects by name; matched objects are highlighted, others dimmed |
| Gizmos dropdown | Per-component gizmo visibility: Camera, Light, Collider, AudioSource icons; 3D Icons toggle; Icon Size slider; Selection Outline; Selection Wire; Fade Gizmos |
| Grid toggle | Show/hide the world grid plane |
| Snap toggle | Enable/disable grid snapping |

### Scene View Draw Modes

| Mode | What It Shows |
|------|---------------|
| Shaded | Full materials and lighting (default) |
| Wireframe | Mesh wireframes only, no shading |
| Shaded Wireframe | Materials + wireframe overlay |
| Shadow Cascades | Color-coded shadow cascade regions |
| Render Paths | Color-coded by rendering path (Forward, Deferred) |
| Alpha Channel | Alpha channel as grayscale |
| Overdraw | Heat map of pixel overdraw (red = more overdraw) |
| Mipmaps | Color-coded mipmap level usage |
| Sprite Mask | Sprite mask interaction visualization |
| Texture Streaming | Streaming mipmap status |

### Scene View Overlays (Unity 2022+)

Small, draggable toolbar panels within the Scene View:

| Overlay | Contents |
|---------|----------|
| Tool Settings | Context-sensitive options for the active tool |
| Grid and Snap | Quick grid size and snap toggles |
| Orientation | Scene Gizmo cube |
| Search | Object search within the Scene View |
| Camera | Scene View camera speed, field of view, near/far clip, dynamic clipping |

### Scene View Camera Settings (☰ menu or Camera overlay)

| Setting | Description |
|---------|-------------|
| Camera Speed | Movement speed during fly-through (right-click + WASD) |
| Camera Speed Range | Min/Max fly speed when scrolling to adjust |
| Field of View | Scene View camera FOV (does not affect in-game cameras) |
| Dynamic Clipping | Auto-adjusts near/far clip planes to avoid z-fighting |
| Near Clip | Manual near clipping plane |
| Far Clip | Manual far clipping plane |
| Camera Easing | Smooth acceleration/deceleration for scene camera movement |
| Camera Acceleration | Enable momentum-based camera movement |

## Game View

**Default position:** Tabbed with Scene View (center), or split to the right.
**Purpose:** Shows what the in-game camera sees at runtime resolution.

| Element | Description |
|---------|-------------|
| Aspect ratio dropdown | Free Aspect, 16:9, 16:10, 4:3, specific device resolutions |
| Scale slider | Zoom the game view (1x = actual resolution) |
| Maximize on Play | Toggle: Game View fills the editor when entering Play Mode |
| Mute Audio | Toggle audio output during play |
| Stats | Toggle overlay showing FPS, draw calls, triangle count, etc. |
| Gizmos | Toggle gizmo rendering in the Game View |

For layout, the Game View is essential for previewing how the player will see the scene (camera framing, aspect ratio, resolution).

## Hierarchy Panel

**Default position:** Left side of the workspace.
**Full detail in:** `unity-scene-layout.md`

### Summary

- Tree view of all GameObjects in the loaded scene(s)
- Multi-scene support: multiple scenes listed with separate root-level sections
- Search bar with type filtering (t:Component, l:Layer)
- Drag-and-drop reparenting and reordering
- Right-click context menu for creation, clipboard, prefab operations

### Key Elements

| Element | Description |
|---------|-------------|
| Scene header | Shows scene name; right-click for scene operations (Save, Unload, Remove) |
| Search bar | Filter by name, component type (t:), or layer (l:) |
| Expand triangles (▸/▾) | Expand/collapse child objects |
| Object rows | Click to select, double-click to frame in Scene View, drag to reparent |
| Visibility eye icon (on hover) | Toggle object visibility in the Scene View |
| Lock icon (on hover) | Toggle object selection lock |
| Multi-scene separators | Dividing lines between loaded scenes |

## Inspector Panel

**Default position:** Right side of the workspace.
**Full detail in:** `unity-scene-inspector.md`

### Summary

Shows all components attached to the selected GameObject. For layout:

| Section | Description |
|---------|-------------|
| GameObject header | Name, Tag, Layer, Static flags, Active toggle, Icon selector |
| Transform | Position (X/Y/Z), Rotation (X/Y/Z), Scale (X/Y/Z) — local space for children, world space for roots |
| Components | Renderer, Collider, Camera, Light, Script — each with foldout fields |
| Add Component button | Searchable component browser |
| Prefab section (if applicable) | Open, Select, Overrides buttons |

### Lock Behavior

The lock icon (🔒) in the Inspector tab keeps it focused on the current object while you click on other things. Essential for:
- Dragging references from one object to another
- Comparing one object's settings while selecting others
- Opening a second Inspector (Window > General > Inspector) to view two objects side-by-side

## Project Panel (Asset Browser)

**Default position:** Bottom of the workspace, spanning the full width.

### Layout

```
┌─ Project ────────────────────────────────────────────────────┐
│ [🔍 Search___________]  [Type▾] [Label▾]                     │
├────────────────┬─────────────────────────────────────────────┤
│ Favorites      │ Assets/Models/                               │
│ Assets/        │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│  ├ Materials/  │ │📦  │ │📦  │ │📦  │ │🖼️  │ │📄  │        │
│  ├ Models/     │ │Car │ │Tree│ │Rock│ │Wood│ │Cfg │        │
│  ├ Prefabs/    │ └────┘ └────┘ └────┘ └────┘ └────┘        │
│  ├ Scenes/     │                                             │
│  ├ Scripts/    │                                             │
│  └ Textures/   │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

### Elements

| Element | Description |
|---------|-------------|
| Folder tree (left) | Navigate the Assets directory structure |
| Asset grid/list (right) | Thumbnails or list view of assets in the selected folder |
| Search field | Filter assets by name; supports type filters (t:Prefab, t:Material) |
| Type filter | Filter by asset type |
| Label filter | Filter by assigned labels |
| Icon size slider (bottom-right) | Adjust thumbnail size; smallest = list view |
| Favorites | Pinned folders/searches for quick access |

### Layout-Relevant Interactions

| Action | Result |
|--------|--------|
| Drag a Prefab to Scene View | Instantiate at the drop point |
| Drag a Prefab to Hierarchy | Instantiate at the origin (or as child if dropped on an object) |
| Drag a Model (FBX/OBJ) to Scene View | Instantiate in the scene |
| Drag a Material to an object in Scene View | Apply the material |
| Drag a Texture to a material field in Inspector | Assign the texture |
| Double-click a Scene | Open it |
| Double-click a Prefab | Enter Prefab editing mode |

## Console Panel

**Default position:** Tabbed with the Project panel (bottom).

| Element | Description |
|---------|-------------|
| Clear | Clear all messages |
| Collapse | Group identical messages with a count |
| Clear on Play | Auto-clear when entering Play Mode |
| Error Pause | Pause Play Mode on error |
| Filter buttons (Log, Warning, Error) | Toggle visibility of message types |

For layout, the Console is relevant for catching transform-related warnings (e.g., NaN transforms, scale issues, missing references).

## Animation Panel

**Default position:** Not shown by default; open from Window > Animation (Ctrl+6).

| Element | Description |
|---------|-------------|
| Dopesheet/Curves toggle | Switch between keyframe bar and curve graph views |
| Property list | Animated properties (Position, Rotation, Scale, etc.) |
| Timeline | Frame-by-frame keyframe editing |
| Record button (red circle) | Record mode — changes in the Scene View are captured as keyframes |

For layout: Record mode lets you pose objects in the Scene View and the animation system captures the transforms as keyframes. This is the bridge between spatial arrangement and animation.

## Animator Panel

**Default position:** Not shown by default; open from Window > Animation > Animator.

Shows the Animator Controller state machine as a node graph. Not directly related to spatial layout, but determines which animation clips play (and thus which transforms are applied).

## Lighting Panel

**Default position:** Not shown by default; open from Window > Rendering > Lighting.

| Tab | Contents |
|-----|----------|
| Scene | Skybox material, Environment Lighting (ambient), Environment Reflections, Fog settings |
| Baked Lightmaps | Lightmap resolution, padding, bake settings |
| Realtime Lightmaps | Realtime GI settings |
| Light Explorer | Tabular list of all lights: Type, Color, Intensity, Range, Shadows — sortable and editable |

For layout: the Lighting panel controls the overall scene atmosphere (ambient light, fog density, skybox) and the Light Explorer provides a flat list of every light for batch inspection.

## Light Explorer

A table view of all lights in the scene:

| Column | Description |
|--------|-------------|
| Enabled | Toggle the light on/off |
| Name | Light's GameObject name |
| Type | Directional, Point, Spot, Area |
| Mode | Realtime, Mixed, Baked |
| Color | Light color (click to open Color Picker) |
| Intensity | Brightness value |
| Shadow Type | None, Hard, Soft |

Clicking a light row selects it in the Hierarchy and frames it in the Scene View.

## Physics Debugger

**Default position:** Not shown by default; open from Window > Analysis > Physics Debugger.

Shows collider wireframes, contact points, joints, and rigidbody states overlaid on the Scene View. Useful for verifying that collision volumes match the visual layout.

## Navigation / NavMesh Panel

**Default position:** Not shown by default; open from Window > AI > Navigation.

| Tab | Contents |
|-----|----------|
| Agents | Navigation agent parameters (radius, height, step height, max slope) |
| Areas | Named navigation area types with cost |
| Bake | NavMesh bake settings and button |
| Object | Per-object navigation area assignment |

For layout: determines where AI agents can walk, which informs floor and obstacle placement.

## Occlusion Culling Panel

**Default position:** Not shown by default; open from Window > Rendering > Occlusion Culling.

Configures which objects are hidden when occluded by others (an optimization for complex scenes). Affects layout decisions for large environments: if walls fully occlude rooms, content behind them is not rendered.

## Profiler

**Default position:** Not shown by default; open from Window > Analysis > Profiler (Ctrl+7).

Monitors frame time, CPU/GPU usage, memory, draw calls, triangles, etc. For layout, the Rendering section shows whether the current scene arrangement is performant (triangle count, draw call batching, overdraw).

## Frame Debugger

**Default position:** Not shown by default; open from Window > Analysis > Frame Debugger.

Steps through every draw call in a frame. Shows exactly what each call renders, helping identify layout issues (objects rendering in the wrong order, z-fighting, incorrect material assignments).

## Package Manager

**Default position:** Floating window; open from Window > Package Manager.

Install, update, and remove packages. For layout tools:
- **ProBuilder** — in-editor mesh modeling
- **ProGrids** — enhanced grid snapping
- **Polybrush** — paint and sculpt meshes in the Scene View
- **Cinemachine** — advanced camera systems for framing and following
- **Timeline** — sequencing and cinematic layout

## Preset Manager

**Default position:** Floating window; open from Edit > Project Settings > Preset Manager.

Set default values for new components. For layout: ensures new Lights, Cameras, or Renderers are created with your preferred defaults rather than Unity's.

## Flight Adaptation Notes

Apply [the Unity-inspired panel, runtime, asset, and component contract](./unity-scene-implementation-contract.md).

- Only Scene, Hierarchy, Inspector, and supported project/preview surfaces are baseline; specialized panels require real domain models.
- Console, profiler, debugger, frame debugger, physics, navigation, lighting, animation, and package panels subscribe through explicit capabilities and dispose cleanly.
- Project/asset presentation may be native to the host while placement, references, import diagnostics, and commands remain shared.
- Game/Preview runs an isolated revision and never silently commits runtime changes.
- Panel locks, filters, draw modes, overlays, and camera settings are session/workspace state.
- Test missing capability, stale runtime, failed asset, read-only, empty, loading, and disconnected panel states.
