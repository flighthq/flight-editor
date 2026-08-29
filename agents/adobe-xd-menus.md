# Adobe XD System Menus

Authoritative reference for all menu entries in Adobe XD (mature version, circa 2021–2022). Windows uses a hamburger menu (☰) at the top-left of the toolbar; Mac uses the native menu bar. Shortcuts listed as Ctrl apply Cmd on Mac.

## File Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| New | Ctrl+N | Create a new XD document; opens a dialog with preset sizes or custom dimensions |
| Open... | Ctrl+O | Open an existing .xd file |
| Open Recent | ▸ | Submenu listing recently opened files |
| ─── | | |
| Save | Ctrl+S | Save the document (cloud or local) |
| Save As... | Ctrl+Shift+S | Save a copy with a new name/location |
| Save as Local Document | | Save a cloud document to local storage |
| Revert to Saved | | Discard changes since last save |
| ─── | | |
| Import | ▸ | (submenu below) |
| Export | ▸ | (submenu below) |
| ─── | | |
| Manage Linked Symbols | | View and manage symbols linked from other documents |
| ─── | | |
| Close | Ctrl+W | Close the active document |
| Exit | Alt+F4 (Win) / Cmd+Q (Mac) | Quit Adobe XD |

### Import Submenu

| Item | Description |
|------|-------------|
| From Photoshop | Import layers from a .psd file (preserves layer structure) |
| From Illustrator | Import artwork from an .ai file |
| From Sketch | Import a .sketch file (converts artboards, symbols, text styles) |
| SVG | Import SVG vector file |
| Image (Bitmap) | Import PNG, JPEG, GIF, BMP, TIFF |

### Export Submenu

| Item | Shortcut | Description |
|------|----------|-------------|
| Batch Export | Ctrl+Shift+E | Export all objects/artboards marked for export |
| Selected... | Ctrl+E | Export selected object(s) as PNG, SVG, JPG, or PDF |
| All Artboards... | | Export every artboard as individual files |

### Export Dialog Settings

| Field | Options |
|-------|---------|
| Format | PNG, SVG, JPG, PDF |
| Export For | Design (1x), Web (1x, 2x), iOS (1x, 2x, 3x), Android (ldpi through xxxhdpi) |
| Quality (JPG) | Slider 1–100 |
| Designed at | Base resolution indicator |

## Edit Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Undo | Ctrl+Z | Undo the last action (unlimited undo history within the session) |
| Redo | Ctrl+Shift+Z / Ctrl+Y | Redo the last undone action |
| ─── | | |
| Cut | Ctrl+X | Cut selection to clipboard |
| Copy | Ctrl+C | Copy selection to clipboard |
| Paste | Ctrl+V | Paste from clipboard (centered in the viewport) |
| Paste at Same Position | | Paste at the exact coordinates of the original |
| Paste Appearance | Ctrl+Alt+V | Paste only the visual properties (fill, border, shadow, blur) from the copied object onto the selected object |
| ─── | | |
| Duplicate | Ctrl+D | Duplicate the selection in place (offset slightly) |
| Delete | Delete / Backspace | Delete the selected objects |
| ─── | | |
| Select All | Ctrl+A | Select all objects on the current artboard (or all artboards if none is focused) |
| Deselect All | Ctrl+Shift+A | Deselect everything |
| ─── | | |
| Find and Replace... | Ctrl+F | Find and replace text across the document |
| ─── | | |
| Copy SVG Code | | Copy the selected vector object as inline SVG markup |
| Copy CSS | | Copy CSS properties (position, size, colors, fonts, shadows) for the selection |

