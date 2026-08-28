import { describe, expect, it } from 'vitest';

import {
  addRecentColor,
  addSwatch,
  clearSwatches,
  createColorState,
  getActiveColor,
  getColorVersion,
  getRecentColors,
  getSwatches,
  removeSwatch,
  setActiveColor,
} from './colorState';

describe('addRecentColor', () => {
  it('is exported', () => expect(addRecentColor).toBeTypeOf('function'));
});

describe('addSwatch', () => {
  it('is exported', () => expect(addSwatch).toBeTypeOf('function'));
});

describe('clearSwatches', () => {
  it('is exported', () => expect(clearSwatches).toBeTypeOf('function'));
});

describe('getActiveColor', () => {
  it('is exported', () => expect(getActiveColor).toBeTypeOf('function'));
});

describe('getColorVersion', () => {
  it('is exported', () => expect(getColorVersion).toBeTypeOf('function'));
});

describe('getRecentColors', () => {
  it('is exported', () => expect(getRecentColors).toBeTypeOf('function'));
});

describe('getSwatches', () => {
  it('is exported', () => expect(getSwatches).toBeTypeOf('function'));
});

describe('removeSwatch', () => {
  it('is exported', () => expect(removeSwatch).toBeTypeOf('function'));
});

describe('setActiveColor', () => {
  it('is exported', () => expect(setActiveColor).toBeTypeOf('function'));
});

describe('createColorState', () => {
  it('starts with opaque black and empty color collections', () => {
    const state = createColorState();

    expect(getActiveColor(state)).toBe(0x000000ff);
    expect(getSwatches(state)).toEqual([]);
    expect(getRecentColors(state)).toEqual([]);
    expect(state.maxRecent).toBe(10);
    expect(getColorVersion(state)).toBe(0);
  });

  it('sets the active packed color', () => {
    const state = createColorState();

    setActiveColor(state, 0x12345678);

    expect(getActiveColor(state)).toBe(0x12345678);
    expect(getColorVersion(state)).toBe(1);
  });

  it('normalizes active colors to unsigned 32-bit values', () => {
    const state = createColorState();

    setActiveColor(state, -1);

    expect(getActiveColor(state)).toBe(0xffffffff);
  });

  it('does not increment the version for the active color already in use', () => {
    const state = createColorState();

    setActiveColor(state, 0x000000ff);

    expect(getColorVersion(state)).toBe(0);
  });

  it('adds swatches in insertion order', () => {
    const state = createColorState();

    addSwatch(state, 0xff0000ff);
    addSwatch(state, 0x00ff00ff);
    addSwatch(state, 0x0000ffff);

    expect(getSwatches(state)).toEqual([0xff0000ff, 0x00ff00ff, 0x0000ffff]);
  });

  it('allows duplicate saved swatches', () => {
    const state = createColorState();

    addSwatch(state, 0xff0000ff);
    addSwatch(state, 0xff0000ff);

    expect(getSwatches(state)).toEqual([0xff0000ff, 0xff0000ff]);
  });

  it('removes a swatch by index and returns true', () => {
    const state = createColorState();
    addSwatch(state, 0xff0000ff);
    addSwatch(state, 0x00ff00ff);

    expect(removeSwatch(state, 0)).toBe(true);
    expect(getSwatches(state)).toEqual([0x00ff00ff]);
    expect(getColorVersion(state)).toBe(3);
  });

  it('returns false without a version bump for an invalid swatch index', () => {
    const state = createColorState();

    expect(removeSwatch(state, -1)).toBe(false);
    expect(removeSwatch(state, 0)).toBe(false);
    expect(getColorVersion(state)).toBe(0);
  });

  it('clears all saved swatches with one version increment', () => {
    const state = createColorState();
    addSwatch(state, 0xff0000ff);
    addSwatch(state, 0x00ff00ff);

    clearSwatches(state);

    expect(getSwatches(state)).toEqual([]);
    expect(getColorVersion(state)).toBe(3);
  });

  it('does not increment the version when clearing empty swatches', () => {
    const state = createColorState();

    clearSwatches(state);

    expect(getColorVersion(state)).toBe(0);
  });

  it('records recent colors in FIFO order', () => {
    const state = createColorState();

    addRecentColor(state, 0xff0000ff);
    addRecentColor(state, 0x00ff00ff);
    addRecentColor(state, 0x0000ffff);

    expect(getRecentColors(state)).toEqual([0xff0000ff, 0x00ff00ff, 0x0000ffff]);
  });

  it('evicts the oldest recent color when the maximum is exceeded', () => {
    const state = createColorState();
    for (let color = 1; color <= state.maxRecent + 2; color++) addRecentColor(state, color);

    expect(getRecentColors(state)).toHaveLength(state.maxRecent);
    expect(getRecentColors(state)[0]).toBe(3);
    expect(getRecentColors(state).at(-1)).toBe(12);
  });

  it('retains repeated recent-color uses as distinct FIFO entries', () => {
    const state = createColorState();

    addRecentColor(state, 0x123456ff);
    addRecentColor(state, 0x123456ff);

    expect(getRecentColors(state)).toEqual([0x123456ff, 0x123456ff]);
  });

  it('increments the version for each meaningful color operation', () => {
    const state = createColorState();

    setActiveColor(state, 0xffffffff);
    addSwatch(state, 0x123456ff);
    addRecentColor(state, 0xabcdef12);
    removeSwatch(state, 0);

    expect(getColorVersion(state)).toBe(4);
  });
});
