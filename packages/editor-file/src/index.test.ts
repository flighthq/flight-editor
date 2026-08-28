import * as file from './index';

describe('@flighthq/editor-file exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(file).sort()).toEqual([
      'addRecentFile',
      'clearRecentFiles',
      'createFileState',
      'getCurrentFilePath',
      'getFileVersion',
      'getMaxRecentFiles',
      'getRecentFileCount',
      'getRecentFiles',
      'getSaveStatus',
      'isFileDirty',
      'markFileClean',
      'markFileDirty',
      'newFile',
      'openFile',
      'removeRecentFile',
      'setCurrentFilePath',
      'setMaxRecentFiles',
      'setSaveStatus',
    ]);
  });
});
