import { describe, expect, it } from 'vitest';

import {
  clearCursorOverrides,
  createCursorState,
  getActiveCursor,
  getCursorOverrideCount,
  getCursorVersion,
  getToolDefaultCursor,
  popCursorOverride,
  pushCursorOverride,
  setToolDefaultCursor,
} from './cursorState';

describe('createCursorState', () => {
  it('starts with default cursor and no overrides', () => {
    const state = createCursorState();
    expect(getToolDefaultCursor(state)).toBe('default');
    expect(getActiveCursor(state)).toBe('default');
    expect(getCursorOverrideCount(state)).toBe(0);
    expect(getCursorVersion(state)).toBe(0);
  });
});

describe('getActiveCursor', () => {
  it('returns tool default when no overrides', () => {
    const state = createCursorState();
    setToolDefaultCursor(state, 'crosshair');
    expect(getActiveCursor(state)).toBe('crosshair');
  });

  it('returns top override when overrides exist', () => {
    const state = createCursorState();
    pushCursorOverride(state, 'move', 'drag');
    pushCursorOverride(state, 'grabbing', 'pan');
    expect(getActiveCursor(state)).toBe('grabbing');
  });
});

describe('getToolDefaultCursor', () => {
  it('is exported', () => expect(getToolDefaultCursor).toBeTypeOf('function'));
});

describe('setToolDefaultCursor', () => {
  it('changes the tool default cursor', () => {
    const state = createCursorState();
    setToolDefaultCursor(state, 'crosshair');
    expect(getToolDefaultCursor(state)).toBe('crosshair');
    expect(getCursorVersion(state)).toBe(1);
  });

  it('does not bump version when shape unchanged', () => {
    const state = createCursorState();
    setToolDefaultCursor(state, 'default');
    expect(getCursorVersion(state)).toBe(0);
  });
});

describe('pushCursorOverride', () => {
  it('adds an override that becomes the active cursor', () => {
    const state = createCursorState();
    pushCursorOverride(state, 'move', 'drag');
    expect(getActiveCursor(state)).toBe('move');
    expect(getCursorOverrideCount(state)).toBe(1);
    expect(getCursorVersion(state)).toBe(1);
  });

  it('stacks multiple overrides', () => {
    const state = createCursorState();
    pushCursorOverride(state, 'move', 'drag');
    pushCursorOverride(state, 'rotate', 'rotate-handle');
    expect(getActiveCursor(state)).toBe('rotate');
    expect(getCursorOverrideCount(state)).toBe(2);
  });
});

describe('popCursorOverride', () => {
  it('removes the override matching the source', () => {
    const state = createCursorState();
    pushCursorOverride(state, 'move', 'drag');
    pushCursorOverride(state, 'rotate', 'rotate-handle');
    const removed = popCursorOverride(state, 'drag');
    expect(removed).toBe(true);
    expect(getCursorOverrideCount(state)).toBe(1);
    expect(getActiveCursor(state)).toBe('rotate');
  });

  it('returns false when source not found', () => {
    const state = createCursorState();
    const removed = popCursorOverride(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getCursorVersion(state)).toBe(0);
  });

  it('removes the last matching override when duplicates exist', () => {
    const state = createCursorState();
    pushCursorOverride(state, 'move', 'drag');
    pushCursorOverride(state, 'grab', 'drag');
    popCursorOverride(state, 'drag');
    expect(getCursorOverrideCount(state)).toBe(1);
    expect(getActiveCursor(state)).toBe('move');
  });

  it('falls back to tool default when last override removed', () => {
    const state = createCursorState();
    setToolDefaultCursor(state, 'crosshair');
    pushCursorOverride(state, 'move', 'drag');
    popCursorOverride(state, 'drag');
    expect(getActiveCursor(state)).toBe('crosshair');
  });
});

describe('clearCursorOverrides', () => {
  it('removes all overrides', () => {
    const state = createCursorState();
    pushCursorOverride(state, 'move', 'drag');
    pushCursorOverride(state, 'rotate', 'handle');
    clearCursorOverrides(state);
    expect(getCursorOverrideCount(state)).toBe(0);
    expect(getActiveCursor(state)).toBe('default');
  });

  it('does not bump version when already empty', () => {
    const state = createCursorState();
    clearCursorOverrides(state);
    expect(getCursorVersion(state)).toBe(0);
  });
});

describe('getCursorOverrideCount', () => {
  it('is exported', () => expect(getCursorOverrideCount).toBeTypeOf('function'));
});

describe('getCursorVersion', () => {
  it('is exported', () => expect(getCursorVersion).toBeTypeOf('function'));
});
