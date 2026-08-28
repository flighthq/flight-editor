import type { EditorState } from './editorState';

import { isCommandHistoryClean, markCommandHistoryClean } from '@flighthq/editor-command';
import { isFileDirty, markFileClean, markFileDirty } from '@flighthq/editor-file';

export function syncDirtyState(editor: EditorState): boolean {
  const historyClean = isCommandHistoryClean(editor.commandHistory);
  const fileDirty = isFileDirty(editor.file);

  if (historyClean && fileDirty) {
    markFileClean(editor.file);
    return true;
  }
  if (!historyClean && !fileDirty) {
    markFileDirty(editor.file);
    return true;
  }
  return false;
}

export function markEditorClean(editor: EditorState): void {
  markCommandHistoryClean(editor.commandHistory);
  markFileClean(editor.file);
}

export function markEditorDirty(editor: EditorState): void {
  markFileDirty(editor.file);
}

export function isEditorClean(editor: Readonly<EditorState>): boolean {
  return isCommandHistoryClean(editor.commandHistory) && !isFileDirty(editor.file);
}

export function isEditorDirty(editor: Readonly<EditorState>): boolean {
  return !isEditorClean(editor);
}
