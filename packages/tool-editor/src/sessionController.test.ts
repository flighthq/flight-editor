import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { createNewScene } from './sceneManager';
import { markEditorDirty } from './dirtyTracker';
import {
  canSaveDocument,
  canSaveDocumentAs,
  closeDocument,
  hasDocumentPath,
  hasOpenDocument,
  isDocumentModified,
  newDocument,
  openDocument,
  saveDocument,
  saveDocumentAs,
} from './sessionController';

import type { ConfirmResult, SessionCallbacks } from './sessionController';

function makeCallbacks(confirmResult: ConfirmResult = 'discard'): SessionCallbacks {
  return {
    confirmDiscard: () => Promise.resolve(confirmResult),
    serialize: () => new ArrayBuffer(0),
    deserialize: () => {},
  };
}

function setupEditor() {
  const editor = createEditorState();
  createNewScene(editor);
  return editor;
}

describe('newDocument', () => {
  it('creates a new scene', async () => {
    const editor = setupEditor();
    const result = await newDocument(editor, makeCallbacks());
    expect(result).toBe(true);
    expect(hasOpenDocument(editor)).toBe(true);
  });

  it('prompts to save when dirty', async () => {
    const editor = setupEditor();
    markEditorDirty(editor);
    const result = await newDocument(editor, makeCallbacks('cancel'));
    expect(result).toBe(false);
  });

  it('discards changes when user chooses discard', async () => {
    const editor = setupEditor();
    markEditorDirty(editor);
    const result = await newDocument(editor, makeCallbacks('discard'));
    expect(result).toBe(true);
  });
});

describe('openDocument', () => {
  it('returns not-opened when user cancels discard', async () => {
    const editor = setupEditor();
    markEditorDirty(editor);
    const result = await openDocument(editor, makeCallbacks('cancel'));
    expect(result.opened).toBe(false);
  });

  it('proceeds when document is clean', async () => {
    const editor = setupEditor();
    const result = await openDocument(editor, makeCallbacks());
    expect(result.opened).toBe(false);
  });
});

describe('saveDocument', () => {
  it('returns not saved when no filesystem', async () => {
    const editor = setupEditor();
    const result = await saveDocument(editor, () => new ArrayBuffer(0));
    expect(result.saved).toBe(false);
  });
});

describe('saveDocumentAs', () => {
  it('returns not saved when no dialogs', async () => {
    const editor = setupEditor();
    const result = await saveDocumentAs(editor, () => new ArrayBuffer(0));
    expect(result.saved).toBe(false);
  });
});

describe('closeDocument', () => {
  it('clears the scene', () => {
    const editor = setupEditor();
    closeDocument(editor);
    expect(hasOpenDocument(editor)).toBe(false);
  });
});

describe('canSaveDocument', () => {
  it('returns false for headless editor', () => {
    const editor = setupEditor();
    expect(canSaveDocument(editor)).toBe(false);
  });
});

describe('canSaveDocumentAs', () => {
  it('returns false for headless editor', () => {
    const editor = setupEditor();
    expect(canSaveDocumentAs(editor)).toBe(false);
  });
});

describe('hasOpenDocument', () => {
  it('returns true when scene exists', () => {
    const editor = setupEditor();
    expect(hasOpenDocument(editor)).toBe(true);
  });

  it('returns false when no scene', () => {
    const editor = createEditorState();
    expect(hasOpenDocument(editor)).toBe(false);
  });
});

describe('isDocumentModified', () => {
  it('returns false for clean editor', () => {
    const editor = setupEditor();
    expect(isDocumentModified(editor)).toBe(false);
  });

  it('returns true after marking dirty', () => {
    const editor = setupEditor();
    markEditorDirty(editor);
    expect(isDocumentModified(editor)).toBe(true);
  });
});

describe('hasDocumentPath', () => {
  it('returns false for new document', () => {
    const editor = setupEditor();
    expect(hasDocumentPath(editor)).toBe(false);
  });
});