## Object Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Group | Ctrl+G | Group selected objects |
| Ungroup | Ctrl+Shift+G | Ungroup the selected group |
| ─── | | |
| Make Component | Ctrl+K | Convert the selection into a reusable Main Component |
| Edit Main Component | | Navigate to and enter the Main Component of the selected instance |
| ─── | | |
| Make Repeat Grid | Ctrl+R (in some versions) | Convert the selection into a Repeat Grid |
| Ungroup Repeat Grid | | Dissolve the Repeat Grid into individual objects |
| ─── | | |
| Mask with Shape | Ctrl+Shift+M | Use the top shape as a clipping mask for the objects below it |
| Unmask | | Remove the mask, restoring the original objects |
| ─── | | |
| Lock / Unlock | Ctrl+L | Toggle lock on the selected objects (prevents selection/editing on canvas) |
| Hide / Show | Ctrl+; | Toggle visibility of the selected objects |
| ─── | | |
| Arrange | ▸ | (submenu below) |
| Align | ▸ | (submenu below) |
| Distribute | ▸ | (submenu below) |
| ─── | | |
| Path | ▸ | (submenu below) |
| Boolean Operations | ▸ | (submenu below) |
| ─── | | |
| Flip Horizontally | | Mirror the selection horizontally |
| Flip Vertically | | Mirror the selection vertically |
| ─── | | |
| Export Selected... | Ctrl+E | Export the selection as an image/SVG |
| Batch Export | Ctrl+Shift+E | Export all marked items |
| Mark for Export | Ctrl+Shift+E (toggle) | Mark/unmark the selection for inclusion in Batch Export |

### Arrange Submenu

