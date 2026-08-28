import { getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createAddNodeCommand } from './addNodeCommand';

describe('createAddNodeCommand', () => {
  it('adds a child to the parent and removes it on undo', () => {
    const parent = createNode2D(DisplayObjectKind);
    const child = createNode2D(DisplayObjectKind);
    const command = createAddNodeCommand(parent, child);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(child);
    expect(getNodeParent(child)).toBe(parent);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(0);
    expect(getNodeParent(child)).toBeNull();
  });
});
