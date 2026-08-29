# Adobe XD Tools

Authoritative reference for all tools in Adobe XD. XD's tool set is deliberately minimal compared to Illustrator or Photoshop — it focuses on the tools needed for UI/UX design.

## Toolbar Layout

The toolbar is a horizontal strip at the top of the window. Tools are arranged as a single row of icon buttons:

```
[Select] [Rectangle] [Ellipse] [Line] [Pen] [Text] [Artboard]
   V          R          E       L      P      T        A
```

The active tool is highlighted. Only one tool is active at a time (except temporary tool switches via modifier keys).

## Select Tool (V)

The primary interaction tool. Used for selecting, moving, resizing, and rotating objects.

### Purpose
Select, move, resize, rotate, and directly edit objects on the canvas.

### Cursor States

| Cursor | Context |
|--------|---------|
| Default arrow | Over empty canvas |
| Arrow with move | Over a selected object's body |
| Resize handle (double arrow) | Over a bounding box edge or corner handle |
| Rotation (curved arrow) | Near a corner handle (slightly outside the bounding box) |
| I-beam | Over text content (double-click to enter text editing) |

### Click Behaviors

| Target | Action |
|--------|--------|
| Empty canvas | Deselect all |
| Object | Select it (deselects others) |
| Shift+click object | Add to / remove from selection |
| Object inside a group | Select the group (first click); click again to direct-select the child |
| Double-click group | Enter the group (isolation mode) |
| Double-click component instance | Enter the component (isolation mode) |
| Double-click text | Enter text editing mode |
| Double-click path | Enter path editing mode (show anchor points) |
| Escape | Exit current isolation/editing mode, go up one level |

### Drag Behaviors

| Start | Modifier | Action |
|-------|----------|--------|
| Empty canvas | None | Marquee selection rectangle (selects objects that intersect) |
| Selected object body | None | Move the selection |
| Selected object body | Shift | Constrain movement to horizontal, vertical, or 45° diagonal |
| Selected object body | Alt/Option | Duplicate the selection and move the copy |
| Selected object body | Alt+Shift | Duplicate and constrain |
| Corner resize handle | None | Scale freely (non-proportional) |
| Corner resize handle | Shift | Scale proportionally |
| Corner resize handle | Alt/Option | Scale from center |
| Corner resize handle | Shift+Alt | Scale proportionally from center |
| Side resize handle | None | Resize in one axis |
| Near a corner (outside) | None | Rotate freely |
| Near a corner (outside) | Shift | Rotate in 15° increments |
| Border radius handle (blue circle on rounded rectangle) | None | Adjust corner radius |

### Bounding Box

When an object is selected, it shows:
- **Eight handles**: four corners + four side midpoints (small squares)
- **Border radius handles**: small blue circles inside corners of rectangles (drag to adjust rounding)
- **Rotation affordance**: hovering just outside a corner handle changes cursor to rotation
- **Width/Height labels**: dimensions shown near handles during resize

### Direct Selection (Path Editing)

Double-click a path with the Select tool to enter path editing mode:
- Anchor points appear as small squares (corner) or circles (smooth)
- Click a point to select it; Shift+click to multi-select
- Drag a point to move it
- Drag a Bezier handle to adjust curves
- Double-click a smooth point to convert to corner (and vice versa)
- Click a segment to add a point
- Select a point and press Delete to remove it
- Press Escape to exit path editing

## Rectangle Tool (R)

### Purpose
Draw rectangles and squares.

### Behaviors

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw a rectangle from corner to corner |
| Click and drag | Shift | Constrain to a perfect square |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Perfect square from center |

### Properties on Creation
- Inherits the last-used fill color, border color, and border width
- Default: white fill, no border
- Corner radius: set in Properties panel after creation, or drag the blue radius handles

