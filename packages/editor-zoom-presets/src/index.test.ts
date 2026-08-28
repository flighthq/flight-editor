import * as zoomPresets from './index';

describe('@flighthq/editor-zoom-presets exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(zoomPresets).sort()).toEqual(
      [
        'addZoomPreset',
        'computeFitWidthZoom',
        'computeFitZoom',
        'createZoomPresetState',
        'findNearestPreset',
        'getNextZoomIn',
        'getNextZoomOut',
        'getZoomPreset',
        'getZoomPresets',
        'getZoomPresetVersion',
        'removeZoomPreset',
      ].sort(),
    );
  });
});
