import { describe, expect, it } from 'vitest';

import { createEditorState, getEditorScene, setEditorScene } from './editorState';

describe('createEditorState', () => {
  it('initializes with null scene and empty subsystems', () => {
    const state = createEditorState();
    expect(getEditorScene(state)).toBeNull();
    expect(state.clipboard.entries).toHaveLength(0);
    expect(state.commandHistory.undoStack).toHaveLength(0);
    expect(state.hierarchy.expanded.size).toBe(0);
    expect(state.nodeFactory.entries.size).toBe(0);
    expect(state.selection.nodes).toHaveLength(0);
    expect(state.toolRegistry.activeToolId).toBeNull();
    expect(state.viewport.config.minZoom).toBe(0.05);
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
