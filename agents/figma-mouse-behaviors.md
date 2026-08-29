# Figma Mouse Behaviors

Authoritative reference for all mouse interactions in Figma (circa 2024–2025), organized by tool, context, and panel.

## Cursor Vocabulary

| Cursor | Context | Meaning |
|--------|---------|---------|
| Default arrow | Move tool over canvas or unselectable area | Ready to select |
| Arrow | Over a selectable object | Click to select |
| Move crosshair (four arrows) | Over a selected object body | Drag to move |
| Double-headed arrow (↔ ↕ ↗) | Over a resize handle | Drag to resize |
| Curved arrow | Near a corner, outside the bounding box | Drag to rotate |
| Crosshair (+) | Drawing tool (Rectangle, Ellipse, Line, Frame, Section, Slice) | Draw a shape |
| Pen nib | Pen tool | Place a point |
| Pen + | Pen tool over a path segment | Add anchor point |
| Pen − | Pen tool over an anchor point | Remove anchor point |
| Pen ○ | Pen tool over the start point of an open path | Close the path |
| I-beam | Text tool | Click to create or edit text |
| Open hand | Hand tool / Space held | Drag to pan |
| Closed hand | During pan drag | Currently panning |
| Eyedropper | Color picker active (I key) | Click to sample |
| Comment pin | Comment tool | Click to place a comment |
| Blue drag handle | Prototype mode, on object edge | Drag to wire interaction |
| Crosshair with + | Frame tool | Draw a frame |

## Move Tool (V)

### Click Behaviors

| Target | Action |
|--------|--------|
| Empty canvas | Deselect all |
| Unselected object | Select it (deselects others) |
| Shift+click object | Add to / remove from selection |
| Object in group/frame (1st click) | Select the top-level parent container |
| Object in group/frame (2nd click) | Select the direct child (enter one level) |
| Object in group/frame (deeper clicks) | Enter deeper levels, one per click |
| Ctrl/Cmd+click nested object | **Deep select** — directly select the deepest object under the cursor, regardless of nesting |
| Double-click group/frame | Enter the container (isolation mode) |
| Double-click component instance | Enter the component (isolation mode) |
| Double-click text | Enter text editing mode |
| Double-click path/shape | Enter path editing mode (anchor points appear) |
| Escape | Exit current level / exit text editing / deselect |
| Enter (with frame/group selected) | Enter the container (select first child) |
| Tab | Select next sibling object |
| Shift+Tab | Select previous sibling |

### Drag Behaviors

| Start Point | Modifier | Action |
|-------------|----------|--------|
| Empty canvas | None | Marquee selection — selects objects that **intersect** the rectangle |
| Empty canvas | Shift | Add-to-selection marquee |
| Selected object body | None | Move the selection |
| Selected object body | Shift | Constrain movement to horizontal, vertical, or 45° diagonal |
| Selected object body | Alt/Option | Duplicate and move the copy |
| Selected object body | Alt+Shift | Duplicate and constrain movement |

### Resize Behaviors (drag handles)

| Handle | Modifier | Action |
|--------|----------|--------|
| Corner handle | None | Proportional resize (default for most objects) |
| Corner handle | Shift | Non-proportional resize (toggles proportional lock) |
| Corner handle | Alt/Option | Resize from center |
| Corner handle | Shift+Alt | Non-proportional from center |
| Side handle | None | Resize in one axis |
| Side handle | Alt/Option | Resize from center in one axis |

#### Object Type Affects Default Resize Behavior

| Object Type | Default Corner Drag | Shift+Corner Drag |
|-------------|--------------------|--------------------|
| Rectangle / Ellipse / Path | Proportional | Non-proportional |
| Text (auto width) | Proportional | Non-proportional |
| Text (auto height / fixed) | Width resize (reflows) | Proportional scale |
| Image | Proportional | Non-proportional |
| Group | Proportional (scales children) | Non-proportional |
| Frame (no auto layout) | Resizes frame; children follow their constraints | — |
| Frame (with auto layout) | Resizes; children reflow per auto layout rules | — |

