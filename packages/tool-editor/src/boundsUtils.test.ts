import { addNodeChild } from '@flighthq/node';
import { createDisplayObject, createHtmlView, createScene2D } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { expandBounds, getSceneBounds, getSelectionBounds, isNodeInBounds } from './boundsUtils';

function createBoundedTree() {
  const root = createDisplayObject();
  const first = createHtmlView({ data: { width: 20, height: 10 }, x: 10, y: 5 });
  const second = createHtmlView({ data: { width: 15, height: 25 }, x: 40, y: -5 });
  addNodeChild(root, first);
  addNodeChild(root, second);
  return { root, first, second };
}

describe('getSelectionBounds', () => {
  it('returns null for no nodes and merges scene-space node bounds', () => {
    const { first, second } = createBoundedTree();
    expect(getSelectionBounds([])).toBeNull();
    expect(getSelectionBounds([first, second])).toEqual({ x: 10, y: -5, width: 45, height: 25 });
  });
});

describe('getSceneBounds', () => {
  it('uses scene dimensions at scene origin', () => {
    const scene = createScene2D({ scene2dWidth: 1920, scene2dHeight: 1080 });
    expect(getSceneBounds(scene)).toEqual({ x: 0, y: 0, width: 1920, height: 1080 });
  });
});

describe('isNodeInBounds', () => {
  it('detects overlap and edge contact in scene space', () => {
    const { first } = createBoundedTree();
    expect(isNodeInBounds(first, { x: 0, y: 0, width: 11, height: 6 })).toBe(true);
    expect(isNodeInBounds(first, { x: 30, y: 5, width: 5, height: 5 })).toBe(true);
    expect(isNodeInBounds(first, { x: 31, y: 5, width: 5, height: 5 })).toBe(false);
  });
});

describe('expandBounds', () => {
  it('expands all edges equally and supports negative padding', () => {
    const rect = { x: 10, y: 20, width: 30, height: 40 };
    expect(expandBounds(rect, 5)).toEqual({ x: 5, y: 15, width: 40, height: 50 });
    expect(expandBounds(rect, -2)).toEqual({ x: 12, y: 22, width: 26, height: 36 });
  });
});
