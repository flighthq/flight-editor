import { getEditorViewportZoom } from '@flighthq/editor-viewport';
import { createEditorState } from '@flighthq/tool-editor';
import { describe, expect, it } from 'vitest';

import { createHandTool } from './handTool';

function makeEvent(x: number, y: number) {
  return { x, y, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
}

describe('createHandTool', () => {
  it('pans the viewport on drag', () => {
    const editor = createEditorState();
    const startX = editor.viewport.camera.x;
    const startY = editor.viewport.camera.y;
    const tool = createHandTool(editor);

    tool.pointerDown(makeEvent(100, 100));
    tool.pointerMove(makeEvent(150, 120));

    expect(editor.viewport.camera.x).toBeLessThan(startX);
    expect(editor.viewport.camera.y).toBeLessThan(startY);
  });

  it('does not pan without a preceding pointerDown', () => {
    const editor = createEditorState();
    const startX = editor.viewport.camera.x;
    const startY = editor.viewport.camera.y;
    const tool = createHandTool(editor);

    tool.pointerMove(makeEvent(200, 200));

    expect(editor.viewport.camera.x).toBe(startX);
    expect(editor.viewport.camera.y).toBe(startY);
  });

  it('stops panning after pointerUp', () => {
    const editor = createEditorState();
    const tool = createHandTool(editor);

    tool.pointerDown(makeEvent(100, 100));
    tool.pointerMove(makeEvent(150, 150));
    tool.pointerUp(makeEvent(150, 150));

    const xAfterUp = editor.viewport.camera.x;
    const yAfterUp = editor.viewport.camera.y;

    tool.pointerMove(makeEvent(200, 200));

    expect(editor.viewport.camera.x).toBe(xAfterUp);
    expect(editor.viewport.camera.y).toBe(yAfterUp);
  });

  it('accumulates multiple drag movements', () => {
    const editor = createEditorState();
    const startX = editor.viewport.camera.x;
    const tool = createHandTool(editor);

    tool.pointerDown(makeEvent(100, 100));
    tool.pointerMove(makeEvent(110, 100));
    tool.pointerMove(makeEvent(120, 100));
    tool.pointerMove(makeEvent(130, 100));

    const totalDelta = editor.viewport.camera.x - startX;
    expect(totalDelta).toBeCloseTo(-30 / editor.viewport.camera.zoom);
  });

  it('scales pan by inverse zoom', () => {
    const editor = createEditorState();
    editor.viewport.camera.zoom = 2;
    const startX = editor.viewport.camera.x;
    const tool = createHandTool(editor);

    tool.pointerDown(makeEvent(100, 100));
    tool.pointerMove(makeEvent(200, 100));

    const delta = editor.viewport.camera.x - startX;
    expect(delta).toBeCloseTo(-100 / 2);
  });

  it('does not change zoom while panning', () => {
    const editor = createEditorState();
    const zoom = getEditorViewportZoom(editor.viewport);
    const tool = createHandTool(editor);

    tool.pointerDown(makeEvent(100, 100));
    tool.pointerMove(makeEvent(200, 200));
    tool.pointerUp(makeEvent(200, 200));

    expect(getEditorViewportZoom(editor.viewport)).toBe(zoom);
  });

  it('deactivate cancels an in-progress drag', () => {
    const editor = createEditorState();
    const tool = createHandTool(editor);

    tool.pointerDown(makeEvent(100, 100));
    tool.deactivate();

    const x = editor.viewport.camera.x;
    tool.pointerMove(makeEvent(200, 200));

    expect(editor.viewport.camera.x).toBe(x);
  });

  it('has the correct id', () => {
    const editor = createEditorState();
    const tool = createHandTool(editor);

    expect(tool.id).toBe('hand');
  });
});
