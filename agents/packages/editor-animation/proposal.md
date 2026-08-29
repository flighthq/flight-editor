# Editor Animation Proposal

Ownership: Flight Editor over Flight `animation` and `timeline` runtime packages. Conditional on timeline authoring being a product goal.

Own editable layers, frame spans, keyframes, tween authoring, playhead session state, onion skinning, nested timeline navigation, animation clipboard, and command generation. Runtime sampling, interpolation, playback, and animation data primitives remain upstream.

Include stable motion-path and property-track target identities plus 3D transform channels; do not encode targets by hierarchy path.

Acceptance requires insert/delete/ripple fixtures, nested timelines, tween validation, frame clipboard dependency transfer, and proof that playhead movement does not dirty the document.
