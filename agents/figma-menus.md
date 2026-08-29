# Figma System Menus

Authoritative reference for all menu entries in Figma (circa 2024–2025). Accessed via the hamburger menu (☰) in the top-left of the toolbar (both browser and desktop app). Mac also shows these in the native menu bar. Shortcuts listed as Ctrl apply Cmd on Mac.

## Quick Actions

| Item | Shortcut | Description |
|------|----------|-------------|
| Quick Actions | Ctrl+/ or Ctrl+P | Command palette — search any action, menu item, plugin, or tool by name |

Quick Actions is the first item in the hamburger menu and is the fastest way to reach any command.

## File Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| New design file | | Create a new Figma design file |
| New FigJam file | | Create a new FigJam whiteboard |
| New from template | | Browse and create from starter templates |
| ─── | | |
| Place image/video... | Ctrl+Shift+K | Import and place an image or video onto the canvas |
| ─── | | |
| Save local copy... | Ctrl+Shift+S | Save a .fig file to local disk |
| Save to version history | Ctrl+Alt+S | Create a named version checkpoint |
| Show version history | Ctrl+Alt+H | Open the version history panel |
| ─── | | |
| Export... | Ctrl+Shift+E | Open the export dialog for marked objects |
| Export frames to PDF | | Export all top-level frames as a multi-page PDF |
| ─── | | |
| Move to project... | | Move this file to a different team/project |
| Rename | | Rename the file |

## Edit Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Undo | Ctrl+Z | Undo the last action |
| Redo | Ctrl+Shift+Z / Ctrl+Y | Redo the last undone action |
| ─── | | |
| Copy | Ctrl+C | Copy selection to clipboard |
| Cut | Ctrl+X | Cut selection |
| Paste | Ctrl+V | Paste (centered in viewport) |
| Paste over selection | Ctrl+Shift+V | Paste at the same position as the original |
| Paste to replace | | Replace the selected object with clipboard contents |
| ─── | | |
| Copy properties | Ctrl+Alt+C | Copy visual properties (fill, stroke, effects, text style) |
| Paste properties | Ctrl+Alt+V | Apply copied properties to the selection |
| ─── | | |
| Copy as ▸ | | Submenu: Copy as PNG, Copy as SVG, Copy as CSS, Copy link |
| ─── | | |
| Duplicate | Ctrl+D | Duplicate the selection in place (offset slightly) |
| Delete | Delete / Backspace | Delete the selection |
| ─── | | |
| Find and replace... | Ctrl+F | Search and replace text across the file |
| ─── | | |
| Select all | Ctrl+A | Select all objects on the current page (or all within the current frame if entered) |
| Select none | Ctrl+Shift+A / Escape | Deselect everything |
| Select inverse | | Select everything that is not currently selected (within the parent) |
| Select all with same properties | ▸ | Submenu: Same fill, Same stroke, Same effect, Same text properties, Same font, Same instance |
| ─── | | |
| Set default properties | | Save the current object's properties as the default for newly created objects of that type |
| Copy/paste as text | | (Inside text editing) Standard text clipboard operations |

## View Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Pixel preview | Ctrl+Alt+Y | Toggle pixel-accurate rendering preview (shows anti-aliasing as it would appear in export) |
| ─── | | |
| Layout grids | Ctrl+G | Toggle layout grid visibility on frames that have grids defined |
| Rulers | Shift+R | Toggle ruler display along top and left edges |
| Show slices | | Toggle visibility of slice objects |
| ─── | | |
| Outlines | Ctrl+Shift+3 or Ctrl+Y | Toggle outline mode (wireframe view — no fills, only strokes and text outlines) |
| Pixel grid | Ctrl+' | Toggle pixel grid visibility (at high zoom levels) |
| ─── | | |
| Snap to geometry | | Toggle snapping to object edges, centers, and spacing |
| Snap to pixel grid | | Toggle snapping to whole pixel positions |
| ─── | | |
| Zoom in | Ctrl+= / Ctrl++ | Increase zoom |
| Zoom out | Ctrl+− | Decrease zoom |
| Zoom to 100% | Ctrl+0 | Actual size |
| Zoom to fit | Shift+1 / Ctrl+1 | Fit all content in viewport |
| Zoom to selection | Shift+2 / Ctrl+2 | Zoom to selected object(s) |
| Zoom to next frame | N | Zoom to and center on the next frame |
| Zoom to previous frame | Shift+N | Zoom to the previous frame |
| ─── | | |
| Panels ▸ | | Toggle visibility of individual panels (see submenu below) |
| ─── | | |
| Multiplayer cursors | | Toggle visibility of other users' cursors |
| Show comments | | Toggle comment pin visibility |

### View > Panels Submenu

| Item | Shortcut | Description |
|------|----------|-------------|
| Show left panel | Ctrl+Shift+\ | Toggle the Layers/Assets panel |
| Show right panel | Ctrl+Alt+\ | Toggle the Design/Prototype/Inspect panel |
| Open layers panel | | Switch left panel to Layers tab |
| Open assets panel | | Switch left panel to Assets tab |
| Open design panel | | Switch right panel to Design tab |
| Open prototype panel | | Switch right panel to Prototype tab |
| Open inspect panel | | Switch right panel to Inspect tab |

