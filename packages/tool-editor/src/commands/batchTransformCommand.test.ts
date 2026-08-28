import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { Transform2DLike } from '@flighthq/types';

import { createBatchTransformCommand } from './batchTransformCommand';

function readTransform(node: any): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

const identity: Transform2DLike = {
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

describe('createBatchTransformCommand', () => {
  it('applies transforms to multiple nodes in one command', () => {
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    const cmd = createBatchTransformCommand([
      { node: a, transform: { ...identity, x: 10, y: 20 } },
      { node: b, transform: { ...identity, x: 30, y: 40, scaleX: 2 } },
    ]);

    cmd.execute();

    expect(readTransform(a).x).toBe(10);
    expect(readTransform(a).y).toBe(20);
    expect(readTransform(b).x).toBe(30);
    expect(readTransform(b).scaleX).toBe(2);
  });

  it('undo restores all original transforms', () => {
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    setNodeTransform2D(a, { ...identity, x: 5, y: 5 });
    setNodeTransform2D(b, { ...identity, x: 15, y: 15 });

    const cmd = createBatchTransformCommand([
      { node: a, transform: { ...identity, x: 100, y: 200 } },
      { node: b, transform: { ...identity, x: 300, y: 400 } },
    ]);

    cmd.execute();
    expect(readTransform(a).x).toBe(100);
    expect(readTransform(b).x).toBe(300);

    cmd.undo();
    expect(readTransform(a).x).toBe(5);
    expect(readTransform(a).y).toBe(5);
    expect(readTransform(b).x).toBe(15);
    expect(readTransform(b).y).toBe(15);
  });

  it('handles single-entry batch', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createBatchTransformCommand([{ node, transform: { ...identity, rotation: 1.5 } }]);

    cmd.execute();
    expect(readTransform(node).rotation).toBe(1.5);

    cmd.undo();
    expect(readTransform(node).rotation).toBe(0);
  });

  it('handles empty batch without error', () => {
    const cmd = createBatchTransformCommand([]);
    cmd.execute();
    cmd.undo();
  });

  it('has the correct label', () => {
    const cmd = createBatchTransformCommand([]);
    expect(cmd.label).toBe('Transform');
  });

  it('can re-execute after undo', () => {
    const a = createNode2D(DisplayObjectKind);
    const cmd = createBatchTransformCommand([{ node: a, transform: { ...identity, x: 42, y: 84 } }]);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(readTransform(a).x).toBe(42);
    expect(readTransform(a).y).toBe(84);
  });

  it('preserves unmodified transform fields', () => {
    const node = createNode2D(DisplayObjectKind);
    setNodeTransform2D(node, { ...identity, scaleX: 3, scaleY: 5 });

    const cmd = createBatchTransformCommand([{ node, transform: { ...identity, x: 10, scaleX: 3, scaleY: 5 } }]);
    cmd.execute();

    const t = readTransform(node);
    expect(t.x).toBe(10);
    expect(t.scaleX).toBe(3);
    expect(t.scaleY).toBe(5);
  });
});
