import { describe, expect, it } from 'vitest';

import type { CoalescingCommand, Command } from './commandHistory';

import {
  clearCommandHistory,
  createCommandHistory,
  createSnapshotCommand,
  createCommandBatch,
  executeCoalescingCommand,
  executeCommand,
  executeCommandBatch,
  getCommandHistoryRedoCount,
  getCommandHistoryRedoLabel,
  getCommandHistoryUndoCount,
  getCommandHistoryUndoLabel,
  isCommandHistoryClean,
  markCommandHistoryClean,
  redo,
  undo,
} from './commandHistory';

function createTestCommand(label: string, state: { value: number }, newValue: number): Command {
  const oldValue = state.value;
  return {
    label,
    execute() {
      state.value = newValue;
    },
    undo() {
      state.value = oldValue;
    },
  };
}

describe('getCommandHistoryRedoCount', () => {
  it('is exported', () => expect(getCommandHistoryRedoCount).toBeTypeOf('function'));
});

describe('getCommandHistoryUndoCount', () => {
  it('is exported', () => expect(getCommandHistoryUndoCount).toBeTypeOf('function'));
});

describe('markCommandHistoryClean', () => {
  it('is exported', () => expect(markCommandHistoryClean).toBeTypeOf('function'));
});

describe('clearCommandHistory', () => {
  it('empties both stacks', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    clearCommandHistory(history);
    expect(getCommandHistoryUndoCount(history)).toBe(0);
    expect(getCommandHistoryRedoCount(history)).toBe(0);
  });
});

describe('createCommandHistory', () => {
  it('starts empty and clean', () => {
    const history = createCommandHistory();
    expect(getCommandHistoryUndoCount(history)).toBe(0);
    expect(getCommandHistoryRedoCount(history)).toBe(0);
    expect(isCommandHistoryClean(history)).toBe(true);
  });
});

describe('executeCommand', () => {
  it('runs the command and pushes to undo stack', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    expect(state.value).toBe(1);
    expect(getCommandHistoryUndoCount(history)).toBe(1);
  });

  it('does not record a command whose execution fails', () => {
    const history = createCommandHistory();
    expect(() =>
      executeCommand(history, {
        label: 'fail',
        execute: () => {
          throw new Error('no');
        },
        undo() {},
      }),
    ).toThrow('no');
    expect(getCommandHistoryUndoCount(history)).toBe(0);
  });

  it('clears redo stack', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    undo(history);
    expect(getCommandHistoryRedoCount(history)).toBe(1);
    executeCommand(history, createTestCommand('set 2', state, 2));
    expect(getCommandHistoryRedoCount(history)).toBe(0);
  });
});

describe('getCommandHistoryRedoLabel', () => {
  it('returns null when redo stack is empty', () => {
    expect(getCommandHistoryRedoLabel(createCommandHistory())).toBeNull();
  });

  it('returns label of top redo command', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    undo(history);
    expect(getCommandHistoryRedoLabel(history)).toBe('set 1');
  });
});

describe('getCommandHistoryUndoLabel', () => {
  it('returns null when undo stack is empty', () => {
    expect(getCommandHistoryUndoLabel(createCommandHistory())).toBeNull();
  });

  it('returns label of top undo command', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    expect(getCommandHistoryUndoLabel(history)).toBe('set 1');
  });
});

describe('isCommandHistoryClean', () => {
  it('is dirty after execute', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    expect(isCommandHistoryClean(history)).toBe(false);
  });

  it('cannot become falsely clean after branching away from saved history', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    executeCommand(history, createTestCommand('b', state, 2));
    markCommandHistoryClean(history);
    undo(history);
    executeCommand(history, createTestCommand('replacement', state, 3));
    expect(isCommandHistoryClean(history)).toBe(false);
  });

  it('returns clean after mark and no further edits', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    markCommandHistoryClean(history);
    expect(isCommandHistoryClean(history)).toBe(true);
  });

  it('becomes dirty again after undo past clean point', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    markCommandHistoryClean(history);
    undo(history);
    expect(isCommandHistoryClean(history)).toBe(false);
  });
});

describe('redo', () => {
  it('returns false when nothing to redo', () => {
    expect(redo(createCommandHistory())).toBe(false);
  });

  it('re-executes the command', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    undo(history);
    expect(state.value).toBe(0);
    expect(redo(history)).toBe(true);
    expect(state.value).toBe(1);
  });
});

describe('undo', () => {
  it('returns false when nothing to undo', () => {
    expect(undo(createCommandHistory())).toBe(false);
  });

  it('retains history when command rollback fails', () => {
    const history = createCommandHistory();
    executeCommand(history, {
      label: 'fragile',
      execute() {},
      undo() {
        throw new Error('blocked');
      },
    });
    expect(() => undo(history)).toThrow('blocked');
    expect(getCommandHistoryUndoCount(history)).toBe(1);
    expect(getCommandHistoryRedoCount(history)).toBe(0);
  });

  it('reverses the command', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    expect(undo(history)).toBe(true);
    expect(state.value).toBe(0);
    expect(getCommandHistoryRedoCount(history)).toBe(1);
  });

  it('handles multiple undo/redo cycles', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('set 1', state, 1));
    executeCommand(history, createTestCommand('set 2', state, 2));
    undo(history);
    expect(state.value).toBe(1);
    undo(history);
    expect(state.value).toBe(0);
    redo(history);
    expect(state.value).toBe(1);
  });
});

