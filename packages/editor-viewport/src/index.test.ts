import * as viewport from './index';

describe('@flighthq/editor-viewport exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(viewport).sort()).toEqual([
      'centerEditorViewportOnPoint',
      'createEditorViewport',
      'editorViewportScreenToWorld',
      'editorViewportWorldToScreen',
      'fitEditorViewportToRect',
      'getEditorViewportCamera',
      'getEditorViewportVisibleBounds',
      'getEditorViewportZoom',
      'panEditorViewport',
      'setEditorViewportSize',
      'setEditorViewportZoom',
      'zoomEditorViewportAtPoint',
    ]);
  });
});
