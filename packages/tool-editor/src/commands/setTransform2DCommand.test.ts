import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetTransform2DCommand } from './setTransform2DCommand';

function readTransform2D(node: Node2D): Transform2DLike {
  const transform = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(transform, node);
  return transform;
}

describe('createSetTransform2DCommand', () => {
  it('applies a new transform and restores the old transform on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    const oldTransform: Transform2DLike = {
      pivotX: 1,
      pivotY: 2,
      rotation: 3,
      scaleX: 4,
      scaleY: 5,
      skewX: 6,
      skewY: 7,
      x: 8,
      y: 9,
    };
    const newTransform: Transform2DLike = {
      pivotX: 10,
      pivotY: 11,
      rotation: 12,
      scaleX: 13,
      scaleY: 14,
      skewX: 15,
      skewY: 16,
      x: 17,
      y: 18,
    };
    setNodeTransform2D(node, oldTransform);
    const command = createSetTransform2DCommand(node, newTransform);

    command.execute();

    expect(readTransform2D(node)).toEqual(newTransform);

    command.undo();

    expect(readTransform2D(node)).toEqual(oldTransform);
  });
});
