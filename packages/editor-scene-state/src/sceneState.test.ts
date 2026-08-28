import { describe, expect, it } from 'vitest';

import {
  createSceneState,
  getSceneVersion,
  isSceneDirty,
  markSceneClean,
  markSceneDirty,
  setSceneBackgroundColor,
  setSceneDimensions,
  setSceneName,
} from './sceneState';

describe('sceneState', () => {
  it('creates an untitled 800 by 600 scene by default', () => {
    const state = createSceneState();

    expect(state).toEqual({
      name: 'Untitled',
      width: 800,
      height: 600,
      backgroundColor: 0x000000ff,
      dirty: false,
      version: 0,
    });
  });

  it('accepts custom identity and dimensions', () => {
    const state = createSceneState('HUD', 1920, 1080);

    expect(state.name).toBe('HUD');
    expect(state.width).toBe(1920);
    expect(state.height).toBe(1080);
  });

  it('updates fields and marks the scene dirty', () => {
    const state = createSceneState();

    setSceneName(state, 'Level 1');
    setSceneDimensions(state, 1280, 720);
    setSceneBackgroundColor(state, 0xff0000ff);

    expect(state.name).toBe('Level 1');
    expect(state.width).toBe(1280);
    expect(state.height).toBe(720);
    expect(state.backgroundColor).toBe(0xff0000ff);
    expect(isSceneDirty(state)).toBe(true);
    expect(getSceneVersion(state)).toBe(3);
  });

  it('tracks explicit dirty and clean transitions', () => {
    const state = createSceneState();

    markSceneDirty(state);
    markSceneDirty(state);
    expect(isSceneDirty(state)).toBe(true);
    expect(getSceneVersion(state)).toBe(1);

    markSceneClean(state);
    markSceneClean(state);
    expect(isSceneDirty(state)).toBe(false);
    expect(getSceneVersion(state)).toBe(2);
  });

  it('does not increment the version for unchanged values', () => {
    const state = createSceneState();

    setSceneName(state, state.name);
    setSceneDimensions(state, state.width, state.height);
    setSceneBackgroundColor(state, state.backgroundColor);

    expect(getSceneVersion(state)).toBe(0);
  });
});
