# Figma Property Inspector (Right Panel)

Authoritative reference for the right-side Property Inspector in Figma (circa 2024–2025). The panel has three tabs: **Design**, **Prototype**, and **Inspect** (Dev Mode). Contents are context-sensitive.

## Panel Position

Always docked on the right edge. Cannot be undocked or hidden independently (toggle all panels with Ctrl/Cmd+\, or right panel only with Ctrl/Cmd+Alt+\). Width is fixed.

## Design Tab — No Selection

When nothing is selected, the Design panel shows page-level properties:

| Section | Fields |
|---------|--------|
| **Background** | Page background color (color chip + checkbox to toggle) |
| **Local styles** | Summary of defined styles in the file |
| **Local variables** | Summary of defined variables |

## Design Tab — Frame Selected

### Frame Properties Section

| Field | Type | Description |
|-------|------|-------------|
| X | Numeric | Horizontal position on the canvas |
| Y | Numeric | Vertical position |
| W | Numeric | Width |
| H | Numeric | Height |
| Rotation | Numeric (°) | Rotation angle |
| Corner Radius | Numeric | Uniform corner radius (expand for individual corners) |
| Independent corners | Four inputs | Top-left, top-right, bottom-right, bottom-left (click the icon to expand) |
| Clip content | Checkbox | Whether children outside the frame bounds are visually clipped |
| Constrain proportions | Lock icon between W/H | Toggle linked width/height |
| Flip horizontal | Button | Mirror horizontally |
| Flip vertical | Button | Mirror vertically |

### Auto Layout Section

When Auto Layout is enabled on the frame (Shift+A to add):

| Field | Type | Description |
|-------|------|-------------|
| Direction | Toggle icons | Horizontal (→), Vertical (↓), Wrap (↩) |
| Alignment | 9-point grid | Where children are aligned within the frame |
| Horizontal gap | Numeric | Space between children horizontally |
| Vertical gap | Numeric | Space between children vertically (wrap mode) |
| Padding | Numeric (uniform or per-side) | Internal padding; click the expand icon for top/right/bottom/left individually |
| Distribution | Toggle | Packed (fixed gap) or Space Between (spread to fill) |
| Stroke behavior | Dropdown | Included in layout / Excluded from layout |
| Canvas stacking | Dropdown | First on top / Last on top (z-order of children) |
| Wrapping | Toggle | Allow items to wrap to the next row/column |
| Min width / Max width | Numeric | Minimum and maximum frame width |
| Min height / Max height | Numeric | Minimum and maximum frame height |

### Constraints Section (for children of frames, not the frame itself)

When an object inside a non-auto-layout frame is selected:

| Axis | Options | Description |
|------|---------|-------------|
| Horizontal | Left, Right, Left and Right, Center, Scale | How the child repositions/resizes when the parent frame resizes |
| Vertical | Top, Bottom, Top and Bottom, Center, Scale | Same for vertical axis |

Shown as a visual constraint picker (cross icon with clickable edges and center).

### Layout Grid Section

| Field | Type | Description |
|-------|------|-------------|
| **+** button | Add | Add a layout grid (multiple can be stacked) |
| Grid type | Toggle | Columns, Rows, Grid (uniform) |
| Count | Numeric | Number of columns/rows |
| Width/Height | Numeric | Column width / Row height (or "Auto") |
| Margin | Numeric | Edge margin |
| Gutter | Numeric | Space between columns/rows |
| Type (for uniform grid) | Numeric | Grid cell size |
| Color | Color chip | Grid overlay tint color + opacity |
| Visibility | Eye icon | Toggle individual grid overlaid visibility |
| Style icon | Four dots | Apply/create a Grid Style |

### Layer Section

| Field | Type | Description |
|-------|------|-------------|
| Blend mode | Dropdown | Pass Through (default for frames/groups), Normal, Darken, Multiply, Color Burn, Lighten, Screen, Color Dodge, Overlay, Soft Light, Hard Light, Difference, Exclusion, Hue, Saturation, Color, Luminosity |
| Opacity | Slider + numeric (0–100%) | Object opacity |

### Fill Section

