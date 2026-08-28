import type { Command } from '@flighthq/editor-command';

import {
  executeCommand as executeHistoryCommand,
  getCommandHistoryRedoLabel,
  getCommandHistoryUndoLabel,
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
