import * as guides from './index';

describe('@flighthq/editor-guides exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(guides).sort()).toEqual([
      'addGuide',
      'clearGuides',
      'createGuidesState',
      'getGuideById',
      'getGuideCount',
      'getGuideSnapPositions',
      'getGuidesByAxis',
      'getGuidesVersion',
      'lockGuide',
      'moveGuide',
      'removeGuide',
      'unlockGuide',
    ]);
  });
});
