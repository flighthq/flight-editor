# Figma Panels

Authoritative reference for all panels in Figma (circa 2024–2025), excluding the right-side Property Inspector (covered in `figma-properties-inspector.md`).

## Left Panel Overview

The left panel contains **Pages** (top), and two tabs: **Layers** and **Assets**. Toggle visibility with Ctrl/Cmd+Shift+\.

## Pages Section

Located at the top of the left panel, above the Layers/Assets tabs.

### Structure

- A vertical list of pages in the file
- The active page is highlighted
- Each file starts with one page ("Page 1")
- Pages are independent canvases — each has its own layer tree, frames, and objects

### Interactions

| Action | Result |
|--------|--------|
| Click a page name | Switch to that page |
| Double-click a page name | Rename the page inline |
| Right-click a page | Context menu: Rename, Duplicate page, Delete page, Copy link to page |
| Drag a page up/down | Reorder pages |
| **+** button (beside "Pages" header) | Add a new page |
| Delete a page | Removes the page and all its contents (confirmation prompt if it has content) |

### Page-Level Properties

- Each page has an independent canvas background color (set in the Design panel with no selection)
- Each page has its own set of frames, objects, and layer tree
- Prototypes can span across pages (interactions can target frames on other pages)
- Pages do not correspond to "screens" — a single page can contain many frames/screens

## Layers Panel

### Purpose

Shows the complete object hierarchy for the current page in z-order.

### Structure

Objects are listed in reverse z-order within each container (top of list = frontmost):

```
┌─ Layers ── Assets ─────────────────┐
│ 🔍 Search layers                    │
│                                      │
│ ▾ 📐 Frame — Home Screen            │
│   ├ Header                           │
│   │ ├ 🖼 Logo                        │
│   │ └ Aa Nav Links                   │
│   ├ 🖼 Hero Image                    │
│   ├ ◇ Button (Instance)             │
│   └ ◆ Card (Main Component)         │
│                                      │
│ ▾ 📐 Frame — Profile                │
│   ├ ○ Avatar Circle                 │
│   └ Aa Username                     │
│                                      │
│   □ Floating Element (pasteboard)    │
└──────────────────────────────────────┘
```

### Layer Row Elements

| Element | Position | Description |
|---------|----------|-------------|
| Expand/collapse triangle | Far left | Toggle child visibility for frames, groups, components |
| Object type icon | Before name | Frame (📐), Group (⊞), Rectangle (□), Ellipse (○), Text (Aa), Image (🖼), Component Main (◆), Component Instance (◇), Vector/Path, Boolean group, Slice, Section |
| Object name | Center | Double-click to rename |
| Visibility (eye) | Right (on hover) | Toggle visibility |
| Lock (padlock) | Right (on hover) | Toggle lock |

### Layer Interactions

| Action | Result |
|--------|--------|
| Click a row | Select that object on the canvas |
| Shift+click | Select a range of rows |
| Ctrl/Cmd+click | Toggle individual rows in the selection |
| Drag a row up/down | Reorder z-order within the same parent container |
| Drag a row into a frame/group | Reparent the object |
| Drag a row out of a frame/group | Move to the parent container |
| Double-click row name | Rename inline |
| Right-click row | Context menu |
| Click eye icon | Toggle visibility (Ctrl/Cmd+Shift+H) |
| Alt/Option+click eye icon | Solo: show only this object, hide all siblings |
| Click lock icon | Toggle lock (Ctrl/Cmd+Shift+L) |

### Layer Context Menu

- Copy / Cut / Paste / Paste here / Paste to replace
- Duplicate
- Rename (Ctrl/Cmd+R)
- Delete
- ─
- Copy as ▸ (Copy as CSS, Copy as SVG, Copy as PNG, Copy link)
- ─
- Group selection (Ctrl/Cmd+G)
- Frame selection (Ctrl/Cmd+Alt+G)
- Ungroup (Ctrl/Cmd+Shift+G)
- ─
- Create Component (Ctrl/Cmd+Alt+K)
- Detach Instance (Ctrl/Cmd+Alt+B)
- Go to Main Component
- ─
- Use as Mask (Ctrl/Cmd+Alt+M)
- ─
- Flatten (Ctrl/Cmd+E)
- Outline Stroke (Ctrl/Cmd+Shift+O)
- Boolean operations ▸
- ─
- Bring to Front / Bring Forward / Send Backward / Send to Back
- ─
- Lock/Unlock (Ctrl/Cmd+Shift+L)
- Show/Hide (Ctrl/Cmd+Shift+H)
- ─
- Mark as ready for development
- ─
- Set as thumbnail
- ─
- Export...