### Rotation

| Zone | Modifier | Action |
|------|----------|--------|
| Just outside a corner handle | None | Free rotation around the center |
| Just outside a corner handle | Shift | Constrain to 15° increments |

The cursor changes to a curved arrow when in the rotation zone.

### Corner Radius Handles

Rectangles show small blue circular handles inside each corner:

| Action | Result |
|--------|--------|
| Drag any blue handle | Adjust all four corners uniformly |
| Alt/Option+drag one handle | Adjust only that corner independently |
| Once independent, drag each separately | Per-corner radius control |

### Smart Guides

Figma shows smart guides automatically during drag and resize:

| Guide Type | Visual | When It Appears |
|------------|--------|-----------------|
| Edge alignment | Thin red/pink line | Object edge aligns with another object's edge |
| Center alignment | Thin red/pink line | Object center aligns with another's center or edge |
| Spacing measurement | Red dimension labels between objects | Moving near equal spacing between sibling objects |
| Object dimensions | Red labels near handles | During resize |
| Parent bounds snap | Red line at frame edge | Object aligns with parent frame boundary |
| Padding guides | Pink/red spacing markers | Object nears consistent internal padding within a frame |

### Repeat Duplicate

1. Alt/Option+drag to create the first duplicate at a specific offset
2. Press Ctrl/Cmd+D to repeat the duplication at the same offset
3. Each subsequent Ctrl/Cmd+D creates another copy at the same spacing

This creates evenly distributed copies efficiently.

## Scale Tool (K)

Same interaction model as Move Tool (click, drag, resize, rotate) with one key difference: resizing with the Scale tool scales **all visual properties** proportionally — stroke widths, corner radii, text sizes, shadow offsets, blur values. The Move tool resize leaves these properties at their original values.

## Frame Tool (F)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag on empty canvas | None | Create a custom-sized frame |
| Click and drag | Shift | Constrain to square proportions |
| Click a preset in the right panel | | Create a preset-sized frame |

After creation, Figma switches to the Move tool with the new frame selected.

## Section Tool (Shift+S)

| Action | Result |
|--------|--------|
| Click and drag | Draw a section rectangle on the canvas |
| Click section title | Select the section |
| Double-click section title | Rename inline |
| Drag section | Move the section (frames inside move with it) |

## Slice Tool (S)

| Action | Result |
|--------|--------|
| Click and drag | Draw an export slice region |
| Select + resize handles | Adjust slice bounds |
| Configure export in right panel | Set format, scale, suffix |

## Rectangle Tool (R) / Ellipse Tool (O)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw shape from corner |
| Click and drag | Shift | Constrain to square / circle |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Constrain + from center |

### Ellipse Arc/Pie Handle

After creating an ellipse, selecting it shows a handle on the perimeter:

| Action | Result |
|--------|--------|
| Drag the handle clockwise/counterclockwise | Create an arc (open) or pie (closed) shape |
| Inner handle (appears for arcs) | Adjust inner radius for donut/ring shapes |

## Line Tool (L) / Arrow Tool (Shift+L)

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw a line/arrow from start to end |
| Click and drag | Shift | Constrain to 45° increments |

## Pen Tool (P)

### Creating Paths

| Action | Result |
|--------|--------|
| Click | Place a corner anchor point |
| Click and drag | Place a smooth point; drag sets Bezier handles |
| Click on the first point | Close the path |
| Enter or Escape | End the open path |
| Shift+click | Constrain to 45° from previous point |
| Backspace | Remove the last placed point |

### While Drawing

| Action | Result |
|--------|--------|
| Alt/Option+drag a handle | Break handle symmetry (independent control) |
| Click on a path segment | Add a new anchor point |
| Ctrl/Cmd (held) | Temporarily switch to Move (reposition points) |

### Path Editing Mode (double-click a path, or select + Enter)

