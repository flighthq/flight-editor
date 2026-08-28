import type { EditorState } from './editorState';

import { setDocumentLifecycle, setDocumentTitle } from '@flighthq/editor-document';
import { addRecentFile, getCurrentFilePath, isFileDirty, setCurrentFilePath } from '@flighthq/editor-file';
import { getHostAdapter, hasCapability } from '@flighthq/editor-host';

import { markEditorClean } from './dirtyTracker';
import { deserializeScene, serializeScene } from './sceneSerializer';

export interface SaveResult {
  readonly saved: boolean;
  readonly path: string | null;
}

export async function saveFile(
  editor: EditorState,
  serialize: () => ArrayBuffer = () => serializeScene(editor),
): Promise<SaveResult> {
  const path = getCurrentFilePath(editor.file);
  if (path !== null) {
    return saveToPath(editor, path, serialize);
  }
  return saveFileAs(editor, serialize);
}

export async function saveFileAs(
  editor: EditorState,
  serialize: () => ArrayBuffer = () => serializeScene(editor),
  defaultName = 'Untitled.flight',
): Promise<SaveResult> {
  if (!hasCapability(editor.host, 'hasNativeDialogs')) {
    return { saved: false, path: null };
  }

  const adapter = getHostAdapter(editor.host);
  const result = await adapter.showSaveDialog(defaultName);
  if (result === null) {
    return { saved: false, path: null };
  }

  return saveToPath(editor, result.path, serialize);
}

export async function openFile(
  editor: EditorState,
  deserialize: (data: ArrayBuffer) => void = (data) => deserializeScene(editor, data),
): Promise<{ opened: boolean; path: string | null }> {
  if (!hasCapability(editor.host, 'hasFileSystem')) {
    return { opened: false, path: null };
  }

  const adapter = getHostAdapter(editor.host);
  const result = await adapter.showOpenDialog();
  if (result === null) {
    return { opened: false, path: null };
  }

  setDocumentLifecycle(editor.document, 'loading');

  try {
    const data = await adapter.readFile(result.path);
    deserialize(data);
    setCurrentFilePath(editor.file, result.path);
    setDocumentTitle(editor.document, result.name);
    addRecentFile(editor.file, result.path, result.name, Date.now());
    markEditorClean(editor);
    setDocumentLifecycle(editor.document, 'ready');
    return { opened: true, path: result.path };
  } catch {
    setDocumentLifecycle(editor.document, 'error');
    return { opened: false, path: null };
  }
}

export function canSave(editor: Readonly<EditorState>): boolean {
  return hasCapability(editor.host, 'hasFileSystem');
}

export function canSaveAs(editor: Readonly<EditorState>): boolean {
  return hasCapability(editor.host, 'hasNativeDialogs') && hasCapability(editor.host, 'hasFileSystem');
}

export function needsSave(editor: Readonly<EditorState>): boolean {
  return isFileDirty(editor.file);
}

export function hasFilePath(editor: Readonly<EditorState>): boolean {
  return getCurrentFilePath(editor.file) !== null;
}

async function saveToPath(editor: EditorState, path: string, serialize: () => ArrayBuffer): Promise<SaveResult> {
  if (!hasCapability(editor.host, 'hasFileSystem')) {
    return { saved: false, path: null };
  }

  setDocumentLifecycle(editor.document, 'saving');

  try {
    const adapter = getHostAdapter(editor.host);
    const data = serialize();
    await adapter.writeFile(path, data);
    setCurrentFilePath(editor.file, path);

    const lastSlash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
    const fileName = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;
    setDocumentTitle(editor.document, fileName);
    addRecentFile(editor.file, path, fileName, Date.now());

    markEditorClean(editor);
    setDocumentLifecycle(editor.document, 'ready');
    return { saved: true, path };
  } catch {
    setDocumentLifecycle(editor.document, 'error');
    return { saved: false, path };
  }
}
