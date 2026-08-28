import type { Node2D, Scene2D } from '@flighthq/types';

import type { LayoutConfig, LayoutRegion } from './editorLayout';

import { createEditorLayoutDef, getLayoutRegions } from './editorLayout';
import { buildScene } from './sceneBuilder';
import { findNodeByPath } from './sceneSerializer';

export interface LayoutScene {
  readonly scene: Scene2D;
  readonly config: LayoutConfig;
}

export function createLayoutScene(config: Readonly<LayoutConfig>): LayoutScene {
  const def = createEditorLayoutDef(config);
  const scene = buildScene(def);
  return { scene, config };
}

export function getLayoutNode(layout: Readonly<LayoutScene>, region: LayoutRegion): Node2D | null {
  return findNodeByPath(layout.scene, region);
}

export function getLayoutChildNode(layout: Readonly<LayoutScene>, path: string): Node2D | null {
  return findNodeByPath(layout.scene, path);
}

export function resizeLayout(layout: LayoutScene, width: number, height: number): LayoutScene {
  const newConfig: LayoutConfig = { ...layout.config, width, height };
  return createLayoutScene(newConfig);
}

export function getLayoutNodeNames(): string[] {
  const names: string[] = [];
  for (const region of getLayoutRegions()) {
    names.push(region);
  }
  return names;
}
