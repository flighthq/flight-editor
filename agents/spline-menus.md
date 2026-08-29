# Spline — System Menus

Authoritative reference for the Spline menu system (circa 2024–2025). Spline is browser-based, so it uses an in-app menu bar rather than the OS menu bar.

## Menu Bar

```
[☰] [Spline Logo]  [File▾]  [Edit▾]  [View▾]  [+]  ─────── [Share] [Export▾] [Play▾] [⋮]
```

## File Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| New File | Ctrl/Cmd+N | Create a new Spline project (opens in a new tab) |
| Open... | Ctrl/Cmd+O | Open an existing project from the dashboard |
| Save | Ctrl/Cmd+S | Save the current project (auto-save is also active) |
| Save As... | Ctrl/Cmd+Shift+S | Save as a new project (duplicate) |
| ─ | | |
| Import | | Import 3D models or assets (see Import section) |
| Export | | Export scene (see Export section) |
| ─ | | |
| Version History | | Browse and restore previous versions |
| ─ | | |
| Project Settings | | Open project settings (background, physics, post-processing) |

### Import Submenu

| Item | Description |
|------|-------------|
| 3D Model (GLB/GLTF) | Import a standard 3D model file |
| 3D Model (FBX) | Import an FBX model |
| 3D Model (OBJ) | Import an OBJ model |
| Image | Import an image file (PNG, JPG, SVG, GIF) |
| Video | Import a video file |
| Audio | Import an audio file for interactions |
| Font | Import a custom font file (TTF, OTF, WOFF) |
| Spline File | Import objects from another Spline project |

### Export Submenu

| Item | Description |
|------|-------------|
| Image (PNG) | Render the current viewport as a PNG image |
| Image (JPG) | Render as a JPG image |
| 3D Model (GLB) | Export the scene as a GLB binary file |
| 3D Model (GLTF) | Export as GLTF with separate files |
| Video (MP4) | Record and export an animation as MP4 |
| Video (GIF) | Record and export as an animated GIF |
| ─ | |
| Code (React) | Generate React integration code |
| Code (Vanilla JS) | Generate vanilla JavaScript integration code |
| Code (iOS / visionOS) | Generate Swift integration code |
| ─ | |
| Public URL | Publish and get a shareable viewer URL |
| Embed Code | Generate an iframe embed snippet |

## Edit Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Undo | Ctrl/Cmd+Z | Undo the last action |
| Redo | Ctrl/Cmd+Shift+Z | Redo the last undone action |
| ─ | | |
| Cut | Ctrl/Cmd+X | Cut selected objects |
| Copy | Ctrl/Cmd+C | Copy selected objects |
| Paste | Ctrl/Cmd+V | Paste copied objects |
| Duplicate | Ctrl/Cmd+D | Duplicate selected objects in place |
| Delete | Delete/Backspace | Delete selected objects |
| ─ | | |
| Select All | Ctrl/Cmd+A | Select all objects in the scene |
| Deselect All | Ctrl/Cmd+Shift+A or Escape | Clear the selection |
| ─ | | |
| Group | Ctrl/Cmd+G | Wrap selected objects in a new group |
| Ungroup | Ctrl/Cmd+Shift+G | Remove the group, keeping children |
| ─ | | |
| Lock | Ctrl/Cmd+L | Lock selected objects (prevent selection and editing) |
| Unlock All | Ctrl/Cmd+Shift+L | Unlock all locked objects |
| ─ | | |
| Hide | Ctrl/Cmd+H | Hide selected objects from the viewport |
| Show All | Ctrl/Cmd+Shift+H | Show all hidden objects |

## View Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Front | 1 | Snap to front orthographic view |
| Right | 2 | Snap to right orthographic view |
| Top | 3 | Snap to top orthographic view |
| Back | | Snap to back orthographic view |
| Left | | Snap to left orthographic view |
| Bottom | | Snap to bottom orthographic view |
| ─ | | |
| Perspective / Orthographic | 5 | Toggle between perspective and orthographic projection |
| ─ | | |
| Frame Selected | F | Zoom to fit the selected object(s) |
| Frame All | Shift+F or Home | Zoom to fit all objects |
| ─ | | |
| Show Grid | | Toggle grid visibility |
| Show Helpers | | Toggle visibility of light/camera gizmo icons |
| Show Axes | | Toggle the axis indicator |
| ─ | | |
| Zoom In | Ctrl/Cmd+= | Step zoom in |
| Zoom Out | Ctrl/Cmd+- | Step zoom out |
| Reset View | | Reset to the default camera angle |
| ─ | | |
| Toggle Layers Panel | | Show/hide the left panel |
| Toggle Properties Panel | | Show/hide the right panel |
| Toggle Timeline | | Show/hide the bottom animation timeline |
| Toggle Code Panel | | Show/hide the code preview panel |
| ─ | | |
| Full Screen | F11 or Ctrl/Cmd+Shift+F | Toggle browser full-screen mode |

## Add Menu (+)

The **+** button in the menu bar provides quick access to object creation:

### 3D Objects

