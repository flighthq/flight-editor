import { setClipboardEntries } from '@flighthq/editor-clipboard';
import { addNodeChild, getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createPasteNodesCommand } from './pasteNodesCommand';

describe('createPasteNodesCommand', () => {
  it('adds clipboard entries in order and removes them on undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setClipboardEntries(editor.clipboard, [first, second], 'copy');
    const command = createPasteNodesCommand(editor, parent);

    expect(command.label).toBe('Paste');

    command.execute();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(first);
    expect(getNodeChildAt(parent, 1)).toBe(second);
    expect(getNodeParent(first)).toBe(parent);
    expect(getNodeParent(second)).toBe(parent);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(0);
    expect(getNodeParent(first)).toBeNull();
    expect(getNodeParent(second)).toBeNull();
  });

  it('handles empty clipboard without error', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const command = createPasteNodesCommand(editor, parent);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(0);

    command.undo();
  });

  it('appends pasted nodes after existing children', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const existing = createNode2D(DisplayObjectKind);
    addNodeChild(parent, existing);
    const pasted = createNode2D(DisplayObjectKind);
    setClipboardEntries(editor.clipboard, [pasted], 'copy');
    const command = createPasteNodesCommand(editor, parent);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(existing);
    expect(getNodeChildAt(parent, 1)).toBe(pasted);
  });

  it('supports re-execute after undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    setClipboardEntries(editor.clipboard, [node], 'copy');
    const command = createPasteNodesCommand(editor, parent);

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(node);
  });

  it('undo removes pasted nodes in reverse order', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const existing = createNode2D(DisplayObjectKind);
    addNodeChild(parent, existing);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    setClipboardEntries(editor.clipboard, [a, b, c], 'copy');
    const command = createPasteNodesCommand(editor, parent);

    command.execute();
    expect(getNodeChildCount(parent)).toBe(4);

    command.undo();
    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(existing);
    expect(getNodeParent(a)).toBeNull();
    expect(getNodeParent(b)).toBeNull();
    expect(getNodeParent(c)).toBeNull();
  });

  it('captures clipboard at creation time', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setClipboardEntries(editor.clipboard, [first], 'copy');
    const command = createPasteNodesCommand(editor, parent);

    setClipboardEntries(editor.clipboard, [second], 'copy');
    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(first);
  });
});
