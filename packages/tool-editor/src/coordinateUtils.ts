import type { EditorViewport } from '@flighthq/editor-viewport';

import { editorViewportScreenToWorld, editorViewportWorldToScreen } from '@flighthq/editor-viewport';

export interface CoordinatePoint {
  readonly x: number;
  readonly y: number;
}

export function screenToScene(viewport: Readonly<EditorViewport>, screenX: number, screenY: number): CoordinatePoint {
  const out = { x: 0, y: 0 };
  editorViewportScreenToWorld(viewport, screenX, screenY, out);
  return out;
}

export function sceneToScreen(viewport: Readonly<EditorViewport>, sceneX: number, sceneY: number): CoordinatePoint {
  const out = { x: 0, y: 0 };
  editorViewportWorldToScreen(viewport, sceneX, sceneY, out);
  return out;
}

export function screenToSceneDistance(viewport: Readonly<EditorViewport>, screenDistance: number): number {
  return screenDistance / viewport.camera.zoom;
}

export function sceneToScreenDistance(viewport: Readonly<EditorViewport>, sceneDistance: number): number {
  return sceneDistance * viewport.camera.zoom;
}
