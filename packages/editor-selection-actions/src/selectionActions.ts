import type { HierarchyState } from '@flighthq/editor-hierarchy';
import type { LockState } from '@flighthq/editor-lock';
import type { SelectionState } from '@flighthq/editor-selection';
import type { NodeAny } from '@flighthq/types';

import { expandHierarchyNode, expandHierarchyToNode } from '@flighthq/editor-hierarchy';
import { isLocked } from '@flighthq/editor-lock';
import { clearSelection, getSelectedNodes, setSelection } from '@flighthq/editor-selection';
import { getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';

export function selectAll(selection: SelectionState, locks: Readonly<LockState>, root: NodeAny): void {
  const targets: NodeAny[] = [];
  collectSelectableDescendants(locks, root, targets);
  replaceSelection(selection, targets);
}

export function selectNone(selection: SelectionState): void {
  clearSelection(selection);
}

export function invertSelection(selection: SelectionState, locks: Readonly<LockState>, root: NodeAny): void {
  const current = new Set(getSelectedNodes(selection));
  const candidates: NodeAny[] = [];
  collectSelectableDescendants(locks, root, candidates);
  replaceSelection(
    selection,
    candidates.filter((node) => !current.has(node)),
  );
}

export function selectParent(selection: SelectionState, locks: Readonly<LockState>, hierarchy: HierarchyState): void {
  const targets: NodeAny[] = [];
  for (const node of getSelectedNodes(selection)) {
    const parent = getNodeParent(node);
    if (parent !== null && !isLocked(locks, parent)) appendUnique(targets, parent);
  }
  if (targets.length === 0) return;
  for (const target of targets) expandHierarchyToNode(hierarchy, target);
  replaceSelection(selection, targets);
}

export function selectChildren(selection: SelectionState, locks: Readonly<LockState>, hierarchy: HierarchyState): void {
  const selected = [...getSelectedNodes(selection)];
  const targets: NodeAny[] = [];
  for (const node of selected) {
    const childCount = getNodeChildCount(node);
    if (childCount > 0) expandHierarchyNode(hierarchy, node);
    for (let index = 0; index < childCount; index++) {
      const child = getNodeChildAt(node, index);
      if (child === null) continue;
      if (!isLocked(locks, child)) appendUnique(targets, child);
    }
  }
  if (targets.length > 0) replaceSelection(selection, targets);
}

export function selectSiblings(selection: SelectionState, locks: Readonly<LockState>, hierarchy: HierarchyState): void {
  const targets: NodeAny[] = [];
  const parents: NodeAny[] = [];
  for (const node of getSelectedNodes(selection)) {
    const parent = getNodeParent(node);
    if (parent === null) continue;
    appendUnique(parents, parent);
    const childCount = getNodeChildCount(parent);
    for (let index = 0; index < childCount; index++) {
      const sibling = getNodeChildAt(parent, index);
      if (sibling === null) continue;
      if (!isLocked(locks, sibling)) appendUnique(targets, sibling);
    }
  }
  if (targets.length === 0) return;
  for (const parent of parents) expandHierarchyNode(hierarchy, parent);
  replaceSelection(selection, targets);
}

function collectSelectableDescendants(locks: Readonly<LockState>, parent: NodeAny, result: NodeAny[]): void {
  const childCount = getNodeChildCount(parent);
  for (let index = 0; index < childCount; index++) {
    const child = getNodeChildAt(parent, index);
    if (child === null) continue;
    if (!isLocked(locks, child)) result.push(child);
    collectSelectableDescendants(locks, child, result);
  }
}

function appendUnique(nodes: NodeAny[], node: NodeAny): void {
  if (!nodes.includes(node)) nodes.push(node);
}

function replaceSelection(selection: SelectionState, targets: readonly NodeAny[]): void {
  const current = getSelectedNodes(selection);
  if (current.length === targets.length && current.every((node, index) => node === targets[index])) return;
  setSelection(selection, targets);
}
