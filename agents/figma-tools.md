# Figma Tools

Authoritative reference for all tools in Figma's toolbar (circa 2024–2025).

## Toolbar Organization

Tools are arranged left-to-right in the toolbar. Some are grouped behind dropdown menus (indicated by a small triangle). The active tool is highlighted.

```
[Move▾] [Frame▾] [Shapes▾] [Pen▾] [T] [Resources] [Hand] [Comment]   ...contextual buttons...
  V/K    F/S/§     R/L/O/…   P/⌇    T    Shift+I      H       C
```

## Move Tool (V)

### Purpose
The primary selection and manipulation tool. Select, move, resize, and rotate objects.

### Cursor States

| Cursor | Context |
|--------|---------|
| Default arrow | Over empty canvas or unselectable area |
| Arrow | Over an object (ready to select) |
| Move crosshair | Over a selected object body |
| Resize (double-headed arrow) | Over a resize handle |
| Rotation (curved arrow) | Near a corner, outside the bounding box |

### Click Behaviors

| Target | Action |
|--------|--------|
| Empty canvas | Deselect all |
| Object | Select it (deselects others) |
| Shift+click | Add to / remove from selection |
| Object inside a group/frame (click) | Select the top-level parent |
| Object inside a group/frame (double-click) | Enter the parent; select the direct child |
| Deep-nested object (repeated double-click) | Drill deeper into each nesting level |
| Ctrl/Cmd+click on nested object | Deep select — directly select the object regardless of nesting depth |
| Double-click text | Enter text editing mode |
| Escape | Go up one nesting level / exit text editing / deselect |
| Enter (with frame/group selected) | Enter the frame/group (select the first child) |
| Tab | Select next sibling |
| Shift+Tab | Select previous sibling |

### Drag Behaviors

| Start Point | Modifier | Action |
|-------------|----------|--------|
| Empty canvas | None | Marquee selection (selects objects that intersect the rectangle) |
| Selected object | None | Move the selection |
| Selected object | Shift | Constrain movement to horizontal or vertical |
| Selected object | Alt/Option | Duplicate and move the copy |
| Selected object | Alt+Shift | Duplicate and constrain |
| Corner resize handle | None | Resize proportionally (default for most objects) |
| Corner resize handle | Shift | Resize non-proportionally (toggles the default) |
| Corner resize handle | Alt/Option | Resize from center |
| Corner resize handle | Shift+Alt | Non-proportional from center |
| Side resize handle | None | Resize in one axis |
| Near corner (outside box) | None | Free rotation |
| Near corner (outside box) | Shift | Constrain rotation to 15° increments |

### Bounding Box

Selected objects show:
- **8 resize handles**: corners + side midpoints
- **Rotation zone**: outside each corner (cursor changes to curved arrow)
- **Corner radius handles**: blue circles inside corners of rectangles (drag to round)
- **Dimensions label**: W×H shown near the bounding box during resize

### Selection Behavior: Click Depth

Figma uses a progressive click-to-enter model:

1. First click on a deeply nested object → selects the top-level frame/group
2. Double-click → enters that container, selects the direct child
3. Double-click again → enters the next level down
4. Continue until you reach the leaf object
5. **Ctrl/Cmd+click** skips all levels and directly selects the deepest object under the cursor

## Scale Tool (K)

### Purpose
Uniformly scale objects — including stroke widths, effects, text sizes, and corner radii — proportionally.

### Differences from Move Tool Resize

| Property | Move Tool Resize | Scale Tool |
|----------|-----------------|------------|
| Stroke width | Unchanged | Scales proportionally |
| Corner radius | Unchanged | Scales proportionally |
| Text size | Unchanged (reflows) | Scales proportionally |
| Effects (shadow offset/blur) | Unchanged | Scales proportionally |
| Constraints | Applied | Ignored |

### Behaviors

Same click/drag behaviors as Move Tool, but all resize operations apply uniform scaling to all visual properties.

## Frame Tool (F)

### Purpose
Create frames — Figma's primary container and artboard equivalent.

### Creation Behaviors

| Action | Result |
|--------|--------|
| Click and drag on canvas | Create a custom-sized frame |
| Click a preset in the right panel | Create a frame with preset dimensions |
| Select objects, then Ctrl/Cmd+Alt+G | Frame the selection (wrap in a new frame) |

### Frame Presets (right panel when Frame tool is active)

| Category | Examples |
|----------|---------|
| Phone | iPhone 16 (393×852), iPhone SE (375×667), Android Small/Large, Pixel |
| Tablet | iPad Mini, iPad Pro 11"/12.9", Surface Pro, Android tablets |
| Desktop | Desktop (1440×1024), MacBook Pro/Air, iMac, Surface Book |
| Presentation | Slide 16:9 (1920×1080), Slide 4:3 |
| Social Media | Instagram Post/Story, Facebook Post/Cover, Twitter Post, YouTube Thumbnail |
| Watch | Apple Watch sizes |
| Paper | A4, A5, Letter, Tabloid |
| Custom | User-defined size |

