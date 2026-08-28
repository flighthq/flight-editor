import { activateTool, getActiveToolId, registerTool } from '@flighthq/editor-tool';
import type { EditorPointerEvent } from '@flighthq/editor-tool';
import { createEditorState } from '@flighthq/tool-editor';
import { describe, expect, it, vi } from 'vitest';

import { createEyedropperTool } from './eyedropperTool';

function makeEvent(x: number, y: number): EditorPointerEvent {
  return { x, y, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
}

describe('createEyedropperTool', () => {
  it('samples host-provided colors on pointer down and ignores misses', () => {
    const editor = createEditorState();
    const colorAtPoint = vi.fn((x: number) => (x < 20 ? 0x336699 : null));
    const onColorPick = vi.fn();
    const tool = createEyedropperTool(editor, colorAtPoint, onColorPick, { deactivateOnPick: false });

    tool.pointerDown(makeEvent(10, 15));
    tool.pointerDown(makeEvent(30, 40));
    expect(colorAtPoint).toHaveBeenNthCalledWith(1, 10, 15);
    expect(onColorPick).toHaveBeenCalledExactlyOnceWith(0x336699);
    expect(tool.id).toBe('eyedropper');
  });

  it('previews hover colors only when configured', () => {
    const editor = createEditorState();
    const onPreview = vi.fn();
    const preview = createEyedropperTool(editor, () => 0xff00ff, onPreview, {
      previewOnMove: true,
      deactivateOnPick: false,
    });
    const onPickOnly = vi.fn();
    const pickOnly = createEyedropperTool(editor, () => 0xff00ff, onPickOnly, { deactivateOnPick: false });

    preview.pointerMove(makeEvent(2, 3));
    pickOnly.pointerMove(makeEvent(2, 3));
    expect(onPreview).toHaveBeenCalledWith(0xff00ff);
    expect(onPickOnly).not.toHaveBeenCalled();
  });

  it('deactivates after a completed pick by default and can remain active', () => {
    const editor = createEditorState();
    const oneShot = createEyedropperTool(
      editor,
      () => 1,
      () => {},
    );
    registerTool(editor.toolRegistry, oneShot);
    activateTool(editor.toolRegistry, oneShot.id);
    oneShot.pointerDown(makeEvent(0, 0));
    oneShot.pointerUp(makeEvent(0, 0));
    expect(getActiveToolId(editor.toolRegistry)).toBeNull();

    const persistent = createEyedropperTool(
      editor,
      () => 1,
      () => {},
      { deactivateOnPick: false },
    );
    registerTool(editor.toolRegistry, persistent);
    activateTool(editor.toolRegistry, persistent.id);
    persistent.pointerDown(makeEvent(0, 0));
    persistent.pointerUp(makeEvent(0, 0));
    expect(getActiveToolId(editor.toolRegistry)).toBe(persistent.id);
  });

  it('cancels the pending pointer-up action when deactivated', () => {
    const editor = createEditorState();
    const tool = createEyedropperTool(
      editor,
      () => 1,
      () => {},
    );
    registerTool(editor.toolRegistry, tool);
    activateTool(editor.toolRegistry, tool.id);
    tool.pointerDown(makeEvent(0, 0));
    tool.deactivate();
    tool.pointerUp(makeEvent(0, 0));
    expect(getActiveToolId(editor.toolRegistry)).toBe(tool.id);
  });
});
