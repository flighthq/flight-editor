# Flash 8 Status Bar and Edit Bar

Authoritative reference for the Status Bar and Edit Bar in Macromedia Flash Professional 8.

## Edit Bar

The Edit Bar sits directly above the Stage (between the Timeline and the document area). It is always visible by default and can be toggled via Window > Toolbars > Edit Bar.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Scene 1 ▾] [▸ SymbolA ▸ Nested ▸]    [🎬 Edit Scene ▾] [🔧 Edit Symbols ▾] [100% ▾] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Elements (left to right)

| Element | Behavior |
|---------|----------|
| **Scene button** | Shows the current scene name. Click to open a dropdown listing all scenes — select one to switch. Only visible at the main timeline level (not inside symbols). |
| **Breadcrumb trail** | When editing inside a symbol (via Edit in Place or double-click), shows the navigation path: `Scene 1 ▸ ButtonSymbol ▸ Hit`. Each segment is clickable — click to navigate back to that level. Clicking the scene name returns to the main timeline. |
| **Edit Scene button** (film clapboard icon) | Dropdown listing all scenes; click one to switch to it. Always available. |
| **Edit Symbols button** (component/gear icon) | Dropdown listing all symbols in the Library; click one to enter its editing mode. Shows symbol type icons (MovieClip, Button, Graphic) next to each name. |
| **Zoom dropdown** | Shows the current zoom level (e.g., "100%"). Click to reveal preset zoom levels and commands. |

### Zoom Dropdown Presets

| Option | Shortcut | Behavior |
|--------|----------|----------|
| Fit in Window | Ctrl+3 | Scale the view so the entire Stage fits in the visible area |
| Show Frame | | Fit the Stage rectangle exactly, no pasteboard |
| Show All | | Fit all content (including pasteboard objects) in the view |
| 25% | | |
| 50% | | |
| 100% | Ctrl+1 | |
| 200% | Ctrl+2 | |
| 400% | Ctrl+4 | |
| 800% | Ctrl+8 | |

The dropdown also accepts typed numeric values (e.g., type "150" and press Enter for 150% zoom).

### Edit Bar in Symbol Editing Mode

When editing a symbol via Edit in Place:

- The Stage dims all content that is not part of the symbol being edited
- The breadcrumb updates to show the editing path
- A back arrow or clicking any breadcrumb segment navigates back up
- The current editing scope is indicated by the rightmost breadcrumb segment (bold or highlighted)
- Pressing Escape navigates up one level

When editing a symbol via Edit in New Window:

- The Edit Bar shows only the symbol name (no scene breadcrumb, since you're in a dedicated symbol-editing view)
- The zoom dropdown still functions

## Status Bar (Windows Only)

The Status Bar is the thin strip at the very bottom of the Flash application window, below the Properties panel.

### Content

The Status Bar shows context-sensitive help text:

| Context | Display |
|---------|---------|
| Hovering over a menu item | Description of that menu item |
| Hovering over a tool in the Tools panel | Tool name and keyboard shortcut (e.g., "Selection Tool (V)") |
| Hovering over a panel button | Button name and function |
| Hovering over a toolbar button | Button name |
| No hover / idle | Empty or shows the last tool hint |
| During a drag operation | May show position or dimension feedback |

### Behavior Notes

- The Status Bar is relatively minimal in Flash 8 compared to some other applications
- It does not display coordinates, zoom level, or file information (those are in the Info panel, Edit Bar, and Title Bar respectively)
- On Mac, there is no Status Bar — the equivalent help text appears in the menu bar area or not at all
- The Status Bar cannot be customized

## Timeline Status Display

The Timeline panel has its own status information at the bottom (not the application Status Bar):

```
┌─────────────────────────────────────────────────────────────────┐
│  [1]                    [12.0 fps]                    [0.0s]    │
│  Current Frame          Frame Rate                  Elapsed Time │
└─────────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| **Current Frame** | Shows the frame number at the playhead position. Read-only display. Updated as the playhead moves. |
| **Frame Rate** | Shows and allows editing of the document's playback speed in frames per second. Double-click to edit (same as Document Properties frame rate). Changes affect the entire document, not per-scene. |
| **Elapsed Time** | Shows the time elapsed from frame 1 to the current playhead position, calculated from the frame rate (e.g., at 12 fps, frame 24 = 2.0s). Read-only. |

## Controller Toolbar (Optional)

An optional toolbar that provides miniature playback controls. Toggled via Window > Toolbars > Controller.

```
┌────────────────────────────────────────┐
│  [⏮] [◀] [⏹] [▶] [▶▶] [⏭]          │
│  Stop  Rew  Stop Play Step  End       │
└────────────────────────────────────────┘
```

| Button | Action |
|--------|--------|
| Stop | Stop playback |
| Rewind (⏮) | Return to frame 1 |
| Step Back (◀) | Go back one frame (same as comma key) |
| Play (▶) | Play the timeline from current position (same as Enter) |
| Step Forward (▶▶) | Advance one frame (same as period key) |
| Go to End (⏭) | Jump to the last frame |

This toolbar is typically hidden by default, as the same controls are available via keyboard shortcuts and the Control menu.

## Main Toolbar (Optional)

Toggled via Window > Toolbars > Main. Provides quick-access buttons for common menu actions:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [New][Open][Save] │ [Print] │ [Cut][Copy][Paste] │ [Undo][Redo] │ [Snap][Smooth][Straighten] │ [Rotate][Scale] │ [Align] │
└──────────────────────────────────────────────────────────────────────────────────┘
```

| Group | Buttons |
|-------|---------|
| File | New, Open, Save |
| Print | Print |
| Clipboard | Cut, Copy, Paste |
| History | Undo, Redo |
| Drawing aids | Snap to Objects, Smooth, Straighten |
| Transform | Rotate, Scale |
| Alignment | Align (opens the Align panel) |

This toolbar is hidden by default — most users rely on keyboard shortcuts and the Tools panel instead.

## Title Bar Information

The application Title Bar shows:

```
Macromedia Flash Professional 8 - [filename.fla *]
```

- **Application name**: "Macromedia Flash Professional 8"
- **Filename**: Current document name (e.g., "Untitled-1", "myAnimation.fla")
- **Asterisk (*)**: Appears when the document has unsaved changes
- When editing inside a symbol, the title bar may update to reflect the editing context
