import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { AlignMode } from './alignNodesCommand';

import { createAlignNodesCommand } from './alignNodesCommand';

function createPositionedNode(x: number, y: number): Node2D {
  const node = createNode2D(DisplayObjectKind);
  setNodeTransform2D(node, {
    pivotX: 1,
    pivotY: 2,
    rotation: 3,
    scaleX: 4,
    scaleY: 5,
    skewX: 6,
    skewY: 7,
    x,
    y,
  });
  return node;
}

function readTransform(node: Node2D): Transform2DLike {
  const transform = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(transform, node);
  return transform;
}

describe('createAlignNodesCommand', () => {
  it.each<[AlignMode, 'x' | 'y', number]>([
    ['left', 'x', 10],
    ['right', 'x', 50],
    ['center-h', 'x', 30],
    ['top', 'y', 20],
    ['bottom', 'y', 80],
    ['center-v', 'y', 50],
  ])('aligns nodes in %s mode', (mode, axis, target) => {
    const nodes = [createPositionedNode(10, 80), createPositionedNode(30, 50), createPositionedNode(50, 20)];

    createAlignNodesCommand(nodes, mode).execute();

    expect(nodes.map((node) => readTransform(node)[axis])).toEqual([target, target, target]);
    const otherAxis = axis === 'x' ? 'y' : 'x';
    expect(nodes.map((node) => readTransform(node)[otherAxis])).toEqual(
      otherAxis === 'x' ? [10, 30, 50] : [80, 50, 20],
    );
  });

  it('restores every original transform on undo', () => {
    const nodes = [createPositionedNode(10, 20), createPositionedNode(30, 40), createPositionedNode(50, 60)];
    const originals = nodes.map(readTransform);
    const command = createAlignNodesCommand(nodes, 'center-h');

    command.execute();
    command.undo();

    expect(nodes.map(readTransform)).toEqual(originals);
  });
});
