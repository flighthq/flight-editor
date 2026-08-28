import { getDocumentLifecycle, getDocumentTitle } from '@flighthq/editor-document';
import { isFileDirty } from '@flighthq/editor-file';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { closeScene, createNewScene, getSceneName, getSceneSize, hasScene } from './sceneManager';

describe('createNewScene', () => {
  it('creates a scene with default dimensions', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(hasScene(editor)).toBe(true);
    expect(editor.scene).not.toBeNull();
  });

  it('uses custom dimensions', () => {
    const editor = createEditorState();
    createNewScene(editor, 1920, 1080);
    const size = getSceneSize(editor);
    expect(size.width).toBe(1920);
    expect(size.height).toBe(1080);
  });

  it('sets scene name', () => {
    const editor = createEditorState();
    createNewScene(editor, 800, 600, 'My Scene');
    expect(getSceneName(editor)).toBe('My Scene');
  });

  it('defaults name to Untitled', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(getSceneName(editor)).toBe('Untitled');
  });

  it('sets document lifecycle to ready', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(getDocumentLifecycle(editor.document)).toBe('ready');
  });

  it('sets document title', () => {
    const editor = createEditorState();
    createNewScene(editor, 800, 600, 'Test');
    expect(getDocumentTitle(editor.document)).toBe('Test');
  });

  it('clears selection', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(editor.selection.nodes).toHaveLength(0);
  });

  it('clears command history', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(editor.commandHistory.undoStack).toHaveLength(0);
    expect(editor.commandHistory.redoStack).toHaveLength(0);
  });

  it('marks file as clean', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(isFileDirty(editor.file)).toBe(false);
  });

  it('replaces existing scene', () => {
    const editor = createEditorState();
    createNewScene(editor, 800, 600, 'First');
    const first = editor.scene;
    createNewScene(editor, 1024, 768, 'Second');
    expect(editor.scene).not.toBe(first);
    expect(getSceneName(editor)).toBe('Second');
  });
});

describe('closeScene', () => {
  it('removes the scene', () => {
    const editor = createEditorState();
    createNewScene(editor);
    closeScene(editor);
    expect(hasScene(editor)).toBe(false);
    expect(editor.scene).toBeNull();
  });

  it('clears selection', () => {
    const editor = createEditorState();
    createNewScene(editor);
    closeScene(editor);
    expect(editor.selection.nodes).toHaveLength(0);
  });

  it('clears command history', () => {
    const editor = createEditorState();
    createNewScene(editor);
    closeScene(editor);
    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });

  it('resets document state', () => {
    const editor = createEditorState();
    createNewScene(editor);
    closeScene(editor);
    expect(getDocumentLifecycle(editor.document)).toBe('empty');
  });

  it('is a no-op on empty editor', () => {
    const editor = createEditorState();
    closeScene(editor);
    expect(hasScene(editor)).toBe(false);
  });
});

describe('hasScene', () => {
  it('returns false for empty editor', () => {
    const editor = createEditorState();
    expect(hasScene(editor)).toBe(false);
  });

  it('returns true after creating scene', () => {
    const editor = createEditorState();
    createNewScene(editor);
    expect(hasScene(editor)).toBe(true);
  });
});

describe('getSceneName', () => {
  it('returns current scene name', () => {
    const editor = createEditorState();
    createNewScene(editor, 800, 600, 'Test');
    expect(getSceneName(editor)).toBe('Test');
  });
});

describe('getSceneSize', () => {
  it('returns current scene dimensions', () => {
    const editor = createEditorState();
    createNewScene(editor, 1920, 1080);
    const size = getSceneSize(editor);
    expect(size.width).toBe(1920);
    expect(size.height).toBe(1080);
  });
});
