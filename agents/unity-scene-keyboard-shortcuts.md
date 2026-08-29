# Unity Scene View — Keyboard Shortcuts

Authoritative reference for keyboard shortcuts in the Unity Editor (Unity 2022 LTS / Unity 6) related to scene layout, object arrangement, and Scene View navigation.

## Transform Tool Selection

| Shortcut | Tool |
|----------|------|
| Q | Hand / View tool |
| W | Move tool |
| E | Rotate tool |
| R | Scale tool |
| T | Rect tool |
| Y | Transform tool (combined Move + Rotate + Scale) |

## Scene View Navigation

| Shortcut | Action |
|----------|--------|
| F | Frame selected object (center and zoom to fit) |
| Shift+F | Lock view to selected object (follow as it moves) |
| Numpad 5 | Toggle between Perspective and Orthographic projection |
| Numpad 0 | Align Scene View camera to the selected Camera |
| Ctrl+Shift+F | Align selected object to the current Scene View camera position and rotation |
| Scroll wheel | Zoom in / out |
| Alt+left-click drag | Orbit around pivot |
| Alt+middle-click drag | Pan |
| Alt+right-click drag | Dolly zoom |
| Middle-click drag | Pan |
| Right-click+WASD | Fly-through navigation (hold right-click) |
| Right-click+Q | Fly down |
| Right-click+E | Fly up |
| Right-click+Shift | Fly faster |
| Right-click+Scroll | Adjust fly speed |

## Axis-Aligned View Shortcuts (Scene Gizmo Equivalents)

Click on the Scene Gizmo's axis labels for these, or use the keyboard if custom shortcuts are assigned:

| Scene Gizmo Click | Resulting View |
|-------------------|----------------|
| Click Y (top) | Top-down view (looking down Y) |
| Shift+click Y | Bottom-up view |
| Click X (right) | Right-side view (looking left along X) |
| Shift+click X | Left-side view |
| Click Z (front) | Front view (looking back along Z) |
| Shift+click Z | Back view |
| Click center cube | Toggle perspective / isometric |

## Object Manipulation

### Basic Operations

| Shortcut | Action |
|----------|--------|
| Ctrl+D | Duplicate selected object(s) |
| Delete / Backspace | Delete selected object(s) |
| Ctrl+Z | Undo (applies to Inspector changes, gizmo transforms, and hierarchy operations) |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+X | Cut |

### Transform Modifiers (during gizmo drag)

| Shortcut | Action |
|----------|--------|
| Ctrl (held during drag) | Snap to increment (Move: grid units, Rotate: 15° default, Scale: 0.1) |
| V (held) | Vertex snapping mode — gizmo follows nearest vertex; drag snaps vertex to vertex |
| Ctrl+Shift (held during move) | Surface snapping — snap pivot to mesh/collider surfaces |
| Shift (held during move on some axes) | Constrain to the dominant axis (behavior varies by context) |

### Pivot / Space Toggles

| Shortcut | Action |
|----------|--------|
| Z | Toggle Pivot / Center mode (toolbar button) |
| X | Toggle Global / Local coordinate space (toolbar button) |

## Selection

| Shortcut | Action |
|----------|--------|
| Click object (in Scene View) | Select it |
| Click object (in Hierarchy) | Select it |
| Shift+click | Range select (Hierarchy) or add to selection (Scene View) |
| Ctrl+click | Toggle selection (add or remove without deselecting others) |
| Ctrl+A | Select all objects in the scene |
| Ctrl+Shift+A | Deselect all |
| Escape | Deselect / cancel current operation |

## Object Creation

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+N | Create Empty GameObject |
| Alt+Shift+N | Create Empty Child (under selected) |

Via menu: GameObject > 3D Object > Cube / Sphere / Capsule / Cylinder / Plane / Quad / etc.

## Hierarchy Shortcuts

| Shortcut | Action |
|----------|--------|
| F2 | Rename selected object |
| Delete | Delete selected object |
| Ctrl+D | Duplicate |
| Alt+click expand arrow | Expand/collapse all children recursively |
| Arrow keys | Navigate up/down in Hierarchy |
| Right arrow | Expand children |
| Left arrow | Collapse children or move to parent |

## View Controls

| Shortcut | Action |
|----------|--------|
| 2 | Toggle 2D mode in Scene View |
| Ctrl+P | Enter / exit Play Mode |
| Ctrl+Shift+P | Pause Play Mode |
| Ctrl+Alt+P | Step one frame in Play Mode |

## Window / Panel Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+1 | Focus Scene View |
| Ctrl+2 | Focus Game View |
| Ctrl+3 | Focus Inspector |
| Ctrl+4 | Focus Hierarchy |
| Ctrl+5 | Focus Project |
| Ctrl+6 | Focus Animation |
| Ctrl+7 | Focus Profiler |
| Ctrl+8 | Focus Audio Mixer |
| Ctrl+9 | Focus Asset Store |
| Ctrl+0 | Focus Console |
| Ctrl+Shift+C | Open Console |
| Shift+Space | Maximize the currently focused panel (toggle) |

## Snapping Configuration

| Shortcut | Action |
|----------|--------|
| Ctrl (during gizmo drag) | Enable increment snap for the current drag |
| Grid Snap toggle (footer) | Enable/disable persistent world-grid snapping |
| V (held) | Vertex snapping mode |
| Ctrl+Shift (held during move) | Surface snapping |

### Editing Snap Values

Edit > Grid and Snap Settings opens the configuration window:

| Field | Default | Description |
|-------|---------|-------------|
| Move X/Y/Z | Grid size (e.g., 0.25) | Increment when Ctrl-dragging with Move tool |
| Rotate | 15° | Increment when Ctrl-dragging with Rotate tool |
| Scale | 0.1 | Increment when Ctrl-dragging with Scale tool |

## Alignment and Distribution

Unity has no built-in alignment/distribution shortcuts (unlike 2D design tools). Alignment is achieved by:

1. Manual numeric entry in the Inspector Transform fields
2. Vertex snapping (V) to align vertices
3. Surface snapping (Ctrl+Shift) to place on surfaces
4. Grid snapping for regular spacing
5. The **Align View to Selected** / **Move to View** commands in the context menu

## Search Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+F (in Hierarchy) | Focus the search field |
| t:ComponentName (in search) | Filter by component type |
| l:LayerName (in search) | Filter by layer |

## Inspector Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Move to next field in Inspector |
| Enter | Apply typed value |
| Drag on field label | Scrub value (increase/decrease by dragging) |
| Alt+drag on field label | Fine-scrub (slower adjustment) |
| Right-click component header | Reset, Remove, Copy, Paste Component |
| Ctrl+Z | Undo Inspector change |

## Context Menu Shortcuts (right-click in Hierarchy)

| Menu Item | Shortcut |
|-----------|----------|
| Copy | Ctrl+C |
| Paste | Ctrl+V |
| Rename | F2 |
| Duplicate | Ctrl+D |
| Delete | Delete |
| Create Empty | Ctrl+Shift+N |
| Create Empty Child | Alt+Shift+N |
| Move to View | Ctrl+Alt+F |
| Align with View | Ctrl+Shift+F |

## Gizmo Toggles

| Shortcut / Action | Effect |
|-------------------|--------|
| Gizmos dropdown (Scene View footer) | Show/hide per-component gizmos (Camera, Light, Collider, etc.) |
| Selection Outline toggle | Toggle the highlight outline on selected objects |
| 3D Icons toggle | Switch between 3D and 2D component icons in Scene View |
| Icon size slider | Adjust gizmo icon display size |
