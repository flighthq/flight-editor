import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorSnapGuide,
  clearEditorSnapGuides,
  enableEditorSnapGrid,
  getEditorSnapGridSize,
  isEditorSnapGridEnabled,
  removeEditorSnapGuide,
  setEditorSnapGrid,
  snapEditorPosition,
} from './snapManager';

describe('setEditorSnapGrid', () => {
  it('sets grid size', () => {
    const editor = createEditorState();
    setEditorSnapGrid(editor, 20, 20);
    const size = getEditorSnapGridSize(editor);
    expect(size.x).toBe(20);
    expect(size.y).toBe(20);
  });
});

describe('enableEditorSnapGrid', () => {
  it('enables the snap grid', () => {
    const editor = createEditorState();
    enableEditorSnapGrid(editor, true);
    expect(isEditorSnapGridEnabled(editor)).toBe(true);
  });

  it('disables the snap grid', () => {
    const editor = createEditorState();
    enableEditorSnapGrid(editor, true);
    enableEditorSnapGrid(editor, false);
    expect(isEditorSnapGridEnabled(editor)).toBe(false);
  });
});

describe('isEditorSnapGridEnabled', () => {
  it('returns the enabled state', () => {
    const editor = createEditorState();
    expect(typeof isEditorSnapGridEnabled(editor)).toBe('boolean');
  });
});

describe('getEditorSnapGridSize', () => {
  it('returns the grid size', () => {
    const editor = createEditorState();
    const size = getEditorSnapGridSize(editor);
    expect(typeof size.x).toBe('number');
    expect(typeof size.y).toBe('number');
  });
});

describe('addEditorSnapGuide', () => {
  it('adds a snap guide', () => {
    const editor = createEditorState();
    addEditorSnapGuide(editor, { axis: 'x', position: 100 });
    expect(editor.snap.guides).toHaveLength(1);
  });
});

describe('removeEditorSnapGuide', () => {
  it('removes a snap guide by index', () => {
    const editor = createEditorState();
    addEditorSnapGuide(editor, { axis: 'x', position: 100 });
    removeEditorSnapGuide(editor, 0);
    expect(editor.snap.guides).toHaveLength(0);
  });
});

describe('clearEditorSnapGuides', () => {
  it('clears all snap guides', () => {
    const editor = createEditorState();
    addEditorSnapGuide(editor, { axis: 'x', position: 50 });
    addEditorSnapGuide(editor, { axis: 'y', position: 100 });
    clearEditorSnapGuides(editor);
    expect(editor.snap.guides).toHaveLength(0);
  });
});

describe('snapEditorPosition', () => {
  it('snaps to grid when enabled', () => {
    const editor = createEditorState();
    enableEditorSnapGrid(editor, true);
    setEditorSnapGrid(editor, 10, 10);
    const result = snapEditorPosition(editor, 12, 18);
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
  });

  it('returns original position when grid is disabled', () => {
    const editor = createEditorState();
    enableEditorSnapGrid(editor, false);
    const result = snapEditorPosition(editor, 12, 18);
    expect(result.x).toBe(12);
    expect(result.y).toBe(18);
  });
});
