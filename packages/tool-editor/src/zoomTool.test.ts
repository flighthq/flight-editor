import { getEditorViewportZoom } from '@flighthq/editor-viewport';
import { createEditorState } from '@flighthq/tool-editor';
import { describe, expect, it } from 'vitest';

import { createZoomTool } from './zoomTool';

function makeEvent(
  x: number,
  y: number,
  overrides?: Partial<{ shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey: boolean }>,
) {
  return { x, y, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false, ...overrides };
}

describe('createZoomTool', () => {
  it('zooms in on click', () => {
    const editor = createEditorState();
    const startZoom = getEditorViewportZoom(editor.viewport);
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(400, 300));

    expect(getEditorViewportZoom(editor.viewport)).toBeGreaterThan(startZoom);
  });

  it('zooms out on shift+click', () => {
    const editor = createEditorState();
    const startZoom = getEditorViewportZoom(editor.viewport);
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300, { shiftKey: true }));
    tool.pointerUp(makeEvent(400, 300, { shiftKey: true }));

    expect(getEditorViewportZoom(editor.viewport)).toBeLessThan(startZoom);
  });

  it('zooms in by dragging upward', () => {
    const editor = createEditorState();
    const startZoom = getEditorViewportZoom(editor.viewport);
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(400, 100));

    expect(getEditorViewportZoom(editor.viewport)).toBeGreaterThan(startZoom);
  });

  it('zooms out by dragging downward', () => {
    const editor = createEditorState();
    const startZoom = getEditorViewportZoom(editor.viewport);
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(400, 500));

    expect(getEditorViewportZoom(editor.viewport)).toBeLessThan(startZoom);
  });

  it('does not zoom without a preceding pointerDown', () => {
    const editor = createEditorState();
    const startZoom = getEditorViewportZoom(editor.viewport);
    const tool = createZoomTool(editor);

    tool.pointerMove(makeEvent(400, 100));

    expect(getEditorViewportZoom(editor.viewport)).toBe(startZoom);
  });

  it('stops zooming after pointerUp', () => {
    const editor = createEditorState();
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerUp(makeEvent(400, 300));

    const zoomAfterUp = getEditorViewportZoom(editor.viewport);

    tool.pointerMove(makeEvent(400, 100));

    expect(getEditorViewportZoom(editor.viewport)).toBe(zoomAfterUp);
  });

  it('deactivate cancels an in-progress drag', () => {
    const editor = createEditorState();
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300));
    tool.deactivate();

    const zoom = getEditorViewportZoom(editor.viewport);
    tool.pointerMove(makeEvent(400, 100));

    expect(getEditorViewportZoom(editor.viewport)).toBe(zoom);
  });

  it('uses the click point as the zoom anchor', () => {
    const editor = createEditorState();
    const tool = createZoomTool(editor);

    tool.pointerDown(makeEvent(400, 300));
    tool.pointerMove(makeEvent(400, 200));

    const zoomMid = getEditorViewportZoom(editor.viewport);

    tool.pointerMove(makeEvent(400, 100));

    expect(getEditorViewportZoom(editor.viewport)).toBeGreaterThan(zoomMid);
  });

  it('has the correct id', () => {
    const editor = createEditorState();
    const tool = createZoomTool(editor);

    expect(tool.id).toBe('zoom');
  });
});
