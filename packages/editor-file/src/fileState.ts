export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface RecentFile {
  readonly path: string;
  readonly name: string;
  readonly timestamp: number;
}

export interface FileState {
  currentPath: string | null;
  dirty: boolean;
  saveStatus: SaveStatus;
  recentFiles: RecentFile[];
  maxRecentFiles: number;
  version: number;
}

export function createFileState(maxRecentFiles = 10): FileState {
  return {
    currentPath: null,
    dirty: false,
    saveStatus: 'idle',
    recentFiles: [],
    maxRecentFiles,
    version: 0,
  };
}

export function getCurrentFilePath(state: Readonly<FileState>): string | null {
  return state.currentPath;
}

export function setCurrentFilePath(state: FileState, path: string | null): void {
  if (state.currentPath === path) return;
  state.currentPath = path;
  state.version++;
}

export function isFileDirty(state: Readonly<FileState>): boolean {
  return state.dirty;
}

export function markFileDirty(state: FileState): void {
  if (state.dirty) return;
  state.dirty = true;
  state.version++;
}

export function markFileClean(state: FileState): void {
  if (!state.dirty) return;
  state.dirty = false;
  state.version++;
}

export function getSaveStatus(state: Readonly<FileState>): SaveStatus {
  return state.saveStatus;
}

export function setSaveStatus(state: FileState, status: SaveStatus): void {
  if (state.saveStatus === status) return;
  state.saveStatus = status;
  state.version++;
}

export function getRecentFiles(state: Readonly<FileState>): readonly RecentFile[] {
  return state.recentFiles;
}

export function getRecentFileCount(state: Readonly<FileState>): number {
  return state.recentFiles.length;
}

export function addRecentFile(state: FileState, path: string, name: string, timestamp: number): void {
  const existing = state.recentFiles.findIndex((f) => f.path === path);
  if (existing !== -1) {
    state.recentFiles.splice(existing, 1);
  }
  state.recentFiles.unshift({ path, name, timestamp });
  if (state.recentFiles.length > state.maxRecentFiles) {
    state.recentFiles.length = state.maxRecentFiles;
  }
  state.version++;
}

export function removeRecentFile(state: FileState, path: string): boolean {
  const index = state.recentFiles.findIndex((f) => f.path === path);
  if (index === -1) return false;
  state.recentFiles.splice(index, 1);
  state.version++;
  return true;
}

export function clearRecentFiles(state: FileState): void {
  if (state.recentFiles.length === 0) return;
  state.recentFiles = [];
  state.version++;
}

export function getMaxRecentFiles(state: Readonly<FileState>): number {
  return state.maxRecentFiles;
}

export function setMaxRecentFiles(state: FileState, max: number): void {
  if (state.maxRecentFiles === max) return;
  state.maxRecentFiles = max;
  if (state.recentFiles.length > max) {
    state.recentFiles.length = max;
  }
  state.version++;
}

export function getFileVersion(state: Readonly<FileState>): number {
  return state.version;
}

export function openFile(state: FileState, path: string, name: string, timestamp: number): void {
  setCurrentFilePath(state, path);
  state.dirty = false;
  state.saveStatus = 'idle';
  addRecentFile(state, path, name, timestamp);
}

export function newFile(state: FileState): void {
  state.currentPath = null;
  state.dirty = false;
  state.saveStatus = 'idle';
  state.version++;
}
