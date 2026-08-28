import { undo } from '@flighthq/editor-command';
import { getSelectionCount, isSelected, setSelection } from '@flighthq/editor-selection';
import { getNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Transform2DLike } from '@flighthq/types';

import { createEditorState } from './editorState';
import { createPointerTool } from './pointerTool';

import type { HandleHitTestFn, PointerHitTestFn, RotationHitTestFn, ScaleHandleHit } from './pointerTool';

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

const noHandles: HandleHitTestFn = () => null;

describe('pointerTool', () => {
  it('selects a node on click', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const hitTest: PointerHitTestFn = () => node;
    const tool = createPointerTool(editor, hitTest, noHandles);

    tool.pointerDown(makeEvent({ x: 50, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 50 }));

    expect(getSelectionCount(editor.selection)).toBe(1);
    expect(isSelected(editor.selection, node)).toBe(true);
  });

  it('clears selection on empty click', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const hitTest: PointerHitTestFn = () => null;
    const tool = createPointerTool(editor, hitTest, noHandles);

    tool.pointerDown(makeEvent({ x: 50, y: 50 }));

    expect(getSelectionCount(editor.selection)).toBe(0);
  });

  it('moves selected node on drag', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const hitTest: PointerHitTestFn = () => node;
    const tool = createPointerTool(editor, hitTest, noHandles);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerMove(makeEvent({ x: 60, y: 40 }));
    tool.pointerUp(makeEvent({ x: 60, y: 40 }));

    const t = readTransform(node);
    expect(t.x).toBe(60);
    expect(t.y).toBe(40);
  });

  it('move is undoable', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const hitTest: PointerHitTestFn = () => node;
    const tool = createPointerTool(editor, hitTest, noHandles);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 30, y: 20 }));

    expect(readTransform(node).x).toBe(30);

    undo(editor.commandHistory);
    expect(readTransform(node).x).toBe(0);
  });

  it('scales via handle drag', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const hitTest: PointerHitTestFn = () => node;
    const handleHit: ScaleHandleHit = { node, handle: 'bottom-right' };
    const handleHitTest: HandleHitTestFn = () => handleHit;
    const tool = createPointerTool(editor, hitTest, handleHitTest);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 100, y: 100 }));

    const t = readTransform(node);
    expect(t.scaleX).toBe(2);
    expect(t.scaleY).toBe(2);
  });

  it('scale via handle is undoable', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const hitTest: PointerHitTestFn = () => node;
    const handleHit: ScaleHandleHit = { node, handle: 'bottom-right' };
    const handleHitTest: HandleHitTestFn = () => handleHit;
    const tool = createPointerTool(editor, hitTest, handleHitTest);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 100, y: 0 }));

    expect(readTransform(node).scaleX).toBe(2);

    undo(editor.commandHistory);
    expect(readTransform(node).scaleX).toBe(1);
  });

  it('top-left handle inverts scale direction', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const hitTest: PointerHitTestFn = () => node;
    const handleHit: ScaleHandleHit = { node, handle: 'top-left' };
    const handleHitTest: HandleHitTestFn = () => handleHit;
    const tool = createPointerTool(editor, hitTest, handleHitTest);

    tool.pointerDown(makeEvent({ x: 100, y: 100 }));
    tool.pointerUp(makeEvent({ x: 0, y: 0 }));

    const t = readTransform(node);
    expect(t.scaleX).toBe(2);
    expect(t.scaleY).toBe(2);
  });

  it('does not create a command on zero-distance drag', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const hitTest: PointerHitTestFn = () => node;
    const tool = createPointerTool(editor, hitTest, noHandles);

    tool.pointerDown(makeEvent({ x: 50, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 50 }));

    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });

  it('rotates via rotation handle drag', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const hitTest: PointerHitTestFn = () => node;
    const rotHitTest: RotationHitTestFn = () => ({ node, centerX: 50, centerY: 50 });
    const tool = createPointerTool(editor, hitTest, noHandles, rotHitTest);

    tool.pointerDown(makeEvent({ x: 100, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 100 }));

    const t = readTransform(node);
    expect(t.rotation).toBeCloseTo(Math.PI / 2);
  });

  it('rotation is undoable', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const hitTest: PointerHitTestFn = () => node;
    const rotHitTest: RotationHitTestFn = () => ({ node, centerX: 50, centerY: 50 });
    const tool = createPointerTool(editor, hitTest, noHandles, rotHitTest);

    tool.pointerDown(makeEvent({ x: 100, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 100 }));

    expect(readTransform(node).rotation).toBeCloseTo(Math.PI / 2);

    undo(editor.commandHistory);
    expect(readTransform(node).rotation).toBe(0);
  });

  it('rotation takes priority over scale handle', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const hitTest: PointerHitTestFn = () => node;
    const handleHit: ScaleHandleHit = { node, handle: 'bottom-right' };
    const handleHitTest: HandleHitTestFn = () => handleHit;
    const rotHitTest: RotationHitTestFn = () => ({ node, centerX: 50, centerY: 50 });
    const tool = createPointerTool(editor, hitTest, handleHitTest, rotHitTest);

    tool.pointerDown(makeEvent({ x: 100, y: 50 }));
    tool.pointerUp(makeEvent({ x: 50, y: 100 }));

    const t = readTransform(node);
    expect(t.rotation).toBeCloseTo(Math.PI / 2);
    expect(t.scaleX).toBe(1);
  });
});
