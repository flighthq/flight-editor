import { getLockVersion, getLockedCount, isLocked, lockNode } from '@flighthq/editor-lock';
import { setSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createLockSelectionCommand } from './lockSelectionCommand';

describe('createLockSelectionCommand', () => {
  it('locks every selected node', () => {
    const editor = createEditorState();
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [first, second]);

    createLockSelectionCommand(editor).execute();

    expect(isLocked(editor.locks, first)).toBe(true);
    expect(isLocked(editor.locks, second)).toBe(true);
    expect(getLockedCount(editor.locks)).toBe(2);
  });

  it('unlocks newly locked nodes on undo', () => {
    const editor = createEditorState();
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [first, second]);
    const command = createLockSelectionCommand(editor);

    command.execute();
    command.undo();

    expect(isLocked(editor.locks, first)).toBe(false);
    expect(isLocked(editor.locks, second)).toBe(false);
  });

  it('preserves nodes that were already locked before execution', () => {
    const editor = createEditorState();
    const alreadyLocked = createNode2D(DisplayObjectKind);
    const newlyLocked = createNode2D(DisplayObjectKind);
    lockNode(editor.locks, alreadyLocked);
    setSelection(editor.selection, [alreadyLocked, newlyLocked]);
    const command = createLockSelectionCommand(editor);

    command.execute();
    command.undo();

    expect(isLocked(editor.locks, alreadyLocked)).toBe(true);
    expect(isLocked(editor.locks, newlyLocked)).toBe(false);
  });

  it('captures the selection when the command is created', () => {
    const editor = createEditorState();
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [first]);
    const command = createLockSelectionCommand(editor);
    setSelection(editor.selection, [second]);

    command.execute();

    expect(isLocked(editor.locks, first)).toBe(true);
    expect(isLocked(editor.locks, second)).toBe(false);
  });

  it('is a no-op for an empty selection', () => {
    const editor = createEditorState();
    const command = createLockSelectionCommand(editor);

    command.execute();
    command.undo();

    expect(getLockedCount(editor.locks)).toBe(0);
    expect(getLockVersion(editor.locks)).toBe(0);
  });

  it('has the correct label', () => {
    const editor = createEditorState();
    const command = createLockSelectionCommand(editor);
    expect(command.label).toBe('Lock Selection');
  });

  it('supports re-execute after undo', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const command = createLockSelectionCommand(editor);

    command.execute();
    command.undo();
    command.execute();

    expect(isLocked(editor.locks, node)).toBe(true);
    expect(getLockedCount(editor.locks)).toBe(1);
  });
});
