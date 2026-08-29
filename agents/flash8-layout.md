# Flash 8 Workspace Layout

Authoritative reference for the default workspace arrangement in Macromedia Flash Professional 8 (Windows). Mac layout follows the same structure with standard platform menu bar differences.

## Top-Level Frame

The application window contains, from top to bottom:

1. **Title Bar** — "Macromedia Flash Professional 8 - [filename.fla]"
2. **Menu Bar** — File, Edit, View, Insert, Modify, Text, Commands, Control, Window, Help
3. **Main Toolbar** (optional, off by default) — common action buttons (New, Open, Save, Print, Cut, Copy, Paste, Undo, Redo, Snap to Objects, Smooth, Straighten, Rotate, Scale, Align)
4. **Edit Bar** — sits directly above the Stage; shows scene/symbol breadcrumb navigation, zoom control dropdown, edit-scene and edit-symbols buttons
5. **Timeline Panel** — horizontally spans the full width, docked below the Edit Bar
6. **Document Area** — the remaining space, divided into:
   - **Tools Panel** — docked on the left edge, vertical strip
   - **Stage + Pasteboard** — center, scrollable work area
   - **Side Panels** — docked on the right edge (collapsed or expanded)
7. **Properties Panel** — docked at the bottom, spans the full width below the Stage
8. **Status Bar** — thin strip at very bottom (Windows only); shows help text for hovered items

## Stage and Pasteboard

- The **Stage** is the white rectangle representing the published output area. Its dimensions are set in Document Properties (default 550×400 px).
- The **Pasteboard** is the gray area surrounding the Stage. Objects on the pasteboard exist in the document but are not visible in the published output.
- The Stage background color is configurable (default white).
- The Stage can be scrolled and zoomed. Scroll bars appear when the view exceeds the visible area.

## Edit Bar

Sits between the toolbar area and the Timeline. Contains:

| Element | Position | Behavior |
|---------|----------|----------|
| Scene name button | Left | Dropdown to switch scenes; shows current scene name |
| Symbol breadcrumb | Left, after scene | Shows editing path when inside a symbol (e.g., "Scene 1 > Button1 > Hit") — click any level to navigate up |
| Edit Scene button | Right | Dropdown listing all scenes for quick switching |
| Edit Symbols button | Right | Dropdown listing all symbols in the Library for quick editing |
| Zoom dropdown | Right | Preset zoom levels: 25%, 50%, 100%, 200%, 400%, 800%, Fit in Window, Show Frame, Show All |

## Panel Docking System

Flash 8 uses a docking panel system:

- **Docked panels** snap to edges of the application window (top, bottom, left, right) or to other panels.
- **Floating panels** are free-standing windows that can be placed anywhere, including outside the main window on multi-monitor setups.
- **Panel groups** — multiple panels can be tabbed together into a single group (e.g., Color Mixer and Color Swatches share a group).
- **Collapsed panels** — a docked panel can be collapsed to just its title bar by clicking the triangle/arrow.
- **Gripper** — the dotted area at the left edge of a panel title bar; drag it to undock, reposition, or re-dock.

### Default Docked Positions

| Position | Panel(s) |
|----------|----------|
| Top (below Edit Bar) | Timeline |
| Left edge | Tools |
| Right edge | Color Mixer / Color Swatches (grouped), Library, Components, Align / Info / Transform (grouped) — though many are collapsed or closed by default |
| Bottom | Properties, Filters (tab in Properties area for symbol instances) |

### Panel Sets

- **Default Layout** — the factory-standard arrangement described above
- Users can save custom panel layouts via Window > Panel Sets > Save Panel Layout
- Window > Panel Sets lists saved layouts and Default Layout for quick switching
- **F4** hides/shows all panels (toggles between full-stage view and paneled view)

## Document Tabs

When multiple FLA files are open, document tabs appear below the Edit Bar (above the Timeline). Each tab shows the filename; clicking a tab switches to that document. The active tab is highlighted.

## Workspace Regions Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│  Menu Bar                                                           │
├─────────────────────────────────────────────────────────────────────┤
│  [Main Toolbar — optional]                                          │
├─────────────────────────────────────────────────────────────────────┤
│  Edit Bar: [Scene1 ▸ Symbol ▸]              [Scenes▾][Symbols▾][100%▾] │
├─────────────────────────────────────────────────────────────────────┤
│  Timeline                                                           │
│  ┌─────────────────┬───────────────────────────────────────────┐    │
│  │ Layer list       │ Frame grid                     ▶ ⏮ ⏭    │    │
│  │ (eye, lock, □)   │ ═══╪════╪════╪════╪════╪════╪═          │    │
│  └─────────────────┴───────────────────────────────────────────┘    │
├──────┬──────────────────────────────────────────────┬───────────────┤
│      │                                              │               │
│  T   │          Pasteboard (gray)                   │  Side Panels  │
│  o   │    ┌──────────────────────────────┐          │  ┌──────────┐ │
│  o   │    │                              │          │  │ Library  │ │
│  l   │    │         Stage (white)        │          │  ├──────────┤ │
│  s   │    │                              │          │  │ Color    │ │
│      │    │                              │          │  │ Mixer    │ │
│  P   │    └──────────────────────────────┘          │  ├──────────┤ │
│  a   │                                              │  │ Align /  │ │
│  n   │                                              │  │ Info /   │ │
│  e   │                                              │  │Transform │ │
│  l   │                                              │  └──────────┘ │
│      │                                              │               │
├──────┴──────────────────────────────────────────────┴───────────────┤
│  Properties Panel                                                   │
│  [Properties ▾] [Filters ▾] [Parameters ▾]                         │
├─────────────────────────────────────────────────────────────────────┤
│  Status Bar                                                         │
└─────────────────────────────────────────────────────────────────────┘
```
