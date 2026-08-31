import { describe, expect, it } from 'vitest';

import {
  beginGesture,
  cancelGesture,
  commitGesture,
  createGestureState,
  getActiveGesture,
  interruptGesture,
  previewGesture,
} from './gestureState';

describe('createGestureState', () => {
  it('starts inactive with a stable sequence', () =>
    expect(createGestureState()).toEqual({ active: null, sequence: 0, version: 0 }));
});

describe('beginGesture', () => {
  it('allocates unique IDs and rejects overlapping gestures', () => {
    const state = createGestureState<number>();
    const id = beginGesture(state, 'move', 4);
    expect(id).toBe('move:1');
    expect(() => beginGesture(state, 'scale', 1)).toThrow(/active/);
    cancelGesture(state, id);
    expect(beginGesture(state, 'move', 0)).toBe('move:2');
  });
});

describe('previewGesture', () => {
  it('tracks latest preview and count while validating ownership', () => {
    const state = createGestureState<number>();
    const id = beginGesture(state, 'move', 0);
    previewGesture(state, id, 1);
    previewGesture(state, id, 2);
    expect(getActiveGesture(state)).toMatchObject({ latest: 2, previewCount: 2 });
    expect(() => previewGesture(state, 'stale', 3)).toThrow();
  });
});

describe('commitGesture', () => {
  it('commits the latest or explicit final value and closes the transaction', () => {
    const state = createGestureState<number>();
    const id = beginGesture(state, 'rotate', 0);
    previewGesture(state, id, 40);
    expect(commitGesture(state, id, 45)).toEqual({
      id,
      kind: 'rotate',
      initial: 0,
      final: 45,
      previewCount: 1,
      reason: 'commit',
    });
    expect(getActiveGesture(state)).toBeNull();
  });
});

describe('cancelGesture', () => {
  it('returns the initial state for exact rollback', () => {
    const state = createGestureState<{ x: number }>();
    const id = beginGesture(state, 'move', { x: 1 });
    previewGesture(state, id, { x: 9 });
    expect(cancelGesture(state, id).final).toEqual({ x: 1 });
  });
});

describe('interruptGesture', () => {
  it('is a no-op while idle and classifies forced cancellation', () => {
    const state = createGestureState<number>();
    expect(interruptGesture(state, 'focus-loss')).toBeNull();
    beginGesture(state, 'scrub', 2);
    expect(interruptGesture(state, 'document-replaced')?.reason).toBe('document-replaced');
  });
});

describe('getActiveGesture', () => {
  it('returns the active transaction', () => {
    const state = createGestureState<number>();
    beginGesture(state, 'move', 0);
    expect(getActiveGesture(state)?.kind).toBe('move');
  });
});
