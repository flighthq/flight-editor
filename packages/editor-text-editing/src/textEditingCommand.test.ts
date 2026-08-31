import { describe, expect, it } from 'vitest';
import { createCommandHistory, executeCommand, redo, undo } from '@flighthq/editor-command';

import { createTextEditCommand } from './textEditingCommand';

describe('createTextEditCommand', () => {
  it('applies and reverses committed text through one command boundary', () => {
    let text = 'before';
    const revisions: number[] = [];
    const command = createTextEditCommand(
      { targetId: 'label', before: 'before', after: 'after', baseRevision: 4 },
      (_targetId, value, revision) => {
        text = value;
        revisions.push(revision);
      },
    );
    const history = createCommandHistory();
    executeCommand(history, command);
    expect(text).toBe('after');
    undo(history);
    expect(text).toBe('before');
    redo(history);
    expect(text).toBe('after');
    expect(revisions).toEqual([4, 4, 4]);
  });
});
