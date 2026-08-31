import { describe, expect, it } from 'vitest';
import { executeCommand, redo, undo } from '@flighthq/editor-command';

import { createAnimationCommand } from './animationCommand';
import { addKeyframe, createAnimationState, deleteTime, getKeyframe } from './animationState';
import { createCommandHistory } from '@flighthq/editor-command';

describe('createAnimationCommand', () => {
  it('restores an exact authored timeline while preserving session playhead state', () => {
    const state = createAnimationState();
    addKeyframe(state, { id: 'a', nodeId: 'n', property: 'x', time: 100, value: 1, easing: 'linear' });
    state.playheadTime = 50;
    const history = createCommandHistory();
    executeCommand(
      history,
      createAnimationCommand(state, 'Delete time', (value) => deleteTime(value, 0, 200)),
    );
    expect(getKeyframe(state, 'a')).toBeUndefined();
    state.playheadTime = 25;
    undo(history);
    expect(getKeyframe(state, 'a')?.time).toBe(100);
    expect(state.playheadTime).toBe(25);
    redo(history);
    expect(getKeyframe(state, 'a')).toBeUndefined();
  });
});
