import * as history from './index';

describe('@flighthq/editor-history-state exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(history).sort()).toEqual([
      'addCheckpoint',
      'clearCheckpoints',
      'createHistoryState',
      'getCheckpoint',
      'getCheckpointCount',
      'getCheckpoints',
      'getHistoryVersion',
      'removeCheckpoint',
    ]);
  });
});
