import { getCommandHistoryUndoCount, undo } from '@flighthq/editor-command';
import type { EditorPointerEvent } from '@flighthq/editor-tool';
import { getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createScene2D } from '@flighthq/scene2d';
import type { Shape } from '@flighthq/types';
import { createEditorState, setEditorScene } from '@flighthq/tool-editor';
import { describe, expect, it } from 'vitest';

import { createRectangleTool } from './rectangleTool';

function makeEvent(
  x: number,
  y: number,
  modifiers: Partial<Pick<EditorPointerEvent, 'shiftKey' | 'altKey'>> = {},
): EditorPointerEvent {
  return {
    x,
    y,
    button: 0,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    ...modifiers,
  };
}

describe('createRectangleTool', () => {
  it('creates a styled scene-space rectangle through command history and supports undo', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    editor.viewport.camera.x = 10;
    editor.viewport.camera.y = 20;
    editor.viewport.camera.zoom = 2;
    const tool = createRectangleTool(editor, { fillColor: 0xffcc00, strokeColor: 0x112233, strokeWidth: 3 });

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(460, 380));
    expect(tool.currentRectangle).toEqual({ x: 10, y: 20, width: 30, height: 40 });
    tool.pointerUp(makeEvent(460, 380));

    const shape = getNodeChildAt(scene.root, 0) as Shape;
    expect(shape.name).toBe('Rectangle');
    expect(shape).toMatchObject({ x: 10, y: 20 });
    expect(shape.data.commands.slice(0, 4)).toEqual(['beginFill', 2, 0xffcc00, 1]);
    expect(shape.data.commands).toContain('lineStyle');
    expect(shape.data.commands.slice(-8)).toEqual(['drawRectangle', 4, 0, 0, 30, 40, 'endFill', 0]);
    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(1);
    expect(tool.currentRectangle).toBeNull();
    expect(tool.id).toBe('rectangle');

    undo(editor.commandHistory);
    expect(getNodeChildCount(scene.root)).toBe(0);
  });

  it('constrains shifted rectangles to squares in either drag direction', () => {
    const editor = createEditorState();
    const tool = createRectangleTool(editor);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(300, 340, { shiftKey: true }));
    expect(tool.currentRectangle).toEqual({ x: -100, y: 0, width: 100, height: 100 });
  });

  it('draws from the center with Alt and combines Alt with Shift', () => {
    const editor = createEditorState();
    const tool = createRectangleTool(editor);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(430, 320, { altKey: true }));
    expect(tool.currentRectangle).toEqual({ x: -30, y: -20, width: 60, height: 40 });

    tool.pointerMove(makeEvent(430, 320, { altKey: true, shiftKey: true }));
    expect(tool.currentRectangle).toEqual({ x: -30, y: -30, width: 60, height: 60 });
  });

  it('does not create degenerate rectangles and cancels previews on deactivate', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const tool = createRectangleTool(editor);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(450, 300));
    expect(getNodeChildCount(scene.root)).toBe(0);

    tool.pointerDown(makeEvent(400, 300));
    tool.deactivate();
    tool.pointerUp(makeEvent(450, 350));
    expect(tool.currentRectangle).toBeNull();
    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(0);
  });
});