## Object Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Group selection | Ctrl+G | Wrap selected objects in a group |
| Ungroup | Ctrl+Shift+G | Remove the group container, release children |
| Frame selection | Ctrl+Alt+G | Wrap selected objects in a frame |
| Unframe | Ctrl+Shift+G | Remove the frame container (same shortcut as Ungroup) |
| ─── | | |
| Use as mask | Ctrl+Alt+M | Use the top shape as a clipping mask for objects below it |
| Remove mask | | Remove the masking relationship |
| ─── | | |
| Create component | Ctrl+Alt+K | Convert selection to a Main Component |
| Detach instance | Ctrl+Alt+B | Break the link from an instance to its Main Component |
| Go to main component | | Navigate to the Main Component of the selected instance |
| Push overrides to main component | | Apply instance overrides back to the Main Component |
| Restore main component | | Restore a deleted Main Component from an existing instance |
| ─── | | |
| Create component set | | Combine multiple components into a variant component set |
| Add variant | | Add a new variant to the selected component set |
| ─── | | |
| Reset all overrides | | Remove all overrides from the selected instance |
| ─── | | |
| Add auto layout | Shift+A | Add auto layout to the selected frame or frame the selection with auto layout |
| Remove auto layout | | Remove auto layout from the frame (preserves children in place) |
| ─── | | |
| Flatten | Ctrl+E | Flatten selection into a single vector path (destructive) |
| Outline stroke | Ctrl+Shift+O | Convert strokes to filled paths |
| ─── | | |
| Boolean groups ▸ | | (submenu below) |
| ─── | | |
| Rasterize selection | | Convert the selection to a bitmap image |
| ─── | | |
| Set as thumbnail | | Set the selected frame as the file's cover thumbnail |
| ─── | | |
| Show/Hide | Ctrl+Shift+H | Toggle visibility of selected objects |
| Lock/Unlock | Ctrl+Shift+L | Toggle lock on selected objects |
| ─── | | |
| Mark as ready for dev | | Flag the selection as ready for developer handoff |
| Add link | | Attach a URL link to the selected object |

### Boolean Groups Submenu

| Item | Description |
|------|-------------|
| Union selection | Combine shapes |
| Subtract selection | Cut front from back |
| Intersect selection | Keep only overlap |
| Exclude selection | Keep everything except overlap |
| Flatten | Merge into a single path |

## Text Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Bold | Ctrl+B | Toggle bold weight |
| Italic | Ctrl+I | Toggle italic style |
| Underline | Ctrl+U | Toggle underline |
| Strikethrough | Ctrl+Shift+X | Toggle strikethrough |
| ─── | | |
| Create link | Ctrl+K | Attach a hyperlink to selected text |
| ─── | | |
| Bulleted list | | Toggle unordered list |
| Numbered list | | Toggle ordered list |
| ─── | | |
| Text align left | Ctrl+Alt+L | Left-align |
| Text align center | Ctrl+Alt+T | Center-align |
| Text align right | Ctrl+Alt+R | Right-align |
| Text align justify | Ctrl+Alt+J | Justify |
| ─── | | |
| Text case ▸ | | Uppercase, Lowercase, Titlecase, Small Caps, Original |
| ─── | | |
| Auto resize ▸ | | Auto Width, Auto Height, Fixed Size |
| ─── | | |
| Increase font size | Ctrl+Shift+> | Increase size by 1px |
| Decrease font size | Ctrl+Shift+< | Decrease size by 1px |
| Increase font weight | Ctrl+Alt+> | Step to next heavier weight |
| Decrease font weight | Ctrl+Alt+< | Step to next lighter weight |
| ─── | | |
| Increase line height | Ctrl+Shift+> | Increase line height |
| Decrease line height | Ctrl+Shift+< | Decrease line height |
| ─── | | |
| Increase letter spacing | Ctrl+Alt+> | Widen tracking |
| Decrease letter spacing | Ctrl+Alt+< | Narrow tracking |

