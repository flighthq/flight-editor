# Editor Viewport3D Proposal

Ownership: Flight Editor over Flight camera, camera-controls, bounds, and picking primitives.

Provide host-neutral orbit, pan, dolly, fly, frame selection/all, perspective/orthographic, axis views, navigation speed, camera bookmarks, and client/viewport/ray/world conversion. Editor camera state is per-view session state and distinct from authored cameras.

Acceptance requires extreme scales, non-1 DPR, multiple simultaneous views, focus/blur, touch and mouse input, deterministic framing, and pick-ray parity.

