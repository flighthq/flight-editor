import type { Node } from '@flighthq/types';

export type SelectionFilter = (node: Readonly<Node>) => boolean;

export interface SelectionState {
  nodes: Node[];
  version: number;
}

export function createSelectionState(): SelectionState {
  return { nodes: [], version: 0 };
}

export function getSelectedNodes(state: Readonly<SelectionState>): ReadonlyArray<Node> {
  return state.nodes;
}

export function getSelectionCount(state: Readonly<SelectionState>): number {
  return state.nodes.length;
}

export function getPrimarySelection(state: Readonly<SelectionState>): Node | null {
  return state.nodes.length > 0 ? state.nodes[0] : null;
}

export function isSelected(state: Readonly<SelectionState>, node: Readonly<Node>): boolean {
  return state.nodes.indexOf(node as Node) !== -1;
}

export function setSelection(state: SelectionState, nodes: ReadonlyArray<Node>, filter?: SelectionFilter): void {
  state.nodes.length = 0;
  for (const node of nodes) {
    if (filter !== undefined && !filter(node)) continue;
    if (state.nodes.indexOf(node) === -1) state.nodes.push(node);
  }
  state.version++;
}

export function addToSelection(state: SelectionState, node: Node, filter?: SelectionFilter): boolean {
  if (filter !== undefined && !filter(node)) return false;
  if (state.nodes.indexOf(node) !== -1) return false;
  state.nodes.push(node);
  state.version++;
  return true;
}

export function removeFromSelection(state: SelectionState, node: Node): boolean {
  const index = state.nodes.indexOf(node);
  if (index === -1) return false;
  state.nodes.splice(index, 1);
  state.version++;
  return true;
}

export function toggleSelection(state: SelectionState, node: Node, filter?: SelectionFilter): boolean {
  const index = state.nodes.indexOf(node);
  if (index !== -1) {
    state.nodes.splice(index, 1);
    state.version++;
    return false;
  }
  if (filter !== undefined && !filter(node)) return false;
  state.nodes.push(node);
  state.version++;
  return true;
}

export function clearSelection(state: SelectionState): boolean {
  if (state.nodes.length === 0) return false;
  state.nodes.length = 0;
  state.version++;
  return true;
}
