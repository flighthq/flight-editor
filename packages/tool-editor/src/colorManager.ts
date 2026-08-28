import type { EditorState } from './editorState';

import {
  addRecentColor,
  addSwatch,
  clearSwatches,
  getActiveColor,
  getRecentColors,
  getSwatches,
  removeSwatch,
  setActiveColor,
} from '@flighthq/editor-color';

export function setEditorActiveColor(editor: EditorState, color: number): void {
  setActiveColor(editor.color, color);
  addRecentColor(editor.color, color);
}

export function getEditorActiveColor(editor: Readonly<EditorState>): number {
  return getActiveColor(editor.color);
}

export function addEditorSwatch(editor: EditorState, color: number): void {
  addSwatch(editor.color, color);
}

export function removeEditorSwatch(editor: EditorState, index: number): boolean {
  return removeSwatch(editor.color, index);
}

export function getEditorSwatches(editor: Readonly<EditorState>): readonly number[] {
  return getSwatches(editor.color);
}

export function clearEditorSwatches(editor: EditorState): void {
  clearSwatches(editor.color);
}

export function getEditorRecentColors(editor: Readonly<EditorState>): readonly number[] {
  return getRecentColors(editor.color);
}

export function saveActiveAsSwatch(editor: EditorState): void {
  const color = getActiveColor(editor.color);
  addSwatch(editor.color, color);
}
