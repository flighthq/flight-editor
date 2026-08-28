import type { NodeAny } from '@flighthq/types';
import type { EditorState } from './editorState';

import { clearLocks, getLockedCount, isLocked, lockNode, toggleLock, unlockNode } from '@flighthq/editor-lock';
import { getSelectedNodes, getSelectionCount } from '@flighthq/editor-selection';

export function lockSelectedNodes(editor: EditorState): number {
  const nodes = getSelectedNodes(editor.selection);
  let count = 0;
  for (const node of nodes) {
    if (!isLocked(editor.locks, node)) {
      lockNode(editor.locks, node);
      count++;
    }
  }
  return count;
}

export function unlockSelectedNodes(editor: EditorState): number {
  const nodes = getSelectedNodes(editor.selection);
  let count = 0;
  for (const node of nodes) {
    if (isLocked(editor.locks, node)) {
      unlockNode(editor.locks, node);
      count++;
    }
  }
  return count;
}

export function toggleSelectedLocks(editor: EditorState): void {
  const nodes = getSelectedNodes(editor.selection);
  for (const node of nodes) {
    toggleLock(editor.locks, node);
  }
}

export function isSelectionLocked(editor: Readonly<EditorState>): boolean {
  const nodes = getSelectedNodes(editor.selection);
  return nodes.length > 0 && nodes.every((node) => isLocked(editor.locks, node));
}

export function isSelectionPartiallyLocked(editor: Readonly<EditorState>): boolean {
  const nodes = getSelectedNodes(editor.selection);
  if (nodes.length === 0) return false;
  const lockedCount = nodes.filter((node) => isLocked(editor.locks, node)).length;
  return lockedCount > 0 && lockedCount < nodes.length;
}

export function isEditorNodeLocked(editor: Readonly<EditorState>, node: NodeAny): boolean {
  return isLocked(editor.locks, node);
}

export function lockEditorNode(editor: EditorState, node: NodeAny): void {
  lockNode(editor.locks, node);
}

export function unlockEditorNode(editor: EditorState, node: NodeAny): void {
  unlockNode(editor.locks, node);
}

export function toggleEditorNodeLock(editor: EditorState, node: NodeAny): void {
  toggleLock(editor.locks, node);
}

export function clearEditorLocks(editor: EditorState): void {
  clearLocks(editor.locks);
}

export function getEditorLockedCount(editor: Readonly<EditorState>): number {
  return getLockedCount(editor.locks);
}

export function hasLockedSelection(editor: Readonly<EditorState>): boolean {
  if (getSelectionCount(editor.selection) === 0) return false;
  return getSelectedNodes(editor.selection).some((node) => isLocked(editor.locks, node));
}
