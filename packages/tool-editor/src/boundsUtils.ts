import type { Node2D, Scene2D } from '@flighthq/types';

import { computeNodeBoundsRectangle, getNodeRoot } from '@flighthq/node';

export interface BoundsRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function getSelectionBounds(nodes: readonly Node2D[]): BoundsRectangle | null {
  if (nodes.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const current = { x: 0, y: 0, width: 0, height: 0 };

  for (const node of nodes) {
    computeNodeBoundsRectangle(current, node, getNodeRoot(node));
    minX = Math.min(minX, current.x);
    minY = Math.min(minY, current.y);
    maxX = Math.max(maxX, current.x + current.width);
    maxY = Math.max(maxY, current.y + current.height);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function getSceneBounds(scene: Readonly<Scene2D>): BoundsRectangle {
  return { x: 0, y: 0, width: scene.scene2dWidth, height: scene.scene2dHeight };
}

export function isNodeInBounds(node: Node2D, rect: BoundsRectangle): boolean {
  const bounds = { x: 0, y: 0, width: 0, height: 0 };
  computeNodeBoundsRectangle(bounds, node, getNodeRoot(node));
  return (
    bounds.x <= rect.x + rect.width &&
    bounds.x + bounds.width >= rect.x &&
    bounds.y <= rect.y + rect.height &&
    bounds.y + bounds.height >= rect.y
  );
}

export function expandBounds(rect: BoundsRectangle, padding: number): BoundsRectangle {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}
