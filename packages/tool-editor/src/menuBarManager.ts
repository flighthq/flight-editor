import type { MenuDefinition, MenuItem } from '@flighthq/editor-menu';
import type { EditorState } from './editorState';

import {
  addMenu,
  addMenuItem,
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
} from '@flighthq/editor-menu';

export function addEditorMenu(editor: EditorState, id: string, label: string): void {
  addMenu(editor.menuBar, id, label);
}

export function removeEditorMenu(editor: EditorState, menuId: string): boolean {
  return removeMenu(editor.menuBar, menuId);
}

export function getEditorMenu(editor: Readonly<EditorState>, menuId: string): MenuDefinition | null {
  return getMenu(editor.menuBar, menuId);
}

export function getEditorMenus(editor: Readonly<EditorState>): readonly MenuDefinition[] {
  return getMenus(editor.menuBar);
}

export function getEditorMenuCount(editor: Readonly<EditorState>): number {
  return getMenuCount(editor.menuBar);
}

export function addEditorMenuItem(editor: EditorState, menuId: string, item: MenuItem): boolean {
  return addMenuItem(editor.menuBar, menuId, item);
}

export function removeEditorMenuItem(editor: EditorState, menuId: string, itemId: string): boolean {
  return removeMenuItem(editor.menuBar, menuId, itemId);
}

export function getEditorMenuItem(editor: Readonly<EditorState>, menuId: string, itemId: string): MenuItem | null {
  return getMenuItem(editor.menuBar, menuId, itemId);
}

export function getEditorMenuItems(editor: Readonly<EditorState>, menuId: string): readonly MenuItem[] {
  return getMenuItems(editor.menuBar, menuId);
}

export function setEditorMenuItemEnabled(editor: EditorState, menuId: string, itemId: string, enabled: boolean): void {
  setMenuItemEnabled(editor.menuBar, menuId, itemId, enabled);
}

export function setEditorMenuItemChecked(editor: EditorState, menuId: string, itemId: string, checked: boolean): void {
  setMenuItemChecked(editor.menuBar, menuId, itemId, checked);
}

export function createEditorMenuItem(
  id: string,
  label: string,
  options?: { commandId?: string; shortcutLabel?: string; enabled?: boolean; checked?: boolean },
): MenuItem {
  return createMenuItem(id, label, options);
}

export function createEditorMenuSeparator(id: string): MenuItem {
  return createSeparator(id);
}

export function createEditorSubmenu(id: string, label: string, children: MenuItem[]): MenuItem {
  return createSubmenu(id, label, children);
}

export function getEditorMenuBarVersion(editor: Readonly<EditorState>): number {
  return getMenuBarVersion(editor.menuBar);
}
