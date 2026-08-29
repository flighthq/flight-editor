# Flash 8 Mouse Behaviors

Authoritative reference for all mouse interactions in Macromedia Flash Professional 8, organized by tool and context.

## Cursor Vocabulary

Flash uses distinct cursor shapes to communicate what action a click or drag will perform:

| Cursor | Context | Meaning |
|--------|---------|---------|
| Default arrow (black) | Selection Tool over empty area | Click to deselect; drag to marquee-select |
| Arrow with move icon | Selection Tool over a selected object | Drag to move |
| Arrow with corner curve | Selection Tool near an unselected shape edge | Drag to reshape the edge (pull the curve) |
| Arrow with corner angle | Selection Tool near an unselected shape corner | Drag to reshape the corner point |
| Crosshair | Drawing tools (Line, Oval, Rectangle, Pencil, Brush) | Draw |
| I-beam | Text Tool over text | Click to place cursor; drag to select text |
| Eyedropper | Eyedropper Tool | Click to sample |
| Paint bucket | Paint Bucket Tool | Click to fill |
| Ink bottle | Ink Bottle Tool | Click to apply stroke |
| Eraser | Eraser Tool | Drag to erase |
| Open hand | Hand Tool | Drag to pan |
| Grabbing hand | Hand Tool during drag | Currently panning |
| Magnifier with + | Zoom Tool (enlarge) | Click to zoom in |
| Magnifier with − | Zoom Tool (reduce) / Alt+Zoom | Click to zoom out |
| Pen nib | Pen Tool | Click/drag to place point |
| Pen with + | Pen Tool over a path segment | Click to add anchor point |
| Pen with − | Pen Tool over an existing point | Click to delete anchor point |
| Pen with corner | Pen Tool over a smooth point (with Alt) | Click to convert to corner |
| White arrow | Subselection Tool | Select/move anchor points |
| Transform handles | Free Transform Tool | Varies by handle position (see below) |
| Circle snap ring | Selection Tool with Snap to Objects on, near an object | Snapping feedback — the ring changes size when a snap point is found |

## Selection Tool (V)

### Click Behaviors

| Target | Action |
|--------|--------|
| Empty Stage | Deselect all |
| Unselected object | Select it (deselects others) |
| Shift+click unselected object | Add to selection |
| Shift+click selected object | Remove from selection |
| Stroke segment | Select that segment of the stroke |
| Fill region | Select that fill region |
| Double-click fill | Select fill and all connected strokes |
| Double-click stroke | Select the entire contiguous stroke |
| Double-click group | Enter group editing mode |
| Double-click symbol instance | Enter symbol editing mode (Edit in Place) |
| Double-click text | Enter text editing mode |
| Double-click Drawing Object | Enter Drawing Object editing mode |

### Drag Behaviors

| Start Point | Modifier | Action |
|-------------|----------|--------|
| Empty Stage | None | Marquee rectangle selection — selects all objects fully enclosed |
| Selected object | None | Move the selection |
| Selected object | Shift | Constrain movement to horizontal or vertical axis |
| Selected object | Alt | Duplicate the selection and move the copy |
| Selected object | Alt+Shift | Duplicate and constrain movement |
| Unselected shape edge | None | Reshape: pull the edge into a curve (Bezier-like deformation) |
| Unselected shape corner | None | Reshape: drag the corner point to a new position |

### Selection Rectangle (Marquee)

- Drawn from the click point with a dashed-line rectangle
- **Fully enclosed** objects become selected on mouse-up
- Objects only partially inside the rectangle are **not** selected
- Shift+marquee adds to the current selection

### Snap Ring Behavior

When Snap to Objects is enabled (magnet icon in Options, or Ctrl+Shift+/):

- A small circle appears near the cursor when dragging
- The circle enlarges when a snap point is detected (object edge, center, corner, guide, grid)
- The object "locks" to the snap point position
- Snap tolerance is configurable in Edit Snapping settings

## Subselection Tool (A)

### Click Behaviors

| Target | Action |
|--------|--------|
| Path outline | Select the path; all anchor points appear as hollow squares |
| Anchor point (hollow) | Select the point — it becomes solid; Bezier handles appear if it's a smooth point |
| Shift+click point | Add point to selection / remove if already selected |
| Empty Stage | Deselect all |

