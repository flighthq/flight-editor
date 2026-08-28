import type { ClipboardState } from '@flighthq/editor-clipboard';
import type { CommandHistory } from '@flighthq/editor-command';
import type { ContextMenuState } from '@flighthq/editor-context-menu';
import type { DragDropState } from '@flighthq/editor-drag-drop';
import type { ExportSettingsState } from '@flighthq/editor-export-settings';
import type { GuidesState } from '@flighthq/editor-guides';
import type { HierarchyState } from '@flighthq/editor-hierarchy';
import type { KeyboardMap } from '@flighthq/editor-keyboard';
import type { LockState } from '@flighthq/editor-lock';
import type { NodeFactory } from '@flighthq/editor-node-factory';
import type { PageState } from '@flighthq/editor-page';
import type { RulerState } from '@flighthq/editor-rulers';
import type { SceneState } from '@flighthq/editor-scene-state';
import type { SelectionState } from '@flighthq/editor-selection';
import type { SnapConfig } from '@flighthq/editor-snap';
import type { TextStyleState } from '@flighthq/editor-text-style';
import type { ToolRegistry } from '@flighthq/editor-tool';
import type { TransformOriginState } from '@flighthq/editor-transform-origin';
import type { EditorViewport } from '@flighthq/editor-viewport';
import type { ZoomPresetState } from '@flighthq/editor-zoom-presets';
import type { Scene2D } from '@flighthq/types';

import { createClipboardState } from '@flighthq/editor-clipboard';
import { createCommandHistory } from '@flighthq/editor-command';
import { createContextMenuState } from '@flighthq/editor-context-menu';
import { createDragDropState } from '@flighthq/editor-drag-drop';
import { createExportSettingsState } from '@flighthq/editor-export-settings';
import { createGuidesState } from '@flighthq/editor-guides';
import { createHierarchyState } from '@flighthq/editor-hierarchy';
import { createKeyboardMap } from '@flighthq/editor-keyboard';
import { createLockState } from '@flighthq/editor-lock';
import { createNodeFactory } from '@flighthq/editor-node-factory';
import { createPageState } from '@flighthq/editor-page';
import { createRulerState } from '@flighthq/editor-rulers';
import { createSceneState } from '@flighthq/editor-scene-state';
import { createSelectionState } from '@flighthq/editor-selection';
import { createSnapConfig } from '@flighthq/editor-snap';
import { createTextStyleState } from '@flighthq/editor-text-style';
import { createToolRegistry } from '@flighthq/editor-tool';
import { createTransformOriginState } from '@flighthq/editor-transform-origin';
import { createEditorViewport } from '@flighthq/editor-viewport';
import { createZoomPresetState } from '@flighthq/editor-zoom-presets';

export interface EditorState {
  readonly clipboard: ClipboardState;
  readonly commandHistory: CommandHistory;
  readonly contextMenu: ContextMenuState;
  readonly dragDrop: DragDropState;
  readonly exportSettings: ExportSettingsState;
  readonly guides: GuidesState;
  readonly hierarchy: HierarchyState;
  readonly keyboard: KeyboardMap;
  readonly locks: LockState;
  readonly nodeFactory: NodeFactory;
  readonly pages: PageState;
  readonly rulers: RulerState;
  readonly sceneState: SceneState;
  readonly selection: SelectionState;
  readonly snap: SnapConfig;
  readonly textStyle: TextStyleState;
  readonly toolRegistry: ToolRegistry;
  readonly transformOrigin: TransformOriginState;
  readonly viewport: EditorViewport;
  readonly zoomPresets: ZoomPresetState;
  scene: Scene2D | null;
}

export function createEditorState(viewportWidth = 800, viewportHeight = 600): EditorState {
  return {
    clipboard: createClipboardState(),
    commandHistory: createCommandHistory(),
    contextMenu: createContextMenuState(),
    dragDrop: createDragDropState(),
    exportSettings: createExportSettingsState(),
    guides: createGuidesState(),
    hierarchy: createHierarchyState(),
    keyboard: createKeyboardMap(),
    locks: createLockState(),
    nodeFactory: createNodeFactory(),
    pages: createPageState(),
    rulers: createRulerState(),
    sceneState: createSceneState(),
    selection: createSelectionState(),
    snap: createSnapConfig(),
    textStyle: createTextStyleState(),
    toolRegistry: createToolRegistry(),
    transformOrigin: createTransformOriginState(),
    viewport: createEditorViewport(viewportWidth, viewportHeight),
    zoomPresets: createZoomPresetState(),
    scene: null,
  };
}

export function getEditorScene(state: Readonly<EditorState>): Scene2D | null {
  return state.scene;
}

export function setEditorScene(state: EditorState, scene: Scene2D | null): void {
  state.scene = scene;
}