### Corner Radius Handles
After creation, the rectangle shows small blue circle handles at each corner (visible when selected with the Select tool):
- **Drag any one handle** to set all corners uniformly
- **Alt/Option+drag one handle** to adjust that single corner independently
- Once independent, each corner can have a different radius

## Ellipse Tool (E)

### Purpose
Draw ellipses and circles.

### Behaviors

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw an ellipse from corner of bounding box |
| Click and drag | Shift | Constrain to a perfect circle |
| Click and drag | Alt/Option | Draw from center |
| Click and drag | Shift+Alt | Perfect circle from center |

### Pie/Arc Controls
After creation, selected ellipses show a small handle on the perimeter. Drag it to create a pie/arc shape by adjusting the sweep angle. The Property Inspector shows start angle and sweep fields.

## Line Tool (L)

### Purpose
Draw straight lines.

### Behaviors

| Action | Modifier | Result |
|--------|----------|--------|
| Click and drag | None | Draw a line from start to end point |
| Click and drag | Shift | Constrain to 45° angle increments |

Lines have stroke properties but no fill. End caps and dash patterns are configurable in the Property Inspector.

## Pen Tool (P)

### Purpose
Draw precise vector paths with anchor points and Bezier curves.

### Path Creation

| Action | Result |
|--------|--------|
| Click | Place a corner anchor point (straight segments) |
| Click and drag | Place a smooth anchor point; drag length and direction set Bezier handles |
| Click on the first point | Close the path |
| Double-click | End the open path |
| Escape | End the open path and switch to Select tool |
| Shift+click | Constrain new point to 45° angles relative to the previous point |

### Path Editing (while drawing)

| Action | Result |
|--------|--------|
| Alt/Option+click on a smooth point | Convert to corner point |
| Alt/Option+drag from a corner point | Pull out handles to convert to smooth |
| Alt/Option+drag one handle | Break handle symmetry (independent handles) |
| Ctrl/Cmd (held) | Temporarily switch to Select tool to reposition points |
| Click on a segment | Add a new anchor point on the segment |
| Click on an existing point | Remove the anchor point |

### Cursor States

| Cursor | Context |
|--------|---------|
| Pen nib | Default — ready to place a point |
| Pen with + | Over a path segment — click to add point |
| Pen with − | Over an existing anchor point — click to remove |
| Pen with ○ | Over the first point — click to close the path |

### Path Behavior Notes
- Open paths have visible start and end points
- Closed paths can have a fill applied
- Paths can be combined with Boolean operations (Unite, Subtract, Intersect, Exclude)
- Convert between corner and smooth points by double-clicking them in path editing mode (Select tool)

## Text Tool (T)

### Purpose
Create and edit text content.

### Creation Behaviors

| Action | Result |
|--------|--------|
| Click on canvas | Create a point text object (auto-width — grows horizontally as you type) |
| Click and drag | Create an area text box (fixed width — text wraps; height auto-grows or is fixed based on settings) |
| Click on existing text | Enter text editing mode at the click position |

### Text Editing

| Action | Result |
|--------|--------|
| Double-click word | Select the word |
| Triple-click | Select the entire text block |
| Click and drag | Select a range of characters |
| Shift+click | Extend selection to click position |
| Ctrl/Cmd+A (inside text) | Select all text in the object |
| Escape | Exit text editing, return to Select tool |

### Text Object Types

| Type | Behavior |
|------|----------|
| **Point text** | Width grows with content; no wrapping; single line by default (Enter for new lines). Indicated by no width handle on the right edge. |
| **Area text** | Fixed width; text wraps at boundary; height either auto-grows or is fixed. Indicated by width handles on left/right edges and a height handle at bottom. |

Toggle between point and area text by double-clicking the side handle on the text bounding box.

### Auto-Height vs Fixed-Height
- **Auto-height** (default): the text box height grows to fit content
- **Fixed-height**: set an explicit height; content that overflows is clipped (indicated by a red + overflow indicator at the bottom)