### Drag Behaviors

| Start Point | Action |
|-------------|--------|
| Selected anchor point | Move the point (path reshapes accordingly) |
| Bezier handle endpoint | Adjust the curve — rotate and lengthen/shorten the handle |
| Alt+drag Bezier handle | Break handle tangent — move one handle independently (creates a corner point) |
| Path segment (between points) | Move the entire segment, adjusting adjacent handles |
| Empty Stage | Marquee-select anchor points |
| Shift+drag | Constrain movement to horizontal/vertical |

## Free Transform Tool (Q)

When an object is selected with the Free Transform Tool, eight square handles appear around a bounding box, plus a circular center point (transform origin).

### Handle Zones

```
[rotate]  [scale-v]  [rotate]
          ─────────
[scale-h] │       │ [scale-h]
[skew-v]  │   ⊕   │ [skew-v]
          │       │
          ─────────
[rotate]  [scale-v]  [rotate]
```

- **Corner handles** (inside the handle): Scale — drag to resize
- **Corner zone** (just outside the handle): Rotate — drag to rotate around the transform origin
- **Side handles**: Scale in one axis
- **Side zone** (between handle and corner, outside the box): Skew — drag to skew along that axis

### Drag Behaviors

| Handle/Zone | Modifier | Action |
|-------------|----------|--------|
| Corner handle | None | Scale freely (non-proportional) |
| Corner handle | Shift | Scale proportionally |
| Corner handle | Alt | Scale from center |
| Corner handle | Shift+Alt | Scale proportionally from center |
| Side handle | None | Scale in one axis |
| Side handle | Alt | Scale from center in one axis |
| Outside corner | None | Free rotation |
| Outside corner | Shift | Rotate in 45° increments |
| Outside side | None | Skew along that axis |
| Center point (⊕) | None | Move the transform origin (pivot point) |
| Inside the box | None | Move the object |

### Transform Sub-Modes (from Options or Modify > Transform)

| Mode | Behavior |
|------|----------|
| Rotate and Skew | Only rotate and skew handles active (no scale) |
| Scale | Only scale handles active |
| Distort | Corner handles can be dragged independently — each corner moves freely, creating a perspective/trapezoid effect |
| Envelope | A Bezier mesh appears — drag envelope points and handles to warp the shape non-linearly |

## Gradient Transform Tool (F)

When a gradient-filled object is selected:

- A bounding circle (radial) or bounding box (linear) appears with handles:
  - **Center point** (circle): move the gradient center/position
  - **Focal point** (small triangle, radial only): move the focal point away from center for off-center highlights
  - **Width handle** (square on the edge): stretch the gradient width
  - **Rotation handle** (circular arrow on the edge): rotate the gradient
  - **Scale handle** (radial: outer edge square): scale the gradient radius

| Handle | Action |
|--------|--------|
| Center point | Drag to reposition the gradient origin |
| Focal point | Drag to offset the highlight center (radial) |
| Width handle | Drag to stretch/squash |
| Rotation handle | Drag to rotate |
| Edge handle | Drag to scale |

For bitmap fills, the same tool shows handles to move, rotate, scale, and skew the fill tiling.

## Lasso Tool (L)

### Freeform Mode (default)

| Action | Behavior |
|--------|----------|
| Click and drag | Draw a freeform loop; releasing closes the loop and selects all raw shape content inside |
| Shift+drag | Add to existing selection |

### Polygon Mode (toggle in Options)

| Action | Behavior |
|--------|----------|
| Click | Place a vertex of the selection polygon |
| Double-click | Close the polygon and select enclosed content |
| Click on first vertex | Close the polygon |

### Magic Wand (Option button)

| Action | Behavior |
|--------|----------|
| Click on a bitmap | Select all pixels within the threshold of the clicked color |
| Magic Wand Settings | Threshold (0–200): color distance tolerance; Smoothing: Pixels / Rough / Normal / Smooth |

## Pen Tool (P)

### Path Creation