| Item | Shortcut | Description |
|------|----------|-------------|
| Bring to Front | Ctrl+Shift+] | Move to the top of the z-order |
| Bring Forward | Ctrl+] | Move up one position in the z-order |
| Send Backward | Ctrl+[ | Move down one position |
| Send to Back | Ctrl+Shift+[ | Move to the bottom of the z-order |

### Align Submenu

| Item | Shortcut | Description |
|------|----------|-------------|
| Left | Ctrl+Shift+← (varies) | Align left edges |
| Center (Horizontal) | | Align horizontal centers |
| Right | | Align right edges |
| Top | | Align top edges |
| Center (Vertical) | | Align vertical centers |
| Bottom | | Align bottom edges |

When a single object is selected, it aligns relative to its parent artboard. When multiple objects are selected, they align relative to each other's bounding box.

### Distribute Submenu

| Item | Description |
|------|-------------|
| Horizontally | Even horizontal spacing between 3+ selected objects |
| Vertically | Even vertical spacing between 3+ selected objects |

### Path Submenu

| Item | Shortcut | Description |
|------|----------|-------------|
| Convert to Path | Ctrl+8 | Convert a shape primitive (rectangle, ellipse) or text to an editable vector path |
| Object to Path | | Convert a compound/boolean result to a flat path |

### Boolean Operations Submenu

| Item | Shortcut | Description |
|------|----------|-------------|
| Add (Unite) | Ctrl+Alt+U | Merge all selected shapes into one |
| Subtract | Ctrl+Alt+S | Cut front shape(s) from the back shape |
| Intersect | Ctrl+Alt+I | Keep only the overlapping region |
| Exclude Overlap | Ctrl+Alt+X | Keep everything except the overlapping region |

## View Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Zoom In | Ctrl+= | Increase zoom level |
| Zoom Out | Ctrl+− | Decrease zoom level |
| Zoom to Fit | Ctrl+0 | Fit all artboards in the viewport |
| Zoom to Selection | Ctrl+3 | Zoom and center on the selected object(s) |
| Actual Size | Ctrl+1 | Zoom to 100% |
| ─── | | |
| Show/Hide Artboard Guides | | Toggle artboard-specific ruler guides |
| Show/Hide Grid | Ctrl+' | Toggle the layout/square grid overlay |
| Snap to Grid | Ctrl+Shift+' | Toggle grid snapping |
| Show/Hide Pixel Grid | | Show individual pixels when zoomed in past 800% |
| ─── | | |
| Rulers | | Toggle rulers along the top and left edges |
| ─── | | |
| Zoom | ▸ | Submenu with zoom presets: 50%, 100%, 200%, 400%, custom |
| ─── | | |
| Layers | Ctrl+Y | Show the Layers panel tab |
| Assets | Ctrl+Shift+Y | Show the Assets panel tab |
| Plugins | Ctrl+Shift+P | Show the Plugins panel tab |

## Plugins Menu

| Item | Description |
|------|-------------|
| (Installed plugins) | Each installed plugin appears as a menu item; click to launch |
| ─── | |
| Manage Plugins... | Opens the Plugin Manager to install, update, or remove plugins |
| Discover Plugins... | Browse the XD Plugin Marketplace |

## Window Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Minimize | Ctrl+M (Mac) | Minimize the window |
| Bring All to Front | (Mac only) | Raise all XD windows |
| ─── | | |
| (Open document list) | | List of currently open XD documents; click to switch |

XD has no configurable panel layout or window management — the workspace is fixed. There is no Window > Panels submenu because the Layers, Assets, and Plugins panels are always present as tabs.

## Help Menu

| Item | Description |
|------|-------------|
| Adobe XD Help... | Opens the online help documentation |
| XD Community | Opens the Adobe XD community forums |
| Submit Feedback | Opens the feedback form |
| ─── | |
| Keyboard Shortcuts | Opens a visual keyboard shortcut reference overlay |
| ─── | |
| About Adobe XD | Version and credit information |

## Context Menus (Right-Click)

### Canvas Context Menu (right-click empty area)

- Paste
- Paste Appearance
- Edit Artboard (if over an artboard background)
- Zoom In / Zoom Out / Zoom to Fit / Actual Size
- Show/Hide Grid
- Show/Hide Guides

### Object Context Menu (right-click on a selected object)

- Cut / Copy / Paste / Duplicate / Delete
- Copy SVG Code
- Copy CSS
- Group / Ungroup
- Make Component / Edit Main Component (instance)
- Make Repeat Grid
- Mask with Shape
- Lock / Unlock
- Hide / Show
- Arrange ▸ (Bring to Front, Forward, Backward, Send to Back)
- Align ▸
- Distribute ▸
- Add Color to Assets (extracts the fill color to the Assets panel)
- Add Character Style to Assets (for text objects)
- Export Selected...
- Mark for Export

### Layers Panel Context Menu (right-click on a layer row)

- Cut / Copy / Paste / Delete
- Duplicate
- Rename
- Group / Ungroup
- Make Component
- Lock / Unlock
- Hide / Show
- Arrange ▸
- Export...

### Assets Panel Context Menu (right-click on an asset)

**Color:**
- Edit
- Rename
- Delete
- Apply as Fill
- Apply as Border
- Highlight on Canvas (scrolls to and highlights all objects using this color)

**Character Style:**
- Edit
- Rename
- Delete
- Highlight on Canvas

**Component:**
- Edit Main Component
- Rename
- Delete
- Reveal in Layers Panel
- Add to Favorites / Remove from Favorites
- Group / Ungroup (organize components into named groups)

## Flight Adaptation Notes

Apply [the shared XD command and capability model](./adobe-xd-implementation-contract.md).

- File, Object, View, prototype, export, and asset entries project shared command state; they do not implement mutations in menu callbacks.
- Native host menus, hamburger menus, context menus, and command palettes may present different subsets of the same command IDs.
- Cloud, Share, plugin-manager, and Adobe import entries appear only when an integration contributes them.
- Component, responsive-layout, repeat-grid, vector, and prototype commands remain absent or explainably disabled until their document models exist.
- Menu enablement covers invalid YAML, read-only preview, editing scope, locked selection, mixed selection, and unavailable host capabilities.
- Context-menu invocation first resolves the target and selection policy, then queries commands; it must not operate on a stale prior selection accidentally.
