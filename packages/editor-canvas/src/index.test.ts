import * as canvas from './index';

describe('@flighthq/editor-canvas exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(canvas).sort()).toEqual([
      'createCanvasState',
      'getBackgroundPattern',
      'getCanvasVersion',
      'getOverlayOpacity',
      'getPixelRatio',
      'isShowBounds',
      'isShowGrid',
      'isShowGuides',
      'isShowPixelGrid',
      'setBackgroundPattern',
      'setOverlayOpacity',
      'setPixelRatio',
      'setShowBounds',
      'setShowGrid',
      'setShowGuides',
      'setShowPixelGrid',
    ]);
  });
});