| Action | Behavior |
|--------|----------|
| Click on empty stage | Place a corner anchor point |
| Click and drag on empty stage | Place a smooth anchor point — drag length and direction set the Bezier handles |
| Click on the first point | Close the path |
| Shift+click | Constrain new point to 45° angles relative to previous point |
| Double-click (or Escape) | End the open path without closing |

### Path Modification

| Action | Behavior |
|--------|----------|
| Click on a segment (+ cursor) | Add an anchor point on the segment |
| Click on an existing point (− cursor) | Delete the anchor point |
| Alt+click on a smooth point | Convert to corner point (remove handles) |
| Alt+drag on a corner point | Convert to smooth point (pull out handles) |
| Ctrl+drag a point | Temporarily switch to Subselection — move the point |

## Line Tool (N)

| Action | Modifier | Behavior |
|--------|----------|----------|
| Click and drag | None | Draw a line from start to end point |
| Click and drag | Shift | Constrain to 45° angle increments (horizontal, vertical, diagonal) |
| Release | | Line is placed with the current stroke color, height, and style |

If Snap to Objects is on, line endpoints snap to nearby objects.

## Oval Tool (O)

| Action | Modifier | Behavior |
|--------|----------|----------|
| Click and drag | None | Draw an oval from corner to corner of the bounding box |
| Click and drag | Shift | Constrain to a perfect circle |
| Click and drag | Alt | Draw from center instead of corner |
| Click and drag | Shift+Alt | Perfect circle from center |

The oval is drawn with the current stroke and fill colors/styles. If stroke is "no color," only a fill is drawn (and vice versa).

## Rectangle Tool (R)

| Action | Modifier | Behavior |
|--------|----------|----------|
| Click and drag | None | Draw a rectangle from corner to corner |
| Click and drag | Shift | Constrain to a perfect square |
| Click and drag | Alt | Draw from center |
| Click and drag | Shift+Alt | Perfect square from center |

Corner Radius (set in Properties panel Options) rounds the corners. A radius of 0 gives sharp corners.

## PolyStar Tool (under Rectangle)

| Action | Behavior |
|--------|----------|
| Click and drag | Draw a polygon or star, sized by drag distance, rotated by drag angle |

Settings (Properties panel Options button): Style (polygon/star), Number of Sides (3–32), Star Point Size (0–1).

## Pencil Tool (Y)

| Action | Modifier | Behavior |
|--------|----------|----------|
| Click and drag | None | Draw a freeform stroke |
| Click and drag | Shift | Constrain to horizontal or vertical lines |
| Release | | Stroke is processed per the Pencil Mode option (Straighten, Smooth, or Ink) |

### Pencil Modes

| Mode | Post-Processing |
|------|----------------|
| Straighten | Drawn curves are straightened into line segments; near-rectangles and near-ovals become geometric shapes |
| Smooth | Drawn strokes are smoothed (reduce jagginess) |
| Ink | Minimal processing — stroke is preserved nearly as drawn |

## Brush Tool (B)

| Action | Modifier | Behavior |
|--------|----------|----------|
| Click and drag | None | Paint a fill-colored stroke area |
| Click and drag | Shift | Constrain painting to horizontal or vertical |

### Brush Modes (Options dropdown)

| Mode | Behavior |
|------|----------|
| Paint Normal | Paint over everything on the layer |
| Paint Fills | Paint only over fills and empty areas; strokes are preserved |
| Paint Behind | Paint only on empty areas; existing content is preserved |
| Paint Selection | Paint only inside the currently selected fill area |
| Paint Inside | Paint only inside the fill you start painting in; painting outside that shape's boundary has no effect |

### Brush Size and Shape

Selected from the Options dropdowns:
- **Size**: 5 circle sizes from smallest to largest
- **Shape**: Round, Oval (horizontal), Oval (vertical), Oval (diagonal), Square, Line (horizontal), Line (vertical), Line (diagonal)

### Lock Fill

When painting with a gradient or bitmap fill and Lock Fill is on, all brush strokes share a single continuous gradient/bitmap tile, as if painting through a window onto a fixed gradient surface.

### Pressure Sensitivity

With a pressure-sensitive tablet, brush size varies with pen pressure.

## Paint Bucket Tool (K)

