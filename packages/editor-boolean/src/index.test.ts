import * as boolean from './index';

describe('@flighthq/editor-boolean exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(boolean).sort()).toEqual([
      'addBooleanEntry',
      'clearBooleanEntries',
      'createBooleanCommand',
      'createBooleanState',
      'getActiveOperation',
      'getBooleanEntries',
      'getBooleanEntry',
      'getBooleanEntryCount',
      'getBooleanSessionVersion',
      'getBooleanVersion',
      'removeBooleanEntry',
      'replaceBooleanEntry',
      'setActiveOperation',
      'validateBooleanState',
    ]);
  });
});
