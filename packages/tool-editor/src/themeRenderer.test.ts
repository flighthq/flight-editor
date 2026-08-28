import { getNodeColorAdjustments } from '@flighthq/node';
import { describe, expect, it } from 'vitest';

import { createLayoutScene, getLayoutNode } from './layoutRenderer';
import { createDarkTheme, createLightTheme } from './themeDefinition';
import {
  applyThemeBorders,
  applyThemeToLayout,
  applyThemeToLayoutChild,
  applyThemeToNode,
  clearThemeFromLayout,
  getDefaultRegionColors,
  getRegionColor,
} from './themeRenderer';

function testLayout() {
  return createLayoutScene({ width: 1280, height: 720 });
}

describe('getDefaultRegionColors', () => {
  it('returns mappings for all regions', () => {
    const mappings = getDefaultRegionColors();
    expect(mappings).toHaveLength(6);
    const regions = mappings.map((m) => m.region);
    expect(regions).toContain('menuBar');
    expect(regions).toContain('toolbar');
    expect(regions).toContain('canvas');
    expect(regions).toContain('statusBar');
  });
});

describe('getRegionColor', () => {
  it('returns surface color for menuBar', () => {
    const theme = createDarkTheme();
    expect(getRegionColor(theme, 'menuBar')).toBe(theme.colors.surface);
  });

  it('returns background color for canvas', () => {
    const theme = createDarkTheme();
    expect(getRegionColor(theme, 'canvas')).toBe(theme.colors.background);
  });

  it('returns surfaceAlt for statusBar', () => {
    const theme = createLightTheme();
    expect(getRegionColor(theme, 'statusBar')).toBe(theme.colors.surfaceAlt);
  });
});

describe('applyThemeToLayout', () => {
  it('applies tint to all layout regions', () => {
    const layout = testLayout();
    const theme = createDarkTheme();
    applyThemeToLayout(layout, theme);

    const menuBar = getLayoutNode(layout, 'menuBar');
    expect(menuBar).not.toBeNull();
    const adjustments = getNodeColorAdjustments(menuBar!);
    expect(adjustments).not.toBeNull();
  });

  it('applies different theme colors', () => {
    const layout = testLayout();
    applyThemeToLayout(layout, createDarkTheme());
    const darkAdj = getNodeColorAdjustments(getLayoutNode(layout, 'canvas')!);

    applyThemeToLayout(layout, createLightTheme());
    const lightAdj = getNodeColorAdjustments(getLayoutNode(layout, 'canvas')!);

    expect(darkAdj).not.toEqual(lightAdj);
  });
});

describe('applyThemeToNode', () => {
  it('applies a specific color key to a node', () => {
    const layout = testLayout();
    const theme = createDarkTheme();
    const node = getLayoutNode(layout, 'toolbar');
    expect(node).not.toBeNull();
    applyThemeToNode(node!, theme, 'accent');
    const adjustments = getNodeColorAdjustments(node!);
    expect(adjustments).not.toBeNull();
  });
});

describe('applyThemeToLayoutChild', () => {
  it('applies theme to a child node by path', () => {
    const layout = testLayout();
    const theme = createDarkTheme();
    applyThemeToLayoutChild(layout, theme, 'leftPanel/hierarchy', 'surfaceAlt');
  });

  it('handles missing path gracefully', () => {
    const layout = testLayout();
    const theme = createDarkTheme();
    applyThemeToLayoutChild(layout, theme, 'nonexistent/path', 'accent');
  });
});

describe('applyThemeBorders', () => {
  it('applies border color to panel regions', () => {
    const layout = testLayout();
    const theme = createDarkTheme();
    applyThemeBorders(layout, theme);

    const leftPanel = getLayoutNode(layout, 'leftPanel');
    expect(leftPanel).not.toBeNull();
    const adjustments = getNodeColorAdjustments(leftPanel!);
    expect(adjustments).not.toBeNull();
  });
});

describe('clearThemeFromLayout', () => {
  it('resets tints on all regions', () => {
    const layout = testLayout();
    const theme = createDarkTheme();
    applyThemeToLayout(layout, theme);
    clearThemeFromLayout(layout);

    const canvas = getLayoutNode(layout, 'canvas');
    expect(canvas).not.toBeNull();
  });
});
