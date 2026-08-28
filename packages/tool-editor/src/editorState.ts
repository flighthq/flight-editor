import type { ClipboardState } from '@flighthq/editor-clipboard';
import type { CommandHistory } from '@flighthq/editor-command';
import type { HierarchyState } from '@flighthq/editor-hierarchy';
import type { NodeFactory } from '@flighthq/editor-node-factory';
import type { SelectionState } from '@flighthq/editor-selection';
import type { ToolRegistry } from '@flighthq/editor-tool';
import type { EditorViewport } from '@flighthq/editor-viewport';
import type { Scene2D } from '@flighthq/types';

import { createClipboardState } from '@flighthq/editor-clipboard';
import { createCommandHistory } from '@flighthq/editor-command';
import { createHierarchyState } from '@flighthq/editor-hierarchy';
import { createNodeFactory } from '@flighthq/editor-node-factory';
import { createSelectionState } from '@flighthq/editor-selection';
import { createToolRegistry } from '@flighthq/editor-tool';
import { createEditorViewport } from '@flighthq/editor-viewport';

export interface EditorState {
  readonly clipboard: ClipboardState;
  readonly commandHistory: CommandHistory;
  readonly hierarchy: HierarchyState;
  readonly nodeFactory: NodeFactory;
  readonly selection: SelectionState;
  readonly toolRegistry: ToolRegistry;
  readonly viewport: EditorViewport;
  scene: Scene2D | null;
}

export function createEditorState(viewportWidth = 800, viewportHeight = 600): EditorState {
  return {
    clipboard: createClipboardState(),
    commandHistory: createCommandHistory(),
    hierarchy: createHierarchyState(),
    nodeFactory: createNodeFactory(),
    selection: createSelectionState(),
    toolRegistry: createToolRegistry(),
    viewport: createEditorViewport(viewportWidth, viewportHeight),
    scene: null,
  };
}

export function getEditorScene(state: Readonly<EditorState>): Scene2D | null {
  return state.scene;
}

export function setEditorScene(state: EditorState, scene: Scene2D | null): void {
  state.scene = scene;
}
