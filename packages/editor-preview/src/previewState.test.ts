import { describe, expect, it } from 'vitest';

import {
  completePreviewOperation,
  createPreviewState,
  discardRuntimeOverrides,
  failPreviewOperation,
  getRuntimeOverrides,
  recordRuntimeOverride,
  requestPreviewPause,
  requestPreviewReload,
  requestPreviewRestart,
  requestPreviewResume,
  requestPreviewStart,
  requestPreviewStep,
  requestPreviewStop,
  takeRuntimeOverridesForApply,
} from './previewState';

const snapshot = { revision: 1, documentId: 'scene', value: { nodes: 2 } };

function runningState() {
  const state = createPreviewState<typeof snapshot.value>();
  const operation = requestPreviewStart(state, snapshot);
  completePreviewOperation(state, operation.id, 1);
  return state;
}

describe('createPreviewState', () => {
  it('starts fully stopped without runtime state', () => {
    expect(createPreviewState()).toMatchObject({ phase: 'stopped', pending: null, snapshot: null, version: 0 });
  });
});

describe('requestPreviewStart', () => {
  it('starts with a validated revision-stamped snapshot', () => {
    const state = createPreviewState();
    const operation = requestPreviewStart(state, snapshot);
    expect(operation).toMatchObject({ id: 1, kind: 'start', snapshot });
    expect(state.phase).toBe('starting');
    expect(() => requestPreviewStart(state, snapshot)).toThrow('while starting');
  });
});

describe('completePreviewOperation', () => {
  it('ignores stale acknowledgements and activates the matching operation', () => {
    const state = createPreviewState();
    const operation = requestPreviewStart(state, snapshot);
    expect(completePreviewOperation(state, operation.id + 1)).toBe(false);
    expect(completePreviewOperation(state, operation.id, 5)).toBe(true);
    expect(state).toMatchObject({ phase: 'running', runtimeRevision: 5, snapshot });
  });
});

describe('requestPreviewPause', () => {
  it('pauses only a running preview after acknowledgement', () => {
    const state = runningState();
    const operation = requestPreviewPause(state);
    completePreviewOperation(state, operation.id);
    expect(state.phase).toBe('paused');
  });
});

describe('requestPreviewResume', () => {
  it('resumes a paused preview', () => {
    const state = runningState();
    completePreviewOperation(state, requestPreviewPause(state).id);
    completePreviewOperation(state, requestPreviewResume(state).id);
    expect(state.phase).toBe('running');
  });
});

describe('requestPreviewStep', () => {
  it('steps by a positive duration and remains paused', () => {
    const state = runningState();
    completePreviewOperation(state, requestPreviewPause(state).id);
    const operation = requestPreviewStep(state, 16);
    expect(operation.stepMilliseconds).toBe(16);
    completePreviewOperation(state, operation.id);
    expect(state.phase).toBe('paused');
    expect(() => requestPreviewStep(state, 0)).toThrow('greater than zero');
  });
});

describe('requestPreviewReload', () => {
  it('accepts only a newer snapshot and replaces it on acknowledgement', () => {
    const state = runningState();
    expect(() => requestPreviewReload(state, snapshot)).toThrow('newer');
    const next = { ...snapshot, revision: 2 };
    completePreviewOperation(state, requestPreviewReload(state, next).id, 2);
    expect(state.snapshot?.revision).toBe(2);
  });
});

describe('requestPreviewRestart', () => {
  it('restarts from the current authored snapshot', () => {
    const state = runningState();
    const operation = requestPreviewRestart(state);
    expect(operation.snapshot).toEqual(snapshot);
    completePreviewOperation(state, operation.id);
    expect(state.phase).toBe('running');
  });
});

describe('requestPreviewStop', () => {
  it('disposes the runtime-facing state on acknowledgement', () => {
    const state = runningState();
    completePreviewOperation(state, requestPreviewStop(state).id);
    expect(state).toMatchObject({ phase: 'stopped', snapshot: null, runtimeRevision: null });
  });
});

describe('failPreviewOperation', () => {
  it('distinguishes transport disconnects and ignores stale failures', () => {
    const state = createPreviewState();
    const operation = requestPreviewStart(state, snapshot);
    expect(failPreviewOperation(state, 99, 'stale')).toBe(false);
    expect(failPreviewOperation(state, operation.id, 'socket closed', true)).toBe(true);
    expect(state).toMatchObject({ phase: 'disconnected', lastError: 'socket closed' });
  });
});

describe('recordRuntimeOverride', () => {
  it('tracks only runtime values differing from authored values', () => {
    const state = runningState();
    recordRuntimeOverride(state, { targetId: 'node', property: 'x', authoredValue: 1, runtimeValue: 2 });
    recordRuntimeOverride(state, { targetId: 'node', property: 'x', authoredValue: 1, runtimeValue: 1 });
    expect(getRuntimeOverrides(state)).toEqual([]);
  });
});

describe('getRuntimeOverrides', () => {
  it('returns deterministic target/property order', () => {
    const state = runningState();
    recordRuntimeOverride(state, { targetId: 'z', property: 'x', authoredValue: 0, runtimeValue: 1 });
    recordRuntimeOverride(state, { targetId: 'a', property: 'y', authoredValue: 0, runtimeValue: 1 });
    expect(getRuntimeOverrides(state).map(({ targetId }) => targetId)).toEqual(['a', 'z']);
  });
});

describe('takeRuntimeOverridesForApply', () => {
  it('selectively removes and returns overrides for command generation', () => {
    const state = runningState();
    recordRuntimeOverride(state, { targetId: 'a', property: 'x', authoredValue: 0, runtimeValue: 1 });
    recordRuntimeOverride(state, { targetId: 'b', property: 'x', authoredValue: 0, runtimeValue: 2 });
    expect(takeRuntimeOverridesForApply(state, new Set(['a\0x']))).toHaveLength(1);
    expect(getRuntimeOverrides(state).map(({ targetId }) => targetId)).toEqual(['b']);
  });
});

describe('discardRuntimeOverrides', () => {
  it('clears runtime drafts without touching the authored snapshot', () => {
    const state = runningState();
    recordRuntimeOverride(state, { targetId: 'a', property: 'x', authoredValue: 0, runtimeValue: 1 });
    expect(discardRuntimeOverrides(state)).toBe(true);
    expect(discardRuntimeOverrides(state)).toBe(false);
    expect(state.snapshot).toEqual(snapshot);
  });
});
