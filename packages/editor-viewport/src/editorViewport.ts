import type { Camera2D, RectangleLike, Vector2Like } from '@flighthq/types';

import {
  createCamera2D,
  getCamera2DVisibleBounds,
  projectCamera2DPoint,
  unprojectCamera2DPoint,
  zoomCamera2DAtScreenPoint,
} from '@flighthq/camera';
import { clamp } from '@flighthq/math';

export interface EditorViewportConfig {
  minZoom: number;
  maxZoom: number;
}

export interface EditorViewport {
  camera: Camera2D;
  config: EditorViewportConfig;
}

const DEFAULT_CONFIG: Readonly<EditorViewportConfig> = {
  minZoom: 0.05,
  maxZoom: 64,
};

export function createEditorViewport(
  width: number,
  height: number,
  config?: Partial<Readonly<EditorViewportConfig>>,
): EditorViewport {
  return {
    camera: createCamera2D(width, height),
    config: { ...DEFAULT_CONFIG, ...config },
  };
}

export function getEditorViewportCamera(viewport: Readonly<EditorViewport>): Readonly<Camera2D> {
  return viewport.camera;
}

export function getEditorViewportZoom(viewport: Readonly<EditorViewport>): number {
  return viewport.camera.zoom;
}

export function setEditorViewportZoom(viewport: EditorViewport, zoom: number): void {
  viewport.camera.zoom = clamp(zoom, viewport.config.minZoom, viewport.config.maxZoom);
}

export function setEditorViewportSize(viewport: EditorViewport, width: number, height: number): void {
  viewport.camera.viewportWidth = width;
  viewport.camera.viewportHeight = height;
}

export function panEditorViewport(viewport: EditorViewport, deltaX: number, deltaY: number): void {
  viewport.camera.x += deltaX / viewport.camera.zoom;
  viewport.camera.y += deltaY / viewport.camera.zoom;
}

export function zoomEditorViewportAtPoint(
  viewport: EditorViewport,
  screenX: number,
  screenY: number,
  zoom: number,
): void {
  const clamped = clamp(zoom, viewport.config.minZoom, viewport.config.maxZoom);
  zoomCamera2DAtScreenPoint(viewport.camera, screenX, screenY, clamped);
  viewport.camera.zoom = clamp(viewport.camera.zoom, viewport.config.minZoom, viewport.config.maxZoom);
}

export function editorViewportScreenToWorld(
  viewport: Readonly<EditorViewport>,
  screenX: number,
  screenY: number,
  out: Vector2Like,
): void {
  unprojectCamera2DPoint(viewport.camera, screenX, screenY, out);
}

export function editorViewportWorldToScreen(
  viewport: Readonly<EditorViewport>,
  worldX: number,
  worldY: number,
  out: Vector2Like,
): void {
  projectCamera2DPoint(viewport.camera, worldX, worldY, out);
}

export function getEditorViewportVisibleBounds(viewport: Readonly<EditorViewport>, out: RectangleLike): void {
  getCamera2DVisibleBounds(viewport.camera, out);
}

export function centerEditorViewportOnPoint(viewport: EditorViewport, worldX: number, worldY: number): void {
  viewport.camera.x = worldX;
  viewport.camera.y = worldY;
}

export function fitEditorViewportToRect(
  viewport: EditorViewport,
  rect: Readonly<RectangleLike>,
  padding: number = 0,
): void {
  const contentWidth = rect.width + padding * 2;
  const contentHeight = rect.height + padding * 2;
  if (contentWidth <= 0 || contentHeight <= 0) return;

  const scaleX = viewport.camera.viewportWidth / contentWidth;
  const scaleY = viewport.camera.viewportHeight / contentHeight;
  const zoom = clamp(Math.min(scaleX, scaleY), viewport.config.minZoom, viewport.config.maxZoom);

  viewport.camera.x = rect.x + rect.width / 2;
  viewport.camera.y = rect.y + rect.height / 2;
  viewport.camera.zoom = zoom;
}
