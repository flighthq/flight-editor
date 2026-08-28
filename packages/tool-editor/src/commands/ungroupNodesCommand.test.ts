import { addNodeChild, getNodeChildren, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createUngroupNodesCommand } from './ungroupNodesCommand';

describe('createUngroupNodesCommand', () => {
  it('moves children up to the group parent and removes group', () => {
    const root = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    addNodeChild(root, group);
    addNodeChild(group, a);
    addNodeChild(group, b);

    const cmd = createUngroupNodesCommand(group);
    cmd.execute();

    expect(getNodeParent(a)).toBe(root);
    expect(getNodeParent(b)).toBe(root);
    expect(getNodeParent(group)).toBeNull();
  });

  it('inserts children at the group position', () => {
    const root = createNode2D(DisplayObjectKind);
    const before = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);
    const after = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    addNodeChild(root, before);
    addNodeChild(root, group);
    addNodeChild(root, after);
    addNodeChild(group, a);
    addNodeChild(group, b);

    const cmd = createUngroupNodesCommand(group);
    cmd.execute();

    const children = getNodeChildren(root);
    expect(children[0]).toBe(before);
    expect(children[1]).toBe(a);
    expect(children[2]).toBe(b);
    expect(children[3]).toBe(after);
  });

  it('undo restores the group with its children', () => {
    const root = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    addNodeChild(root, group);
    addNodeChild(group, a);
    addNodeChild(group, b);

    const cmd = createUngroupNodesCommand(group);
    cmd.execute();
    cmd.undo();

    expect(getNodeParent(group)).toBe(root);
    expect(getNodeChildren(group)[0]).toBe(a);
    expect(getNodeChildren(group)[1]).toBe(b);
    expect(getNodeChildren(root)).toContain(group);
  });

  it('preserves sibling order on undo', () => {
    const root = createNode2D(DisplayObjectKind);
    const before = createNode2D(DisplayObjectKind);
    const group = createNode2D(DisplayObjectKind);
    const after = createNode2D(DisplayObjectKind);
    const x = createNode2D(DisplayObjectKind);

    addNodeChild(root, before);
    addNodeChild(root, group);
    addNodeChild(root, after);
    addNodeChild(group, x);

    const cmd = createUngroupNodesCommand(group);
    cmd.execute();
    cmd.undo();

    const children = getNodeChildren(root);
    expect(children[0]).toBe(before);
    expect(children[1]).toBe(group);
    expect(children[2]).toBe(after);
    expect(getNodeChildren(group)[0]).toBe(x);
  });
});