| Action | Behavior |
|--------|----------|
| Click inside enclosed area | Fill that area with the current fill color/gradient |
| Click on existing fill | Replace that fill |

### Gap Size (Options dropdown)

| Setting | Behavior |
|---------|----------|
| Don't Close Gaps | Only fills completely enclosed areas |
| Close Small Gaps | Treats tiny gaps as closed |
| Close Medium Gaps | Treats medium gaps as closed |
| Close Large Gaps | Treats large gaps as closed (most tolerant) |

### Lock Fill

Same as Brush Tool — gradient fills are continuous across multiple bucket fills.

## Ink Bottle Tool (S)

| Action | Behavior |
|--------|----------|
| Click on a shape edge/outline | Apply the current stroke color, height, and style to that edge |
| Click on a fill with no stroke | Add a stroke outline around the fill |
| Click on a line | Change the line's stroke properties |

The Ink Bottle does not create new shapes — it modifies or adds strokes to existing paths and shape boundaries.

## Eyedropper Tool (I)

| Target | Behavior |
|--------|----------|
| Click on a fill | Samples the fill color/gradient; automatically switches to Paint Bucket Tool with the sampled fill |
| Click on a stroke | Samples the stroke color, height, and style; automatically switches to Ink Bottle Tool with the sampled stroke |
| Click on a bitmap | Samples the pixel color at the click point |
| Click on text | Samples the text attributes (font, size, color, style) and applies them to newly created text |

The Eyedropper is a one-shot tool — after sampling, it converts to the corresponding application tool (Paint Bucket or Ink Bottle).

## Eraser Tool (E)

| Action | Behavior |
|--------|----------|
| Click and drag | Erase content based on the current eraser mode and shape |
| Double-click Eraser in Tools panel | Erase ALL content on the current layer/frame |

### Eraser Modes

| Mode | Behavior |
|------|----------|
| Erase Normal | Erases all strokes and fills under the eraser |
| Erase Fills | Erases only fills; strokes are untouched |
| Erase Lines | Erases only strokes; fills are untouched |
| Erase Selected Fills | Erases only the currently selected fill |
| Erase Inside | Erases only inside the fill where the erase stroke starts; strokes and other fills are untouched |

### Faucet Mode

Click the Faucet option button, then click on any fill region or stroke segment to delete it entirely in one click.

### Eraser Shape

Five sizes of circle or square, selectable from the Options dropdown.

## Hand Tool (H)

| Action | Behavior |
|--------|----------|
| Click and drag | Pan the Stage view |
| Double-click Hand Tool in Tools panel | Fit in Window (same as Ctrl+3) |
| Spacebar (held from any other tool) | Temporarily switch to Hand — release returns to previous tool |

## Zoom Tool (Z / M)

| Action | Behavior |
|--------|----------|
| Click (Enlarge mode) | Zoom in one step, centered on click position |
| Click (Reduce mode) | Zoom out one step |
| Alt+click (in Enlarge mode) | Zoom out without switching to Reduce |
| Click and drag (Enlarge mode) | Zoom to fit the dragged rectangle in the view |
| Double-click Zoom Tool in Tools panel | Reset to 100% zoom |

### Zoom Levels

Standard steps: 25% → 50% → 100% → 200% → 400% → 800%. Each click jumps to the next level in that direction. The zoom dropdown in the Edit Bar shows custom levels and presets (Fit in Window, Show All, Show Frame).

### Mouse Wheel Zoom

| Action | Behavior |
|--------|----------|
| Mouse wheel | Scroll Stage vertically |
| Shift+mouse wheel | Scroll Stage horizontally |
| Ctrl+mouse wheel | Zoom in/out |

## Text Tool (T)

| Action | Behavior |
|--------|----------|
| Click on empty Stage | Create an expanding-width text field (grows as you type) |
| Click and drag on empty Stage | Create a fixed-width text field (width set by drag; height grows with content) |
| Click on existing text | Place the text cursor at the click position within the field |
| Double-click on a word | Select the word |
| Triple-click | Select the entire paragraph |
| Click and drag within text | Select a range of characters |
| Shift+click | Extend selection from cursor to click position |
| Drag the square handle at top-right of text field | Resize the text field width (round handle = expanding; square handle = fixed-width) |