| Item | Description |
|------|-------------|
| Cube | 3D box primitive |
| Sphere | 3D sphere |
| Cylinder | 3D cylinder |
| Torus | 3D torus (donut) |
| Plane | Flat rectangular surface |
| Capsule | Rounded cylinder |
| Cone | 3D cone |

### 2D Shapes

| Item | Description |
|------|-------------|
| Rectangle | 2D rectangle (with optional corner radius) |
| Ellipse | 2D ellipse/circle |
| Polygon | Configurable polygon |
| Star | Star shape |
| Triangle | Equilateral triangle |

### Text

| Item | Description |
|------|-------------|
| 3D Text | Extruded 3D text |
| 2D Text | Flat text in 3D space |

### Lights

| Item | Description |
|------|-------------|
| Directional Light | Sun-like global light |
| Point Light | Omnidirectional point light |
| Spot Light | Cone-shaped light |
| Hemisphere Light | Sky/ground ambient light |

### Camera

| Item | Description |
|------|-------------|
| Camera | Add a new camera to the scene |

### Effects

| Item | Description |
|------|-------------|
| Particle System | Particle emitter |

### Media

| Item | Description |
|------|-------------|
| Image | Place an image in the 3D scene |
| Video | Place a video in the 3D scene |
| Screen | Media display surface |

### Structure

| Item | Description |
|------|-------------|
| Group | Create an empty group |
| Clipping Mask | Create a clipping container |
| Component | Create a new empty component |

### Import

| Item | Description |
|------|-------------|
| 3D Model | Import GLB/GLTF/FBX/OBJ |

## Share Button

Opens the sharing panel:

| Option | Description |
|--------|-------------|
| Public URL | Generate a public viewer URL (anyone with the link can view and interact) |
| Embed Code | iframe snippet for embedding in websites |
| Access | Set as Public (anyone with link), Private (only team members), or Password-protected |
| Custom domain | Map to a custom domain (paid plans) |
| SEO | Title, description, and preview image for social sharing |

## Export Dropdown

Same as the Export submenu in the File menu, but accessible as a top-level button for quick access.

## Play Button

| Option | Description |
|--------|-------------|
| Play in editor | Preview interactions and animations within the editor viewport |
| Open in new tab | Open a full-screen preview in a new browser tab |

During play mode:
- All interactions and events are active
- Physics simulation runs
- Animations play
- The viewport shows the scene from the configured camera
- Press Escape or click Stop to return to editing

## Settings Menu (⋮)

| Item | Description |
|------|-------------|
| Project Settings | Background, environment, physics, post-processing |
| Grid Settings | Grid size, visibility, snap settings |
| Keyboard Shortcuts | View/customize shortcuts |
| Help & Feedback | Documentation links, tutorials, bug reporting |
| Account | Account settings, billing, team management |
| What's New | Changelog and feature announcements |
| Dark Mode | Always dark (no toggle — Spline is dark-only) |

## Context Menus (Right-Click)

### Right-Click in Viewport (on an object)

| Item | Description |
|------|-------------|
| Cut | Ctrl/Cmd+X |
| Copy | Ctrl/Cmd+C |
| Paste | Ctrl/Cmd+V |
| Duplicate | Ctrl/Cmd+D |
| Delete | Delete |
| ─ | |
| Group | Ctrl/Cmd+G |
| Ungroup | Ctrl/Cmd+Shift+G |
| ─ | |
| Lock | Ctrl/Cmd+L |
| Hide | Ctrl/Cmd+H |
| ─ | |
| Create Component | Turn into a reusable component |
| Detach Component | (if instance) Break the link to the main component |
| ─ | |
| Bring to Front | Move to the top of the rendering order |
| Send to Back | Move to the bottom |
| Bring Forward | Move one step forward |
| Send Backward | Move one step back |
| ─ | |
| Select Parent | Select the parent group |
| Select Children | Select all children |

### Right-Click in Viewport (on empty space)

| Item | Description |
|------|-------------|
| Paste | Paste copied objects |
| Add ▸ | Same as the + menu — create objects |
| Reset View | Return to the default camera angle |
| Frame All | Zoom to fit all objects |

### Right-Click in Layers Panel

| Item | Description |
|------|-------------|
| Copy / Paste / Duplicate / Delete | Clipboard operations |
| Group / Ungroup | Container operations |
| Lock / Hide | Visibility and interaction control |
| Create Component | Component creation |
| Rename | Enter rename mode |
| Select Children | Select all descendants |

## Flight Adaptation Notes

Apply [the Spline-inspired command, capability, and export contract](./spline-implementation-contract.md).

- Menus, add palettes, context menus, toolbars, shortcuts, and command palettes invoke the same shared commands.
- 3D node kinds, materials, effects, media, interactions, physics, importers, and exporters are registered contributions.
- Share, publishing, collaboration, cloud history, and platform packages are optional integrations rather than core menu assumptions.
- Import/export commands validate coordinate/unit/material/runtime capability conversions and report partial results.
- Context-menu selection targets are resolved before command enablement; locked/read-only/play-mode content cannot mutate.
- Test missing exporters/plugins/assets, invalid source, unsupported renderers, and editing-scope command state.
