import { describe, expect, it } from 'vitest';

import {
  createCanvasState,
  getBackgroundPattern,
  getCanvasVersion,
  getOverlayOpacity,
  getPixelRatio,
  isShowBounds,
  isShowGrid,
  isShowGuides,
  isShowPixelGrid,
  setBackgroundPattern,
  setOverlayOpacity,
  setPixelRatio,
  setShowBounds,
  setShowGrid,
  setShowGuides,
  setShowPixelGrid,
} from './canvasState';

describe('createCanvasState', () => {
  it('creates a canvas with stable workspace display defaults', () => {
    const state = createCanvasState();
    expect(state).toEqual({
      showGrid: false,
      showGuides: true,
      showBounds: true,
      showPixelGrid: false,
      backgroundPattern: 'checkerboard',
      pixelRatio: 1,
      overlayOpacity: 1,
      version: 0,
    });
  });
});

describe('setShowGrid', () => {
  it('sets grid visibility and guards redundant updates', () => {
    const state = createCanvasState();
    setShowGrid(state, true);
    setShowGrid(state, true);
    expect(isShowGrid(state)).toBe(true);
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('isShowGrid', () => {
  it('reports grid visibility', () => {
    const state = createCanvasState();
    expect(isShowGrid(state)).toBe(false);
    setShowGrid(state, true);
    expect(isShowGrid(state)).toBe(true);
  });
});

describe('setShowGuides', () => {
  it('sets guide visibility and guards redundant updates', () => {
    const state = createCanvasState();
    setShowGuides(state, false);
    setShowGuides(state, false);
    expect(isShowGuides(state)).toBe(false);
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('isShowGuides', () => {
  it('reports guide visibility', () => {
    const state = createCanvasState();
    expect(isShowGuides(state)).toBe(true);
    setShowGuides(state, false);
    expect(isShowGuides(state)).toBe(false);
  });
});

describe('setShowBounds', () => {
  it('sets bounds visibility and guards redundant updates', () => {
    const state = createCanvasState();
    setShowBounds(state, false);
    setShowBounds(state, false);
    expect(isShowBounds(state)).toBe(false);
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('isShowBounds', () => {
  it('reports bounds visibility', () => {
    const state = createCanvasState();
    expect(isShowBounds(state)).toBe(true);
    setShowBounds(state, false);
    expect(isShowBounds(state)).toBe(false);
  });
});

describe('setShowPixelGrid', () => {
  it('sets pixel-grid visibility and guards redundant updates', () => {
    const state = createCanvasState();
    setShowPixelGrid(state, true);
    setShowPixelGrid(state, true);
    expect(isShowPixelGrid(state)).toBe(true);
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('isShowPixelGrid', () => {
  it('reports pixel-grid visibility', () => {
    const state = createCanvasState();
    expect(isShowPixelGrid(state)).toBe(false);
    setShowPixelGrid(state, true);
    expect(isShowPixelGrid(state)).toBe(true);
  });
});

describe('setBackgroundPattern', () => {
  it('sets the background pattern and guards redundant updates', () => {
    const state = createCanvasState();
    setBackgroundPattern(state, 'solid');
    setBackgroundPattern(state, 'solid');
    expect(getBackgroundPattern(state)).toBe('solid');
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('getBackgroundPattern', () => {
  it('reports the current background pattern', () => {
    const state = createCanvasState();
    expect(getBackgroundPattern(state)).toBe('checkerboard');
    setBackgroundPattern(state, 'none');
    expect(getBackgroundPattern(state)).toBe('none');
  });
});

describe('setPixelRatio', () => {
  it('sets the display pixel ratio and guards redundant updates', () => {
    const state = createCanvasState();
    setPixelRatio(state, 2);
    setPixelRatio(state, 2);
    expect(getPixelRatio(state)).toBe(2);
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('getPixelRatio', () => {
  it('reports the current display pixel ratio', () => {
    const state = createCanvasState();
    expect(getPixelRatio(state)).toBe(1);
    setPixelRatio(state, 1.5);
    expect(getPixelRatio(state)).toBe(1.5);
  });
});

describe('setOverlayOpacity', () => {
  it('sets overlay opacity and guards redundant updates', () => {
    const state = createCanvasState();
    setOverlayOpacity(state, 0.4);
    setOverlayOpacity(state, 0.4);
    expect(getOverlayOpacity(state)).toBe(0.4);
    expect(getCanvasVersion(state)).toBe(1);
  });
});

describe('getOverlayOpacity', () => {
  it('reports the current overlay opacity', () => {
    const state = createCanvasState();
    expect(getOverlayOpacity(state)).toBe(1);
    setOverlayOpacity(state, 0.75);
    expect(getOverlayOpacity(state)).toBe(0.75);
  });
});

describe('getCanvasVersion', () => {
  it('tracks changes to every canvas setting', () => {
    const state = createCanvasState();
    setShowGrid(state, true);
    setShowGuides(state, false);
    setShowBounds(state, false);
    setShowPixelGrid(state, true);
    setBackgroundPattern(state, 'solid');
    setPixelRatio(state, 2);
    setOverlayOpacity(state, 0.5);
    expect(getCanvasVersion(state)).toBe(7);
  });
});
