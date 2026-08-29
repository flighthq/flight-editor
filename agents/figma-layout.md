# Figma Workspace Layout

Authoritative reference for the workspace arrangement in Figma (browser and desktop app, circa 2024–2025). The layout is identical across platforms; shortcuts use Ctrl on Windows/Linux and Cmd on Mac.

## Top-Level Frame

The application window contains, from top to bottom:

1. **Toolbar** — horizontal strip spanning full width; contains the Figma menu, tools, file info, collaborators, and view controls
2. **Work Area** — divided into:
   - **Left Panel** — Layers / Assets (tabbed), with Pages section
   - **Canvas** — infinite pasteboard with frames
   - **Right Panel** — Design / Prototype / Inspect (tabbed; "Inspect" becomes "Dev Mode" on paid plans)
3. No status bar — Figma has no traditional status bar

## Toolbar

The toolbar spans the full width of the window.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [☰] [Move▾][Frame▾][Shapes▾][Pen▾][T][Resources][Hand][Comment]   File Name ★   [👤👤] [Share] [▶] [100%▾] │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Elements (left to right)

| Element | Description |
|---------|-------------|
| **Figma menu (☰)** | Main application menu (hamburger); opens a panel with File, Edit, View, Object, Text, Arrange, Vector, Plugins, Widgets, Preferences, Libraries |
| **Move / Scale dropdown** | Move (V) and Scale (K) tools |
| **Frame / Slice / Section dropdown** | Frame (F), Slice (S), Section (Shift+S) tools |
| **Shape tools dropdown** | Rectangle (R), Line (L), Arrow (Shift+L), Ellipse (O), Polygon, Star, Place Image/Video (Ctrl+Shift+K) |
| **Pen / Pencil dropdown** | Pen (P), Pencil (Shift+P) tools |
| **Text (T)** | Text creation tool |
| **Resources (Shift+I)** | Opens the resources panel for searching components, plugins, and widgets |
| **Hand (H)** | Pan tool |
| **Comment (C)** | Comment/annotation tool |
| **Boolean operations** | Appears contextually when 2+ shapes are selected: Union, Subtract, Intersect, Exclude, Flatten |
| **Mask / Component** | Contextual: Create mask, Create component buttons |
| **File name** | Editable document name; click to rename |
| **Star (favorite)** | Toggle favorite for the file |
| **Collaborator avatars** | Shows who is viewing/editing the file; click to follow their viewport |
| **Share button** | Open sharing and permissions dialog |
| **Present / Play (▶)** | Launch prototype presentation mode |
| **Dev Mode toggle** | Switch between Design and Dev Mode (paid plans) |
| **Zoom / View options (%)** | Current zoom level dropdown with presets |

## Canvas

The canvas is an infinite two-dimensional workspace:

- **Frames** are placed on the canvas as rectangular containers — each represents a screen, component, or section
- The **pasteboard** is the gray/dark background between and around frames
- Objects can exist on the pasteboard outside any frame
- Objects inside a frame are clipped to the frame boundaries by default (when "Clip content" is on)
- The canvas has no fixed boundaries — it extends infinitely
- **Zoom** range: approximately 1% to 25,600%
- The canvas background color is configurable per page (right-click > Page > Background color, or set in Design panel with no selection)

### Frames vs Groups

| Feature | Frame | Group |
|---------|-------|-------|
| Clip content | Yes (toggleable) | No |
| Auto Layout | Yes | No (must convert to frame) |
| Layout Grid | Yes | No |
| Constraints (children) | Yes | No |
| Fill / Stroke / Effects | Yes | Yes |
| Independent size | Yes (resize without scaling children) | No (resizing scales children) |
| Export | Yes (as a unit) | Yes |

Frames are the primary organizational unit in Figma. Groups are a lighter-weight alternative that simply bundles objects.

### Canvas Navigation

| Action | Result |
|--------|--------|
| Space+drag | Pan the canvas |
| Middle mouse button+drag | Pan the canvas |
| Scroll wheel | Scroll vertically |
| Shift+scroll wheel | Scroll horizontally |
| Ctrl/Cmd+scroll wheel | Zoom in/out centered on cursor |
| Pinch (trackpad) | Zoom in/out |
| Two-finger scroll (trackpad) | Pan canvas |
| Shift+1 | Zoom to fit all content |
| Shift+2 | Zoom to selection |
| Ctrl/Cmd+0 | Zoom to 100% |
| Ctrl/Cmd+1 | Zoom to fit |
| Ctrl/Cmd+2 | Zoom to selection |
| N | Zoom to next frame |
| Shift+N | Zoom to previous frame |

## Left Panel

### Pages Section

At the top of the left panel, above the Layers/Assets tabs:

- **Page list** — shows all pages in the file
- Click a page name to switch to it
- Double-click to rename
- Right-click for context menu: Rename, Duplicate, Delete, Copy link
- Drag pages to reorder
- **+** button to add a new page
- Each page has its own independent canvas and layer hierarchy

### Layers Tab

Shows the object hierarchy for the current page:

```
┌─ Layers ── Assets ─────────────────┐
│ ▸ Page 1 ▾                          │
│                                      │
│ ▾ Frame — Home                       │
│   ├ Header                           │
│   │ ├ Logo                           │
│   │ └ Nav                            │
│   ├ Hero Image                       │
│   └ ◇ Button (Instance)             │
│                                      │
│ ▾ Frame — Settings                   │
│   ├ Toggle Row                       │
│   └ Footer                           │
│                                      │
│ ◇ Component — Button (Main)         │
└──────────────────────────────────────┘
```

