import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createDistributeNodesCommand } from './distributeNodesCommand';

function createPositionedNode(x: number, y: number): Node2D {
  const node = createNode2D(DisplayObjectKind);
  setNodeTransform2D(node, {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
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

describe('createDistributeNodesCommand', () => {
  it('distributes intermediate nodes horizontally in position order', () => {
    const left = createPositionedNode(0, 10);
    const right = createPositionedNode(90, 20);
    const middleA = createPositionedNode(80, 30);
    const middleB = createPositionedNode(10, 40);

    createDistributeNodesCommand([left, right, middleA, middleB], 'horizontal').execute();

    expect([left, middleB, middleA, right].map((node) => readTransform(node).x)).toEqual([0, 30, 60, 90]);
    expect([left, right, middleA, middleB].map((node) => readTransform(node).y)).toEqual([10, 20, 30, 40]);
  });

  it('distributes intermediate nodes vertically in position order', () => {
    const top = createPositionedNode(10, 0);
    const bottom = createPositionedNode(20, 60);
    const middle = createPositionedNode(30, 50);

    createDistributeNodesCommand([middle, top, bottom], 'vertical').execute();

    expect([top, middle, bottom].map((node) => readTransform(node).y)).toEqual([0, 30, 60]);
    expect([top, bottom, middle].map((node) => readTransform(node).x)).toEqual([10, 20, 30]);
  });

  it('is a no-op for fewer than three nodes', () => {
    const first = createPositionedNode(10, 20);
    const second = createPositionedNode(80, 90);
    const originals = [readTransform(first), readTransform(second)];
    const command = createDistributeNodesCommand([first, second], 'horizontal');

    command.execute();
    command.undo();

    expect([readTransform(first), readTransform(second)]).toEqual(originals);
  });

  it('restores intermediate transforms on undo', () => {
    const nodes = [createPositionedNode(0, 0), createPositionedNode(70, 10), createPositionedNode(100, 20)];
    const originals = nodes.map(readTransform);
    const command = createDistributeNodesCommand(nodes, 'horizontal');

    command.execute();
    command.undo();

    expect(nodes.map(readTransform)).toEqual(originals);
  });

  it('keeps a single node unchanged and accepts an empty node list', () => {
    const node = createPositionedNode(17, 29);
    const original = readTransform(node);
    const single = createDistributeNodesCommand([node], 'vertical');
    const empty = createDistributeNodesCommand([], 'horizontal');

    expect(() => empty.execute()).not.toThrow();
    expect(() => empty.undo()).not.toThrow();
    single.execute();
    single.undo();

    expect(readTransform(node)).toEqual(original);
  });

  it('has the correct labels', () => {
    expect(createDistributeNodesCommand([], 'horizontal').label).toBe('Distribute Horizontally');
    expect(createDistributeNodesCommand([], 'vertical').label).toBe('Distribute Vertically');
  });

  it('distributes 5 nodes evenly', () => {
    const nodes = [
      createPositionedNode(0, 0),
      createPositionedNode(80, 0),
      createPositionedNode(50, 0),
      createPositionedNode(30, 0),
      createPositionedNode(100, 0),
    ];

    createDistributeNodesCommand(nodes, 'horizontal').execute();

    const xs = nodes.map((n) => readTransform(n).x).sort((a, b) => a - b);
    expect(xs).toEqual([0, 25, 50, 75, 100]);
  });
});
