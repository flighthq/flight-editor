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

describe('getSceneVersion', () => {
  it('is exported', () => expect(getSceneVersion).toBeTypeOf('function'));
});

describe('isSceneDirty', () => {
  it('is exported', () => expect(isSceneDirty).toBeTypeOf('function'));
});

describe('markSceneClean', () => {
  it('is exported', () => expect(markSceneClean).toBeTypeOf('function'));
});

describe('markSceneDirty', () => {
  it('is exported', () => expect(markSceneDirty).toBeTypeOf('function'));
});

describe('setSceneBackgroundColor', () => {
  it('is exported', () => expect(setSceneBackgroundColor).toBeTypeOf('function'));
});

describe('setSceneDimensions', () => {
  it('is exported', () => expect(setSceneDimensions).toBeTypeOf('function'));
});

describe('setSceneName', () => {
  it('is exported', () => expect(setSceneName).toBeTypeOf('function'));
});

describe('createSceneState', () => {
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

  it('starts clean', () => {
    const state = createSceneState();

    expect(isSceneDirty(state)).toBe(false);
    expect(getSceneVersion(state)).toBe(0);
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

  it('stores packed colors as unsigned 32-bit values', () => {
    const state = createSceneState();

    setSceneBackgroundColor(state, -1);

    expect(state.backgroundColor).toBe(0xffffffff);
    expect(state.backgroundColor).toBeGreaterThan(0);
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

  it('does not increment the version for an unchanged name', () => {
    const state = createSceneState();

    setSceneName(state, state.name);

    expect(getSceneVersion(state)).toBe(0);
    expect(isSceneDirty(state)).toBe(false);
  });

  it('does not increment the version for unchanged dimensions', () => {
    const state = createSceneState();

    setSceneDimensions(state, state.width, state.height);

    expect(getSceneVersion(state)).toBe(0);
    expect(isSceneDirty(state)).toBe(false);
  });

  it('does not increment the version for an unchanged background color', () => {
    const state = createSceneState();

    setSceneBackgroundColor(state, state.backgroundColor);

    expect(getSceneVersion(state)).toBe(0);
  });

  it('does not increment the version when marking an already dirty scene dirty', () => {
    const state = createSceneState();
    markSceneDirty(state);

    markSceneDirty(state);

    expect(getSceneVersion(state)).toBe(1);
  });

  it('does not increment the version when marking an already clean scene clean', () => {
    const state = createSceneState();

    markSceneClean(state);

    expect(getSceneVersion(state)).toBe(0);
  });

  it('increments once for every meaningful operation', () => {
    const state = createSceneState();

    setSceneName(state, 'Level 1');
    markSceneClean(state);
    setSceneDimensions(state, 1024, 768);
    setSceneBackgroundColor(state, 0x123456ff);
    markSceneClean(state);

    expect(getSceneVersion(state)).toBe(5);
    expect(isSceneDirty(state)).toBe(false);
  });
});
