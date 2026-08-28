import type { EditorState } from './editorState';

import { syncDirtyState } from './dirtyTracker';
import { captureBridgeSnapshot, hasBridgeChanges, notifyHostChanges } from './hostCallbackBridge';
import { syncSelectionToStatusBar } from './selectionSync';
import { updateWindowTitle } from './windowTitle';

import type { BridgeSnapshot } from './hostCallbackBridge';
import type { WindowTitleOptions } from './windowTitle';

export interface EditorLoopState {
  previousSnapshot: BridgeSnapshot;
  titleOptions: WindowTitleOptions;
}

export function createEditorLoopState(
  editor: Readonly<EditorState>,
  titleOptions?: WindowTitleOptions,
): EditorLoopState {
  return {
    previousSnapshot: captureBridgeSnapshot(editor),
    titleOptions: titleOptions ?? {},
  };
}

export function tickEditor(editor: EditorState, loop: EditorLoopState): boolean {
  syncDirtyState(editor);
  syncSelectionToStatusBar(editor);

  const current = captureBridgeSnapshot(editor);
  const changed = hasBridgeChanges(loop.previousSnapshot, current);

  if (changed) {
    notifyHostChanges(editor, loop.previousSnapshot, current);
    updateWindowTitle(editor, loop.titleOptions);
    loop.previousSnapshot = current;
  }

  return changed;
}

export function forceUpdateTitle(editor: EditorState, loop: EditorLoopState): void {
  updateWindowTitle(editor, loop.titleOptions);
  loop.previousSnapshot = captureBridgeSnapshot(editor);
}
