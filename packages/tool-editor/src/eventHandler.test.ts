import { getActiveToolName, getCursorPosition } from '@flighthq/editor-status';
import { getActiveToolId, registerTool } from '@flighthq/editor-tool';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import { handleKeyDown, handlePointerDown, handlePointerMove, handlePointerUp, switchTool } from './eventHandler';
import { registerDefaultCommands } from './commandRegistry';
import { registerDefaultShortcuts } from './defaultShortcuts';
import { createNewScene } from './sceneManager';

function makeEvent(x = 0, y = 0) {
  return { x, y, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
}

function setupEditor() {
  const editor = createEditorState();
  registerDefaultCommands(editor);
  registerDefaultShortcuts(editor.keyboard);
  createNewScene(editor);
  return editor;
}

describe('handlePointerDown', () => {
  it('calls pointerDown on the active tool', () => {
    const editor = setupEditor();
    const pointerDown = vi.fn();
    registerTool(editor.toolRegistry, { id: 'test', pointerDown });
    switchTool(editor, 'test');
    handlePointerDown(editor, makeEvent(10, 20));
    expect(pointerDown).toHaveBeenCalledOnce();
    expect(pointerDown.mock.calls[0]![0].x).toBe(10);
  });

  it('does nothing when no tool is active', () => {
    const editor = setupEditor();
    handlePointerDown(editor, makeEvent());
  });
});

describe('handlePointerMove', () => {
  it('calls pointerMove on the active tool', () => {
    const editor = setupEditor();
    const pointerMove = vi.fn();
    registerTool(editor.toolRegistry, { id: 'test', pointerMove });
    switchTool(editor, 'test');
    handlePointerMove(editor, makeEvent(5, 10));
    expect(pointerMove).toHaveBeenCalledOnce();
  });

  it('updates cursor position in status bar', () => {
    const editor = setupEditor();
    handlePointerMove(editor, makeEvent(100, 200));
    const pos = getCursorPosition(editor.statusBar);
    expect(pos).not.toBeNull();
  });
});

describe('handlePointerUp', () => {
  it('calls pointerUp on the active tool', () => {
    const editor = setupEditor();
    const pointerUp = vi.fn();
    registerTool(editor.toolRegistry, { id: 'test', pointerUp });
    switchTool(editor, 'test');
    handlePointerUp(editor, makeEvent());
    expect(pointerUp).toHaveBeenCalledOnce();
  });
});

describe('handleKeyDown', () => {
  it('dispatches keyboard shortcuts', () => {
    const editor = setupEditor();
    const result = handleKeyDown(editor, {
      key: 'd',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(result).toBe(true);
  });

  it('returns false for unbound keys', () => {
    const editor = setupEditor();
    const result = handleKeyDown(editor, {
      key: 'q',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(result).toBe(false);
  });
});

describe('switchTool', () => {
  it('activates a registered tool', () => {
    const editor = setupEditor();
    registerTool(editor.toolRegistry, { id: 'test-tool' });
    const result = switchTool(editor, 'test-tool');
    expect(result).toBe(true);
    expect(getActiveToolId(editor.toolRegistry)).toBe('test-tool');
  });

  it('updates status bar tool name', () => {
    const editor = setupEditor();
    registerTool(editor.toolRegistry, { id: 'brush' });
    switchTool(editor, 'brush');
    expect(getActiveToolName(editor.statusBar)).toBe('brush');
  });

  it('returns false for unregistered tool', () => {
    const editor = setupEditor();
    const result = switchTool(editor, 'nonexistent');
    expect(result).toBe(false);
  });
});
