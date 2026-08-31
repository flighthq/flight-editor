import * as cursor from './index';

describe('@flighthq/editor-cursor exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(cursor).sort()).toEqual([
      'clearCursorOverrides',
      'createCursorState',
      'getActiveCursor',
      'getCursorOverrideCount',
      'getCursorVersion',
      'getToolDefaultCursor',
      'popCursorOverride',
      'pushCursorOverride',
      'setToolDefaultCursor',
    ]);
  });
});
