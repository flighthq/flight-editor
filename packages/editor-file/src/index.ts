export {
  addRecentFile,
  clearRecentFiles,
  createFileState,
  getCurrentFilePath,
  getFileVersion,
  getMaxRecentFiles,
  getRecentFileCount,
  getRecentFiles,
  getSaveStatus,
  isFileDirty,
  markFileClean,
  markFileDirty,
  newFile,
  openFile,
  removeRecentFile,
  setCurrentFilePath,
  setMaxRecentFiles,
  setSaveStatus,
} from './fileState';

export type { FileState, RecentFile, SaveStatus } from './fileState';
