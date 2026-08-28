import { getRegisteredToolIds } from '@flighthq/editor-tool';
import type { EditorPointerEvent } from '@flighthq/editor-tool';
import { createDisplayObject } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import { describe, expect, it, vi } from 'vitest';

import { registerDefaultTools } from './registerDefaultTools';

const event: EditorPointerEvent = {
  x: 10,
  y: 20,
  button: 0,
  shiftKey: false,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
};

describe('registerDefaultTools', () => {
  it('registers every built-in tool under its standard id', () => {
    const editor = createEditorState();
    registerDefaultTools(editor);
    expect(getRegisteredToolIds(editor.toolRegistry)).toEqual([
      'select',
      'move',
      'scale',
      'rotate',
      'pointer',
      'hand',
      'zoom',
      'marquee',
      'eyedropper',
      'measure',
      'line',
      'rectangle',
    ]);
  });

  it('connects host hit-testing and interaction callbacks', () => {
    const editor = createEditorState();
    const node = createDisplayObject();
    const hitTest = vi.fn(() => node);
    const onColorPick = vi.fn();
    const onMeasure = vi.fn();
    registerDefaultTools(editor, {
      hitTest,
      colorAtPoint: () => 0x123456,
      onColorPick,
      eyedropper: { deactivateOnPick: false },
      onMeasure,
    });

    editor.toolRegistry.tools.get('select')!.pointerDown!(event);
    expect(hitTest).toHaveBeenCalledWith(10, 20);
    editor.toolRegistry.tools.get('eyedropper')!.pointerDown!(event);
    expect(onColorPick).toHaveBeenCalledWith(0x123456);
    editor.toolRegistry.tools.get('measure')!.pointerDown!(event);
    expect(onMeasure).toHaveBeenCalledWith(null);
  });

  it('can be called again to refresh registrations without duplicating ids', () => {
    const editor = createEditorState();
    registerDefaultTools(editor);
    registerDefaultTools(editor, { rotate: { centerX: 1, centerY: 2 } });
    expect(getRegisteredToolIds(editor.toolRegistry)).toHaveLength(12);
  });

  it('defaults all callbacks to safe no-ops', () => {
    const editor = createEditorState();
    registerDefaultTools(editor);
    expect(() => {
      editor.toolRegistry.tools.get('select')!.pointerDown!(event);
      editor.toolRegistry.tools.get('eyedropper')!.pointerDown!(event);
      editor.toolRegistry.tools.get('measure')!.pointerDown!(event);
      editor.toolRegistry.tools.get('line')!.pointerDown!(event);
      editor.toolRegistry.tools.get('rectangle')!.pointerDown!(event);
    }).not.toThrow();
  });
});
