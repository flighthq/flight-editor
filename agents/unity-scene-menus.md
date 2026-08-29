# Unity Scene View — System Menus

Authoritative reference for the Unity Editor menu bar (Unity 2022 LTS / Unity 6) as it relates to scene layout, object arrangement, and Scene View configuration. Only layout-relevant items are detailed; scripting, animation, physics, and build menus are summarized.

## Menu Bar

```
File  Edit  Assets  GameObject  Component  Window  Help
```

## File Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| New Scene | Ctrl+N | Create a new empty scene |
| Open Scene | Ctrl+O | Open an existing scene file |
| Save | Ctrl+S | Save the current scene |
| Save As... | Ctrl+Shift+S | Save scene with a new name/path |
| New Project... | | Open Unity Hub to create a new project |
| Open Project... | | Open Unity Hub to open an existing project |
| Save Project | | Save project settings (not the scene) |
| ─ | | |
| Build Settings... | Ctrl+Shift+B | Configure platform build targets |
| Build and Run | Ctrl+B | Build and launch the project |
| ─ | | |
| Exit | Alt+F4 | Close Unity |

## Edit Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Undo | Ctrl+Z | Undo last action (works for Inspector changes, gizmo transforms, hierarchy operations) |
| Redo | Ctrl+Y | Redo last undone action |
| ─ | | |
| Cut | Ctrl+X | Cut selected GameObjects |
| Copy | Ctrl+C | Copy selected GameObjects |
| Paste | Ctrl+V | Paste GameObjects |
| Duplicate | Ctrl+D | Duplicate selected GameObjects in-place |
| Delete | Delete | Delete selected GameObjects |
| ─ | | |
| Select All | Ctrl+A | Select all objects in the scene |
| Deselect All | Ctrl+Shift+A | Clear the selection |
| Select Children | | Select all children of the selected object |
| Select Prefab Root | | Select the root of the Prefab instance |
| Invert Selection | | Select everything not currently selected |
| ─ | | |
| Find | Ctrl+F | Focus the Hierarchy search field |
| ─ | | |
| Frame Selected | F | Frame the selected object in the Scene View |
| Lock View to Selected | Shift+F | Scene View follows the selected object |
| ─ | | |
| Play | Ctrl+P | Enter / exit Play Mode |
| Pause | Ctrl+Shift+P | Pause / resume Play Mode |
| Step | Ctrl+Alt+P | Advance one frame in paused Play Mode |
| ─ | | |
| **Grid and Snap Settings...** | | Open the snap/grid configuration window (see below) |
| ─ | | |
| Project Settings... | | Open Project Settings window |
| Preferences... | | Open Editor Preferences |
| Shortcuts... | | Open the Shortcut Manager (rebind any shortcut) |
| Clear All PlayerPrefs | | Reset all runtime PlayerPrefs |

### Grid and Snap Settings (Edit > Grid and Snap Settings)

Opens a floating window with these sections:

| Section | Fields |
|---------|--------|
| **Grid** | Grid Size (X, Y, Z), Grid Axis (XZ / XY / YZ), Opacity, Color |
| **Increment Snap** | Move (X, Y, Z unit values), Rotate (degrees, default 15°), Scale (increment, default 0.1) |
| **Align Selected** | Move to Grid, Rotate to Grid — snap the current selection to the nearest grid point/angle |
| **Grid Snap** | Enable/disable world-grid snapping |

## Assets Menu

Primarily for asset management. Layout-relevant items:

| Item | Description |
|------|-------------|
| Create ▸ | Create new assets: Material, Shader, Prefab, Scene, Script, etc. |
| Import New Asset... | Import a file (model, texture, audio, etc.) into the project |
| Import Package ▸ | Import Unity packages (.unitypackage) |
| Export Package... | Export selected assets as a package |
| ─ | |
| Refresh | Ctrl+R — Re-scan project folder for changed files |

## GameObject Menu

The primary menu for creating and manipulating scene objects:

### Create Submenus

