import { describe, expect, it } from 'vitest';

import { formatShortcut, parseShortcutString, shortcutMatchesEvent } from './shortcutDisplay';

describe('formatShortcut', () => {
  it('formats mac shortcut with command key', () => {
    const result = formatShortcut({ meta: true, key: 'z' }, 'mac');
    expect(result).toBe('⌘Z');
  });

  it('formats mac shortcut with multiple modifiers', () => {
    const result = formatShortcut({ meta: true, shift: true, key: 's' }, 'mac');
    expect(result).toBe('⇧⌘S');
  });

  it('formats windows shortcut with plus separators', () => {
    const result = formatShortcut({ ctrl: true, key: 'z' }, 'windows');
    expect(result).toBe('Ctrl+Z');
  });

  it('formats windows shortcut with shift', () => {
    const result = formatShortcut({ ctrl: true, shift: true, key: 's' }, 'windows');
    expect(result).toBe('Ctrl+Shift+S');
  });

  it('formats mac delete key', () => {
    const result = formatShortcut({ key: 'Backspace' }, 'mac');
    expect(result).toBe('⌫');
  });

  it('formats mac enter key', () => {
    const result = formatShortcut({ key: 'Enter' }, 'mac');
    expect(result).toBe('↩');
  });

  it('formats windows delete key', () => {
    const result = formatShortcut({ key: 'Delete' }, 'windows');
    expect(result).toBe('Del');
  });

  it('formats arrow keys', () => {
    expect(formatShortcut({ key: 'ArrowUp' }, 'mac')).toBe('↑');
    expect(formatShortcut({ key: 'ArrowDown' }, 'windows')).toBe('↓');
  });

  it('uses Ctrl for meta on windows', () => {
    const result = formatShortcut({ meta: true, key: 'c' }, 'windows');
    expect(result).toBe('Ctrl+C');
  });

  it('formats linux same as windows', () => {
    const result = formatShortcut({ ctrl: true, key: 'v' }, 'linux');
    expect(result).toBe('Ctrl+V');
  });
});

describe('parseShortcutString', () => {
  it('parses simple shortcut', () => {
    const parts = parseShortcutString('Ctrl+Z');
    expect(parts.ctrl).toBe(true);
    expect(parts.key).toBe('Z');
  });

  it('parses multi-modifier shortcut', () => {
    const parts = parseShortcutString('Ctrl+Shift+S');
    expect(parts.ctrl).toBe(true);
    expect(parts.shift).toBe(true);
    expect(parts.key).toBe('S');
  });

  it('parses meta/cmd', () => {
    const parts = parseShortcutString('Cmd+Z');
    expect(parts.meta).toBe(true);
    expect(parts.key).toBe('Z');
  });

  it('parses alt/option', () => {
    const parts = parseShortcutString('Alt+X');
    expect(parts.alt).toBe(true);
    expect(parts.key).toBe('X');
  });

  it('handles empty string', () => {
    const parts = parseShortcutString('');
    expect(parts.key).toBe('');
  });
});

describe('shortcutMatchesEvent', () => {
  it('matches exact modifier combination', () => {
    const parts = { ctrl: true, key: 'z' };
    const event = { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: 'z' };
    expect(shortcutMatchesEvent(parts, event)).toBe(true);
  });

  it('rejects extra modifier', () => {
    const parts = { ctrl: true, key: 'z' };
    const event = { ctrlKey: true, shiftKey: true, altKey: false, metaKey: false, key: 'z' };
    expect(shortcutMatchesEvent(parts, event)).toBe(false);
  });

  it('rejects wrong key', () => {
    const parts = { ctrl: true, key: 'z' };
    const event = { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: 'x' };
    expect(shortcutMatchesEvent(parts, event)).toBe(false);
  });

  it('matches case-insensitively', () => {
    const parts = { ctrl: true, key: 'Z' };
    const event = { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: 'z' };
    expect(shortcutMatchesEvent(parts, event)).toBe(true);
  });

  it('treats undefined modifiers as false', () => {
    const parts = { key: 'a' };
    const event = { ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, key: 'a' };
    expect(shortcutMatchesEvent(parts, event)).toBe(true);
  });
});
