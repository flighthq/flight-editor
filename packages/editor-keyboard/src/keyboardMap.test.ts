import { describe, expect, it } from 'vitest';

import {
  createKeyboardMap,
  getKeyBinding,
  getRegisteredActions,
  matchKeyEvent,
  registerKeyBinding,
  unregisterKeyBinding,
} from './keyboardMap';

const baseEvent = {
  key: 'x',
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
};

describe('keyboardMap', () => {
  it('registers bindings and exposes their action ids', () => {
    const map = createKeyboardMap();

    registerKeyBinding(map, 'edit.copy', { key: 'c', ctrl: true });

    expect(getKeyBinding(map, 'edit.copy')).toEqual({ key: 'c', ctrl: true });
    expect(getRegisteredActions(map)).toEqual(['edit.copy']);
    expect(map.version).toBe(1);
  });

  it('matches keys case-insensitively with exact modifiers', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.copy', { key: 'c', ctrl: true });

    expect(matchKeyEvent(map, { ...baseEvent, key: 'C', ctrlKey: true })).toBe('edit.copy');
    expect(matchKeyEvent(map, { ...baseEvent, key: 'c', ctrlKey: true, shiftKey: true })).toBeNull();
  });

  it('returns null when no binding matches', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.copy', { key: 'c', ctrl: true });

    expect(matchKeyEvent(map, { ...baseEvent, key: 'v', ctrlKey: true })).toBeNull();
  });

  it('overrides an action binding', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.copy', { key: 'c', ctrl: true });
    registerKeyBinding(map, 'edit.copy', { key: 'Insert', ctrl: true });

    expect(getKeyBinding(map, 'edit.copy')).toEqual({ key: 'Insert', ctrl: true });
    expect(matchKeyEvent(map, { ...baseEvent, key: 'insert', ctrlKey: true })).toBe('edit.copy');
    expect(map.version).toBe(2);
  });

  it('unregisters bindings and only increments for a change', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.copy', { key: 'c', ctrl: true });

    unregisterKeyBinding(map, 'edit.copy');
    unregisterKeyBinding(map, 'edit.copy');

    expect(getKeyBinding(map, 'edit.copy')).toBeNull();
    expect(getRegisteredActions(map)).toEqual([]);
    expect(map.version).toBe(2);
  });
});
