import * as doc from './index';

describe('@flighthq/editor-document exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(doc).sort()).toEqual([
      'createDocumentState',
      'getDocumentAuthor',
      'getDocumentError',
      'getDocumentFormat',
      'getDocumentLifecycle',
      'getDocumentMetadata',
      'getDocumentTitle',
      'getDocumentVersion',
      'getUndoCheckpoint',
      'hasDocumentError',
      'isDocumentLoading',
      'isDocumentReady',
      'isDocumentSaving',
      'resetDocument',
      'setDocumentAuthor',
      'setDocumentError',
      'setDocumentFormat',
      'setDocumentLifecycle',
      'setDocumentTimestamps',
      'setDocumentTitle',
      'setUndoCheckpoint',
      'touchDocumentModified',
    ]);
  });
});
