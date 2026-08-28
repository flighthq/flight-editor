import { markCommandHistoryClean } from '@flighthq/editor-command';
import { markFileClean, markFileDirty } from '@flighthq/editor-file';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { isEditorClean, isEditorDirty, markEditorClean, markEditorDirty, syncDirtyState } from './dirtyTracker';
import { executeCommand } from './historyUtils';

describe('isEditorClean', () => {
  it('returns true for fresh editor', () => {
    const editor = createEditorState();
    expect(isEditorClean(editor)).toBe(true);
  });

  it('returns false when file is dirty', () => {
    const editor = createEditorState();
    markFileDirty(editor.file);
    expect(isEditorClean(editor)).toBe(false);
  });

  it('returns false after command execution', () => {
    const editor = createEditorState();
    executeCommand(editor, { label: 'test', execute() {}, undo() {} });
    markFileDirty(editor.file);
    expect(isEditorClean(editor)).toBe(false);
  });
});

describe('isEditorDirty', () => {
  it('returns false for fresh editor', () => {
    const editor = createEditorState();
    expect(isEditorDirty(editor)).toBe(false);
  });

  it('returns true when file is dirty', () => {
    const editor = createEditorState();
    markFileDirty(editor.file);
    expect(isEditorDirty(editor)).toBe(true);
  });
});

describe('syncDirtyState', () => {
  it('marks file dirty when history is not clean', () => {
    const editor = createEditorState();
    executeCommand(editor, { label: 'test', execute() {}, undo() {} });
    const changed = syncDirtyState(editor);
    expect(changed).toBe(true);
    expect(isEditorDirty(editor)).toBe(true);
  });

  it('marks file clean when history is clean', () => {
    const editor = createEditorState();
    markFileDirty(editor.file);
    markCommandHistoryClean(editor.commandHistory);
    const changed = syncDirtyState(editor);
    expect(changed).toBe(true);
    expect(isEditorClean(editor)).toBe(true);
  });

  it('returns false when already in sync', () => {
    const editor = createEditorState();
    const changed = syncDirtyState(editor);
    expect(changed).toBe(false);
  });
});

describe('markEditorClean', () => {
  it('clears both file and command history dirty state', () => {
    const editor = createEditorState();
    executeCommand(editor, { label: 'test', execute() {}, undo() {} });
    markFileDirty(editor.file);
    markEditorClean(editor);
    expect(isEditorClean(editor)).toBe(true);
  });
});

describe('markEditorDirty', () => {
  it('marks file as dirty', () => {
    const editor = createEditorState();
    markEditorDirty(editor);
    expect(isEditorDirty(editor)).toBe(true);
  });

  it('is idempotent', () => {
    const editor = createEditorState();
    markEditorDirty(editor);
    const versionBefore = editor.file.version;
    markEditorDirty(editor);
    expect(editor.file.version).toBe(versionBefore);
  });
});