| Field | Type | Description |
|-------|------|-------------|
| **+** button | Add | Add a fill (multiple fills are supported, stacked) |
| Fill color chip | Color picker | Click to open the color picker |
| Fill type | Dropdown in picker | Solid, Linear Gradient, Radial Gradient, Angular Gradient, Diamond Gradient, Image |
| Opacity (per fill) | Numeric in picker | Per-fill opacity (independent of layer opacity) |
| Visibility | Eye icon per fill | Toggle individual fills |
| Style icon | Four dots | Apply/create a Color Style or Variable |

#### Color Picker Popup

| Element | Description |
|---------|-------------|
| Color field (square) | X = saturation, Y = brightness; click/drag to select |
| Hue slider (horizontal rainbow) | Select hue |
| Opacity slider | Per-fill opacity |
| Hex input | #RRGGBB or #RRGGBBAA |
| RGB/HSL/HSB toggle | Switch between color models |
| Eyedropper button | Sample from anywhere on screen |
| Fill type selector | Solid / Linear / Radial / Angular / Diamond / Image |
| Document colors | Recently used colors in this file |
| Styles section | Available Color Styles |
| Variables section | Available color Variables |

#### Gradient Controls

When a gradient fill is selected:
- **Gradient bar** in the picker: click to add stops, drag stops to reposition, drag off to delete
- **On-canvas handles**: a line (linear) or circle (radial) with draggable endpoints
- **Stop color**: click a stop in the gradient bar to edit its color and opacity

#### Image Fill

| Field | Options |
|-------|---------|
| Fill mode | Fill (cover), Fit (contain), Crop, Tile |
| Image selector | Click "Choose image" or drag an image file |
| Exposure | Slider (−100 to +100) |
| Contrast | Slider |
| Saturation | Slider |
| Temperature | Slider |
| Tint | Slider |
| Highlights | Slider |
| Shadows | Slider |

### Stroke Section

| Field | Type | Description |
|-------|------|-------------|
| **+** button | Add | Add a stroke (multiple strokes supported) |
| Stroke color | Color picker | Same picker as fill |
| Stroke weight | Numeric | Width in pixels |
| Position | Dropdown | Inside, Outside, Center |
| Per-side strokes | Toggle | Set top/right/bottom/left stroke weight independently (frames and rectangles) |
| Advanced stroke settings (⋯) | Expand | (see below) |
| Visibility | Eye icon | Toggle individual strokes |
| Style icon | Four dots | Apply/create Color Style or Variable |

#### Advanced Stroke Settings

| Field | Options |
|-------|---------|
| Dash | Numeric (0 = solid) |
| Gap | Numeric |
| Cap | None, Round, Square, Line Arrow, Triangle Arrow, Circle, Diamond, Custom (per end) |
| Join | Miter, Bevel, Round |
| Miter angle | Numeric |

Stroke endpoints can have independent start and end caps, including arrowheads.

### Effects Section

| Field | Type | Description |
|-------|------|-------------|
| **+** button | Add | Add an effect |
| Effect type | Dropdown | Drop Shadow, Inner Shadow, Layer Blur, Background Blur |
| Visibility | Eye icon | Toggle per effect |
| Style icon | Four dots | Apply/create an Effect Style |

#### Drop Shadow Properties

| Field | Type | Description |
|-------|------|-------------|
| Color | Color picker | Shadow color with opacity |
| X offset | Numeric | Horizontal offset |
| Y offset | Numeric | Vertical offset |
| Blur | Numeric | Blur radius |
| Spread | Numeric | Expand/contract the shadow shape |
| Show behind transparent areas | Checkbox | Whether the shadow is visible through the object's own transparent fill |

#### Inner Shadow Properties

Same fields as Drop Shadow, but renders inside the object boundary.

#### Layer Blur

| Field | Type | Description |
|-------|------|-------------|
| Blur amount | Numeric | Gaussian blur radius |

#### Background Blur

| Field | Type | Description |
|-------|------|-------------|
| Blur amount | Numeric | Blur radius applied to content behind the object |

Background Blur requires the object to have some transparency to see the blurred content behind it.

Multiple effects can be stacked. Drag to reorder.

### Export Section

