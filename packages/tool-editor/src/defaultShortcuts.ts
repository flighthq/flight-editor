import { registerKeyBinding } from '@flighthq/editor-keyboard';

import type { KeyboardMap } from '@flighthq/editor-keyboard';

export function registerDefaultShortcuts(keyboard: KeyboardMap): void {
  registerKeyBinding(keyboard, 'undo', { key: 'z', ctrl: true });
  registerKeyBinding(keyboard, 'redo', { key: 'z', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'copy', { key: 'c', ctrl: true });
  registerKeyBinding(keyboard, 'cut', { key: 'x', ctrl: true });
  registerKeyBinding(keyboard, 'paste', { key: 'v', ctrl: true });
  registerKeyBinding(keyboard, 'deleteSelection', { key: 'Delete' });
  registerKeyBinding(keyboard, 'deleteSelection.backspace', { key: 'Backspace' });
  registerKeyBinding(keyboard, 'duplicateSelection', { key: 'd', ctrl: true });
  registerKeyBinding(keyboard, 'groupNodes', { key: 'g', ctrl: true });
  registerKeyBinding(keyboard, 'ungroup', { key: 'g', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'lockSelection', { key: 'l', ctrl: true });
  registerKeyBinding(keyboard, 'bringForward', { key: ']', ctrl: true });
  registerKeyBinding(keyboard, 'sendBackward', { key: '[', ctrl: true });
  registerKeyBinding(keyboard, 'bringToFront', { key: ']', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'sendToBack', { key: '[', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'alignLeft', { key: 'ArrowLeft', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'alignRight', { key: 'ArrowRight', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'alignTop', { key: 'ArrowUp', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'alignBottom', { key: 'ArrowDown', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'flipHorizontal', { key: 'h', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'flipVertical', { key: 'v', ctrl: true, shift: true });
  registerKeyBinding(keyboard, 'resetTransform', { key: '0', ctrl: true, shift: true });
}

export function getDefaultShortcutLabel(actionId: string): string | null {
  const labels: Record<string, string> = {
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Shift+Z',
    copy: 'Ctrl+C',
    cut: 'Ctrl+X',
    paste: 'Ctrl+V',
    deleteSelection: 'Del',
    'deleteSelection.backspace': 'Backspace',
    duplicateSelection: 'Ctrl+D',
    groupNodes: 'Ctrl+G',
    ungroup: 'Ctrl+Shift+G',
    lockSelection: 'Ctrl+L',
    bringForward: 'Ctrl+]',
    sendBackward: 'Ctrl+[',
    bringToFront: 'Ctrl+Shift+]',
    sendToBack: 'Ctrl+Shift+[',
    alignLeft: 'Ctrl+Shift+Left',
    alignRight: 'Ctrl+Shift+Right',
    alignTop: 'Ctrl+Shift+Up',
    alignBottom: 'Ctrl+Shift+Down',
    flipHorizontal: 'Ctrl+Shift+H',
    flipVertical: 'Ctrl+Shift+V',
    resetTransform: 'Ctrl+Shift+0',
  };
  return labels[actionId] ?? null;
}
