import type { SelectionState } from '@flighthq/editor-selection';
import type { Node2D } from '@flighthq/types';

import { forEachNodeDescendant, getNodeAncestors } from '@flighthq/node';

import type { BoundsRectangle } from './boundsUtils';

import { getSelectionBounds } from './boundsUtils';

export function getSelectedNodes(selection: Readonly<SelectionState>, root: Node2D): Node2D[] {
  const selected = new Set(selection.nodes);
  const resolved: Node2D[] = [];
  if (selected.has(root)) resolved.push(root);
  forEachNodeDescendant(root, (node) => {
    if (selected.has(node)) resolved.push(node as Node2D);
  });
  return resolved;
}

export function getSelectedBounds(selection: Readonly<SelectionState>, root: Node2D): BoundsRectangle | null {
  return getSelectionBounds(getSelectedNodes(selection, root));
}

export function isAncestorSelected(selection: Readonly<SelectionState>, node: Node2D): boolean {
  const selected = new Set(selection.nodes);
  return getNodeAncestors(node).some((ancestor) => selected.has(ancestor));
}

export function getDeepestSelectedAncestor(selection: Readonly<SelectionState>, node: Node2D): Node2D | null {
  const selected = new Set(selection.nodes);
  const ancestor = getNodeAncestors(node).find((candidate) => selected.has(candidate));
  return (ancestor as Node2D | undefined) ?? null;
}