| Field | Type | Description |
|-------|------|-------------|
| **+** button | Add | Add an export setting |
| Scale | Dropdown | 0.5x, 1x, 1.5x, 2x, 3x, 4x, 512w, 512h, or custom |
| Suffix | Text input | Appended to the filename (e.g., "@2x") |
| Format | Dropdown | PNG, JPG, SVG, PDF |
| Export button | Button | Export this object with the configured settings |
| Preview | Thumbnail | Shows a preview of the export |

Multiple export configurations can be stacked (e.g., 1x PNG + 2x PNG + SVG).

### Selection Colors (bottom of panel)

When objects are selected, a **Selection colors** section shows all unique fill and stroke colors used in the selection. Click a color to change all matching fills/strokes at once — useful for bulk recoloring.

## Design Tab — Rectangle / Ellipse / Line / Path Selected

Same sections as Frame (Transform, Fill, Stroke, Effects, Export), without:
- Auto Layout (not available on non-frame shapes)
- Layout Grid (frame only)
- Constraints (shows when the shape is inside a frame)
- Clip Content (frame only)

Plus shape-specific properties:
- **Rectangle**: Corner radius (uniform or independent)
- **Ellipse**: Start angle, Sweep, Ratio (for arcs and donuts)
- **Line**: Length, rotation
- **Path**: shows point count, edit path button

## Design Tab — Text Selected

### Text Content Properties

| Field | Type | Description |
|-------|------|-------------|
| Font family | Dropdown + search | Font name, searchable, with recent fonts at top |
| Font weight / style | Dropdown | Regular, Medium, Semibold, Bold, Italic, etc. |
| Font size | Numeric | Size in pixels |
| Line height | Numeric or "Auto" | Line height in px, %, or Auto |
| Letter spacing | Numeric | Tracking in px or % |
| Paragraph spacing | Numeric | Space between paragraphs |
| Paragraph indent | Numeric | First-line indent |

### Text Alignment

| Row | Buttons |
|-----|---------|
| Horizontal | Left, Center, Right, Justify |
| Vertical | Top, Middle, Bottom |

### Text Auto-Resize

| Mode | Description |
|------|-------------|
| Auto Width | Text box grows horizontally to fit content |
| Auto Height | Fixed width; height grows to fit content |
| Fixed Size | Fixed width and height; overflow is clipped |

### Text Options (expandable "..." or Type Details)

| Field | Type | Description |
|-------|------|-------------|
| Text decoration | Icons | Underline, Strikethrough |
| Text case | Icons | Original, Uppercase, Lowercase, Titlecase, Small Caps |
| Number list | Toggle | Ordered list |
| Bullet list | Toggle | Unordered list |
| Truncate text | Toggle | Add ellipsis (…) for overflowing text |
| OpenType features | Panel | Stylistic sets, ligatures, fractions, ordinals, tabular/proportional figures, old-style figures |

### Mixed Text Properties

When a text object contains characters with different formatting (mixed fonts, sizes, colors), the field shows "Mixed" or "−". Typing a value in a mixed field applies it to the entire text; selecting specific characters shows their individual properties.

### Fill, Stroke, Effects, Export

Same as shapes. Fill replaces text color. Multiple fills and strokes are supported.

## Design Tab — Group Selected

| Section | Contents |
|---------|----------|
| Transform | X, Y, W, H, Rotation |
| Layer | Blend mode (Pass Through default), Opacity |
| Fill, Stroke, Effects | Available (apply to the group as a whole) |
| Export | Available |

Groups do not support Auto Layout, Layout Grid, Constraints (on their children), or Clip Content. To get these features, convert to a frame (Ctrl/Cmd+Alt+G).

## Design Tab — Component Instance Selected

Same as Frame, plus:

| Section | Fields |
|---------|--------|
| Component identity | Shows "Instance of [Component Name]" with a link to the main component |
| Variant picker | Dropdowns for variant properties (Type, Size, State, etc.) |
| Component properties | Fields for exposed boolean, text, and instance-swap properties |
| Go to Main Component | Button — navigates to and selects the Main Component |
| Detach instance | Right-click > Detach instance (Ctrl/Cmd+Alt+B) |
| Reset overrides | Right-click > Reset all overrides / Reset individual property |

