import { getCommandHistoryUndoCount, undo } from '@flighthq/editor-command';
import type { EditorPointerEvent } from '@flighthq/editor-tool';
import { getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createScene2D } from '@flighthq/scene2d';
import type { Shape } from '@flighthq/types';
import { createEditorState, setEditorScene } from '@flighthq/tool-editor';
import { describe, expect, it } from 'vitest';

import { createLineTool } from './lineTool';

function makeEvent(x: number, y: number, shiftKey = false): EditorPointerEvent {
  return { x, y, button: 0, shiftKey, ctrlKey: false, altKey: false, metaKey: false };
}

describe('createLineTool', () => {
  it('creates a styled scene-space line through command history and supports undo', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    editor.viewport.camera.x = 10;
    editor.viewport.camera.y = 20;
    editor.viewport.camera.zoom = 2;
    const tool = createLineTool(editor, { strokeColor: 0x336699, strokeWidth: 4 });

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(460, 380));
    expect(tool.currentLine).toEqual({ startX: 10, startY: 20, endX: 40, endY: 60 });
    tool.pointerUp(makeEvent(460, 380));

    const shape = getNodeChildAt(scene.root, 0) as Shape;
    expect(shape.name).toBe('Line');
    expect(shape.x).toBe(10);
    expect(shape.y).toBe(20);
    expect(shape.data.commands).toEqual([
      'lineStyle',
      8,
      4,
      0x336699,
      1,
      false,
      'normal',
      'none',
      'round',
      3,
      'moveTo',
      2,
      0,
      0,
      'lineTo',
      2,
      30,
      40,
    ]);
    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(1);
    expect(tool.currentLine).toBeNull();
    expect(tool.id).toBe('line');

    undo(editor.commandHistory);
    expect(getNodeChildCount(scene.root)).toBe(0);
  });

  it('constrains shifted lines to 45-degree increments', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const tool = createLineTool(editor);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(500, 350, true));
    const shape = getNodeChildAt(scene.root, 0) as Shape;
    const deltaX = shape.data.commands.at(-2) as number;
    const deltaY = shape.data.commands.at(-1) as number;
    expect(deltaX).toBeCloseTo(deltaY);
  });

  it('does not create degenerate lines or draw without a scene', () => {
    const editor = createEditorState();
    const tool = createLineTool(editor);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(450, 350));
    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(0);

    const scene = createScene2D();
    setEditorScene(editor, scene);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(400, 300));
    expect(getNodeChildCount(scene.root)).toBe(0);
  });

  it('clears an in-progress preview when deactivated', () => {
    const editor = createEditorState();
    const tool = createLineTool(editor);
    tool.pointerDown(makeEvent(400, 300));
    tool.deactivate();
    tool.pointerUp(makeEvent(450, 350));
    expect(tool.currentLine).toBeNull();
    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(0);
  });

  it('ignores pointer move without preceding pointer down', () => {
    const editor = createEditorState();
    const tool = createLineTool(editor);
    tool.pointerMove(makeEvent(500, 500));
    expect(tool.currentLine).toBeNull();
  });
});
