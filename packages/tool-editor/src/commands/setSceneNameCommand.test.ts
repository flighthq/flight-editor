import { createSceneState, getSceneVersion, isSceneDirty, markSceneClean } from '@flighthq/editor-scene-state';
import { describe, expect, it } from 'vitest';

import { createSetSceneNameCommand } from './setSceneNameCommand';

describe('createSetSceneNameCommand', () => {
  it('sets the scene name and marks metadata dirty', () => {
    const state = createSceneState('Before');

    createSetSceneNameCommand(state, 'After').execute();

    expect(state.name).toBe('After');
    expect(isSceneDirty(state)).toBe(true);
    expect(getSceneVersion(state)).toBe(1);
  });

  it('restores the original name on undo', () => {
    const state = createSceneState('Before');
    const command = createSetSceneNameCommand(state, 'After');

    command.execute();
    command.undo();

    expect(state.name).toBe('Before');
    expect(getSceneVersion(state)).toBe(2);
  });

  it('is an identity operation when the name is unchanged', () => {
    const state = createSceneState('Same');
    const command = createSetSceneNameCommand(state, 'Same');

    command.execute();
    command.undo();

    expect(state.name).toBe('Same');
    expect(isSceneDirty(state)).toBe(false);
    expect(getSceneVersion(state)).toBe(0);
  });

  it('can execute again after undo', () => {
    const state = createSceneState('Before');
    const command = createSetSceneNameCommand(state, 'After');

    command.execute();
    markSceneClean(state);
    command.undo();
    markSceneClean(state);
    command.execute();

    expect(state.name).toBe('After');
    expect(isSceneDirty(state)).toBe(true);
  });
});
