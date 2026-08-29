# Spline — Keyboard Shortcuts

Authoritative reference for keyboard shortcuts in Spline (circa 2024–2025).

## Tool Selection

| Shortcut | Tool |
|----------|------|
| V | Move tool (select and translate) |
| S | Scale tool |
| R | Rotate tool |
| P | Path tool (3D path creation/editing) |
| B | Pen tool (2D vector drawing) |
| T | Text tool |
| H | Hand tool (pan) |

## Viewport Navigation

| Shortcut | Action |
|----------|--------|
| F | Frame selected object (zoom to fit) |
| Shift+F or Home | Frame all objects |
| 1 | Front view (orthographic) |
| 2 | Right view (orthographic) |
| 3 | Top view (orthographic) |
| 5 | Toggle Perspective / Orthographic projection |
| Scroll wheel | Zoom in/out |
| Right-click drag | Orbit around the focal point |
| Alt+left-click drag | Orbit (alternative) |
| Middle-click drag | Pan |
| Space+left-click drag | Pan (alternative) |
| Two-finger drag (trackpad) | Pan |
| Pinch (trackpad) | Zoom |

## Selection

| Shortcut | Action |
|----------|--------|
| Click object | Select it (deselects others) |
| Shift+click | Add to / remove from selection |
| Ctrl/Cmd+click | Toggle individual selection |
| Ctrl/Cmd+A | Select all objects |
| Ctrl/Cmd+Shift+A or Escape | Deselect all |
| Tab | Select next sibling in the Layers panel |
| Shift+Tab | Select previous sibling |
| Enter (with group selected) | Enter the group (select first child) |
| Escape (inside a group) | Exit the group (select the group itself) |

## Clipboard and Object Operations

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+C | Copy |
| Ctrl/Cmd+X | Cut |
| Ctrl/Cmd+V | Paste |
| Ctrl/Cmd+D | Duplicate in place |
| Alt/Option+drag | Duplicate and move |
| Delete or Backspace | Delete selected objects |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z | Redo |

## Grouping

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+G | Group selected objects |
| Ctrl/Cmd+Shift+G | Ungroup selected group |
| Double-click a group | Enter the group (select children directly) |
| Escape | Exit the group |

## Visibility and Locking

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+H | Hide selected objects |
| Ctrl/Cmd+Shift+H | Show all hidden objects |
| Ctrl/Cmd+L | Lock selected objects |
| Ctrl/Cmd+Shift+L | Unlock all locked objects |

## Transform Modifiers (during gizmo drag)

| Shortcut | Action |
|----------|--------|
| Shift (held during drag) | Snap to grid increments |
| Alt/Option (held during drag) | Duplicate the object and drag the copy |

## Z-Order (Rendering Order)

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+] | Bring forward (one step) |
| Ctrl/Cmd+[ | Send backward (one step) |
| Ctrl/Cmd+Shift+] | Bring to front |
| Ctrl/Cmd+Shift+[ | Send to back |

## File Operations

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+N | New project |
| Ctrl/Cmd+O | Open project |
| Ctrl/Cmd+S | Save |
| Ctrl/Cmd+Shift+S | Save as / duplicate |

## View Controls

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+= | Zoom in (step) |
| Ctrl/Cmd+- | Zoom out (step) |
| F11 or Ctrl/Cmd+Shift+F | Toggle full screen |

## Boolean Operations

| Shortcut | Action |
|----------|--------|
| (No default shortcuts) | Access via the Boolean dropdown in the toolbar |

When 2+ objects are selected:
- Union — combine shapes
- Subtract — cut second from first
- Intersect — keep only overlap

## Path / Pen Tool Shortcuts

### While Drawing (Path or Pen tool active)

| Shortcut | Action |
|----------|--------|
| Click | Place a corner point |
| Click and drag | Place a smooth point with Bezier handles |
| Shift+click | Constrain angle to 45° increments from the previous point |
| Alt/Option+drag handle | Break handle symmetry (independent control) |
| Backspace | Remove the last placed point |
| Enter or Escape | Finish the path |
| Click on first point | Close the path |

### While Editing Points

| Shortcut | Action |
|----------|--------|
| Click a point | Select the point |
| Shift+click | Multi-select points |
| Drag a point | Move the point |
| Drag a handle | Adjust the Bezier curve |
| Double-click a smooth point | Convert to corner |
| Double-click a corner point | Convert to smooth |
| Delete | Remove the selected point |

## Text Editing

| Shortcut | Action |
|----------|--------|
| T | Activate the Text tool |
| Click | Place a new text object |
| Double-click existing text | Enter text editing mode |
| Ctrl/Cmd+A (in text editing) | Select all text |
| Ctrl/Cmd+B (in text editing) | Bold |
| Ctrl/Cmd+I (in text editing) | Italic |
| Ctrl/Cmd+U (in text editing) | Underline |
| Escape | Exit text editing |

## Layers Panel

| Shortcut | Action |
|----------|--------|
| F2 | Rename selected object |
| Arrow Up/Down | Navigate through layers |
| Arrow Right | Expand children |
| Arrow Left | Collapse children or move to parent |

## Timeline / Animation

| Shortcut | Action |
|----------|--------|
| Space | Play / Pause animation |
| (Timeline-specific shortcuts are mostly mouse-driven — see `spline-panels.md`) |

## Play Mode

| Shortcut | Action |
|----------|--------|
| (Play button or menu) | Enter play mode (preview interactions and animations) |
| Escape | Exit play mode |

## Component System

| Shortcut | Action |
|----------|--------|
| (No default shortcut) | Create Component — available via right-click context menu or Edit menu |
| (No default shortcut) | Detach Component — available via right-click context menu |

## Inspector / Properties

| Shortcut | Action |
|----------|--------|
| Tab | Move to next property field |
| Enter | Apply the typed value |
| Escape | Cancel editing, revert |
| Drag on field label | Scrub the value |
