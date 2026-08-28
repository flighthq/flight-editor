import { createDisplayObject } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createResetTransformCommand } from './resetTransformCommand';

describe('createResetTransformCommand', () => {
  it('resets the full transform to identity and restores the captured transform', () => {
    const original = {
      x: 4,
      y: 5,
      rotation: 0.6,
      scaleX: -2,
      scaleY: 3,
      skewX: 0.1,
      skewY: 0.2,
      pivotX: 7,
      pivotY: 8,
    };
    const node = createDisplayObject(original);
    const command = createResetTransformCommand(node);
    node.x = 100;
    command.execute();
    expect(node).toMatchObject({
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      pivotX: 0,
      pivotY: 0,
    });
    command.undo();
    expect(node).toMatchObject(original);
    expect(command.label).toBe('Reset Transform');
  });

  it('multiple undo/redo cycles are stable', () => {
    const node = createDisplayObject({ x: 10, y: 20, rotation: 1.5, scaleX: 3, scaleY: 4 });
    const command = createResetTransformCommand(node);

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(node.x).toBe(0);
      expect(node.scaleX).toBe(1);
      command.undo();
      expect(node.x).toBe(10);
      expect(node.scaleX).toBe(3);
    }
  });

  it('is a no-op on a node already at identity', () => {
    const node = createDisplayObject();
    const command = createResetTransformCommand(node);
    command.execute();
    expect(node).toMatchObject({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
    command.undo();
    expect(node).toMatchObject({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
  });

  it('does not affect other nodes', () => {
    const target = createDisplayObject({ x: 10, scaleX: 2 });
    const sibling = createDisplayObject({ x: 20, scaleX: 3 });

    createResetTransformCommand(target).execute();

    expect(target).toMatchObject({ x: 0, scaleX: 1 });
    expect(sibling).toMatchObject({ x: 20, scaleX: 3 });
  });

  it('undo restores the snapshot over intervening mutations', () => {
    const node = createDisplayObject({ x: 10, y: 20, rotation: 0.5, scaleX: 2, scaleY: 3 });
    const command = createResetTransformCommand(node);
    command.execute();
    node.x = 999;
    node.rotation = 4;

    command.undo();

    expect(node).toMatchObject({ x: 10, y: 20, rotation: 0.5, scaleX: 2, scaleY: 3 });
  });
});
