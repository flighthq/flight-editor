import { addNodeChild, getNodeChildren, getNodeParent } from '@flighthq/node';
import { createDisplayObject } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createMoveToPageCommand } from './moveToPageCommand';

describe('createMoveToPageCommand', () => {
  it('moves nodes to the target and restores their exact parents and indices', () => {
    const firstParent = createDisplayObject();
    const secondParent = createDisplayObject();
    const target = createDisplayObject();
    const a = createDisplayObject({ name: 'a' });
    const first = createDisplayObject({ name: 'first' });
    const b = createDisplayObject({ name: 'b' });
    const second = createDisplayObject({ name: 'second' });
    const c = createDisplayObject({ name: 'c' });
    const existing = createDisplayObject({ name: 'existing' });
    for (const child of [a, first, b]) addNodeChild(firstParent, child);
    for (const child of [second, c]) addNodeChild(secondParent, child);
    addNodeChild(target, existing);
    const command = createMoveToPageCommand([first, second], target);

    command.execute();
    expect(getNodeChildren(target)).toEqual([existing, first, second]);
    expect(getNodeChildren(firstParent)).toEqual([a, b]);
    expect(getNodeChildren(secondParent)).toEqual([c]);

    command.undo();
    expect(getNodeChildren(target)).toEqual([existing]);
    expect(getNodeChildren(firstParent)).toEqual([a, first, b]);
    expect(getNodeChildren(secondParent)).toEqual([second, c]);
    expect(command.label).toBe('Move to Page');
  });

  it('restores multiple siblings in order and detaches originally rootless nodes', () => {
    const oldParent = createDisplayObject();
    const target = createDisplayObject();
    const a = createDisplayObject({ name: 'a' });
    const first = createDisplayObject({ name: 'first' });
    const middle = createDisplayObject({ name: 'middle' });
    const second = createDisplayObject({ name: 'second' });
    const detached = createDisplayObject({ name: 'detached' });
    for (const child of [a, first, middle, second]) addNodeChild(oldParent, child);
    const command = createMoveToPageCommand([second, detached, first], target);

    command.execute();
    command.undo();
    expect(getNodeChildren(oldParent)).toEqual([a, first, middle, second]);
    expect(getNodeParent(detached)).toBeNull();

    command.execute();
    expect(getNodeChildren(target)).toEqual([second, detached, first]);
  });

  it('multiple undo/redo cycles are stable', () => {
    const source = createDisplayObject();
    const target = createDisplayObject();
    const node = createDisplayObject({ name: 'n' });
    addNodeChild(source, node);
    const command = createMoveToPageCommand([node], target);

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(getNodeParent(node)).toBe(target);
      command.undo();
      expect(getNodeParent(node)).toBe(source);
    }
  });

  it('handles moving a single rootless node', () => {
    const target = createDisplayObject();
    const node = createDisplayObject({ name: 'orphan' });
    const command = createMoveToPageCommand([node], target);

    command.execute();
    expect(getNodeChildren(target)).toEqual([node]);

    command.undo();
    expect(getNodeChildren(target)).toEqual([]);
    expect(getNodeParent(node)).toBeNull();
  });
});
