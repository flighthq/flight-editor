import { createKeyboardMap, getKeyBinding, getRegisteredActions, matchKeyEvent } from '@flighthq/editor-keyboard';
import { describe, expect, it } from 'vitest';

import { getDefaultShortcutLabel, registerDefaultShortcuts } from './defaultShortcuts';

describe('registerDefaultShortcuts', () => {
  it('registers 17 default shortcuts', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    expect(getRegisteredActions(keyboard)).toHaveLength(22);
  });

  it('registers Delete for deleteSelection', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const binding = getKeyBinding(keyboard, 'deleteSelection');
    expect(binding?.key).toBe('Delete');
  });

  it('registers Ctrl+D for duplicateSelection', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const binding = getKeyBinding(keyboard, 'duplicateSelection');
    expect(binding?.key).toBe('d');
    expect(binding?.ctrl).toBe(true);
  });

  it('registers Ctrl+G for groupNodes', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const binding = getKeyBinding(keyboard, 'groupNodes');
    expect(binding?.key).toBe('g');
    expect(binding?.ctrl).toBe(true);
  });

  it('registers Ctrl+Shift+G for ungroup', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const binding = getKeyBinding(keyboard, 'ungroup');
    expect(binding?.key).toBe('g');
    expect(binding?.ctrl).toBe(true);
    expect(binding?.shift).toBe(true);
  });

  it('registers Ctrl+] for bringForward', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const binding = getKeyBinding(keyboard, 'bringForward');
    expect(binding?.key).toBe(']');
    expect(binding?.ctrl).toBe(true);
  });

  it('matches keyboard events', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const event = { key: 'd', ctrlKey: true, shiftKey: false, altKey: false, metaKey: false };
    expect(matchKeyEvent(keyboard, event)).toBe('duplicateSelection');
  });

  it('does not match unbound events', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    const event = { key: 'q', ctrlKey: true, shiftKey: false, altKey: false, metaKey: false };
    expect(matchKeyEvent(keyboard, event)).toBeNull();
  });

  it('can be called multiple times (replaces bindings)', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    registerDefaultShortcuts(keyboard);
    expect(getRegisteredActions(keyboard)).toHaveLength(22);
  });

  it('registers alignment shortcuts with Ctrl+Shift+Arrow', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    expect(getKeyBinding(keyboard, 'alignLeft')?.key).toBe('ArrowLeft');
    expect(getKeyBinding(keyboard, 'alignRight')?.key).toBe('ArrowRight');
    expect(getKeyBinding(keyboard, 'alignTop')?.key).toBe('ArrowUp');
    expect(getKeyBinding(keyboard, 'alignBottom')?.key).toBe('ArrowDown');
  });

  it('registers flip shortcuts', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    expect(getKeyBinding(keyboard, 'flipHorizontal')?.key).toBe('h');
    expect(getKeyBinding(keyboard, 'flipVertical')?.key).toBe('v');
  });
});

describe('getDefaultShortcutLabel', () => {
  it('returns human-readable labels for known shortcuts', () => {
    expect(getDefaultShortcutLabel('deleteSelection')).toBe('Del');
    expect(getDefaultShortcutLabel('duplicateSelection')).toBe('Ctrl+D');
    expect(getDefaultShortcutLabel('groupNodes')).toBe('Ctrl+G');
    expect(getDefaultShortcutLabel('bringForward')).toBe('Ctrl+]');
    expect(getDefaultShortcutLabel('sendToBack')).toBe('Ctrl+Shift+[');
  });

  it('returns null for unknown shortcuts', () => {
    expect(getDefaultShortcutLabel('unknown')).toBeNull();
  });

  it('has labels for all registered shortcuts', () => {
    const keyboard = createKeyboardMap();
    registerDefaultShortcuts(keyboard);
    for (const action of getRegisteredActions(keyboard)) {
      expect(getDefaultShortcutLabel(action)).not.toBeNull();
    }
  });
});
