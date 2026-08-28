import type { Command } from '@flighthq/editor-command';

import { redo, undo } from '@flighthq/editor-command';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import {
  batchCommands,
  canRedo,
  canUndo,
  clearHistory,
  executeCommand,
  getRedoCount,
  getRedoLabel,
  getUndoCount,
  getUndoLabel,
  redoCommand,
  undoCommand,
} from './historyUtils';

function command(label: string, events: string[] = []): Command {
  return {
    label,
    execute: vi.fn(() => events.push(`execute:${label}`)),
    undo: vi.fn(() => events.push(`undo:${label}`)),
  };
}

describe('executeCommand', () => {
  it('executes through history and marks editor scene state dirty', () => {
    const editor = createEditorState();
    const entry = command('Move');
    executeCommand(editor, entry);
    expect(entry.execute).toHaveBeenCalledOnce();
    expect(editor.commandHistory.undoStack).toEqual([entry]);
    expect(editor.sceneState.dirty).toBe(true);
  });
});

describe('batchCommands', () => {
  it('executes in input order, undoes in reverse order, and snapshots the input', () => {
    const events: string[] = [];
    const entries = [command('A', events), command('B', events)];
    const batch = batchCommands(entries, 'Batch');
    entries.length = 0;
    batch.execute();
    batch.undo();
    expect(batch.label).toBe('Batch');
    expect(events).toEqual(['execute:A', 'execute:B', 'undo:B', 'undo:A']);
  });

  it('supports an empty batch', () => {
    const batch = batchCommands([], 'Nothing');
    expect(() => {
      batch.execute();
      batch.undo();
    }).not.toThrow();
  });

  it('multiple undo/redo cycles are stable', () => {
    const events: string[] = [];
    const batch = batchCommands([command('X', events), command('Y', events)], 'Pair');
    for (let i = 0; i < 3; i++) {
      batch.execute();
      batch.undo();
    }
    expect(events).toEqual([
      'execute:X',
      'execute:Y',
      'undo:Y',
      'undo:X',
      'execute:X',
      'execute:Y',
      'undo:Y',
      'undo:X',
      'execute:X',
      'execute:Y',
      'undo:Y',
      'undo:X',
    ]);
  });
});

describe('getUndoLabel', () => {
  it('returns the next undo label or null', () => {
    const editor = createEditorState();
    expect(getUndoLabel(editor)).toBeNull();
    executeCommand(editor, command('Resize'));
    expect(getUndoLabel(editor)).toBe('Resize');
  });
});

describe('getRedoLabel', () => {
  it('returns the next redo label or null', () => {
    const editor = createEditorState();
    executeCommand(editor, command('Rotate'));
    expect(getRedoLabel(editor)).toBeNull();
    undo(editor.commandHistory);
    expect(getRedoLabel(editor)).toBe('Rotate');
    redo(editor.commandHistory);
    expect(getRedoLabel(editor)).toBeNull();
  });
});

describe('undoCommand', () => {
  it('undoes the last command and marks dirty', () => {
    const editor = createEditorState();
    executeCommand(editor, command('Move'));
    expect(undoCommand(editor)).toBe(true);
    expect(getUndoCount(editor)).toBe(0);
  });

  it('returns false when nothing to undo', () => {
    const editor = createEditorState();
    expect(undoCommand(editor)).toBe(false);
  });
});

describe('redoCommand', () => {
  it('redoes an undone command', () => {
    const editor = createEditorState();
    executeCommand(editor, command('Move'));
    undoCommand(editor);
    expect(redoCommand(editor)).toBe(true);
    expect(getRedoCount(editor)).toBe(0);
  });

  it('returns false when nothing to redo', () => {
    const editor = createEditorState();
    expect(redoCommand(editor)).toBe(false);
  });
});

describe('clearHistory', () => {
  it('clears all history', () => {
    const editor = createEditorState();
    executeCommand(editor, command('A'));
    executeCommand(editor, command('B'));
    clearHistory(editor);
    expect(getUndoCount(editor)).toBe(0);
    expect(canUndo(editor)).toBe(false);
  });
});

describe('canUndo', () => {
  it('returns false when empty', () => {
    const editor = createEditorState();
    expect(canUndo(editor)).toBe(false);
  });

  it('returns true after a command', () => {
    const editor = createEditorState();
    executeCommand(editor, command('X'));
    expect(canUndo(editor)).toBe(true);
  });
});

describe('canRedo', () => {
  it('returns false when no undone commands', () => {
    const editor = createEditorState();
    expect(canRedo(editor)).toBe(false);
  });

  it('returns true after undo', () => {
    const editor = createEditorState();
    executeCommand(editor, command('X'));
    undoCommand(editor);
    expect(canRedo(editor)).toBe(true);
  });
});

describe('getUndoCount', () => {
  it('counts undo stack entries', () => {
    const editor = createEditorState();
    expect(getUndoCount(editor)).toBe(0);
    executeCommand(editor, command('A'));
    executeCommand(editor, command('B'));
    expect(getUndoCount(editor)).toBe(2);
  });
});

describe('getRedoCount', () => {
  it('counts redo stack entries', () => {
    const editor = createEditorState();
    executeCommand(editor, command('A'));
    expect(getRedoCount(editor)).toBe(0);
    undoCommand(editor);
    expect(getRedoCount(editor)).toBe(1);
  });
});
