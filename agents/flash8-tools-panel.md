# Flash 8 Tools Panel

Authoritative reference for the Tools panel in Macromedia Flash Professional 8. The Tools panel is a vertical toolbar docked on the left edge of the workspace.

## Panel Structure

The Tools panel is divided into four sections, separated by thin divider lines:

1. **Tools** — drawing and selection tools
2. **View** — navigation tools
3. **Colors** — stroke and fill color controls
4. **Options** — context-sensitive modifier buttons for the active tool

## Tools Section

Listed top-to-bottom as they appear in the panel. Indented tools are hidden sub-tools accessed by clicking and holding the parent tool's button (indicated by a small triangle in the bottom-right corner).

### Selection and Transform

| Tool | Shortcut | Icon Description | Purpose |
|------|----------|-----------------|---------|
| **Selection Tool** (Arrow) | V | Black arrow pointer | Select, move, and reshape objects by dragging edges/corners |
| **Subselection Tool** | A | White arrow pointer | Select and manipulate individual anchor points and Bezier handles |
| **Free Transform Tool** | Q | Arrow with transform box | Scale, rotate, skew, distort, and envelope objects |
| └ **Gradient Transform Tool** | F | Arrow with gradient icon | Edit gradient and bitmap fill position, scale, rotation, and focal point |

### Drawing

| Tool | Shortcut | Icon Description | Purpose |
|------|----------|-----------------|---------|
| **Line Tool** | N | Diagonal line segment | Draw straight lines |
| **Lasso Tool** | L | Lasso rope loop | Freeform selection area on raw shapes |
| └ **Polygon Lasso** | (via Options) | Polygon shape | Click-to-place vertex selection polygon |
| **Pen Tool** | P | Fountain pen nib | Draw precise Bezier paths point by point |
| └ **Add Anchor Point** | = | Pen with + | Add a point to an existing path segment |
| └ **Delete Anchor Point** | - | Pen with − | Remove a point from a path |
| └ **Convert Anchor Point** | C | Pen with angle | Convert between smooth and corner anchor points |
| **Text Tool** | T | Capital letter A | Create and edit text fields |
| **Oval Tool** | O | Ellipse outline | Draw ellipses and circles (stroke + fill) |
| └ **Oval Primitive Tool** | (same group) | Ellipse with dot | Draw oval primitives with editable properties |
| **Rectangle Tool** | R | Rectangle outline | Draw rectangles and rounded rectangles (stroke + fill) |
| └ **Rectangle Primitive Tool** | (same group) | Rect with dot | Draw rectangle primitives with editable corner radius |
| └ **PolyStar Tool** | (same group) | Star shape | Draw polygons and stars with configurable sides |
| **Pencil Tool** | Y | Pencil | Draw freeform strokes (lines) |
| **Brush Tool** | B | Paintbrush | Paint freeform fills |
| **Ink Bottle Tool** | S | Ink bottle | Apply or change stroke color/style on existing shape edges |
| **Paint Bucket Tool** | K | Paint bucket tipping | Fill enclosed areas with the current fill color or gradient |
| **Eyedropper Tool** | I | Eyedropper | Sample fill or stroke attributes from existing content |
| **Eraser Tool** | E | Eraser block | Erase drawn content |

### View Section

| Tool | Shortcut | Icon Description | Purpose |
|------|----------|-----------------|---------|
| **Hand Tool** | H | Open hand | Pan/scroll the Stage view |
| **Zoom Tool** | Z (or M) | Magnifying glass | Zoom in (click) or out (Alt+click); drag a rectangle to zoom to area |

## Colors Section

Located below the View tools. Contains:

```
  ┌────┐ ┌────┐
  │ S  │ │    │   S = Stroke color chip (top-left, outlined square)
  │    │ │ F  │   F = Fill color chip (bottom-right, filled square)
  └────┘ │    │       (they overlap; stroke is behind fill)
         └────┘
   ◻ ↔           ◻ = Default Colors button (tiny black/white squares)
                  ↔ = Swap Colors button (curved double arrow)
   ⊘              ⊘ = No Color button (white square with red diagonal)
```

### Color Chip Behavior

- **Click** on either chip to open the color picker popup (a grid of swatches + hex input + color wheel button + No Color button at top + system color picker button).
- The stroke chip has a **square with an outlined center** (representing a stroke). The fill chip has a **solid filled square**.
- **Swap Colors** button swaps the current stroke and fill colors.
- **Default Colors** button resets to black stroke / white fill.
- **No Color** button applies no color to the currently active chip (stroke or fill); for stroke, this means no stroke; for fill, this means no fill. Shown as a white square with a red diagonal line.

