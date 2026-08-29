# Adobe XD Mouse Behaviors

Authoritative reference for all mouse interactions in Adobe XD, organized by tool, context, and panel.

## Cursor Vocabulary

| Cursor | Context | Meaning |
|--------|---------|---------|
| Default arrow | Select tool over empty canvas | Click to deselect; drag for marquee |
| Arrow with move crosshair | Select tool over a selected object body | Drag to move |
| Double-headed arrow (↔ ↕ ↗) | Select tool over a resize handle | Drag to resize in that axis |
| Curved arrow | Select tool near (outside) a corner of a selected object | Drag to rotate |
| Crosshair (+) | Drawing tools (Rectangle, Ellipse, Line) | Draw a shape |
| Pen nib | Pen tool, ready to place a point | Click/drag to place |
| Pen with + | Pen tool over a path segment | Click to add anchor point |
| Pen with − | Pen tool over an anchor point | Click to remove anchor |
| Pen with ○ | Pen tool over the first point of an open path | Click to close the path |
| I-beam | Text tool over canvas or existing text | Click to create or edit text |
| Open hand | Space held (pan mode) | Drag to pan |
| Grabbing hand | During pan drag | Currently panning |
| Artboard crosshair | Artboard tool | Draw to create artboard |
| Blue wiring handle | Prototype mode, over an object's drag handle | Drag to wire an interaction |

## Select Tool (V)

### Click Behaviors

| Target | Action |
|--------|--------|
| Empty canvas / pasteboard | Deselect all |
| Unselected object | Select it (deselects others) |
| Shift+click unselected object | Add to current selection |
| Shift+click selected object | Remove from current selection |
| Object inside a group (first click) | Select the top-level group |
| Object inside a group (second click) | Direct-select the child object within the group |
| Double-click group | Enter group isolation mode (gray overlay on everything outside the group) |
| Double-click component instance | Enter component isolation mode |
| Double-click text object | Enter text editing mode |
| Double-click a path/shape | Enter path editing mode (anchor points visible) |
| Escape | Exit current isolation/editing mode; go up one level toward the artboard |
| Tab | Select the next sibling object in z-order |
| Shift+Tab | Select the previous sibling object |

### Drag Behaviors

| Start Point | Modifier | Action |
|-------------|----------|--------|
| Empty canvas | None | Marquee selection rectangle — selects all objects that intersect the rectangle |
| Empty canvas | Shift | Add-to-selection marquee (existing selection is preserved) |
| Selected object body | None | Move the selection |
| Selected object body | Shift | Constrain movement to horizontal, vertical, or 45° diagonal |
| Selected object body | Alt/Option | Duplicate and move the copy |
| Selected object body | Alt+Shift | Duplicate, constrain movement |
| Corner resize handle | None | Resize freely (non-proportional for shapes; text and images default to proportional) |
| Corner resize handle | Shift | Toggle proportional constraint (if default is proportional, Shift makes it free; if free, Shift constrains) |
| Corner resize handle | Alt/Option | Resize from center |
| Corner resize handle | Shift+Alt | Proportional resize from center |
| Side resize handle | None | Resize in one axis only |
| Near corner (outside bounding box) | None | Free rotation around the object's center |
| Near corner (outside bounding box) | Shift | Constrain rotation to 15° increments |

### Bounding Box Handles

Selected objects show:

```
    ◻───────◻───────◻
    │               │
    ◻       ⊕       ◻     ◻ = resize handle
    │               │     ⊕ = center point (rotation pivot)
    ◻───────◻───────◻
```

- **8 resize handles**: corners + side midpoints
- **Rotation zone**: just outside each corner (cursor changes to curved arrow)
- **Center point**: implicit (not draggable — rotation always pivots on center)

### Border Radius Handles

On **rectangles**, small blue circular handles appear inside each corner:

| Action | Result |
|--------|--------|
| Drag any blue handle | Adjust all four corner radii uniformly |
| Alt/Option + drag one handle | Adjust only that corner's radius independently |

