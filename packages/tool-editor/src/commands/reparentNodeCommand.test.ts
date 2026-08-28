import { addNodeChild, getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createReparentNodeCommand } from './reparentNodeCommand';

describe('createReparentNodeCommand', () => {
  it('moves a node and restores its old parent and index on undo', () => {
    const oldParent = createNode2D(DisplayObjectKind);
    const newParent = createNode2D(DisplayObjectKind);
    const before = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    const after = createNode2D(DisplayObjectKind);
    const existingNewChild = createNode2D(DisplayObjectKind);
    addNodeChild(oldParent, before);
    addNodeChild(oldParent, node);
    addNodeChild(oldParent, after);
    addNodeChild(newParent, existingNewChild);
    const command = createReparentNodeCommand(node, newParent);

    command.execute();

    expect(getNodeChildCount(oldParent)).toBe(2);
    expect(getNodeChildAt(oldParent, 0)).toBe(before);
    expect(getNodeChildAt(oldParent, 1)).toBe(after);
    expect(getNodeChildCount(newParent)).toBe(2);
    expect(getNodeChildAt(newParent, 0)).toBe(existingNewChild);
    expect(getNodeChildAt(newParent, 1)).toBe(node);
    expect(getNodeParent(node)).toBe(newParent);

    command.undo();

    expect(getNodeChildCount(oldParent)).toBe(3);
    expect(getNodeChildAt(oldParent, 0)).toBe(before);
    expect(getNodeChildAt(oldParent, 1)).toBe(node);
    expect(getNodeChildAt(oldParent, 2)).toBe(after);
    expect(getNodeChildCount(newParent)).toBe(1);
    expect(getNodeChildAt(newParent, 0)).toBe(existingNewChild);
    expect(getNodeParent(node)).toBe(oldParent);
  });

  it('moves an only child to empty parent', () => {
    const oldParent = createNode2D(DisplayObjectKind);
    const newParent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(oldParent, node);
    const command = createReparentNodeCommand(node, newParent);

    command.execute();

    expect(getNodeChildCount(oldParent)).toBe(0);
    expect(getNodeChildCount(newParent)).toBe(1);
    expect(getNodeChildAt(newParent, 0)).toBe(node);

    command.undo();

    expect(getNodeChildCount(oldParent)).toBe(1);
    expect(getNodeChildAt(oldParent, 0)).toBe(node);
    expect(getNodeChildCount(newParent)).toBe(0);
  });

  it('appends to the end of the new parent children', () => {
    const oldParent = createNode2D(DisplayObjectKind);
    const newParent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    const newChild1 = createNode2D(DisplayObjectKind);
    const newChild2 = createNode2D(DisplayObjectKind);
    addNodeChild(oldParent, node);
    addNodeChild(newParent, newChild1);
    addNodeChild(newParent, newChild2);
    const command = createReparentNodeCommand(node, newParent);

    command.execute();

    expect(getNodeChildCount(newParent)).toBe(3);
    expect(getNodeChildAt(newParent, 2)).toBe(node);
  });

  it('has the correct label', () => {
    const oldParent = createNode2D(DisplayObjectKind);
    const newParent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(oldParent, node);
    const command = createReparentNodeCommand(node, newParent);

    expect(command.label).toBe('Reparent Node');
  });

  it('supports re-execute after undo', () => {
    const oldParent = createNode2D(DisplayObjectKind);
    const newParent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(oldParent, node);
    const command = createReparentNodeCommand(node, newParent);

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeParent(node)).toBe(newParent);
    expect(getNodeChildCount(newParent)).toBe(1);
    expect(getNodeChildCount(oldParent)).toBe(0);
  });
});
