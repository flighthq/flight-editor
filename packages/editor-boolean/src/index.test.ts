import * as boolean from './index';

describe('@flighthq/editor-boolean exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(boolean).sort()).toEqual([
      'addBooleanEntry',
      'clearBooleanEntries',
      'createBooleanState',
      'getActiveOperation',
      'getBooleanEntries',
      'getBooleanEntry',
      'getBooleanEntryCount',
      'getBooleanVersion',
      'removeBooleanEntry',
      'setActiveOperation',
    ]);
  });
});
