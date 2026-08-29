# Adobe XD Panels

Authoritative reference for all panels in Adobe XD, excluding the Property Inspector (covered in `adobe-xd-properties-inspector.md`).

## Left Panel Overview

The left panel has three tabs at the top: **Layers**, **Assets**, and **Plugins**. Only one tab is visible at a time. The panel width is resizable by dragging its right edge.

| Tab | Shortcut | Purpose |
|-----|----------|---------|
| Layers | Ctrl/Cmd+Y | Document structure tree — artboards, groups, objects |
| Assets | Ctrl/Cmd+Shift+Y | Reusable design tokens — colors, character styles, components |
| Plugins | Shift+Ctrl/Cmd+P | Installed plugin list and access |

## Layers Panel

### Purpose
Shows the complete document hierarchy. Every object, group, component, and artboard appears here in z-order.

### Structure

The tree is organized as:

1. **Artboards** — top-level containers, listed in spatial order (top-left to bottom-right)
2. **Objects within artboards** — listed in z-order within each artboard (top of list = frontmost in visual stack)
3. **Pasteboard objects** — objects not inside any artboard appear at the bottom, under a "Pasteboard" section

### Layer Row Elements

Each row in the Layers panel shows:

| Element | Position | Behavior |
|---------|----------|----------|
| Expand/collapse triangle | Far left | Toggle children visibility for artboards, groups, components, and masks |
| Object icon | Before name | Shape type indicator: rectangle, ellipse, path, text (Aa), group, component (◇), image, video |
| Object name | Center | Editable — double-click to rename |
| Visibility (eye icon) | Right (on hover) | Toggle visibility; hidden objects are dimmed in the list |
| Lock (lock icon) | Right (on hover) | Toggle lock; locked objects cannot be selected or edited on canvas |

### Interactions

| Action | Result |
|--------|--------|
| Click a row | Select that object on the canvas (scrolls canvas to show it if needed) |
| Shift+click | Extend selection to include all rows between current and clicked |
| Ctrl/Cmd+click | Toggle individual rows in/out of the selection |
| Drag a row up/down | Reorder the object in z-order (within the same artboard) |
| Drag a row into a group/artboard | Reparent the object |
| Drag a row out of a group | Unparent (move to the artboard root or pasteboard) |
| Double-click row name | Rename the object inline |
| Right-click row | Context menu (see below) |
| Click Eye icon | Toggle visibility (Ctrl/Cmd+;) |
| Alt/Option+click Eye icon | Solo: hide all others, show only this |
| Click Lock icon | Toggle lock (Ctrl/Cmd+L) |

### Layer Context Menu (right-click)

- Cut / Copy / Paste / Delete
- Duplicate
- Rename
- Group (Ctrl/Cmd+G)
- Ungroup (Ctrl/Cmd+Shift+G)
- Make Component (Ctrl/Cmd+K)
- Lock / Unlock (Ctrl/Cmd+L)
- Hide / Show (Ctrl/Cmd+;)
- Mask with Shape (Ctrl/Cmd+Shift+M)
- Add to Favorites (for components)
- Edit Main Component (for component instances)
- Export...

### Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| Green diamond (◇) before name | Object is a Component (master or instance) |
| Dimmed row | Object is hidden |
| Lock icon persisted | Object is locked |
| Blue highlight | Object is currently selected |
| Indentation | Nesting depth within groups/artboards |
| Dotted green border on name | Component instance with overrides |

### Search / Filter

A search field at the top of the Layers panel allows filtering by object name. Only matching objects (and their parent containers) are shown while filtering.

## Assets Panel

### Purpose
Manage reusable design tokens — colors, character styles, and components. Assets are document-level by default but can be linked from Creative Cloud Libraries.

### Colors Section

Stores document colors for consistent reuse.

| Element | Behavior |
|---------|----------|
| Color swatches grid | Small colored squares; click to apply to the selected object's fill |
| Right-click swatch | Edit, Rename, Delete, Apply as Fill, Apply as Border, Highlight on Canvas |
| **+** button | Add the currently selected object's fill color to the list; or right-click an object and choose "Add Color to Assets" |
| Drag swatch onto object | Apply that color as the object's fill |
| Edit a swatch | Changes propagate to all objects using that color (if applied via the asset) |

Colors are stored as hex values. Gradients and image fills are not stored in the Colors section (they are part of component definitions).

### Character Styles Section

Stores reusable text formatting presets.

| Element | Behavior |
|---------|----------|
| Style list | Shows style name + preview (font family, weight, size) |
| Right-click style | Edit, Rename, Delete, Highlight on Canvas |
| **+** button | Create a character style from the currently selected text's formatting |
| Click a style (with text selected) | Apply that style to the selected text |
| Edit a style | All text using that style updates to the new definition |

A character style captures:
- Font family and weight
- Font size
- Character spacing (tracking)
- Line spacing (leading)
- Paragraph spacing
- Color
- Text transform (uppercase, lowercase, titlecase)
- Underline, strikethrough

### Components Section

Stores master components for reuse.

| Element | Behavior |
|---------|----------|
| Component list | Shows component name + thumbnail preview |
| Drag component to canvas | Place an instance of that component |
| Right-click component | Edit Main Component, Rename, Delete, Add to Favorites, Group components |
| **+** button | Not present — components are created via Ctrl/Cmd+K on the canvas |
| Double-click component | Navigate to the master component on the canvas |
| Search field | Filter components by name |

### Component Organization