| Item | Shortcut | Description |
|------|----------|-------------|
| Create Empty | Ctrl+Shift+N | Create an empty GameObject at the origin (or as child if something is selected) |
| Create Empty Child | Alt+Shift+N | Create an empty child of the selected object |
| ─ | | |
| **3D Object ▸** | | |
| Cube | | 1×1×1 unit cube with Box Collider |
| Sphere | | Radius 0.5 sphere with Sphere Collider |
| Capsule | | Height 2, radius 0.5 capsule with Capsule Collider |
| Cylinder | | Height 2, radius 0.5 cylinder with Capsule Collider |
| Plane | | 10×10 unit ground plane (facing Y up) |
| Quad | | 1×1 unit single-face quad (facing Z) |
| Text - TextMeshPro | | 3D text mesh using TextMeshPro |
| ─ | | |
| Ragdoll... | | Configure a ragdoll from an existing skeleton |
| Terrain | | Create a terrain object |
| Tree | | Create a terrain tree |
| Wind Zone | | Create a wind zone for terrain vegetation |
| ─ | | |
| **2D Object ▸** | | |
| Sprites ▸ | | Square, Circle, Capsule, Diamond, Hexagon, Triangle, 9-Slice, Isometric Diamond |
| Sprite Mask | | Mask sprite rendering |
| Tilemap ▸ | | Rectangular, Hexagonal, Isometric tilemaps |
| ─ | | |
| **Effects ▸** | | |
| Particle System | | Create a particle emitter |
| Particle System Force Field | | Wind/force field for particles |
| Trail | | Trail renderer |
| Line | | Line renderer |
| ─ | | |
| **Light ▸** | | |
| Directional Light | | Sun-like light (affects entire scene) |
| Point Light | | Omnidirectional light at a point |
| Spot Light | | Cone-shaped light |
| Area Light | | Rectangle or disc area light (baked only in Built-in RP; real-time in URP/HDRP) |
| Reflection Probe | | Captures cubemap reflections at a point |
| Light Probe Group | | Probes for indirect lighting on dynamic objects |
| ─ | | |
| **Audio ▸** | | |
| Audio Source | | A point that plays audio |
| Audio Reverb Zone | | Spatial reverb volume |
| Audio Listener | | (Usually on the Camera) receives audio |
| ─ | | |
| **Video ▸** | | |
| Video Player | | Play video files on a surface or in the scene |
| ─ | | |
| **UI ▸** | | |
| Canvas | | Root UI container (required for all UI elements) |
| Panel | | Visual panel background |
| Button - TextMeshPro | | Clickable button |
| Text - TextMeshPro | | UI text |
| Image | | UI image |
| Raw Image | | Unprocessed texture display |
| Slider | | Value slider |
| Scrollbar | | Scrollbar control |
| Toggle | | Checkbox |
| Input Field - TextMeshPro | | Text input |
| Dropdown - TextMeshPro | | Dropdown selector |
| Scroll View | | Scrollable container |
| Event System | | Input event routing (auto-created with first UI element) |
| ─ | | |
| Camera | | Create a new Camera |

### Object Operations

| Item | Shortcut | Description |
|------|----------|-------------|
| Center On Children | | Move the object's transform to the center of its children |
| Make Parent | | (Available via drag-and-drop in Hierarchy) |
| Clear Parent | | Unparent the selected object(s) |
| ─ | | |
| Set as first sibling | | Move to the top of the sibling list |
| Set as last sibling | | Move to the bottom of the sibling list |
| Move to View | Ctrl+Alt+F | Place the selected object at the Scene camera's current position |
| Align with View | Ctrl+Shift+F | Match position AND rotation of selected object to the Scene camera |
| Align View to Selected | | Match Scene camera to the selected object's position and rotation |
| Toggle Active State | | Enable/disable the selected GameObjects |

## Component Menu

For attaching components to the selected GameObject. Layout-relevant entries:

| Item | Description |
|------|-------------|
| **Add...** | Search and add any component |
| **Mesh ▸** | Mesh Filter, Mesh Renderer, Skinned Mesh Renderer |
| **Physics ▸** | Rigidbody, Box/Sphere/Capsule/Mesh Collider, Character Controller, Joints |
| **Rendering ▸** | Camera, Light, Light Probe Group, Reflection Probe, Skybox, Sprite Renderer, Trail/Line Renderer, Canvas Renderer |
| **Layout ▸** (UI) | Canvas, Canvas Group, Canvas Scaler, Content Size Fitter, Aspect Ratio Fitter, Horizontal/Vertical Layout Group, Grid Layout Group, Layout Element |

The Add Component button at the bottom of the Inspector provides the same functionality with a searchable dropdown.

## Window Menu

Controls which panels are visible and where they are docked:

