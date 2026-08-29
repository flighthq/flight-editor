# Flash 8 Panels

Authoritative reference for all panels in Macromedia Flash Professional 8, excluding the Properties panel (covered in `flash8-properties-inspector.md`) and the Tools panel (covered in `flash8-tools-panel.md`).

For Flight implementation decisions, this historical reference is subordinate to the [Flash 8-inspired implementation contract](./flash8-implementation-contract.md).

## Timeline Panel

**Default position:** Docked horizontally, spanning full width, between the Edit Bar and the Stage.
**Shortcut:** Ctrl+Alt+T

### Structure

The Timeline is divided into two regions:

#### Layer Controls (left side)

A vertical list of layers. Each layer row contains:

| Element | Position | Behavior |
|---------|----------|----------|
| Layer icon | Far left | Indicates layer type (normal, guide, motion guide, mask, masked, folder) |
| Layer name | Center | Double-click to rename; default names: "Layer 1", "Layer 2", etc. |
| Show/Hide toggle | Eye column | Click: toggle layer visibility. Click column header: toggle all layers. Alt+click: solo this layer (hide all others). |
| Lock toggle | Lock column | Click: toggle layer lock. Click column header: toggle all locks. Alt+click: lock all others. |
| Outline toggle | Square column | Click: toggle outline-only display. Click column header: toggle all. Color of the square matches the layer's outline color. |

**Layer row interactions:**
- Click layer name: select that layer (makes it the active drawing target)
- Right-click layer: context menu (Show All, Lock Others, Insert Layer, Delete Layer, Guide, Add Motion Guide, Mask, Show Masking, Properties...)
- Drag layer up/down: reorder
- Drag layer onto folder: nest inside folder
- Double-click layer icon: open Layer Properties dialog

**Layer controls at bottom of layer list:**

| Button | Icon | Action |
|--------|------|--------|
| Insert Layer | Page with + | Add a new layer above the selected layer |
| Add Motion Guide | Arc with dotted line | Add a motion guide layer linked to the selected layer |
| Insert Layer Folder | Folder with + | Add a new layer folder |
| Delete Layer | Trash can | Delete the selected layer(s) |

#### Frame Grid (right side)

A grid where columns are frame numbers and rows are layers. Each cell represents one frame on one layer.

**Frame display conventions:**
- **Empty frame** (gray) — no content
- **Static frame** (gray with dot at start) — content exists but no keyframe change
- **Keyframe** — filled circle at the frame position; content can differ from adjacent keyframes
- **Blank keyframe** — hollow circle; keyframe with no content
- **End-of-span marker** — small rectangle at the last frame of a span before the next keyframe
- **Motion tween** — light blue/purple background with arrow between keyframes; dashed line if broken
- **Shape tween** — light green background with arrow between keyframes; dashed line if broken
- **Frame label** — red flag icon with label text visible above the frame
- **Frame comment** — green `//` icon
- **Frame action** — small `a` icon in the frame cell (indicates ActionScript on that frame)
- **Sound** — waveform preview in the frame span

**Playhead:**
- Red rectangle at top of the frame grid (in the header), with a red vertical line extending down through all layers
- Drag the playhead to scrub through frames
- Click a frame number in the header to move the playhead there

**Frame grid header:** Shows frame numbers at regular intervals (every 5 frames by default). The current frame is highlighted.

**Timeline status bar** (bottom of Timeline panel):

| Element | Position | Description |
|---------|----------|-------------|
| Current frame number | Left | Shows the active frame number (e.g., "1") |
| Frame rate | Center | Shows and allows editing of FPS (e.g., "12.0 fps") — double-click to change |
| Elapsed time | Right of FPS | Time at current frame (e.g., "0.0s") |

**Onion Skin buttons** (bottom of frame grid, below the frames):

| Button | Icon | Behavior |
|--------|------|----------|
| Onion Skin | Overlapping circles | Show ghost outlines of frames before/after current frame |
| Onion Skin Outlines | Overlapping squares | Show outlines only (no fills) for onion-skinned frames |
| Edit Multiple Frames | Brackets | Allow editing content across multiple frames simultaneously |
| Modify Onion Markers | Three lines | Dropdown: Always Show Markers, Anchor Onion, Onion 2, Onion 5, Onion All |

**Onion markers:** When onion skinning is active, bracket-shaped markers appear in the frame header showing the range of visible ghost frames. These can be dragged to adjust the range.

