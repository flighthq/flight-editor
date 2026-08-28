import { setSelection } from '@flighthq/editor-selection';
import {
  addNodeChild,
  getNodeChildAt,
  getNodeChildCount,
  getNodeParent,
  getNodeTransform2D,
  setNodeTransform2D,
} from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createDuplicateSelectionCommand } from './duplicateSelectionCommand';

function readTransform(node: Node2D): Transform2DLike {
  const transform = {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  };
  getNodeTransform2D(transform, node);
  return transform;
}

describe('createDuplicateSelectionCommand', () => {
  it('adds transformed, renamed clones after selected siblings and removes them on undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const between = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    first.name = 'First';
    second.name = 'Second';
    const firstTransform: Transform2DLike = {
      pivotX: 1,
      pivotY: 2,
      rotation: 3,
      scaleX: 4,
      scaleY: 5,
      skewX: 6,
      skewY: 7,
      x: 8,
      y: 9,
    };
    const secondTransform: Transform2DLike = { ...firstTransform, rotation: 30, x: 80, y: 90 };
    setNodeTransform2D(first, firstTransform);
    setNodeTransform2D(second, secondTransform);
    for (const child of [first, between, second]) addNodeChild(parent, child);
    setSelection(editor.selection, [second, first]);
    const command = createDuplicateSelectionCommand(editor);

    expect(command.label).toBe('Duplicate Selection');

    command.execute();

    expect(getNodeChildCount(parent)).toBe(5);
    const firstClone = getNodeChildAt(parent, 1) as Node2D;
    const secondClone = getNodeChildAt(parent, 4) as Node2D;
    expect(firstClone).not.toBe(first);
    expect(firstClone.name).toBe('First Copy');
    expect(readTransform(firstClone)).toEqual(firstTransform);
    expect(secondClone).not.toBe(second);
    expect(secondClone.name).toBe('Second Copy');
    expect(readTransform(secondClone)).toEqual(secondTransform);

    command.undo();

    expect(getNodeChildCount(parent)).toBe(3);
    expect([getNodeChildAt(parent, 0), getNodeChildAt(parent, 1), getNodeChildAt(parent, 2)]).toEqual([
      first,
      between,
      second,
    ]);
    expect(getNodeParent(firstClone)).toBeNull();
    expect(getNodeParent(secondClone)).toBeNull();
  });

  it('names clones "Copy" when the source has no name', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    node.name = null;
    addNodeChild(parent, node);
    setSelection(editor.selection, [node]);
    const command = createDuplicateSelectionCommand(editor);

    command.execute();

    const clone = getNodeChildAt(parent, 1) as Node2D;
    expect(clone.name).toBe('Copy');
  });

  it('handles empty selection without error', () => {
    const editor = createEditorState();
    const command = createDuplicateSelectionCommand(editor);

    command.execute();
    command.undo();
  });

  it('inserts the clone directly after its source', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    for (const child of [a, b, c]) addNodeChild(parent, child);
    setSelection(editor.selection, [b]);
    const command = createDuplicateSelectionCommand(editor);

    command.execute();

    expect(getNodeChildCount(parent)).toBe(4);
    expect(getNodeChildAt(parent, 0)).toBe(a);
    expect(getNodeChildAt(parent, 1)).toBe(b);
    expect(getNodeChildAt(parent, 3)).toBe(c);
  });

  it('supports re-execute after undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const node = createNode2D(DisplayObjectKind);
    node.name = 'Node';
    addNodeChild(parent, node);
    setSelection(editor.selection, [node]);
    const command = createDuplicateSelectionCommand(editor);

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeChildCount(parent)).toBe(2);
    const clone = getNodeChildAt(parent, 1) as Node2D;
    expect(clone.name).toBe('Node Copy');
  });
});
