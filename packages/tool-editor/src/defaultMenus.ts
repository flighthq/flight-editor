import { addMenu, addMenuItem, createMenuItem, createSeparator, createSubmenu } from '@flighthq/editor-menu';

import type { MenuBarState } from '@flighthq/editor-menu';

import { getDefaultShortcutLabel } from './defaultShortcuts';

function item(id: string, label: string, commandId?: string): ReturnType<typeof createMenuItem> {
  return createMenuItem(id, label, {
    commandId: commandId ?? id,
    shortcutLabel: getDefaultShortcutLabel(commandId ?? id) ?? undefined,
  });
}

export function registerDefaultMenus(menuBar: MenuBarState): void {
  addMenu(menuBar, 'file', 'File');
  addMenuItem(menuBar, 'file', item('clearScene', 'New'));
  addMenuItem(menuBar, 'file', createSeparator('file-sep-1'));

  addMenu(menuBar, 'edit', 'Edit');
  addMenuItem(menuBar, 'edit', item('deleteSelection', 'Delete'));
  addMenuItem(menuBar, 'edit', item('duplicateSelection', 'Duplicate'));
  addMenuItem(menuBar, 'edit', createSeparator('edit-sep-1'));
  addMenuItem(menuBar, 'edit', item('groupNodes', 'Group'));
  addMenuItem(menuBar, 'edit', item('ungroup', 'Ungroup'));
  addMenuItem(menuBar, 'edit', createSeparator('edit-sep-2'));
  addMenuItem(menuBar, 'edit', item('lockSelection', 'Lock'));

  addMenu(menuBar, 'view', 'View');
  addMenuItem(
    menuBar,
    'view',
    createSubmenu('view-zoom', 'Zoom', [
      createMenuItem('zoom-in', 'Zoom In'),
      createMenuItem('zoom-out', 'Zoom Out'),
      createMenuItem('zoom-fit', 'Fit to Window'),
      createMenuItem('zoom-100', 'Actual Size'),
    ]),
  );

  addMenu(menuBar, 'arrange', 'Arrange');
  addMenuItem(menuBar, 'arrange', item('bringForward', 'Bring Forward'));
  addMenuItem(menuBar, 'arrange', item('sendBackward', 'Send Backward'));
  addMenuItem(menuBar, 'arrange', item('bringToFront', 'Bring to Front'));
  addMenuItem(menuBar, 'arrange', item('sendToBack', 'Send to Back'));
  addMenuItem(menuBar, 'arrange', createSeparator('arrange-sep-1'));
  addMenuItem(menuBar, 'arrange', item('alignLeft', 'Align Left'));
  addMenuItem(menuBar, 'arrange', item('alignRight', 'Align Right'));
  addMenuItem(menuBar, 'arrange', item('alignTop', 'Align Top'));
  addMenuItem(menuBar, 'arrange', item('alignBottom', 'Align Bottom'));
  addMenuItem(menuBar, 'arrange', item('alignHorizontalCenters', 'Align Horizontal Centers'));
  addMenuItem(menuBar, 'arrange', item('alignVerticalCenters', 'Align Vertical Centers'));
  addMenuItem(menuBar, 'arrange', createSeparator('arrange-sep-2'));
  addMenuItem(menuBar, 'arrange', item('distributeHorizontally', 'Distribute Horizontally'));
  addMenuItem(menuBar, 'arrange', item('distributeVertically', 'Distribute Vertically'));
  addMenuItem(menuBar, 'arrange', createSeparator('arrange-sep-3'));
  addMenuItem(menuBar, 'arrange', item('flipHorizontal', 'Flip Horizontal'));
  addMenuItem(menuBar, 'arrange', item('flipVertical', 'Flip Vertical'));
  addMenuItem(menuBar, 'arrange', item('resetTransform', 'Reset Transform'));
}

export function getDefaultMenuCount(): number {
  return 4;
}