**Frame context menu** (right-click a frame):
- Create Motion Tween
- Insert Frame (F5)
- Remove Frames (Shift+F5)
- Insert Keyframe (F6)
- Insert Blank Keyframe (F7)
- Clear Keyframe (Shift+F6)
- Convert to Keyframes
- Convert to Blank Keyframes
- Cut Frames (Ctrl+Alt+X)
- Copy Frames (Ctrl+Alt+C)
- Paste Frames (Ctrl+Alt+V)
- Clear Frames
- Select All Frames
- Reverse Frames
- Synchronize Symbols
- Actions (open Actions panel for this frame)

## Library Panel

**Default position:** Right side, usually expanded.
**Shortcut:** Ctrl+L or F11

### Structure

| Element | Position | Description |
|---------|----------|-------------|
| Title/options dropdown | Top-left | "Library - [filename]" with options menu |
| Search/filter field | Top | Filter library items by name |
| Preview area | Top half | Shows a preview of the selected item; for MovieClips, shows the first frame with a Play button |
| Item list | Bottom half | Scrollable list of all library items |
| Column headers | Above item list | Name, Kind, Use Count, Linkage, Date Modified — sortable by clicking |
| New Symbol button | Bottom bar | Create a new empty symbol |
| New Folder button | Bottom bar | Create a folder for organizing items |
| Properties button | Bottom bar | Open properties for the selected item |
| Delete button | Bottom bar | Delete the selected item |

### Library Item Types

| Kind | Icon | Description |
|------|------|-------------|
| Movie Clip | Film strip | Animated symbol with independent timeline |
| Button | Arrow pointer | Four-frame interactive button symbol (Up, Over, Down, Hit) |
| Graphic | Landscape image | Static or timeline-synced symbol |
| Bitmap | Pixel grid | Imported raster image (JPEG, PNG, GIF, BMP) |
| Sound | Speaker | Imported audio file (MP3, WAV, AIFF) |
| Video | Film frame | Imported or embedded video |
| Font | Letter A | Embedded font symbol |
| Component | Gear | UI component (from Components panel) |
| Compiled Clip | Gear with lock | Pre-compiled SWC component |

### Library Context Menu (right-click item)

- Edit / Edit in Place / Edit in New Window (symbols)
- Properties...
- Rename
- Move to... (move to a folder)
- Duplicate
- Delete
- Linkage... (set export for ActionScript, class name)
- Component Definition... (components only)
- Select Unused Items
- Update... (bitmaps/sounds — re-import from source)
- Play / Stop (sounds, MovieClips in preview)
- Expand/Collapse Folder
- New Folder
- New Symbol...
- New Font...
- New Video...

### Library Options Menu (dropdown at top-right)

Same items as context menu plus:
- Shared Library Properties...
- Keep Use Counts Updated
- Update Use Counts Now

## Color Mixer Panel

**Default position:** Right side, often grouped with Color Swatches.
**Shortcut:** Shift+F9

### Structure

| Element | Position | Description |
|---------|----------|-------------|
| Panel title | Top | "Color Mixer" |
| Stroke/Fill selector | Top-left | Two overlapping chips (same as toolbar) to choose which color to edit |
| Color type dropdown | Top-right | Solid, Linear Gradient, Radial Gradient, Bitmap Fill |
| Color space | Below dropdown | RGB values or HSB values (toggle in options menu) |
| Alpha | Below color space | 0–100% transparency slider and numeric input |
| Hex value | Below alpha | # followed by 6-character hex |
| Color spectrum | Center | Large rectangular gradient showing all hues and saturations; click to sample |
| Brightness slider | Right of spectrum | Vertical bar for brightness/value |
| Gradient bar | Bottom (when gradient selected) | Shows gradient stops; click to add, drag to reposition, drag off to delete |

### Gradient Editing

When Linear or Radial gradient is selected:
- **Gradient preview bar** appears at the bottom showing the current gradient
- **Color stops** (small squares below the bar) mark each color in the gradient
- Click below the bar to **add a stop**
- Drag a stop down and away to **remove** it
- Click a stop to select it, then use the color controls above to set its color and alpha
- Drag stops left/right to **reposition** them
- The gradient bar supports up to 15 color stops
- **Overflow menu** (panel options): Extend, Reflect, Repeat — controls how the gradient tiles beyond its bounds

### Bitmap Fill