Once corners are set independently, each shows its own handle.

### Smart Guide Behavior During Drag

XD displays smart guides automatically when moving or resizing:

| Guide Type | Visual | When It Appears |
|------------|--------|-----------------|
| Edge alignment | Thin blue line | Object edge aligns with another object's edge |
| Center alignment | Thin blue line | Object center aligns with another object's center |
| Spacing guide (pink) | Pink dimension label between objects | Equal spacing detected between adjacent objects |
| Artboard edge snap | Red line | Object nears artboard edge or center |
| Size matching | Pink dimension label | Object matches the width or height of a nearby object |

### Repeat Duplicate

When duplicating with Alt/Option+drag:
- The first duplicate establishes an offset vector
- Pressing Ctrl/Cmd+D after that repeats the duplication at the same offset, creating evenly spaced copies

## Rectangle Tool (R)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw rectangle from corner to corner |
| Click and drag | Shift | Constrain to perfect square |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Perfect square from center |

After release, the object is created and the tool remains active for additional draws.

## Ellipse Tool (E)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw ellipse (bounding box corner to corner) |
| Click and drag | Shift | Constrain to perfect circle |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Perfect circle from center |

### Pie/Arc Handle

After creating an ellipse, selecting it shows a small circular handle on the perimeter:
- **Drag the handle** along the perimeter to create a pie/arc shape
- The Property Inspector updates the Start Angle and Sweep values
- Drag fully around to return to a complete ellipse

## Line Tool (L)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw a line from start to end |
| Click and drag | Shift | Constrain to 45° angle increments |

## Pen Tool (P)

### Path Creation

| Action | Result |
|--------|--------|
| Click on empty canvas | Place a corner anchor point |
| Click and drag | Place a smooth anchor point; drag determines handle length and direction |
| Click on the first point (○ cursor) | Close the path |
| Double-click | End the open path |
| Escape | End the path and switch to Select tool |
| Shift+click | Constrain the new point to 45° relative to the previous point |

### While Drawing

| Action | Result |
|--------|--------|
| Alt/Option+click smooth point | Convert to corner (retract handles) |
| Alt/Option+drag from corner point | Convert to smooth (extend handles) |
| Alt/Option+drag one handle | Break tangent symmetry — adjust one handle independently |
| Ctrl/Cmd+click (held) | Temporarily switch to Select tool to reposition existing points |
| Click on a path segment | Add a new anchor point on the segment |
| Click on an existing point | Remove the anchor point |

### Path Editing Mode (double-click a path with Select tool)

| Action | Result |
|--------|--------|
| Click a point | Select it (shows handles if smooth) |
| Shift+click a point | Add/remove from point selection |
| Drag a selected point | Move the point |
| Drag a Bezier handle | Adjust the curve |
| Alt/Option+drag a handle | Break handle symmetry |
| Double-click a smooth point | Convert to corner |
| Double-click a corner point | Convert to smooth |
| Click on a path segment | Add a point |
| Select a point + Delete | Remove the point |
| Click empty area | Deselect points (but stay in path editing mode) |
| Escape | Exit path editing mode |

## Text Tool (T)

### Creation

| Action | Result |
|--------|--------|
| Single click on canvas | Create point text (auto-width, grows horizontally) |
| Click and drag on canvas | Create area text (fixed width, wraps vertically) |
| Click on existing text | Place cursor inside the text for editing |

### In Text Editing Mode

| Action | Result |
|--------|--------|
| Click | Place cursor at click position |
| Double-click | Select the word under the cursor |
| Triple-click | Select all text in the text object |
| Click and drag | Select a character range |
| Shift+click | Extend selection from cursor to click position |
| Drag the round handle (top-right of point text) | Convert to area text with dragged width |
| Drag the side handle of area text | Resize text box width |
| Double-click the round handle | Toggle between point text and area text |

### Text Object Handles

