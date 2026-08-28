import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  computeEditorTransformOrigin,
  getEditorCustomTransformOrigin,
  getEditorTransformOriginMode,
  setEditorCustomTransformOrigin,
  setEditorTransformOriginMode,
} from './transformOriginManager';

describe('setEditorTransformOriginMode', () => {
  it('changes the transform origin mode', () => {
    const editor = createEditorState();
    setEditorTransformOriginMode(editor, 'topLeft');
    expect(getEditorTransformOriginMode(editor)).toBe('topLeft');
  });
});

describe('getEditorTransformOriginMode', () => {
  it('returns the default mode', () => {
    const editor = createEditorState();
    expect(getEditorTransformOriginMode(editor)).toBe('center');
  });
});

describe('setEditorCustomTransformOrigin', () => {
  it('sets a custom origin point', () => {
    const editor = createEditorState();
    setEditorCustomTransformOrigin(editor, 50, 75);
    const origin = getEditorCustomTransformOrigin(editor);
    expect(origin.x).toBe(50);
    expect(origin.y).toBe(75);
  });
});

describe('getEditorCustomTransformOrigin', () => {
  it('returns the custom origin', () => {
    const editor = createEditorState();
    const origin = getEditorCustomTransformOrigin(editor);
    expect(typeof origin.x).toBe('number');
    expect(typeof origin.y).toBe('number');
  });
});

describe('computeEditorTransformOrigin', () => {
  it('computes origin for center mode', () => {
    const editor = createEditorState();
    setEditorTransformOriginMode(editor, 'center');
    const point = computeEditorTransformOrigin(editor, { x: 0, y: 0, width: 100, height: 200 });
    expect(point.x).toBe(50);
    expect(point.y).toBe(100);
  });

  it('computes origin for topLeft mode', () => {
    const editor = createEditorState();
    setEditorTransformOriginMode(editor, 'topLeft');
    const point = computeEditorTransformOrigin(editor, { x: 10, y: 20, width: 100, height: 200 });
    expect(point.x).toBe(10);
    expect(point.y).toBe(20);
  });

  it('computes origin for bottomRight mode', () => {
    const editor = createEditorState();
    setEditorTransformOriginMode(editor, 'bottomRight');
    const point = computeEditorTransformOrigin(editor, { x: 0, y: 0, width: 100, height: 200 });
    expect(point.x).toBe(100);
    expect(point.y).toBe(200);
  });

  it('uses custom origin when mode is custom', () => {
    const editor = createEditorState();
    setEditorTransformOriginMode(editor, 'custom');
    setEditorCustomTransformOrigin(editor, 25, 75);
    const point = computeEditorTransformOrigin(editor, { x: 0, y: 0, width: 100, height: 200 });
    expect(point.x).toBe(25);
    expect(point.y).toBe(75);
  });
});
