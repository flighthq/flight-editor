import type { Node2D } from '@flighthq/types';

import type { EditorState } from './editorState';

import { getSelectedNodes } from '@flighthq/editor-selection';
import {
  centerEditorViewportOnPoint,
  fitEditorViewportToRect,
  getEditorViewportVisibleBounds,
  panEditorViewport,
  setEditorViewportSize,
  zoomEditorViewportAtPoint,
} from '@flighthq/editor-viewport';
import { computeNodeBoundsRectangle, getNodeRoot } from '@flighthq/node';

import { getSceneBounds, getSelectionBounds } from './boundsUtils';
import { setZoomLevel } from './zoomController';

export function fitToScene(editor: EditorState, padding = 32): boolean {
  if (!editor.scene) return false;
  const bounds = getSceneBounds(editor.scene);
  fitEditorViewportToRect(editor.viewport, bounds, padding);
  syncZoomStatus(editor);
  return true;
}

export function frameSelection(editor: EditorState, padding = 32): boolean {
  const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
  if (nodes.length === 0) return false;
  const bounds = getSelectionBounds(nodes);
  if (!bounds) return false;
  fitEditorViewportToRect(editor.viewport, bounds, padding);
  syncZoomStatus(editor);
  return true;
}

export function frameNode(editor: EditorState, node: Node2D, padding = 32): boolean {
  const rect = { x: 0, y: 0, width: 0, height: 0 };
  computeNodeBoundsRectangle(rect, node, getNodeRoot(node));
  if (rect.width < 0 || rect.height < 0) return false;
  fitEditorViewportToRect(editor.viewport, rect, padding);
  syncZoomStatus(editor);
  return true;
}

export function centerOnPoint(editor: EditorState, x: number, y: number): void {
  centerEditorViewportOnPoint(editor.viewport, x, y);
}

export function panViewport(editor: EditorState, dx: number, dy: number): void {
  panEditorViewport(editor.viewport, dx, dy);
}

export function zoomAtPoint(editor: EditorState, screenX: number, screenY: number, zoomDelta: number): void {
  const current = editor.viewport.camera.zoom;
  const next = Math.max(0.01, Math.min(current * zoomDelta, 64));
  zoomEditorViewportAtPoint(editor.viewport, screenX, screenY, next);
  syncZoomStatus(editor);
}

export function resizeViewport(editor: EditorState, width: number, height: number): void {
  setEditorViewportSize(editor.viewport, width, height);
}

export function getVisibleSceneBounds(editor: Readonly<EditorState>): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const out = { x: 0, y: 0, width: 0, height: 0 };
  getEditorViewportVisibleBounds(editor.viewport, out);
  return out;
}

function syncZoomStatus(editor: EditorState): void {
  setZoomLevel(editor, editor.viewport.camera.zoom);
}