| Handle | Appearance | Meaning |
|--------|------------|---------|
| Round circle (top-right) | ○ | Point text — auto-width |
| Square handle (top-right) | ◻ | Area text — fixed width |
| Bottom handle | — | Drag to set fixed height (area text only) |
| Red + indicator (bottom of area text) | ⊕ | Text overflow — content is clipped; expand the text box |

## Artboard Tool (A)

| Action | Result |
|--------|--------|
| Click and drag on empty canvas | Create a custom-sized artboard |
| Click a preset in the Property Inspector | Create a preset-sized artboard at a default position |
| Click an artboard name (while Artboard tool is active) | Select that artboard for resizing/moving |
| Drag artboard edge handles | Resize the artboard |
| Drag artboard name | Move the entire artboard (with content) |

## Canvas Navigation (any tool)

| Action | Result |
|--------|--------|
| Space+drag | Pan the canvas |
| Ctrl/Cmd+scroll wheel up | Zoom in (centered on cursor) |
| Ctrl/Cmd+scroll wheel down | Zoom out |
| Two-finger scroll (trackpad) | Pan the canvas |
| Pinch in (trackpad) | Zoom out |
| Pinch out (trackpad) | Zoom in |
| Ctrl/Cmd+0 | Zoom to fit all artboards |
| Ctrl/Cmd+1 | Zoom to 100% |
| Ctrl/Cmd+3 | Zoom to selection |

## Prototype Mode Mouse Behaviors

In Prototype mode, the canvas shows interaction wiring. Mouse behaviors change:

### Wiring Interactions

| Action | Result |
|--------|--------|
| Click an object | Select it; a blue arrow handle (▸) appears on its right edge |
| Drag the blue arrow handle | Pull a wire — drag to a destination artboard to create an interaction |
| Release wire on an artboard | Creates a Tap interaction to that artboard (configurable in Property Inspector) |
| Release wire on empty canvas | Cancel — no interaction created |
| Click an existing wire (blue line) | Select the interaction; shows the interaction details in Property Inspector |
| Click the × on a selected wire | Delete that interaction |
| Double-click an object | Enter isolation mode (same as Design mode) |
| Click empty canvas | Deselect; all wires remain visible |

### Wires Visual

- Wires are blue curved lines from source objects to destination artboards
- A blue arrow indicates the direction (source → destination)
- Selected wires are brighter and show the trigger/action labels
- Multiple wires from the same object are fanned out for readability
- The Home artboard shows a blue house icon on its title label

### Artboard Drag Handles in Prototype Mode

- Artboards still show resize handles
- Content wiring handles appear on any object (not just buttons)
- Artboard-level triggers (like Time) show a clock icon on the artboard title

## Layers Panel Mouse Interactions

| Action | Result |
|--------|--------|
| Click a row | Select that object on canvas (canvas scrolls to show it) |
| Shift+click | Extend selection |
| Ctrl/Cmd+click | Toggle individual items in selection |
| Drag a row up/down | Reorder z-order within the same parent |
| Drag into a group | Reparent the object |
| Drag out of a group | Move to parent scope |
| Double-click row name | Rename inline |
| Hover over row (right side) | Show eye (visibility) and lock icons |
| Click eye icon | Toggle visibility |
| Alt/Option+click eye icon | Solo: hide everything else |
| Click lock icon | Toggle lock |
| Right-click | Context menu (Cut, Copy, Group, Lock, Hide, Arrange, etc.) |
| Click expand/collapse triangle | Toggle children visibility in the tree |

## Assets Panel Mouse Interactions

### Colors Section

| Action | Result |
|--------|--------|
| Click a swatch | Apply that color as the fill of the selected object |
| Right-click a swatch | Edit, Rename, Delete, Apply as Fill/Border, Highlight on Canvas |
| Drag a swatch onto an object | Apply as fill |
| Click **+** | Add the selected object's fill color as a document color |

### Character Styles Section

| Action | Result |
|--------|--------|
| Click a style (with text selected) | Apply that character style to the selected text |
| Right-click a style | Edit, Rename, Delete, Highlight on Canvas |
| Click **+** | Create a style from the selected text's current formatting |

