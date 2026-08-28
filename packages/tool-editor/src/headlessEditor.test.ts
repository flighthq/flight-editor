import { addNodeChild, getNodeChildCount } from '@flighthq/node';
import { addToSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createHeadlessEditor, isHeadlessEditorReady } from './headlessEditor';
import { addNode, deleteSelection } from './nodeOperations';
import { undoCommand, canUndo } from './historyUtils';
import { lockEditorNode, isEditorNodeLocked } from './lockManager';
import { getZoomLevel, zoomIn } from './zoomController';
import { getRegisteredCommandCount, getRegisteredShortcutCount } from './initEditor';

describe('createHeadlessEditor', () => {
  it('creates a ready editor with a scene', () => {
    const editor = createHeadlessEditor();
    expect(isHeadlessEditorReady(editor)).toBe(true);
    expect(editor.state.scene).not.toBeNull();
  });

  it('creates without a scene when autoCreateScene is false', () => {
    const editor = createHeadlessEditor({ autoCreateScene: false });
    expect(isHeadlessEditorReady(editor)).toBe(false);
    expect(editor.state.scene).toBeNull();
  });

  it('respects custom viewport dimensions', () => {
    const editor = createHeadlessEditor({ viewportWidth: 1920, viewportHeight: 1080 });
    expect(editor.state.viewport.camera.viewportWidth).toBe(1920);
    expect(editor.state.viewport.camera.viewportHeight).toBe(1080);
  });

  it('registers default commands and shortcuts', () => {
    const editor = createHeadlessEditor();
    expect(getRegisteredCommandCount(editor.state)).toBeGreaterThan(0);
    expect(getRegisteredShortcutCount(editor.state)).toBeGreaterThan(0);
  });

  it('supports add and undo node operations', () => {
    const editor = createHeadlessEditor();
    const root = editor.state.scene!.root;
    const child = createNode2D(DisplayObjectKind);
    addNode(editor.state, root, child);
    expect(getNodeChildCount(root)).toBe(1);
    expect(canUndo(editor.state)).toBe(true);
    undoCommand(editor.state);
    expect(getNodeChildCount(root)).toBe(0);
  });

  it('supports delete selection', () => {
    const editor = createHeadlessEditor();
    const root = editor.state.scene!.root;
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    addToSelection(editor.state.selection, child);
    expect(deleteSelection(editor.state)).toBe(true);
    expect(getNodeChildCount(root)).toBe(0);
  });

  it('supports locking nodes', () => {
    const editor = createHeadlessEditor();
    const child = createNode2D(DisplayObjectKind);
    lockEditorNode(editor.state, child);
    expect(isEditorNodeLocked(editor.state, child)).toBe(true);
  });

  it('supports zoom operations', () => {
    const editor = createHeadlessEditor();
    const initial = getZoomLevel(editor.state);
    zoomIn(editor.state);
    expect(getZoomLevel(editor.state)).toBeGreaterThan(initial);
  });

  it('tick runs without error', () => {
    const editor = createHeadlessEditor();
    expect(() => editor.tick()).not.toThrow();
  });

  it('dispose clears the scene', () => {
    const editor = createHeadlessEditor();
    editor.dispose();
    expect(isHeadlessEditorReady(editor)).toBe(false);
  });
});

describe('isHeadlessEditorReady', () => {
  it('reflects scene presence', () => {
    const editor = createHeadlessEditor({ autoCreateScene: false });
    expect(isHeadlessEditorReady(editor)).toBe(false);
  });
});
