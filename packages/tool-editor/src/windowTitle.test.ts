import { setDocumentTitle } from '@flighthq/editor-document';
import { markFileDirty, setCurrentFilePath } from '@flighthq/editor-file';
import { setHostAdapter } from '@flighthq/editor-host';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import { formatWindowTitle, updateWindowTitle } from './windowTitle';

describe('formatWindowTitle', () => {
  it('formats default title', () => {
    const editor = createEditorState();
    expect(formatWindowTitle(editor)).toBe('Untitled — Flight Editor');
  });

  it('uses document title', () => {
    const editor = createEditorState();
    setDocumentTitle(editor.document, 'My Scene');
    expect(formatWindowTitle(editor)).toBe('My Scene — Flight Editor');
  });

  it('adds dirty marker when file is dirty', () => {
    const editor = createEditorState();
    markFileDirty(editor.file);
    expect(formatWindowTitle(editor)).toBe('*Untitled — Flight Editor');
  });

  it('uses file name from path when available', () => {
    const editor = createEditorState();
    setCurrentFilePath(editor.file, '/home/user/docs/design.flight');
    expect(formatWindowTitle(editor)).toBe('design.flight — Flight Editor');
  });

  it('handles Windows-style paths', () => {
    const editor = createEditorState();
    setCurrentFilePath(editor.file, 'C:\\Users\\user\\docs\\design.flight');
    expect(formatWindowTitle(editor)).toBe('design.flight — Flight Editor');
  });

  it('uses custom app name', () => {
    const editor = createEditorState();
    expect(formatWindowTitle(editor, { appName: 'My App' })).toBe('Untitled — My App');
  });

  it('uses custom separator', () => {
    const editor = createEditorState();
    expect(formatWindowTitle(editor, { separator: ' - ' })).toBe('Untitled - Flight Editor');
  });

  it('uses custom dirty marker', () => {
    const editor = createEditorState();
    markFileDirty(editor.file);
    expect(formatWindowTitle(editor, { dirtyMarker: '● ' })).toBe('● Untitled — Flight Editor');
  });

  it('combines dirty marker with file path', () => {
    const editor = createEditorState();
    setCurrentFilePath(editor.file, '/tmp/test.flight');
    markFileDirty(editor.file);
    expect(formatWindowTitle(editor)).toBe('*test.flight — Flight Editor');
  });
});

describe('updateWindowTitle', () => {
  it('calls setWindowTitle on the host adapter', () => {
    const editor = createEditorState();
    const setWindowTitle = vi.fn();
    setHostAdapter(editor.host, {
      capabilities: {
        hasFileSystem: false,
        hasClipboard: false,
        hasNativeMenus: false,
        hasNativeDialogs: false,
        hasDragDrop: false,
      },
      showOpenDialog: () => Promise.resolve(null),
      showSaveDialog: () => Promise.resolve(null),
      readFile: () => Promise.reject(new Error('not available')),
      writeFile: () => Promise.reject(new Error('not available')),
      readClipboardText: () => Promise.resolve(''),
      writeClipboardText: () => Promise.resolve(),
      setWindowTitle,
      showMessage: () => {},
    });

    updateWindowTitle(editor);
    expect(setWindowTitle).toHaveBeenCalledWith('Untitled — Flight Editor');
  });

  it('passes custom options through', () => {
    const editor = createEditorState();
    const setWindowTitle = vi.fn();
    setHostAdapter(editor.host, {
      capabilities: {
        hasFileSystem: false,
        hasClipboard: false,
        hasNativeMenus: false,
        hasNativeDialogs: false,
        hasDragDrop: false,
      },
      showOpenDialog: () => Promise.resolve(null),
      showSaveDialog: () => Promise.resolve(null),
      readFile: () => Promise.reject(new Error('not available')),
      writeFile: () => Promise.reject(new Error('not available')),
      readClipboardText: () => Promise.resolve(''),
      writeClipboardText: () => Promise.resolve(),
      setWindowTitle,
      showMessage: () => {},
    });

    updateWindowTitle(editor, { appName: 'Test' });
    expect(setWindowTitle).toHaveBeenCalledWith('Untitled — Test');
  });
});
