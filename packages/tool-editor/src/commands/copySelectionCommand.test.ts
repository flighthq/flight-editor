import { getClipboardEntries, getClipboardOperation, isClipboardEmpty } from '@flighthq/editor-clipboard';
import type { ClipboardOperation } from '@flighthq/editor-clipboard';
import { setSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createCopySelectionCommand } from './copySelectionCommand';

describe('createCopySelectionCommand', () => {
  it.each([
    ['copy', 'Copy'],
    ['cut', 'Cut'],
  ] as const)('captures the selection for %s and clears it on undo', (operation, label) => {
    const editor = createEditorState();
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [first, second]);
    const command = createCopySelectionCommand(editor, operation satisfies ClipboardOperation);

    expect(command.label).toBe(label);

    command.execute();

    expect(getClipboardEntries(editor.clipboard)).toEqual([first, second]);
    expect(getClipboardOperation(editor.clipboard)).toBe(operation);

    command.undo();

    expect(isClipboardEmpty(editor.clipboard)).toBe(true);
    expect(getClipboardOperation(editor.clipboard)).toBeNull();
  });

  it('copies with empty selection', () => {
    const editor = createEditorState();
    const command = createCopySelectionCommand(editor, 'copy');

    command.execute();

    expect(getClipboardEntries(editor.clipboard)).toEqual([]);
    expect(getClipboardOperation(editor.clipboard)).toBe('copy');
  });

  it('copies a single node', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const command = createCopySelectionCommand(editor, 'copy');

    command.execute();

    expect(getClipboardEntries(editor.clipboard)).toEqual([node]);
  });

  it('supports re-execute after undo', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const command = createCopySelectionCommand(editor, 'cut');

    command.execute();
    command.undo();
    command.execute();

    expect(getClipboardEntries(editor.clipboard)).toEqual([node]);
    expect(getClipboardOperation(editor.clipboard)).toBe('cut');
  });
});
