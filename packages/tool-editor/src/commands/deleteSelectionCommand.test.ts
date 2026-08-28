import { getSelectionCount, getSelectedNodes, setSelection } from '@flighthq/editor-selection';
import { addNodeChild, getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createDeleteSelectionCommand } from './deleteSelectionCommand';

describe('createDeleteSelectionCommand', () => {
  it('removes selected nodes and restores their parents, indices, and selection on undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const before = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const middle = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    const after = createNode2D(DisplayObjectKind);
    for (const child of [before, first, middle, second, after]) addNodeChild(parent, child);
    setSelection(editor.selection, [first, second]);
    const command = createDeleteSelectionCommand(editor);

    expect(command.label).toBe('Delete Selection');

    command.execute();

    expect(getNodeChildCount(parent)).toBe(3);
    expect([getNodeChildAt(parent, 0), getNodeChildAt(parent, 1), getNodeChildAt(parent, 2)]).toEqual([
      before,
      middle,
      after,
    ]);
    expect(getNodeParent(first)).toBeNull();
    expect(getNodeParent(second)).toBeNull();
    expect(getSelectionCount(editor.selection)).toBe(0);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(5);
    expect(Array.from({ length: 5 }, (_, index) => getNodeChildAt(parent, index))).toEqual([
      before,
      first,
      middle,
      second,
      after,
    ]);
    expect(getNodeParent(first)).toBe(parent);
    expect(getNodeParent(second)).toBe(parent);
    expect(getSelectedNodes(editor.selection)).toEqual([first, second]);
  });

  it('handles empty selection without error', () => {
    const editor = createEditorState();
    const command = createDeleteSelectionCommand(editor);

    command.execute();

    expect(getSelectionCount(editor.selection)).toBe(0);
  });

  it('deletes a single selected node', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(parent, node);
    setSelection(editor.selection, [node]);
    const command = createDeleteSelectionCommand(editor);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(0);
    expect(getSelectionCount(editor.selection)).toBe(0);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(node);
    expect(getSelectedNodes(editor.selection)).toEqual([node]);
  });

  it('restores nodes in sorted index order on undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    const d = createNode2D(DisplayObjectKind);
    for (const child of [a, b, c, d]) addNodeChild(parent, child);
    setSelection(editor.selection, [d, b]);
    const command = createDeleteSelectionCommand(editor);

    command.execute();
    command.undo();

    expect(getNodeChildCount(parent)).toBe(4);
    expect(getNodeChildAt(parent, 0)).toBe(a);
    expect(getNodeChildAt(parent, 1)).toBe(b);
    expect(getNodeChildAt(parent, 2)).toBe(c);
    expect(getNodeChildAt(parent, 3)).toBe(d);
  });

  it('supports re-execute after undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(parent, node);
    setSelection(editor.selection, [node]);
    const command = createDeleteSelectionCommand(editor);

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeChildCount(parent)).toBe(0);
    expect(getSelectionCount(editor.selection)).toBe(0);
  });
});
