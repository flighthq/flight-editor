import type { HostAdapter } from '@flighthq/editor-host';

import { executeCommand } from '@flighthq/editor-command';
import { createDesktopCapabilities } from '@flighthq/editor-host';
import { describe, expect, it, vi } from 'vitest';

import { createDesktopEditor, isDesktopEditorModified } from './desktopEditor';
import { markEditorDirty } from './dirtyTracker';

function createMockAdapter(): HostAdapter {
  return {
    capabilities: createDesktopCapabilities(),
    showOpenDialog: () => Promise.resolve(null),
    showSaveDialog: () => Promise.resolve(null),
    readFile: () => Promise.reject(new Error('mock')),
    writeFile: () => Promise.resolve(),
    readClipboardText: () => Promise.resolve(''),
    writeClipboardText: () => Promise.resolve(),
    setWindowTitle: vi.fn(),
    showMessage: vi.fn(),
  };
}

describe('createDesktopEditor', () => {
  it('creates an editor with a scene', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    expect(editor.state.scene).not.toBeNull();
    expect(editor.state).toBe(editor.runtime.state);
  });

  it('creates without scene when autoCreateScene is false', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter(), autoCreateScene: false });
    expect(editor.state.scene).toBeNull();
  });

  it('uses custom viewport dimensions', () => {
    const editor = createDesktopEditor({
      hostAdapter: createMockAdapter(),
      viewportWidth: 1920,
      viewportHeight: 1080,
    });
    expect(editor.state.viewport.camera.viewportWidth).toBe(1920);
  });

  it('tick runs without error', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    expect(() => editor.tick()).not.toThrow();
  });

  it('tick notifies host on changes', () => {
    const adapter = createMockAdapter();
    const onDirtyChange = vi.fn();
    const editor = createDesktopEditor({
      hostAdapter: adapter,
      callbacks: { onDirtyChange },
    });
    executeCommand(editor.state.commandHistory, { label: 'test', execute() {}, undo() {} });
    editor.tick();
    expect(onDirtyChange).toHaveBeenCalledWith(true);
  });

  it('updates window title', () => {
    const adapter = createMockAdapter();
    const editor = createDesktopEditor({ hostAdapter: adapter });
    editor.updateTitle();
    expect(adapter.setWindowTitle).toHaveBeenCalled();
  });

  it('resize updates viewport', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    editor.resize(1600, 900);
    expect(editor.state.viewport.camera.viewportWidth).toBe(1600);
    expect(editor.state.viewport.camera.viewportHeight).toBe(900);
  });

  it('dispose clears the scene', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    editor.dispose();
    expect(editor.state.scene).toBeNull();
  });

  it('close clears the scene', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    editor.close();
    expect(editor.state.scene).toBeNull();
  });

  it('newFile creates a fresh scene', async () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    const result = await editor.newFile(1024, 768, 'Test');
    expect(result).toBe(true);
    expect(editor.state.scene).not.toBeNull();
  });

  it('save returns not-saved with no path', async () => {
    const adapter = createMockAdapter();
    adapter.showSaveDialog = () => Promise.resolve(null);
    const editor = createDesktopEditor({ hostAdapter: adapter });
    const result = await editor.save();
    expect(result.saved).toBe(false);
  });

  it('saveAs returns not-saved when dialog cancelled', async () => {
    const adapter = createMockAdapter();
    adapter.showSaveDialog = () => Promise.resolve(null);
    const editor = createDesktopEditor({ hostAdapter: adapter });
    const result = await editor.saveAs();
    expect(result.saved).toBe(false);
  });

  it('open returns not-opened when dialog cancelled', async () => {
    const adapter = createMockAdapter();
    adapter.showOpenDialog = () => Promise.resolve(null);
    const editor = createDesktopEditor({ hostAdapter: adapter });
    const result = await editor.open();
    expect(result.opened).toBe(false);
  });
});

describe('isDesktopEditorModified', () => {
  it('returns false for clean editor', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    expect(isDesktopEditorModified(editor)).toBe(false);
  });

  it('returns true after executing a command', () => {
    const editor = createDesktopEditor({ hostAdapter: createMockAdapter() });
    executeCommand(editor.state.commandHistory, { label: 'test', execute() {}, undo() {} });
    editor.tick();
    expect(isDesktopEditorModified(editor)).toBe(true);
  });
});
