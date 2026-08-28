import { getDocumentLifecycle, getDocumentTitle } from '@flighthq/editor-document';
import {
  getCurrentFilePath,
  getRecentFiles,
  isFileDirty,
  markFileDirty,
  setCurrentFilePath,
} from '@flighthq/editor-file';
import { setHostAdapter } from '@flighthq/editor-host';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import { canSave, canSaveAs, hasFilePath, needsSave, openFile, saveFile, saveFileAs } from './fileOperations';

import type { HostAdapter } from '@flighthq/editor-host';

function createDesktopAdapter(overrides: Partial<HostAdapter> = {}): HostAdapter {
  return {
    capabilities: {
      hasFileSystem: true,
      hasClipboard: true,
      hasNativeMenus: true,
      hasNativeDialogs: true,
      hasDragDrop: true,
    },
    showOpenDialog: () => Promise.resolve(null),
    showSaveDialog: () => Promise.resolve(null),
    readFile: () => Promise.resolve(new ArrayBuffer(0)),
    writeFile: () => Promise.resolve(),
    readClipboardText: () => Promise.resolve(''),
    writeClipboardText: () => Promise.resolve(),
    setWindowTitle: () => {},
    showMessage: () => {},
    ...overrides,
  };
}

describe('saveFile', () => {
  it('saves to existing path', async () => {
    const editor = createEditorState();
    const writeFile = vi.fn().mockResolvedValue(undefined);
    setHostAdapter(editor.host, createDesktopAdapter({ writeFile }));
    setCurrentFilePath(editor.file, '/tmp/test.flight');
    markFileDirty(editor.file);

    const serialize = vi.fn(() => new ArrayBuffer(10));
    const result = await saveFile(editor, serialize);

    expect(result.saved).toBe(true);
    expect(result.path).toBe('/tmp/test.flight');
    expect(writeFile).toHaveBeenCalledWith('/tmp/test.flight', expect.any(ArrayBuffer));
    expect(isFileDirty(editor.file)).toBe(false);
  });

  it('falls back to saveAs when no path exists', async () => {
    const editor = createEditorState();
    const showSaveDialog = vi.fn().mockResolvedValue({ path: '/tmp/new.flight', name: 'new.flight' });
    const writeFile = vi.fn().mockResolvedValue(undefined);
    setHostAdapter(editor.host, createDesktopAdapter({ showSaveDialog, writeFile }));

    const result = await saveFile(editor, () => new ArrayBuffer(0));
    expect(result.saved).toBe(true);
    expect(showSaveDialog).toHaveBeenCalled();
  });
});

describe('saveFileAs', () => {
  it('shows save dialog and writes file', async () => {
    const editor = createEditorState();
    const showSaveDialog = vi.fn().mockResolvedValue({ path: '/tmp/design.flight', name: 'design.flight' });
    const writeFile = vi.fn().mockResolvedValue(undefined);
    setHostAdapter(editor.host, createDesktopAdapter({ showSaveDialog, writeFile }));

    const result = await saveFileAs(editor, () => new ArrayBuffer(5));
    expect(result.saved).toBe(true);
    expect(result.path).toBe('/tmp/design.flight');
    expect(getCurrentFilePath(editor.file)).toBe('/tmp/design.flight');
    expect(getDocumentTitle(editor.document)).toBe('design.flight');
  });

  it('returns false when dialog is cancelled', async () => {
    const editor = createEditorState();
    setHostAdapter(editor.host, createDesktopAdapter({ showSaveDialog: () => Promise.resolve(null) }));

    const result = await saveFileAs(editor, () => new ArrayBuffer(0));
    expect(result.saved).toBe(false);
  });

  it('returns false in headless mode', async () => {
    const editor = createEditorState();
    const result = await saveFileAs(editor, () => new ArrayBuffer(0));
    expect(result.saved).toBe(false);
  });

  it('adds to recent files', async () => {
    const editor = createEditorState();
    const showSaveDialog = vi.fn().mockResolvedValue({ path: '/tmp/art.flight', name: 'art.flight' });
    setHostAdapter(editor.host, createDesktopAdapter({ showSaveDialog, writeFile: () => Promise.resolve() }));

    await saveFileAs(editor, () => new ArrayBuffer(0));
    const recent = getRecentFiles(editor.file);
    expect(recent.length).toBe(1);
    expect(recent[0]!.path).toBe('/tmp/art.flight');
  });

  it('sets lifecycle to error on write failure', async () => {
    const editor = createEditorState();
    const showSaveDialog = vi.fn().mockResolvedValue({ path: '/bad/path.flight', name: 'path.flight' });
    const writeFile = vi.fn().mockRejectedValue(new Error('disk full'));
    setHostAdapter(editor.host, createDesktopAdapter({ showSaveDialog, writeFile }));

    const result = await saveFileAs(editor, () => new ArrayBuffer(0));
    expect(result.saved).toBe(false);
    expect(getDocumentLifecycle(editor.document)).toBe('error');
  });
});

