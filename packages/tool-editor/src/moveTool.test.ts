import { undo } from '@flighthq/editor-command';
import { setSelection } from '@flighthq/editor-selection';
import { getNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Transform2DLike } from '@flighthq/types';

import { createEditorState } from './editorState';

import { createMoveTool } from './moveTool';

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

describe('createMoveTool', () => {
  it('moves a selected node by drag delta', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createMoveTool(editor);

    tool.pointerDown(makeEvent({ x: 100, y: 100 }));
    tool.pointerMove(makeEvent({ x: 150, y: 120 }));
    tool.pointerUp(makeEvent({ x: 150, y: 120 }));

    const t = readTransform(node);
    expect(t.x).toBe(50);
    expect(t.y).toBe(20);
  });

  it('creates an undoable command on drag end', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createMoveTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 30, y: 40 }));

    expect(readTransform(node).x).toBe(30);
    expect(readTransform(node).y).toBe(40);

    undo(editor.commandHistory);

    expect(readTransform(node).x).toBe(0);
    expect(readTransform(node).y).toBe(0);
  });

  it('does not create a command if no movement', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createMoveTool(editor);

    tool.pointerDown(makeEvent({ x: 50, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 50 }));

    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });

  it('does nothing when no nodes are selected', () => {
    const editor = createEditorState();
    const tool = createMoveTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerMove(makeEvent({ x: 100, y: 100 }));
    tool.pointerUp(makeEvent({ x: 100, y: 100 }));

    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });

  it('scales movement by inverse viewport zoom', () => {
    const editor = createEditorState();
    editor.viewport.camera.zoom = 2;
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createMoveTool(editor);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 100, y: 100 }));

    const t = readTransform(node);
    expect(t.x).toBe(50);
    expect(t.y).toBe(50);
  });
});
