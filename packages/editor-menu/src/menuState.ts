export type MenuItemRole = 'normal' | 'separator' | 'submenu';

export interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly role: MenuItemRole;
  readonly commandId: string | null;
  readonly shortcutLabel: string | null;
  readonly enabled: boolean;
  readonly checked: boolean;
  readonly children: MenuItem[];
}

export interface MenuBarState {
  menus: MenuDefinition[];
  version: number;
}

export interface MenuDefinition {
  readonly id: string;
  readonly label: string;
  items: MenuItem[];
}

export function createMenuBarState(): MenuBarState {
  return { menus: [], version: 0 };
}

export function addMenu(state: MenuBarState, id: string, label: string): void {
  if (state.menus.some((m) => m.id === id)) return;
  state.menus.push({ id, label, items: [] });
  state.version++;
}

export function removeMenu(state: MenuBarState, menuId: string): boolean {
  const index = state.menus.findIndex((m) => m.id === menuId);
  if (index === -1) return false;
  state.menus.splice(index, 1);
  state.version++;
  return true;
}

export function getMenus(state: Readonly<MenuBarState>): readonly MenuDefinition[] {
  return state.menus;
}

export function getMenu(state: Readonly<MenuBarState>, menuId: string): MenuDefinition | null {
  return state.menus.find((m) => m.id === menuId) ?? null;
}

export function getMenuCount(state: Readonly<MenuBarState>): number {
  return state.menus.length;
}

export function createMenuItem(
  id: string,
  label: string,
  options?: {
    commandId?: string;
    shortcutLabel?: string;
    enabled?: boolean;
    checked?: boolean;
  },
): MenuItem {
  return {
    id,
    label,
    role: 'normal',
    commandId: options?.commandId ?? null,
    shortcutLabel: options?.shortcutLabel ?? null,
    enabled: options?.enabled ?? true,
    checked: options?.checked ?? false,
    children: [],
  };
}

export function createSeparator(id: string): MenuItem {
  return {
    id,
    label: '',
    role: 'separator',
    commandId: null,
    shortcutLabel: null,
    enabled: false,
    checked: false,
    children: [],
  };
}

export function createSubmenu(id: string, label: string, children: MenuItem[]): MenuItem {
  return {
    id,
    label,
    role: 'submenu',
    commandId: null,
    shortcutLabel: null,
    enabled: true,
    checked: false,
    children: children.slice(),
  };
}

export function addMenuItem(state: MenuBarState, menuId: string, item: MenuItem): boolean {
  const menu = state.menus.find((m) => m.id === menuId);
  if (!menu) return false;
  menu.items.push(item);
  state.version++;
  return true;
}

export function removeMenuItem(state: MenuBarState, menuId: string, itemId: string): boolean {
  const menu = state.menus.find((m) => m.id === menuId);
  if (!menu) return false;
  const index = menu.items.findIndex((i) => i.id === itemId);
  if (index === -1) return false;
  menu.items.splice(index, 1);
  state.version++;
  return true;
}

export function getMenuItems(state: Readonly<MenuBarState>, menuId: string): readonly MenuItem[] {
  const menu = state.menus.find((m) => m.id === menuId);
  return menu ? menu.items : [];
}

export function getMenuItem(state: Readonly<MenuBarState>, menuId: string, itemId: string): MenuItem | null {
  const menu = state.menus.find((m) => m.id === menuId);
  if (!menu) return null;
  return findItemDeep(menu.items, itemId);
}

function findItemDeep(items: readonly MenuItem[], itemId: string): MenuItem | null {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.children.length > 0) {
      const found = findItemDeep(item.children, itemId);
      if (found) return found;
    }
  }
  return null;
}

export function setMenuItemEnabled(state: MenuBarState, menuId: string, itemId: string, enabled: boolean): boolean {
  const menu = state.menus.find((m) => m.id === menuId);
  if (!menu) return false;
  const item = findItemMutableDeep(menu.items, itemId);
  if (!item || item.enabled === enabled) return false;
  replaceItem(menu.items, itemId, { ...item, enabled });
  state.version++;
  return true;
}

export function setMenuItemChecked(state: MenuBarState, menuId: string, itemId: string, checked: boolean): boolean {
  const menu = state.menus.find((m) => m.id === menuId);
  if (!menu) return false;
  const item = findItemMutableDeep(menu.items, itemId);
  if (!item || item.checked === checked) return false;
  replaceItem(menu.items, itemId, { ...item, checked });
  state.version++;
  return true;
}

function findItemMutableDeep(items: MenuItem[], itemId: string): MenuItem | null {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.children.length > 0) {
      const found = findItemMutableDeep(item.children as MenuItem[], itemId);
      if (found) return found;
    }
  }
  return null;
}

function replaceItem(items: MenuItem[], itemId: string, replacement: MenuItem): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i]!.id === itemId) {
      items[i] = replacement;
      return true;
    }
    if (items[i]!.children.length > 0) {
      if (replaceItem(items[i]!.children as MenuItem[], itemId, replacement)) return true;
    }
  }
  return false;
}

export function getMenuBarVersion(state: Readonly<MenuBarState>): number {
  return state.version;
}