### Instance Swap

Nested component instances can be swapped via an instance-swap property or by dragging a different component from the Assets panel onto the nested instance.

## Design Tab — Image Selected

Same as shapes, with Image fill properties shown in the Fill section (exposure, contrast, saturation, etc.). The image is the fill; no separate image source control.

## Design Tab — Multiple Selection

When multiple objects are selected:

### Alignment / Distribution Row (top of panel)

| Button | Action |
|--------|--------|
| Align Left | Align left edges |
| Align Horizontal Center | Align horizontal centers |
| Align Right | Align right edges |
| Align Top | Align top edges |
| Align Vertical Center | Align vertical centers |
| Align Bottom | Align bottom edges |
| Distribute Horizontal Spacing | Equal horizontal gaps |
| Distribute Vertical Spacing | Equal vertical gaps |
| Tidy Up | Auto-arrange into a neat grid based on proximity |

Alignment reference: with a single frame selected as the parent, children align to the frame. With multiple objects selected at the same level, they align to each other's bounding box.

### Shared Properties

Properties shared by all selected objects are shown normally. Properties that differ show "Mixed" or blank.

Editing a property applies the new value to all selected objects.

### Selection Colors

Shows all unique colors in the selection for bulk recoloring.

## Design Tab — Boolean Group Selected

Same as regular shapes. Double-click to enter the boolean and edit individual sub-shapes. The boolean operation type is shown in the Layers panel icon.

## Prototype Tab — No Selection

| Section | Fields |
|---------|--------|
| Device | Dropdown: None, iPhone, iPad, Android, Desktop, Presentation, Watch, custom |
| Model | Specific device model within the selected category |
| Background color | Prototype background (behind the device frame) |
| Flows | List of defined prototype flows; each flow has a starting frame |

### Flows

- A **flow** is a named prototype starting point
- A file can have multiple independent flows (e.g., "Login Flow", "Onboarding Flow")
- Each flow has a starting frame indicated by a blue play icon
- Set a starting frame: select a frame > right-click > "Set as starting frame" or click the + in the Flows section

## Prototype Tab — Object / Frame Selected

### Interactions Section

| Field | Type | Description |
|-------|------|-------------|
| **+** button (Interactions) | Add | Add an interaction |
| Trigger | Dropdown | What initiates the action |
| Action | Dropdown | What happens when triggered |
| Destination | Frame picker | Target frame (for navigation actions) |
| Animation | Dropdown | Transition type |
| Easing | Dropdown + curve editor | Easing function |
| Duration | Numeric (ms) | Transition duration |
| Match layers | Checkbox (Smart Animate) | Animate matching layers by name |

### Triggers

| Trigger | Description |
|---------|-------------|
| On click / On tap | User clicks or taps the object |
| On drag | User drags the object |
| While hovering | While the cursor is over the object (desktop) |
| While pressing | While the mouse button / finger is held down |
| Key / Gamepad | On a specific key press or gamepad input |
| Mouse enter | When cursor enters the object bounds |
| Mouse leave | When cursor exits the object bounds |
| Mouse down | On mouse button press |
| Mouse up | On mouse button release |
| Touch down | On touch start |
| Touch up | On touch end |
| After delay | Fires automatically after a time delay |

### Actions

| Action | Description |
|--------|-------------|
| Navigate to | Go to a destination frame |
| Open overlay | Show a frame as an overlay on top of the current frame |
| Swap overlay | Replace the current overlay with a different one |
| Close overlay | Dismiss the current overlay |
| Back | Navigate to the previous frame in history |
| Scroll to | Scroll the current frame to bring a target into view |
| Open link | Open an external URL |
| Set variable | Change a variable value (for conditional logic) |
| Conditional | If/else branching based on variable values |

### Animations

| Animation | Description |
|-----------|-------------|
| Instant | No animation; immediate transition |
| Dissolve | Cross-fade |
| Smart Animate | Interpolate matched layers (by name) between source and destination: position, size, rotation, opacity, fill, corner radius, path shape |
| Move in | Destination slides in from a direction (top, right, bottom, left) |
| Move out | Current frame slides out |
| Push | Current frame pushes out as destination pushes in |
| Slide in | Destination slides over the current frame |
| Slide out | Current frame slides away to reveal destination |