- Components can be organized into **groups** using "/" in the name (e.g., "Buttons/Primary", "Buttons/Secondary" groups under "Buttons")
- Groups are collapsible folders in the Assets panel
- Components can be marked as **Favorites** for quick access
- The component thumbnail updates when the master component is edited

### Linked Assets (Creative Cloud Libraries)

When a CC Library is linked:

| Element | Behavior |
|---------|----------|
| Library section | Appears below document assets; shows colors, character styles, and components from the linked library |
| Library badge | Small cloud icon indicates the asset is linked, not local |
| Drag library asset to canvas | Creates an instance linked to the library source |
| Edit linked asset | Opens in the source application (e.g., Illustrator); changes propagate to all documents using the link |
| Unlink | Converts to a local document asset |

## Plugins Panel

### Purpose
Access installed plugins. Plugins extend XD's capabilities (auto-layout helpers, icon libraries, data generators, accessibility checkers, etc.).

### Structure

| Element | Behavior |
|---------|----------|
| Installed plugins list | Icons and names; click to launch |
| Search field | Search for installed plugins by name |
| "Discover Plugins" link | Opens the XD Plugin Manager to browse and install plugins |
| Plugin UI | Some plugins open a panel docked below the left panel; others open a modal dialog |

### Plugin Panel Behavior

- Plugins that provide a persistent panel (e.g., a color palette plugin) dock below the left panel
- Only one plugin panel is visible at a time
- The plugin panel can be dismissed by clicking its close button or switching to a different plugin
- Plugins can read and modify the document, create objects, export assets, and interact with web services

## Desktop Preview Window

Not a panel per se, but a separate always-on-top window opened via the Preview button (▶) in the toolbar or Ctrl/Cmd+Enter.

### Behavior

| Feature | Description |
|---------|-------------|
| Artboard display | Shows the currently selected artboard or the Home artboard at actual pixel size |
| Interaction | Clickable — simulates prototype interactions (taps, drags, keyboard triggers) |
| Hot reload | Updates live as you edit on the canvas — no need to re-launch |
| Scrolling | Simulates scrollable artboard content when viewport height is set |
| Navigation | Follows prototype wiring — clicking wired hotspots transitions to target artboards |
| Back button | Navigates back through the interaction history |
| Restart | Resets to the Home artboard |
| Device frame | Optional device frame overlay matching the artboard preset |

### Shortcuts in Preview

| Action | Result |
|--------|--------|
| Click hotspot | Trigger interaction (equivalent to tap) |
| Press keyboard key | Trigger key-bound interactions (if configured in Prototype mode) |
| Ctrl/Cmd+← | Go back to previous artboard |
| Escape or close window | Exit preview |

## Share Dialog

Accessed via the Share button in the toolbar or from Share mode. Not a persistent panel — opens as a modal workflow.

### Link Types

| Type | Purpose |
|------|---------|
| Design Review | Viewers can comment on designs; shows artboards as browsable screens with comment pins |
| Development | Developers can inspect design specs, measurements, CSS/code snippets, and download assets |
| Presentation | Full-screen slideshow of artboards; no editing UI shown to viewers |
| Custom | Configure which artboard(s) to include and access level |

### Share Settings

| Setting | Options |
|---------|---------|
| Link access | Anyone with the link / Invited only |
| Password | Optional password protection |
| Allow comments | Toggle commenting |
| Artboards | All artboards / Selected artboards / Specific flow |
| Hotspots | Show interaction hotspot hints to viewers |

### Published Link Behavior

- Each share creates a unique URL
- Links can be updated (republished) to reflect design changes
- Links can be deleted to revoke access
- Comments from reviewers appear on the canvas as blue pin icons
- Previous links are listed in the Share mode for management

## Repeat Grid

Not a panel, but a unique XD feature accessible from the Property Inspector or Object menu.

### Behavior

When an object or group is converted to a Repeat Grid:

- Green handles appear on the right and bottom edges
- Drag the right handle to repeat horizontally
- Drag the bottom handle to repeat vertically
- Adjust spacing between repeated cells by hovering between them (pink spacing indicator appears; drag to adjust)
- Edit content in one cell — structural changes (add/remove objects, change layout) apply to all cells
- Override content per cell — text and images can differ per cell (drag a set of images or a CSV onto the grid to auto-populate)
- Ungroup the Repeat Grid to convert to individual objects

## Component System

### Creating Components

1. Select one or more objects on the canvas
2. Press Ctrl/Cmd+K or Object > Make Component
3. The selection becomes a **Main Component** (green diamond icon, green dashed border)
4. The Main Component appears in the Assets panel under Components

### Component Instances

- Drag from the Assets panel or Alt/Option+drag a Main Component to create instances
- Instances are linked to the Main Component — changes to the main propagate to all instances
- Instances can have **overrides**: text content, fill colors, image content, visibility, size
- Overrides persist even when the Main Component is updated
- Right-click an instance > "Edit Main Component" to navigate to and edit the source

### Component States

Components support multiple **states** for interactive variations:

| State | Purpose |
|-------|---------|
| Default State | The initial appearance |
| Hover State | Appearance when hovered (for prototyping) |
| Additional states | Custom states (active, disabled, focused, etc.) |

States are managed in the Property Inspector when the Main Component is selected. Each state can have different visual properties (color, size, visibility of children, text). In Prototype mode, state changes can be wired to triggers.

### Nested Components

Components can contain other components. Editing a nested component's Main Component updates all instances of it, even within other components.
