# Flash 8 Properties Panel (Inspector)

Authoritative reference for the Properties panel in Macromedia Flash Professional 8. The Properties panel is context-sensitive — its contents change based on what is currently selected.

For Flight implementation decisions, this historical reference is subordinate to the [Flash 8-inspired implementation contract](./flash8-implementation-contract.md).

## Panel Chrome

**Default position:** Docked at the bottom of the workspace, spanning full width.
**Shortcut:** Ctrl+F3

The panel has:
- **Title area** — shows "Properties" with a collapse triangle and gripper
- **Tab row** — the Properties panel shares its dock area with the **Filters** tab and the **Parameters** tab (the latter appears only when a component instance is selected)
- **Content area** — varies by selection context (detailed below)
- The panel can be expanded to show two rows of controls (default) or collapsed to one row via the panel's expand/collapse triangle

## Context: No Selection (Document Properties)

When nothing is selected on the Stage and no frame-specific context is active, the Properties panel shows document-level settings.

| Field | Type | Description |
|-------|------|-------------|
| Size button | Button | Shows current dimensions (e.g., "550 x 400 pixels"); click to open Document Properties dialog |
| Publish button | Button | Opens Publish Settings dialog |
| Background color | Color chip | Stage background color; click to change |
| Frame rate | Numeric input | Frames per second (e.g., "12" or "24 fps"); editable in place |
| Player dropdown | Dropdown | Target Flash Player version (Flash Player 7, 8, etc.) |
| ActionScript version dropdown | Dropdown | ActionScript 1.0 / ActionScript 2.0 |

### Document Properties Dialog (opened by clicking Size button)

| Field | Description |
|-------|-------------|
| Title | Document title (for accessibility and HTML) |
| Description | Document description |
| Dimensions | Width × Height in pixels, with "Match: Default / Contents / Printer" buttons |
| Match: Default | 550×400 |
| Match: Contents | Fit to content bounds |
| Match: Printer | Match printable area |
| Background color | Color picker for Stage background |
| Frame rate | FPS |
| Ruler units | Pixels, Inches, Inches (decimal), Points, Centimeters, Millimeters |
| Make Default | Save these settings as the default for new documents |

## Context: Shape Selected (Raw Vector)

When a raw shape (not a Drawing Object or symbol instance) is selected:

| Field | Type | Description |
|-------|------|-------------|
| Shape indicator | Label | Shows "Shape" |
| W | Numeric input | Width in pixels |
| H | Numeric input | Height in pixels |
| X | Numeric input | X position (top-left corner) |
| Y | Numeric input | Y position (top-left corner) |
| Lock W/H | Chain link | Constrain proportions |
| Fill color | Color chip | Fill color of the selected shape; click to change |
| Stroke color | Color chip | Stroke color |
| Stroke height | Numeric input + slider | Stroke thickness (0.1 to 200, in 0.25 increments; Hairline option) |
| Stroke style | Dropdown | Solid, Dashed, Dotted, Ragged, Stipple, Hatched |
| Custom... | Button | Opens Stroke Style dialog for detailed stroke customization |
| Cap | Dropdown | None, Round, Square (line cap style) |
| Join | Dropdown | Miter, Round, Bevel (line join style) |
| Miter limit | Numeric | Maximum miter length (when Join is Miter) |
| Scale | Dropdown | Normal, None, Horizontal, Vertical (how stroke scales with object transform) |
| Hinting | Checkbox | Snap strokes to pixel boundaries for crisp rendering |

### Stroke Style Dialog

Accessible via the Custom button. Allows detailed control:
- **Type:** Hairline, Solid, Dashed, Dotted, Ragged, Stipple, Hatched
- Each type has unique parameters (dash length/gap, dot spacing, wave height/length, hatch angle/spacing/thickness)
- **Thickness** preview
- **Sharp Corners** toggle

## Context: Drawing Object Selected

Same as shape, but the label shows "Drawing Object" and the object is treated as a single unit.

## Context: Symbol Instance Selected (Movie Clip, Button, Graphic)

