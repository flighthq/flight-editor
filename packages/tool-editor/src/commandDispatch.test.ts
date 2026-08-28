import { describe, expect, it } from 'vitest';

import { registerDefaultCommands } from './commandRegistry';
import { dispatchAction, dispatchKeyEvent, dispatchMenuItem, getMenuItemsForAction } from './commandDispatch';
import { registerDefaultMenus } from './defaultMenus';
import { registerDefaultShortcuts } from './defaultShortcuts';
import { createEditorState } from './editorState';
import { createNewScene } from './sceneManager';

function setupEditor() {
  const editor = createEditorState();
  registerDefaultCommands(editor);
  registerDefaultShortcuts(editor.keyboard);
  registerDefaultMenus(editor.menuBar);
  createNewScene(editor);
  return editor;
}

describe('dispatchKeyEvent', () => {
  it('dispatches Ctrl+D to duplicateSelection', () => {
    const editor = setupEditor();
    const result = dispatchKeyEvent(editor, {
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
    const result = dispatchKeyEvent(editor, {
      key: 'q',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(result).toBe(false);
  });

  it('dispatches Delete to deleteSelection', () => {
    const editor = setupEditor();
    const result = dispatchKeyEvent(editor, {
      key: 'Delete',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(result).toBe(true);
  });
});

describe('dispatchMenuItem', () => {
  it('dispatches a menu item by menuId and itemId', () => {
    const editor = setupEditor();
    const result = dispatchMenuItem(editor, 'edit', 'deleteSelection');
    expect(result).toBe(true);
  });

  it('returns false for non-existent menu', () => {
    const editor = setupEditor();
    const result = dispatchMenuItem(editor, 'nonexistent', 'deleteSelection');
    expect(result).toBe(false);
  });

  it('returns false for non-existent item', () => {
    const editor = setupEditor();
    const result = dispatchMenuItem(editor, 'edit', 'nonexistent');
    expect(result).toBe(false);
  });

  it('returns false for separator items', () => {
    const editor = setupEditor();
    const result = dispatchMenuItem(editor, 'file', 'file-sep-1');
    expect(result).toBe(false);
  });
});

describe('dispatchAction', () => {
  it('dispatches named commands', () => {
    const editor = setupEditor();
    const result = dispatchAction(editor, 'clearScene');
    expect(result).toBe(true);
    expect(editor.commandHistory.undoStack.length).toBe(1);
  });

  it('handles undo action', () => {
    const editor = setupEditor();
    dispatchAction(editor, 'clearScene');
    const result = dispatchAction(editor, 'undo');
    expect(result).toBe(true);
  });

  it('handles redo action', () => {
    const editor = setupEditor();
    dispatchAction(editor, 'clearScene');
    dispatchAction(editor, 'undo');
    const result = dispatchAction(editor, 'redo');
    expect(result).toBe(true);
  });

  it('returns false for undo with empty history', () => {
    const editor = setupEditor();
    const result = dispatchAction(editor, 'undo');
    expect(result).toBe(false);
  });

  it('returns false for unknown action', () => {
    const editor = setupEditor();
    const result = dispatchAction(editor, 'nonexistent');
    expect(result).toBe(false);
  });
});

describe('getMenuItemsForAction', () => {
  it('finds menu items bound to an action', () => {
    const editor = setupEditor();
    const items = getMenuItemsForAction(editor, 'deleteSelection');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0]!.commandId).toBe('deleteSelection');
  });

  it('returns empty array for unbound action', () => {
    const editor = setupEditor();
    const items = getMenuItemsForAction(editor, 'nonexistent');
    expect(items).toHaveLength(0);
  });

  it('finds items across multiple menus', () => {
    const editor = setupEditor();
    const items = getMenuItemsForAction(editor, 'bringForward');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
});
