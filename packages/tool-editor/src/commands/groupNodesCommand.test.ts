import { addNodeChild, getNodeChildren, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createGroupNodesCommand } from './groupNodesCommand';

describe('createGroupNodesCommand', () => {
  it('moves nodes into the group container', () => {
    const root = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);

    addNodeChild(root, a);
    addNodeChild(root, b);

    const cmd = createGroupNodesCommand([a, b], group);
    cmd.execute();

    expect(getNodeParent(group)).toBe(root);
    expect(getNodeParent(a)).toBe(group);
    expect(getNodeParent(b)).toBe(group);
    expect(getNodeChildren(root)).toContain(group);
    expect(getNodeChildren(root)).not.toContain(a);
    expect(getNodeChildren(root)).not.toContain(b);
  });

  it('inserts group at position of first selected node', () => {
    const root = createNode2D(DisplayObjectKind);
    const before = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const after = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);

    addNodeChild(root, before);
    addNodeChild(root, a);
    addNodeChild(root, b);
    addNodeChild(root, after);

    const cmd = createGroupNodesCommand([a, b], group);
    cmd.execute();

    const children = getNodeChildren(root);
    expect(children[0]).toBe(before);
    expect(children[1]).toBe(group);
    expect(children[2]).toBe(after);
  });

  it('preserves child order within group', () => {
    const root = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);

    addNodeChild(root, a);
    addNodeChild(root, b);
    addNodeChild(root, c);

    const cmd = createGroupNodesCommand([a, b, c], group);
    cmd.execute();

    const grouped = getNodeChildren(group);
    expect(grouped[0]).toBe(a);
    expect(grouped[1]).toBe(b);
    expect(grouped[2]).toBe(c);
  });

  it('undo restores original positions', () => {
    const root = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);

    addNodeChild(root, a);
    addNodeChild(root, b);
    addNodeChild(root, c);

    const cmd = createGroupNodesCommand([a, c], group);
    cmd.execute();
    cmd.undo();

    const children = getNodeChildren(root);
    expect(children[0]).toBe(a);
    expect(children[1]).toBe(b);
    expect(children[2]).toBe(c);
    expect(getNodeParent(group)).toBeNull();
  });
});