When a symbol instance on the Stage is selected:

### Top Row

| Field | Type | Description |
|-------|------|-------------|
| Symbol type icon | Icon | Movie Clip / Button / Graphic icon |
| Instance name | Text input | Instance name for ActionScript targeting (e.g., "myClip_mc") |
| Behavior dropdown | Dropdown | Movie Clip / Button / Graphic — changes the instance behavior type |
| Swap button | Button | Opens Swap Symbol dialog to replace with a different library symbol |

### Geometry

| Field | Type | Description |
|-------|------|-------------|
| W | Numeric input | Width in pixels |
| H | Numeric input | Height in pixels |
| X | Numeric input | X position of registration point |
| Y | Numeric input | Y position of registration point |
| Lock W/H | Chain link | Constrain proportions |

### Color Effect (dropdown)

| Effect | Controls |
|--------|----------|
| None | No color modification |
| Brightness | Slider: −100% (black) to +100% (white) |
| Tint | Color picker + amount slider (0–100%); blends tint color with original |
| Alpha | Slider: 0% (invisible) to 100% (opaque) |
| Advanced | Four rows (Red, Green, Blue, Alpha) × two columns (multiply %, offset): `newColor = original × (multiply/100) + offset` |

### Blend Mode (dropdown, Movie Clip instances only)

Normal, Layer, Darken, Multiply, Lighten, Screen, Overlay, Hard Light, Add, Subtract, Difference, Invert, Alpha, Erase

### For Graphic Instances Specifically

| Field | Type | Description |
|-------|------|-------------|
| Loop dropdown | Dropdown | Loop / Play Once / Single Frame |
| First frame | Numeric input | Starting frame number for the graphic's internal timeline |

### Swap Symbol Dialog

- Shows a list of all symbols in the Library
- Filter by name
- Preview of the selected symbol
- Select a replacement; the instance on Stage swaps to the new symbol while keeping position, transform, and instance name

## Context: Filters Tab (Symbol Instances)

When a Movie Clip instance is selected, the **Filters** tab becomes available:

### Available Filters

| Filter | Parameters |
|--------|-----------|
| Drop Shadow | Blur X/Y, Strength, Quality, Angle, Distance, Knockout, Inner Shadow, Hide Object, Color |
| Blur | Blur X/Y, Quality (Low/Medium/High) |
| Glow | Blur X/Y, Strength, Quality, Color, Knockout, Inner Glow |
| Bevel | Blur X/Y, Strength, Quality, Angle, Distance, Knockout, Type (Inner/Outer/Full), Shadow Color, Highlight Color |
| Gradient Glow | Same as Glow but with a gradient color bar for multi-color glow |
| Gradient Bevel | Same as Bevel but with a gradient color bar |
| Adjust Color | Brightness, Contrast, Saturation, Hue (sliders) |

### Filter Controls

| Button | Action |
|--------|--------|
| Add Filter (+) | Dropdown to add a new filter |
| Remove Filter (−) | Remove the selected filter |
| Clipboard | Copy/Paste filter presets |
| Reset | Reset selected filter to defaults |
| Enable/Disable | Checkbox next to each filter name to toggle without removing |
| Presets | Save/load named filter presets |

Filters stack — order matters (drag to reorder). Multiple instances of the same filter type can be applied.

## Context: Text Field Selected

When a text field is selected on the Stage:

### Text Type Row

| Field | Type | Description |
|-------|------|-------------|
| Text type dropdown | Dropdown | Static Text / Dynamic Text / Input Text |
| Instance name | Text input | (Dynamic and Input text only) Instance name for ActionScript |
| Line type | Dropdown | Single Line / Multiline / Multiline no wrap / Password (Input text) |

### Font Properties

| Field | Type | Description |
|-------|------|-------------|
| Font family | Dropdown | Font name with preview; system fonts list |
| Font size | Numeric input | Size in points |
| Font color | Color chip | Text color |
| Bold | Toggle button (B) | Bold weight |
| Italic | Toggle button (I) | Italic style |
| Align | Four toggle buttons | Left / Center / Right / Justify |
| Format Options button | Button | Opens Format Options dialog |

