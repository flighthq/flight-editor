import * as rulers from './index';

describe('@flighthq/editor-rulers exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(rulers).sort()).toEqual([
      'createRulerState',
      'getRulerOrigin',
      'getRulerSubdivisions',
      'getRulerTickSpacing',
      'getRulerUnit',
      'getRulerVersion',
      'getSubdivisionSpacing',
      'hideRulers',
      'isRulerVisible',
      'resetRulerOrigin',
      'setRulerOrigin',
      'setRulerSubdivisions',
      'setRulerTickSpacing',
      'setRulerUnit',
      'showRulers',
      'toggleRulers',
    ]);
  });
});