describe('createCommandBatch', () => {
  it('executes in order, undoes in reverse, and rolls back partial failures', () => {
    const values: number[] = [];
    const command = (value: number): Command => ({
      label: `add ${value}`,
      execute: () => {
        values.push(value);
      },
      undo: () => {
        values.pop();
      },
    });
    const batch = createCommandBatch('Add values', [command(1), command(2)]);
    batch.execute();
    expect(values).toEqual([1, 2]);
    batch.undo();
    expect(values).toEqual([]);
    const failure = createCommandBatch('Fail', [
      command(1),
      {
        label: 'explode',
        execute: () => {
          throw new Error('boom');
        },
        undo() {},
      },
    ]);
    expect(() => failure.execute()).toThrow('boom');
    expect(values).toEqual([]);
  });
});

describe('executeCommandBatch', () => {
  it('records a non-empty batch as one undo boundary', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    expect(
      executeCommandBatch(history, 'Set twice', [
        createTestCommand('one', state, 1),
        createTestCommand('two', state, 2),
      ]),
    ).toBe(true);
    expect(getCommandHistoryUndoCount(history)).toBe(1);
    undo(history);
    expect(state.value).toBe(0);
    expect(executeCommandBatch(history, 'Empty', [])).toBe(false);
  });
});

describe('executeCoalescingCommand', () => {
  it('merges compatible continuous edits into one undo boundary', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    const make = (before: number, after: number): CoalescingCommand =>
      ({
        label: 'Change value',
        coalesceKey: 'node.x',
        execute: () => {
          state.value = after;
        },
        undo: () => {
          state.value = before;
        },
        mergeWith(next) {
          return make(before, (next as CoalescingCommand & { readonly after?: number }).after ?? state.value);
        },
        after,
      }) as CoalescingCommand & { readonly after: number };
    executeCoalescingCommand(history, make(0, 1));
    executeCoalescingCommand(history, make(1, 2));
    expect(state.value).toBe(2);
    expect(getCommandHistoryUndoCount(history)).toBe(1);
    undo(history);
    expect(state.value).toBe(0);
  });
});

describe('createSnapshotCommand', () => {
  it('captures once, restores on undo/redo, and rolls back failed mutations', () => {
    const state = { value: 0 };
    const adapter = {
      capture: () => state.value,
      restore: (value: number) => {
        state.value = value;
      },
    };
    const command = createSnapshotCommand('Set value', adapter, () => {
      state.value = 5;
    });
    command.execute();
    command.undo();
    expect(state.value).toBe(0);
    command.execute();
    expect(state.value).toBe(5);
    const failing = createSnapshotCommand('Fail', adapter, () => {
      state.value = 10;
      throw new Error('no');
    });
    expect(() => failing.execute()).toThrow('no');
    expect(state.value).toBe(5);
  });
});

describe('isCommandHistoryClean — advanced', () => {
  it('returns clean after undo back to clean point then redo', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    markCommandHistoryClean(history);
    undo(history);
    redo(history);
    expect(isCommandHistoryClean(history)).toBe(true);
  });

  it('becomes dirty after redo past clean point', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    markCommandHistoryClean(history);
    executeCommand(history, createTestCommand('a', state, 1));
    undo(history);
    expect(isCommandHistoryClean(history)).toBe(true);
    redo(history);
    expect(isCommandHistoryClean(history)).toBe(false);
  });
});

describe('clearCommandHistory — clean tracking', () => {
  it('resets to clean after clear', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('a', state, 1));
    markCommandHistoryClean(history);
    executeCommand(history, createTestCommand('b', state, 2));
    clearCommandHistory(history);
    expect(isCommandHistoryClean(history)).toBe(true);
  });
});

describe('getCommandHistoryUndoLabel / getCommandHistoryRedoLabel — transitions', () => {
  it('labels shift through undo/redo', () => {
    const history = createCommandHistory();
    const state = { value: 0 };
    executeCommand(history, createTestCommand('first', state, 1));
    executeCommand(history, createTestCommand('second', state, 2));
    expect(getCommandHistoryUndoLabel(history)).toBe('second');
    undo(history);
    expect(getCommandHistoryUndoLabel(history)).toBe('first');
    expect(getCommandHistoryRedoLabel(history)).toBe('second');
    undo(history);
    expect(getCommandHistoryUndoLabel(history)).toBeNull();
    expect(getCommandHistoryRedoLabel(history)).toBe('first');
  });
});
