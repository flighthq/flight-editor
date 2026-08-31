import * as command from './index';

describe('@flighthq/editor-command exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(command).sort()).toEqual([
      'clearCommandHistory',
      'createCommandBatch',
      'createCommandHistory',
      'createSnapshotCommand',
      'executeCoalescingCommand',
      'executeCommand',
      'executeCommandBatch',
      'getCommandHistoryRedoCount',
      'getCommandHistoryRedoLabel',
      'getCommandHistoryUndoCount',
      'getCommandHistoryUndoLabel',
      'isCommandHistoryClean',
      'markCommandHistoryClean',
      'redo',
      'undo',
    ]);
  });
});
