import { describe, expect, it } from 'vitest';

import {
  createGridState,
  getEffectiveCellSize,
  getGridOpacity,
  getGridSize,
  getGridSubdivisions,
  getGridVersion,
  isGridVisible,
  setGridOpacity,
  setGridSize,
  setGridSubdivisions,
  setGridVisible,
  snapPointToGrid,
  toggleGridVisible,
  validateGridState,
} from './gridState';

describe('createGridState', () => {
  it('returns default state', () => {
    const state = createGridState();
    expect(getGridSize(state)).toEqual({ x: 10, y: 10 });
    expect(getGridSubdivisions(state)).toBe(1);
    expect(isGridVisible(state)).toBe(true);
    expect(getGridOpacity(state)).toBe(1);
    expect(getGridVersion(state)).toBe(0);
  });
});

describe('getGridSize', () => {
  it('is exported', () => expect(getGridSize).toBeTypeOf('function'));
});

describe('setGridSize', () => {
  it('changes the grid size', () => {
    const state = createGridState();
    setGridSize(state, 20, 20);
    expect(getGridSize(state)).toEqual({ x: 20, y: 20 });
    expect(getGridVersion(state)).toBe(1);
  });

  it('supports non-uniform grid sizes', () => {
    const state = createGridState();
    setGridSize(state, 16, 9);
    expect(getGridSize(state)).toEqual({ x: 16, y: 9 });
  });

  it('does not bump version when size unchanged', () => {
    const state = createGridState();
    setGridSize(state, 10, 10);
    expect(getGridVersion(state)).toBe(0);
  });
});

describe('getGridSubdivisions', () => {
  it('is exported', () => expect(getGridSubdivisions).toBeTypeOf('function'));
});

describe('setGridSubdivisions', () => {
  it('changes subdivisions', () => {
    const state = createGridState();
    setGridSubdivisions(state, 4);
    expect(getGridSubdivisions(state)).toBe(4);
    expect(getGridVersion(state)).toBe(1);
  });

  it('clamps to minimum of 1', () => {
    const state = createGridState();
    setGridSubdivisions(state, 0);
    expect(getGridSubdivisions(state)).toBe(1);
    expect(getGridVersion(state)).toBe(0);
  });

  it('floors fractional values', () => {
    const state = createGridState();
    setGridSubdivisions(state, 3.7);
    expect(getGridSubdivisions(state)).toBe(3);
  });
});

describe('isGridVisible', () => {
  it('is exported', () => expect(isGridVisible).toBeTypeOf('function'));
});

describe('setGridVisible', () => {
  it('hides the grid', () => {
    const state = createGridState();
    setGridVisible(state, false);
    expect(isGridVisible(state)).toBe(false);
    expect(getGridVersion(state)).toBe(1);
  });

  it('does not bump version when value unchanged', () => {
    const state = createGridState();
    setGridVisible(state, true);
    expect(getGridVersion(state)).toBe(0);
  });
});

describe('toggleGridVisible', () => {
  it('toggles visibility', () => {
    const state = createGridState();
    toggleGridVisible(state);
    expect(isGridVisible(state)).toBe(false);
    toggleGridVisible(state);
    expect(isGridVisible(state)).toBe(true);
    expect(getGridVersion(state)).toBe(2);
  });
});

describe('getGridOpacity', () => {
  it('is exported', () => expect(getGridOpacity).toBeTypeOf('function'));
});

describe('setGridOpacity', () => {
  it('sets opacity', () => {
    const state = createGridState();
    setGridOpacity(state, 0.5);
    expect(getGridOpacity(state)).toBe(0.5);
    expect(getGridVersion(state)).toBe(1);
  });

  it('clamps to 0–1 range', () => {
    const state = createGridState();
    setGridOpacity(state, -0.5);
    expect(getGridOpacity(state)).toBe(0);
    setGridOpacity(state, 2.0);
    expect(getGridOpacity(state)).toBe(1);
  });
});

describe('getEffectiveCellSize', () => {
  it('returns grid size divided by subdivisions', () => {
    const state = createGridState();
    setGridSize(state, 20, 20);
    setGridSubdivisions(state, 4);
    expect(getEffectiveCellSize(state)).toEqual({ x: 5, y: 5 });
  });

  it('returns grid size when subdivisions is 1', () => {
    const state = createGridState();
    expect(getEffectiveCellSize(state)).toEqual({ x: 10, y: 10 });
  });
});

describe('getGridVersion', () => {
  it('is exported', () => expect(getGridVersion).toBeTypeOf('function'));
});

describe('snapPointToGrid', () => {
  it('snaps positive and negative coordinates to effective subdivisions', () => {
    const state = createGridState();
    setGridSize(state, 20, 10);
    setGridSubdivisions(state, 2);
    expect(snapPointToGrid(state, { x: 14, y: -8 })).toEqual({ x: 10, y: -10 });
    expect(() => snapPointToGrid(state, { x: Number.NaN, y: 0 })).toThrow('finite');
  });
});

describe('validateGridState', () => {
  it('diagnoses invalid hydrated grid values', () => {
    const state = createGridState();
    state.sizeX = 0;
    state.subdivisions = 0;
    state.opacity = 2;
    expect(validateGridState(state)).toEqual(['invalid-size-x', 'invalid-subdivisions', 'invalid-opacity']);
  });
});

describe('setGridSize', () => {
  it('rejects non-finite and non-positive geometry', () => {
    const state = createGridState();
    expect(() => setGridSize(state, 0, 10)).toThrow('greater than zero');
    expect(() => setGridSize(state, Number.NaN, 10)).toThrow('finite');
  });
});
