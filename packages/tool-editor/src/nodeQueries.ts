import type { LockState } from '@flighthq/editor-lock';
import type { Kind, Node2D } from '@flighthq/types';

import { isLocked } from '@flighthq/editor-lock';
import { forEachNodeDescendant, getNodeAncestors, getNodeCommonAncestor } from '@flighthq/node';

export function findNodesByName(root: Readonly<Node2D>, name: string): Node2D[] {
  const matches: Node2D[] = [];
  forEachNodeDescendant(root, (node) => {
    if (node.name === name) matches.push(node as Node2D);
  });
  return matches;
}

export function findNodesByKind(root: Readonly<Node2D>, kind: Kind): Node2D[] {
  const matches: Node2D[] = [];
  forEachNodeDescendant(root, (node) => {
    if (node.kind === kind) matches.push(node as Node2D);
  });
  return matches;
}

export function filterVisibleNodes(nodes: readonly Node2D[]): Node2D[] {
  return nodes.filter((node) => node.visible === true);
}

export function filterUnlockedNodes(locks: Readonly<LockState>, nodes: readonly Node2D[]): Node2D[] {
  return nodes.filter((node) => !isLocked(locks, node));
}

export function getNodePath(node: Node2D): Node2D[] {
  return [...getNodeAncestors(node)].reverse().concat(node);
}

export function getCommonAncestor(nodes: readonly Node2D[]): Node2D | null {
  if (nodes.length === 0) return null;
  let common = nodes[0]!;
  for (let index = 1; index < nodes.length; index++) {
    const next = getNodeCommonAncestor(common, nodes[index]!);
    if (next === null) return null;
    common = next;
  }
  return common;
}
