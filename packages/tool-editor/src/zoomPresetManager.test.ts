import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorZoomPreset,
  computeEditorFitWidthZoom,
  computeEditorFitZoom,
  findEditorNearestPreset,
  getEditorNextZoomIn,
  getEditorNextZoomOut,
  getEditorZoomPreset,
  getEditorZoomPresetVersion,
  getEditorZoomPresets,
  removeEditorZoomPreset,
} from './zoomPresetManager';

describe('addEditorZoomPreset', () => {
  it('adds a zoom preset', () => {
    const editor = createEditorState();
    addEditorZoomPreset(editor, 'fit', 'Fit', 1);
    expect(getEditorZoomPresets(editor).length).toBeGreaterThan(0);
  });
});

describe('removeEditorZoomPreset', () => {
  it('removes a zoom preset', () => {
    const editor = createEditorState();
    addEditorZoomPreset(editor, 'custom', 'Custom', 2);
    expect(removeEditorZoomPreset(editor, 'custom')).toBe(true);
  });
});

describe('getEditorZoomPreset', () => {
  it('returns a preset by id', () => {
    const editor = createEditorState();
    addEditorZoomPreset(editor, 'half', '50%', 0.5);
    const preset = getEditorZoomPreset(editor, 'half');
    expect(preset).not.toBeNull();
    expect(preset!.zoom).toBe(0.5);
  });
});

describe('getEditorZoomPresets', () => {
  it('returns all presets', () => {
    const editor = createEditorState();
    expect(Array.isArray(getEditorZoomPresets(editor))).toBe(true);
  });
});

describe('findEditorNearestPreset', () => {
  it('finds the nearest preset to a zoom level', () => {
    const editor = createEditorState();
    addEditorZoomPreset(editor, 'custom', '150%', 1.5);
    const nearest = findEditorNearestPreset(editor, 1.4);
    expect(nearest).not.toBeNull();
    expect(nearest!.id).toBe('custom');
  });
});

describe('getEditorNextZoomIn', () => {
  it('returns the next zoom level up', () => {
    const editor = createEditorState();
    addEditorZoomPreset(editor, 'a', '50%', 0.5);
    addEditorZoomPreset(editor, 'b', '100%', 1);
    addEditorZoomPreset(editor, 'c', '200%', 2);
    expect(getEditorNextZoomIn(editor, 0.5)).toBe(1);
  });
});

describe('getEditorNextZoomOut', () => {
  it('returns the next zoom level down', () => {
    const editor = createEditorState();
    addEditorZoomPreset(editor, 'a', '50%', 0.5);
    addEditorZoomPreset(editor, 'b', '100%', 1);
    addEditorZoomPreset(editor, 'c', '200%', 2);
    expect(getEditorNextZoomOut(editor, 2)).toBe(1);
  });
});

describe('computeEditorFitZoom', () => {
  it('computes a fit zoom', () => {
    const zoom = computeEditorFitZoom(1000, 1000, 500, 500);
    expect(zoom).toBe(0.5);
  });
});

describe('computeEditorFitWidthZoom', () => {
  it('computes a fit-width zoom', () => {
    const zoom = computeEditorFitWidthZoom(1000, 500);
    expect(zoom).toBe(0.5);
  });
});

describe('getEditorZoomPresetVersion', () => {
  it('increments on changes', () => {
    const editor = createEditorState();
    const v0 = getEditorZoomPresetVersion(editor);
    addEditorZoomPreset(editor, 'x', 'X', 1.5);
    expect(getEditorZoomPresetVersion(editor)).toBeGreaterThan(v0);
  });
});
