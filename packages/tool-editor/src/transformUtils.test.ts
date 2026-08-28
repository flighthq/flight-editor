import { addNodeChild } from '@flighthq/node';
import { createDisplayObject, createHtmlView } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import {
  composeTransform,
  decomposeTransform,
  getLocalPosition,
  getNodeCenter,
  getWorldPosition,
} from './transformUtils';

describe('decomposeTransform', () => {
  it('reads all local transform components and converts rotation to degrees', () => {
    const node = createDisplayObject({
      x: 12,
      y: -4,
      rotation: Math.PI / 2,
      scaleX: 2,
      scaleY: -3,
      skewX: 0.1,
      skewY: -0.2,
      pivotX: 5,
      pivotY: 6,
    });
    expect(decomposeTransform(node)).toEqual({
      position: { x: 12, y: -4 },
      rotation: 90,
      scale: { x: 2, y: -3 },
      skew: { x: 0.1, y: -0.2 },
      pivot: { x: 5, y: 6 },
    });
  });
});

describe('composeTransform', () => {
  it('creates a Flight transform and converts degrees to radians', () => {
    expect(
      composeTransform({
        position: { x: 1, y: 2 },
        rotation: 45,
        scale: { x: 3, y: 4 },
        skew: { x: 0.2, y: 0.3 },
        pivot: { x: 5, y: 6 },
      }),
    ).toEqual({
      x: 1,
      y: 2,
      rotation: Math.PI / 4,
      scaleX: 3,
      scaleY: 4,
      skewX: 0.2,
      skewY: 0.3,
      pivotX: 5,
      pivotY: 6,
    });
  });

  it('round-trips a node decomposition', () => {
    const node = createDisplayObject({ x: 2, y: 3, rotation: -0.75, scaleX: -2, pivotY: 8 });
    expect(composeTransform(decomposeTransform(node))).toMatchObject({
      x: 2,
      y: 3,
      rotation: -0.75,
      scaleX: -2,
      pivotY: 8,
    });
  });
});

describe('getWorldPosition', () => {
  it('reads the composed world-matrix translation', () => {
    const parent = createDisplayObject({ x: 10, y: 20 });
    const child = createDisplayObject({ x: 5, y: -3 });
    addNodeChild(parent, child);
    expect(getWorldPosition(child)).toEqual({ x: 15, y: 17 });
  });
});

describe('getLocalPosition', () => {
  it('converts scene coordinates into node-local coordinates', () => {
    const parent = createDisplayObject({ x: 10, y: 20 });
    const child = createDisplayObject({ x: 5, y: -3, scaleX: 2, scaleY: 2 });
    addNodeChild(parent, child);
    expect(getLocalPosition(child, 19, 23)).toEqual({ x: 2, y: 3 });
  });
});

describe('getNodeCenter', () => {
  it('returns the center of scene-space bounds', () => {
    const root = createDisplayObject();
    const node = createHtmlView({ data: { width: 20, height: 10 }, x: 10, y: 20 });
    addNodeChild(root, node);
    expect(getNodeCenter(node)).toEqual({ x: 20, y: 25 });
  });
});
