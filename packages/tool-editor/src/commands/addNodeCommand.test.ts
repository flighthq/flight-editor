import { getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { addNodeChild } from '@flighthq/node';
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

  it('appends after existing children', () => {
    const parent = createNode2D(DisplayObjectKind);
    const existing = createNode2D(DisplayObjectKind);
    addNodeChild(parent, existing);
    const child = createNode2D(DisplayObjectKind);
    const command = createAddNodeCommand(parent, child);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(existing);
    expect(getNodeChildAt(parent, 1)).toBe(child);
  });

  it('has the correct label', () => {
    const parent = createNode2D(DisplayObjectKind);
    const child = createNode2D(DisplayObjectKind);
    const command = createAddNodeCommand(parent, child);

    expect(command.label).toBe('Add Node');
  });

  it('supports re-execute after undo', () => {
    const parent = createNode2D(DisplayObjectKind);
    const child = createNode2D(DisplayObjectKind);
    const command = createAddNodeCommand(parent, child);

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(child);
    expect(getNodeParent(child)).toBe(parent);
  });
});
