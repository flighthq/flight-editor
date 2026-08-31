import type { CanvasState } from '@flighthq/editor-canvas';
import type { ClipboardState } from '@flighthq/editor-clipboard';
import type { ColorState } from '@flighthq/editor-color';
import type { CommandHistory } from '@flighthq/editor-command';
import type { ContextMenuState } from '@flighthq/editor-context-menu';
import type { DocumentState } from '@flighthq/editor-document';
import type { DiagnosticState } from '@flighthq/editor-diagnostics';
import type { DragDropState } from '@flighthq/editor-drag-drop';
import type { EditingScopeState } from '@flighthq/editor-editing-scope';
import type { ExportSettingsState } from '@flighthq/editor-export-settings';
import type { FileState } from '@flighthq/editor-file';
import type { GuidesState } from '@flighthq/editor-guides';
import type { GestureState } from '@flighthq/editor-gesture';
import type { HierarchyState } from '@flighthq/editor-hierarchy';
import type { HistoryState } from '@flighthq/editor-history-state';
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
import type { SessionState } from '@flighthq/editor-session';
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
import { createColorState } from '@flighthq/editor-color';
import { createCommandHistory } from '@flighthq/editor-command';
import { createContextMenuState } from '@flighthq/editor-context-menu';
import { createDocumentState } from '@flighthq/editor-document';
import { createDiagnosticState } from '@flighthq/editor-diagnostics';
import { createDragDropState } from '@flighthq/editor-drag-drop';
import { createEditingScopeState } from '@flighthq/editor-editing-scope';
import { createExportSettingsState } from '@flighthq/editor-export-settings';
import { createFileState } from '@flighthq/editor-file';
import { createGuidesState } from '@flighthq/editor-guides';
import { createGestureState } from '@flighthq/editor-gesture';
import { createHierarchyState } from '@flighthq/editor-hierarchy';
import { createHistoryState } from '@flighthq/editor-history-state';
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
import { createSessionState } from '@flighthq/editor-session';
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
  readonly color: ColorState;
  readonly commandRegistry: Map<string, NamedCommandFactory>;
  readonly commandHistory: CommandHistory;
  readonly contextMenu: ContextMenuState;
  readonly document: DocumentState;
  readonly diagnostics: DiagnosticState;
  readonly dragDrop: DragDropState;
  readonly editingScope: EditingScopeState;
  readonly exportSettings: ExportSettingsState;
  readonly file: FileState;
  readonly guides: GuidesState;
  readonly gesture: GestureState<unknown>;
  readonly hierarchy: HierarchyState;
  readonly historyPanel: HistoryState;
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
  readonly session: SessionState;
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
    color: createColorState(),
    commandRegistry: new Map(),
    commandHistory: createCommandHistory(),
    contextMenu: createContextMenuState(),
    document: createDocumentState(),
    diagnostics: createDiagnosticState(),
    dragDrop: createDragDropState(),
    editingScope: createEditingScopeState({ identity: 'document', kind: 'document', label: 'Document' }),
    exportSettings: createExportSettingsState(),
    file: createFileState(),
    guides: createGuidesState(),
    gesture: createGestureState(),
    hierarchy: createHierarchyState(),
    historyPanel: createHistoryState(),
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
    session: createSessionState(),
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
