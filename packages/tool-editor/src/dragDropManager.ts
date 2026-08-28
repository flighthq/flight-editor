import type { DragPayload, DragPosition } from '@flighthq/editor-drag-drop';
import type { EditorState } from './editorState';

import {
  beginDrag,
  cancelDrag,
  endDrag,
  getDragPayload,
  getDragPosition,
  getDropTarget,
  isDragging,
  setDropTarget,
  updateDragPosition,
} from '@flighthq/editor-drag-drop';

export function beginEditorDrag(
  editor: EditorState,
  source: DragPayload['source'],
  kind: string,
  data: unknown,
  x: number,
  y: number,
): void {
  beginDrag(editor.dragDrop, { source, kind, data }, x, y);
}

export function updateEditorDragPosition(editor: EditorState, x: number, y: number): void {
  updateDragPosition(editor.dragDrop, x, y);
}

export function setEditorDropTarget(editor: EditorState, target: unknown): void {
  setDropTarget(editor.dragDrop, target);
}

export function endEditorDrag(editor: EditorState): DragPayload | null {
  return endDrag(editor.dragDrop);
}

export function cancelEditorDrag(editor: EditorState): void {
  cancelDrag(editor.dragDrop);
}

export function isEditorDragging(editor: Readonly<EditorState>): boolean {
  return isDragging(editor.dragDrop);
}

export function getEditorDragPayload(editor: Readonly<EditorState>): DragPayload | null {
  return getDragPayload(editor.dragDrop);
}

export function getEditorDragPosition(editor: Readonly<EditorState>): Readonly<DragPosition> | null {
  return getDragPosition(editor.dragDrop);
}

export function getEditorDropTarget(editor: Readonly<EditorState>): unknown | null {
  return getDropTarget(editor.dragDrop);
}

export function beginLibraryDrag(editor: EditorState, kind: string, data: unknown, x: number, y: number): void {
  beginDrag(editor.dragDrop, { source: 'library', kind, data }, x, y);
}

export function beginHierarchyDrag(editor: EditorState, kind: string, data: unknown, x: number, y: number): void {
  beginDrag(editor.dragDrop, { source: 'hierarchy', kind, data }, x, y);
}

export function beginExternalDrag(editor: EditorState, kind: string, data: unknown, x: number, y: number): void {
  beginDrag(editor.dragDrop, { source: 'external', kind, data }, x, y);
}
