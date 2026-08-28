import { describe, expect, it } from 'vitest';

import {
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

describe('createFileState', () => {
  it('starts with no file, clean, idle', () => {
    const state = createFileState();
    expect(getCurrentFilePath(state)).toBeNull();
    expect(isFileDirty(state)).toBe(false);
    expect(getSaveStatus(state)).toBe('idle');
    expect(getRecentFileCount(state)).toBe(0);
    expect(getFileVersion(state)).toBe(0);
  });

  it('accepts a custom max recent files limit', () => {
    const state = createFileState(5);
    expect(getMaxRecentFiles(state)).toBe(5);
  });

  it('defaults max recent files to 10', () => {
    const state = createFileState();
    expect(getMaxRecentFiles(state)).toBe(10);
  });
});

describe('getCurrentFilePath', () => {
  it('returns null for a new state', () => {
    expect(getCurrentFilePath(createFileState())).toBeNull();
  });

  it('returns the set path', () => {
    const state = createFileState();
    setCurrentFilePath(state, '/project/file.flight');
    expect(getCurrentFilePath(state)).toBe('/project/file.flight');
  });
});

describe('setCurrentFilePath', () => {
  it('sets the path and bumps version', () => {
    const state = createFileState();
    setCurrentFilePath(state, '/a.flight');
    expect(getCurrentFilePath(state)).toBe('/a.flight');
    expect(getFileVersion(state)).toBe(1);
  });

  it('is idempotent for the same path', () => {
    const state = createFileState();
    setCurrentFilePath(state, '/a.flight');
    const v = getFileVersion(state);
    setCurrentFilePath(state, '/a.flight');
    expect(getFileVersion(state)).toBe(v);
  });

  it('clears the path with null', () => {
    const state = createFileState();
    setCurrentFilePath(state, '/a.flight');
    setCurrentFilePath(state, null);
    expect(getCurrentFilePath(state)).toBeNull();
  });
});

describe('isFileDirty', () => {
  it('returns false initially', () => {
    expect(isFileDirty(createFileState())).toBe(false);
  });
});

describe('markFileDirty', () => {
  it('marks the file dirty and bumps version', () => {
    const state = createFileState();
    markFileDirty(state);
    expect(isFileDirty(state)).toBe(true);
    expect(getFileVersion(state)).toBe(1);
  });

  it('is idempotent when already dirty', () => {
    const state = createFileState();
    markFileDirty(state);
    const v = getFileVersion(state);
    markFileDirty(state);
    expect(getFileVersion(state)).toBe(v);
  });
});

describe('markFileClean', () => {
  it('clears dirty flag and bumps version', () => {
    const state = createFileState();
    markFileDirty(state);
    const v = getFileVersion(state);
    markFileClean(state);
    expect(isFileDirty(state)).toBe(false);
    expect(getFileVersion(state)).toBe(v + 1);
  });

  it('is idempotent when already clean', () => {
    const state = createFileState();
    const v = getFileVersion(state);
    markFileClean(state);
    expect(getFileVersion(state)).toBe(v);
  });
});

describe('getSaveStatus', () => {
  it('returns idle initially', () => {
    expect(getSaveStatus(createFileState())).toBe('idle');
  });
});

describe('setSaveStatus', () => {
  it('transitions through save states', () => {
    const state = createFileState();
    setSaveStatus(state, 'saving');
    expect(getSaveStatus(state)).toBe('saving');
    setSaveStatus(state, 'saved');
    expect(getSaveStatus(state)).toBe('saved');
    setSaveStatus(state, 'idle');
    expect(getSaveStatus(state)).toBe('idle');
  });

  it('sets error status', () => {
    const state = createFileState();
    setSaveStatus(state, 'error');
    expect(getSaveStatus(state)).toBe('error');
  });

  it('is idempotent for the same status', () => {
    const state = createFileState();
    setSaveStatus(state, 'saving');
    const v = getFileVersion(state);
    setSaveStatus(state, 'saving');
    expect(getFileVersion(state)).toBe(v);
  });

  it('bumps version on each change', () => {
    const state = createFileState();
    setSaveStatus(state, 'saving');
    expect(getFileVersion(state)).toBe(1);
    setSaveStatus(state, 'saved');
    expect(getFileVersion(state)).toBe(2);
  });
});

describe('getRecentFiles', () => {
  it('returns empty array initially', () => {
    expect(getRecentFiles(createFileState())).toEqual([]);
  });

  it('returns files in most-recent-first order', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    const files = getRecentFiles(state);
    expect(files[0]?.path).toBe('/b.flight');
    expect(files[1]?.path).toBe('/a.flight');
  });
});

describe('getRecentFileCount', () => {
  it('counts recent files', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    expect(getRecentFileCount(state)).toBe(2);
  });
});