## Arrange Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Align left | Alt+A | Align left edges |
| Align horizontal centers | Alt+H | Align horizontal centers |
| Align right | Alt+D | Align right edges |
| Align top | Alt+W | Align top edges |
| Align vertical centers | Alt+V | Align vertical centers |
| Align bottom | Alt+S | Align bottom edges |
| ─── | | |
| Distribute horizontal spacing | Alt+Shift+H | Even horizontal gaps (3+ objects) |
| Distribute vertical spacing | Alt+Shift+V | Even vertical gaps |
| ─── | | |
| Tidy up | Ctrl+Alt+Shift+T | Auto-arrange selection into a neat grid |
| Pack horizontal | | Remove gaps and pack objects tightly horizontally |
| Pack vertical | | Pack tightly vertically |
| ─── | | |
| Bring to front | ] | Move to the top of z-order |
| Bring forward | Ctrl+] | Move up one z-level |
| Send backward | Ctrl+[ | Move down one z-level |
| Send to back | [ | Move to the bottom of z-order |
| ─── | | |
| Flip horizontal | Shift+H | Mirror horizontally |
| Flip vertical | Shift+V | Mirror vertically |
| ─── | | |
| Round to pixel | | Snap position and size to whole pixels |

## Vector Menu

Available when a vector path or boolean group is selected, or when in path editing mode:

| Item | Shortcut | Description |
|------|----------|-------------|
| Join | Ctrl+J | Connect two open endpoints into one path |
| Smooth join | | Join with smooth (curved) transition |
| Delete and heal | Ctrl+Backspace | Delete selected point(s) and reconnect the path |
| ─── | | |
| Bend tool | | Activate the bend tool (drag a segment to curve it) |
| Paint bucket | | Activate the paint bucket tool (fill enclosed regions within a path) |

## Plugins Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Run last plugin | Ctrl+Alt+P | Re-run the most recently used plugin |
| ─── | | |
| Manage plugins... | | Open the plugin manager (installed, saved, browse community) |
| ─── | | |
| (Installed plugins) | | Each installed plugin is listed; click to run |

## Widgets Menu

| Item | Description |
|------|-------------|
| (Installed widgets) | Widgets available for placement on the canvas |
| Manage widgets... | Browse and manage installed widgets |

## Preferences

Not a submenu — clicking opens a settings panel:

| Setting | Description |
|---------|-------------|
| Snap to geometry | Toggle snapping to object edges, centers, and distributed spacing |
| Snap to objects | Toggle snapping to other objects |
| Snap to pixel grid | Toggle rounding to whole pixels |
| ─── | |
| Nudge amount | Set the small nudge (default 1px) and big nudge (default 10px) values |
| ─── | |
| Highlight layers on hover | Toggle layer highlighting on canvas when hovering in the Layers panel |
| Rename duplicated layers | Auto-append " Copy" or increment numbers on duplicated layers |
| Show dimensions on objects | Show W×H labels on selected objects |
| Open links in desktop app | (Browser) Open Figma links in the desktop app if installed |
| Invert zoom direction | Reverse scroll-to-zoom direction |

## Libraries

Opens the Libraries modal:

| Feature | Description |
|---------|-------------|
| Enable/disable libraries | Toggle team libraries for this file |
| Publish library | Publish this file's components and styles as a team library |
| Update available | Accept incoming library updates |
| Library details | View components, styles, and variables from each library |

## Help and Account

| Item | Description |
|------|-------------|
| Help page | Open Figma Help Center |
| Keyboard shortcuts | Open keyboard shortcut reference overlay |
| What's new | Release notes |
| Support forum | Community forum |
| Video tutorials | Figma's YouTube channel / learning resources |
| Legal & privacy | Terms and policies |
| ─── | |
| About Figma | Version info |
| Account settings | Profile, billing, teams |
| Log out | Sign out (browser) |

## Context Menus (Right-Click)

### Canvas Context Menu (right-click empty area)

- Paste here
- Paste to replace
- Frame selection
- Add auto layout
- ─
- Plugins ▸
- Widgets ▸
- ─
- View ▸ (zoom options, pixel preview, grids)
- ─
- Page ▸ (Rename page, Duplicate page, Delete page, Page background)
- ─
- Select all
- ─
- Show/Hide UI

### Object Context Menu (right-click on a selected object)

- Copy / Cut / Paste / Paste here / Paste to replace
- Duplicate
- Rename (Ctrl+R)
- Delete
- ─
- Copy as ▸ (PNG, SVG, CSS, Copy link)
- Copy properties / Paste properties
- ─
- Edit object / Enter (frames/groups/components)
- ─
- Group selection / Ungroup
- Frame selection / Unframe
- ─
- Create component / Detach instance
- Go to main component (instances)
- Reset all overrides (instances)
- ─
- Add auto layout / Remove auto layout
- ─
- Use as mask
- Flatten
- Outline stroke
- Boolean operations ▸
- ─
- Bring to front / Bring forward / Send backward / Send to back
- ─
- Flip horizontal / Flip vertical
- ─
- Lock/Unlock
- Show/Hide
- ─
- Set as thumbnail
- Mark as ready for dev
- Add link
- ─
- Export...
- ─
- Plugins ▸
- Widgets ▸

### Layers Panel Context Menu

Same as object context menu, since layers correspond directly to canvas objects.

## Flight Adaptation Notes

Apply [the Figma-inspired command and capability contract](./figma-implementation-contract.md).

- Quick Actions, native menus, context menus, command palettes, and toolbar buttons project the same command registry.
- Component, variable, Auto Layout, prototype, vector, history, comment, plugin, widget, and Dev Mode items are capability-gated.
- Library and cloud/account actions are integrations; no inert menu item should imply a service exists.
- Restore Version, detach instance, flatten, outline text, and destructive vector operations require explicit consequences and undo/recovery behavior.
- Context menus resolve the invocation target and current selection before querying command state.
- Test enablement for permissions, read-only revision preview, invalid YAML, missing plugins/assets, mixed selection, and active editing modes.