describe('openFile', () => {
  it('reads file and updates state', async () => {
    const editor = createEditorState();
    const showOpenDialog = vi.fn().mockResolvedValue({ path: '/tmp/scene.flight', name: 'scene.flight' });
    const readFile = vi.fn().mockResolvedValue(new ArrayBuffer(20));
    setHostAdapter(editor.host, createDesktopAdapter({ showOpenDialog, readFile }));

    const deserialize = vi.fn();
    const result = await openFile(editor, deserialize);

    expect(result.opened).toBe(true);
    expect(result.path).toBe('/tmp/scene.flight');
    expect(deserialize).toHaveBeenCalledWith(expect.any(ArrayBuffer));
    expect(getCurrentFilePath(editor.file)).toBe('/tmp/scene.flight');
    expect(getDocumentTitle(editor.document)).toBe('scene.flight');
    expect(getDocumentLifecycle(editor.document)).toBe('ready');
  });

  it('returns false when dialog is cancelled', async () => {
    const editor = createEditorState();
    setHostAdapter(editor.host, createDesktopAdapter());

    const result = await openFile(editor, () => {});
    expect(result.opened).toBe(false);
  });

  it('returns false in headless mode', async () => {
    const editor = createEditorState();
    const result = await openFile(editor, () => {});
    expect(result.opened).toBe(false);
  });

  it('sets lifecycle to error on read failure', async () => {
    const editor = createEditorState();
    const showOpenDialog = vi.fn().mockResolvedValue({ path: '/bad/file.flight', name: 'file.flight' });
    const readFile = vi.fn().mockRejectedValue(new Error('not found'));
    setHostAdapter(editor.host, createDesktopAdapter({ showOpenDialog, readFile }));

    const result = await openFile(editor, () => {});
    expect(result.opened).toBe(false);
    expect(getDocumentLifecycle(editor.document)).toBe('error');
  });

  it('adds to recent files on success', async () => {
    const editor = createEditorState();
    const showOpenDialog = vi.fn().mockResolvedValue({ path: '/tmp/art.flight', name: 'art.flight' });
    setHostAdapter(
      editor.host,
      createDesktopAdapter({ showOpenDialog, readFile: () => Promise.resolve(new ArrayBuffer(0)) }),
    );

    await openFile(editor, () => {});
    const recent = getRecentFiles(editor.file);
    expect(recent.length).toBe(1);
  });
});

describe('canSave', () => {
  it('returns false in headless mode', () => {
    const editor = createEditorState();
    expect(canSave(editor)).toBe(false);
  });

  it('returns true with file system', () => {
    const editor = createEditorState();
    setHostAdapter(editor.host, createDesktopAdapter());
    expect(canSave(editor)).toBe(true);
  });
});

describe('canSaveAs', () => {
  it('returns false in headless mode', () => {
    const editor = createEditorState();
    expect(canSaveAs(editor)).toBe(false);
  });

  it('returns true with dialogs and file system', () => {
    const editor = createEditorState();
    setHostAdapter(editor.host, createDesktopAdapter());
    expect(canSaveAs(editor)).toBe(true);
  });
});

describe('needsSave', () => {
  it('returns false for clean editor', () => {
    const editor = createEditorState();
    expect(needsSave(editor)).toBe(false);
  });

  it('returns true when dirty', () => {
    const editor = createEditorState();
    markFileDirty(editor.file);
    expect(needsSave(editor)).toBe(true);
  });
});

describe('hasFilePath', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(hasFilePath(editor)).toBe(false);
  });

  it('returns true after setting path', () => {
    const editor = createEditorState();
    setCurrentFilePath(editor.file, '/tmp/test.flight');
    expect(hasFilePath(editor)).toBe(true);
  });
});