### Components Section

| Action | Result |
|--------|--------|
| Drag a component to canvas | Place an instance |
| Double-click a component | Navigate to and select its Main Component on canvas |
| Right-click | Edit Main Component, Rename, Delete, Add to Favorites |
| Search field | Type to filter components by name |

## Color Picker Mouse Interactions

The color picker opens when clicking any color chip in the Property Inspector:

| Element | Action |
|---------|--------|
| Color field (large square) | Click/drag to select saturation (X) and brightness (Y) |
| Hue slider (rainbow strip) | Click/drag to select hue |
| Alpha slider | Click/drag to set opacity |
| Hex input | Click to type a hex value |
| Eyedropper button | Click, then click anywhere on screen to sample a color |
| Saved colors row | Click a swatch to apply |
| Gradient stop (gradient mode) | Click to select; drag to reposition; drag away to delete |
| Below gradient bar | Click to add a new color stop |
| Click outside picker | Dismiss the picker |

### Gradient On-Canvas Handles

When a gradient fill is active and the object is selected:

| Handle | Action |
|--------|--------|
| Start point | Drag to reposition gradient start |
| End point | Drag to reposition gradient end (also sets angle for linear, radius for radial) |
| Drag between handles | Move the entire gradient without changing its angle/size |

## Resize Behavior Differences by Object Type

| Object Type | Default Corner Drag | Shift+Corner Drag |
|-------------|--------------------|--------------------|
| Rectangle | Free resize | Constrain to square |
| Ellipse | Free resize | Constrain to circle |
| Path | Free resize | Proportional |
| Text (point) | Proportional | Free resize |
| Text (area) | Resize text box (reflows text) | Proportional scale (scales text size) |
| Image | Proportional | Free resize |
| Group | Proportional | Free resize |
| Component instance | Proportional (respects responsive resize) | Free resize |

Note: XD's behavior for Shift inverts the default — for objects that are proportional by default (images, groups), Shift releases the constraint.

## Ruler and Guide Interactions

When rulers are visible (View > Rulers):

| Action | Result |
|--------|--------|
| Drag from horizontal ruler | Create a horizontal guide on the artboard |
| Drag from vertical ruler | Create a vertical guide on the artboard |
| Drag an existing guide | Move the guide |
| Drag a guide back to its ruler | Delete the guide |
| Double-click a guide | Set a precise position numerically |

Guides are per-artboard and snap objects to their position when dragging.

## Scroll and Zoom Behavior

### Zoom Levels

XD supports continuous zoom from 0.28% to 12,800%. The zoom dropdown in the bottom-left shows:

| Preset | Shortcut |
|--------|----------|
| Zoom to Fit | Ctrl/Cmd+0 |
| 25% | |
| 33.33% | |
| 50% | |
| 75% | |
| 100% | Ctrl/Cmd+1 |
| 150% | |
| 200% | |
| 400% | |
| 800% | |
| Custom (type a value) | |
| Zoom to Selection | Ctrl/Cmd+3 |

### Pixel Grid

At zoom levels above 800%, XD shows a pixel grid overlay (if enabled in View menu). Individual pixels are visible and objects snap to pixel boundaries.

## Flight Adaptation Notes

Apply [the shared gesture, artboard, scope, and prototype contracts](./adobe-xd-implementation-contract.md).

- Every drag uses `begin -> preview -> commit/cancel`, pointer capture, a click/drag threshold, and one history transaction.
- Reparenting into or out of an artboard preserves world position unless an explicit command specifies local placement.
- Group/component/path/text isolation is an editing-scope transition with deterministic Escape and focus restoration.
- Smart guides consume shared snap candidates and report which edge, center, gap, grid, or guide won; visual feedback is host-rendered.
- Prototype wires edit stable graph edges. Cancelled wires leave no partial interaction, and broken destinations remain diagnosable.
- On-canvas handles are overlays in viewport space backed by shared scene-space calculations and accessible command/property alternatives.