### Text Field Handles

- **Round handle** (top-right corner): indicates an expanding-width field — double-click to toggle to fixed-width
- **Square handle** (top-right corner): indicates a fixed-width field — drag to resize width; double-click to toggle to expanding

## Timeline Mouse Interactions

### Frame Grid

| Action | Behavior |
|--------|----------|
| Click on a frame | Select that frame; move the playhead there |
| Click and drag across frames | Select a range of frames on one layer |
| Shift+click | Extend frame selection |
| Ctrl+click | Add individual frames to selection (non-contiguous) |
| Drag a keyframe | Move the keyframe to a different frame position |
| Ctrl+drag a keyframe | Copy the keyframe to a different position |
| Right-click a frame | Frame context menu |
| Double-click an empty frame | Insert a Keyframe at that position |
| Drag the playhead (red rectangle) | Scrub through the timeline |
| Click a frame number in the header | Jump playhead to that frame |

### Layer List

| Action | Behavior |
|--------|----------|
| Click a layer name | Select and activate that layer |
| Double-click a layer name | Rename the layer inline |
| Double-click a layer icon | Open Layer Properties dialog |
| Drag a layer up/down | Reorder layers |
| Drag a layer onto a folder | Nest the layer inside the folder |
| Click the Eye icon (per layer) | Toggle visibility for that layer |
| Click the Eye column header | Toggle visibility for all layers |
| Alt+click the Eye icon | Solo: show only this layer, hide all others |
| Click the Lock icon (per layer) | Toggle lock for that layer |
| Click the Lock column header | Toggle lock for all layers |
| Alt+click the Lock icon | Lock all others, unlock this one |
| Click the Outline square (per layer) | Toggle outline display for that layer |
| Click the Outline column header | Toggle outline display for all layers |
| Right-click a layer | Layer context menu |

## Ruler and Guide Interactions

| Action | Behavior |
|--------|----------|
| Drag from horizontal ruler | Create a horizontal guide (green line) |
| Drag from vertical ruler | Create a vertical guide |
| Drag a guide on Stage | Move the guide (if not locked) |
| Drag a guide back to its ruler | Delete the guide |
| Double-click a guide | Open Edit Guides dialog |

## Stage / Pasteboard Interactions

| Action | Behavior |
|--------|----------|
| Right-click on Stage (no object) | Stage context menu (zoom, paste, grid, guides, snap options) |
| Right-click on object | Object context menu (cut, copy, arrange, convert to symbol, etc.) |
| Scroll bars | Scroll the Stage view when zoomed or when Stage exceeds the visible area |
| Ctrl+mouse wheel | Zoom in/out centered on cursor position |

## Library Panel Mouse Interactions

| Action | Behavior |
|--------|----------|
| Drag item from Library to Stage | Place an instance of that symbol/bitmap on the Stage |
| Double-click a symbol | Enter symbol editing mode |
| Double-click a bitmap | Open bitmap properties |
| Double-click a sound | Open sound properties |
| Click column header | Sort by that column |
| Right-click an item | Library item context menu |
| Drag item to folder | Organize into folder |
| Click preview Play button (MovieClips) | Play the MovieClip animation in the preview pane |

## Color Chip Mouse Interactions

In both the Tools panel and the Properties panel:

| Action | Behavior |
|--------|----------|
| Click color chip | Open the swatch popup picker |
| Click a swatch | Apply that color and close the popup |
| Click the hex field | Type a hex color value |
| Click the Color Wheel button | Open the system color picker dialog (full RGB/HSB) |
| Click No Color (red diagonal) | Set to no color (transparent for fills, no stroke for strokes) |
| Click outside the popup | Close without change |

## Snap Align Visual Feedback

When Snap Align is enabled (View > Snapping > Snap Align), moving objects shows temporary dashed alignment lines:

- **Edge alignment lines**: appear when an object's edge aligns with another object's edge
- **Center alignment lines**: appear when an object's center aligns with another's center or edge
- **Spacing guides**: appear when equal spacing between objects is achieved
- **Stage edge guides**: appear when an object nears the Stage boundary (configurable tolerance)

These lines are temporary and disappear when the object is released or moved away from alignment.