### Layer Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| ◆ (purple filled diamond) | Main Component |
| ◇ (purple outlined diamond) | Component Instance |
| Purple dotted outline on name | Instance with overrides |
| Dimmed row | Object is hidden |
| Lock icon (persistent) | Object is locked |
| Blue highlight | Currently selected |
| Orange text/highlight | Object is in a state (component variant) or has prototype interaction |
| Indentation | Nesting depth |
| Frame icon with layout indicator | Frame with Auto Layout enabled |

### Search / Filter

The search field at the top of the Layers panel filters the tree by object name. Matching objects and their parent containers are shown; non-matching objects are hidden. Clear the search to restore the full tree.

## Assets Panel

### Purpose

Browse and insert reusable components from the current file and enabled team libraries.

### Structure

```
┌─ Layers ── Assets ─────────────────┐
│ 🔍 Search components                │
│                                      │
│ ▾ Local components                   │
│   ▾ Page 1                           │
│     ◆ Button                         │
│     ◆ Card                           │
│     ◆ Input Field                    │
│   ▾ Page 2                           │
│     ◆ Modal                          │
│                                      │
│ ▾ Team Library — Design System       │
│   ▾ Buttons                          │
│     ◆ Primary Button                 │
│     ◆ Secondary Button               │
│   ▾ Icons                            │
│     ◆ Arrow Right                    │
│     ◆ Close                          │
│                                      │
│ 📚 Manage libraries                  │
└──────────────────────────────────────┘
```

### Sections

| Section | Contents |
|---------|----------|
| **Local components** | Components defined in this file, organized by page, then by containing frame |
| **Enabled libraries** | Components from team libraries enabled for this file, organized by library then by group |

### Component Organization in Assets

Components are organized by their location in the file:
- **Page** → **Frame** → **Component**: components nested inside frames appear under that frame's name
- **Slash naming convention**: a component named "Button/Primary" creates a group "Button" containing "Primary"
- Groups are collapsible folders in the Assets panel

### Interactions

| Action | Result |
|--------|--------|
| Drag a component to canvas | Place an instance |
| Double-click a local component | Navigate to its Main Component on the canvas |
| Right-click a component | Insert instance, Go to main component, Edit (opens library file for library components), Copy link |
| Search field | Filter components by name across all libraries |
| **Manage libraries** link (bottom) | Opens the libraries modal to enable/disable team libraries |

### Libraries Modal

| Feature | Description |
|---------|-------------|
| Toggle libraries | Enable/disable individual team libraries for this file |
| Current file section | Shows this file's published components |
| Publish changes | Publish local component updates to the team library (if this file is a library) |
| Update available | Notification when a library has updated components; click to review and accept changes |

## Component System

### Creating Components

| Method | Shortcut | Description |
|--------|----------|-------------|
| Create Component | Ctrl/Cmd+Alt+K | Convert the selection into a Main Component |
| Create Multiple Components | Ctrl/Cmd+Alt+K with multiple separate objects selected | Each selected object/group becomes its own Main Component |
| Create Component Set (Variants) | Combine multiple components into a Component Set | Group related variants under one component |

### Main Component vs Instance

| Feature | Main Component (◆) | Instance (◇) |
|---------|---------------------|---------------|
| Appearance | Purple diamond icon, purple border | Purple outlined diamond |
| Editing | Changes propagate to all instances | Overrides are local to this instance |
| Location | Typically on a dedicated "Components" page or in-context | Placed wherever needed on the canvas |
| Detach | N/A | Ctrl/Cmd+Alt+B — breaks the link, becomes a regular group/frame |

### Variants

Variants are multiple versions of a component grouped into a **Component Set**:

- A Component Set appears as a purple dashed border around multiple component variants
- Each variant has named **properties** (e.g., Type=Primary/Secondary, Size=Small/Large, State=Default/Hover/Disabled)
- Instances expose a dropdown in the Design panel to switch between variants
- Variant properties appear as dropdowns in the right panel when an instance is selected

### Component Properties

