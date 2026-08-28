import { createEditorViewport } from '@flighthq/editor-viewport';
import { describe, expect, it } from 'vitest';

import { sceneToScreen, sceneToScreenDistance, screenToScene, screenToSceneDistance } from './coordinateUtils';

describe('screenToScene', () => {
  it('converts through camera position, zoom, and viewport center', () => {
    const viewport = createEditorViewport(800, 600);
    viewport.camera.x = 100;
    viewport.camera.y = 50;
    viewport.camera.zoom = 2;
    expect(screenToScene(viewport, 400, 300)).toEqual({ x: 100, y: 50 });
    expect(screenToScene(viewport, 440, 280)).toEqual({ x: 120, y: 40 });
  });
});

describe('sceneToScreen', () => {
  it('projects scene points and inverts screen-to-scene conversion', () => {
    const viewport = createEditorViewport(640, 480);
    viewport.camera.x = -20;
    viewport.camera.y = 30;
    viewport.camera.zoom = 1.5;
    const screen = sceneToScreen(viewport, 12, -8);
    expect(screenToScene(viewport, screen.x, screen.y)).toEqual({ x: 12, y: -8 });
  });
});

describe('screenToSceneDistance', () => {
  it('divides screen distance by zoom while preserving signs', () => {
    const viewport = createEditorViewport(100, 100);
    viewport.camera.zoom = 4;
    expect(screenToSceneDistance(viewport, 24)).toBe(6);
    expect(screenToSceneDistance(viewport, -8)).toBe(-2);
  });
});

describe('sceneToScreenDistance', () => {
  it('multiplies scene distance by zoom', () => {
    const viewport = createEditorViewport(100, 100);
    viewport.camera.zoom = 0.5;
    expect(sceneToScreenDistance(viewport, 24)).toBe(12);
  });
});
