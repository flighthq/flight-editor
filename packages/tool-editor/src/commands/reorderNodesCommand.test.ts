import { addNodeChild, getNodeChildren } from '@flighthq/node';
import { createDisplayObject } from '@flighthq/scene2d';
import type { Node2D } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createReorderNodesCommand } from './reorderNodesCommand';

function createSiblings(names: readonly string[]): { parent: Node2D; children: Node2D[] } {
  const parent = createDisplayObject();
  const children = names.map((name) => createDisplayObject({ name }));
  for (const child of children) addNodeChild(parent, child);
  return { parent, children };
}

describe('createReorderNodesCommand', () => {
  it('places multiple siblings at absolute indices and restores the full order', () => {
    const { parent, children } = createSiblings(['a', 'b', 'c', 'd', 'e']);
    const [a, b, c, d, e] = children;
    const command = createReorderNodesCommand([a, d], [3, 1]);

    command.execute();
    expect(getNodeChildren(parent)).toEqual([b, d, c, a, e]);
    command.undo();
    expect(getNodeChildren(parent)).toEqual(children);
    expect(command.label).toBe('Reorder Nodes');

    command.execute();
    expect(getNodeChildren(parent)).toEqual([b, d, c, a, e]);
  });

  it('handles nodes from separate parents and ignores detached nodes', () => {
    const first = createSiblings(['a', 'b', 'c']);
    const second = createSiblings(['d', 'e', 'f']);
    const detached = createDisplayObject();
    const command = createReorderNodesCommand([first.children[2], second.children[0], detached], [0, 2, 100]);

    command.execute();
    expect(getNodeChildren(first.parent)).toEqual([first.children[2], first.children[0], first.children[1]]);
    expect(getNodeChildren(second.parent)).toEqual([second.children[1], second.children[2], second.children[0]]);
    command.undo();
    expect(getNodeChildren(first.parent)).toEqual(first.children);
    expect(getNodeChildren(second.parent)).toEqual(second.children);
  });

  it('rejects mismatched or conflicting target indices', () => {
    const { children } = createSiblings(['a', 'b']);
    expect(() => createReorderNodesCommand(children, [0])).toThrow(RangeError);
    expect(() => createReorderNodesCommand(children, [0, 0])).toThrow(RangeError);
    expect(() => createReorderNodesCommand([children[0]], [2])).toThrow(RangeError);
  });
});
