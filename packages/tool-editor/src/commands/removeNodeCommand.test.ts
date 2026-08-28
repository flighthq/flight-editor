import { addNodeChild, getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createRemoveNodeCommand } from './removeNodeCommand';

describe('createRemoveNodeCommand', () => {
  it('removes a node and restores it at its original index on undo', () => {
    const parent = createNode2D(DisplayObjectKind);
    const before = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    const after = createNode2D(DisplayObjectKind);
    addNodeChild(parent, before);
    addNodeChild(parent, node);
    addNodeChild(parent, after);
    const command = createRemoveNodeCommand(node);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(before);
    expect(getNodeChildAt(parent, 1)).toBe(after);
    expect(getNodeParent(node)).toBeNull();

    command.undo();

    expect(getNodeChildCount(parent)).toBe(3);
    expect(getNodeChildAt(parent, 0)).toBe(before);
    expect(getNodeChildAt(parent, 1)).toBe(node);
    expect(getNodeChildAt(parent, 2)).toBe(after);
    expect(getNodeParent(node)).toBe(parent);
  });

  it('removes an only child and restores it', () => {
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(parent, node);
    const command = createRemoveNodeCommand(node);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(0);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(node);
  });

  it('removes the first child and restores to index 0', () => {
    const parent = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    addNodeChild(parent, first);
    addNodeChild(parent, second);
    const command = createRemoveNodeCommand(first);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(second);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(first);
    expect(getNodeChildAt(parent, 1)).toBe(second);
  });

  it('removes the last child and restores to the end', () => {
    const parent = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const last = createNode2D(DisplayObjectKind);
    addNodeChild(parent, first);
    addNodeChild(parent, last);
    const command = createRemoveNodeCommand(last);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(first);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 1)).toBe(last);
  });

  it('has the correct label', () => {
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(parent, node);
    const command = createRemoveNodeCommand(node);

    expect(command.label).toBe('Remove Node');
  });

  it('supports re-execute after undo', () => {
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(parent, node);
    const command = createRemoveNodeCommand(node);

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeChildCount(parent)).toBe(0);
    expect(getNodeParent(node)).toBeNull();
  });
});
