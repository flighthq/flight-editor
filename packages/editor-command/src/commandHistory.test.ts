import { describe, expect, it } from 'vitest';

import type { Command } from './commandHistory';

import {
  clearCommandHistory,
  createCommandHistory,
  executeCommand,
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
