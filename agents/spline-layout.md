# Spline — Workspace Layout

Authoritative reference for the Spline workspace layout and navigation (circa 2024–2025). Spline is a web-based 3D design tool that runs entirely in the browser, focused on making 3D design accessible to designers rather than technical 3D artists.

## Overview

Spline uses a single-window, browser-based workspace with a 3D viewport at center, panels on left and right, and a toolbar across the top. The interface is minimal and design-tool-oriented — closer to Figma than to Unity or Blender.

## Top-Level Frame

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [☰] [Logo]  [File▾]  [Edit▾]  [+]  ──────── [Share] [Export▾] [Play▾] [⋮] │
├──────────┬───────────────────────────────────────────────────────┬───────────┤
│          │                                                       │           │
│  Layers  │                                                       │ Properties│
│  Panel   │                   3D Viewport                         │   Panel   │
│          │                                                       │           │
│          │                                                       │           │
│          │                                                       │           │
│          │                                                       │           │
│          │                                                       │           │
│          │                                                       │           │
│          │                                                       │           │
├──────────┴───────────────────────────────────────────────────────┴───────────┤
│                           [Toolbar / Tools]                                  │
│  [Move][Scale][Rotate][Path][Pen][Pencil][Text][Shape]  [Boolean▾] [⚡]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Menu Bar

Spans the full width at the top of the window:

| Element | Position | Description |
|---------|----------|-------------|
| Menu button (☰) | Far left | Dashboard, project settings, help |
| Spline logo | Left | Return to dashboard |
| File menu | Left | New, Open, Save, Import, Export |
| Edit menu | Left | Undo, Redo, Copy, Paste, Delete, Select All |
| Add (+) button | Left-center | Quick-add menu for primitives, lights, cameras, and more |
| Share button | Right | Publish and share the scene (public URL, embed code) |
| Export dropdown | Right | Export as GLB, GLTF, image, video, or code (React/vanilla JS) |
| Play button | Right | Preview interactions and animations in the browser |
| Settings (⋮) | Far right | Project settings, grid, snap, camera defaults |

## Toolbar

The toolbar sits at the bottom of the viewport (or can be configured to float):

### Tool Buttons

| Button | Shortcut | Tool |
|--------|----------|------|
| Move | V | Select and translate objects |
| Scale | S | Scale objects |
| Rotate | R | Rotate objects |
| Path | P | Create/edit 3D paths |
| Pen | B | Draw 2D vector paths |
| Pencil | | Freehand drawing |
| Text | T | Create 3D text |
| Shape | | Insert primitive shapes |
| Boolean | | Union, Subtract, Intersect operations |
| Interactions (⚡) | | Add event-driven interactions |

## Layers Panel (Left)

**Default position:** Left side of the workspace.

### Structure

```
┌─ Layers ─────────────────────┐
│ 🔍 Search                    │
│                               │
│ ▾ Scene                      │
│   ├ 🎥 Camera                │
│   ├ 💡 Directional Light     │
│   ├ ▾ 📦 Group              │
│   │   ├ Cube                 │
│   │   └ Sphere               │
│   ├ 📝 Text                  │
│   ├ 🟢 Torus                 │
│   └ 💡 Point Light           │
│                               │
│ [+ Add] [🗑️ Delete]          │
└───────────────────────────────┘
```

### Layer Interactions

| Action | Result |
|--------|--------|
| Click a layer | Select the object in the viewport |
| Double-click a layer name | Rename inline |
| Drag a layer | Reorder or reparent (drag onto another object to parent) |
| Right-click | Context menu (Duplicate, Delete, Group, Lock, Hide) |
| Eye icon (on hover) | Toggle visibility |
| Lock icon (on hover) | Toggle lock (prevent selection/editing) |
| Expand triangle (▸/▾) | Expand/collapse children |

### Groups

Groups act as containers. Drag objects onto a group row to parent them. Groups can be nested. Selecting a group selects all its children for collective transforms.

