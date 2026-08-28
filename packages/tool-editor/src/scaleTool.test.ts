import { undo } from '@flighthq/editor-command';
import { setSelection } from '@flighthq/editor-selection';
import { getNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Transform2DLike } from '@flighthq/types';

import { createEditorState } from './editorState';
import { createScaleTool } from './scaleTool';

function makeEvent(overrides: Partial<EditorPointerEvent> = {}): EditorPointerEvent {
  return {
    x: 0,
    y: 0,
    button: 0,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    ...overrides,
  };
}

function readTransform(node: any): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

describe('scaleTool', () => {
  it('scales a selected node by drag delta', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createScaleTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerMove(makeEvent({ x: 100, y: 50 }));
    tool.pointerUp(makeEvent({ x: 100, y: 50 }));

    const t = readTransform(node);
    expect(t.scaleX).toBe(2);
    expect(t.scaleY).toBe(1.5);
  });

  it('creates an undoable command on drag end', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createScaleTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 100, y: 100 }));

    const t = readTransform(node);
    expect(t.scaleX).toBe(2);
    expect(t.scaleY).toBe(2);

    undo(editor.commandHistory);

    const reverted = readTransform(node);
    expect(reverted.scaleX).toBe(1);
    expect(reverted.scaleY).toBe(1);
  });

  it('applies uniform scale when shift is held', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createScaleTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 100, y: 50, shiftKey: true }));

    const t = readTransform(node);
    expect(t.scaleX).toBe(t.scaleY);
    expect(t.scaleX).toBeCloseTo(1.75);
  });

  it('does not create a command if no movement', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createScaleTool(editor);

    tool.pointerDown(makeEvent({ x: 50, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 50 }));

    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });

  it('does nothing when no nodes are selected', () => {
    const editor = createEditorState();
    const tool = createScaleTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerMove(makeEvent({ x: 100, y: 100 }));
    tool.pointerUp(makeEvent({ x: 100, y: 100 }));

    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });
});
