import type { EditorState } from './editorState';
import type { SaveResult } from './fileOperations';

import { markCommandHistoryClean } from '@flighthq/editor-command';

import { canSave, canSaveAs, hasFilePath, needsSave, saveFile, saveFileAs } from './fileOperations';
import { closeScene, createNewScene } from './sceneManager';
import { fitToScene } from './viewportOps';

export type ConfirmResult = 'save' | 'discard' | 'cancel';

export interface SessionCallbacks {
  confirmDiscard(): Promise<ConfirmResult>;
  serialize(): ArrayBuffer;
  deserialize(data: ArrayBuffer): void;
}

export async function newDocument(
  editor: EditorState,
  callbacks: Readonly<SessionCallbacks>,
  width = 800,
  height = 600,
  name = 'Untitled',
): Promise<boolean> {
  if (needsSave(editor)) {
    const answer = await callbacks.confirmDiscard();
    if (answer === 'cancel') return false;
    if (answer === 'save') {
      const result = await saveFile(editor, callbacks.serialize);
      if (!result.saved) return false;
    }
  }
  createNewScene(editor, width, height, name);
  markCleanIndex(editor);
  fitToScene(editor);
  return true;
}

export async function openDocument(
  editor: EditorState,
  callbacks: Readonly<SessionCallbacks>,
): Promise<{ opened: boolean; path: string | null }> {
  if (needsSave(editor)) {
    const answer = await callbacks.confirmDiscard();
    if (answer === 'cancel') return { opened: false, path: null };
    if (answer === 'save') {
      const result = await saveFile(editor, callbacks.serialize);
      if (!result.saved) return { opened: false, path: null };
    }
  }

  const { openFile } = await import('./fileOperations');
  const result = await openFile(editor, callbacks.deserialize);
  if (result.opened) {
    markCleanIndex(editor);
    fitToScene(editor);
  }
  return result;
}

export async function saveDocument(editor: EditorState, serialize: () => ArrayBuffer): Promise<SaveResult> {
  const result = await saveFile(editor, serialize);
  if (result.saved) {
    markCleanIndex(editor);
  }
  return result;
}

export async function saveDocumentAs(
  editor: EditorState,
  serialize: () => ArrayBuffer,
  defaultName?: string,
): Promise<SaveResult> {
  const result = await saveFileAs(editor, serialize, defaultName);
  if (result.saved) {
    markCleanIndex(editor);
  }
  return result;
}

export function closeDocument(editor: EditorState): void {
  closeScene(editor);
}

export function canSaveDocument(editor: Readonly<EditorState>): boolean {
  return canSave(editor);
}

export function canSaveDocumentAs(editor: Readonly<EditorState>): boolean {
  return canSaveAs(editor);
}

export function hasOpenDocument(editor: Readonly<EditorState>): boolean {
  return editor.scene !== null;
}

export function isDocumentModified(editor: Readonly<EditorState>): boolean {
  return needsSave(editor);
}

export function hasDocumentPath(editor: Readonly<EditorState>): boolean {
  return hasFilePath(editor);
}

function markCleanIndex(editor: EditorState): void {
  markCommandHistoryClean(editor.commandHistory);
}
