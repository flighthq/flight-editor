import type { EditorState } from './editorState';

import { setZoomPercent } from '@flighthq/editor-status';
import { getEditorViewportZoom, setEditorViewportZoom } from '@flighthq/editor-viewport';
import { computeFitZoom, getNextZoomIn, getNextZoomOut } from '@flighthq/editor-zoom-presets';

export function getZoomLevel(editor: Readonly<EditorState>): number {
  return getEditorViewportZoom(editor.viewport);
}

export function getZoomPercent(editor: Readonly<EditorState>): number {
  return Math.round(getZoomLevel(editor) * 100);
}

export function getZoomPercentLabel(editor: Readonly<EditorState>): string {
  return `${getZoomPercent(editor)}%`;
}

export function setZoomLevel(editor: EditorState, zoom: number): void {
  const clamped = Math.max(0.01, Math.min(zoom, 64));
  setEditorViewportZoom(editor.viewport, clamped);
  setZoomPercent(editor.statusBar, Math.round(clamped * 100));
}

export function zoomIn(editor: EditorState): boolean {
  const current = getZoomLevel(editor);
  const next = getNextZoomIn(editor.zoomPresets, current);
  if (next === null) return false;
  setZoomLevel(editor, next);
  return true;
}

export function zoomOut(editor: EditorState): boolean {
  const current = getZoomLevel(editor);
  const next = getNextZoomOut(editor.zoomPresets, current);
  if (next === null) return false;
  setZoomLevel(editor, next);
  return true;
}

export function zoomToActualSize(editor: EditorState): void {
  setZoomLevel(editor, 1);
}

export function zoomToFit(editor: EditorState, sceneWidth: number, sceneHeight: number): void {
  const viewportWidth = editor.viewport.camera.viewportWidth;
  const viewportHeight = editor.viewport.camera.viewportHeight;
  const fitZoom = computeFitZoom(sceneWidth, sceneHeight, viewportWidth, viewportHeight);
  setZoomLevel(editor, fitZoom);
}
