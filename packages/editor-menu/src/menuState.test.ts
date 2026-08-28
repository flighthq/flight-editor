import { describe, expect, it } from 'vitest';

import {
  addMenu,
  addMenuItem,
  createMenuBarState,
  createMenuItem,
  createSeparator,
  createSubmenu,
  getMenu,
  getMenuBarVersion,
  getMenuCount,
  getMenuItem,
  getMenuItems,
  getMenus,
  removeMenu,
  removeMenuItem,
  setMenuItemChecked,
  setMenuItemEnabled,
} from './menuState';

describe('createMenuBarState', () => {
  it('starts with no menus', () => {
    const state = createMenuBarState();
    expect(getMenuCount(state)).toBe(0);
    expect(getMenus(state)).toEqual([]);
    expect(getMenuBarVersion(state)).toBe(0);
  });
});

describe('addMenu', () => {
  it('adds a menu and bumps version', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    expect(getMenuCount(state)).toBe(1);
    expect(getMenu(state, 'file')?.label).toBe('File');
    expect(getMenuBarVersion(state)).toBe(1);
  });

  it('preserves insertion order', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    addMenu(state, 'edit', 'Edit');
    addMenu(state, 'view', 'View');
    const ids = getMenus(state).map((m) => m.id);
    expect(ids).toEqual(['file', 'edit', 'view']);
  });

  it('ignores duplicate ids', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    const v = getMenuBarVersion(state);
    addMenu(state, 'file', 'File Again');
    expect(getMenuCount(state)).toBe(1);
    expect(getMenuBarVersion(state)).toBe(v);
  });
});

describe('removeMenu', () => {
  it('removes a menu by id', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    addMenu(state, 'edit', 'Edit');
    expect(removeMenu(state, 'file')).toBe(true);
    expect(getMenuCount(state)).toBe(1);
    expect(getMenu(state, 'file')).toBeNull();
  });

  it('returns false for non-existent menu', () => {
    const state = createMenuBarState();
    expect(removeMenu(state, 'missing')).toBe(false);
  });

  it('does not bump version when not found', () => {
    const state = createMenuBarState();
    const v = getMenuBarVersion(state);
    removeMenu(state, 'missing');
    expect(getMenuBarVersion(state)).toBe(v);
  });
});

describe('getMenus', () => {
  it('returns all menus', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    addMenu(state, 'edit', 'Edit');
    expect(getMenus(state)).toHaveLength(2);
  });
});

describe('getMenu', () => {
  it('returns null for unknown menu', () => {
    expect(getMenu(createMenuBarState(), 'missing')).toBeNull();
  });

  it('returns the matching menu', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    expect(getMenu(state, 'edit')?.label).toBe('Edit');
  });
});

describe('getMenuCount', () => {
  it('tracks menu count', () => {
    const state = createMenuBarState();
    expect(getMenuCount(state)).toBe(0);
    addMenu(state, 'file', 'File');
    expect(getMenuCount(state)).toBe(1);
  });
});

describe('createMenuItem', () => {
  it('creates a normal item with defaults', () => {
    const item = createMenuItem('undo', 'Undo');
    expect(item.id).toBe('undo');
    expect(item.label).toBe('Undo');
    expect(item.role).toBe('normal');
    expect(item.commandId).toBeNull();
    expect(item.shortcutLabel).toBeNull();
    expect(item.enabled).toBe(true);
    expect(item.checked).toBe(false);
    expect(item.children).toEqual([]);
  });

  it('accepts command and shortcut options', () => {
    const item = createMenuItem('undo', 'Undo', { commandId: 'edit.undo', shortcutLabel: 'Ctrl+Z' });
    expect(item.commandId).toBe('edit.undo');
    expect(item.shortcutLabel).toBe('Ctrl+Z');
  });

  it('accepts enabled and checked options', () => {
    const item = createMenuItem('bold', 'Bold', { enabled: false, checked: true });
    expect(item.enabled).toBe(false);
    expect(item.checked).toBe(true);
  });
});