## Artboard Tool (A)

### Purpose
Create and manage artboards — the "screens" or "pages" of a design.

### Creation Behaviors

| Action | Result |
|--------|--------|
| Click and drag on empty canvas | Create a custom-sized artboard |
| Click a preset in the Property Inspector | Create an artboard with preset dimensions (iPhone, iPad, Web, custom sizes, etc.) |

### Artboard Presets (Property Inspector when Artboard tool is active)

| Category | Presets |
|----------|---------|
| iPhone | iPhone SE (375×667), iPhone 8 (375×667), iPhone 8 Plus (414×736), iPhone X/XS (375×812), iPhone XR (414×896), iPhone 11 Pro Max (414×896), iPhone 12 (390×844), iPhone 12 Pro Max (428×926) |
| iPad | iPad Mini (768×1024), iPad Pro 11" (834×1194), iPad Pro 12.9" (1024×1366) |
| Web | Web 1920 (1920×1080), Web 1366 (1366×768), Web 1280 (1280×800) |
| Android | Various device sizes |
| Custom Size | User-defined W×H |

### Artboard Behaviors

| Action | Result |
|--------|--------|
| Click an artboard name label | Select the artboard (shows bounding handles) |
| Double-click artboard name | Rename the artboard inline |
| Drag artboard name or edge | Move the artboard (with all its content) |
| Resize artboard handles | Resize the artboard; content inside may clip or reflow depending on Responsive Resize settings |
| Drag an object from pasteboard into an artboard | Object becomes a child of that artboard |
| Drag an object from an artboard to pasteboard | Object is removed from the artboard |

### Artboard Name
- Displayed above the artboard in a non-selectable label
- The label is always visible (does not scale with zoom)
- Name is used as the screen name in prototypes and exported filenames

## Zoom and Pan (not tool-bar tools)

These are navigation behaviors available from any tool:

| Action | Result |
|--------|--------|
| Space + drag | Pan the canvas (temporary Hand tool) |
| Ctrl/Cmd + scroll wheel | Zoom in/out centered on cursor |
| Ctrl/Cmd + = | Zoom in |
| Ctrl/Cmd + − | Zoom out |
| Ctrl/Cmd + 0 | Zoom to fit all artboards |
| Ctrl/Cmd + 1 | Zoom to 100% |
| Ctrl/Cmd + 3 | Zoom to selection |
| Pinch gesture (trackpad) | Zoom in/out |
| Two-finger scroll (trackpad) | Pan canvas |

## Temporary Tool Modifiers

| Modifier | From Any Tool | Effect |
|----------|---------------|--------|
| Space (held) | Any | Temporarily switch to pan (Hand) |
| Ctrl/Cmd (held, while using Pen) | Pen | Temporarily switch to Select (move points) |
| Alt/Option (held, while dragging) | Select | Duplicate the dragged object |

## Tool Persistence

- The selected tool remains active after one use (draw a rectangle, then draw another without reselecting)
- Exception: switching to Select (V) after completing a text creation (XD auto-switches to text editing, then to Select after pressing Escape)
- All tools remember their last-used styling (fill, border, text properties) for newly created objects

## Flight Adaptation Notes

Apply [the shared XD tool and gesture contract](./adobe-xd-implementation-contract.md#interaction-and-focus).

- Tools are shared state machines; desktop, VS Code, and in-app surfaces may present different buttons for the same tool IDs.
- Drawing, transform, path, radius, arc, text-box, and artboard gestures preview continuously but commit once and cancel exactly.
- Artboard labels and handles are editor overlays. Artboard content and containment are durable document data.
- Path editing depends on authoring-safe upstream topology and geometry queries; omit it until those contracts are present.
- Inherited appearance is an explicit editor preference, not hidden global state.
- Tool activation, temporary overrides, editing scopes, focus, and incomplete-path behavior need keyboard and pointer-cancellation tests.
