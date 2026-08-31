import { describe, expect, it } from 'vitest';
import * as api from './index';
describe('@flighthq/editor-version-history exports', () => {
  it('exposes immutable history orchestration', () =>
    expect(Object.keys(api).sort()).toEqual([
      'appendDocumentRevision',
      'createRevisionComparison',
      'createVersionHistoryState',
      'duplicateDocumentRevision',
      'listDocumentRevisions',
      'loadVersionHistory',
      'previewDocumentRevision',
      'restoreDocumentRevision',
    ]));
});
