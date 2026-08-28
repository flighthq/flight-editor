import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorRecentFile,
  clearEditorRecentFiles,
  getEditorFilePath,
  getEditorFileVersion,
  getEditorMaxRecentFiles,
  getEditorRecentFileCount,
  getEditorRecentFiles,
  getEditorSaveStatus,
  isEditorFileDirty,
  markEditorFileClean,
  markEditorFileDirty,
  newEditorFile,
  openEditorFile,
  removeEditorRecentFile,
  setEditorFilePath,
  setEditorMaxRecentFiles,
  setEditorSaveStatus,
} from './fileManager';

describe('getEditorFilePath', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorFilePath(editor)).toBeNull();
  });
});

describe('setEditorFilePath', () => {
  it('sets the file path', () => {
    const editor = createEditorState();
    setEditorFilePath(editor, '/tmp/scene.flight');
    expect(getEditorFilePath(editor)).toBe('/tmp/scene.flight');
  });
});

describe('isEditorFileDirty', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isEditorFileDirty(editor)).toBe(false);
  });
});

describe('markEditorFileDirty', () => {
  it('marks the file as dirty', () => {
    const editor = createEditorState();
    markEditorFileDirty(editor);
    expect(isEditorFileDirty(editor)).toBe(true);
  });
});

describe('markEditorFileClean', () => {
  it('marks the file as clean', () => {
    const editor = createEditorState();
    markEditorFileDirty(editor);
    markEditorFileClean(editor);
    expect(isEditorFileDirty(editor)).toBe(false);
  });
});

describe('getEditorSaveStatus', () => {
  it('returns idle initially', () => {
    const editor = createEditorState();
    expect(getEditorSaveStatus(editor)).toBe('idle');
  });
});

describe('setEditorSaveStatus', () => {
  it('sets the save status', () => {
    const editor = createEditorState();
    setEditorSaveStatus(editor, 'saving');
    expect(getEditorSaveStatus(editor)).toBe('saving');
  });
});

describe('openEditorFile', () => {
  it('sets path and adds to recent files', () => {
    const editor = createEditorState();
    openEditorFile(editor, '/tmp/a.flight', 'a.flight', 1000);
    expect(getEditorFilePath(editor)).toBe('/tmp/a.flight');
    expect(getEditorRecentFileCount(editor)).toBe(1);
  });
});

describe('newEditorFile', () => {
  it('resets the file state', () => {
    const editor = createEditorState();
    setEditorFilePath(editor, '/tmp/old.flight');
    newEditorFile(editor);
    expect(getEditorFilePath(editor)).toBeNull();
  });
});

describe('addEditorRecentFile', () => {
  it('adds to recent files', () => {
    const editor = createEditorState();
    addEditorRecentFile(editor, '/tmp/b.flight', 'b.flight', 2000);
    expect(getEditorRecentFileCount(editor)).toBe(1);
  });
});

describe('removeEditorRecentFile', () => {
  it('removes from recent files', () => {
    const editor = createEditorState();
    addEditorRecentFile(editor, '/tmp/c.flight', 'c.flight', 3000);
    removeEditorRecentFile(editor, '/tmp/c.flight');
    expect(getEditorRecentFileCount(editor)).toBe(0);
  });
});

describe('clearEditorRecentFiles', () => {
  it('clears all recent files', () => {
    const editor = createEditorState();
    addEditorRecentFile(editor, '/tmp/a.flight', 'a', 1000);
    addEditorRecentFile(editor, '/tmp/b.flight', 'b', 2000);
    clearEditorRecentFiles(editor);
    expect(getEditorRecentFileCount(editor)).toBe(0);
  });
});

describe('getEditorRecentFiles', () => {
  it('returns the recent files list', () => {
    const editor = createEditorState();
    expect(getEditorRecentFiles(editor)).toHaveLength(0);
  });
});

describe('getEditorRecentFileCount', () => {
  it('returns zero initially', () => {
    const editor = createEditorState();
    expect(getEditorRecentFileCount(editor)).toBe(0);
  });
});

describe('getEditorMaxRecentFiles', () => {
  it('returns a number', () => {
    const editor = createEditorState();
    expect(typeof getEditorMaxRecentFiles(editor)).toBe('number');
  });
});

describe('setEditorMaxRecentFiles', () => {
  it('sets the max recent files', () => {
    const editor = createEditorState();
    setEditorMaxRecentFiles(editor, 5);
    expect(getEditorMaxRecentFiles(editor)).toBe(5);
  });
});

describe('getEditorFileVersion', () => {
  it('returns a number', () => {
    const editor = createEditorState();
    expect(typeof getEditorFileVersion(editor)).toBe('number');
  });
});
