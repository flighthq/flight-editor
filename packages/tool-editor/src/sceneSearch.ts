import type { Node2D, Scene2D } from '@flighthq/types';

import { forEachNodeDescendant, getNodeChildAt, getNodeChildCount } from '@flighthq/node';

export interface SceneSearchCriteria {
  readonly name?: string;
  readonly namePattern?: RegExp;
  readonly kind?: string;
  readonly visible?: boolean;
  readonly maxDepth?: number;
}

export function findNodes(scene: Readonly<Scene2D>, criteria: Readonly<SceneSearchCriteria>): Node2D[] {
  const results: Node2D[] = [];

  if (criteria.maxDepth !== undefined) {
    findNodesWithDepth(scene.root, criteria, 0, criteria.maxDepth, results);
  } else {
    forEachNodeDescendant(scene.root, (node) => {
      if (matchesCriteria(node as Node2D, criteria)) {
        results.push(node as Node2D);
      }
    });
  }

  return results;
}

export function findFirstNode(scene: Readonly<Scene2D>, criteria: Readonly<SceneSearchCriteria>): Node2D | null {
  if (criteria.maxDepth !== undefined) {
    return findFirstWithDepth(scene.root, criteria, 0, criteria.maxDepth);
  }

  const childCount = getNodeChildCount(scene.root);
  for (let i = 0; i < childCount; i++) {
    const child = getNodeChildAt(scene.root, i) as Node2D | null;
    if (!child) continue;
    if (matchesCriteria(child, criteria)) return child;
    const found = searchDescendants(child, criteria);
    if (found) return found;
  }
  return null;
}

export function countMatchingNodes(scene: Readonly<Scene2D>, criteria: Readonly<SceneSearchCriteria>): number {
  return findNodes(scene, criteria).length;
}

export function findNodesByName(scene: Readonly<Scene2D>, name: string): Node2D[] {
  return findNodes(scene, { name });
}

export function findNodesByKind(scene: Readonly<Scene2D>, kind: string): Node2D[] {
  return findNodes(scene, { kind });
}

function matchesCriteria(node: Node2D, criteria: Readonly<SceneSearchCriteria>): boolean {
  if (criteria.name !== undefined && node.name !== criteria.name) return false;
  if (criteria.namePattern !== undefined && !criteria.namePattern.test(node.name ?? '')) return false;
  if (criteria.kind !== undefined && node.kind !== criteria.kind) return false;
  if (criteria.visible !== undefined && node.visible !== criteria.visible) return false;
  return true;
}

function findNodesWithDepth(
  parent: Readonly<Node2D>,
  criteria: Readonly<SceneSearchCriteria>,
  depth: number,
  maxDepth: number,
  results: Node2D[],
): void {
  const childCount = getNodeChildCount(parent);
  for (let i = 0; i < childCount; i++) {
    const child = getNodeChildAt(parent, i) as Node2D | null;
    if (!child) continue;
    if (matchesCriteria(child, criteria)) {
      results.push(child);
    }
    if (depth < maxDepth) {
      findNodesWithDepth(child, criteria, depth + 1, maxDepth, results);
    }
  }
}

function findFirstWithDepth(
  parent: Readonly<Node2D>,
  criteria: Readonly<SceneSearchCriteria>,
  depth: number,
  maxDepth: number,
): Node2D | null {
  const childCount = getNodeChildCount(parent);
  for (let i = 0; i < childCount; i++) {
    const child = getNodeChildAt(parent, i) as Node2D | null;
    if (!child) continue;
    if (matchesCriteria(child, criteria)) return child;
    if (depth < maxDepth) {
      const found = findFirstWithDepth(child, criteria, depth + 1, maxDepth);
      if (found) return found;
    }
  }
  return null;
}

function searchDescendants(node: Node2D, criteria: Readonly<SceneSearchCriteria>): Node2D | null {
  const childCount = getNodeChildCount(node);
  for (let i = 0; i < childCount; i++) {
    const child = getNodeChildAt(node, i) as Node2D | null;
    if (!child) continue;
    if (matchesCriteria(child, criteria)) return child;
    const found = searchDescendants(child, criteria);
    if (found) return found;
  }
  return null;
}
