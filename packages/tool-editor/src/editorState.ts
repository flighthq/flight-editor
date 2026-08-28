import type { CanvasState } from '@flighthq/editor-canvas';
import type { ClipboardState } from '@flighthq/editor-clipboard';
import type { CommandHistory } from '@flighthq/editor-command';
import type { ContextMenuState } from '@flighthq/editor-context-menu';
import type { DocumentState } from '@flighthq/editor-document';
import type { DragDropState } from '@flighthq/editor-drag-drop';
import type { ExportSettingsState } from '@flighthq/editor-export-settings';
import type { FileState } from '@flighthq/editor-file';
import type { GuidesState } from '@flighthq/editor-guides';
import type { HierarchyState } from '@flighthq/editor-hierarchy';
import type { HostAdapterState } from '@flighthq/editor-host';
import type { KeyboardMap } from '@flighthq/editor-keyboard';
import type { LockState } from '@flighthq/editor-lock';
import type { MenuBarState } from '@flighthq/editor-menu';
import type { NodeFactory } from '@flighthq/editor-node-factory';
import type { PanelState } from '@flighthq/editor-panel';
import type { PageState } from '@flighthq/editor-page';
import type { PreferencesState } from '@flighthq/editor-preferences';
import type { PropertyPanelState } from '@flighthq/editor-properties';
import type { RulerState } from '@flighthq/editor-rulers';
import type { SceneState } from '@flighthq/editor-scene-state';
import type { SelectionState } from '@flighthq/editor-selection';
import type { SnapConfig } from '@flighthq/editor-snap';
import type { StatusBarState } from '@flighthq/editor-status';
import type { TextStyleState } from '@flighthq/editor-text-style';
import type { ToolbarState } from '@flighthq/editor-toolbar';
import type { ToolRegistry } from '@flighthq/editor-tool';
import type { TransformOriginState } from '@flighthq/editor-transform-origin';
import type { EditorViewport } from '@flighthq/editor-viewport';
import type { ZoomPresetState } from '@flighthq/editor-zoom-presets';
import type { Scene2D } from '@flighthq/types';

import type { NamedCommandFactory } from './commandRegistry';

import { createCanvasState } from '@flighthq/editor-canvas';
import { createClipboardState } from '@flighthq/editor-clipboard';
import { createCommandHistory } from '@flighthq/editor-command';
import { createContextMenuState } from '@flighthq/editor-context-menu';
import { createDocumentState } from '@flighthq/editor-document';
import { createDragDropState } from '@flighthq/editor-drag-drop';
import { createExportSettingsState } from '@flighthq/editor-export-settings';
import { createFileState } from '@flighthq/editor-file';
import { createGuidesState } from '@flighthq/editor-guides';
import { createHierarchyState } from '@flighthq/editor-hierarchy';
import { createHostAdapterState } from '@flighthq/editor-host';
import { createKeyboardMap } from '@flighthq/editor-keyboard';
import { createLockState } from '@flighthq/editor-lock';
import { createMenuBarState } from '@flighthq/editor-menu';
import { createNodeFactory } from '@flighthq/editor-node-factory';
import { createPanelState } from '@flighthq/editor-panel';
import { createPageState } from '@flighthq/editor-page';
import { createPreferencesState } from '@flighthq/editor-preferences';
import { createPropertyPanelState } from '@flighthq/editor-properties';
import { createRulerState } from '@flighthq/editor-rulers';
import { createSceneState } from '@flighthq/editor-scene-state';
import { createSelectionState } from '@flighthq/editor-selection';
import { createSnapConfig } from '@flighthq/editor-snap';
import { createStatusBarState } from '@flighthq/editor-status';
import { createTextStyleState } from '@flighthq/editor-text-style';
import { createToolbarState } from '@flighthq/editor-toolbar';
import { createToolRegistry } from '@flighthq/editor-tool';
import { createTransformOriginState } from '@flighthq/editor-transform-origin';
import { createEditorViewport } from '@flighthq/editor-viewport';
import { createZoomPresetState } from '@flighthq/editor-zoom-presets';

export interface EditorState {
  readonly canvas: CanvasState;
  readonly clipboard: ClipboardState;
  readonly commandRegistry: Map<string, NamedCommandFactory>;
  readonly commandHistory: CommandHistory;
  readonly contextMenu: ContextMenuState;
  readonly document: DocumentState;
  readonly dragDrop: DragDropState;
  readonly exportSettings: ExportSettingsState;
  readonly file: FileState;
  readonly guides: GuidesState;
  readonly hierarchy: HierarchyState;
  readonly host: HostAdapterState;
  readonly keyboard: KeyboardMap;
  readonly locks: LockState;
  readonly menuBar: MenuBarState;
  readonly nodeFactory: NodeFactory;
  readonly panels: PanelState;
  readonly pages: PageState;
  readonly preferences: PreferencesState;
  readonly properties: PropertyPanelState;
  readonly rulers: RulerState;
  readonly sceneState: SceneState;
  readonly selection: SelectionState;
  readonly snap: SnapConfig;
  readonly statusBar: StatusBarState;
  readonly textStyle: TextStyleState;
  readonly toolbar: ToolbarState;
  readonly toolRegistry: ToolRegistry;
  readonly transformOrigin: TransformOriginState;
  readonly viewport: EditorViewport;
  readonly zoomPresets: ZoomPresetState;
  scene: Scene2D | null;
}

export function createEditorState(viewportWidth = 800, viewportHeight = 600): EditorState {
  return {
    canvas: createCanvasState(),
    clipboard: createClipboardState(),
    commandRegistry: new Map(),
    commandHistory: createCommandHistory(),
    contextMenu: createContextMenuState(),
    document: createDocumentState(),
    dragDrop: createDragDropState(),
    exportSettings: createExportSettingsState(),
    file: createFileState(),
    guides: createGuidesState(),
    hierarchy: createHierarchyState(),
    host: createHostAdapterState(),
    keyboard: createKeyboardMap(),
    locks: createLockState(),
    menuBar: createMenuBarState(),
    nodeFactory: createNodeFactory(),
    panels: createPanelState(),
    pages: createPageState(),
    preferences: createPreferencesState(),
    properties: createPropertyPanelState(),
    rulers: createRulerState(),
    sceneState: createSceneState(),
    selection: createSelectionState(),
    snap: createSnapConfig(),
    statusBar: createStatusBarState(),
    textStyle: createTextStyleState(),
    toolbar: createToolbarState(),
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
