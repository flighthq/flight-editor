import { createCommandHistory, undo } from '@flighthq/editor-command';
import { createSelectionState, setSelection } from '@flighthq/editor-selection';
import { getNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { Transform2DLike } from '@flighthq/types';

import { createEditorState } from './editorState';
import { createRotateTool } from './rotateTool';

function readTransform(node: any): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

function makeEvent(x: number, y: number, extra?: Partial<any>) {
  return { x, y, shiftKey: false, ...extra } as any;
}

describe('createRotateTool', () => {
  it('rotates selected nodes around center', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerDown(makeEvent(100, 0));
    tool.pointerMove(makeEvent(0, 100));
    tool.pointerUp(makeEvent(0, 100));

    const t = readTransform(node);
    expect(t.rotation).toBeCloseTo(Math.PI / 2, 5);
  });

  it('rotation is undoable', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerDown(makeEvent(100, 0));
    tool.pointerUp(makeEvent(0, 100));

    expect(readTransform(node).rotation).toBeCloseTo(Math.PI / 2, 5);

    undo(editor.commandHistory);
    expect(readTransform(node).rotation).toBe(0);
  });

  it('does not create a command for zero rotation', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerDown(makeEvent(100, 0));
    tool.pointerUp(makeEvent(100, 0));

    expect(readTransform(node).rotation).toBe(0);
  });

  it('does nothing with no selection', () => {
    const editor = createEditorState();
    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerDown(makeEvent(100, 0));
    tool.pointerMove(makeEvent(0, 100));
    tool.pointerUp(makeEvent(0, 100));
  });

  it('deactivate clears drag state', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerDown(makeEvent(100, 0));
    tool.deactivate();
    tool.pointerMove(makeEvent(0, 100));
    tool.pointerUp(makeEvent(0, 100));

    expect(readTransform(node).rotation).toBe(0);
  });

  it('rotates multiple selected nodes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [a, b]);

    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerDown(makeEvent(100, 0));
    tool.pointerUp(makeEvent(0, 100));

    expect(readTransform(a).rotation).toBeCloseTo(Math.PI / 2, 5);
    expect(readTransform(b).rotation).toBeCloseTo(Math.PI / 2, 5);

    undo(editor.commandHistory);
    expect(readTransform(a).rotation).toBe(0);
    expect(readTransform(b).rotation).toBe(0);
  });

  it('pointerMove without pointerDown does nothing', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const tool = createRotateTool(editor, { centerX: 0, centerY: 0 });
    tool.pointerMove(makeEvent(0, 100));
    tool.pointerUp(makeEvent(0, 100));

    expect(readTransform(node).rotation).toBe(0);
  });
});
