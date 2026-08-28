import type { ClipboardState } from '@flighthq/editor-clipboard';
import type { CommandHistory } from '@flighthq/editor-command';
import type { DragDropState } from '@flighthq/editor-drag-drop';
import type { GuidesState } from '@flighthq/editor-guides';
import type { HierarchyState } from '@flighthq/editor-hierarchy';
import type { KeyboardMap } from '@flighthq/editor-keyboard';
import type { LockState } from '@flighthq/editor-lock';
import type { NodeFactory } from '@flighthq/editor-node-factory';
import type { SceneState } from '@flighthq/editor-scene-state';
import type { SelectionState } from '@flighthq/editor-selection';
import type { SnapConfig } from '@flighthq/editor-snap';
import type { ToolRegistry } from '@flighthq/editor-tool';
import type { EditorViewport } from '@flighthq/editor-viewport';
import type { Scene2D } from '@flighthq/types';

import { createClipboardState } from '@flighthq/editor-clipboard';
import { createCommandHistory } from '@flighthq/editor-command';
import { createDragDropState } from '@flighthq/editor-drag-drop';
import { createGuidesState } from '@flighthq/editor-guides';
import { createHierarchyState } from '@flighthq/editor-hierarchy';
import { createKeyboardMap } from '@flighthq/editor-keyboard';
import { createLockState } from '@flighthq/editor-lock';
import { createNodeFactory } from '@flighthq/editor-node-factory';
import { createSceneState } from '@flighthq/editor-scene-state';
import { createSelectionState } from '@flighthq/editor-selection';
import { createSnapConfig } from '@flighthq/editor-snap';
import { createToolRegistry } from '@flighthq/editor-tool';
import { createEditorViewport } from '@flighthq/editor-viewport';

export interface EditorState {
  readonly clipboard: ClipboardState;
  readonly commandHistory: CommandHistory;
  readonly dragDrop: DragDropState;
  readonly guides: GuidesState;
  readonly hierarchy: HierarchyState;
  readonly keyboard: KeyboardMap;
  readonly locks: LockState;
  readonly nodeFactory: NodeFactory;
  readonly sceneState: SceneState;
  readonly selection: SelectionState;
  readonly snap: SnapConfig;
  readonly toolRegistry: ToolRegistry;
  readonly viewport: EditorViewport;
  scene: Scene2D | null;
}

export function createEditorState(viewportWidth = 800, viewportHeight = 600): EditorState {
  return {
    clipboard: createClipboardState(),
    commandHistory: createCommandHistory(),
    dragDrop: createDragDropState(),
    guides: createGuidesState(),
    hierarchy: createHierarchyState(),
    keyboard: createKeyboardMap(),
    locks: createLockState(),
    nodeFactory: createNodeFactory(),
    sceneState: createSceneState(),
    selection: createSelectionState(),
    snap: createSnapConfig(),
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
