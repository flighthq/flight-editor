import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetPivotCommand } from './setPivotCommand';

function readTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

describe('createSetPivotCommand', () => {
  it('sets pivot and restores on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    setNodeTransform2D(node, {
      pivotX: 0,
      pivotY: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      x: 10,
      y: 20,
    });
    const cmd = createSetPivotCommand(node, 50, 75);

    cmd.execute();

    const t = readTransform(node);
    expect(t.pivotX).toBe(50);
    expect(t.pivotY).toBe(75);
    expect(t.x).toBe(10);

    cmd.undo();

    const restored = readTransform(node);
    expect(restored.pivotX).toBe(0);
    expect(restored.pivotY).toBe(0);
  });

  it('preserves other transform fields', () => {
    const node = createNode2D(DisplayObjectKind);
    setNodeTransform2D(node, {
      pivotX: 0,
      pivotY: 0,
      rotation: 45,
      scaleX: 2,
      scaleY: 3,
      skewX: 0,
      skewY: 0,
      x: 100,
      y: 200,
    });
    const cmd = createSetPivotCommand(node, 10, 20);

    cmd.execute();

    const t = readTransform(node);
    expect(t.rotation).toBe(45);
    expect(t.scaleX).toBe(2);
    expect(t.scaleY).toBe(3);
    expect(t.x).toBe(100);
    expect(t.y).toBe(200);
  });

  it('has the correct label', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetPivotCommand(node, 0, 0);

    expect(cmd.label).toBe('Set Pivot');
  });

  it('supports re-execute after undo', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetPivotCommand(node, 30, 40);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    const t = readTransform(node);
    expect(t.pivotX).toBe(30);
    expect(t.pivotY).toBe(40);
  });

  it('handles negative pivot values', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetPivotCommand(node, -10, -20);

    cmd.execute();

    const t = readTransform(node);
    expect(t.pivotX).toBe(-10);
    expect(t.pivotY).toBe(-20);
  });
});
