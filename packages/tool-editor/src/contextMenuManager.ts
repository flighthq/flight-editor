import type { EditorState } from './editorState';

import {
  closeContextMenu,
  getContextMenuItems,
  isContextMenuOpen,
  openContextMenu,
  registerMenuItem,
} from '@flighthq/editor-context-menu';
import { getSelectionCount } from '@flighthq/editor-selection';

import type { ContextMenuItem } from '@flighthq/editor-context-menu';

import { getDefaultShortcutLabel } from './defaultShortcuts';

function createItem(id: string, label: string, shortcut: string | null = null): ContextMenuItem {
  return { id, label, shortcut, enabled: true, separator: false, children: [] };
}

function createSeparator(id: string): ContextMenuItem {
  return { id, label: '', shortcut: null, enabled: false, separator: true, children: [] };
}

export function registerDefaultContextMenuItems(editor: EditorState): void {
  const items: ContextMenuItem[] = [
    createItem('ctx-cut', 'Cut', getDefaultShortcutLabel('cut')),
    createItem('ctx-copy', 'Copy', getDefaultShortcutLabel('copy')),
    createItem('ctx-paste', 'Paste', getDefaultShortcutLabel('paste')),
    createSeparator('ctx-sep-1'),
    createItem('ctx-duplicate', 'Duplicate', getDefaultShortcutLabel('duplicate')),
    createItem('ctx-delete', 'Delete', getDefaultShortcutLabel('delete')),
    createSeparator('ctx-sep-2'),
    createItem('ctx-group', 'Group', getDefaultShortcutLabel('group')),
    createItem('ctx-ungroup', 'Ungroup', getDefaultShortcutLabel('ungroup')),
    createSeparator('ctx-sep-3'),
    createItem('ctx-bring-to-front', 'Bring to Front'),
    createItem('ctx-bring-forward', 'Bring Forward'),
    createItem('ctx-send-backward', 'Send Backward'),
    createItem('ctx-send-to-back', 'Send to Back'),
    createSeparator('ctx-sep-4'),
    createItem('ctx-lock', 'Lock', getDefaultShortcutLabel('lock')),
  ];

  for (const item of items) {
    registerMenuItem(editor.contextMenu, item);
  }
}

export function getContextMenuItemCount(): number {
  return 16;
}

export const CONTEXT_MENU_ACTION_MAP: Readonly<Record<string, string>> = {
  'ctx-cut': 'cut',
  'ctx-copy': 'copy',
  'ctx-paste': 'paste',
  'ctx-duplicate': 'duplicate',
  'ctx-delete': 'delete',
  'ctx-group': 'group',
  'ctx-ungroup': 'ungroup',
  'ctx-bring-to-front': 'bring-to-front',
  'ctx-bring-forward': 'bring-forward',
  'ctx-send-backward': 'send-backward',
  'ctx-send-to-back': 'send-to-back',
  'ctx-lock': 'lock',
};

export function openEditorContextMenu(editor: EditorState, x: number, y: number): void {
  const hasSelection = getSelectionCount(editor.selection) > 0;

  const selectionItems = [
    'ctx-cut',
    'ctx-copy',
    'ctx-duplicate',
    'ctx-delete',
    'ctx-group',
    'ctx-ungroup',
    'ctx-bring-to-front',
    'ctx-bring-forward',
    'ctx-send-backward',
    'ctx-send-to-back',
    'ctx-lock',
  ];

  const itemIds = hasSelection
    ? [
        'ctx-cut',
        'ctx-copy',
        'ctx-paste',
        'ctx-sep-1',
        'ctx-duplicate',
        'ctx-delete',
        'ctx-sep-2',
        'ctx-group',
        'ctx-ungroup',
        'ctx-sep-3',
        'ctx-bring-to-front',
        'ctx-bring-forward',
        'ctx-send-backward',
        'ctx-send-to-back',
        'ctx-sep-4',
        'ctx-lock',
      ]
    : ['ctx-paste'];

  for (const id of selectionItems) {
    const item = editor.contextMenu.registeredItems.get(id);
    if (item) item.enabled = hasSelection;
  }

  openContextMenu(editor.contextMenu, x, y, itemIds);
}

export function closeEditorContextMenu(editor: EditorState): void {
  closeContextMenu(editor.contextMenu);
}

export function isEditorContextMenuOpen(editor: Readonly<EditorState>): boolean {
  return isContextMenuOpen(editor.contextMenu);
}

export function getEditorContextMenuItems(editor: Readonly<EditorState>): readonly ContextMenuItem[] {
  return getContextMenuItems(editor.contextMenu);
}

export function getContextMenuActionId(menuItemId: string): string | null {
  return CONTEXT_MENU_ACTION_MAP[menuItemId] ?? null;
}
