import { describe, expect, it } from 'vitest';
import { createCommandHistory, executeCommand, undo } from '@flighthq/editor-command';

import { createPrototypeCommand } from './prototypeCommand';
import { addInteraction, createPrototypeState, getInteraction, reconnectInteraction } from './prototypeState';

describe('createPrototypeCommand', () => {
  it('undoes a wire reconnection without changing preview session state', () => {
    const state = createPrototypeState();
    addInteraction(state, {
      id: 'wire',
      sourceNodeId: 'a',
      trigger: 'click',
      action: 'navigate',
      targetNodeId: 'b',
      transition: 'instant',
      durationMs: 0,
    });
    state.previewActive = true;
    const history = createCommandHistory();
    executeCommand(
      history,
      createPrototypeCommand(state, 'Reconnect', (value) => {
        reconnectInteraction(value, 'wire', 'c');
      }),
    );
    undo(history);
    expect(getInteraction(state, 'wire')?.targetNodeId).toBe('b');
    expect(state.previewActive).toBe(true);
  });
});
