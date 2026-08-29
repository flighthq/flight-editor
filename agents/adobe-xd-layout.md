# Adobe XD Workspace Layout

Authoritative reference for the workspace arrangement in Adobe XD (mature version, circa 2021–2022). XD uses the same layout on Windows and Mac with standard platform differences (Cmd vs Ctrl, native menu bar on Mac vs hamburger on Windows).

## Top-Level Frame

The application window contains, from top to bottom:

1. **Menu Bar** (Mac) or **Hamburger Menu** (Windows, top-left corner)
2. **Toolbar** — horizontal strip across the top containing tools, mode tabs, and sharing controls
3. **Work Area** — divided into:
   - **Left Panel** — Layers / Assets / Plugins (tabbed)
   - **Canvas** — infinite pasteboard with artboards
   - **Right Panel** — Property Inspector (context-sensitive)
4. **Bottom Bar** — zoom controls and navigation aids at bottom-left of the canvas

## Toolbar

The Toolbar spans the full width of the window. On Windows, the hamburger menu (☰) is at the far left.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [☰] [V] [R] [E] [L] [P] [T] [A]     [Design] [Prototype] [Share]     [🔗 Share] [▶ ⏵] │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Elements (left to right)

| Element | Description |
|---------|-------------|
| Hamburger menu (☰) | Windows only — opens the main menu (File, Edit, Object, View, Plugins, Window, Help). Mac uses the native menu bar. |
| Tool buttons | Seven tool icons: Select, Rectangle, Ellipse, Line, Pen, Text, Artboard |
| Mode tabs | Three tabs: **Design**, **Prototype**, **Share** — switches the workspace mode |
| Share button | Opens the Share dialog for publishing prototypes, design specs, or development links |
| Preview button (▶) | Opens the Desktop Preview window to interact with the prototype locally |

### Mode Tabs

| Mode | Purpose | Right Panel Shows | Canvas Behavior |
|------|---------|-------------------|-----------------|
| **Design** | Visual design — draw, style, layout | Design properties (fill, border, shadow, layout, text formatting) | Normal editing — select, draw, type, arrange |
| **Prototype** | Interaction wiring — connect artboards | Interaction properties (trigger, action, destination, animation, easing) | Blue wiring handles appear on objects; drag to connect artboards; blue wires are visible |
| **Share** | Publishing — create shareable links | Share settings (link type, access, password) | Read-only view with share configuration |

## Canvas

The canvas is an infinite two-dimensional workspace:

- **Artboards** are placed on the canvas as white rectangular frames — each represents a screen or page
- The **pasteboard** is the gray area between and around artboards
- Objects can exist on the pasteboard outside any artboard (useful for off-screen assets, scratch work)
- Objects inside an artboard are clipped to the artboard boundaries at preview/export time
- The canvas has no fixed boundaries — it extends infinitely in all directions
- **Zoom** range: 0.28% to 12,800%

### Artboard Behavior

- Artboards have a **name label** displayed above them (click to rename)
- Artboards cannot overlap — dragging one onto another pushes it aside
- Artboards can be created from presets (iPhone, iPad, Web, custom) or drawn freely
- Each artboard has an independent background color (default white) and optional scrollable viewport
- The first artboard (leftmost/topmost) is typically the "home" screen for prototyping
- A blue "home" icon appears on the designated home artboard in Prototype mode

### Canvas Navigation

| Action | Result |
|--------|--------|
| Space + drag | Pan the canvas |
| Two-finger trackpad scroll | Pan the canvas |
| Ctrl/Cmd + scroll wheel | Zoom in/out centered on cursor |
| Pinch (trackpad) | Zoom in/out |
| Ctrl/Cmd + 0 | Zoom to fit all artboards |
| Ctrl/Cmd + 1 | Zoom to 100% |
| Ctrl/Cmd + 3 | Zoom to selected object |

## Left Panel

Tabbed panel on the left edge. Tabs at the top switch between views:

### Layers Tab

Shows the document structure as a hierarchical tree:

```
┌─ Layers ─ Assets ─ Plugins ──────┐
│                                    │
│ ▾ Artboard — Home                  │
│   ├ Header Group                   │
│   │ ├ Logo                         │
│   │ └ Nav Text                     │
│   ├ Hero Image                     │
│   └ CTA Button (Component)        │
│                                    │
│ ▾ Artboard — Profile               │
│   ├ Avatar                         │
│   └ Bio Text                       │
│                                    │
│ ◇ Off-artboard element             │
└────────────────────────────────────┘
```

- Each **artboard** is a collapsible top-level group
- **Objects** are listed inside their artboard in z-order (top of list = front)
- **Groups** are collapsible sub-trees
- **Components** show a green diamond (◇) icon
- Objects on the pasteboard (not inside any artboard) appear at the bottom of the list
- Hover reveals **visibility toggle** (eye icon) and **lock toggle** (lock icon) per item

### Assets Tab

Organized into sections for reusable design tokens:

```
┌─ Layers ─ Assets ─ Plugins ──────┐
│                                    │
│ ▾ Colors                           │
│   ■ #1A73E8   ■ #FFFFFF            │
│   ■ #333333   ■ #F5F5F5            │
│   [+ Add Color]                    │
│                                    │
│ ▾ Character Styles                 │
│   Heading 1 — Roboto Bold 32px     │
│   Body — Roboto Regular 16px       │
│   [+ Add Character Style]         │
│                                    │
│ ▾ Components                       │
│   ◇ Button / Primary               │
│   ◇ Button / Secondary             │
│   ◇ Card                           │
│   ◇ Input Field                    │
│                                    │
│ ▾ Linked Assets (CC Libraries)     │
│   (assets from Creative Cloud)     │
└────────────────────────────────────┘
```

### Plugins Tab

Lists installed XD plugins with quick-launch access. Plugins extend XD functionality (icon generation, lorem ipsum, data population, etc.).

## Right Panel (Property Inspector)

Context-sensitive — contents change based on the current selection and the active mode (Design / Prototype / Share). Full detail in `adobe-xd-properties-inspector.md`.

## Bottom Bar

Located at the bottom-left corner of the canvas area:

```
┌──────────────────────────────────────────┐
│  [< >]  [100% ▾]  [Grid] [Guides]       │
└──────────────────────────────────────────┘
```

| Element | Description |
|---------|-------------|
| Navigation arrows (< >) | Step through artboards in order |
| Zoom level display | Shows current zoom %; click for dropdown with preset levels and Zoom to Fit / Zoom to Selection |
| Grid toggle | Show/hide the layout or square grid |

## Workspace Regions Summary

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Toolbar: [☰][V][R][E][L][P][T][A]    [Design][Prototype][Share]  [▶]  │
├──────────┬───────────────────────────────────────────────────┬──────────┤
│          │                                                   │          │
│  Left    │              Canvas (infinite)                    │  Right   │
│  Panel   │                                                   │  Panel   │
│          │    ┌──────────────┐    ┌──────────────┐           │          │
│ ┌──────┐ │    │  Artboard 1  │    │  Artboard 2  │           │ ┌──────┐ │
│ │Layers│ │    │              │    │              │           │ │Props │ │
│ │      │ │    │              │    │              │           │ │      │ │
│ │Assets│ │    └──────────────┘    └──────────────┘           │ │      │ │
│ │      │ │                                                   │ │      │ │
│ │Plugin│ │    ┌──────────────┐                               │ │      │ │
│ │      │ │    │  Artboard 3  │                               │ │      │ │
│ └──────┘ │    │              │                               │ └──────┘ │
│          │    └──────────────┘                               │          │
│          │                                                   │          │
│          │  [< >] [100% ▾]                                   │          │
├──────────┴───────────────────────────────────────────────────┴──────────┤
│  (no status bar — XD has no traditional status bar)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

## Multiple Windows and Tabs

- XD opens each `.xd` file in its own window (no tabbed documents)
- The Desktop Preview window (▶) is a separate, always-on-top window that mirrors the active artboard's prototype interactions
- The Share dialog opens as a modal overlay within the main window
- Plugins may open their own modal or panel-based UI

## Responsive Resize

When Responsive Resize is enabled (toggle in the Property Inspector for groups and components), child elements reposition and resize relative to their parent when the parent is resized. XD infers pin and stretch rules from object placement. Manual overrides are available per object in the Property Inspector.
