import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorSwatch,
  clearEditorSwatches,
  getEditorActiveColor,
  getEditorRecentColors,
  getEditorSwatches,
  removeEditorSwatch,
  saveActiveAsSwatch,
  setEditorActiveColor,
} from './colorManager';

describe('setEditorActiveColor', () => {
  it('sets the active color and adds to recent', () => {
    const editor = createEditorState();
    setEditorActiveColor(editor, 0xff0000);
    expect(getEditorActiveColor(editor)).toBe(0xff0000);
    expect(getEditorRecentColors(editor)).toContain(0xff0000);
  });
});

describe('getEditorActiveColor', () => {
  it('returns the initial active color', () => {
    const editor = createEditorState();
    expect(typeof getEditorActiveColor(editor)).toBe('number');
  });
});

describe('addEditorSwatch', () => {
  it('adds a color to swatches', () => {
    const editor = createEditorState();
    addEditorSwatch(editor, 0x00ff00);
    expect(getEditorSwatches(editor)).toContain(0x00ff00);
  });
});

describe('removeEditorSwatch', () => {
  it('removes a swatch by index', () => {
    const editor = createEditorState();
    addEditorSwatch(editor, 0x00ff00);
    expect(removeEditorSwatch(editor, 0)).toBe(true);
    expect(getEditorSwatches(editor)).toHaveLength(0);
  });

  it('returns false for invalid index', () => {
    const editor = createEditorState();
    expect(removeEditorSwatch(editor, 0)).toBe(false);
  });
});

describe('getEditorSwatches', () => {
  it('returns empty initially', () => {
    const editor = createEditorState();
    expect(getEditorSwatches(editor)).toHaveLength(0);
  });
});

describe('clearEditorSwatches', () => {
  it('clears all swatches', () => {
    const editor = createEditorState();
    addEditorSwatch(editor, 0xff0000);
    addEditorSwatch(editor, 0x00ff00);
    clearEditorSwatches(editor);
    expect(getEditorSwatches(editor)).toHaveLength(0);
  });
});

describe('getEditorRecentColors', () => {
  it('returns recent colors after use', () => {
    const editor = createEditorState();
    setEditorActiveColor(editor, 0x0000ff);
    expect(getEditorRecentColors(editor).length).toBeGreaterThanOrEqual(1);
  });
});

describe('saveActiveAsSwatch', () => {
  it('saves the active color as a swatch', () => {
    const editor = createEditorState();
    setEditorActiveColor(editor, 0xaabbcc);
    saveActiveAsSwatch(editor);
    expect(getEditorSwatches(editor)).toContain(0xaabbcc);
  });
});
