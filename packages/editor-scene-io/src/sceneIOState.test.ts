import { describe, expect, it } from 'vitest';

import type { Scene2D } from '@flighthq/types';

import {
  completeLoad,
  completeSave,
  createSceneIOState,
  failLoad,
  failSave,
  getLoadError,
  getSaveError,
  getSceneIOVersion,
  isLoading,
  isSaving,
  startLoad,
  startSave,
} from './sceneIOState';

function scene(): Scene2D {
  return {} as Scene2D;
}

describe('createSceneIOState', () => {
  it('starts idle with the Flight format selected and no errors', () => {
    const state = createSceneIOState();
    expect(state).toEqual({
      pendingLoad: null,
      pendingSave: null,
      loadedScene: null,
      loadError: null,
      saveError: null,
      format: 'flight',
      version: 0,
    });
  });
});

describe('startLoad', () => {
  it('starts a formatted load, clears its prior error, and guards an identical pending operation', () => {
    const state = createSceneIOState();
    startLoad(state, 'json');
    startLoad(state, 'json');
    expect(state.pendingLoad).toEqual({ format: 'json' });
    expect(state.format).toBe('json');
    expect(getSceneIOVersion(state)).toBe(1);

    failLoad(state, 'Invalid scene');
    startLoad(state);
    expect(getLoadError(state)).toBeNull();
    expect(state.pendingLoad).toEqual({ format: 'json' });
  });
});

describe('completeLoad', () => {
  it('stores the loaded scene, finishes the operation, and ignores completion while idle', () => {
    const state = createSceneIOState();
    const result = scene();
    completeLoad(state, result);
    startLoad(state);
    completeLoad(state, result);
    expect(isLoading(state)).toBe(false);
    expect(state.loadedScene).toBe(result);
    expect(getSceneIOVersion(state)).toBe(2);
  });
});

describe('failLoad', () => {
  it('records the last load error, finishes the operation, and ignores failure while idle', () => {
    const state = createSceneIOState();
    failLoad(state, 'Ignored');
    startLoad(state, 'binary');
    failLoad(state, 'Unsupported input');
    expect(isLoading(state)).toBe(false);
    expect(getLoadError(state)).toBe('Unsupported input');
    expect(getSceneIOVersion(state)).toBe(2);
  });
});

describe('startSave', () => {
  it('starts a formatted save, clears its prior error, and guards an identical pending operation', () => {
    const state = createSceneIOState();
    const input = scene();
    startSave(state, input, 'binary');
    startSave(state, input, 'binary');
    expect(state.pendingSave).toEqual({ scene: input, format: 'binary' });
    expect(state.format).toBe('binary');
    expect(getSceneIOVersion(state)).toBe(1);

    failSave(state, 'Disk full');
    startSave(state, input);
    expect(getSaveError(state)).toBeNull();
  });
});

describe('completeSave', () => {
  it('finishes a pending save and ignores completion while idle', () => {
    const state = createSceneIOState();
    completeSave(state);
    startSave(state, scene());
    completeSave(state);
    expect(isSaving(state)).toBe(false);
    expect(getSaveError(state)).toBeNull();
    expect(getSceneIOVersion(state)).toBe(2);
  });
});

describe('failSave', () => {
  it('records the last save error, finishes the operation, and ignores failure while idle', () => {
    const state = createSceneIOState();
    failSave(state, 'Ignored');
    startSave(state, scene());
    failSave(state, 'Permission denied');
    expect(isSaving(state)).toBe(false);
    expect(getSaveError(state)).toBe('Permission denied');
    expect(getSceneIOVersion(state)).toBe(2);
  });
});

describe('getLoadError', () => {
  it('returns null initially and the most recent load failure', () => {
    const state = createSceneIOState();
    expect(getLoadError(state)).toBeNull();
    startLoad(state);
    failLoad(state, 'Malformed document');
    expect(getLoadError(state)).toBe('Malformed document');
  });
});

describe('getSaveError', () => {
  it('returns null initially and the most recent save failure', () => {
    const state = createSceneIOState();
    expect(getSaveError(state)).toBeNull();
    startSave(state, scene());
    failSave(state, 'Write failed');
    expect(getSaveError(state)).toBe('Write failed');
  });
});

describe('isLoading', () => {
  it('reports whether a load operation is pending', () => {
    const state = createSceneIOState();
    expect(isLoading(state)).toBe(false);
    startLoad(state);
    expect(isLoading(state)).toBe(true);
    completeLoad(state, scene());
    expect(isLoading(state)).toBe(false);
  });
});

describe('isSaving', () => {
  it('reports whether a save operation is pending', () => {
    const state = createSceneIOState();
    expect(isSaving(state)).toBe(false);
    startSave(state, scene());
    expect(isSaving(state)).toBe(true);
    completeSave(state);
    expect(isSaving(state)).toBe(false);
  });
});

describe('getSceneIOVersion', () => {
  it('tracks load and save starts, completions, and failures independently', () => {
    const state = createSceneIOState();
    startLoad(state);
    completeLoad(state, scene());
    startSave(state, scene());
    failSave(state, 'Write failed');
    expect(getSceneIOVersion(state)).toBe(4);
  });
});
