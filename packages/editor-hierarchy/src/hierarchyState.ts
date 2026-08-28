import { getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';

import type { NodeAny } from '@flighthq/types';

export interface HierarchyRow {
  readonly node: NodeAny;
  readonly depth: number;
  readonly hasChildren: boolean;
  readonly expanded: boolean;
}

export interface HierarchyState {
  expanded: Set<NodeAny>;
  version: number;
}

export function createHierarchyState(): HierarchyState {
  return { expanded: new Set(), version: 0 };
}

export function isHierarchyNodeExpanded(state: Readonly<HierarchyState>, node: NodeAny): boolean {
  return state.expanded.has(node);
}

export function expandHierarchyNode(state: HierarchyState, node: NodeAny): void {
  if (!state.expanded.has(node)) {
    state.expanded.add(node);
    state.version++;
  }
}

export function collapseHierarchyNode(state: HierarchyState, node: NodeAny): void {
  if (state.expanded.delete(node)) {
    state.version++;
  }
}

export function toggleHierarchyNode(state: HierarchyState, node: NodeAny): void {
  if (state.expanded.has(node)) {
    state.expanded.delete(node);
  } else {
    state.expanded.add(node);
  }
  state.version++;
}

export function expandHierarchyAll(state: HierarchyState, root: NodeAny): void {
  expandSubtree(state, root);
  state.version++;
}

function expandSubtree(state: HierarchyState, node: NodeAny): void {
  const childCount = getNodeChildCount(node);
  if (childCount > 0) {
    state.expanded.add(node);
    for (let i = 0; i < childCount; i++) {
      expandSubtree(state, getNodeChildAt(node, i));
    }
  }
}

export function collapseHierarchyAll(state: HierarchyState): void {
  if (state.expanded.size > 0) {
    state.expanded.clear();
    state.version++;
  }
}

export function getHierarchyRows(state: Readonly<HierarchyState>, root: NodeAny): HierarchyRow[] {
  const rows: HierarchyRow[] = [];
  collectRows(state, root, 0, rows);
  return rows;
}

function collectRows(state: Readonly<HierarchyState>, node: NodeAny, depth: number, rows: HierarchyRow[]): void {
  const childCount = getNodeChildCount(node);
  const hasChildren = childCount > 0;
  const expanded = state.expanded.has(node);
  rows.push({ node, depth, hasChildren, expanded: hasChildren && expanded });

  if (hasChildren && expanded) {
    for (let i = 0; i < childCount; i++) {
      collectRows(state, getNodeChildAt(node, i), depth + 1, rows);
    }
  }
}

export function expandHierarchyToNode(state: HierarchyState, node: NodeAny): void {
  let current = getNodeParent(node);
  let changed = false;
  while (current !== null) {
    if (!state.expanded.has(current)) {
      state.expanded.add(current);
      changed = true;
    }
    current = getNodeParent(current);
  }
  if (changed) {
    state.version++;
  }
}

export function getHierarchyVersion(state: Readonly<HierarchyState>): number {
  return state.version;
}
