import { describe, expect, it } from 'vitest';

import {
  addCheckpoint,
  clearCheckpoints,
  createHistoryState,
  getCheckpoint,
  getCheckpointCount,
  getCheckpoints,
  getHistoryVersion,
  removeCheckpoint,
} from './historyState';

describe('historyState', () => {
  it('starts empty at version zero', () => {
    const state = createHistoryState();

    expect(getCheckpoints(state)).toEqual([]);
    expect(getCheckpointCount(state)).toBe(0);
    expect(getHistoryVersion(state)).toBe(0);
  });

  it('adds a labeled checkpoint and returns its id', () => {
    const state = createHistoryState();
    const data = { frame: 12 };

    const id = addCheckpoint(state, 'Before tween', data);

    expect(id).toBe(1);
    expect(getCheckpoint(state, id)).toEqual({ id, label: 'Before tween', data });
  });

  it('assigns unique monotonically increasing ids', () => {
    const state = createHistoryState();

    const first = addCheckpoint(state, 'First', null);
    const second = addCheckpoint(state, 'Second', null);
    const third = addCheckpoint(state, 'Third', null);

    expect([first, second, third]).toEqual([1, 2, 3]);
  });

  it('returns checkpoints in insertion order', () => {
    const state = createHistoryState();
    addCheckpoint(state, 'First', 1);
    addCheckpoint(state, 'Second', 2);
    addCheckpoint(state, 'Third', 3);

    expect(getCheckpoints(state).map((checkpoint) => checkpoint.label)).toEqual(['First', 'Second', 'Third']);
  });

  it('retains arbitrary snapshot data by reference', () => {
    const state = createHistoryState();
    const data = { nodes: [{ id: 'hero' }] };
    const id = addCheckpoint(state, 'Scene snapshot', data);

    expect(getCheckpoint(state, id)?.data).toBe(data);
  });

  it('returns undefined for an unknown checkpoint id', () => {
    expect(getCheckpoint(createHistoryState(), 999)).toBeUndefined();
  });

  it('removes a checkpoint and returns true', () => {
    const state = createHistoryState();
    const first = addCheckpoint(state, 'First', 1);
    const second = addCheckpoint(state, 'Second', 2);

    expect(removeCheckpoint(state, first)).toBe(true);
    expect(getCheckpoint(state, first)).toBeUndefined();
    expect(getCheckpoint(state, second)?.label).toBe('Second');
    expect(getCheckpointCount(state)).toBe(1);
  });

  it('returns false without a version bump when removing a missing id', () => {
    const state = createHistoryState();

    expect(removeCheckpoint(state, 999)).toBe(false);
    expect(getHistoryVersion(state)).toBe(0);
  });

  it('removes the requested checkpoint without reordering the rest', () => {
    const state = createHistoryState();
    addCheckpoint(state, 'First', 1);
    const second = addCheckpoint(state, 'Second', 2);
    addCheckpoint(state, 'Third', 3);

    removeCheckpoint(state, second);

    expect(getCheckpoints(state).map((checkpoint) => checkpoint.label)).toEqual(['First', 'Third']);
  });

  it('clears every checkpoint with one version increment', () => {
    const state = createHistoryState();
    addCheckpoint(state, 'First', 1);
    addCheckpoint(state, 'Second', 2);

    clearCheckpoints(state);

    expect(getCheckpointCount(state)).toBe(0);
    expect(getHistoryVersion(state)).toBe(3);
  });

  it('does not increment the version when clearing an empty history', () => {
    const state = createHistoryState();

    clearCheckpoints(state);

    expect(getHistoryVersion(state)).toBe(0);
  });

  it('does not reuse ids after clearing checkpoints', () => {
    const state = createHistoryState();
    addCheckpoint(state, 'First', null);
    addCheckpoint(state, 'Second', null);
    clearCheckpoints(state);

    expect(addCheckpoint(state, 'Third', null)).toBe(3);
  });

  it('increments the version once per meaningful mutation', () => {
    const state = createHistoryState();
    const first = addCheckpoint(state, 'First', null);
    const second = addCheckpoint(state, 'Second', null);
    removeCheckpoint(state, first);
    removeCheckpoint(state, first);
    removeCheckpoint(state, second);

    expect(getHistoryVersion(state)).toBe(4);
  });
});
