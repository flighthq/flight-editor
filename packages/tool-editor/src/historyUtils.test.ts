import type { Command } from '@flighthq/editor-command';

import { redo, undo } from '@flighthq/editor-command';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import { batchCommands, executeCommand, getRedoLabel, getUndoLabel } from './historyUtils';

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
