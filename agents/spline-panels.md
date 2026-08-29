# Spline — Panels

Authoritative reference for all panels in the Spline workspace (circa 2024–2025).

## Panel Overview

Spline has a minimal panel system compared to traditional 3D tools:

| Panel | Position | Purpose |
|-------|----------|---------|
| Layers | Left | Scene object tree (hierarchy) |
| Properties | Right | Selected object's properties (transform, material, geometry, events) |
| Assets (Library) | Left (tabbed with Layers) | Reusable components, imported models, images |
| Code panel | Bottom (toggle) | Generated code preview and interaction scripting |
| Timeline | Bottom (toggle) | Animation keyframe editor |
| Variables | Right (section) | Scene-level variables for interactions |

## Layers Panel

**Position:** Left side, always visible by default.

### Structure

```
┌─ Layers ─────────────────────────────┐
│ 🔍 Search                            │
│                                       │
│ ▾ Scene                              │
│   ├ 🎥 Camera                        │
│   ├ 💡 Directional Light             │
│   ├ ▾ 📦 Group                       │
│   │   ├ 🔲 Cube                      │
│   │   ├ 🔵 Sphere                    │
│   │   └ 📝 Hello World              │
│   ├ 🟡 Torus                         │
│   ├ 💡 Point Light                   │
│   └ 🖼️ Background Image             │
│                                       │
│ [+ Add]                               │
└───────────────────────────────────────┘
```

### Layer Item Information

Each row shows:
- **Icon** — type indicator (cube for mesh, light bulb for light, camera for camera, etc.)
- **Name** — object name (double-click to rename)
- **Visibility eye** (on hover) — toggle show/hide
- **Lock icon** (on hover) — toggle lock to prevent selection and editing

### Layer Interactions

| Action | Result |
|--------|--------|
| Click | Select the object (highlights in viewport, shows properties) |
| Double-click name | Rename inline |
| Drag up/down | Reorder objects (affects rendering order) |
| Drag onto another object | Parent (nest) the dragged object inside the target |
| Drag out of a group | Unparent (move to scene root) |
| Right-click | Context menu |
| Shift+click | Range select |
| Ctrl/Cmd+click | Toggle add/remove from selection |
| Alt+click expand triangle | Expand/collapse all descendants |

### Layer Context Menu

| Item | Description |
|------|-------------|
| Copy | Copy the object |
| Paste | Paste a copied object |
| Duplicate | Create a copy in place |
| Delete | Remove the object |
| ─ | |
| Group (Ctrl/Cmd+G) | Wrap selected objects in a new group |
| Ungroup (Ctrl/Cmd+Shift+G) | Remove the group container, keeping children |
| ─ | |
| Lock | Toggle lock state |
| Hide | Toggle visibility |
| ─ | |
| Create Component | Turn this object into a reusable component |
| Detach Component | Convert an instance back to a regular object |

### Search

The search bar filters layers by name. Matched objects are shown; non-matching objects are hidden from the list.

## Properties Panel

**Position:** Right side, always visible by default.
**Full detail in:** `spline-properties-inspector.md`

The Properties panel is context-sensitive — it shows different sections depending on what is selected.

### Panel Sections Overview

When an object is selected:

```
┌─ Properties ──────────────────────────┐
│                                        │
│ ▾ Transform                           │
│   Position: X [ ] Y [ ] Z [ ]         │
│   Rotation: X [ ] Y [ ] Z [ ]         │
│   Scale:    X [ ] Y [ ] Z [ ]         │
│                                        │
│ ▾ Shape                               │
│   (geometry-specific parameters)       │
│                                        │
│ ▾ Material                            │
│   Color: [■] #FFFFFF                   │
│   Metalness: [───●───]                 │
│   Roughness: [───●───]                 │
│   ...                                  │
│                                        │
│ ▾ Events                              │
│   + Add Event                          │
│                                        │
│ ▾ States                              │
│   Default  Hover  Click  [+]           │
│                                        │
└────────────────────────────────────────┘
```

## Assets / Library Panel

**Position:** Left side, tabbed with Layers (click "Assets" or "Library" tab).

### Contents

| Section | Description |
|---------|-------------|
| Components | Reusable component definitions (like Figma main components) |
| Imported models | 3D models imported from external files (GLB, FBX, OBJ) |
| Images | Uploaded image assets |
| Fonts | Custom font files |
| Audio | Sound files for interactions |
| Videos | Video files |

### Component System

Spline supports a component system similar to Figma:

| Concept | Description |
|---------|-------------|
| Main Component | The source definition (editable, changes propagate to instances) |
| Instance | A copy linked to the main component; can override properties |
| Detach | Convert an instance to a standalone object (breaks the link) |
| Overrides | Per-instance changes (position, material, etc.) that differ from the main |

### Library Interactions

| Action | Result |
|--------|--------|
| Drag a component to the viewport | Place an instance in the scene |
| Double-click a component in the library | Navigate to the main component |
| Right-click a component | Edit, Rename, Delete, or view instances |

## Timeline Panel

**Position:** Bottom of the workspace (toggle visibility with the animation icon or View menu).

### Structure

```
┌─ Timeline ───────────────────────────────────────────────────────┐
│ [▶ Play] [⏸ Pause] [⏹ Stop]  [🔄 Loop]  Frame: [___]  FPS: 60 │
├──────────────────┬───────────────────────────────────────────────┤
│ Cube             │ ♦────────────────♦────────────────♦           │
│  ├ Position X    │ ♦───────────────────────────────♦             │
│  ├ Position Y    │ ♦────────♦                                    │
│  ├ Rotation Y    │ ♦──────────────────────────♦                  │
│  └ Opacity       │ ♦────────────────♦                            │
│ Sphere           │         ♦──────────────────♦                  │
│  └ Scale         │         ♦──────────────────♦                  │
└──────────────────┴───────────────────────────────────────────────┘
```

