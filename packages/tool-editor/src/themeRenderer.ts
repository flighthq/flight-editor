import type { Node2D } from '@flighthq/types';

import type { LayoutRegion } from './editorLayout';
import type { LayoutScene } from './layoutRenderer';
import type { EditorTheme, ThemeColors } from './themeDefinition';

import { setNodeColorAdjustmentsTint } from '@flighthq/node';

import { getLayoutRegions } from './editorLayout';
import { getLayoutChildNode, getLayoutNode } from './layoutRenderer';

export interface ThemeMapping {
  readonly region: LayoutRegion;
  readonly colorKey: keyof ThemeColors;
}

const DEFAULT_REGION_COLORS: readonly ThemeMapping[] = Object.freeze([
  { region: 'menuBar', colorKey: 'surface' },
  { region: 'toolbar', colorKey: 'surface' },
  { region: 'leftPanel', colorKey: 'surface' },
  { region: 'canvas', colorKey: 'background' },
  { region: 'rightPanel', colorKey: 'surface' },
  { region: 'statusBar', colorKey: 'surfaceAlt' },
]);

export function getDefaultRegionColors(): readonly ThemeMapping[] {
  return DEFAULT_REGION_COLORS;
}

export function getRegionColor(theme: Readonly<EditorTheme>, region: LayoutRegion): number {
  for (const mapping of DEFAULT_REGION_COLORS) {
    if (mapping.region === region) {
      return theme.colors[mapping.colorKey];
    }
  }
  return theme.colors.background;
}

export function applyThemeToLayout(layout: Readonly<LayoutScene>, theme: Readonly<EditorTheme>): void {
  for (const region of getLayoutRegions()) {
    const bgNode = getLayoutChildNode(layout, `${region}/bg`);
    if (bgNode) {
      const color = getRegionColor(theme, region);
      setNodeColorAdjustmentsTint(bgNode, color);
    }
  }
}

export function applyThemeToNode(node: Node2D, theme: Readonly<EditorTheme>, colorKey: keyof ThemeColors): void {
  setNodeColorAdjustmentsTint(node, theme.colors[colorKey]);
}

export function applyThemeToLayoutChild(
  layout: Readonly<LayoutScene>,
  theme: Readonly<EditorTheme>,
  path: string,
  colorKey: keyof ThemeColors,
): void {
  const node = getLayoutChildNode(layout, path);
  if (node) {
    setNodeColorAdjustmentsTint(node, theme.colors[colorKey]);
  }
}

export function applyThemeBorders(layout: Readonly<LayoutScene>, theme: Readonly<EditorTheme>): void {
  const borderRegions: readonly LayoutRegion[] = ['leftPanel', 'rightPanel'];
  for (const region of borderRegions) {
    const node = getLayoutNode(layout, region);
    if (node) {
      setNodeColorAdjustmentsTint(node, theme.colors.border);
    }
  }
}

export function clearThemeFromLayout(layout: Readonly<LayoutScene>): void {
  for (const region of getLayoutRegions()) {
    const bgNode = getLayoutChildNode(layout, `${region}/bg`);
    if (bgNode) {
      clearNodeTint(bgNode);
    }
  }
}

function clearNodeTint(node: Node2D): void {
  setNodeColorAdjustmentsTint(node, 0xffffffff);
}
