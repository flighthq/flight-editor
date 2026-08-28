import type { EditorPointerEvent } from '@flighthq/editor-tool';
import { createEditorState } from '@flighthq/tool-editor';
import { describe, expect, it, vi } from 'vitest';

import { createMeasureTool } from './measureTool';

function makeEvent(x: number, y: number): EditorPointerEvent {
  return { x, y, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
}

describe('createMeasureTool', () => {
  it('reports live and final scene-space distance, angle, and deltas', () => {
    const editor = createEditorState();
    editor.viewport.camera.x = 10;
    editor.viewport.camera.y = 20;
    editor.viewport.camera.zoom = 2;
    const onMeasure = vi.fn();
    const tool = createMeasureTool(editor, onMeasure);

    tool.pointerDown(makeEvent(400, 300));
    expect(onMeasure).toHaveBeenLastCalledWith(null);
    tool.pointerMove(makeEvent(460, 380));
    expect(tool.currentMeasurement).toMatchObject({
      startX: 10,
      startY: 20,
      endX: 40,
      endY: 60,
      deltaX: 30,
      deltaY: 40,
      distance: 50,
    });
    expect(tool.currentMeasurement?.angle).toBeCloseTo(53.130_102);

    tool.pointerUp(makeEvent(520, 300));
    expect(tool.currentMeasurement).toMatchObject({ deltaX: 60, deltaY: 0, distance: 60, angle: 0 });
    expect(onMeasure).toHaveBeenLastCalledWith(tool.currentMeasurement);
    expect(tool.id).toBe('measure');
  });

  it('starts a fresh measurement on each subsequent pointer down', () => {
    const editor = createEditorState();
    const onMeasure = vi.fn();
    const tool = createMeasureTool(editor, onMeasure);
    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(410, 300));
    expect(tool.currentMeasurement).not.toBeNull();

    tool.pointerDown(makeEvent(500, 400));
    expect(tool.currentMeasurement).toBeNull();
    tool.pointerUp(makeEvent(500, 420));
    expect(tool.currentMeasurement?.startX).toBe(100);
    expect(tool.currentMeasurement?.startY).toBe(100);
    expect(tool.currentMeasurement?.deltaY).toBe(20);
  });

  it('ignores movement without a start and clears an active measurement on deactivate', () => {
    const editor = createEditorState();
    const onMeasure = vi.fn();
    const tool = createMeasureTool(editor, onMeasure);
    tool.pointerMove(makeEvent(450, 350));
    tool.pointerUp(makeEvent(450, 350));
    expect(onMeasure).not.toHaveBeenCalled();

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(410, 310));
    tool.deactivate();
    tool.pointerMove(makeEvent(500, 500));
    expect(tool.currentMeasurement).toBeNull();
    expect(onMeasure).toHaveBeenLastCalledWith(null);
  });
});