- **Frames** appear as top-level collapsible containers (like artboards)
- **Objects** are listed in z-order within their parent (top = front)
- **Groups** are collapsible sub-trees
- **Components**: Main Components show purple ◇; instances show empty ◇
- **Sections** appear as labeled dividers in the canvas and the layer tree
- Hover reveals visibility (eye) and lock icons
- Selected objects are highlighted blue
- Search field at top filters by object name

### Assets Tab

| Section | Contents |
|---------|----------|
| **Local components** | Components defined in this file, organized by page and frame |
| **Enabled libraries** | Components from team/organization libraries that have been enabled |
| **Search** | Search field to find components by name across all enabled libraries |

Drag a component from Assets to the canvas to place an instance.

Each library is collapsible. Components are shown with thumbnails. Right-click for: Insert, Go to main component, Edit in library.

### Panel Toggling

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+\ | Toggle all UI panels (left + right) |
| Ctrl/Cmd+Shift+\ | Toggle left panel only |
| Ctrl/Cmd+Alt+\ | Toggle right panel only |

## Right Panel

Tabbed panel with three tabs (or two in Dev Mode):

| Tab | Shortcut | Purpose |
|-----|----------|---------|
| **Design** | (default) | Visual design properties — fill, stroke, effects, layout, constraints, export |
| **Prototype** | (click tab) | Interaction wiring, flows, device framing, overflow behavior |
| **Inspect** | (click tab) | Developer handoff — CSS/iOS/Android code, spacing, assets |

The right panel is always visible (cannot be undocked). Full detail in `figma-properties-inspector.md`.

## Bottom Bar / Quick Actions

| Element | Description |
|---------|-------------|
| Zoom controls (bottom-left in newer versions) | Shows current zoom %; click for dropdown or type a value |
| Quick actions (Ctrl/Cmd+/) | Command palette — search for any action, menu item, plugin, or setting by name |

## Workspace Regions Summary

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Toolbar: [☰][Move▾][Frame▾][Shapes▾][Pen▾][T]  FileName  [Share][▶][100%]  │
├──────────┬───────────────────────────────────────────────────────┬──────────┤
│          │                                                       │          │
│  Left    │              Canvas (infinite)                        │  Right   │
│  Panel   │                                                       │  Panel   │
│          │    ┌──────────────┐    ┌──────────────┐               │          │
│ ┌──────┐ │    │  Frame 1     │    │  Frame 2     │               │ ┌──────┐ │
│ │Pages │ │    │  (Home)      │    │  (Settings)  │               │ │Design│ │
│ ├──────┤ │    │              │    │              │               │ │      │ │
│ │Layers│ │    │              │    │              │               │ │Proto-│ │
│ │      │ │    └──────────────┘    └──────────────┘               │ │type  │ │
│ │      │ │                                                       │ │      │ │
│ │Assets│ │    ┌──────────────┐                                   │ │Insp- │ │
│ │      │ │    │  Frame 3     │                                   │ │ect   │ │
│ └──────┘ │    │  (Profile)   │                                   │ └──────┘ │
│          │    └──────────────┘                                   │          │
│          │                                                       │          │
└──────────┴───────────────────────────────────────────────────────┴──────────┘
```

## Multi-Player / Collaboration

Figma is inherently multiplayer:

| Feature | Description |
|---------|-------------|
| **Cursor labels** | Each collaborator's cursor appears on the canvas with their name/avatar |
| **Collaborator avatars** | Shown in the toolbar; colored border matches their cursor |
| **Follow mode** | Click a collaborator's avatar to follow their viewport in real time |
| **Spotlight** | Present your viewport to all collaborators (they follow you) |
| **Comments** | Pin comments to specific locations; threaded conversations; resolve when addressed |
| **Version history** | Ctrl/Cmd+Alt+H — browse and restore previous versions; auto-saved every 30 minutes |

## Prototype Presentation Mode

Launched via the Play button (▶) or by sharing a prototype link:

- Full-screen or windowed presentation of the prototype flow
- Shows the device frame if configured
- Interactive — follows wired interactions (tap, hover, drag, keyboard)
- Hotspot hints toggle to show clickable areas
- Flow selector if multiple flows exist
- Comments can be added during presentation
- Navigation: arrow keys step between frames, R resets to start

## Dev Mode (Inspect)

When Dev Mode is toggled on (paid plans):

- The canvas becomes read-only
- The right panel shows code-ready properties: CSS, iOS (Swift/SwiftUI), Android (XML/Compose)
- Clicking between objects shows spacing measurements (red lines with pixel values)
- Assets panel shows exportable assets with format/scale options
- Component documentation, variant properties, and variable bindings are displayed
- Developers can mark layers as "ready for development"
- Compare view: side-by-side comparison of design changes

## Sections

Sections are organizational containers on the canvas (not in the layer hierarchy in the same way as frames):

- Created with the Section tool (Shift+S) or from the toolbar
- Visually appear as labeled rectangular regions on the canvas
- Used to organize frames into logical groups (e.g., "Login Flow", "Settings Screens")
- Sections do not clip content and do not appear in prototype flows
- Useful for presentation and developer handoff organization

## Flight Adaptation Notes

Apply [the Figma-inspired frame, collaboration, preview, and developer-mode contract](./figma-implementation-contract.md).

- Pages, frames, and sections are distinct document concepts; host panels and open files are not pages.
- Collaborator cursors, selections, follow mode, measurements, labels, and handles are overlays outside canonical scene content.
- Desktop, VS Code, and in-app hosts may use different layouts and omit multiplayer, comments, or Dev Mode entirely.
- Prototype and developer views are capability-gated modes over shared document state, not forks of the editor model.
- Persist workspace chrome per host; persist frame, section, layout, token, and prototype data in `.flight`.
- Test narrow layouts, 200% text zoom, multiple pages, spatial frames, optional-service absence, and focus restoration.
