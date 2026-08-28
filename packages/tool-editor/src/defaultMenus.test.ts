import { createMenuBarState, getMenu, getMenuCount, getMenuItem, getMenuItems, getMenus } from '@flighthq/editor-menu';
import { describe, expect, it } from 'vitest';

import { getDefaultMenuCount, registerDefaultMenus } from './defaultMenus';

describe('registerDefaultMenus', () => {
  it('registers 4 default menus', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getMenuCount(menuBar)).toBe(4);
  });

  it('registers File menu', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const menu = getMenu(menuBar, 'file');
    expect(menu).not.toBeNull();
    expect(menu!.label).toBe('File');
  });

  it('registers Edit menu', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const menu = getMenu(menuBar, 'edit');
    expect(menu).not.toBeNull();
    expect(menu!.label).toBe('Edit');
  });

  it('registers View menu', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const menu = getMenu(menuBar, 'view');
    expect(menu).not.toBeNull();
    expect(menu!.label).toBe('View');
  });

  it('registers Arrange menu', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const menu = getMenu(menuBar, 'arrange');
    expect(menu).not.toBeNull();
    expect(menu!.label).toBe('Arrange');
  });

  it('registers menus in File, Edit, View, Arrange order', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const menus = getMenus(menuBar);
    expect(menus[0]!.id).toBe('file');
    expect(menus[1]!.id).toBe('edit');
    expect(menus[2]!.id).toBe('view');
    expect(menus[3]!.id).toBe('arrange');
  });

  it('File menu has clearScene item', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const item = getMenuItem(menuBar, 'file', 'clearScene');
    expect(item).not.toBeNull();
    expect(item!.label).toBe('New');
    expect(item!.commandId).toBe('clearScene');
  });

  it('Edit menu has deleteSelection item with commandId', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const item = getMenuItem(menuBar, 'edit', 'deleteSelection');
    expect(item).not.toBeNull();
    expect(item!.commandId).toBe('deleteSelection');
  });

  it('Edit menu has duplicateSelection item', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const item = getMenuItem(menuBar, 'edit', 'duplicateSelection');
    expect(item).not.toBeNull();
    expect(item!.commandId).toBe('duplicateSelection');
    expect(item!.shortcutLabel).toBe('Ctrl+D');
  });

  it('Edit menu has groupNodes and ungroup items', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getMenuItem(menuBar, 'edit', 'groupNodes')).not.toBeNull();
    expect(getMenuItem(menuBar, 'edit', 'ungroup')).not.toBeNull();
  });

  it('Edit menu has lockSelection item', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const item = getMenuItem(menuBar, 'edit', 'lockSelection');
    expect(item).not.toBeNull();
    expect(item!.commandId).toBe('lockSelection');
  });

  it('View menu has zoom submenu', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const item = getMenuItem(menuBar, 'view', 'view-zoom');
    expect(item).not.toBeNull();
    expect(item!.role).toBe('submenu');
    expect(item!.children).toHaveLength(4);
  });

  it('Arrange menu has z-order items', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getMenuItem(menuBar, 'arrange', 'bringForward')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'sendBackward')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'bringToFront')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'sendToBack')).not.toBeNull();
  });

  it('Arrange menu has alignment items', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getMenuItem(menuBar, 'arrange', 'alignLeft')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'alignRight')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'alignTop')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'alignBottom')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'alignHorizontalCenters')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'alignVerticalCenters')).not.toBeNull();
  });

  it('Arrange menu has distribute items', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getMenuItem(menuBar, 'arrange', 'distributeHorizontally')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'distributeVertically')).not.toBeNull();
  });

  it('Arrange menu has flip and reset items', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getMenuItem(menuBar, 'arrange', 'flipHorizontal')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'flipVertical')).not.toBeNull();
    expect(getMenuItem(menuBar, 'arrange', 'resetTransform')).not.toBeNull();
  });

  it('File menu includes separators', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const items = getMenuItems(menuBar, 'file');
    const separators = items.filter((i) => i.role === 'separator');
    expect(separators.length).toBeGreaterThanOrEqual(1);
  });

  it('Edit menu includes separators', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const items = getMenuItems(menuBar, 'edit');
    const separators = items.filter((i) => i.role === 'separator');
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it('items have shortcut labels from defaults', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    const groupItem = getMenuItem(menuBar, 'edit', 'groupNodes');
    expect(groupItem!.shortcutLabel).toBe('Ctrl+G');
    const bringFwd = getMenuItem(menuBar, 'arrange', 'bringForward');
    expect(bringFwd!.shortcutLabel).toBe('Ctrl+]');
  });

  it('can be called multiple times (idempotent menus)', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    registerDefaultMenus(menuBar);
    expect(getMenuCount(menuBar)).toBe(4);
  });
});

describe('getDefaultMenuCount', () => {
  it('returns 4', () => {
    expect(getDefaultMenuCount()).toBe(4);
  });

  it('matches the actual registered count', () => {
    const menuBar = createMenuBarState();
    registerDefaultMenus(menuBar);
    expect(getDefaultMenuCount()).toBe(getMenuCount(menuBar));
  });
});
