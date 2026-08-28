import { setClipboardEntries } from '@flighthq/editor-clipboard';
import { getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
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
});
