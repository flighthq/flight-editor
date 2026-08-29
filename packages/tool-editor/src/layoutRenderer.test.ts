import { getNodeChildCount } from '@flighthq/node';
import { describe, expect, it } from 'vitest';

import {
  createLayoutScene,
  getLayoutChildNode,
  getLayoutNode,
  getLayoutNodeNames,
  resizeLayout,
} from './layoutRenderer';

import type { LayoutConfig } from './editorLayout';

const config: LayoutConfig = { width: 1280, height: 720 };

describe('createLayoutScene', () => {
  it('creates a scene with correct dimensions', () => {
    const layout = createLayoutScene(config);
    expect(layout.scene.scene2dWidth).toBe(1280);
    expect(layout.scene.scene2dHeight).toBe(720);
  });

  it('stores the config', () => {
    const layout = createLayoutScene(config);
    expect(layout.config.width).toBe(1280);
  });

  it('creates six root-level region nodes', () => {
    const layout = createLayoutScene(config);
    expect(getNodeChildCount(layout.scene.root)).toBe(6);
  });
});

describe('getLayoutNode', () => {
  it('returns menuBar region node', () => {
    const layout = createLayoutScene(config);
    const node = getLayoutNode(layout, 'menuBar');
    expect(node).not.toBeNull();
    expect(node!.name).toBe('menuBar');
  });

  it('returns canvas region node', () => {
    const layout = createLayoutScene(config);
    const node = getLayoutNode(layout, 'canvas');
    expect(node).not.toBeNull();
    expect(node!.name).toBe('canvas');
  });

  it('returns all six regions', () => {
    const layout = createLayoutScene(config);
    const regions = ['menuBar', 'toolbar', 'leftPanel', 'canvas', 'rightPanel', 'statusBar'] as const;
    for (const region of regions) {
      expect(getLayoutNode(layout, region)).not.toBeNull();
    }
  });
});

describe('getLayoutChildNode', () => {
  it('finds nested children by path', () => {
    const layout = createLayoutScene(config);
    const viewport = getLayoutChildNode(layout, 'canvas/viewport');
    expect(viewport).not.toBeNull();
    expect(viewport!.name).toBe('viewport');
  });

  it('finds inspector inside rightPanel', () => {
    const layout = createLayoutScene(config);
    const inspector = getLayoutChildNode(layout, 'rightPanel/inspector');
    expect(inspector).not.toBeNull();
    expect(inspector!.name).toBe('inspector');
  });

  it('returns null for invalid path', () => {
    const layout = createLayoutScene(config);
    expect(getLayoutChildNode(layout, 'foo/bar')).toBeNull();
  });
});

describe('resizeLayout', () => {
  it('creates new layout with updated dimensions', () => {
    const layout = createLayoutScene(config);
    const resized = resizeLayout(layout, 1920, 1080);
    expect(resized.scene.scene2dWidth).toBe(1920);
    expect(resized.scene.scene2dHeight).toBe(1080);
    expect(resized.config.width).toBe(1920);
    expect(resized.config.height).toBe(1080);
  });

  it('preserves panel sizes', () => {
    const customConfig: LayoutConfig = { width: 1280, height: 720, leftPanelWidth: 200 };
    const layout = createLayoutScene(customConfig);
    const resized = resizeLayout(layout, 1920, 1080);
    expect(resized.config.leftPanelWidth).toBe(200);
  });
});

describe('getLayoutNodeNames', () => {
  it('returns all region names', () => {
    const names = getLayoutNodeNames();
    expect(names).toHaveLength(6);
    expect(names).toContain('menuBar');
    expect(names).toContain('canvas');
    expect(names).toContain('statusBar');
  });
});
