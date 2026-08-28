import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetPivotCommand } from './setPivotCommand';

function readTransform(node: Node2D): Transform2DLike {
  const transform = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(transform, node);
  return transform;
}

function createTransformedNode(): Node2D {
  const node = createNode2D(DisplayObjectKind);
  setNodeTransform2D(node, {
    pivotX: 1,
    pivotY: 2,
    rotation: 3,
    scaleX: 4,
    scaleY: 5,
    skewX: 6,
    skewY: 7,
    x: 8,
    y: 9,
  });
  return node;
}

describe('createSetPivotCommand', () => {
  it('sets both pivot coordinates', () => {
    const node = createTransformedNode();

    createSetPivotCommand(node, 20, 30).execute();

    expect(readTransform(node).pivotX).toBe(20);
    expect(readTransform(node).pivotY).toBe(30);
  });

  it('preserves every non-pivot transform component', () => {
    const node = createTransformedNode();
    const original = readTransform(node);

    createSetPivotCommand(node, 20, 30).execute();

    expect(readTransform(node)).toEqual({ ...original, pivotX: 20, pivotY: 30 });
  });

  it('restores the complete original transform on undo', () => {
    const node = createTransformedNode();
    const original = readTransform(node);
    const command = createSetPivotCommand(node, -10, 100);

    command.execute();
    command.undo();

    expect(readTransform(node)).toEqual(original);
  });

  it('supports negative and fractional pivot coordinates', () => {
    const node = createTransformedNode();

    createSetPivotCommand(node, -2.5, 4.25).execute();

    expect(readTransform(node).pivotX).toBe(-2.5);
    expect(readTransform(node).pivotY).toBe(4.25);
  });

  it('can execute again after undo', () => {
    const node = createTransformedNode();
    const command = createSetPivotCommand(node, 20, 30);

    command.execute();
    command.undo();
    command.execute();

    expect(readTransform(node).pivotX).toBe(20);
    expect(readTransform(node).pivotY).toBe(30);
  });
});
