import type { NodeAny } from '@flighthq/types';

import type { EditorState } from './editorState';

import {
  addToSelection,
  clearSelection,
  getSelectionCount,
  getSelectedNodes,
  isSelected,
  removeFromSelection,
  setSelection,
} from '@flighthq/editor-selection';
import { forEachNodeChild, getNodeChildCount } from '@flighthq/node';

export function selectAll(editor: EditorState): number {
  if (!editor.scene) return 0;
  const root = editor.scene.root;
  const children: NodeAny[] = [];
  forEachNodeChild(root, (child) => {
    children.push(child);
  });
  setSelection(editor.selection, children);
  return children.length;
}

export function deselectAll(editor: EditorState): void {
  clearSelection(editor.selection);
}

export function invertSelection(editor: EditorState): number {
  if (!editor.scene) return 0;
  const root = editor.scene.root;
  const inverted: NodeAny[] = [];
  forEachNodeChild(root, (child) => {
    if (!isSelected(editor.selection, child)) {
      inverted.push(child);
    }
  });
  setSelection(editor.selection, inverted);
  return inverted.length;
}

export function getEditorSelectionCount(editor: Readonly<EditorState>): number {
  return getSelectionCount(editor.selection);
}

export function getEditorSelectedNodes(editor: Readonly<EditorState>): readonly NodeAny[] {
  return getSelectedNodes(editor.selection);
}

export function selectNode(editor: EditorState, node: NodeAny): void {
  addToSelection(editor.selection, node);
}

export function deselectNode(editor: EditorState, node: NodeAny): void {
  removeFromSelection(editor.selection, node);
}

export function isNodeSelected(editor: Readonly<EditorState>, node: NodeAny): boolean {
  return isSelected(editor.selection, node);
}

export function hasSelection(editor: Readonly<EditorState>): boolean {
  return getSelectionCount(editor.selection) > 0;
}

export function getSelectableCount(editor: Readonly<EditorState>): number {
  if (!editor.scene) return 0;
  return getNodeChildCount(editor.scene.root);
}
