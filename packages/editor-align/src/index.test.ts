import * as align from './index';

describe('@flighthq/editor-align exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(align).sort()).toEqual([
      'clearKeyObject',
      'createAlignState',
      'getAlignTarget',
      'getAlignVersion',
      'getDistributeMode',
      'getKeyObjectId',
      'getLastAlignAxis',
      'getLastDistributeAxis',
      'setAlignTarget',
      'setDistributeMode',
      'setKeyObjectId',
      'setLastAlignAxis',
      'setLastDistributeAxis',
    ]);
  });
});
