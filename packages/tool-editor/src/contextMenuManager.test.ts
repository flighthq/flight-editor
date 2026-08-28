import { addToSelection, clearSelection } from '@flighthq/editor-selection';
import { describe, expect, it } from 'vitest';

import {
  CONTEXT_MENU_ACTION_MAP,
  closeEditorContextMenu,
  getContextMenuActionId,
  getContextMenuItemCount,
  getEditorContextMenuItems,
  isEditorContextMenuOpen,
  openEditorContextMenu,
  registerDefaultContextMenuItems,
} from './contextMenuManager';
import { createEditorState } from './editorState';

describe('registerDefaultContextMenuItems', () => {
  it('registers all items', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    expect(editor.contextMenu.registeredItems.size).toBe(getContextMenuItemCount());
  });

  it('is idempotent', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    const v1 = editor.contextMenu.version;
    registerDefaultContextMenuItems(editor);
    expect(editor.contextMenu.version).toBe(v1);
  });

  it('registers items with correct labels', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    const item = editor.contextMenu.registeredItems.get('ctx-cut');
    expect(item).toBeDefined();
    expect(item!.label).toBe('Cut');
  });
});

describe('openEditorContextMenu', () => {
  it('opens context menu at position', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    openEditorContextMenu(editor, 100, 200);
    expect(isEditorContextMenuOpen(editor)).toBe(true);
  });

  it('shows only paste when nothing selected', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    openEditorContextMenu(editor, 10, 20);
    const items = getEditorContextMenuItems(editor);
    expect(items).toHaveLength(1);
    expect(items[0]!.id).toBe('ctx-paste');
  });

  it('shows full menu when nodes are selected', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    addToSelection(editor.selection, 'node-1');
    openEditorContextMenu(editor, 10, 20);
    const items = getEditorContextMenuItems(editor);
    expect(items.length).toBeGreaterThan(1);
  });

  it('enables selection items when nodes are selected', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    addToSelection(editor.selection, 'node-1');
    openEditorContextMenu(editor, 10, 20);
    const items = getEditorContextMenuItems(editor);
    const cut = items.find((i) => i.id === 'ctx-cut');
    expect(cut).toBeDefined();
    expect(cut!.enabled).toBe(true);
  });

  it('disables selection items when nothing selected', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    addToSelection(editor.selection, 'node-1');
    openEditorContextMenu(editor, 10, 20);
    closeEditorContextMenu(editor);

    clearSelection(editor.selection);
    openEditorContextMenu(editor, 10, 20);
    const items = getEditorContextMenuItems(editor);
    expect(items).toHaveLength(1);
  });
});

describe('closeEditorContextMenu', () => {
  it('closes the context menu', () => {
    const editor = createEditorState();
    registerDefaultContextMenuItems(editor);
    openEditorContextMenu(editor, 10, 20);
    closeEditorContextMenu(editor);
    expect(isEditorContextMenuOpen(editor)).toBe(false);
  });

  it('is idempotent', () => {
    const editor = createEditorState();
    closeEditorContextMenu(editor);
    expect(isEditorContextMenuOpen(editor)).toBe(false);
  });
});

describe('isEditorContextMenuOpen', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isEditorContextMenuOpen(editor)).toBe(false);
  });
});

describe('getEditorContextMenuItems', () => {
  it('returns empty array when closed', () => {
    const editor = createEditorState();
    expect(getEditorContextMenuItems(editor)).toHaveLength(0);
  });
});

describe('getContextMenuActionId', () => {
  it('maps context menu item to action', () => {
    expect(getContextMenuActionId('ctx-copy')).toBe('copy');
  });

  it('maps z-order items', () => {
    expect(getContextMenuActionId('ctx-bring-to-front')).toBe('bring-to-front');
  });

  it('returns null for unknown item', () => {
    expect(getContextMenuActionId('unknown')).toBeNull();
  });
});

describe('CONTEXT_MENU_ACTION_MAP', () => {
  it('maps all action items', () => {
    expect(Object.keys(CONTEXT_MENU_ACTION_MAP).length).toBe(12);
  });
});

describe('getContextMenuItemCount', () => {
  it('returns expected count', () => {
    expect(getContextMenuItemCount()).toBe(16);
  });
});
