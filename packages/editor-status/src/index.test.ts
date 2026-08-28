import * as status from './index';

describe('@flighthq/editor-status exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(status).sort()).toEqual([
      'clearCursorPosition',
      'clearStatusMessage',
      'createStatusBarState',
      'getActiveToolName',
      'getCursorPosition',
      'getSelectionCount',
      'getSelectionLabel',
      'getStatusBarVersion',
      'getStatusMessage',
      'getZoomPercent',
      'setActiveToolName',
      'setCursorPosition',
      'setSelectionInfo',
      'setStatusMessage',
      'setZoomPercent',
    ]);
  });
});