describe('addRecentFile', () => {
  it('adds a file to the front of the list', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    expect(getRecentFiles(state)).toEqual([{ path: '/a.flight', name: 'a', timestamp: 100 }]);
  });

  it('moves a duplicate path to the front', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    addRecentFile(state, '/a.flight', 'a', 300);
    expect(getRecentFileCount(state)).toBe(2);
    expect(getRecentFiles(state)[0]?.path).toBe('/a.flight');
    expect(getRecentFiles(state)[0]?.timestamp).toBe(300);
  });

  it('enforces max recent files limit', () => {
    const state = createFileState(3);
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    addRecentFile(state, '/c.flight', 'c', 300);
    addRecentFile(state, '/d.flight', 'd', 400);
    expect(getRecentFileCount(state)).toBe(3);
    expect(getRecentFiles(state)[0]?.path).toBe('/d.flight');
    expect(getRecentFiles(state).every((f) => f.path !== '/a.flight')).toBe(true);
  });

  it('bumps version on each add', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    expect(getFileVersion(state)).toBe(1);
    addRecentFile(state, '/b.flight', 'b', 200);
    expect(getFileVersion(state)).toBe(2);
  });
});

describe('removeRecentFile', () => {
  it('removes a file by path', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    expect(removeRecentFile(state, '/a.flight')).toBe(true);
    expect(getRecentFileCount(state)).toBe(1);
    expect(getRecentFiles(state)[0]?.path).toBe('/b.flight');
  });

  it('returns false for a non-existent path', () => {
    const state = createFileState();
    expect(removeRecentFile(state, '/missing.flight')).toBe(false);
  });

  it('does not bump version when not found', () => {
    const state = createFileState();
    const v = getFileVersion(state);
    removeRecentFile(state, '/missing.flight');
    expect(getFileVersion(state)).toBe(v);
  });
});

describe('clearRecentFiles', () => {
  it('removes all recent files', () => {
    const state = createFileState();
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    clearRecentFiles(state);
    expect(getRecentFileCount(state)).toBe(0);
  });

  it('is idempotent when already empty', () => {
    const state = createFileState();
    const v = getFileVersion(state);
    clearRecentFiles(state);
    expect(getFileVersion(state)).toBe(v);
  });
});

describe('getMaxRecentFiles', () => {
  it('returns the configured limit', () => {
    expect(getMaxRecentFiles(createFileState(7))).toBe(7);
  });
});

describe('setMaxRecentFiles', () => {
  it('changes the limit and truncates if needed', () => {
    const state = createFileState(5);
    addRecentFile(state, '/a.flight', 'a', 100);
    addRecentFile(state, '/b.flight', 'b', 200);
    addRecentFile(state, '/c.flight', 'c', 300);
    setMaxRecentFiles(state, 2);
    expect(getMaxRecentFiles(state)).toBe(2);
    expect(getRecentFileCount(state)).toBe(2);
    expect(getRecentFiles(state)[0]?.path).toBe('/c.flight');
  });

  it('is idempotent for the same limit', () => {
    const state = createFileState(5);
    const v = getFileVersion(state);
    setMaxRecentFiles(state, 5);
    expect(getFileVersion(state)).toBe(v);
  });
});

describe('getFileVersion', () => {
  it('starts at 0', () => {
    expect(getFileVersion(createFileState())).toBe(0);
  });

  it('tracks cumulative changes', () => {
    const state = createFileState();
    setCurrentFilePath(state, '/a.flight');
    markFileDirty(state);
    setSaveStatus(state, 'saving');
    expect(getFileVersion(state)).toBe(3);
  });
});

describe('openFile', () => {
  it('sets path, clears dirty, resets save status, and adds to recent', () => {
    const state = createFileState();
    markFileDirty(state);
    setSaveStatus(state, 'error');
    openFile(state, '/project/design.flight', 'design', 1000);
    expect(getCurrentFilePath(state)).toBe('/project/design.flight');
    expect(isFileDirty(state)).toBe(false);
    expect(getSaveStatus(state)).toBe('idle');
    expect(getRecentFileCount(state)).toBe(1);
    expect(getRecentFiles(state)[0]?.name).toBe('design');
  });

  it('opens successive files and maintains recent order', () => {
    const state = createFileState();
    openFile(state, '/a.flight', 'a', 100);
    openFile(state, '/b.flight', 'b', 200);
    expect(getCurrentFilePath(state)).toBe('/b.flight');
    expect(getRecentFiles(state)[0]?.path).toBe('/b.flight');
    expect(getRecentFiles(state)[1]?.path).toBe('/a.flight');
  });
});

describe('newFile', () => {
  it('clears path, dirty, and save status', () => {
    const state = createFileState();
    openFile(state, '/a.flight', 'a', 100);
    markFileDirty(state);
    setSaveStatus(state, 'saved');
    newFile(state);
    expect(getCurrentFilePath(state)).toBeNull();
    expect(isFileDirty(state)).toBe(false);
    expect(getSaveStatus(state)).toBe('idle');
  });

  it('preserves recent files list', () => {
    const state = createFileState();
    openFile(state, '/a.flight', 'a', 100);
    newFile(state);
    expect(getRecentFileCount(state)).toBe(1);
  });

  it('bumps version', () => {
    const state = createFileState();
    const v = getFileVersion(state);
    newFile(state);
    expect(getFileVersion(state)).toBe(v + 1);
  });
});
