import type { EditorState } from './editorState';
import type { NodeAny } from '@flighthq/types';

import {
  getClipboardEntries,
  getClipboardOperation,
  isClipboardEmpty,
  setClipboardEntries,
} from '@flighthq/editor-clipboard';
import { getSelectedNodes } from '@flighthq/editor-selection';

export function copySelection(editor: EditorState): number {
  const nodes = getSelectedNodes(editor.selection);
  if (nodes.length === 0) return 0;
  setClipboardEntries(editor.clipboard, nodes, 'copy');
  return nodes.length;
}

export function cutSelection(editor: EditorState): number {
  const nodes = getSelectedNodes(editor.selection);
  if (nodes.length === 0) return 0;
  setClipboardEntries(editor.clipboard, nodes, 'cut');
  return nodes.length;
}

export function getClipboardNodes(editor: Readonly<EditorState>): readonly NodeAny[] {
  return getClipboardEntries(editor.clipboard);
}

export function canPaste(editor: Readonly<EditorState>): boolean {
  return !isClipboardEmpty(editor.clipboard);
}

export function isCutOperation(editor: Readonly<EditorState>): boolean {
  return getClipboardOperation(editor.clipboard) === 'cut';
}

export function isCopyOperation(editor: Readonly<EditorState>): boolean {
  return getClipboardOperation(editor.clipboard) === 'copy';
}

export function getClipboardCount(editor: Readonly<EditorState>): number {
  return getClipboardEntries(editor.clipboard).length;
}
