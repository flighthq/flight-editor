# Flight Node Upstream TODO

Ownership: Flight upstream (`@flighthq/node` and shared node contracts).

- Establish stable serializable node identity independent of object reference, display name, and child index.
- Specify identity rules for clone, duplicate, deserialize, migration, undo restoration, and runtime instantiation.
- Provide efficient identity lookup or an index primitive usable by editors and live-reload systems.
- Keep editor selection and UI state out of the runtime node contract.
- Validate identity uniqueness and reference repair during deserialization.