### Color Picker Popup

When clicking a color chip, a popup appears:

- **Swatch grid** — 216 web-safe colors in a grid
- **Hex input** — text field showing/accepting `#RRGGBB` values
- **No Color** button — top of popup (white with red line)
- **Color wheel** button — opens the system color picker dialog for full RGB/HSB control
- **Alpha** — not available in the toolbar picker; alpha is set in the Color Mixer panel or Properties panel

## Options Section

The Options area at the bottom of the Tools panel shows modifier buttons that change based on the currently selected tool. Only visible/relevant modifiers appear.

### Options by Tool

**Selection Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Snap to Objects | Magnet | Toggle magnetic snapping to other objects |
| Smooth | Curve | Smooth the selected path |
| Straighten | Angle | Straighten the selected path |

**Subselection Tool:**
No options shown.

**Free Transform Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Snap to Objects | Magnet | Toggle snapping |
| Rotate and Skew | Circular arrows | Constrain to rotate/skew mode |
| Scale | Corner arrows | Constrain to scale mode |
| Distort | Pushed corner | Drag individual corners freely |
| Envelope | Mesh | Warp using Bezier control mesh |

**Gradient Transform Tool:**
No additional options.

**Lasso Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Magic Wand | Wand with sparkle | Click-to-select by color similarity on bitmaps |
| Magic Wand Settings | Wand + gear | Set threshold and smoothing for magic wand |
| Polygon Mode | Polygon outline | Switch to click-to-place polygon selection |

**Pen Tool:**
No options (sub-tools selected via flyout).

**Line Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Snap to Objects | Magnet | Toggle snapping |

**Oval Tool / Rectangle Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Snap to Objects | Magnet | Toggle snapping |

(Rectangle Tool also shows Object Drawing toggle.)

**Pencil Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Straighten | Angular line | Drawn strokes are auto-straightened into straight segments |
| Smooth | Wavy line | Drawn strokes are auto-smoothed into curves |
| Ink | Freeform line | Drawn strokes are kept as-is (minimal processing) |

**Brush Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Object Drawing | Circle in square | Toggle object drawing mode (creates drawing objects instead of raw shapes) |
| Lock Fill | Lock icon | When painting with a gradient, all brushed areas share one continuous gradient |
| Brush Mode | Dropdown | Paint Normal, Paint Fills, Paint Behind, Paint Selection, Paint Inside |
| Brush Size | Dropdown | Small to large circle sizes |
| Brush Shape | Dropdown | Round, Ellipse (various angles), Square, Line (various angles) |

**Paint Bucket Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Gap Size | Dropdown | Don't Close Gaps / Close Small Gaps / Close Medium Gaps / Close Large Gaps |
| Lock Fill | Lock icon | Shared gradient fill across multiple bucket fills |

**Ink Bottle Tool:**
No options shown (stroke properties configured in Properties panel).

**Eyedropper Tool:**
No options.

**Eraser Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Eraser Mode | Dropdown | Erase Normal / Erase Fills / Erase Lines / Erase Selected Fills / Erase Inside |
| Eraser Shape | Dropdown | Round or square, five sizes each |
| Faucet | Faucet icon | Click to delete an entire fill region or stroke segment in one click |

**Hand Tool:**
No options.

**Zoom Tool:**
| Option | Icon | Behavior |
|--------|------|----------|
| Enlarge | Magnifier with + | Click to zoom in (default) |
| Reduce | Magnifier with − | Click to zoom out |

## Object Drawing Mode

Some drawing tools (Oval, Rectangle, Pencil, Brush, Line) offer an **Object Drawing** toggle in the Options section (circle-in-square icon, or press **J** to toggle). When active:

- Drawn content is automatically placed inside a **Drawing Object** (a container), not as raw vector data on the canvas.
- Drawing Objects do not merge with overlapping shapes (raw shapes auto-merge/cut on the same layer).
- Drawing Objects show a blue highlight rectangle when selected.
- Double-click to enter and edit the raw shapes inside.

## Tool Keyboard Shortcut Summary

| Key | Tool |
|-----|------|
| V | Selection (Arrow) |
| A | Subselection |
| Q | Free Transform |
| F | Gradient Transform |
| N | Line |
| L | Lasso |
| P | Pen |
| T | Text |
| O | Oval |
| R | Rectangle |
| Y | Pencil |
| B | Brush |
| S | Ink Bottle |
| K | Paint Bucket |
| I | Eyedropper |
| E | Eraser |
| H | Hand |
| Z / M | Zoom |
| J | Toggle Object Drawing mode |