| Action | Result |
|--------|--------|
| Click a point | Select it (highlight; handles appear if smooth) |
| Shift+click | Multi-select anchor points |
| Drag a selected point | Move the point |
| Drag a Bezier handle | Adjust the curve |
| Alt/Option+drag a handle | Break or restore handle symmetry |
| Double-click a smooth point | Convert to corner |
| Double-click a corner point | Convert to smooth |
| Click on a segment | Add a new anchor point |
| Select point + Delete | Remove point (path may open) |
| Ctrl/Cmd+Backspace | Delete and heal (remove point, reconnect path smoothly) |
| Click empty area | Deselect points (stay in edit mode) |
| Escape | Exit path editing mode |

### Bend Tool (available in path editing mode)

| Action | Result |
|--------|--------|
| Drag a straight segment | Bend it into a curve (adds curvature without adding new points) |

## Pencil Tool (Shift+P)

| Action | Result |
|--------|--------|
| Click and drag | Draw a freehand path |
| Release | Path is auto-smoothed |

## Text Tool (T)

### Creation

| Action | Result |
|--------|--------|
| Click on canvas | Create auto-width text (grows horizontally) |
| Click and drag | Create auto-height text (fixed width, height grows) |
| Click on existing text | Enter text editing at click position |

### Text Editing

| Action | Result |
|--------|--------|
| Double-click | Select word |
| Triple-click | Select line or paragraph |
| Click and drag | Select character range |
| Shift+click | Extend selection to click position |
| Escape | Exit text editing |

### Text Resize Handles

| Handle | Behavior |
|--------|----------|
| No right-side handle | Auto-width mode |
| Side handles (left/right) | Auto-height mode (drag to change width) |
| All handles (corners + sides) | Fixed size mode (drag to change dimensions) |
| Double-click the right-side handle | Cycle through auto-width → auto-height → fixed size |

### Overflow Indicator

When a fixed-size text box has content that doesn't fit, an orange triangle appears at the bottom-right corner. This content is clipped in exports and presentations.

## Hand Tool (H) / Pan

| Action | Result |
|--------|--------|
| Click and drag | Pan the canvas |
| Space+drag (from any tool) | Temporarily pan |
| Middle mouse button+drag | Pan (always, any tool) |

## Comment Tool (C)

| Action | Result |
|--------|--------|
| Click on canvas | Place a comment pin; text input opens |
| Click on existing pin | Open the comment thread |
| Drag a pin | Reposition (author only) |
| Escape or switch tool | Exit comment mode |

## Eyedropper (I)

| Action | Result |
|--------|--------|
| Click anywhere on canvas | Sample the pixel color and apply to selected object's fill |
| (from within color picker) Alt/Option+click | Sample without closing the picker |

## Canvas Navigation

### Zoom

| Action | Result |
|--------|--------|
| Ctrl/Cmd+scroll wheel up | Zoom in (centered on cursor) |
| Ctrl/Cmd+scroll wheel down | Zoom out |
| Pinch out (trackpad) | Zoom in |
| Pinch in (trackpad) | Zoom out |
| Ctrl/Cmd+= | Zoom in (step) |
| Ctrl/Cmd+− | Zoom out (step) |
| Ctrl/Cmd+0 | 100% zoom |
| Shift+1 | Zoom to fit all |
| Shift+2 | Zoom to selection |

### Zoom Levels

Continuous zoom from ~1% to ~25,600%. The dropdown at bottom-right or via Ctrl/Cmd and scroll shows:
- 8%, 13%, 21%, 34%, 50%, 75%, 100%, 150%, 200%, 300%, 400%, 800%
- Zoom to Fit, Zoom to Selection
- Custom values (type a number)

### Scrolling

| Action | Result |
|--------|--------|
| Scroll wheel | Scroll canvas vertically |
| Shift+scroll | Scroll canvas horizontally |
| Two-finger scroll (trackpad) | Pan in any direction |

## Prototype Mode Canvas Interactions

When the **Prototype** tab is active:

### Wiring

