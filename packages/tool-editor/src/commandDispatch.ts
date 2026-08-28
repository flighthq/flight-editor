import type { EditorState } from './editorState';

import { matchKeyEvent } from '@flighthq/editor-keyboard';
import { getMenuItem, getMenus } from '@flighthq/editor-menu';
import { redo, undo } from '@flighthq/editor-command';

import { executeNamedCommand } from './commandRegistry';

import type { MenuItem } from '@flighthq/editor-menu';

export interface KeyEventLike {
  readonly key: string;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
}

export function dispatchKeyEvent(editor: EditorState, event: Readonly<KeyEventLike>): boolean {
  const actionId = matchKeyEvent(editor.keyboard, event);
  if (actionId === null) return false;
  return dispatchAction(editor, actionId);
}

export function dispatchMenuItem(editor: EditorState, menuId: string, itemId: string): boolean {
  const item = getMenuItem(editor.menuBar, menuId, itemId);
  if (item === null || !item.enabled || item.commandId === null) return false;
  return dispatchAction(editor, item.commandId);
}

export function dispatchAction(editor: EditorState, actionId: string): boolean {
  if (actionId === 'undo') {
    return undo(editor.commandHistory);
  }
  if (actionId === 'redo') {
    return redo(editor.commandHistory);
  }
  return executeNamedCommand(editor, actionId);
}

export function getMenuItemsForAction(editor: Readonly<EditorState>, actionId: string): readonly MenuItem[] {
  const results: MenuItem[] = [];
  for (const menu of getMenus(editor.menuBar)) {
    for (const item of menu.items) {
      collectMatchingItems(item, actionId, results);
    }
  }
  return results;
}

function collectMatchingItems(item: Readonly<MenuItem>, actionId: string, results: MenuItem[]): void {
  if (item.commandId === actionId) {
    results.push(item);
  }
  for (const child of item.children) {
    collectMatchingItems(child, actionId, results);
  }
}
