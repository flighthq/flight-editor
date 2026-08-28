import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  getZoomLevel,
  getZoomPercent,
  getZoomPercentLabel,
  setZoomLevel,
  zoomIn,
  zoomOut,
  zoomToActualSize,
  zoomToFit,
} from './zoomController';

describe('getZoomLevel', () => {
  it('returns initial zoom of 1', () => {
    const editor = createEditorState();
    expect(getZoomLevel(editor)).toBe(1);
  });
});

describe('getZoomPercent', () => {
  it('returns 100 at default zoom', () => {
    const editor = createEditorState();
    expect(getZoomPercent(editor)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 0.333);
    expect(getZoomPercent(editor)).toBe(33);
  });
});

describe('getZoomPercentLabel', () => {
  it('returns formatted label', () => {
    const editor = createEditorState();
    expect(getZoomPercentLabel(editor)).toBe('100%');
  });

  it('reflects changed zoom', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 2);
    expect(getZoomPercentLabel(editor)).toBe('200%');
  });
});

describe('setZoomLevel', () => {
  it('sets viewport zoom', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 2);
    expect(getZoomLevel(editor)).toBe(2);
  });

  it('updates status bar zoom percent', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 0.5);
    expect(editor.statusBar.zoomPercent).toBe(50);
  });

  it('clamps to minimum', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 0.001);
    expect(getZoomLevel(editor)).toBeGreaterThanOrEqual(0.01);
  });

  it('clamps to maximum', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 100);
    expect(getZoomLevel(editor)).toBeLessThanOrEqual(64);
  });
});

describe('zoomIn', () => {
  it('zooms to next preset level', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 1);
    const result = zoomIn(editor);
    expect(result).toBe(true);
    expect(getZoomLevel(editor)).toBe(2);
  });

  it('returns false at maximum preset', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 4);
    const result = zoomIn(editor);
    expect(result).toBe(false);
    expect(getZoomLevel(editor)).toBe(4);
  });
});

describe('zoomOut', () => {
  it('zooms to previous preset level', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 1);
    const result = zoomOut(editor);
    expect(result).toBe(true);
    expect(getZoomLevel(editor)).toBe(0.5);
  });

  it('returns false at minimum preset', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 0.5);
    const result = zoomOut(editor);
    expect(result).toBe(false);
    expect(getZoomLevel(editor)).toBe(0.5);
  });
});

describe('zoomToActualSize', () => {
  it('resets zoom to 1', () => {
    const editor = createEditorState();
    setZoomLevel(editor, 3);
    zoomToActualSize(editor);
    expect(getZoomLevel(editor)).toBe(1);
  });
});

describe('zoomToFit', () => {
  it('computes fit zoom for scene dimensions', () => {
    const editor = createEditorState(800, 600);
    zoomToFit(editor, 1600, 1200);
    expect(getZoomLevel(editor)).toBe(0.5);
  });

  it('uses narrower dimension', () => {
    const editor = createEditorState(800, 600);
    zoomToFit(editor, 800, 1200);
    expect(getZoomLevel(editor)).toBe(0.5);
  });

  it('defaults to 1 for zero dimensions', () => {
    const editor = createEditorState(800, 600);
    zoomToFit(editor, 0, 0);
    expect(getZoomLevel(editor)).toBe(1);
  });
});