### Frame Behaviors

| Action | Result |
|--------|--------|
| Click frame name (on canvas label) | Select the frame |
| Double-click frame name | Rename the frame inline |
| Drag frame name or edge | Move the frame and its contents |
| Resize frame handles | Resize the frame; children respond based on their constraints |
| Drag object into a frame | Object becomes a child of that frame |
| Drag object out of a frame | Object moves to the parent or the page |

## Section Tool (Shift+S)

### Purpose
Create sections — organizational regions for grouping frames on the canvas.

| Action | Result |
|--------|--------|
| Click and drag | Draw a section rectangle |
| Click section title | Select the section |
| Double-click section title | Rename |

Sections are canvas-level organizers. They do not clip content, do not participate in prototyping, and do not nest within frames.

## Slice Tool (S)

### Purpose
Create export slices — invisible rectangles that define export regions.

| Action | Result |
|--------|--------|
| Click and drag | Draw a slice region |
| Slice properties (right panel) | Set export format, scale, suffix |

Slices do not appear in the final design — they only define export boundaries. They appear in the Layers panel with a knife icon.

## Rectangle Tool (R)

### Purpose
Draw rectangles and squares.

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw rectangle from corner to corner |
| Click and drag | Shift | Constrain to square |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Square from center |

### Corner Radius Handles

After creation, selected rectangles show blue circular handles at each corner:

| Action | Result |
|--------|--------|
| Drag any handle | Set all four corner radii uniformly |
| Hold Alt/Option, then drag one handle | Set independent radius for that corner only |
| Type radius value in right panel | Set precise radius (single field = uniform; expand for per-corner) |

### Independent Corner Radius

Click the independent corners icon in the Design panel to show four separate radius inputs (top-left, top-right, bottom-right, bottom-left).

## Ellipse Tool (O)

### Purpose
Draw ellipses and circles.

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw ellipse |
| Click and drag | Shift | Constrain to circle |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Circle from center |

### Arc Controls

Selected ellipses show a small handle on the perimeter:
- Drag the handle to create an arc or pie shape
- The Design panel shows **Start** (start angle) and **Sweep** (sweep angle) fields
- A second inner handle controls the **Ratio** (inner radius for donut/ring shapes)

## Line Tool (L)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw a straight line |
| Click and drag | Shift | Constrain to 45° increments |

Lines have stroke properties; no fill.

## Arrow Tool (Shift+L)

Same as Line Tool but draws a line with an arrowhead at the end. Arrow style is configurable in stroke properties (start/end arrow type).

## Polygon Tool (no default shortcut)

Accessed via the Shape tools dropdown.

| Action | Result |
|--------|--------|
| Click and drag | Draw a polygon (default: triangle/3 sides) |
| Shift+drag | Constrain proportions |

The Design panel shows a **Count** field for the number of sides (3–60) and a **Ratio** field for adjusting the inner radius (to create star-like shapes).

## Star Tool (no default shortcut)

Accessed via the Shape tools dropdown.

| Action | Result |
|--------|--------|
| Click and drag | Draw a star (default: 5 points) |
| Shift+drag | Constrain proportions |

Design panel shows **Count** (number of points), **Ratio** (inner radius), and **Corner Radius**.

## Pen Tool (P)

### Purpose
Draw precise vector paths with anchor points and Bezier curves.

### Path Creation

| Action | Result |
|--------|--------|
| Click | Place a corner anchor point |
| Click and drag | Place a smooth anchor point; drag sets handle length/direction |
| Click on first point | Close the path |
| Enter or Escape | End the open path |
| Shift+click | Constrain point placement to 45° from previous |

### While Drawing

| Action | Result |
|--------|--------|
| Alt/Option+drag handle | Break handle symmetry (independent handles) |
| Click on segment | Add anchor point |
| Click on existing point | Remove anchor point (if using the Remove Point sub-cursor) |
| Ctrl/Cmd (held) | Temporarily switch to Move tool |
| Backspace/Delete | Remove the last placed point |

### Path Editing (enter with double-click or Enter on selected path)

| Action | Result |
|--------|--------|
| Click point | Select anchor point |
| Shift+click | Multi-select points |
| Drag point | Move the anchor point |
| Drag handle | Adjust Bezier curve |
| Double-click smooth point | Convert to corner |
| Double-click corner point | Convert to smooth |
| Alt/Option+drag handle | Break or rejoin handle symmetry |
| Click on segment | Add new point |
| Select point + Delete | Remove point |
| Bend Tool (available in edit mode) | Drag a segment to curve it without adding points |

### Cursor States

| Cursor | Meaning |
|--------|---------|
| Pen nib | Ready to place a point |
| Pen with + | Over a segment — add a point |
| Pen with − | Over a point — remove it |
| Pen with ○ | Over the start point — close the path |