## Properties Panel (Right)

**Default position:** Right side of the workspace.
**Full detail in:** `spline-properties-inspector.md`

Shows context-sensitive properties for the selected object. Sections include:
- Transform (Position, Rotation, Scale)
- Material (color, texture, metalness, roughness, etc.)
- Shape-specific properties (geometry parameters)
- Events/Interactions (click, hover, scroll triggers)
- Animation states
- Component properties (physics, clipping, etc.)

## 3D Viewport

The central area where the 3D scene is displayed and manipulated.

### Viewport Elements

| Element | Position | Description |
|---------|----------|-------------|
| 3D scene | Center | The rendered 3D scene |
| Gizmo (transform handle) | On selected object | Move/Rotate/Scale gizmo |
| Grid | Ground plane | XZ grid plane, configurable size and visibility |
| Camera icon | In scene | Represents the scene camera (click to select) |
| Light icons | In scene | Represent lights as small icons |
| Axis indicator | Bottom-left | Shows current orientation (X red, Y green, Z blue) |

### Viewport Navigation

| Input | Result |
|-------|--------|
| Right-click drag (or Alt+left-click drag) | Orbit around the focal point |
| Middle-click drag (or Space+left-click drag) | Pan the view |
| Scroll wheel | Zoom in/out |
| Pinch (trackpad) | Zoom |
| Two-finger drag (trackpad) | Pan |
| F | Frame selected object (zoom to fit) |
| 1 | Front view |
| 2 | Right view |
| 3 | Top view |
| Numpad keys | Additional axis-aligned views |

### Coordinate System

Spline uses a right-handed coordinate system (like most web 3D):

| Axis | Direction | Color |
|------|-----------|-------|
| X | Right | Red |
| Y | Up | Green |
| Z | Toward the viewer (out of the screen) | Blue |

### Grid

| Setting | Description |
|---------|-------------|
| Grid visibility | Toggle in project settings |
| Grid size | Configurable spacing |
| Grid plane | XZ (ground plane) by default |
| Grid snapping | Objects snap to grid intersections when enabled |

## Project Settings

Accessible from the ⋮ menu or the menu button (☰):

| Setting | Description |
|---------|-------------|
| Background color | Scene background (solid color or gradient) |
| Environment | HDR environment map for reflections and ambient lighting |
| Fog | Enable fog with distance, color, and density controls |
| Post-processing | Bloom, vignette, noise, chromatic aberration, depth of field |
| Physics | Enable/disable physics simulation, gravity direction/strength |
| Grid | Show/hide, size, snapping |
| Camera | Default camera position, FOV, near/far clip |

## Collaborative Features

| Feature | Description |
|---------|-------------|
| Real-time multiplayer | Multiple designers can edit the same scene simultaneously (each sees the others' cursors) |
| Sharing | Publish a scene to a public URL; viewers interact with the 3D scene in the browser |
| Embedding | Generate embed code (iframe) to place the interactive 3D scene in a website |
| Commenting | Leave comments anchored to specific objects or positions in the scene |
| Version history | Browse and restore previous versions of the project |

## Export Targets

| Format | Description |
|--------|-------------|
| Image (PNG/JPG) | Render a still image of the current viewport |
| Video (MP4/GIF) | Record an animation or interaction sequence |
| GLB/GLTF | Standard 3D model format (importable into other tools) |
| React component | Generate a React component with @splinetool/react-spline |
| Vanilla JS | Generate a script using @splinetool/runtime for plain HTML/JS |
| Spline Viewer URL | A hosted URL where anyone can interact with the scene |
| iOS / visionOS | Export for Apple platforms |

## Workspace Customization

- Panels can be collapsed by clicking their header or dragging the divider
- The toolbar position (bottom/floating) is configurable
- Dark theme is the default (no light theme)
- Viewport can be maximized by hiding both panels
