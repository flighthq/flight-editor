import { describe, expect, it } from 'vitest';

import {
  beginTextEditing,
  clearTextSelection,
  createTextEditingState,
  endTextEditing,
  getCaretPosition,
  getTextEditingTargetId,
  getTextEditingVersion,
  getTextSelection,
  hasTextSelection,
  isComposing,
  isTextEditingActive,
  setCaretPosition,
  setComposing,
  setTextSelection,
} from './textEditingState';

describe('createTextEditingState', () => {
  it('starts inactive', () => {
    const state = createTextEditingState();
    expect(isTextEditingActive(state)).toBe(false);
    expect(getTextEditingTargetId(state)).toBeNull();
    expect(getCaretPosition(state)).toBe(0);
    expect(getTextSelection(state)).toBeNull();
    expect(isComposing(state)).toBe(false);
    expect(getTextEditingVersion(state)).toBe(0);
  });
});

describe('isTextEditingActive', () => {
  it('is exported', () => expect(isTextEditingActive).toBeTypeOf('function'));
});

describe('getTextEditingTargetId', () => {
  it('is exported', () => expect(getTextEditingTargetId).toBeTypeOf('function'));
});

describe('beginTextEditing', () => {
  it('activates text editing on a target', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-node-1', 5);
    expect(isTextEditingActive(state)).toBe(true);
    expect(getTextEditingTargetId(state)).toBe('text-node-1');
    expect(getCaretPosition(state)).toBe(5);
    expect(getTextSelection(state)).toBeNull();
    expect(getTextEditingVersion(state)).toBe(1);
  });

  it('clears any existing selection', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 2, 8);
    beginTextEditing(state, 'text-2', 3);
    expect(getTextSelection(state)).toBeNull();
    expect(getTextEditingTargetId(state)).toBe('text-2');
  });
});

describe('endTextEditing', () => {
  it('deactivates text editing and resets state', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 5);
    setTextSelection(state, 2, 8);
    endTextEditing(state);
    expect(isTextEditingActive(state)).toBe(false);
    expect(getTextEditingTargetId(state)).toBeNull();
    expect(getCaretPosition(state)).toBe(0);
    expect(getTextSelection(state)).toBeNull();
  });

  it('does not bump version when already inactive', () => {
    const state = createTextEditingState();
    endTextEditing(state);
    expect(getTextEditingVersion(state)).toBe(0);
  });
});

describe('getCaretPosition', () => {
  it('is exported', () => expect(getCaretPosition).toBeTypeOf('function'));
});

describe('setCaretPosition', () => {
  it('moves the caret and clears any selection', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 2, 5);
    setCaretPosition(state, 10);
    expect(getCaretPosition(state)).toBe(10);
    expect(getTextSelection(state)).toBeNull();
  });

  it('does not bump version when position unchanged and no selection', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 5);
    const v = getTextEditingVersion(state);
    setCaretPosition(state, 5);
    expect(getTextEditingVersion(state)).toBe(v);
  });
});

describe('getTextSelection', () => {
  it('is exported', () => expect(getTextSelection).toBeTypeOf('function'));
});

describe('setTextSelection', () => {
  it('sets a text selection range', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 3, 10);
    const sel = getTextSelection(state);
    expect(sel).toEqual({ start: 3, end: 10 });
    expect(getCaretPosition(state)).toBe(10);
  });

  it('normalizes reversed ranges', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 10, 3);
    const sel = getTextSelection(state);
    expect(sel).toEqual({ start: 3, end: 10 });
    expect(getCaretPosition(state)).toBe(3);
  });
});

describe('clearTextSelection', () => {
  it('clears the selection', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 2, 5);
    clearTextSelection(state);
    expect(getTextSelection(state)).toBeNull();
    expect(hasTextSelection(state)).toBe(false);
  });

  it('does not bump version when already cleared', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    const v = getTextEditingVersion(state);
    clearTextSelection(state);
    expect(getTextEditingVersion(state)).toBe(v);
  });
});

describe('hasTextSelection', () => {
  it('returns false for no selection', () => {
    const state = createTextEditingState();
    expect(hasTextSelection(state)).toBe(false);
  });

  it('returns false for collapsed selection', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 5, 5);
    expect(hasTextSelection(state)).toBe(false);
  });

  it('returns true for non-collapsed selection', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setTextSelection(state, 2, 8);
    expect(hasTextSelection(state)).toBe(true);
  });
});

describe('isComposing', () => {
  it('is exported', () => expect(isComposing).toBeTypeOf('function'));
});

describe('setComposing', () => {
  it('toggles IME composition state', () => {
    const state = createTextEditingState();
    beginTextEditing(state, 'text-1', 0);
    setComposing(state, true);
    expect(isComposing(state)).toBe(true);
    setComposing(state, false);
    expect(isComposing(state)).toBe(false);
  });

  it('does not bump version when value unchanged', () => {
    const state = createTextEditingState();
    const v = getTextEditingVersion(state);
    setComposing(state, false);
    expect(getTextEditingVersion(state)).toBe(v);
  });
});

describe('getTextEditingVersion', () => {
  it('is exported', () => expect(getTextEditingVersion).toBeTypeOf('function'));
});
