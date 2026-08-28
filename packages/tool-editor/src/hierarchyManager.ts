import type { EditorState } from './editorState';
import type { HierarchyRow } from '@flighthq/editor-hierarchy';
import type { NodeAny } from '@flighthq/types';

import {
  collapseHierarchyAll,
  collapseHierarchyNode,
  expandHierarchyAll,
  expandHierarchyNode,
  expandHierarchyToNode,
  getHierarchyRows,
  isHierarchyNodeExpanded,
  toggleHierarchyNode,
} from '@flighthq/editor-hierarchy';
import { addToSelection, clearSelection, getSelectedNodes } from '@flighthq/editor-selection';

export function getHierarchyTreeRows(editor: Readonly<EditorState>): HierarchyRow[] {
  if (editor.scene === null) return [];
  return getHierarchyRows(editor.hierarchy, editor.scene.root);
}

export function expandNode(editor: EditorState, node: NodeAny): void {
  expandHierarchyNode(editor.hierarchy, node);
}

export function collapseNode(editor: EditorState, node: NodeAny): void {
  collapseHierarchyNode(editor.hierarchy, node);
}

export function toggleNode(editor: EditorState, node: NodeAny): void {
  toggleHierarchyNode(editor.hierarchy, node);
}

export function expandAll(editor: EditorState): void {
  if (editor.scene === null) return;
  expandHierarchyAll(editor.hierarchy, editor.scene.root);
}

export function collapseAll(editor: EditorState): void {
  collapseHierarchyAll(editor.hierarchy);
}

export function revealNode(editor: EditorState, node: NodeAny): void {
  expandHierarchyToNode(editor.hierarchy, node);
}

export function isNodeExpanded(editor: Readonly<EditorState>, node: NodeAny): boolean {
  return isHierarchyNodeExpanded(editor.hierarchy, node);
}

export function selectAndRevealNode(editor: EditorState, node: NodeAny): void {
  clearSelection(editor.selection);
  addToSelection(editor.selection, node);
  expandHierarchyToNode(editor.hierarchy, node);
}

export function revealSelectedNodes(editor: EditorState): void {
  const selected = getSelectedNodes(editor.selection);
  for (const node of selected) {
    expandHierarchyToNode(editor.hierarchy, node);
  }
}