### Easing Functions

| Easing | Description |
|--------|-------------|
| Linear | Constant speed |
| Ease in | Starts slow, accelerates |
| Ease out | Starts fast, decelerates |
| Ease in and out | Slow start and end |
| Ease in back | Pulls back before moving |
| Ease out back | Overshoots then settles |
| Ease in and out back | Pull back + overshoot |
| Custom bezier | Define a custom cubic-bezier curve |
| Spring | Physics-based spring animation (stiffness, damping, mass) |

### Overlay Settings (when Action = Open Overlay)

| Field | Description |
|-------|-------------|
| Position | Manual placement or relative to click position |
| Close when clicking outside | Checkbox |
| Add background (overlay) | Checkbox + color/opacity for dimming behind the overlay |
| Offset | X/Y offset from the chosen position |

### Overflow Behavior

| Direction | Description |
|-----------|-------------|
| No scrolling | Content clips at frame boundary |
| Horizontal scrolling | Scrolls horizontally |
| Vertical scrolling | Scrolls vertically |
| Both | Scrolls in both directions |

Set on frames to enable scrollable content in prototypes.

## Prototype Tab — Wiring on Canvas

When the Prototype tab is active:

- Selected objects show blue circular handles on their right edge
- Drag the handle to a destination frame to create an interaction wire
- Blue curved lines connect source objects to destination frames
- Click a wire to select and configure the interaction
- A blue play icon on a frame indicates it's a flow starting point
- Interactions are listed in the right panel for the selected object

## Inspect Tab (Dev Mode)

### Code Section

Shows generated code for the selected object:

| Format | What's Shown |
|--------|--------------|
| CSS | Position, dimensions, border-radius, background, box-shadow, font properties, opacity, transforms |
| iOS (Swift/SwiftUI) | Equivalent iOS properties and code |
| Android (XML/Compose) | Equivalent Android properties and code |

### Properties Section

Lists all design properties in a developer-friendly format:
- Dimensions (W × H)
- Position (X, Y)
- Border radius
- Fills with exact color values
- Strokes with weight and color
- Effects with exact values
- Typography: font-family, font-weight, font-size, line-height, letter-spacing

### Spacing

When hovering between objects with one selected, red measurement lines and pixel values appear.

### Assets

Shows export configurations with download buttons for the selected object.

## Property Inspector Behavior Notes

- All numeric fields accept typed values; press Enter or Tab to apply
- Numeric fields support **math expressions**: "100+50" → 150, "50*2" → 100, "200/3" → 66.67
- Numeric fields support **unit suffixes**: type "50%" for percentage-based values where supported
- Tab advances to the next field
- Changes are applied **live** — no Apply button; Ctrl/Cmd+Z to undo
- **Mixed values**: when a multiple selection has different values, fields show "Mixed" or "−"; typing a value applies to all
- **Scrubbing**: click and drag on a numeric label (like "X" or "W") to scrub the value
- **Style/Variable binding**: the four-dots icon (⊞) next to properties opens the style/variable picker; a hexagon icon indicates a bound variable; click to detach
- **Copy properties**: Ctrl/Cmd+Alt+C copies all visual properties; Ctrl/Cmd+Alt+V pastes them onto the selection

## Flight Adaptation Notes

Apply [the Figma-inspired property, variable, layout, component, prototype, and developer contract](./figma-implementation-contract.md).

- Inspector sections are contributed metadata; different hosts may render native controls while invoking identical commands.
- Literal, style-bound, and variable-bound values are distinct states. Detach writes the resolved literal explicitly.
- Draft expressions and units validate before commit; scrub and complex editors use one cancellable gesture transaction.
- Auto Layout-controlled properties explain applicability and precedence instead of silently accepting ineffective values.
- Component variant/property and prototype target selectors use stable identities with missing-reference diagnostics.
- Dev Mode is read-only computed output; generators cannot mutate the document through inspection callbacks.
- Test mixed/partial applicability, aliases/modes, permission changes, invalid drafts, layout reflow, and source/visual synchronization.
