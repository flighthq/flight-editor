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

const IDENTITY: Transform2DLike = {
  pivotX: 0,
  pivotY: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  x: 0,
  y: 0,
};

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

  it('snapshots the new transform so later mutation has no effect', () => {
    const node = createNode2D(DisplayObjectKind);
    const newTransform: Transform2DLike = { ...IDENTITY, x: 100, y: 200 };
    const command = createSetTransform2DCommand(node, newTransform);

    newTransform.x = 999;
    command.execute();

    expect(readTransform2D(node).x).toBe(100);
  });

  it('captures the current transform at creation time', () => {
    const node = createNode2D(DisplayObjectKind);
    setNodeTransform2D(node, { ...IDENTITY, x: 50 });
    const command = createSetTransform2DCommand(node, { ...IDENTITY, x: 100 });

    setNodeTransform2D(node, { ...IDENTITY, x: 75 });
    command.execute();

    expect(readTransform2D(node).x).toBe(100);

    command.undo();

    expect(readTransform2D(node).x).toBe(50);
  });

  it('has the correct label', () => {
    const node = createNode2D(DisplayObjectKind);
    const command = createSetTransform2DCommand(node, IDENTITY);

    expect(command.label).toBe('Set Transform');
  });

  it('supports re-execute after undo', () => {
    const node = createNode2D(DisplayObjectKind);
    const newTransform: Transform2DLike = { ...IDENTITY, rotation: 45, x: 10, y: 20 };
    const command = createSetTransform2DCommand(node, newTransform);

    command.execute();
    command.undo();
    command.execute();

    expect(readTransform2D(node)).toEqual(newTransform);
  });

  it('identity transform is a valid no-op', () => {
    const node = createNode2D(DisplayObjectKind);
    const command = createSetTransform2DCommand(node, IDENTITY);

    command.execute();
    expect(readTransform2D(node)).toEqual(IDENTITY);

    command.undo();
    expect(readTransform2D(node)).toEqual(IDENTITY);
  });

  it('multiple undo/redo cycles are stable', () => {
    const node = createNode2D(DisplayObjectKind);
    const original: Transform2DLike = { ...IDENTITY, x: 10, y: 20 };
    const next: Transform2DLike = { ...IDENTITY, x: 100, y: 200, rotation: 90 };
    setNodeTransform2D(node, original);
    const command = createSetTransform2DCommand(node, next);

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(readTransform2D(node)).toEqual(next);
      command.undo();
      expect(readTransform2D(node)).toEqual(original);
    }
  });
});
