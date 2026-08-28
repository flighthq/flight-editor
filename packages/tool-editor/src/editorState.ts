import type { CommandHistory } from '@flighthq/editor-command';
import type { SelectionState } from '@flighthq/editor-selection';
import type { ToolRegistry } from '@flighthq/editor-tool';
import type { Scene2D } from '@flighthq/types';

import { createCommandHistory } from '@flighthq/editor-command';
import { createSelectionState } from '@flighthq/editor-selection';
import { createToolRegistry } from '@flighthq/editor-tool';

export interface EditorState {
  readonly commandHistory: CommandHistory;
  readonly selection: SelectionState;
  readonly toolRegistry: ToolRegistry;
  scene: Scene2D | null;
}

export function createEditorState(): EditorState {
  return {
    commandHistory: createCommandHistory(),
    selection: createSelectionState(),
    toolRegistry: createToolRegistry(),
    scene: null,
  };
}

export function getEditorScene(state: Readonly<EditorState>): Scene2D | null {
  return state.scene;
}

export function setEditorScene(state: EditorState, scene: Scene2D | null): void {
  state.scene = scene;
}