When Bitmap Fill is selected:
- Shows a preview of the selected bitmap
- Click Import to choose a bitmap from the Library or import a new one

### Panel Options Menu

- RGB / HSB toggle
- Add Swatch (saves current color to the Swatches panel)
- Help

## Color Swatches Panel

**Default position:** Grouped with Color Mixer (as a tab).
**Shortcut:** Ctrl+F9

### Structure

- **Color grid** — a grid of color swatches (the default web-safe 216-color palette)
- **Gradient presets** — a row of preset linear and radial gradients below the color grid
- Click any swatch to set the active stroke or fill color

### Panel Options Menu

- Duplicate Swatch
- Delete Swatch
- Add Colors... (import a color palette file .clr)
- Replace Colors... (replace the entire palette)
- Load Default Colors (reset to web-safe palette)
- Save Colors... (export palette as .clr)
- Save as Default
- Clear Colors
- Web 216
- Sort by Color
- Help

## Align Panel

**Default position:** Right side, grouped with Info and Transform as tabs.
**Shortcut:** Ctrl+K

### Structure

The panel has four groups of buttons arranged horizontally:

**Align row (top):**

| Button | Icon | Action |
|--------|------|--------|
| Align left edges | Left-aligned bars | Align selected objects to the leftmost edge |
| Align horizontal centers | Center-aligned bars (H) | Align horizontal centers |
| Align right edges | Right-aligned bars | Align to rightmost edge |
| Align top edges | Top-aligned bars | Align selected objects to the topmost edge |
| Align vertical centers | Center-aligned bars (V) | Align vertical centers |
| Align bottom edges | Bottom-aligned bars | Align to bottommost edge |

**Distribute row:**

| Button | Icon | Action |
|--------|------|--------|
| Distribute top edges | Spaced bars (top) | Even spacing by top edges |
| Distribute vertical centers | Spaced bars (V center) | Even spacing by vertical centers |
| Distribute bottom edges | Spaced bars (bottom) | Even spacing by bottom edges |
| Distribute left edges | Spaced bars (left) | Even spacing by left edges |
| Distribute horizontal centers | Spaced bars (H center) | Even spacing by horizontal centers |
| Distribute right edges | Spaced bars (right) | Even spacing by right edges |

**Match Size row:**

| Button | Icon | Action |
|--------|------|--------|
| Match width | Horizontal resize | Make all selected objects the same width |
| Match height | Vertical resize | Make all selected objects the same height |
| Match width and height | Both resize | Match both dimensions |

**Space row:**

| Button | Icon | Action |
|--------|------|--------|
| Space evenly vertically | Vertical even space | Equal vertical gaps between objects |
| Space evenly horizontally | Horizontal even space | Equal horizontal gaps between objects |

**To Stage toggle** (button at right side):
- When active, alignment and distribution operations use the Stage boundaries as the reference instead of the selected objects' collective bounds.

## Info Panel

**Default position:** Grouped with Align and Transform.
**Shortcut:** Ctrl+I

### Structure

| Field | Description |
|-------|-------------|
| W | Width of selected object in current units |
| H | Height of selected object in current units |
| X | X position of selected object (registration point) |
| Y | Y position of selected object (registration point) |
| R | Red component at mouse cursor position (0–255) |
| G | Green component at mouse cursor position (0–255) |
| B | Blue component at mouse cursor position (0–255) |
| A | Alpha at mouse cursor position (0–255) |
| Mouse X | Current mouse X position on Stage |
| Mouse Y | Current mouse Y position on Stage |

The RGB/Alpha display updates in real time as the mouse moves over the Stage.

## Transform Panel

**Default position:** Grouped with Align and Info.
**Shortcut:** Ctrl+T

### Structure

| Field | Description |
|-------|-------------|
| Scale width | Percentage field for horizontal scale |
| Scale height | Percentage field for vertical scale |
| Constrain (chain link) | Toggle to link width/height scale proportionally |
| Rotate | Degrees of rotation, numeric input |
| Skew horizontal | Degrees of horizontal skew |
| Skew vertical | Degrees of vertical skew |
| Copy and Apply Transform | Button — applies the current transform values and duplicates the object |
| Reset | Button — resets transform to identity |

Radio buttons toggle between Rotate and Skew modes.

## Actions Panel

**Default position:** Bottom area (tabbed with Properties, or separate floating).
**Shortcut:** F9

### Structure

The Actions panel is a code editor for ActionScript:

