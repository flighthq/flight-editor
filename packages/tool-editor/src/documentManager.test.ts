import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  getEditorDocumentAuthor,
  getEditorDocumentError,
  getEditorDocumentFormat,
  getEditorDocumentLifecycle,
  getEditorDocumentMetadata,
  getEditorDocumentTitle,
  getEditorDocumentVersion,
  getEditorUndoCheckpoint,
  hasEditorDocumentError,
  isEditorDocumentLoading,
  isEditorDocumentReady,
  isEditorDocumentSaving,
  resetEditorDocument,
  setEditorDocumentAuthor,
  setEditorDocumentError,
  setEditorDocumentFormat,
  setEditorDocumentLifecycle,
  setEditorDocumentTimestamps,
  setEditorDocumentTitle,
  setEditorUndoCheckpoint,
  touchEditorDocumentModified,
} from './documentManager';

describe('getEditorDocumentTitle', () => {
  it('returns the default title', () => {
    const editor = createEditorState();
    expect(getEditorDocumentTitle(editor)).toBe('Untitled');
  });
});

describe('setEditorDocumentTitle', () => {
  it('sets the document title', () => {
    const editor = createEditorState();
    setEditorDocumentTitle(editor, 'My Scene');
    expect(getEditorDocumentTitle(editor)).toBe('My Scene');
  });
});

describe('getEditorDocumentAuthor', () => {
  it('returns empty string initially', () => {
    const editor = createEditorState();
    expect(getEditorDocumentAuthor(editor)).toBe('');
  });
});

describe('setEditorDocumentAuthor', () => {
  it('sets the author', () => {
    const editor = createEditorState();
    setEditorDocumentAuthor(editor, 'Test Author');
    expect(getEditorDocumentAuthor(editor)).toBe('Test Author');
  });
});

describe('getEditorDocumentFormat', () => {
  it('returns the default format', () => {
    const editor = createEditorState();
    expect(getEditorDocumentFormat(editor)).toBe('flight');
  });
});

describe('setEditorDocumentFormat', () => {
  it('sets the document format', () => {
    const editor = createEditorState();
    setEditorDocumentFormat(editor, 'json');
    expect(getEditorDocumentFormat(editor)).toBe('json');
  });
});

describe('getEditorDocumentLifecycle', () => {
  it('returns empty by default', () => {
    const editor = createEditorState();
    expect(getEditorDocumentLifecycle(editor)).toBe('empty');
  });
});

describe('setEditorDocumentLifecycle', () => {
  it('sets the lifecycle state', () => {
    const editor = createEditorState();
    setEditorDocumentLifecycle(editor, 'loading');
    expect(getEditorDocumentLifecycle(editor)).toBe('loading');
  });
});

describe('isEditorDocumentLoading', () => {
  it('returns false by default', () => {
    const editor = createEditorState();
    expect(isEditorDocumentLoading(editor)).toBe(false);
  });

  it('returns true when loading', () => {
    const editor = createEditorState();
    setEditorDocumentLifecycle(editor, 'loading');
    expect(isEditorDocumentLoading(editor)).toBe(true);
  });
});

describe('isEditorDocumentReady', () => {
  it('returns false by default', () => {
    const editor = createEditorState();
    expect(isEditorDocumentReady(editor)).toBe(false);
  });
});

describe('isEditorDocumentSaving', () => {
  it('returns false by default', () => {
    const editor = createEditorState();
    expect(isEditorDocumentSaving(editor)).toBe(false);
  });
});

describe('hasEditorDocumentError', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(hasEditorDocumentError(editor)).toBe(false);
  });
});

describe('getEditorDocumentError', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorDocumentError(editor)).toBeNull();
  });
});

describe('setEditorDocumentError', () => {
  it('sets the error and lifecycle', () => {
    const editor = createEditorState();
    setEditorDocumentError(editor, 'load failed');
    expect(getEditorDocumentError(editor)).toBe('load failed');
    expect(hasEditorDocumentError(editor)).toBe(true);
    expect(getEditorDocumentLifecycle(editor)).toBe('error');
  });
});

describe('getEditorDocumentMetadata', () => {
  it('returns metadata object', () => {
    const editor = createEditorState();
    const metadata = getEditorDocumentMetadata(editor);
    expect(metadata.title).toBe('Untitled');
    expect(metadata.format).toBe('flight');
  });
});

describe('getEditorDocumentVersion', () => {
  it('starts at zero', () => {
    const editor = createEditorState();
    expect(getEditorDocumentVersion(editor)).toBe(0);
  });
});

describe('resetEditorDocument', () => {
  it('resets to initial state', () => {
    const editor = createEditorState();
    setEditorDocumentTitle(editor, 'Changed');
    resetEditorDocument(editor);
    expect(getEditorDocumentTitle(editor)).toBe('Untitled');
  });
});

describe('setEditorDocumentTimestamps', () => {
  it('sets created and modified timestamps', () => {
    const editor = createEditorState();
    setEditorDocumentTimestamps(editor, 1000, 2000);
    const metadata = getEditorDocumentMetadata(editor);
    expect(metadata.created).toBe(1000);
    expect(metadata.modified).toBe(2000);
  });
});

describe('touchEditorDocumentModified', () => {
  it('updates the modified timestamp', () => {
    const editor = createEditorState();
    setEditorDocumentTimestamps(editor, 1000, 1000);
    touchEditorDocumentModified(editor, 3000);
    const metadata = getEditorDocumentMetadata(editor);
    expect(metadata.modified).toBe(3000);
  });
});

describe('getEditorUndoCheckpoint', () => {
  it('returns zero initially', () => {
    const editor = createEditorState();
    expect(getEditorUndoCheckpoint(editor)).toBe(0);
  });
});

describe('setEditorUndoCheckpoint', () => {
  it('sets the undo checkpoint', () => {
    const editor = createEditorState();
    setEditorUndoCheckpoint(editor, 42);
    expect(getEditorUndoCheckpoint(editor)).toBe(42);
  });
});
