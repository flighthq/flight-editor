# Flight Animation Upstream TODO

Ownership: Flight upstream (`@flighthq/animation` and `@flighthq/timeline`).

- Keep runtime clips, tracks, interpolation, playback, nested timing, and deterministic seeking presentation-neutral.
- Provide stable target/property references suitable for serialization, reload, and editor retargeting.
- Expose validation facts for missing targets, unsupported interpolation, and malformed tracks.
- Keep frame/layer UI, onion skinning, authoring selection, clipboard, and undo in Flight Editor.
- Test exact seek/sample behavior, nested playback, target replacement, and hot reload.