## Pencil Tool (Shift+P)

### Purpose
Freehand drawing — creates paths from mouse/stylus strokes.

| Action | Result |
|--------|--------|
| Click and drag | Draw a freeform path |
| Release | Path is auto-smoothed based on the speed and pressure of the stroke |

The resulting path can be edited with the Pen tool or path editing mode.

## Text Tool (T)

### Purpose
Create and edit text.

### Creation Behaviors

| Action | Result |
|--------|--------|
| Click on canvas | Create an auto-width text object (grows horizontally as you type) |
| Click and drag | Create a fixed-width text box (wraps text; height auto-grows) |
| Click on existing text | Enter text editing at the click position |

### Text Resize Behaviors

| Resize Mode | Indicator | Behavior |
|-------------|-----------|----------|
| Auto Width | No handle on the right | Width grows with content; single line until Enter |
| Auto Height | Handle on left/right edges | Fixed width, wraps; height grows with content |
| Fixed Size | Handles on all edges | Fixed width and height; overflow is clipped (indicated by an orange triangle) |

Toggle between modes by double-clicking the resize handle on the right side of the text bounding box, or by choosing in the Design panel under "Text auto resize."

## Hand Tool (H)

### Purpose
Pan the canvas.

| Action | Result |
|--------|--------|
| Click and drag | Pan the canvas |
| Space (held from any tool) | Temporarily switch to Hand |

Double-click the Hand tool icon: no special behavior in Figma (unlike Flash/XD).

## Comment Tool (C)

### Purpose
Add annotations and feedback pins to the canvas.

| Action | Result |
|--------|--------|
| Click on canvas | Place a comment pin; opens a text input for the comment |
| Click on an existing comment pin | Open the comment thread |
| Drag a comment pin | Reposition it |

Comments are threaded — others can reply. Comments can be resolved (marked complete) or deleted.

## Resources Panel (Shift+I)

Not a drawing tool but a toolbar button. Opens a searchable panel for:

| Tab | Contents |
|-----|----------|
| Components | Search local and library components; drag to place instances |
| Plugins | Search and run installed plugins |
| Widgets | Search and place widgets (interactive FigJam/design components) |

## Eyedropper / Color Picker (I)

Not in the toolbar, but a key tool:

| Shortcut | Action |
|----------|--------|
| I | Activate eyedropper |
| Click anywhere on canvas | Sample the color at that pixel and apply to the selected object's fill |
| Alt/Option+click (from within the color picker) | Sample color without closing the picker |

The eyedropper works on any visible content, including images, gradients, and overlapping objects. It samples the rendered pixel color, not the underlying fill definition.

## Boolean Operations (contextual toolbar)

When 2+ vector shapes are selected, boolean buttons appear in the center of the toolbar:

| Operation | Icon | Action |
|-----------|------|--------|
| Union Selection | ∪ | Combine all shapes into one |
| Subtract Selection | − | Cut front shapes from the back shape |
| Intersect Selection | ∩ | Keep only overlapping regions |
| Exclude Selection | ⊕ | Keep everything except overlapping regions |
| Flatten Selection | ▬ | Merge into a single flat path (non-reversible union) |

Boolean results are editable — double-click to enter and edit the original sub-shapes. Flatten is destructive and cannot be re-entered.

## Contextual Toolbar Buttons

Additional buttons appear in the toolbar based on the selection:

| Context | Button | Action |
|---------|--------|--------|
| Any selection | Create Component | Ctrl/Cmd+Alt+K |
| 2+ objects | Boolean operations | Union, Subtract, Intersect, Exclude |
| Selection with top shape | Use as Mask | Ctrl/Cmd+Alt+M |
| Component selected | Edit variant/state | Component management |

## Tool Persistence

- Drawing tools (Rectangle, Ellipse, Line, etc.) remain active after creating one object — draw repeatedly without reselecting
- After creating a text object, Figma auto-switches to text editing mode; pressing Escape exits to the Move tool
- The Pen tool stays active across multiple point placements until you press Enter/Escape
- The Comment tool stays active until you switch to another tool or press Escape

## Flight Adaptation Notes

Apply [the Figma-inspired tool, frame, comments, and plugin contract](./figma-implementation-contract.md).

- Shared tool state machines are presentation-neutral; desktop, VS Code, and in-app hosts may expose different tool chrome.
- Move resize, Scale, vector edit, frame/section/slice creation, text resize, comments, and eyedropper have explicit begin/preview/commit/cancel behavior.
- Frames own bounds and layout; groups derive bounds; sections are non-rendering organization metadata; slices are export metadata.
- Comment and resource tools appear only when their service/contribution capability is available.
- Path and bend tools require authoring-safe upstream topology; do not approximate them with destructive host-local geometry.
- Test editing-scope transitions, temporary tool restore, incomplete paths, layout-controlled children, focus loss, and permission changes mid-gesture.
