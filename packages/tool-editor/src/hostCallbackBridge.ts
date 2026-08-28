import type { EditorState } from './editorState';

import { getHostCallbacks } from '@flighthq/editor-host';
import { getSelectionCount } from '@flighthq/editor-selection';
import { getActiveToolId } from '@flighthq/editor-tool';
import { isFileDirty } from '@flighthq/editor-file';
import { getDocumentTitle } from '@flighthq/editor-document';

export interface BridgeSnapshot {
  dirty: boolean;
  title: string;
  selectionCount: number;
  toolId: string | null;
  zoom: number;
}

export function captureBridgeSnapshot(editor: Readonly<EditorState>): BridgeSnapshot {
  return {
    dirty: isFileDirty(editor.file),
    title: getDocumentTitle(editor.document),
    selectionCount: getSelectionCount(editor.selection),
    toolId: getActiveToolId(editor.toolRegistry),
    zoom: editor.viewport.camera.zoom,
  };
}

export function notifyHostChanges(
  editor: Readonly<EditorState>,
  previous: Readonly<BridgeSnapshot>,
  current: Readonly<BridgeSnapshot>,
): void {
  const callbacks = getHostCallbacks(editor.host);

  if (previous.dirty !== current.dirty && callbacks.onDirtyChange) {
    callbacks.onDirtyChange(current.dirty);
  }
  if (previous.title !== current.title && callbacks.onTitleChange) {
    callbacks.onTitleChange(current.title);
  }
  if (previous.selectionCount !== current.selectionCount && callbacks.onSelectionChange) {
    callbacks.onSelectionChange(current.selectionCount);
  }
  if (previous.toolId !== current.toolId && callbacks.onToolChange) {
    callbacks.onToolChange(current.toolId ?? '');
  }
  if (previous.zoom !== current.zoom && callbacks.onZoomChange) {
    callbacks.onZoomChange(current.zoom);
  }
}

export function hasBridgeChanges(previous: Readonly<BridgeSnapshot>, current: Readonly<BridgeSnapshot>): boolean {
  return (
    previous.dirty !== current.dirty ||
    previous.title !== current.title ||
    previous.selectionCount !== current.selectionCount ||
    previous.toolId !== current.toolId ||
    previous.zoom !== current.zoom
  );
}
