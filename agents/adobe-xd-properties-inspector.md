# Adobe XD Property Inspector

Authoritative reference for the Property Inspector (right panel) in Adobe XD. The panel is context-sensitive — its contents change based on the active mode (Design / Prototype / Share) and the current selection.

## Panel Position

The Property Inspector is always docked on the right edge of the workspace. It cannot be undocked, floated, or hidden (it is always visible). Its width is fixed.

## Design Mode — No Selection (Canvas)

When nothing is selected and the canvas (pasteboard) is clicked:

| Section | Fields |
|---------|--------|
| Canvas color | Background color of the pasteboard (not artboard); rarely changed |

The panel is mostly empty with no selection.

## Design Mode — Artboard Selected

When an artboard is selected (click its title label or edge):

### Artboard Section

| Field | Type | Description |
|-------|------|-------------|
| Artboard name | Text input | Editable name displayed above the artboard |
| W | Numeric input | Width in pixels |
| H | Numeric input | Height in pixels |
| Preset dropdown | Dropdown | Quick-select device sizes (iPhone, iPad, Web, Custom, etc.) |

### Appearance

| Field | Type | Description |
|-------|------|-------------|
| Fill checkbox + color | Checkbox + color picker | Toggle artboard background color; click chip to choose color |

### Scrolling

| Field | Type | Description |
|-------|------|-------------|
| Viewport Height | Numeric input | Visible viewport height for scrollable artboards — content below this line scrolls in Preview/prototype |
| Scrolling | Dropdown | None / Vertical / Horizontal — sets the scroll direction for prototype playback |

### Grid

| Field | Type | Description |
|-------|------|-------------|
| Layout Grid | Toggle + settings | Column-based layout grid: columns, gutter width, column width, margin |
| Square Grid | Toggle + settings | Uniform square grid: grid size in pixels |

### Layout Grid Settings

| Parameter | Description |
|-----------|-------------|
| Columns | Number of columns (e.g., 12) |
| Gutter Width | Space between columns in pixels |
| Column Width | Width of each column (auto-calculated or manual) |
| Margin Left/Right | Inset from artboard edges |
| Color | Overlay tint color for the grid |

## Design Mode — Shape Selected (Rectangle, Ellipse, Line, Path)

### Alignment Row (top of panel)

Appears when one or more objects are selected:

| Button | Action |
|--------|--------|
| Align Left | Align left edges (to selection bounds, or to artboard if single object) |
| Align Center (H) | Align horizontal centers |
| Align Right | Align right edges |
| Align Top | Align top edges |
| Align Center (V) | Align vertical centers |
| Align Bottom | Align bottom edges |
| Distribute Horizontally | Space objects evenly horizontally (3+ objects) |
| Distribute Vertically | Space objects evenly vertically (3+ objects) |

### Responsive Resize

| Field | Type | Description |
|-------|------|-------------|
| Responsive Resize toggle | Toggle | Enable/disable responsive resize for the group/component this object is in |
| Manual overrides | Pin controls | Fix position relative to left/right/top/bottom edges and toggle width/height to be fixed or flexible |

(Only visible when the object is inside a group or component.)

### Transform

| Field | Type | Description |
|-------|------|-------------|
| X | Numeric input | Horizontal position (relative to artboard origin, or parent group) |
| Y | Numeric input | Vertical position |
| W | Numeric input | Width |
| H | Numeric input | Height |
| Lock aspect ratio | Chain link icon | Toggle between linked and independent W/H |
| Rotation | Numeric input (°) | Rotation in degrees |
| Flip Horizontal | Button | Mirror horizontally |
| Flip Vertical | Button | Mirror vertically |

### Appearance

| Field | Type | Description |
|-------|------|-------------|
| Opacity | Slider + numeric (0–100) | Object opacity; affects the entire object including children |
| Blend Mode | Dropdown | Normal, Darken, Multiply, Color Burn, Lighten, Screen, Color Dodge, Overlay, Soft Light, Hard Light, Difference, Exclusion, Hue, Saturation, Color, Luminosity |

### Fill

| Field | Type | Description |
|-------|------|-------------|
| Fill checkbox | Checkbox | Toggle fill on/off |
| Fill color chip | Color picker | Click to open color picker |
| Fill type | Dropdown (in picker) | Solid Color, Linear Gradient, Radial Gradient, Image Fill |

#### Color Picker Popup

