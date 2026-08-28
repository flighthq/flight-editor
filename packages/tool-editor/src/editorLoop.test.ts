import { addToSelection, clearSelection } from '@flighthq/editor-selection';
import { setHostCallbacks } from '@flighthq/editor-host';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import { createEditorLoopState, forceUpdateTitle, tickEditor } from './editorLoop';
import { executeCommand } from './historyUtils';

function makeNode(name: string) {
  const node = createNode2D();
  node.name = name;
  node.kind = DisplayObjectKind;
  return node;
}

describe('createEditorLoopState', () => {
  it('captures initial snapshot', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor);
    expect(loop.previousSnapshot.dirty).toBe(false);
    expect(loop.previousSnapshot.selectionCount).toBe(0);
  });

  it('accepts title options', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor, { appName: 'Custom' });
    expect(loop.titleOptions.appName).toBe('Custom');
  });
});

describe('tickEditor', () => {
  it('returns false when nothing changed', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor);
    const changed = tickEditor(editor, loop);
    expect(changed).toBe(false);
  });

  it('returns true when selection changes', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor);
    addToSelection(editor.selection, makeNode('a'));
    const changed = tickEditor(editor, loop);
    expect(changed).toBe(true);
  });

  it('notifies host on selection change', () => {
    const editor = createEditorState();
    const onSelectionChange = vi.fn();
    setHostCallbacks(editor.host, { onSelectionChange });
    const loop = createEditorLoopState(editor);

    addToSelection(editor.selection, makeNode('rect'));
    tickEditor(editor, loop);
    expect(onSelectionChange).toHaveBeenCalledWith(1);
  });

  it('syncs dirty state', () => {
    const editor = createEditorState();
    const onDirtyChange = vi.fn();
    setHostCallbacks(editor.host, { onDirtyChange });
    const loop = createEditorLoopState(editor);

    executeCommand(editor, { label: 'test', execute() {}, undo() {} });
    tickEditor(editor, loop);
    expect(onDirtyChange).toHaveBeenCalledWith(true);
  });

  it('does not re-notify on second tick without change', () => {
    const editor = createEditorState();
    const onSelectionChange = vi.fn();
    setHostCallbacks(editor.host, { onSelectionChange });
    const loop = createEditorLoopState(editor);

    addToSelection(editor.selection, makeNode('a'));
    tickEditor(editor, loop);
    onSelectionChange.mockClear();
    tickEditor(editor, loop);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('syncs status bar selection count', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor);

    addToSelection(editor.selection, makeNode('a'));
    addToSelection(editor.selection, makeNode('b'));
    tickEditor(editor, loop);
    expect(editor.statusBar.selectionCount).toBe(2);
    expect(editor.statusBar.selectionLabel).toBe('2 objects selected');
  });

  it('detects selection cleared', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor);
    addToSelection(editor.selection, makeNode('x'));
    tickEditor(editor, loop);

    clearSelection(editor.selection);
    const changed = tickEditor(editor, loop);
    expect(changed).toBe(true);
  });
});

describe('forceUpdateTitle', () => {
  it('updates title and refreshes snapshot', () => {
    const editor = createEditorState();
    const loop = createEditorLoopState(editor);
    forceUpdateTitle(editor, loop);
    expect(loop.previousSnapshot).toBeDefined();
  });
});
