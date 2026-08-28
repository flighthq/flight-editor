import type { NodeCreator, NodeFactoryEntry } from '@flighthq/editor-node-factory';
import type { NodeAny } from '@flighthq/types';
import type { EditorState } from './editorState';

import {
  createNodeFromKind,
  getNodeKindCategories,
  getNodeKindEntry,
  getNodeKindIds,
  getNodeKindsByCategory,
  registerNodeKind,
  unregisterNodeKind,
} from '@flighthq/editor-node-factory';

export function registerEditorNodeKind(
  editor: EditorState,
  id: string,
  label: string,
  category: string,
  create: NodeCreator,
): void {
  registerNodeKind(editor.nodeFactory, id, label, category, create);
}

export function unregisterEditorNodeKind(editor: EditorState, id: string): boolean {
  return unregisterNodeKind(editor.nodeFactory, id);
}

export function createEditorNodeFromKind(editor: Readonly<EditorState>, id: string): NodeAny | null {
  return createNodeFromKind(editor.nodeFactory, id);
}

export function getEditorNodeKindEntry(editor: Readonly<EditorState>, id: string): NodeFactoryEntry | undefined {
  return getNodeKindEntry(editor.nodeFactory, id);
}

export function getEditorNodeKindIds(editor: Readonly<EditorState>): string[] {
  return getNodeKindIds(editor.nodeFactory);
}

export function getEditorNodeKindCategories(editor: Readonly<EditorState>): string[] {
  return getNodeKindCategories(editor.nodeFactory);
}

export function getEditorNodeKindsByCategory(editor: Readonly<EditorState>, category: string): NodeFactoryEntry[] {
  return getNodeKindsByCategory(editor.nodeFactory, category);
}