| Element | Description |
|---------|-------------|
| Color field | Large square: X axis = saturation, Y axis = brightness |
| Hue slider | Vertical or horizontal strip for hue selection |
| Alpha slider | Opacity for this specific fill (separate from object opacity) |
| Hex input | #RRGGBB or #RRGGBBAA |
| RGB inputs | R, G, B numeric fields (0–255) |
| HSB toggle | Switch to Hue, Saturation, Brightness inputs |
| Eyedropper | Sample a color from anywhere on screen |
| Saved colors | Row of swatches from the document's Assets colors |
| Recent colors | Row showing recently used colors |

#### Gradient Editor (within the color picker when Linear or Radial gradient is selected)

| Element | Description |
|---------|-------------|
| Gradient bar | Horizontal bar showing the gradient; click to add stops, drag stops to reposition, drag off to delete |
| Color stop | Click a stop to edit its color and opacity |
| Gradient type toggle | Linear / Radial |
| Reverse | Flip the gradient direction |
| On-canvas handles | Drag the gradient line/circle on the object to reposition, rotate, and scale the gradient |

#### Image Fill

| Element | Description |
|---------|-------------|
| Image selector | Click to choose an image file |
| Fill type | Fill (stretch), Fit (letterbox), Tile, Crop |
| Opacity | Image fill opacity |

### Border (Stroke)

| Field | Type | Description |
|-------|------|-------------|
| Border checkbox | Checkbox | Toggle border on/off |
| Border color chip | Color picker | Click to choose color |
| Border size | Numeric input | Stroke width in pixels |
| Border position | Dropdown | Inside, Outside, Center (relative to the path) |
| Dash | Numeric input | Dash length (0 = solid) |
| Gap | Numeric input | Gap between dashes |
| Line cap | Dropdown/icons | Butt, Round, Projecting (square) |
| Line join | Dropdown/icons | Miter, Round, Bevel |

### Shadow

| Field | Type | Description |
|-------|------|-------------|
| Shadow checkbox | Checkbox | Toggle drop shadow on/off |
| X offset | Numeric input | Horizontal shadow offset |
| Y offset | Numeric input | Vertical shadow offset |
| Blur | Numeric input | Shadow blur radius |
| Color chip | Color picker | Shadow color (includes alpha) |

Multiple shadows can be added by clicking the **+** button.

### Blur

| Type | Fields | Description |
|------|--------|-------------|
| Object Blur | Amount (0–50) | Gaussian blur applied to the object itself |
| Background Blur | Amount (0–50) + Brightness (−50 to +50) + checkbox | Blur the content behind the object (frosted glass effect); the object becomes semi-transparent to show the blurred background |

Toggle between Object Blur and Background Blur. Only one type is active at a time.

### Boolean Operations Row

When two or more overlapping shapes are selected:

| Button | Action |
|--------|--------|
| Add (Unite) | Combine shapes into one |
| Subtract | Cut the front shape out of the back shape |
| Intersect | Keep only the overlapping area |
| Exclude | Keep everything except the overlap |

The result is an editable compound path. Double-click to re-enter and edit the original sub-paths.

### Shape-Specific Properties

**Rectangle:**

| Field | Type | Description |
|-------|------|-------------|
| Corner Radius | Numeric input (one field) | Uniform corner radius; or click the individual corners icon to set each independently |
| Individual corners | Four numeric inputs | Top-left, top-right, bottom-right, bottom-left radius |

**Ellipse:**

| Field | Type | Description |
|-------|------|-------------|
| Start Angle | Numeric input (°) | Starting angle of the arc |
| Sweep | Numeric input (°) | Sweep angle (360° = full ellipse; less = pie/arc) |
| Ratio | Slider | Inner radius for donut shapes |

**Line:**

Only border properties (no fill, no shadow, no blur).

## Design Mode — Text Selected

### Text Section

| Field | Type | Description |
|-------|------|-------------|
| Font family | Dropdown + search | Font name; searchable; recently used fonts at top |
| Font weight | Dropdown | Light, Regular, Medium, Semibold, Bold, Black, etc. (varies by font) |
| Font size | Numeric input | Size in pixels |
| Character spacing | Numeric input | Tracking (letter spacing) in 1/1000 em units |
| Line spacing | Numeric input | Leading (line height) in pixels; "Auto" option |
| Paragraph spacing | Numeric input | Space between paragraphs in pixels |

### Text Alignment

| Button | Action |
|--------|--------|
| Align Left | Left-align text |
| Align Center | Center-align text |
| Align Right | Right-align text |

### Vertical Alignment (area text)

| Button | Action |
|--------|--------|
| Top | Text starts at top of text box |
| Middle | Text is vertically centered |
| Bottom | Text is bottom-aligned |

