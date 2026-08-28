import type { ZoomPreset } from '@flighthq/editor-zoom-presets';
import type { EditorState } from './editorState';

import {
  addZoomPreset,
  computeFitWidthZoom,
  computeFitZoom,
  findNearestPreset,
  getNextZoomIn,
  getNextZoomOut,
  getZoomPreset,
  getZoomPresets,
  getZoomPresetVersion,
  removeZoomPreset,
} from '@flighthq/editor-zoom-presets';

export function addEditorZoomPreset(editor: EditorState, id: string, label: string, zoom: number): void {
  addZoomPreset(editor.zoomPresets, id, label, zoom);
}

export function removeEditorZoomPreset(editor: EditorState, id: string): boolean {
  return removeZoomPreset(editor.zoomPresets, id);
}

export function getEditorZoomPreset(editor: Readonly<EditorState>, id: string): ZoomPreset | null {
  return getZoomPreset(editor.zoomPresets, id);
}

export function getEditorZoomPresets(editor: Readonly<EditorState>): readonly ZoomPreset[] {
  return getZoomPresets(editor.zoomPresets);
}

export function findEditorNearestPreset(editor: Readonly<EditorState>, zoom: number): ZoomPreset | null {
  return findNearestPreset(editor.zoomPresets, zoom);
}

export function getEditorNextZoomIn(editor: Readonly<EditorState>, currentZoom: number): number | null {
  return getNextZoomIn(editor.zoomPresets, currentZoom);
}

export function getEditorNextZoomOut(editor: Readonly<EditorState>, currentZoom: number): number | null {
  return getNextZoomOut(editor.zoomPresets, currentZoom);
}

export function computeEditorFitZoom(
  sceneWidth: number,
  sceneHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): number {
  return computeFitZoom(sceneWidth, sceneHeight, viewportWidth, viewportHeight);
}

export function computeEditorFitWidthZoom(sceneWidth: number, viewportWidth: number): number {
  return computeFitWidthZoom(sceneWidth, viewportWidth);
}

export function getEditorZoomPresetVersion(editor: Readonly<EditorState>): number {
  return getZoomPresetVersion(editor.zoomPresets);
}
