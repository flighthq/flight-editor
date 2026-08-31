import { describe, expect, it } from 'vitest';
import { createCommandHistory, executeCommand, undo } from '@flighthq/editor-command';

import { createComponentCommand } from './componentCommand';
import {
  addComponentInstance,
  createComponentState,
  getComponentInstance,
  swapComponentInstance,
} from './componentState';

describe('createComponentCommand', () => {
  it('undoes an instance swap and override reset atomically', () => {
    const state = createComponentState();
    addComponentInstance(state, {
      instanceId: 'instance',
      definitionId: 'a',
      overrides: [{ propertyPath: 'text', value: 'Buy' }],
    });
    const history = createCommandHistory();
    executeCommand(
      history,
      createComponentCommand(state, 'Swap component', (value) => {
        swapComponentInstance(value, 'instance', 'b', false);
      }),
    );
    expect(getComponentInstance(state, 'instance')).toMatchObject({ definitionId: 'b', overrides: [] });
    undo(history);
    expect(getComponentInstance(state, 'instance')).toMatchObject({
      definitionId: 'a',
      overrides: [{ propertyPath: 'text', value: 'Buy' }],
    });
  });
});
