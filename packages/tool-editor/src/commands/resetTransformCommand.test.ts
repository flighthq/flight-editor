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
});
