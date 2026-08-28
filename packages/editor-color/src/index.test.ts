import * as color from './index';

describe('@flighthq/editor-color exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(color).sort()).toEqual([
      'addRecentColor',
      'addSwatch',
      'clearSwatches',
      'createColorState',
      'getActiveColor',
      'getColorVersion',
      'getRecentColors',
      'getSwatches',
      'removeSwatch',
      'setActiveColor',
    ]);
  });
});