describe('createSeparator', () => {
  it('creates a separator item', () => {
    const sep = createSeparator('sep1');
    expect(sep.id).toBe('sep1');
    expect(sep.role).toBe('separator');
    expect(sep.label).toBe('');
    expect(sep.enabled).toBe(false);
  });
});

describe('createSubmenu', () => {
  it('creates a submenu with children', () => {
    const child1 = createMenuItem('zoom-in', 'Zoom In');
    const child2 = createMenuItem('zoom-out', 'Zoom Out');
    const sub = createSubmenu('zoom', 'Zoom', [child1, child2]);
    expect(sub.role).toBe('submenu');
    expect(sub.label).toBe('Zoom');
    expect(sub.children).toHaveLength(2);
    expect(sub.children[0]?.id).toBe('zoom-in');
  });

  it('does not alias the input children array', () => {
    const children = [createMenuItem('a', 'A')];
    const sub = createSubmenu('sub', 'Sub', children);
    children.length = 0;
    expect(sub.children).toHaveLength(1);
  });
});

describe('addMenuItem', () => {
  it('adds an item to a menu', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    const item = createMenuItem('undo', 'Undo');
    expect(addMenuItem(state, 'edit', item)).toBe(true);
    expect(getMenuItems(state, 'edit')).toHaveLength(1);
  });

  it('returns false for non-existent menu', () => {
    const state = createMenuBarState();
    expect(addMenuItem(state, 'missing', createMenuItem('a', 'A'))).toBe(false);
  });

  it('preserves item order', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    addMenuItem(state, 'edit', createMenuItem('undo', 'Undo'));
    addMenuItem(state, 'edit', createMenuItem('redo', 'Redo'));
    addMenuItem(state, 'edit', createSeparator('sep'));
    addMenuItem(state, 'edit', createMenuItem('cut', 'Cut'));
    const ids = getMenuItems(state, 'edit').map((i) => i.id);
    expect(ids).toEqual(['undo', 'redo', 'sep', 'cut']);
  });

  it('bumps version on success', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    const v = getMenuBarVersion(state);
    addMenuItem(state, 'file', createMenuItem('new', 'New'));
    expect(getMenuBarVersion(state)).toBe(v + 1);
  });
});

describe('removeMenuItem', () => {
  it('removes an item from a menu', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    addMenuItem(state, 'edit', createMenuItem('undo', 'Undo'));
    addMenuItem(state, 'edit', createMenuItem('redo', 'Redo'));
    expect(removeMenuItem(state, 'edit', 'undo')).toBe(true);
    expect(getMenuItems(state, 'edit')).toHaveLength(1);
    expect(getMenuItems(state, 'edit')[0]?.id).toBe('redo');
  });

  it('returns false for non-existent item', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    expect(removeMenuItem(state, 'edit', 'missing')).toBe(false);
  });

  it('returns false for non-existent menu', () => {
    const state = createMenuBarState();
    expect(removeMenuItem(state, 'missing', 'item')).toBe(false);
  });
});

describe('getMenuItems', () => {
  it('returns empty array for unknown menu', () => {
    expect(getMenuItems(createMenuBarState(), 'missing')).toEqual([]);
  });

  it('returns items for a menu', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    addMenuItem(state, 'file', createMenuItem('new', 'New'));
    expect(getMenuItems(state, 'file')).toHaveLength(1);
  });
});