### Format Options Dialog

| Field | Description |
|-------|-------------|
| Indent | First-line indent in pixels |
| Line spacing | Leading in points |
| Left margin | Left margin in pixels |
| Right margin | Right margin in pixels |

### Additional Text Properties

| Field | Type | Description |
|-------|------|-------------|
| Letter spacing | Numeric input | Tracking (extra space between characters) |
| Auto Kern | Checkbox | Use the font's built-in kerning pairs |
| Character Position | Dropdown | Normal / Superscript / Subscript |
| URL link | Text input | (Static text) Hyperlink URL |
| Target | Dropdown | _self, _blank, _parent, _top |
| Selectable | Toggle button | (Static text) Whether text can be selected by the user at runtime |
| Render text as HTML | Toggle button | (Dynamic text) Interpret HTML tags |
| Show border | Toggle button | (Dynamic/Input) Show text field border and background |
| Device Fonts | Button | Use device fonts instead of embedded (Static text) |
| Embed button | Button | (Dynamic/Input) Opens Character Embedding dialog |

### Character Embedding Dialog (Dynamic/Input Text)

Select which character ranges to embed in the SWF:
- Uppercase, Lowercase, Numerals, Punctuation, Basic Latin, Japanese, Korean, Chinese, and more
- Or specify exact characters in a text field
- Auto Fill button (uses characters found on the Stage)
- Total character count displayed

## Context: Group Selected

When a group (Modify > Group) is selected:

| Field | Type | Description |
|-------|------|-------------|
| Group indicator | Label | Shows "Group" |
| W, H | Numeric inputs | Dimensions |
| X, Y | Numeric inputs | Position |
| Lock W/H | Chain link | Constrain proportions |

No stroke/fill controls — those are accessible by double-clicking to enter the group.

## Context: Bitmap Selected

When an imported bitmap on the Stage is selected:

| Field | Type | Description |
|-------|------|-------------|
| Bitmap indicator | Label | Shows the bitmap name |
| W, H | Numeric inputs | Dimensions |
| X, Y | Numeric inputs | Position |
| Swap button | Button | Opens Swap Bitmap dialog to replace with a different library bitmap |
| Edit button | Button | Opens the bitmap in the configured external image editor |

## Context: Frame Selected (Timeline)

When clicking on a frame in the Timeline (and nothing on Stage is selected):

| Field | Type | Description |
|-------|------|-------------|
| Frame label | Text input | Name for this frame (used as a navigation target) |
| Label type | Dropdown | Name / Comment / Anchor |
| Tween | Dropdown | None / Motion / Shape |
| Sound | Dropdown | List of sounds in the Library; select to assign to this frame |
| Effect | Dropdown | (When sound assigned) None / Left Channel / Right Channel / Fade Left to Right / Fade Right to Left / Fade In / Fade Out / Custom (opens envelope editor) |
| Sync | Dropdown | Event / Start / Stop / Stream |
| Repeat/Loop | Input + dropdown | Number of times to repeat, or "Loop" |
| Edit (sound) | Button | Opens Sound Envelope editor |

### Motion Tween Properties (when Tween = Motion)

| Field | Type | Description |
|-------|------|-------------|
| Scale | Checkbox | Tween scale changes |
| Ease | Slider + numeric (−100 to 100) | Negative = ease in (slow start), Positive = ease out (slow end) |
| Rotate | Dropdown | Auto / CW / CCW / None, with count input |
| Orient to Path | Checkbox | Rotate object to follow a motion guide path's direction |
| Sync | Checkbox | Synchronize symbol animation with the main timeline |
| Snap | Checkbox | Snap object to a motion guide path |

### Shape Tween Properties (when Tween = Shape)

| Field | Type | Description |
|-------|------|-------------|
| Ease | Slider + numeric (−100 to 100) | Same as motion tween easing |
| Blend | Dropdown | Distributive (smooth) / Angular (preserve corners) |

## Context: Tool Selected (No Object Selection)

