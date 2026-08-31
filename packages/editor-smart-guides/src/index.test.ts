import * as smartGuides from './index';

describe('@flighthq/editor-smart-guides exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(smartGuides).sort()).toEqual([
      'clearActiveSmartGuides',
      'createSmartGuideState',
      'getActiveSmartGuideCount',
      'getActiveSmartGuides',
      'getSmartGuideVersion',
      'isSmartGuidesEnabled',
      'isSpacingGuidesEnabled',
      'setActiveSmartGuides',
      'setSmartGuidesEnabled',
      'setSpacingGuidesEnabled',
    ]);
  });
});
