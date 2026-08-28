import { describe, expect, it } from 'vitest';

import {
  applyPreferences,
  capturePreferences,
  deserializePreferences,
  getDefaultPreferences,
  mergePreferences,
  serializePreferences,
} from './editorPreferences';
import { initEditor } from './initEditor';

describe('getDefaultPreferences', () => {
  it('returns default values', () => {
    const prefs = getDefaultPreferences();
    expect(prefs.showRulers).toBe(true);
    expect(prefs.snapToGrid).toBe(true);
    expect(prefs.gridSize).toBe(10);
    expect(prefs.theme).toBe('dark');
  });
});

describe('serializePreferences', () => {
  it('produces valid JSON', () => {
    const prefs = getDefaultPreferences();
    const json = serializePreferences(prefs);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('round-trips through deserialize', () => {
    const prefs = getDefaultPreferences();
    const json = serializePreferences(prefs);
    const restored = deserializePreferences(json);
    expect(restored).toEqual(prefs);
  });
});

describe('deserializePreferences', () => {
  it('returns null for invalid JSON', () => {
    expect(deserializePreferences('not-json')).toBeNull();
  });

  it('returns null for non-object JSON', () => {
    expect(deserializePreferences('"string"')).toBeNull();
    expect(deserializePreferences('42')).toBeNull();
    expect(deserializePreferences('null')).toBeNull();
  });

  it('fills missing fields with defaults', () => {
    const prefs = deserializePreferences('{}');
    expect(prefs).not.toBeNull();
    expect(prefs!.showRulers).toBe(true);
    expect(prefs!.theme).toBe('dark');
  });

  it('uses parsed values when correct type', () => {
    const json = JSON.stringify({ showRulers: false, gridSize: 20, theme: 'light' });
    const prefs = deserializePreferences(json);
    expect(prefs!.showRulers).toBe(false);
    expect(prefs!.gridSize).toBe(20);
    expect(prefs!.theme).toBe('light');
  });

  it('ignores wrong-type values', () => {
    const json = JSON.stringify({ showRulers: 'yes', gridSize: 'big' });
    const prefs = deserializePreferences(json);
    expect(prefs!.showRulers).toBe(true);
    expect(prefs!.gridSize).toBe(10);
  });
});

describe('applyPreferences', () => {
  it('applies ruler preferences to editor state', () => {
    const editor = initEditor();
    const prefs = { ...getDefaultPreferences(), showRulers: false };
    applyPreferences(editor, prefs);
    expect(editor.rulers.visible).toBe(false);
  });

  it('applies snap grid preferences to editor state', () => {
    const editor = initEditor();
    const prefs = { ...getDefaultPreferences(), snapToGrid: true, gridSize: 20 };
    applyPreferences(editor, prefs);
    expect(editor.snap.gridEnabled).toBe(true);
    expect(editor.snap.gridSizeX).toBe(20);
    expect(editor.snap.gridSizeY).toBe(20);
  });
});

describe('capturePreferences', () => {
  it('captures ruler state', () => {
    const editor = initEditor();
    editor.rulers.visible = false;
    const captured = capturePreferences(editor);
    expect(captured.showRulers).toBe(false);
  });

  it('captures snap grid state', () => {
    const editor = initEditor();
    editor.snap.gridEnabled = true;
    editor.snap.gridSizeX = 25;
    const captured = capturePreferences(editor);
    expect(captured.snapToGrid).toBe(true);
    expect(captured.gridSize).toBe(25);
  });
});

describe('mergePreferences', () => {
  it('overrides specified fields', () => {
    const base = getDefaultPreferences();
    const merged = mergePreferences(base, { theme: 'light', gridSize: 20 });
    expect(merged.theme).toBe('light');
    expect(merged.gridSize).toBe(20);
  });

  it('preserves unspecified fields', () => {
    const base = getDefaultPreferences();
    const merged = mergePreferences(base, { theme: 'light' });
    expect(merged.showRulers).toBe(base.showRulers);
    expect(merged.snapToGrid).toBe(base.snapToGrid);
  });
});