### Timeline Elements

| Element | Description |
|---------|-------------|
| Object rows | List of animated objects |
| Property tracks | Expandable rows for each animated property |
| Keyframes (♦) | Diamond markers representing saved property values at specific frames |
| Playhead | Vertical line indicating the current frame |
| Timeline ruler | Frame numbers along the top |

### Timeline Interactions

| Action | Result |
|--------|--------|
| Click on the ruler | Move the playhead to that frame |
| Drag the playhead | Scrub through the animation |
| Click an empty area on a property track | Add a keyframe at the playhead position with the current property value |
| Click a keyframe (♦) | Select the keyframe |
| Drag a keyframe | Move it to a different frame (retime) |
| Right-click a keyframe | Delete, or change easing (Linear, Ease In, Ease Out, Ease In-Out, Bounce, Elastic, etc.) |
| Shift+click keyframes | Multi-select keyframes |
| Drag selected keyframes | Move them together |
| Marquee selection on the timeline | Select multiple keyframes |

### Easing Types

| Easing | Description |
|--------|-------------|
| Linear | Constant speed |
| Ease In | Slow start, fast finish |
| Ease Out | Fast start, slow finish |
| Ease In-Out | Slow start and finish |
| Bounce | Bounce effect at the end |
| Elastic | Overshoot and oscillate |
| Back | Slight overshoot then settle |
| Custom | Bezier curve editor for custom easing |

### Playback Controls

| Control | Description |
|---------|-------------|
| Play (▶) | Play the animation from the current frame |
| Pause (⏸) | Pause at the current frame |
| Stop (⏹) | Stop and return to frame 0 |
| Loop (🔄) | Toggle looping |
| FPS | Frames per second (default 60) |
| Frame input | Jump to a specific frame number |

## Variables Panel

**Position:** Section in the Properties panel or accessible via the Variables button.

Variables store scene-level values that can be used by interactions and animations:

| Variable Type | Description |
|---------------|-------------|
| Number | Numeric value (float) |
| Boolean | True/false toggle |
| String | Text value |
| Color | Color value |

### Variable Interactions

| Action | Result |
|--------|--------|
| + Add Variable | Create a new variable with a name and type |
| Bind a variable to a property | The property tracks the variable's value |
| Modify variable via interaction event | An event (click, hover) changes the variable, and all bound properties update |

Variables enable complex interactions where one event affects multiple objects.

## Code Panel

**Position:** Bottom of the workspace (toggle visibility).

Shows the code required to embed or integrate the Spline scene:

### Tabs

| Tab | Content |
|-----|---------|
| React | React component code using @splinetool/react-spline |
| Vanilla JS | Script tag code using @splinetool/runtime |
| URL | The public URL for the published scene |
| Embed | iframe embed code |
| iOS / visionOS | Swift integration code |

### Code Features

- Copy button for each code snippet
- Live preview of the generated code
- Version selection (for published versions)

## Scene Settings Panel

Accessible via ⋮ or ☰ menu:

### Environment

| Setting | Description |
|---------|-------------|
| Background | Solid color, gradient, or transparent |
| Environment map | HDR image for reflections and ambient lighting (presets available: Studio, Sunset, Forest, etc.) |
| Environment intensity | Brightness of the environment lighting |
| Shadow type | No shadows, Basic, Soft |
| Shadow opacity | How dark the shadows appear |

### Post-Processing

| Effect | Parameters |
|--------|-----------|
| Bloom | Intensity, threshold, radius |
| Depth of Field | Focus distance, aperture |
| Vignette | Intensity, smoothness |
| Noise (Film Grain) | Amount, size |
| Chromatic Aberration | Offset |
| Tone Mapping | Exposure, contrast |

### Physics

| Setting | Description |
|---------|-------------|
| Enable physics | Turn on/off the physics engine |
| Gravity | Direction and strength |
| Per-object: Mass | Object weight for physics interactions |
| Per-object: Friction | Surface friction coefficient |
| Per-object: Restitution | Bounciness |
| Per-object: Collider type | Box, Sphere, Mesh |
| Per-object: Fixed | Object is static (doesn't fall) |

## Comments Panel

**Position:** Toggled via the comment icon.

| Feature | Description |
|---------|-------------|
| Place a comment | Click in the viewport to anchor a comment to a 3D position |
| Comment thread | Others can reply to comments |
| Resolve | Mark a comment as resolved |
| Filter | Show all / unresolved / resolved |
| Notifications | Team members are notified of new comments |

## Version History

Accessible via File > Version History or project settings:

| Feature | Description |
|---------|-------------|
| Auto-save | Spline auto-saves periodically |
| Named versions | Manually save a named version at any point |
| Browse versions | Visual timeline of all saved versions |
| Restore | Revert to a previous version |
| Fork | Create a new project from a historical version |

## Flight Adaptation Notes

Apply [the Spline-inspired material, animation, state, environment, collaboration, and version contracts](./spline-implementation-contract.md).

- Layers, Properties, Assets, Timeline, Variables, Code, Scene Settings, Comments, and History are projections or optional capabilities.
- Materials/components/assets use stable references; active animation/state/playhead and preview values are not automatically authored data.
- Code/export panels consume versioned exporter contributions and cannot become a parallel source of truth.
- Physics and post-processing sections derive from upstream schemas and renderer/runtime capabilities.
- Comments and history follow service-neutral editor contracts; offline/in-game hosts may omit them.
- Test empty/loading/offline/stale/unsupported/missing-asset/read-only states and subscription disposal.