### Text Transform

| Button | Action |
|--------|--------|
| None | Default case |
| Uppercase (AA) | All caps |
| Lowercase (aa) | All lowercase |
| Titlecase (Aa) | Capitalize first letter of each word |

### Additional Text Properties

| Field | Type | Description |
|-------|------|-------------|
| Underline | Toggle | Underline text |
| Strikethrough | Toggle | Strikethrough text |
| Superscript | Toggle | Raise text above baseline |
| Subscript | Toggle | Lower text below baseline |
| Auto-Height | Toggle | Text box auto-grows vertically to fit content |
| Fixed Height | Toggle | Text box has a fixed height; overflow is clipped |
| Text color | Color picker | Font color |

### Fill, Border, Shadow, Blur

Same as shapes — text objects support all the same appearance properties. Fill replaces the text color when applied.

## Design Mode — Group Selected

Same properties as a shape (transform, opacity, blend mode), plus:

| Field | Type | Description |
|-------|------|-------------|
| Responsive Resize | Toggle | Enable responsive resize behavior for children |
| Padding | Toggle + inputs | Add internal padding: uniform (one value) or per-side (top, right, bottom, left) |
| Stack (Layout) | Toggle + settings | Enable auto-layout stacking |

### Stacks (Auto-Layout)

When a group has Stacks enabled:

| Field | Type | Description |
|-------|------|-------------|
| Direction | Horizontal / Vertical | Stack direction |
| Spacing | Numeric input | Gap between stacked children |
| Padding | Per-side inputs | Internal padding of the stack container |

Children of a Stack are auto-arranged. Drag children to reorder. Adding or removing children reflows the layout.

## Design Mode — Component Instance Selected

Same properties as a group, plus:

| Section | Fields |
|---------|--------|
| Component name | Shows "Instance of [Component Name]" |
| State picker | Dropdown to switch between component states (Default, Hover, custom states) |
| Overrides | Editable properties that differ from the Main Component (text, colors, images, visibility) |
| Edit Main Component | Button — navigates to and selects the Main Component |
| Reset Overrides | Right-click option to clear all instance overrides |

### Override Behavior

- Changing a property on an instance creates an **override** that persists when the Main Component is updated
- Overridable properties: text content, fill colors, border colors, image sources, visibility of children, size
- Non-overridable: adding/removing children, structural changes (these always propagate from Main)
- The Layers panel shows a green dotted indicator on instances with overrides

## Design Mode — Image Selected

| Field | Type | Description |
|-------|------|-------------|
| Transform | X, Y, W, H, Rotation | Same as shapes |
| Opacity | Slider | Same as shapes |
| Border, Shadow, Blur | Same as shapes | |
| Image source | Thumbnail | Shows the imported image; no re-import button (replace by dragging a new image onto the object) |

## Design Mode — Multiple Selection

When multiple objects of mixed types are selected:

- **Alignment buttons** appear at the top (align and distribute across the selection)
- **Transform fields** show the bounding box of the combined selection
- **Shared properties** are shown (opacity, blend mode); fields that differ show "Mixed" or are blank
- **Boolean operation buttons** appear if shapes overlap
- Editing a property applies to all selected objects

## Design Mode — Repeat Grid Selected

| Field | Type | Description |
|-------|------|-------------|
| Transform | X, Y, W, H | Bounding box of the entire grid |
| Repeat Grid indicator | Label | "Repeat Grid" |
| Ungroup Grid | Button | Convert to individual objects |
| Cell spacing | Controlled on-canvas | Hover between cells to see pink spacing indicator; drag to adjust horizontal and vertical gaps independently |

## Prototype Mode — No Selection

Shows the artboard flow overview and Home artboard designation:

| Field | Type | Description |
|-------|------|-------------|
| Home artboard indicator | Label | Identifies which artboard is the starting point for the prototype |
| Flow name | Text input | Name the interaction flow (a document can have multiple independent flows) |

## Prototype Mode — Object or Artboard Selected

### Interaction Section

When an object or artboard is selected in Prototype mode, a blue arrow handle appears on its right edge. Drag this handle to a destination artboard to create a wire.

The Property Inspector shows configured interactions:

| Field | Type | Description |
|-------|------|-------------|
| Trigger | Dropdown | What initiates the interaction |
| Action | Dropdown | What happens when triggered |
| Destination | Dropdown | Target artboard (for transitions) |
| Animation | Dropdown | Transition animation type |
| Easing | Dropdown | Easing curve |
| Duration | Numeric input (seconds) | Transition duration |

