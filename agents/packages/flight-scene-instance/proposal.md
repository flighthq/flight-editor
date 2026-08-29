# Flight Scene Instance Upstream Proposal

Ownership: Flight upstream. Confirm first that no existing package already provides this semantic contract.

Provide a reusable authored scene/subtree source and lightweight placed instance with stable source identity, stable descendant mapping, nested instancing, deterministic materialization, and runtime reload. The primitive must permit editor-owned property overrides without importing editor commands, selection, library organization, or UI.

Acceptance requires source propagation, nested instances, cycle rejection, missing-source behavior, clone versus instance identity, serialization/reference fixup, and hot reload. If existing scene/resource packages already satisfy this, document and test that seam instead of creating a package.
