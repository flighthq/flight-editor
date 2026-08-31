import { describe, expect, it } from 'vitest';

import { createEditorState, getEditorScene, setEditorScene } from './editorState';

describe('createEditorState', () => {
  it('initializes with null scene and empty subsystems', () => {
    const state = createEditorState();
    expect(getEditorScene(state)).toBeNull();
    expect(state.clipboard.entries).toHaveLength(0);
    expect(state.commandRegistry.size).toBe(0);
    expect(state.commandHistory.undoStack).toHaveLength(0);
    expect(state.contextMenu.registeredItems.size).toBe(0);
    expect(state.diagnostics.batches.size).toBe(0);
    expect(state.editingScope.stack.map((scope) => scope.identity)).toEqual(['document']);
    expect(state.exportSettings.slices.size).toBe(0);
    expect(state.hierarchy.expanded.size).toBe(0);
    expect(state.gesture.active).toBeNull();
    expect(state.nodeFactory.entries.size).toBe(0);
    expect(state.pages.pages).toHaveLength(0);
    expect(state.preview.phase).toBe('stopped');
    expect(state.selection.nodes).toHaveLength(0);
    expect(state.session.documents.size).toBe(0);
    expect(state.rulers.visible).toBe(true);
    expect(state.textStyle.fontSize).toBe(16);
    expect(state.toolRegistry.activeToolId).toBeNull();
    expect(state.transformOrigin.mode).toBe('center');
    expect(state.viewport.config.minZoom).toBe(0.05);
    expect(state.zoomPresets.presets.map((preset) => preset.id)).toEqual(['fit', '50%', '100%', '200%', '400%']);
  });

  it('initializes an empty keyboard map', () => {
    const state = createEditorState();

    expect(state.keyboard.bindings.size).toBe(0);
    expect(state.keyboard.version).toBe(0);
  });

  it('initializes default scene metadata', () => {
    const state = createEditorState();

    expect(state.sceneState.name).toBe('Untitled');
    expect(state.sceneState.width).toBe(800);
    expect(state.sceneState.height).toBe(600);
    expect(state.sceneState.dirty).toBe(false);
  });

  it('initializes disabled snapping with an empty guide list', () => {
    const state = createEditorState();

    expect(state.snap.gridEnabled).toBe(false);
    expect(state.snap.guidesEnabled).toBe(false);
    expect(state.snap.guides).toEqual([]);
    expect(state.snap.version).toBe(0);
  });

  it('initializes file state with no current file', () => {
    const state = createEditorState();
    expect(state.file.currentPath).toBeNull();
    expect(state.file.dirty).toBe(false);
    expect(state.file.saveStatus).toBe('idle');
    expect(state.file.recentFiles).toHaveLength(0);
  });

  it('initializes empty menu bar', () => {
    const state = createEditorState();
    expect(state.menuBar.menus).toHaveLength(0);
    expect(state.menuBar.version).toBe(0);
  });

  it('initializes empty property panel', () => {
    const state = createEditorState();
    expect(state.properties.definitions.size).toBe(0);
    expect(state.properties.categories).toHaveLength(0);
  });

  it('initializes status bar with defaults', () => {
    const state = createEditorState();
    expect(state.statusBar.message).toBeNull();
    expect(state.statusBar.zoomPercent).toBe(100);
    expect(state.statusBar.activeToolName).toBe('');
  });

  it('initializes document state in empty lifecycle', () => {
    const state = createEditorState();
    expect(state.document.lifecycle).toBe('empty');
    expect(state.document.metadata.title).toBe('Untitled');
    expect(state.document.metadata.format).toBe('flight');
    expect(state.document.errorMessage).toBeNull();
  });

  it('initializes host adapter in headless mode', () => {
    const state = createEditorState();
    expect(state.host.adapter.capabilities.hasFileSystem).toBe(false);
    expect(state.host.adapter.capabilities.hasNativeMenus).toBe(false);
    expect(state.host.callbacks).toEqual({});
    expect(state.host.version).toBe(0);
  });

  it('initializes an empty toolbar', () => {
    const state = createEditorState();
    expect(state.toolbar.groups).toEqual([]);
    expect(state.toolbar.version).toBe(0);
  });

  it('initializes an empty panel layout', () => {
    const state = createEditorState();
    expect(state.panels.panels).toEqual([]);
    expect(state.panels.version).toBe(0);
  });

  it('initializes canvas display defaults', () => {
    const state = createEditorState();
    expect(state.canvas.backgroundPattern).toBe('checkerboard');
    expect(state.canvas.pixelRatio).toBe(1);
    expect(state.canvas.overlayOpacity).toBe(1);
    expect(state.canvas.version).toBe(0);
  });

  it('initializes workspace preferences', () => {
    const state = createEditorState();
    expect(state.preferences.gridSize).toBe(10);
    expect(state.preferences.autosaveEnabled).toBe(true);
    expect(state.preferences.theme).toBe('system');
    expect(state.preferences.version).toBe(0);
  });
});

describe('getEditorScene', () => {
  it('returns the current scene', () => {
    const state = createEditorState();
    expect(getEditorScene(state)).toBeNull();
  });
});

describe('setEditorScene', () => {
  it('replaces the scene', () => {
    const state = createEditorState();
    const mockScene = {} as any;
    setEditorScene(state, mockScene);
    expect(getEditorScene(state)).toBe(mockScene);
  });

  it('accepts null to clear', () => {
    const state = createEditorState();
    setEditorScene(state, {} as any);
    setEditorScene(state, null);
    expect(getEditorScene(state)).toBeNull();
  });
});

describe('createEditorState viewport dimensions', () => {
  it('uses default 800x600 viewport', () => {
    const state = createEditorState();
    expect(state.viewport.camera.viewportWidth).toBe(800);
    expect(state.viewport.camera.viewportHeight).toBe(600);
  });

  it('accepts custom viewport dimensions', () => {
    const state = createEditorState(1920, 1080);
    expect(state.viewport.camera.viewportWidth).toBe(1920);
    expect(state.viewport.camera.viewportHeight).toBe(1080);
  });

  it('subsystems are independent across instances', () => {
    const a = createEditorState();
    const b = createEditorState();
    expect(a.selection).not.toBe(b.selection);
    expect(a.commandHistory).not.toBe(b.commandHistory);
    expect(a.clipboard).not.toBe(b.clipboard);
  });
});