| Action | Result |
|--------|--------|
| Select an object | Blue circular handle appears on the right edge |
| Drag the blue handle to a frame | Create an interaction wire (blue curved line from source to destination) |
| Release over a frame | Creates an "On click → Navigate to" interaction (configurable in the right panel) |
| Release over empty canvas | Cancel (no wire created) |
| Click an existing wire | Select the interaction; details shown in right panel |
| Drag wire endpoint to a different frame | Change the destination |
| Click × on a selected wire | Delete the interaction |
| Multiple wires from one object | Fan out for readability; each configured independently |

### Flow Starting Points

| Action | Result |
|--------|--------|
| Click the blue play icon on a frame title | This frame is a flow starting point |
| Add via right panel > Flows > + | Set a new flow starting point |
| Right-click frame > Set as starting point | Designate as flow start |

### All canvas interactions from Design mode still work — selection, moving, resizing — but objects also show their interaction wiring.

## Layers Panel Interactions

| Action | Result |
|--------|--------|
| Click a row | Select that object on canvas |
| Shift+click | Range select |
| Ctrl/Cmd+click | Toggle individual selection |
| Drag row up/down | Reorder z-order |
| Drag into a group/frame | Reparent |
| Drag out of a container | Move to parent |
| Double-click name | Rename inline |
| Hover over row (right edge) | Reveal eye (visibility) and lock icons |
| Click eye | Toggle visibility |
| Alt/Option+click eye | Solo (hide everything else) |
| Click lock | Toggle lock |
| Right-click | Context menu |
| Expand/collapse triangle | Toggle children in tree |

## Assets Panel Interactions

| Action | Result |
|--------|--------|
| Drag component to canvas | Place an instance |
| Double-click a local component | Navigate to the Main Component on canvas |
| Right-click component | Insert, Go to main component, Edit, etc. |
| Search field | Filter by component name |

## Color Picker Interactions

Opened by clicking any color chip in the Design panel:

| Element | Action |
|---------|--------|
| Color field (large square) | Click/drag to set saturation (X) and brightness (Y) |
| Hue slider (horizontal rainbow) | Click/drag to select hue |
| Opacity slider | Click/drag to set per-fill opacity |
| Hex input | Click to type hex value |
| Eyedropper button | Click, then click anywhere to sample |
| Color model toggle (RGB/HSL/HSB) | Switch input format |
| Document colors row | Click to apply a recently used color |
| Styles section | Click to apply a saved Color Style |
| Variables section | Click to bind a color Variable |
| Gradient bar (gradient mode) | Click to add stop; drag to reposition; drag away to delete |
| Click outside picker | Close picker |

### On-Canvas Gradient Handles

When a gradient fill is applied to a selected object:

| Handle | Action |
|--------|--------|
| Start point | Drag to reposition gradient start |
| End point | Drag to reposition end (and set angle/radius) |
| Midpoint between handles | Drag to move gradient without changing angle |

## Ruler and Guide Interactions

When rulers are visible (Shift+R):

| Action | Result |
|--------|--------|
| Drag from top ruler | Create a horizontal guide |
| Drag from left ruler | Create a vertical guide |
| Drag an existing guide | Move the guide |
| Drag guide back to ruler | Delete the guide |
| Alt/Option+drag a guide | Create a measuring guide (shows distance) |

Guides snap to objects and artboard edges.

## Dev Mode (Inspect) Interactions

| Action | Result |
|--------|--------|
| Click an object | Select it; right panel shows code and properties |
| Hover over an object (with one selected) | Show red measurement lines between the selected and hovered objects |
| Alt/Option+hover | Show spacing from selected to all nearby objects |
| Click code snippet | Copy to clipboard |
| Click export button | Download asset in configured format |

## Presentation Mode Interactions

| Action | Result |
|--------|--------|
| Click a hotspot | Trigger the wired interaction (navigate, overlay, etc.) |
| Arrow keys | Step to the next/previous frame |
| R | Restart from the beginning of the flow |
| Escape | Exit presentation mode |
| Click outside hotspots | No effect (or close overlay if configured) |
| Scroll (on scrollable frames) | Scroll the content |