When a drawing tool is active but nothing on the Stage is selected, the Properties panel shows tool-specific options. These are persistent — changing them affects subsequent draws.

### Line Tool

| Field | Description |
|-------|-------------|
| Stroke color | Color chip |
| Stroke height | Thickness |
| Stroke style | Solid, Dashed, Dotted, etc. |
| Cap, Join, Miter | Line end/join styles |
| Scale, Hinting | Stroke rendering options |
| Custom... | Detailed stroke style dialog |

### Oval Tool / Rectangle Tool

| Field | Description |
|-------|-------------|
| Stroke color, height, style | Same as Line tool |
| Fill color | Color chip for fill |
| (Rectangle only) Corner Radius | Numeric input for rounded corners (0 = sharp) and reset button |

### PolyStar Tool

| Field | Description |
|-------|-------------|
| Stroke and fill colors | Same as Oval/Rectangle |
| Options button | Opens dialog: Style (polygon/star), Number of Sides (3–32), Star Point Size (0–1, star only) |

### Pencil Tool

Same stroke controls as Line Tool.

### Brush Tool

No specific controls in Properties (brush size/shape are in the Tool Options area).

### Text Tool (nothing selected)

Shows the default text formatting that will be applied to newly created text fields:
- Font, Size, Color, Bold, Italic, Alignment, Letter spacing, Auto kern, Character position
- Text type dropdown (Static/Dynamic/Input)

### Paint Bucket / Ink Bottle

| Field | Description |
|-------|-------------|
| Paint Bucket | Fill color chip |
| Ink Bottle | Stroke color, height, style controls |

### Pen Tool

Stroke color, height, style, and fill color.

## Context: Multiple Selection

When multiple objects of the **same type** are selected, the Properties panel shows shared controls. Fields where the selected objects differ show blank/indeterminate values.

When multiple objects of **different types** are selected, the Properties panel shows minimal information:
- "Mixed" as the type label
- W, H, X, Y fields (reflecting the bounding box of the combined selection)

## Properties Panel Behavior Notes

- All numeric fields accept typed input and Enter to apply. Tab moves to the next field.
- Color chips open the same popup picker as the toolbar (swatch grid + hex input + system picker button).
- Changes in the Properties panel are applied immediately (live preview) — no "Apply" button.
- Undo (Ctrl+Z) reverts Properties panel changes.
- Position (X/Y) values reference the object's **registration point** for symbol instances, and the **top-left corner of the bounding box** for shapes and groups.
- When editing a text field's content (cursor is inside the text), the Properties panel shows character-level formatting for the text at the cursor position.

## Flight Adaptation Notes

The Flight inspector is generated from shared property metadata rather than hard-coded per host. It uses [the selection and command contracts](./flash8-implementation-contract.md#coordinate-and-selection-semantics).

- A property definition supplies stable ID, label, category, editor kind, value type, units, range/step, enum choices, applicability, validation, read-only reason, and serialization mapping.
- The scene root exposes scene dimensions, background, and viewport settings but no X/Y transform unless the scene model explicitly adds one.
- Multiple selection shows a mixed value without inventing a concrete value. Committing a field applies to all eligible nodes in one history transaction and reports skipped locked or inapplicable nodes.
- Text edits commit on Enter or blur, cancel on Escape, and retain the invalid draft with a validation message instead of coercing silently. Arrow-key scrubbing and sliders coalesce into one transaction.
- Numeric fields distinguish display units from stored values and define handling for expressions, locale decimal separators, clamping, NaN, and infinity.
- External reload or hierarchy mutation re-resolves the inspected identity. A deleted or invalid target clears the inspector safely instead of writing to a stale node reference.
- Extension or plugin properties survive canonical YAML round trips. A host-specific inspector cannot introduce a property the shared runtime cannot validate and apply.
- Property changes update stage, hierarchy labels, dirty state, and other open inspectors from the same authoritative state notification.
- Test empty, single, multi/mixed, locked, partially applicable, invalid draft, cancellation, undo/redo, reload, and plugin-property cases.