| Element | Position | Description |
|---------|----------|-------------|
| Actions toolbox | Left pane | Tree of available ActionScript classes, methods, properties organized by category |
| Script pane | Right/main pane | Text editor with syntax highlighting, line numbers |
| Script navigator | Left pane (below toolbox) | Lists all scripts in the current document by frame/object |
| Toolbar | Above script pane | Add (+), Find/Replace, Insert Target Path, Check Syntax, Auto Format, Show Code Hint, Debug Options, Script Assist toggle |
| Pin tabs | Below toolbar | Pin scripts from multiple frames/objects for quick switching |

### Actions Toolbox Categories

- Global Functions (timeline control, browser/network, movie clip control, printing, miscellaneous)
- Global Properties
- Operators
- Statements (conditions, loops, variable)
- Built-in Classes (Array, Boolean, Color, Date, Key, Math, Mouse, MovieClip, Object, Sound, Stage, String, System, TextField, XML, etc.)
- Components
- Screens
- Compiler Directives
- Constants
- Types
- Deprecated
- Index (alphabetical listing)

### Script Assist Mode

Toggle button in the toolbar. When active, replaces the free-form editor with a guided interface:
- Shows parameters for the selected action in a form above the script pane
- Restricts editing to valid ActionScript constructs
- Aimed at designers who are not comfortable writing raw code

## Behaviors Panel

**Default position:** Usually closed; opens on demand.
**Shortcut:** Shift+F3

### Structure

- **Add Behavior (+)** button — dropdown with categorized behaviors:
  - Embedded Video (Play, Stop, Pause, etc.)
  - MovieClip (Goto And Play, Goto And Stop, Load Graphic, Load External MovieClip, Unload MovieClip, Duplicate MovieClip, Start/Stop Dragging)
  - Sound (Load Sound, Play Sound, Stop Sound, Stop All Sounds)
  - Web (Go to Web Page)
- **Delete Behavior (−)** button
- **Behavior list** — table showing Event | Behavior columns for each applied behavior
  - Event column: click to change trigger event (On Press, On Release, On Roll Over, etc.)
  - Behavior column: shows the behavior description

## Components Panel

**Default position:** Usually right side or closed.
**Shortcut:** Ctrl+F7

### Structure

A tree list of available UI components organized by category:

- **User Interface**
  - Accordion, Alert, Button, CheckBox, ComboBox, DataGrid, DateChooser, DateField, Label, List, Loader, Menu, MenuBar, NumericStepper, PopUpManager, ProgressBar, RadioButton, ScrollPane, TextArea, TextInput, Tree, Window
- **Data**
  - DataHolder, DataSet, RDBMSResolver, WebServiceConnector, XMLConnector, XUpdateResolver
- **Media**
  - MediaController, MediaDisplay, MediaPlayback
- **Screens** (Flash Slides/Forms)
  - Screen, Slide

Drag a component from the panel onto the Stage to instantiate it.

## Component Inspector Panel

**Default position:** Usually closed.
**Shortcut:** Alt+F7

Three tabs:
- **Parameters** — editable component parameters (same as the Parameters tab in the Properties panel)
- **Bindings** — data binding configuration between components
- **Schema** — XML schema definition for data components

## Scene Panel

**Default position:** Usually closed.
**Shortcut:** Shift+F2

### Structure

- **Scene list** — ordered list of scenes in the document
- **Add Scene (+)** button — creates a new scene
- **Duplicate Scene** button — copies the current scene
- **Delete Scene (trash)** button — removes the selected scene
- Drag scenes to reorder
- Double-click a scene name to rename it

Scenes play in list order during playback. Each scene has its own timeline.

## History Panel

**Default position:** Usually closed or right side.
**Shortcut:** Ctrl+F10

### Structure

- **Step list** — scrollable list of actions performed, most recent at bottom
- Slider on the left edge — drag up to undo multiple steps, down to redo
- Click any step to undo everything after it
- **Replay** button (bottom) — replay selected steps on the current selection
- **Copy** button (bottom) — copy selected steps as ActionScript to the clipboard
- **Save as Command** button (bottom) — save selected steps as a reusable Command (appears in Commands menu)
- History length is configurable in Preferences (default 100 levels)

## Accessibility Panel

**Default position:** Usually closed.
**Shortcut:** Alt+F2

### Structure