| Item | Shortcut | Description |
|------|----------|-------------|
| **General ▸** | | |
| Scene | Ctrl+1 | Open/focus the Scene View |
| Game | Ctrl+2 | Open/focus the Game View |
| Inspector | Ctrl+3 | Open/focus the Inspector |
| Hierarchy | Ctrl+4 | Open/focus the Hierarchy |
| Project | Ctrl+5 | Open/focus the Project browser |
| Console | Ctrl+Shift+C | Open/focus the Console |
| ─ | | |
| **Rendering ▸** | | |
| Lighting | | Lighting Settings window (lightmaps, ambient, fog) |
| Light Explorer | | Tabular view of all lights in the scene |
| Occlusion Culling | | Configure occlusion culling volumes |
| ─ | | |
| **Animation ▸** | | |
| Animation | Ctrl+6 | Animation clip editor |
| Animator | | Animator state machine editor |
| ─ | | |
| **Audio ▸** | | |
| Audio Mixer | Ctrl+8 | Audio mixer groups and effects |
| ─ | | |
| **Analysis ▸** | | |
| Profiler | Ctrl+7 | Performance profiler |
| Frame Debugger | | GPU frame debugger |
| Physics Debugger | | Visualize colliders, contacts, joints |
| ─ | | |
| **Asset Management ▸** | | |
| Addressables ▸ | | Addressable assets system |
| Package Manager | | Install/update packages |
| ─ | | |
| **Layouts ▸** | | |
| Default | | Reset to the default panel layout |
| 2 by 3 | | Two columns, three rows |
| 4 Split | | Four Scene Views (top, front, right, perspective) |
| Tall | | Taller Scene View |
| Wide | | Wider Scene View |
| Save Layout... | | Save current arrangement |
| Delete Layout... | | Remove a saved layout |
| Revert Factory Settings... | | Reset all layouts to factory defaults |

## Help Menu

| Item | Description |
|------|-------------|
| About Unity... | Version and license info |
| Unity Manual | Opens the documentation |
| Scripting Reference | Opens the API documentation |
| Unity Forum | Opens the community forums |
| Report a Bug... | Opens the bug reporter |
| Check for Updates | Check for Unity updates |

## Scene View Context Menus

### Right-Click on Scene View Background

| Item | Description |
|------|-------------|
| Move to View | Ctrl+Alt+F — place selected at the camera position |
| Align with View | Ctrl+Shift+F — match transform to the camera |
| Align View to Selected | Match camera to the object |
| Properties... | Open a floating properties window |

### Right-Click on an Object in Scene View

Same items as above, plus:

| Item | Description |
|------|-------------|
| Select / Deselect | Toggle selection |
| Cut / Copy / Paste | Clipboard operations |
| Duplicate | Create a copy |
| Delete | Remove the object |
| Rename | Enter rename mode |
| Prefab ▸ | Prefab operations (if applicable) |

### Right-Click in Hierarchy Panel

See the detailed list in `unity-scene-layout.md`, Hierarchy Context Menu section.

## Scene View Toolbar (Overlay Toggles in Footer)

Not a menu bar menu, but equivalent in function:

| Button | Description |
|--------|-------------|
| 2D | Toggle 2D mode (orthographic top-down view) |
| Lighting | Toggle scene lighting preview (lit vs. unlit) |
| Audio | Toggle audio preview in editor |
| Effects | Toggle visual effects (fog, skybox, particles) |
| Gizmos ▾ | Dropdown: toggle per-component gizmo visibility, 3D icons, icon size, selection outline, selection wire, fade gizmos |
| Grid | Toggle grid plane visibility |
| Snap | Toggle world-grid snapping |

## Scene View Overlays (draggable toolbar panels)

Unity 2022+ uses an overlay system — small toolbar panels that can be repositioned within the Scene View:

| Overlay | Contents |
|---------|----------|
| Tool Settings | Context-dependent settings for the active tool (e.g., Handle Rotation for the Rotate tool) |
| Grid and Snap | Quick-access grid size and snap toggles |
| Orientation | Scene Gizmo (orientation cube) |
| Search | Scene View object search |
| Camera | Camera speed and field of view for the Scene View editor camera |

Overlays can be dragged to any edge or corner of the Scene View, collapsed to icons, or hidden via the ⋮ menu > Overlays.

## Flight Adaptation Notes

Apply [the Unity-inspired command and capability contract](./unity-scene-implementation-contract.md).

- Menus, hierarchy context menus, overlays, command palettes, and shortcuts project the same shared commands.
- Assets, GameObject/node kinds, components, build/run, packages, navigation, physics, animation, and debugging are contributed and capability-gated.
- Creating or placing content allocates stable identity and uses the current editing scope in one undoable command.
- Destructive asset, prefab, and scene actions expose dependency and recovery consequences.
- Overlay placement is host preference state; actions inside overlays use shared commands.
- Test enablement in edit/play/read-only/invalid-source states and with missing plugins or references.
