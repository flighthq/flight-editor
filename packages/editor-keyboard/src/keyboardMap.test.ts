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
  it('starts empty at version zero', () => {
    const map = createKeyboardMap();

    expect(getRegisteredActions(map)).toEqual([]);
    expect(getKeyBinding(map, 'missing')).toBeNull();
    expect(map.version).toBe(0);
  });

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

  it('matches the correct action among multiple bindings', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.copy', { key: 'c', ctrl: true });
    registerKeyBinding(map, 'edit.paste', { key: 'v', ctrl: true });
    registerKeyBinding(map, 'file.save', { key: 's', ctrl: true });

    expect(matchKeyEvent(map, { ...baseEvent, key: 'v', ctrlKey: true })).toBe('edit.paste');
    expect(matchKeyEvent(map, { ...baseEvent, key: 's', ctrlKey: true })).toBe('file.save');
  });

  it('matches a ctrl and shift combination', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.paste-unformatted', { key: 'v', ctrl: true, shift: true });

    expect(matchKeyEvent(map, { ...baseEvent, key: 'v', ctrlKey: true, shiftKey: true })).toBe(
      'edit.paste-unformatted',
    );
    expect(matchKeyEvent(map, { ...baseEvent, key: 'v', ctrlKey: true })).toBeNull();
  });

  it('matches an alt and meta combination', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'window.command', { key: 'k', alt: true, meta: true });

    expect(matchKeyEvent(map, { ...baseEvent, key: 'k', altKey: true, metaKey: true })).toBe('window.command');
    expect(matchKeyEvent(map, { ...baseEvent, key: 'k', altKey: true })).toBeNull();
  });

  it('matches alphabetic keys regardless of registration casing', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.select-all', { key: 'A', ctrl: true });

    expect(matchKeyEvent(map, { ...baseEvent, key: 'a', ctrlKey: true })).toBe('edit.select-all');
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

  it('copies a binding when registering it', () => {
    const map = createKeyboardMap();
    const binding = { key: 'c', ctrl: true };

    registerKeyBinding(map, 'edit.copy', binding);
    binding.key = 'v';

    expect(getKeyBinding(map, 'edit.copy')).toEqual({ key: 'c', ctrl: true });
  });

  it('returns every registered action in registration order', () => {
    const map = createKeyboardMap();
    registerKeyBinding(map, 'edit.copy', { key: 'c' });
    registerKeyBinding(map, 'edit.paste', { key: 'v' });
    registerKeyBinding(map, 'edit.undo', { key: 'z' });

    expect(getRegisteredActions(map)).toEqual(['edit.copy', 'edit.paste', 'edit.undo']);
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

  it('does not increment the version when unregistering a missing action', () => {
    const map = createKeyboardMap();

    unregisterKeyBinding(map, 'missing');

    expect(map.version).toBe(0);
  });
});
