import type { EditorState } from './editorState';

import { getDocumentTitle } from '@flighthq/editor-document';
import { isFileDirty, getCurrentFilePath } from '@flighthq/editor-file';
import { getHostAdapter } from '@flighthq/editor-host';

export interface WindowTitleOptions {
  readonly appName?: string;
  readonly separator?: string;
  readonly dirtyMarker?: string;
}

export function formatWindowTitle(editor: Readonly<EditorState>, options: Readonly<WindowTitleOptions> = {}): string {
  const appName = options.appName ?? 'Flight Editor';
  const separator = options.separator ?? ' — ';
  const dirtyMarker = options.dirtyMarker ?? '*';

  const title = getDocumentTitle(editor.document);
  const dirty = isFileDirty(editor.file);
  const filePath = getCurrentFilePath(editor.file);

  let displayName = title;
  if (filePath) {
    const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    displayName = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
  }

  const dirtyPrefix = dirty ? dirtyMarker : '';
  return `${dirtyPrefix}${displayName}${separator}${appName}`;
}

export function updateWindowTitle(editor: Readonly<EditorState>, options: Readonly<WindowTitleOptions> = {}): void {
  const title = formatWindowTitle(editor, options);
  const adapter = getHostAdapter(editor.host);
  adapter.setWindowTitle(title);
}
