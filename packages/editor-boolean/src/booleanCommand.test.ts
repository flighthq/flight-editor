import { describe, expect, it } from 'vitest';
import { createCommandHistory, executeCommand, undo } from '@flighthq/editor-command';

import { createBooleanCommand } from './booleanCommand';
import { addBooleanEntry, createBooleanState, getBooleanEntry, replaceBooleanEntry } from './booleanState';

describe('createBooleanCommand', () => {
  it('restores compound operation and ordered operands as one boundary', () => {
    const state = createBooleanState();
    addBooleanEntry(state, {
      resultNodeId: 'result',
      operation: 'union',
      operands: [
        { nodeId: 'a', order: 0 },
        { nodeId: 'b', order: 1 },
      ],
    });
    const history = createCommandHistory();
    executeCommand(
      history,
      createBooleanCommand(state, 'Subtract', (value) => {
        replaceBooleanEntry(value, {
          resultNodeId: 'result',
          operation: 'subtract',
          operands: [
            { nodeId: 'b', order: 0 },
            { nodeId: 'a', order: 1 },
          ],
        });
      }),
    );
    undo(history);
    expect(getBooleanEntry(state, 'result')).toMatchObject({
      operation: 'union',
      operands: [
        { nodeId: 'a', order: 0 },
        { nodeId: 'b', order: 1 },
      ],
    });
  });
});