| Field | Description |
|-------|-------------|
| Make Movie Accessible | Checkbox — enables accessibility for the entire SWF |
| Make Child Objects Accessible | Checkbox — exposes child objects to screen readers |
| Auto Label | Checkbox — automatically generates labels from text content |
| Name | Text field — accessible name for the selected object |
| Description | Text field — accessible description |
| Shortcut | Text field — keyboard shortcut description for screen readers |
| Tab Index | Numeric field — tab order index |

## Movie Explorer Panel

**Default position:** Usually closed.
**Shortcut:** Alt+F3

### Structure

- **Filter buttons** (top row):
  - Show Text — filter for text elements
  - Show Buttons, Movie Clips, and Graphics — filter for symbols
  - Show Action Scripts — filter for code
  - Show Video, Sounds, and Bitmaps — filter for media
  - Show Frames and Layers — show timeline structure
  - Customize which items to show
- **Search field** — filter the tree by name
- **Tree view** — hierarchical display of the entire document structure
- Shows nested symbol instances, text fields, ActionScript, media — everything in the document organized by scene > layer > frame

## Output Panel

**Default position:** Usually closed; pops up when trace() is called.
**Shortcut:** F2

A simple text output pane showing:
- `trace()` output during Test Movie
- Compiler warnings and errors
- Loading/export progress messages

Has a context menu with Copy, Clear, Find, and Save to File.

## Debugger Panel

**Default position:** Opens in a separate window during Debug Movie (Ctrl+Shift+Enter).

### Structure

- **Display List** — tree showing the movie clip hierarchy at runtime
- **Variables tab** — shows all variables in the selected scope
- **Locals tab** — local variables in the current function
- **Properties tab** — properties of the selected movie clip
- **Watch tab** — user-defined watch expressions
- **Call Stack** — function call chain
- **Breakpoints** — list of set breakpoints
- Control buttons: Continue, Stop, Step In, Step Over, Step Out

## Strings Panel

**Default position:** Usually closed.
**Shortcut:** Ctrl+F11

For localization/multilanguage support:
- **Settings** button — configure target languages and default language
- **String table** — columns for String ID, each target language; cells are editable
- **Change/Add/Delete** buttons for managing strings
- Strings are loaded from XML files at runtime for the selected language

## Web Services Panel

**Default position:** Usually closed.

- Define WSDL URLs for SOAP web services
- Browse available methods and their parameters
- Drag methods onto components or into ActionScript

## Project Panel

**Default position:** Usually closed (Flash Professional only).
**Shortcut:** Shift+F8

- **File tree** — project files organized by type (Flash Documents, ActionScript, Other)
- **Test Project** button — publishes and tests the main document
- **Add/Remove file** buttons
- **Version Control** integration (check in/check out if configured)
- Projects use `.flp` project files

## Common Libraries

Accessible via Window > Common Libraries. These open as read-only Library panels:

- **Buttons** — pre-made button symbols organized by style (Arcade, Classic, Circle, Gel, Playback, etc.)
- **Classes** — ActionScript class symbols
- **Learning Interactions** — drag-and-drop, fill-in-the-blank, hot-spot, and quiz interaction templates

To use an item, drag it from the common library into your document's Library or directly onto the Stage.

## Flight Adaptation Notes

Panels are pluggable presentations over shared editor state. Follow [the shared architecture and layout contracts](./flash8-implementation-contract.md#shared-architecture-boundary).

- Every panel contribution declares a stable ID, title, icon, preferred/default region, minimum/preferred size, allowed host types, ordering, and state-serialization version.
- Opening or moving a panel does not create document history. Panel layout is host/workspace preference state; scene-affecting actions inside a panel use shared commands and do create document history.
- Panel instances subscribe to narrowly scoped state and dispose subscriptions when hidden or destroyed. Hiding a panel preserves its transient UI state unless the user explicitly resets the layout.
- Tabs, trees, lists, splitters, and disclosure controls support keyboard navigation and expose semantic roles. Focus returns predictably after a panel closes or moves.
- Empty, loading, invalid-document, unsupported-selection, and error states are first-class panel states. Do not leave a blank panel that looks broken.
- Timeline, Actions, Components, Debugger, Strings, Web Services, and Project panels remain reference material until Flight defines their underlying models and capabilities.
- Panel layout migration tolerates renamed or removed contributions and restores a usable default when saved geometry is off-screen or incompatible.
- Add tests for registration conflicts, ordering, visibility toggles, persistence/reset, disposal, narrow layouts, and missing-plugin recovery.
