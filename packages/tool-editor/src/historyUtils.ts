import type { Command } from '@flighthq/editor-command';

import {
  clearCommandHistory,
  executeCommand as executeHistoryCommand,
  getCommandHistoryRedoCount,
  getCommandHistoryRedoLabel,
  getCommandHistoryUndoCount,
  getCommandHistoryUndoLabel,
  redo as redoHistory,
  undo as undoHistory,
} from '@flighthq/editor-command';
import { markSceneDirty } from '@flighthq/editor-scene-state';

import type { EditorState } from './editorState';

export function executeCommand(editor: EditorState, command: Command): void {
  executeHistoryCommand(editor.commandHistory, command);
  markSceneDirty(editor.sceneState);
}

export function batchCommands(commands: readonly Command[], label: string): Command {
  const entries = [...commands];
  return {
    label,
    execute() {
      for (const command of entries) command.execute();
    },
    undo() {
      for (let index = entries.length - 1; index >= 0; index--) entries[index]!.undo();
    },
  };
}

export function getUndoLabel(editor: Readonly<EditorState>): string | null {
  return getCommandHistoryUndoLabel(editor.commandHistory);
}

export function getRedoLabel(editor: Readonly<EditorState>): string | null {
  return getCommandHistoryRedoLabel(editor.commandHistory);
}

export function undoCommand(editor: EditorState): boolean {
  const result = undoHistory(editor.commandHistory);
  if (result) markSceneDirty(editor.sceneState);
  return result;
}

export function redoCommand(editor: EditorState): boolean {
  const result = redoHistory(editor.commandHistory);
  if (result) markSceneDirty(editor.sceneState);
  return result;
}

export function clearHistory(editor: EditorState): void {
  clearCommandHistory(editor.commandHistory);
}

export function canUndo(editor: Readonly<EditorState>): boolean {
  return getCommandHistoryUndoCount(editor.commandHistory) > 0;
}

export function canRedo(editor: Readonly<EditorState>): boolean {
  return getCommandHistoryRedoCount(editor.commandHistory) > 0;
}

export function getUndoCount(editor: Readonly<EditorState>): number {
  return getCommandHistoryUndoCount(editor.commandHistory);
}

export function getRedoCount(editor: Readonly<EditorState>): number {
  return getCommandHistoryRedoCount(editor.commandHistory);
}