| Property Type | Description |
|---------------|-------------|
| **Boolean** | Show/hide a layer within the component (e.g., "Show Icon" true/false) |
| **Instance Swap** | Replace a nested instance with a different component (e.g., swap an icon) |
| **Text** | Expose a text layer's content as an editable property (e.g., "Button Label") |
| **Preferred Values** | Define a curated list of swap options for instance swap properties |

Component properties are defined on the Main Component and appear as editable fields in the right panel when an instance is selected.

### Overrides

When editing an instance, changes that differ from the Main Component are **overrides**:

- Overridable: text content, fill/stroke colors, visibility of children, component properties, instance swaps, effects
- Not overridable: adding/removing children, structural hierarchy changes
- Overrides persist when the Main Component is updated
- **Reset overrides**: right-click instance > Reset all overrides, or reset individual overrides in the Design panel

## Auto Layout

Figma's auto-layout system (similar to CSS Flexbox) on frames:

### Enabling

- Select a frame → click "Auto Layout" button in the Design panel (or Shift+A)
- Or select objects and press Shift+A to frame them with auto layout

### Properties

| Property | Options | Description |
|----------|---------|-------------|
| Direction | Horizontal, Vertical, Wrap | Layout direction; Wrap allows wrapping to new rows/columns |
| Spacing | Numeric (px) | Gap between children |
| Horizontal padding | Numeric (px) | Left and right internal padding |
| Vertical padding | Numeric (px) | Top and bottom internal padding |
| Independent padding | Toggle | Set top, right, bottom, left padding individually |
| Alignment | 9-point grid | Align children within the frame (top-left, center, bottom-right, etc.) |
| Distribution | Packed / Space Between | Packed = fixed spacing; Space Between = children spread to fill container |

### Child Resizing

| Mode | Behavior |
|------|----------|
| Fixed | Child has a fixed pixel size |
| Hug contents | Child shrinks to fit its own content |
| Fill container | Child stretches to fill the remaining space in the parent |

### Absolute Position

Children within an auto-layout frame can be set to **Absolute position** — they are removed from the flow and positioned by X/Y coordinates relative to the frame, overlapping the auto-layout children.

### Nesting

Auto-layout frames can be nested. A horizontal frame inside a vertical frame creates a row within a column (like nested Flexbox).

## Styles

Figma has four types of reusable styles:

### Color Styles

- Named fill/stroke colors
- Can be solid colors or gradients
- Applied to fill or stroke properties
- Edit the style to update all objects using it
- Created via the style icon (four dots) next to any color property

### Text Styles

- Named text formatting presets: font family, weight, size, line height, letter spacing, paragraph spacing, case, decoration
- Applied to text objects
- Created via the style icon next to text properties

### Effect Styles

- Named effect presets: drop shadow, inner shadow, layer blur, background blur (one or more effects)
- Applied to any object
- Created via the style icon next to the Effects section

### Grid Styles

- Named layout grid presets: column grid, row grid, or uniform grid configurations
- Applied to frames
- Created via the style icon next to the Layout Grid section

### Style Management

| Action | Description |
|--------|-------------|
| Apply a style | Click the style icon (four dots) → select from the list |
| Create a style | Set properties → click the style icon → click **+** → name it |
| Edit a style | Right-click the style name in the panel → Edit style; or hover the style in the list → click the edit icon |
| Detach a style | Click the detach icon next to the style name (converts to local values) |
| Publish styles | Publish the file as a library; styles become available to other files |

## Variables

Figma's variables system (newer than styles) for design tokens:

### Variable Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| **Color** | A color value | Theme colors, semantic tokens (primary, error, surface) |
| **Number** | A numeric value | Spacing values, border radii, opacity, sizing tokens |
| **String** | A text value | Placeholder text, localization strings |
| **Boolean** | True/false | Visibility toggles, feature flags |

### Variable Collections and Modes

- Variables are organized into **collections** (e.g., "Colors", "Spacing", "Typography Scale")
- Each collection can have multiple **modes** (e.g., "Light" and "Dark" modes for a color collection)
- Variables resolve to different values per mode
- Modes can represent themes, breakpoints, brand variations, or languages

### Variable Scoping

Variables can be scoped to restrict where they can be applied:
- All scopes (default)
- Frame fill only
- Shape fill only
- Stroke only
- Text fill only
- Effect color only
- Corner radius
- Gap
- And more

