import type { RulerUnit } from '@flighthq/editor-rulers';
import type { EditorState } from './editorState';

import {
  getRulerOrigin,
  getRulerSubdivisions,
  getRulerTickSpacing,
  getRulerUnit,
  getSubdivisionSpacing,
  hideRulers,
  isRulerVisible,
  resetRulerOrigin,
  setRulerOrigin,
  setRulerSubdivisions,
  setRulerTickSpacing,
  setRulerUnit,
  showRulers,
  toggleRulers,
} from '@flighthq/editor-rulers';

export function showEditorRulers(editor: EditorState): void {
  showRulers(editor.rulers);
}

export function hideEditorRulers(editor: EditorState): void {
  hideRulers(editor.rulers);
}

export function toggleEditorRulers(editor: EditorState): void {
  toggleRulers(editor.rulers);
}

export function setEditorRulerUnit(editor: EditorState, unit: RulerUnit): void {
  setRulerUnit(editor.rulers, unit);
}

export function setEditorRulerOrigin(editor: EditorState, x: number, y: number): void {
  setRulerOrigin(editor.rulers, x, y);
}

export function resetEditorRulerOrigin(editor: EditorState): void {
  resetRulerOrigin(editor.rulers);
}

export function setEditorRulerTickSpacing(editor: EditorState, spacing: number): void {
  setRulerTickSpacing(editor.rulers, spacing);
}

export function setEditorRulerSubdivisions(editor: EditorState, subdivisions: number): void {
  setRulerSubdivisions(editor.rulers, subdivisions);
}

export function areEditorRulersVisible(editor: Readonly<EditorState>): boolean {
  return isRulerVisible(editor.rulers);
}

export function getEditorRulerUnit(editor: Readonly<EditorState>): RulerUnit {
  return getRulerUnit(editor.rulers);
}

export function getEditorRulerOrigin(editor: Readonly<EditorState>): Readonly<{ x: number; y: number }> {
  return getRulerOrigin(editor.rulers);
}

export function getEditorRulerTickSpacing(editor: Readonly<EditorState>): number {
  return getRulerTickSpacing(editor.rulers);
}

export function getEditorRulerSubdivisions(editor: Readonly<EditorState>): number {
  return getRulerSubdivisions(editor.rulers);
}

export function getEditorSubdivisionSpacing(editor: Readonly<EditorState>): number {
  return getSubdivisionSpacing(editor.rulers);
}
