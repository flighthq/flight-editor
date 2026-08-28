import type { Checkpoint } from '@flighthq/editor-history-state';
import type { EditorState } from './editorState';

import {
  addCheckpoint,
  clearCheckpoints,
  getCheckpoint,
  getCheckpointCount,
  getCheckpoints,
  getHistoryVersion,
  removeCheckpoint,
} from '@flighthq/editor-history-state';

export function addEditorCheckpoint(editor: EditorState, label: string, data: unknown): number {
  return addCheckpoint(editor.historyPanel, label, data);
}

export function removeEditorCheckpoint(editor: EditorState, id: number): boolean {
  return removeCheckpoint(editor.historyPanel, id);
}

export function getEditorCheckpoint(editor: Readonly<EditorState>, id: number): Checkpoint | undefined {
  return getCheckpoint(editor.historyPanel, id);
}

export function getEditorCheckpoints(editor: Readonly<EditorState>): readonly Checkpoint[] {
  return getCheckpoints(editor.historyPanel);
}

export function getEditorCheckpointCount(editor: Readonly<EditorState>): number {
  return getCheckpointCount(editor.historyPanel);
}

export function clearEditorCheckpoints(editor: EditorState): void {
  clearCheckpoints(editor.historyPanel);
}

export function getEditorHistoryPanelVersion(editor: Readonly<EditorState>): number {
  return getHistoryVersion(editor.historyPanel);
}
