import { getRegisteredActions } from '@flighthq/editor-keyboard';
import { getMenuCount } from '@flighthq/editor-menu';
import { getRegisteredToolIds } from '@flighthq/editor-tool';
import { describe, expect, it } from 'vitest';

import {
  getRegisteredCommandCount,
  getRegisteredMenuCount,
  getRegisteredShortcutCount,
  initEditor,
} from './initEditor';

describe('initEditor', () => {
  it('creates an editor with all defaults registered', () => {
    const editor = initEditor();
    expect(editor.commandRegistry.size).toBeGreaterThan(0);
    expect(editor.keyboard.bindings.size).toBeGreaterThan(0);
    expect(getMenuCount(editor.menuBar)).toBeGreaterThan(0);
    expect(getRegisteredToolIds(editor.toolRegistry).length).toBeGreaterThan(0);
  });

  it('uses default 800x600 viewport', () => {
    const editor = initEditor();
    expect(editor.viewport.camera.viewportWidth).toBe(800);
    expect(editor.viewport.camera.viewportHeight).toBe(600);
  });

  it('accepts custom viewport dimensions', () => {
    const editor = initEditor({ viewportWidth: 1920, viewportHeight: 1080 });
    expect(editor.viewport.camera.viewportWidth).toBe(1920);
    expect(editor.viewport.camera.viewportHeight).toBe(1080);
  });

  it('starts with null scene', () => {
    const editor = initEditor();
    expect(editor.scene).toBeNull();
  });

  it('registers default commands', () => {
    const editor = initEditor();
    expect(editor.commandRegistry.has('deleteSelection')).toBe(true);
    expect(editor.commandRegistry.has('duplicateSelection')).toBe(true);
    expect(editor.commandRegistry.has('groupNodes')).toBe(true);
    expect(editor.commandRegistry.has('clearScene')).toBe(true);
  });

  it('registers default shortcuts', () => {
    const editor = initEditor();
    const actions = getRegisteredActions(editor.keyboard);
    expect(actions).toContain('deleteSelection');
    expect(actions).toContain('duplicateSelection');
    expect(actions).toContain('groupNodes');
  });

  it('registers default menus', () => {
    const editor = initEditor();
    expect(getMenuCount(editor.menuBar)).toBe(4);
  });

  it('registers default tools', () => {
    const editor = initEditor();
    expect(getRegisteredToolIds(editor.toolRegistry).length).toBeGreaterThan(0);
  });

  it('skips defaults when skipDefaults is true', () => {
    const editor = initEditor({ skipDefaults: true });
    expect(editor.commandRegistry.size).toBe(0);
    expect(editor.keyboard.bindings.size).toBe(0);
    expect(getMenuCount(editor.menuBar)).toBe(0);
    expect(getRegisteredToolIds(editor.toolRegistry).length).toBe(0);
  });

  it('applies host adapter when provided', () => {
    const mockAdapter = {
      capabilities: {
        hasFileSystem: true,
        hasClipboard: true,
        hasNativeMenus: true,
        hasNativeDialogs: true,
        hasDragDrop: true,
      },
      showOpenDialog: () => Promise.resolve(null),
      showSaveDialog: () => Promise.resolve(null),
      readFile: () => Promise.reject(new Error('not implemented')),
      writeFile: () => Promise.reject(new Error('not implemented')),
      readClipboardText: () => Promise.resolve(''),
      writeClipboardText: () => Promise.resolve(),
      setWindowTitle: () => {},
      showMessage: () => {},
    };
    const editor = initEditor({ hostAdapter: mockAdapter });
    expect(editor.host.adapter.capabilities.hasFileSystem).toBe(true);
    expect(editor.host.adapter.capabilities.hasNativeMenus).toBe(true);
  });

  it('defaults to headless adapter when no host provided', () => {
    const editor = initEditor();
    expect(editor.host.adapter.capabilities.hasFileSystem).toBe(false);
    expect(editor.host.adapter.capabilities.hasNativeMenus).toBe(false);
  });

  it('creates independent instances', () => {
    const a = initEditor();
    const b = initEditor();
    expect(a.selection).not.toBe(b.selection);
    expect(a.commandRegistry).not.toBe(b.commandRegistry);
    expect(a.keyboard).not.toBe(b.keyboard);
  });
});

describe('getRegisteredCommandCount', () => {
  it('returns command count after init', () => {
    const editor = initEditor();
    expect(getRegisteredCommandCount(editor)).toBeGreaterThan(20);
  });

  it('returns 0 when skipDefaults', () => {
    const editor = initEditor({ skipDefaults: true });
    expect(getRegisteredCommandCount(editor)).toBe(0);
  });
});

describe('getRegisteredMenuCount', () => {
  it('returns 4 default menus', () => {
    const editor = initEditor();
    expect(getRegisteredMenuCount(editor)).toBe(4);
  });
});

describe('getRegisteredShortcutCount', () => {
  it('returns 22 default shortcuts', () => {
    const editor = initEditor();
    expect(getRegisteredShortcutCount(editor)).toBe(22);
  });
});
