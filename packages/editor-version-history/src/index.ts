export {
  appendDocumentRevision,
  createRevisionComparison,
  createVersionHistoryState,
  duplicateDocumentRevision,
  listDocumentRevisions,
  loadVersionHistory,
  previewDocumentRevision,
  restoreDocumentRevision,
} from './versionHistory';
export type {
  DirtyWorkDecision,
  DocumentRevision,
  RestoreRevisionResult,
  RevisionPreview,
  VersionHistoryState,
  VersionHistoryStorage,
} from './versionHistory';
