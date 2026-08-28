export interface ContextMenuItem {
  readonly id: string;
  label: string;
  shortcut: string | null;
  enabled: boolean;
  separator: boolean;
  children: ContextMenuItem[];
}

export interface ContextMenuState {
  readonly registeredItems: Map<string, ContextMenuItem>;
  readonly activeItemIds: string[];
  open: boolean;
  x: number;
  y: number;
  version: number;
}

export function createContextMenuState(): ContextMenuState {
  return {
    registeredItems: new Map(),
    activeItemIds: [],
    open: false,
    x: 0,
    y: 0,
    version: 0,
  };
}

export function registerMenuItem(state: ContextMenuState, item: Readonly<ContextMenuItem>): void {
  const next = cloneMenuItem(item);
  const current = state.registeredItems.get(item.id);
  if (current && menuItemsEqual(current, next)) return;
  state.registeredItems.set(item.id, next);
  state.version++;
}

export function unregisterMenuItem(state: ContextMenuState, id: string): boolean {
  if (!state.registeredItems.delete(id)) return false;
  removeActiveItemId(state.activeItemIds, id);
  state.version++;
  return true;
}

export function getMenuItems(state: Readonly<ContextMenuState>): readonly ContextMenuItem[] {
  return [...state.registeredItems.values()].map(cloneMenuItem);
}

export function getMenuItem(state: Readonly<ContextMenuState>, id: string): ContextMenuItem | undefined {
  for (const item of state.registeredItems.values()) {
    const match = findMenuItem(item, id);
    if (match) return cloneMenuItem(match);
  }
  return undefined;
}

export function openContextMenu(state: ContextMenuState, x: number, y: number, items: readonly string[]): void {
  const nextIds = [...new Set(items)].filter((id) => getStoredMenuItem(state, id) !== undefined);
  if (state.open && state.x === x && state.y === y && arraysEqual(state.activeItemIds, nextIds)) return;
  state.open = true;
  state.x = x;
  state.y = y;
  state.activeItemIds.splice(0, state.activeItemIds.length, ...nextIds);
  state.version++;
}

export function closeContextMenu(state: ContextMenuState): void {
  if (!state.open) return;
  state.open = false;
  state.activeItemIds.length = 0;
  state.version++;
}

export function isContextMenuOpen(state: Readonly<ContextMenuState>): boolean {
  return state.open;
}

export function getContextMenuPosition(state: Readonly<ContextMenuState>): Readonly<{ x: number; y: number }> | null {
  return state.open ? { x: state.x, y: state.y } : null;
}

export function getContextMenuItems(state: Readonly<ContextMenuState>): readonly ContextMenuItem[] {
  if (!state.open) return [];
  return state.activeItemIds.flatMap((id) => {
    const item = getStoredMenuItem(state, id);
    return item ? [cloneMenuItem(item)] : [];
  });
}

export function setMenuItemEnabled(state: ContextMenuState, id: string, enabled: boolean): boolean {
  const item = getStoredMenuItem(state, id);
  if (!item || item.enabled === enabled) return false;
  item.enabled = enabled;
  state.version++;
  return true;
}

export function getContextMenuVersion(state: Readonly<ContextMenuState>): number {
  return state.version;
}

function cloneMenuItem(item: Readonly<ContextMenuItem>): ContextMenuItem {
  return {
    id: item.id,
    label: item.label,
    shortcut: item.shortcut,
    enabled: item.enabled,
    separator: item.separator,
    children: item.children.map(cloneMenuItem),
  };
}

function findMenuItem(item: ContextMenuItem, id: string): ContextMenuItem | undefined {
  if (item.id === id) return item;
  for (const child of item.children) {
    const match = findMenuItem(child, id);
    if (match) return match;
  }
  return undefined;
}

function getStoredMenuItem(state: Readonly<ContextMenuState>, id: string): ContextMenuItem | undefined {
  for (const item of state.registeredItems.values()) {
    const match = findMenuItem(item, id);
    if (match) return match;
  }
  return undefined;
}

function menuItemsEqual(a: Readonly<ContextMenuItem>, b: Readonly<ContextMenuItem>): boolean {
  return (
    a.id === b.id &&
    a.label === b.label &&
    a.shortcut === b.shortcut &&
    a.enabled === b.enabled &&
    a.separator === b.separator &&
    a.children.length === b.children.length &&
    a.children.every((child, index) => menuItemsEqual(child, b.children[index]!))
  );
}

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function removeActiveItemId(ids: string[], id: string): void {
  const index = ids.indexOf(id);
  if (index !== -1) ids.splice(index, 1);
}