### Applying Variables

- Click a variable icon (hexagon) next to any compatible property in the Design panel
- Browse or search variables in the variable picker popup
- Variables show their resolved value and a hexagon icon when applied
- Detach to convert back to a literal value

## Comments

### Comment System

| Feature | Description |
|---------|-------------|
| **Place comment** | Switch to Comment tool (C), click on the canvas to place a pin |
| **Pin appearance** | Numbered circle on the canvas; author's avatar color |
| **Thread** | Each pin starts a conversation thread |
| **Reply** | Type in the thread; @mention collaborators |
| **Resolve** | Mark a thread as resolved (hides the pin; accessible in history) |
| **Emoji reactions** | React to individual comments |
| **Prototype comments** | Comments can be placed during prototype presentation |
| **Branch comments** | Comments are branch-scoped when using branching |

### Comment Interactions

| Action | Result |
|--------|--------|
| Click a comment pin | Open the thread |
| Drag a comment pin | Reposition it (only the author can move it) |
| Click "Resolve" | Collapse the thread; hide the pin |
| Filter comments | Show/hide resolved comments; filter by author |

## Version History

**Shortcut:** Ctrl/Cmd+Alt+H

| Feature | Description |
|---------|-------------|
| Timeline | Scrollable list of versions, newest at top |
| Auto-save versions | Created every 30 minutes of activity |
| Named versions | Manually named checkpoints (right-click > "Name this version") |
| Preview | Click a version to preview the file at that state (read-only) |
| Restore | "Restore this version" — makes the file revert to that state (creates a new version of the current state first) |
| Duplicate | "Duplicate" — creates a new file from that version |

## Dev Mode (Inspect Tab / Dev Mode Toggle)

### Overview

Dev Mode provides a developer-focused view of the design:

| Feature | Description |
|---------|-------------|
| Read-only canvas | Designers' work cannot be accidentally modified |
| Code panel | CSS, iOS (Swift/SwiftUI), Android (Kotlin/Compose) code snippets for the selected object |
| Spacing measurements | Red lines and pixel values shown between objects when hovering |
| Properties | All design properties (dimensions, colors, fonts, effects) in developer-friendly format |
| Assets | Export buttons with format/scale options for each marked asset |
| Component documentation | Shows component description, properties, and variant table |
| Compare changes | Side-by-side comparison of design changes between versions |
| "Ready for dev" labels | Sections or frames marked as ready for implementation |
| Annotations | Designer-placed annotations with labels and descriptions |

### Measurement Behavior (in Dev Mode)

| Action | Result |
|--------|--------|
| Hover over an object | Show its dimensions |
| Select an object + hover over another | Show the distance between them (red lines with pixel labels) |
| Alt/Option+hover | Show spacing from the selected object to all nearby objects |

## Plugins

### Management

- **Resources panel** (Shift+I) → Plugins tab → search and run
- **Plugins menu** (from hamburger) → lists installed plugins
- **Manage plugins** → view installed, browse community plugins
- **Run last plugin** → Ctrl/Cmd+Alt+P

### Plugin Types

| Type | Description |
|------|-------------|
| Design plugins | Modify the canvas, generate content, apply effects |
| Developer plugins | Export code, generate documentation |
| Content plugins | Insert placeholder data, stock images, icons |
| Accessibility plugins | Check contrast, reading order, color blindness simulation |
| Utility plugins | Batch rename, sort layers, clean up |

Plugins run within a sandboxed environment and interact with the Figma API.

## Flight Adaptation Notes

Apply [the Figma-inspired component, variable, collaboration, history, developer, and plugin contracts](./figma-implementation-contract.md).

- Layers, Assets, comments, history, Dev Mode, resources, and plugin surfaces are replaceable projections or optional integrations.
- Variants and component properties extend the shared component model; overrides use stable property identities rather than names or paths.
- Variables, styles, collections, modes, aliases, scopes, and bindings are durable typed document data.
- Presence is transient; comments are separate review records; version history stores immutable canonical document revisions.
- Restoring history creates a new current revision and never masquerades as ordinary local undo.
- Plugins mutate through shared commands and preserve versioned namespaced data when unavailable.
- Test loading, empty, permission-denied, offline, stale, missing-plugin, broken-binding, and read-only-revision panel states.
