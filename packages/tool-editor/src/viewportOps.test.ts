import { addNodeChild } from '@flighthq/node';
import { addToSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { createNewScene } from './sceneManager';
import {
  centerOnPoint,
  fitToScene,
  frameNode,
  frameSelection,
  getVisibleSceneBounds,
  panViewport,
  resizeViewport,
  zoomAtPoint,
} from './viewportOps';

function setupEditor() {
  const editor = createEditorState(800, 600);
  createNewScene(editor, 800, 600);
  return editor;
}

describe('fitToScene', () => {
  it('adjusts viewport to scene bounds', () => {
    const editor = setupEditor();
    expect(fitToScene(editor)).toBe(true);
  });

  it('returns false with no scene', () => {
    const editor = createEditorState();
    expect(fitToScene(editor)).toBe(false);
  });
});

describe('frameSelection', () => {
  it('frames selected nodes', () => {
    const editor = setupEditor();
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(editor.scene!.root, node);
    addToSelection(editor.selection, node);
    expect(frameSelection(editor)).toBe(true);
  });

  it('returns false with empty selection', () => {
    const editor = setupEditor();
    expect(frameSelection(editor)).toBe(false);
  });
});

describe('frameNode', () => {
  it('frames a single node', () => {
    const editor = setupEditor();
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(editor.scene!.root, node);
    expect(frameNode(editor, node)).toBe(true);
  });
});

describe('centerOnPoint', () => {
  it('centers viewport on a point', () => {
    const editor = setupEditor();
    centerOnPoint(editor, 400, 300);
    const bounds = getVisibleSceneBounds(editor);
    expect(typeof bounds.x).toBe('number');
  });
});

describe('panViewport', () => {
  it('shifts viewport by delta', () => {
    const editor = setupEditor();
    const before = getVisibleSceneBounds(editor);
    panViewport(editor, 50, 0);
    const after = getVisibleSceneBounds(editor);
    expect(after.x).not.toBe(before.x);
  });
});

describe('zoomAtPoint', () => {
  it('changes zoom at a screen point', () => {
    const editor = setupEditor();
    const before = editor.viewport.camera.zoom;
    zoomAtPoint(editor, 400, 300, 2);
    expect(editor.viewport.camera.zoom).toBeGreaterThan(before);
  });
});

describe('resizeViewport', () => {
  it('updates viewport dimensions', () => {
    const editor = setupEditor();
    resizeViewport(editor, 1024, 768);
    expect(editor.viewport.camera.viewportWidth).toBe(1024);
    expect(editor.viewport.camera.viewportHeight).toBe(768);
  });
});

describe('getVisibleSceneBounds', () => {
  it('returns a rectangle', () => {
    const editor = setupEditor();
    const bounds = getVisibleSceneBounds(editor);
    expect(typeof bounds.x).toBe('number');
    expect(typeof bounds.width).toBe('number');
  });
});
