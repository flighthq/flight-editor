import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorMenu,
  addEditorMenuItem,
  createEditorMenuItem,
  createEditorMenuSeparator,
  createEditorSubmenu,
  getEditorMenu,
  getEditorMenuBarVersion,
  getEditorMenuCount,
  getEditorMenuItem,
  getEditorMenuItems,
  getEditorMenus,
  removeEditorMenu,
  removeEditorMenuItem,
  setEditorMenuItemChecked,
  setEditorMenuItemEnabled,
} from './menuBarManager';

describe('addEditorMenu', () => {
  it('adds a menu', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    expect(getEditorMenuCount(editor)).toBe(1);
  });
});

describe('removeEditorMenu', () => {
  it('removes a menu', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    expect(removeEditorMenu(editor, 'file')).toBe(true);
    expect(getEditorMenuCount(editor)).toBe(0);
  });
});

describe('getEditorMenu', () => {
  it('returns the menu by id', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'edit', 'Edit');
    const menu = getEditorMenu(editor, 'edit');
    expect(menu).not.toBeNull();
    expect(menu!.label).toBe('Edit');
  });
});

describe('getEditorMenus', () => {
  it('returns all menus', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    addEditorMenu(editor, 'edit', 'Edit');
    expect(getEditorMenus(editor)).toHaveLength(2);
  });
});

describe('getEditorMenuCount', () => {
  it('returns zero when empty', () => {
    const editor = createEditorState();
    expect(getEditorMenuCount(editor)).toBe(0);
  });
});

describe('addEditorMenuItem', () => {
  it('adds an item to a menu', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    const item = createEditorMenuItem('new', 'New');
    expect(addEditorMenuItem(editor, 'file', item)).toBe(true);
    expect(getEditorMenuItems(editor, 'file')).toHaveLength(1);
  });
});

describe('removeEditorMenuItem', () => {
  it('removes an item from a menu', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    addEditorMenuItem(editor, 'file', createEditorMenuItem('new', 'New'));
    expect(removeEditorMenuItem(editor, 'file', 'new')).toBe(true);
    expect(getEditorMenuItems(editor, 'file')).toHaveLength(0);
  });
});

describe('getEditorMenuItem', () => {
  it('finds an item by id', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    addEditorMenuItem(editor, 'file', createEditorMenuItem('save', 'Save'));
    const item = getEditorMenuItem(editor, 'file', 'save');
    expect(item).not.toBeNull();
    expect(item!.label).toBe('Save');
  });
});

describe('getEditorMenuItems', () => {
  it('returns empty for nonexistent menu', () => {
    const editor = createEditorState();
    expect(getEditorMenuItems(editor, 'missing')).toHaveLength(0);
  });
});

describe('setEditorMenuItemEnabled', () => {
  it('toggles item enabled state', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'file', 'File');
    addEditorMenuItem(editor, 'file', createEditorMenuItem('save', 'Save'));
    setEditorMenuItemEnabled(editor, 'file', 'save', false);
    const item = getEditorMenuItem(editor, 'file', 'save');
    expect(item!.enabled).toBe(false);
  });
});

describe('setEditorMenuItemChecked', () => {
  it('toggles item checked state', () => {
    const editor = createEditorState();
    addEditorMenu(editor, 'view', 'View');
    addEditorMenuItem(editor, 'view', createEditorMenuItem('grid', 'Grid'));
    setEditorMenuItemChecked(editor, 'view', 'grid', true);
    const item = getEditorMenuItem(editor, 'view', 'grid');
    expect(item!.checked).toBe(true);
  });
});

describe('createEditorMenuItem', () => {
  it('creates a menu item', () => {
    const item = createEditorMenuItem('open', 'Open');
    expect(item.id).toBe('open');
    expect(item.label).toBe('Open');
  });
});

describe('createEditorMenuSeparator', () => {
  it('creates a separator item', () => {
    const sep = createEditorMenuSeparator('sep1');
    expect(sep.id).toBe('sep1');
  });
});

describe('createEditorSubmenu', () => {
  it('creates a submenu with children', () => {
    const sub = createEditorSubmenu('recent', 'Recent', [createEditorMenuItem('r1', 'File1')]);
    expect(sub.id).toBe('recent');
    expect(sub.label).toBe('Recent');
  });
});

describe('getEditorMenuBarVersion', () => {
  it('increments on changes', () => {
    const editor = createEditorState();
    const v0 = getEditorMenuBarVersion(editor);
    addEditorMenu(editor, 'file', 'File');
    expect(getEditorMenuBarVersion(editor)).toBeGreaterThan(v0);
  });
});
