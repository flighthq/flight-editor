import { describe, expect, it } from 'vitest';

import { createEditorLayoutDef, getLayoutRegion, getLayoutRegions } from './editorLayout';

import type { LayoutConfig, LayoutRegion } from './editorLayout';

describe('createEditorLayoutDef', () => {
  it('returns a SceneDef with scene dimensions', () => {
    const def = createEditorLayoutDef({ width: 1280, height: 720 });
    expect(def.width).toBe(1280);
    expect(def.height).toBe(720);
  });

  it('creates six root regions', () => {
    const def = createEditorLayoutDef({ width: 1280, height: 720 });
    expect(def.root).toHaveLength(6);
  });

  it('names root nodes to match regions', () => {
    const def = createEditorLayoutDef({ width: 1280, height: 720 });
    const names = def.root!.map((n) => n.name);
    expect(names).toEqual(['menuBar', 'toolbar', 'leftPanel', 'canvas', 'rightPanel', 'statusBar']);
  });

  it('uses default panel sizes', () => {
    const def = createEditorLayoutDef({ width: 1280, height: 720 });
    const toolbar = def.root![1];
    expect(toolbar.height).toBe(40);
    const statusBar = def.root![5];
    expect(statusBar.height).toBe(24);
  });

  it('uses custom panel sizes', () => {
    const config: LayoutConfig = {
      width: 1280,
      height: 720,
      toolbarHeight: 48,
      statusBarHeight: 32,
      leftPanelWidth: 200,
      rightPanelWidth: 300,
      menuBarHeight: 30,
    };
    const def = createEditorLayoutDef(config);
    const toolbar = def.root![1];
    expect(toolbar.height).toBe(48);
    const left = def.root![2];
    expect(left.width).toBe(200);
    const right = def.root![4];
    expect(right.width).toBe(300);
  });

  it('canvas fills remaining space', () => {
    const def = createEditorLayoutDef({ width: 1280, height: 720 });
    const canvas = def.root![3];
    expect(canvas.width).toBe(1280 - 44 - 280);
    expect(canvas.height).toBe(720 - 28 - 40 - 24);
  });

  it('includes children in panels', () => {
    const def = createEditorLayoutDef({ width: 1280, height: 720 });
    const menuBar = def.root![0];
    expect(menuBar.children!.length).toBeGreaterThanOrEqual(7);
    expect(menuBar.children![0].name).toBe('menu_file');
    const canvas = def.root![3];
    expect(canvas.children).toHaveLength(2);
    expect(canvas.children![0].name).toBe('viewport');
    expect(canvas.children![1].name).toBe('rulers');
    const right = def.root![4];
    expect(right.children!.length).toBeGreaterThanOrEqual(1);
    expect(right.children!.some((c) => c.name === 'inspector')).toBe(true);
    const statusBar = def.root![5];
    expect(statusBar.children!.length).toBeGreaterThanOrEqual(2);
    expect(statusBar.children![0].name).toBe('statusTool');
  });
});

describe('getLayoutRegion', () => {
  const config: LayoutConfig = { width: 1280, height: 720 };

  it('returns menuBar region at top', () => {
    const r = getLayoutRegion(config, 'menuBar');
    expect(r.x).toBe(0);
    expect(r.y).toBe(0);
    expect(r.width).toBe(1280);
    expect(r.height).toBe(28);
  });

  it('returns toolbar below menuBar', () => {
    const r = getLayoutRegion(config, 'toolbar');
    expect(r.y).toBe(28);
    expect(r.height).toBe(40);
  });

  it('returns canvas with correct offset', () => {
    const r = getLayoutRegion(config, 'canvas');
    expect(r.x).toBe(44);
    expect(r.y).toBe(68);
  });

  it('returns leftPanel at left edge', () => {
    const r = getLayoutRegion(config, 'leftPanel');
    expect(r.x).toBe(0);
    expect(r.width).toBe(44);
  });

  it('returns rightPanel at right edge', () => {
    const r = getLayoutRegion(config, 'rightPanel');
    expect(r.x).toBe(1280 - 280);
  });

  it('returns statusBar at bottom', () => {
    const r = getLayoutRegion(config, 'statusBar');
    expect(r.y).toBe(720 - 24);
    expect(r.height).toBe(24);
  });

  it('regions tile without gaps', () => {
    const mb = getLayoutRegion(config, 'menuBar');
    const tb = getLayoutRegion(config, 'toolbar');
    const lp = getLayoutRegion(config, 'leftPanel');
    const cv = getLayoutRegion(config, 'canvas');
    const rp = getLayoutRegion(config, 'rightPanel');
    const sb = getLayoutRegion(config, 'statusBar');

    expect(mb.y + mb.height).toBe(tb.y);
    expect(tb.y + tb.height).toBe(lp.y);
    expect(tb.y + tb.height).toBe(cv.y);
    expect(tb.y + tb.height).toBe(rp.y);
    expect(lp.y + lp.height).toBe(sb.y);
    expect(lp.x + lp.width).toBe(cv.x);
    expect(cv.x + cv.width).toBe(rp.x);
  });
});

describe('getLayoutRegions', () => {
  it('returns all six region names', () => {
    const regions = getLayoutRegions();
    expect(regions).toHaveLength(6);
    expect(regions).toContain('menuBar');
    expect(regions).toContain('canvas');
    expect(regions).toContain('statusBar');
  });

  it('returns consistent set with getLayoutRegion', () => {
    const config: LayoutConfig = { width: 1280, height: 720 };
    for (const region of getLayoutRegions()) {
      const r = getLayoutRegion(config, region);
      expect(r.width).toBeGreaterThan(0);
      expect(r.height).toBeGreaterThan(0);
    }
  });
});
