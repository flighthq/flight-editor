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
});
