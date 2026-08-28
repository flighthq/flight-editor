import * as keyboard from './index';

describe('@flighthq/editor-keyboard exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(keyboard).sort()).toEqual([
      'createKeyboardMap',
      'getKeyBinding',
      'getRegisteredActions',
      'matchKeyEvent',
      'registerKeyBinding',
      'unregisterKeyBinding',
    ]);
  });
});
