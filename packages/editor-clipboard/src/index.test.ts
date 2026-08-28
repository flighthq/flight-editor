import * as clipboard from './index';

describe('@flighthq/editor-clipboard exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(clipboard).sort()).toEqual([
      'clearClipboard',
      'createClipboardState',
      'getClipboardEntries',
      'getClipboardEntryCount',
      'getClipboardOperation',
      'getClipboardVersion',
      'isClipboardEmpty',
      'setClipboardEntries',
    ]);
  });
});