**+** button adds additional interactions to the same object.

### Triggers

| Trigger | Description |
|---------|-------------|
| Tap | User taps/clicks the object |
| Drag | User drags the object (for swipe-like interactions) |
| Time | Fires automatically after a delay (configurable seconds) |
| Keys & Gamepad | Fires when a specific key or gamepad button is pressed |
| Voice | Fires on a spoken keyword/phrase |
| Hover | Fires when cursor enters the object (desktop prototypes) |

### Actions

| Action | Description |
|--------|-------------|
| Transition | Navigate to a destination artboard with an animation |
| Auto-Animate | Animate between the current artboard and the destination by interpolating matched layers (by name); matched objects animate position, size, rotation, opacity, and path shape |
| Overlay | Show the destination artboard as an overlay on top of the current artboard (popup, dropdown, modal) |
| Scroll To | Scroll the current artboard to bring a specific object into view |
| Previous Artboard | Navigate back to the previous artboard in the history |
| Audio Playback | Play an audio file |
| Speech Playback | Synthesize and speak text |

### Animation Types (for Transition and Overlay)

| Animation | Description |
|-----------|-------------|
| Dissolve | Cross-fade between artboards |
| Slide Left | New artboard slides in from the right |
| Slide Right | New artboard slides in from the left |
| Slide Up | New artboard slides in from the bottom |
| Slide Down | New artboard slides in from the top |
| Push Left | Current artboard pushes out left, new one enters from right |
| Push Right | Push out right |
| Push Up | Push out top |
| Push Down | Push out bottom |
| None | Instant transition with no animation |

### Easing Curves

| Easing | Description |
|--------|-------------|
| None (Linear) | Constant speed |
| Ease Out | Starts fast, decelerates |
| Ease In | Starts slow, accelerates |
| Ease In-Out | Slow start and end, fast middle |
| Snap | Quick snap with slight overshoot |
| Wind Up | Pulls back slightly before moving forward |
| Bounce | Bounces at the destination |

### Overlay Settings (when Action = Overlay)

| Field | Type | Description |
|-------|------|-------------|
| Overlay position | Nine-point grid | Anchor the overlay to a position relative to the current artboard (top-left, center, bottom-right, etc.) |
| Offset X/Y | Numeric inputs | Fine-tune overlay position |
| Close on outside click | Checkbox | Dismiss the overlay when the user taps outside it |
| Add background overlay | Checkbox | Dim/tint the background behind the overlay |

### Auto-Animate

Auto-Animate works by matching layers between the source and destination artboards by **name**. Matched layers interpolate between their states:

| Property | Animates |
|----------|----------|
| X, Y position | Yes |
| Width, Height | Yes |
| Rotation | Yes |
| Opacity | Yes |
| Fill color | Yes |
| Border color | Yes |
| Corner radius | Yes |
| Shadow properties | Yes |
| Path shape (same number of points) | Yes |

Layers that exist only in the source fade out. Layers that exist only in the destination fade in. The key requirement is **exact name matching** in the Layers panel.

## Prototype Mode — Artboard-Level Interactions

| Field | Type | Description |
|-------|------|-------------|
| Scroll behavior | From artboard properties | Artboards with Viewport Height set can scroll vertically or horizontally |
| Time trigger on artboard | Trigger: Time | Auto-advance to another artboard after a delay (splash screens, onboarding flows) |

## Share Mode

When Share mode is active, the Property Inspector shows link management:

| Field | Type | Description |
|-------|------|-------------|
| Link name | Text input | Label for this share link |
| View type | Dropdown | Design Review / Development / Presentation / Custom |
| Link access | Dropdown | Anyone with the link / Invited only |
| Artboards | Selection | All / Selected artboard(s) |
| Create Link / Update Link | Button | Publish or update the shared link |
| Manage Links | List | Previously created links with options to update, copy URL, or delete |

## Property Inspector Behavior Notes

- All numeric fields accept typed values; press Enter or Tab to apply. Tab advances to the next field.
- Numeric fields support **math expressions**: type "200+50" to get 250, or "50*2" to get 100.
- Color chips open the inline color picker on click; the picker is dismissed by clicking outside it.
- Changes are applied **immediately** — there is no "Apply" button. Undo (Ctrl/Cmd+Z) reverts.
- When properties **differ** across a multiple selection, the field shows blank or "Mixed" and typing a value applies it to all selected objects.
- The Property Inspector scrolls vertically if there are more sections than fit in the panel height.
