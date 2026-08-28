import type { NodeAny } from '@flighthq/types';

export type SelectionFilter = (node: Readonly<NodeAny>) => boolean;

export interface SelectionState {
  nodes: NodeAny[];
  version: number;
}

export function createSelectionState(): SelectionState {
  return { nodes: [], version: 0 };
}

export function getSelectedNodes(state: Readonly<SelectionState>): ReadonlyArray<NodeAny> {
  return state.nodes;
}

export function getSelectionCount(state: Readonly<SelectionState>): number {
  return state.nodes.length;
}

export function getPrimarySelection(state: Readonly<SelectionState>): NodeAny | null {
  return state.nodes.length > 0 ? state.nodes[0] : null;
}

export function isSelected(state: Readonly<SelectionState>, node: Readonly<NodeAny>): boolean {
  return state.nodes.indexOf(node as NodeAny) !== -1;
}

export function setSelection(state: SelectionState, nodes: ReadonlyArray<NodeAny>, filter?: SelectionFilter): void {
  state.nodes.length = 0;
  for (const node of nodes) {
    if (filter !== undefined && !filter(node)) continue;
    if (state.nodes.indexOf(node) === -1) state.nodes.push(node);
  }
  state.version++;
}

export function addToSelection(state: SelectionState, node: NodeAny, filter?: SelectionFilter): boolean {
  if (filter !== undefined && !filter(node)) return false;
  if (state.nodes.indexOf(node) !== -1) return false;
  state.nodes.push(node);
  state.version++;
  return true;
}

export function removeFromSelection(state: SelectionState, node: NodeAny): boolean {
  const index = state.nodes.indexOf(node);
  if (index === -1) return false;
  state.nodes.splice(index, 1);
  state.version++;
  return true;
}

export function toggleSelection(state: SelectionState, node: NodeAny, filter?: SelectionFilter): boolean {
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
