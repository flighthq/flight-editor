import { describe, expect, it } from 'vitest';

import {
  centerEditorViewportOnPoint,
  createEditorViewport,
  editorViewportScreenToWorld,
  editorViewportWorldToScreen,
  fitEditorViewportToRect,
  getEditorViewportCamera,
  getEditorViewportVisibleBounds,
  getEditorViewportZoom,
  panEditorViewport,
  setEditorViewportSize,
  setEditorViewportZoom,
  zoomEditorViewportAtPoint,
} from './editorViewport';

describe('getEditorViewportCamera', () => {
  it('is exported', () => expect(getEditorViewportCamera).toBeTypeOf('function'));
});

describe('getEditorViewportVisibleBounds', () => {
  it('is exported', () => expect(getEditorViewportVisibleBounds).toBeTypeOf('function'));
});

describe('getEditorViewportZoom', () => {
  it('is exported', () => expect(getEditorViewportZoom).toBeTypeOf('function'));
});

describe('centerEditorViewportOnPoint', () => {
  it('moves camera to the given world point', () => {
    const vp = createEditorViewport(800, 600);
    centerEditorViewportOnPoint(vp, 100, 200);
    const cam = getEditorViewportCamera(vp);
    expect(cam.x).toBe(100);
    expect(cam.y).toBe(200);
  });
});

describe('createEditorViewport', () => {
  it('creates with given dimensions and default config', () => {
    const vp = createEditorViewport(800, 600);
    const cam = getEditorViewportCamera(vp);
    expect(cam.viewportWidth).toBe(800);
    expect(cam.viewportHeight).toBe(600);
    expect(getEditorViewportZoom(vp)).toBe(1);
    expect(vp.config.minZoom).toBe(0.05);
    expect(vp.config.maxZoom).toBe(64);
  });

  it('accepts custom config', () => {
    const vp = createEditorViewport(800, 600, { minZoom: 0.1, maxZoom: 10 });
    expect(vp.config.minZoom).toBe(0.1);
    expect(vp.config.maxZoom).toBe(10);
  });
});

describe('editorViewportScreenToWorld', () => {
  it('converts screen coordinates to world coordinates', () => {
    const vp = createEditorViewport(800, 600);
    const out = { x: 0, y: 0 };
    editorViewportScreenToWorld(vp, 400, 300, out);
    expect(out.x).toBeCloseTo(0, 1);
    expect(out.y).toBeCloseTo(0, 1);
  });
});

describe('editorViewportWorldToScreen', () => {
  it('converts world coordinates to screen coordinates', () => {
    const vp = createEditorViewport(800, 600);
    const out = { x: 0, y: 0 };
    editorViewportWorldToScreen(vp, 0, 0, out);
    expect(out.x).toBeCloseTo(400, 1);
    expect(out.y).toBeCloseTo(300, 1);
  });
});

describe('fitEditorViewportToRect', () => {
  it('fits camera to show a rectangle', () => {
    const vp = createEditorViewport(800, 600);
    fitEditorViewportToRect(vp, { x: 0, y: 0, width: 400, height: 300 });
    const cam = getEditorViewportCamera(vp);
    expect(cam.x).toBe(200);
    expect(cam.y).toBe(150);
    expect(cam.zoom).toBe(2);
  });

  it('clamps zoom to limits', () => {
    const vp = createEditorViewport(800, 600, { maxZoom: 1.5 });
    fitEditorViewportToRect(vp, { x: 0, y: 0, width: 100, height: 100 });
    expect(getEditorViewportZoom(vp)).toBe(1.5);
  });

  it('does nothing for zero-sized rect', () => {
    const vp = createEditorViewport(800, 600);
    const zoomBefore = getEditorViewportZoom(vp);
    fitEditorViewportToRect(vp, { x: 0, y: 0, width: 0, height: 0 });
    expect(getEditorViewportZoom(vp)).toBe(zoomBefore);
  });
});

describe('panEditorViewport', () => {
  it('moves camera by screen-space delta', () => {
    const vp = createEditorViewport(800, 600);
    panEditorViewport(vp, 100, -50);
    const cam = getEditorViewportCamera(vp);
    expect(cam.x).toBe(100);
    expect(cam.y).toBe(-50);
  });

  it('scales pan by inverse zoom', () => {
    const vp = createEditorViewport(800, 600);
    setEditorViewportZoom(vp, 2);
    panEditorViewport(vp, 100, 100);
    const cam = getEditorViewportCamera(vp);
    expect(cam.x).toBe(50);
    expect(cam.y).toBe(50);
  });
});

describe('setEditorViewportSize', () => {
  it('updates camera viewport dimensions', () => {
    const vp = createEditorViewport(800, 600);
    setEditorViewportSize(vp, 1920, 1080);
    const cam = getEditorViewportCamera(vp);
    expect(cam.viewportWidth).toBe(1920);
    expect(cam.viewportHeight).toBe(1080);
  });
});

describe('setEditorViewportZoom', () => {
  it('clamps to min/max', () => {
    const vp = createEditorViewport(800, 600, { minZoom: 0.5, maxZoom: 4 });
    setEditorViewportZoom(vp, 0.1);
    expect(getEditorViewportZoom(vp)).toBe(0.5);
    setEditorViewportZoom(vp, 10);
    expect(getEditorViewportZoom(vp)).toBe(4);
  });
});

describe('zoomEditorViewportAtPoint', () => {
  it('changes zoom level', () => {
    const vp = createEditorViewport(800, 600);
    zoomEditorViewportAtPoint(vp, 400, 300, 2);
    expect(getEditorViewportZoom(vp)).toBeCloseTo(2, 1);
  });

  it('clamps zoom to limits', () => {
    const vp = createEditorViewport(800, 600, { maxZoom: 3 });
    zoomEditorViewportAtPoint(vp, 400, 300, 10);
    expect(getEditorViewportZoom(vp)).toBeLessThanOrEqual(3);
  });
});
