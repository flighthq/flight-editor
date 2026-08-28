import type {
  TransformOriginBounds,
  TransformOriginMode,
  TransformOriginPoint,
} from '@flighthq/editor-transform-origin';
import type { EditorState } from './editorState';

import {
  computeTransformOriginPoint,
  getCustomTransformOrigin,
  getTransformOriginMode,
  setCustomTransformOrigin,
  setTransformOriginMode,
} from '@flighthq/editor-transform-origin';

export function setEditorTransformOriginMode(editor: EditorState, mode: TransformOriginMode): void {
  setTransformOriginMode(editor.transformOrigin, mode);
}

export function getEditorTransformOriginMode(editor: Readonly<EditorState>): TransformOriginMode {
  return getTransformOriginMode(editor.transformOrigin);
}

export function setEditorCustomTransformOrigin(editor: EditorState, x: number, y: number): void {
  setCustomTransformOrigin(editor.transformOrigin, x, y);
}

export function getEditorCustomTransformOrigin(editor: Readonly<EditorState>): TransformOriginPoint {
  return getCustomTransformOrigin(editor.transformOrigin);
}

export function computeEditorTransformOrigin(
  editor: Readonly<EditorState>,
  bounds: TransformOriginBounds,
): TransformOriginPoint {
  return computeTransformOriginPoint(editor.transformOrigin, bounds);
}
