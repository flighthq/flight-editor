import { describe, expect, it } from 'vitest';

import {
  computeTransformOriginPoint,
  createTransformOriginState,
  getCustomTransformOrigin,
  getTransformOriginMode,
  getTransformOriginVersion,
  setCustomTransformOrigin,
  setTransformOriginMode,
} from './transformOriginState';

describe('createTransformOriginState', () => {
  it('defaults to an unmodified center origin', () => {
    const state = createTransformOriginState();
    expect(getTransformOriginMode(state)).toBe('center');
    expect(getCustomTransformOrigin(state)).toEqual({ x: 0, y: 0 });
    expect(getTransformOriginVersion(state)).toBe(0);
  });
});

describe('setTransformOriginMode', () => {
  it('sets modes with redundant-set guards', () => {
    const state = createTransformOriginState();
    setTransformOriginMode(state, 'center');
    expect(getTransformOriginVersion(state)).toBe(0);
    setTransformOriginMode(state, 'bottomRight');
    expect(getTransformOriginMode(state)).toBe('bottomRight');
    expect(getTransformOriginVersion(state)).toBe(1);
  });
});

describe('setCustomTransformOrigin', () => {
  it('sets a scene-space custom point and selects custom mode atomically', () => {
    const state = createTransformOriginState();
    setCustomTransformOrigin(state, 12.5, -4);
    expect(getTransformOriginMode(state)).toBe('custom');
    expect(getCustomTransformOrigin(state)).toEqual({ x: 12.5, y: -4 });
    expect(getTransformOriginVersion(state)).toBe(1);
    setCustomTransformOrigin(state, 12.5, -4);
    expect(getTransformOriginVersion(state)).toBe(1);
  });
});

describe('getTransformOriginMode', () => {
  it('returns the active mode', () => {
    const state = createTransformOriginState();
    setTransformOriginMode(state, 'topRight');
    expect(getTransformOriginMode(state)).toBe('topRight');
  });
});

describe('getCustomTransformOrigin', () => {
  it('returns a value object rather than mutable state', () => {
    const state = createTransformOriginState();
    setCustomTransformOrigin(state, 3, 7);
    const point = getCustomTransformOrigin(state) as { x: number; y: number };
    point.x = 99;
    expect(getCustomTransformOrigin(state)).toEqual({ x: 3, y: 7 });
  });
});

describe('getTransformOriginVersion', () => {
  it('returns the current version', () => {
    const state = createTransformOriginState();
    setTransformOriginMode(state, 'topLeft');
    expect(getTransformOriginVersion(state)).toBe(1);
  });
});

describe('computeTransformOriginPoint', () => {
  it.each([
    ['center', { x: 20, y: 40 }],
    ['topLeft', { x: 10, y: 20 }],
    ['topRight', { x: 30, y: 20 }],
    ['bottomLeft', { x: 10, y: 60 }],
    ['bottomRight', { x: 30, y: 60 }],
  ] as const)('computes the %s bounds-relative scene point', (mode, expected) => {
    const state = createTransformOriginState();
    setTransformOriginMode(state, mode);
    expect(computeTransformOriginPoint(state, { x: 10, y: 20, width: 20, height: 40 })).toEqual(expected);
  });

  it('uses the custom scene-space point independently of bounds', () => {
    const state = createTransformOriginState();
    setCustomTransformOrigin(state, -5, 8);
    expect(computeTransformOriginPoint(state, { x: 100, y: 200, width: 30, height: 40 })).toEqual({
      x: -5,
      y: 8,
    });
  });
});