describe('getMenuItem', () => {
  it('finds a top-level item', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    addMenuItem(state, 'file', createMenuItem('new', 'New', { commandId: 'file.new' }));
    const item = getMenuItem(state, 'file', 'new');
    expect(item?.commandId).toBe('file.new');
  });

  it('finds an item in a submenu', () => {
    const state = createMenuBarState();
    addMenu(state, 'view', 'View');
    const sub = createSubmenu('zoom', 'Zoom', [createMenuItem('zoom-in', 'Zoom In')]);
    addMenuItem(state, 'view', sub);
    expect(getMenuItem(state, 'view', 'zoom-in')?.label).toBe('Zoom In');
  });

  it('returns null for non-existent item', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    expect(getMenuItem(state, 'file', 'missing')).toBeNull();
  });

  it('returns null for non-existent menu', () => {
    expect(getMenuItem(createMenuBarState(), 'missing', 'item')).toBeNull();
  });
});

describe('setMenuItemEnabled', () => {
  it('disables and enables a menu item', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    addMenuItem(state, 'edit', createMenuItem('undo', 'Undo'));
    expect(setMenuItemEnabled(state, 'edit', 'undo', false)).toBe(true);
    expect(getMenuItem(state, 'edit', 'undo')?.enabled).toBe(false);
    expect(setMenuItemEnabled(state, 'edit', 'undo', true)).toBe(true);
    expect(getMenuItem(state, 'edit', 'undo')?.enabled).toBe(true);
  });

  it('is idempotent for same value', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    addMenuItem(state, 'edit', createMenuItem('undo', 'Undo'));
    const v = getMenuBarVersion(state);
    expect(setMenuItemEnabled(state, 'edit', 'undo', true)).toBe(false);
    expect(getMenuBarVersion(state)).toBe(v);
  });

  it('returns false for non-existent menu', () => {
    expect(setMenuItemEnabled(createMenuBarState(), 'missing', 'item', false)).toBe(false);
  });

  it('returns false for non-existent item', () => {
    const state = createMenuBarState();
    addMenu(state, 'edit', 'Edit');
    expect(setMenuItemEnabled(state, 'edit', 'missing', false)).toBe(false);
  });

  it('enables items in submenus', () => {
    const state = createMenuBarState();
    addMenu(state, 'view', 'View');
    const sub = createSubmenu('zoom', 'Zoom', [createMenuItem('zoom-in', 'Zoom In')]);
    addMenuItem(state, 'view', sub);
    expect(setMenuItemEnabled(state, 'view', 'zoom-in', false)).toBe(true);
    expect(getMenuItem(state, 'view', 'zoom-in')?.enabled).toBe(false);
  });
});

describe('setMenuItemChecked', () => {
  it('checks and unchecks a menu item', () => {
    const state = createMenuBarState();
    addMenu(state, 'view', 'View');
    addMenuItem(state, 'view', createMenuItem('grid', 'Show Grid'));
    expect(setMenuItemChecked(state, 'view', 'grid', true)).toBe(true);
    expect(getMenuItem(state, 'view', 'grid')?.checked).toBe(true);
    expect(setMenuItemChecked(state, 'view', 'grid', false)).toBe(true);
    expect(getMenuItem(state, 'view', 'grid')?.checked).toBe(false);
  });

  it('is idempotent for same value', () => {
    const state = createMenuBarState();
    addMenu(state, 'view', 'View');
    addMenuItem(state, 'view', createMenuItem('grid', 'Show Grid'));
    const v = getMenuBarVersion(state);
    expect(setMenuItemChecked(state, 'view', 'grid', false)).toBe(false);
    expect(getMenuBarVersion(state)).toBe(v);
  });

  it('returns false for non-existent item', () => {
    const state = createMenuBarState();
    addMenu(state, 'view', 'View');
    expect(setMenuItemChecked(state, 'view', 'missing', true)).toBe(false);
  });
});

describe('getMenuBarVersion', () => {
  it('starts at 0', () => {
    expect(getMenuBarVersion(createMenuBarState())).toBe(0);
  });

  it('tracks cumulative changes', () => {
    const state = createMenuBarState();
    addMenu(state, 'file', 'File');
    addMenuItem(state, 'file', createMenuItem('new', 'New'));
    addMenu(state, 'edit', 'Edit');
    expect(getMenuBarVersion(state)).toBe(3);
  });
});
