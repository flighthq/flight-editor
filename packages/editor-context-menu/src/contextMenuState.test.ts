import { describe, expect, it } from 'vitest';

import type { ContextMenuItem } from './contextMenuState';

import {
  closeContextMenu,
  createContextMenuState,
  getContextMenuItems,
  getContextMenuPosition,
  getContextMenuVersion,
  getMenuItem,
  getMenuItems,
  isContextMenuOpen,
  openContextMenu,
  registerMenuItem,
  setMenuItemEnabled,
  unregisterMenuItem,
} from './contextMenuState';

function item(id: string, children: ContextMenuItem[] = []): ContextMenuItem {
  return { id, label: id.toUpperCase(), shortcut: null, enabled: true, separator: false, children };
}

describe('createContextMenuState', () => {
  it('starts closed with an empty registry', () => {
    const state = createContextMenuState();
    expect(getMenuItems(state)).toEqual([]);
    expect(isContextMenuOpen(state)).toBe(false);
    expect(getContextMenuPosition(state)).toBeNull();
    expect(getContextMenuVersion(state)).toBe(0);
  });
});

describe('registerMenuItem', () => {
  it('copies, inserts, and replaces items while guarding equivalent registrations', () => {
    const state = createContextMenuState();
    const source = item('copy');
    registerMenuItem(state, source);
    source.label = 'mutated';
    registerMenuItem(state, item('copy'));
    expect(getMenuItem(state, 'copy')?.label).toBe('COPY');
    expect(getContextMenuVersion(state)).toBe(1);

    registerMenuItem(state, { ...item('copy'), label: 'Copy node' });
    expect(getMenuItem(state, 'copy')?.label).toBe('Copy node');
    expect(getContextMenuVersion(state)).toBe(2);
  });
});

describe('unregisterMenuItem', () => {
  it('removes registered and active items and rejects unknown ids', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('copy'));
    openContextMenu(state, 1, 2, ['copy']);
    expect(unregisterMenuItem(state, 'copy')).toBe(true);
    expect(getContextMenuItems(state)).toEqual([]);
    expect(unregisterMenuItem(state, 'copy')).toBe(false);
  });
});

describe('getMenuItems', () => {
  it('returns registry order without exposing stored values', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('copy'));
    registerMenuItem(state, item('paste'));
    const items = getMenuItems(state);
    items[0]!.label = 'changed';
    expect(getMenuItems(state).map(({ id }) => id)).toEqual(['copy', 'paste']);
    expect(getMenuItem(state, 'copy')?.label).toBe('COPY');
  });
});

describe('getMenuItem', () => {
  it('finds nested items and returns undefined for missing ids', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('edit', [item('copy')]));
    expect(getMenuItem(state, 'copy')?.id).toBe('copy');
    expect(getMenuItem(state, 'missing')).toBeUndefined();
  });
});

describe('openContextMenu', () => {
  it('opens with unique registered ids and no-ops for an identical request', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('copy'));
    registerMenuItem(state, item('paste'));
    openContextMenu(state, 10, 20, ['copy', 'missing', 'copy', 'paste']);
    const version = getContextMenuVersion(state);
    expect(getContextMenuItems(state).map(({ id }) => id)).toEqual(['copy', 'paste']);
    openContextMenu(state, 10, 20, ['copy', 'paste']);
    expect(getContextMenuVersion(state)).toBe(version);
  });
});

describe('closeContextMenu', () => {
  it('closes and clears the active menu with a redundant-close guard', () => {
    const state = createContextMenuState();
    closeContextMenu(state);
    expect(getContextMenuVersion(state)).toBe(0);
    openContextMenu(state, 0, 0, []);
    closeContextMenu(state);
    const version = getContextMenuVersion(state);
    expect(isContextMenuOpen(state)).toBe(false);
    expect(getContextMenuItems(state)).toEqual([]);
    closeContextMenu(state);
    expect(getContextMenuVersion(state)).toBe(version);
  });
});

describe('isContextMenuOpen', () => {
  it('reports open state', () => {
    const state = createContextMenuState();
    openContextMenu(state, 0, 0, []);
    expect(isContextMenuOpen(state)).toBe(true);
  });
});

describe('getContextMenuPosition', () => {
  it('returns the active screen position only while open', () => {
    const state = createContextMenuState();
    openContextMenu(state, -4, 12, []);
    expect(getContextMenuPosition(state)).toEqual({ x: -4, y: 12 });
    closeContextMenu(state);
    expect(getContextMenuPosition(state)).toBeNull();
  });
});

describe('getContextMenuItems', () => {
  it('resolves nested active ids to isolated item copies', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('edit', [item('copy')]));
    openContextMenu(state, 0, 0, ['copy']);
    const active = getContextMenuItems(state);
    active[0]!.enabled = false;
    expect(getContextMenuItems(state)[0]?.enabled).toBe(true);
  });
});

describe('setMenuItemEnabled', () => {
  it('updates nested items and guards missing or unchanged values', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('edit', [item('copy')]));
    const version = getContextMenuVersion(state);
    expect(setMenuItemEnabled(state, 'copy', false)).toBe(true);
    expect(getMenuItem(state, 'copy')?.enabled).toBe(false);
    expect(setMenuItemEnabled(state, 'copy', false)).toBe(false);
    expect(setMenuItemEnabled(state, 'missing', false)).toBe(false);
    expect(getContextMenuVersion(state)).toBe(version + 1);
  });
});

describe('getContextMenuVersion', () => {
  it('tracks observable changes', () => {
    const state = createContextMenuState();
    registerMenuItem(state, item('copy'));
    openContextMenu(state, 1, 2, ['copy']);
    closeContextMenu(state);
    expect(getContextMenuVersion(state)).toBe(3);
  });
});
