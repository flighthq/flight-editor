import { DisplayObjectKind, SpriteKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { buildScene } from './sceneBuilder';
import { countMatchingNodes, findFirstNode, findNodes, findNodesByKind, findNodesByName } from './sceneSearch';

function testScene() {
  return buildScene({
    root: [
      { name: 'menuBar' },
      { name: 'toolbar', visible: false },
      {
        name: 'content',
        children: [{ name: 'canvas' }, { name: 'sidebar', children: [{ name: 'tree' }] }],
      },
      { name: 'icon', kind: 'sprite' },
    ],
  });
}

describe('findNodes', () => {
  it('finds nodes by exact name', () => {
    const scene = testScene();
    const results = findNodes(scene, { name: 'menuBar' });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('menuBar');
  });

  it('finds nodes by name pattern', () => {
    const scene = testScene();
    const results = findNodes(scene, { namePattern: /bar/i });
    expect(results).toHaveLength(3);
    const names = results.map((n) => n.name);
    expect(names).toContain('menuBar');
    expect(names).toContain('toolbar');
    expect(names).toContain('sidebar');
  });

  it('finds nodes by kind', () => {
    const scene = testScene();
    const results = findNodes(scene, { kind: SpriteKind });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('icon');
  });

  it('finds hidden nodes', () => {
    const scene = testScene();
    const results = findNodes(scene, { visible: false });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('toolbar');
  });

  it('finds visible nodes', () => {
    const scene = testScene();
    const results = findNodes(scene, { visible: true });
    expect(results.length).toBeGreaterThan(0);
    for (const node of results) {
      expect(node.visible).toBe(true);
    }
  });

  it('respects maxDepth', () => {
    const scene = testScene();
    const all = findNodes(scene, {});
    const shallow = findNodes(scene, { maxDepth: 0 });
    expect(shallow.length).toBeLessThan(all.length);
    expect(shallow).toHaveLength(4);
  });

  it('combines criteria', () => {
    const scene = testScene();
    const results = findNodes(scene, { kind: DisplayObjectKind, visible: true });
    for (const node of results) {
      expect(node.kind).toBe(DisplayObjectKind);
      expect(node.visible).toBe(true);
    }
  });

  it('returns empty array when no match', () => {
    const scene = testScene();
    const results = findNodes(scene, { name: 'nonexistent' });
    expect(results).toHaveLength(0);
  });
});

describe('findFirstNode', () => {
  it('returns first matching node', () => {
    const scene = testScene();
    const node = findFirstNode(scene, { name: 'canvas' });
    expect(node).not.toBeNull();
    expect(node!.name).toBe('canvas');
  });

  it('returns null when no match', () => {
    const scene = testScene();
    expect(findFirstNode(scene, { name: 'missing' })).toBeNull();
  });

  it('respects maxDepth', () => {
    const scene = testScene();
    const deep = findFirstNode(scene, { name: 'tree' });
    expect(deep).not.toBeNull();
    const shallow = findFirstNode(scene, { name: 'tree', maxDepth: 0 });
    expect(shallow).toBeNull();
  });
});

describe('countMatchingNodes', () => {
  it('counts matching nodes', () => {
    const scene = testScene();
    const count = countMatchingNodes(scene, { kind: DisplayObjectKind });
    expect(count).toBeGreaterThan(0);
  });

  it('returns 0 for no matches', () => {
    const scene = testScene();
    expect(countMatchingNodes(scene, { name: 'nope' })).toBe(0);
  });
});

describe('findNodesByName', () => {
  it('finds nodes with exact name', () => {
    const scene = testScene();
    const results = findNodesByName(scene, 'canvas');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('canvas');
  });
});

describe('findNodesByKind', () => {
  it('finds nodes with specific kind', () => {
    const scene = testScene();
    const results = findNodesByKind(scene, SpriteKind);
    expect(results).toHaveLength(1);
  });
});
