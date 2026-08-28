import { describe, expect, it } from 'vitest';

import { parseFlightDocument, updateFlightNode } from './sceneDocument';

const scene = JSON.stringify({
  format: 'flight-scene',
  version: 1,
  name: 'Demo',
  backgroundColor: 0,
  scene: {
    align: 'center',
    color: null,
    scaleMode: 'showAll',
    width: 800,
    height: 600,
    root: {
      kind: 'root',
      traits: { name: 'Root' },
      children: [{ kind: 'sprite', traits: { name: 'Box', x: 1 }, children: [] }],
    },
  },
});

describe('parseFlightDocument', () => {
  it('accepts the tool-editor scene serialization contract', () => {
    expect(parseFlightDocument(scene).document?.name).toBe('Demo');
  });

  it('reports malformed JSON and incompatible documents', () => {
    expect(parseFlightDocument('{').error).toBeTruthy();
    expect(parseFlightDocument('{}').error).toContain('Flight scene');
  });
});

describe('updateFlightNode', () => {
  it('immutably serializes a targeted node trait update', () => {
    const result = updateFlightNode(scene, [0], 'x', 24);
    expect(result.text).toContain('"x": 24');
    expect(JSON.parse(scene).scene.root.children[0].traits.x).toBe(1);
  });

  it('rejects stale paths and invalid alpha values', () => {
    expect(updateFlightNode(scene, [3], 'x', 2).error).toContain('no longer exists');
    expect(updateFlightNode(scene, [0], 'alpha', 2).error).toContain('Invalid value');
  });
});
