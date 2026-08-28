import type { SnapGuide, SnapResult } from '@flighthq/editor-snap';
import type { EditorState } from './editorState';

import {
  addSnapGuide,
  clearSnapGuides,
  enableSnapGrid,
  removeSnapGuide,
  setSnapGrid,
  snapPosition,
} from '@flighthq/editor-snap';

export function setEditorSnapGrid(editor: EditorState, gridSizeX: number, gridSizeY: number): void {
  setSnapGrid(editor.snap, gridSizeX, gridSizeY);
}

export function enableEditorSnapGrid(editor: EditorState, enabled: boolean): void {
  enableSnapGrid(editor.snap, enabled);
}

export function isEditorSnapGridEnabled(editor: Readonly<EditorState>): boolean {
  return editor.snap.gridEnabled;
}

export function getEditorSnapGridSize(editor: Readonly<EditorState>): { x: number; y: number } {
  return { x: editor.snap.gridSizeX, y: editor.snap.gridSizeY };
}

export function addEditorSnapGuide(editor: EditorState, guide: Readonly<SnapGuide>): void {
  addSnapGuide(editor.snap, guide);
}

export function removeEditorSnapGuide(editor: EditorState, index: number): void {
  removeSnapGuide(editor.snap, index);
}

export function clearEditorSnapGuides(editor: EditorState): void {
  clearSnapGuides(editor.snap);
}

export function snapEditorPosition(
  editor: Readonly<EditorState>,
  x: number,
  y: number,
  threshold?: number,
): SnapResult {
  return snapPosition(editor.snap, x, y, threshold);
}
