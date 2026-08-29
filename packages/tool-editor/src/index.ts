export { dispatchAction, dispatchKeyEvent, dispatchMenuItem, getMenuItemsForAction } from './commandDispatch';
export {
  CONTEXT_MENU_ACTION_MAP,
  closeEditorContextMenu,
  getContextMenuActionId,
  getContextMenuItemCount,
  getEditorContextMenuItems,
  isEditorContextMenuOpen,
  openEditorContextMenu,
  registerDefaultContextMenuItems,
} from './contextMenuManager';
export { isEditorClean, isEditorDirty, markEditorClean, markEditorDirty, syncDirtyState } from './dirtyTracker';
export {
  getEditorDocumentAuthor,
  getEditorDocumentError,
  getEditorDocumentFormat,
  getEditorDocumentLifecycle,
  getEditorDocumentMetadata,
  getEditorDocumentTitle,
  getEditorDocumentVersion,
  getEditorUndoCheckpoint,
  hasEditorDocumentError,
  isEditorDocumentLoading,
  isEditorDocumentReady,
  isEditorDocumentSaving,
  resetEditorDocument,
  setEditorDocumentAuthor,
  setEditorDocumentError,
  setEditorDocumentFormat,
  setEditorDocumentLifecycle,
  setEditorDocumentTimestamps,
  setEditorDocumentTitle,
  setEditorUndoCheckpoint,
  touchEditorDocumentModified,
} from './documentManager';
export { createBatchTransformCommand } from './commands/batchTransformCommand';
export { createAddFromFactoryCommand } from './commands/addFromFactoryCommand';
export { createAddNodeCommand } from './commands/addNodeCommand';
export { createAlignNodesCommand } from './commands/alignNodesCommand';
export { createSetAlphaCommand } from './commands/setAlphaCommand';
export { createSetBlendModeCommand } from './commands/setBlendModeCommand';
export { createSetColorAdjustmentCommand } from './commands/setColorAdjustmentCommand';
export { createSetVisibleCommand } from './commands/setVisibleCommand';
export { createClearSceneCommand } from './commands/clearSceneCommand';
export { createFlipNodeCommand } from './commands/flipNodeCommand';
export { createCopySelectionCommand } from './commands/copySelectionCommand';
export { createDeleteSelectionCommand } from './commands/deleteSelectionCommand';
export { createDuplicateSelectionCommand } from './commands/duplicateSelectionCommand';
export { createDistributeNodesCommand } from './commands/distributeNodesCommand';
export { createGroupNodesCommand } from './commands/groupNodesCommand';
export { createLockSelectionCommand } from './commands/lockSelectionCommand';
export { createMoveToPageCommand } from './commands/moveToPageCommand';
export { createPasteNodesCommand } from './commands/pasteNodesCommand';
export { createRemoveNodeCommand } from './commands/removeNodeCommand';
export { createResetTransformCommand } from './commands/resetTransformCommand';
export { createReparentNodeCommand } from './commands/reparentNodeCommand';
export { createReorderNodesCommand } from './commands/reorderNodesCommand';
export { createUngroupNodesCommand } from './commands/ungroupNodesCommand';
export { createSetNodeNameCommand } from './commands/setNodeNameCommand';
export { createSetNodeSizeCommand } from './commands/setNodeSizeCommand';
export { createSetPivotCommand } from './commands/setPivotCommand';
export { createSetClipCommand } from './commands/setClipCommand';
export { createSetScaleModeCommand } from './commands/setScaleModeCommand';
export { createSetSceneAlignCommand } from './commands/setSceneAlignCommand';
export { createSetSceneBackgroundColorCommand } from './commands/setSceneBackgroundColorCommand';
export { createSetSceneColorCommand } from './commands/setSceneColorCommand';
export { createSetSceneNameCommand } from './commands/setSceneNameCommand';
export { createSetSceneSizeCommand } from './commands/setSceneSizeCommand';
export { createSetTransform2DCommand } from './commands/setTransform2DCommand';
export { createFromShapeCommand } from './commands/createFromShapeCommand';
export {
  createBringForwardCommand,
  createBringToFrontCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
} from './commands/zOrderCommands';
export { getDefaultShortcutLabel, registerDefaultShortcuts } from './defaultShortcuts';
export { getDefaultMenuCount, registerDefaultMenus } from './defaultMenus';
export {
  beginEditorDrag,
  beginExternalDrag,
  beginHierarchyDrag,
  beginLibraryDrag,
  cancelEditorDrag,
  endEditorDrag,
  getEditorDragPayload,
  getEditorDragPosition,
  getEditorDropTarget,
  isEditorDragging,
  setEditorDropTarget,
  updateEditorDragPosition,
} from './dragDropManager';
export {
  alignBottom,
  alignCenterH,
  alignCenterV,
  alignLeft,
  alignRight,
  alignTop,
  distributeHorizontal,
  distributeVertical,
} from './alignmentOps';
export { createEditorState, getEditorScene, setEditorScene } from './editorState';
export { executeNamedCommand, registerDefaultCommands } from './commandRegistry';
export {
  canPaste,
  copySelection,
  cutSelection,
  getClipboardCount,
  getClipboardNodes,
  isCopyOperation,
  isCutOperation,
} from './clipboardManager';
export {
  addEditorSwatch,
  clearEditorSwatches,
  getEditorActiveColor,
  getEditorRecentColors,
  getEditorSwatches,
  removeEditorSwatch,
  saveActiveAsSwatch,
  setEditorActiveColor,
} from './colorManager';
export { createEditorLoopState, forceUpdateTitle, tickEditor } from './editorLoop';
export {
  addExportForNode,
  addExportForSelection,
  clearAllExports,
  getAllExports,
  getEnabledExportCount,
  getEnabledExports,
  getExportCount,
  getExportForNode,
  removeExportForNode,
  setExportNodeEnabled,
  setExportNodeFormat,
  setExportNodeScale,
  setExportNodeSuffix,
} from './exportManager';
export { createEyedropperTool } from './eyedropperTool';
export {
  addEditorCheckpoint,
  clearEditorCheckpoints,
  getEditorCheckpoint,
  getEditorCheckpointCount,
  getEditorCheckpoints,
  getEditorHistoryPanelVersion,
  removeEditorCheckpoint,
} from './historyStateManager';
export {
  addEditorGuide,
  clearAllGuides,
  getEditorGuide,
  getEditorGuideCount,
  getEditorSnapPositions,
  getHorizontalGuides,
  getVerticalGuides,
  lockEditorGuide,
  moveEditorGuide,
  removeEditorGuide,
  unlockEditorGuide,
} from './guideManager';
export {
  addEditorRecentFile,
  clearEditorRecentFiles,
  getEditorFilePath,
  getEditorFileVersion,
  getEditorMaxRecentFiles,
  getEditorRecentFileCount,
  getEditorRecentFiles,
  getEditorSaveStatus,
  isEditorFileDirty,
  markEditorFileClean,
  markEditorFileDirty,
  newEditorFile,
  openEditorFile,
  removeEditorRecentFile,
  setEditorFilePath,
  setEditorMaxRecentFiles,
  setEditorSaveStatus,
} from './fileManager';
export { canSave, canSaveAs, hasFilePath, needsSave, openFile, saveFile, saveFileAs } from './fileOperations';
export {
  getEditorKeyBinding,
  getEditorRegisteredActions,
  matchEditorKeyEvent,
  registerEditorKeyBinding,
  unregisterEditorKeyBinding,
} from './keyboardManager';
export {
  getEditorHostAdapter,
  getEditorHostAdapterVersion,
  getEditorHostCallbacks,
  getEditorHostCapabilities,
  hasEditorCapability,
  setEditorHostAdapter,
  setEditorHostCallbacks,
} from './hostManager';
export {
  collapseAll,
  collapseNode,
  expandAll,
  expandNode,
  getHierarchyTreeRows,
  isNodeExpanded,
  revealNode,
  revealSelectedNodes,
  selectAndRevealNode,
  toggleNode,
} from './hierarchyManager';
export { handleKeyDown, handlePointerDown, handlePointerMove, handlePointerUp, switchTool } from './eventHandler';
export {
  getRegisteredCommandCount,
  getRegisteredMenuCount,
  getRegisteredShortcutCount,
  initEditor,
} from './initEditor';
export { registerDefaultNodeKinds } from './factoryPresets';
export {
  areEditorRulersVisible,
  getEditorRulerOrigin,
  getEditorRulerSubdivisions,
  getEditorRulerTickSpacing,
  getEditorRulerUnit,
  getEditorSubdivisionSpacing,
  hideEditorRulers,
  resetEditorRulerOrigin,
  setEditorRulerOrigin,
  setEditorRulerSubdivisions,
  setEditorRulerTickSpacing,
  setEditorRulerUnit,
  showEditorRulers,
  toggleEditorRulers,
} from './rulerManager';
export {
  createEditorNodeFromKind,
  getEditorNodeKindCategories,
  getEditorNodeKindEntry,
  getEditorNodeKindIds,
  getEditorNodeKindsByCategory,
  registerEditorNodeKind,
  unregisterEditorNodeKind,
} from './nodeFactoryManager';
export {
  addNode,
  alignSelection,
  bringNodeForward,
  bringNodeToFront,
  deleteSelection,
  distributeSelection,
  duplicateSelection,
  flipNodes,
  flipSelection,
  groupSelection,
  removeNode,
  renameNode,
  reparentNode,
  sendNodeBackward,
  sendNodeToBack,
  setNodeTransform,
  setNodeVisible,
  ungroupNode,
} from './nodeOperations';
export {
  clearEditorLocks,
  getEditorLockedCount,
  hasLockedSelection,
  isEditorNodeLocked,
  isSelectionLocked,
  isSelectionPartiallyLocked,
  lockEditorNode,
  lockSelectedNodes,
  toggleEditorNodeLock,
  toggleSelectedLocks,
  unlockEditorNode,
  unlockSelectedNodes,
} from './lockManager';
export { registerDefaultTools } from './registerDefaultTools';
export { createHandTool } from './handTool';
export { createHeadlessEditor, isHeadlessEditorReady } from './headlessEditor';
export { captureBridgeSnapshot, hasBridgeChanges, notifyHostChanges } from './hostCallbackBridge';
export { getInspectorSelectedNames, getInspectorSnapshot } from './inspectorState';
export { createMarqueeTool } from './marqueeTool';
export {
  addEditorMenu,
  addEditorMenuItem,
  createEditorMenuItem,
  createEditorMenuSeparator,
  createEditorSubmenu,
  getEditorMenu,
  getEditorMenuBarVersion,
  getEditorMenuCount,
  getEditorMenuItem,
  getEditorMenuItems,
  getEditorMenus,
  removeEditorMenu,
  removeEditorMenuItem,
  setEditorMenuItemChecked,
  setEditorMenuItemEnabled,
} from './menuBarManager';
export {
  clearEditorPropertyValues,
  getEditorEditingPropertyId,
  getEditorPropertyCategories,
  getEditorPropertyCount,
  getEditorPropertyDefinition,
  getEditorPropertyDefinitions,
  getEditorPropertyDefinitionsByCategory,
  getEditorPropertyPanelVersion,
  getEditorPropertyValue,
  isEditorCategoryExpanded,
  isEditorPropertyMixed,
  registerEditorProperty,
  setEditorCategoryExpanded,
  setEditorEditingPropertyId,
  setEditorPropertyValue,
  unregisterEditorProperty,
} from './propertyManager';
export {
  createPage,
  deleteCurrentPage,
  getCurrentPage,
  getPageList,
  getTotalPageCount,
  movePageToIndex,
  navigateToNextPage,
  navigateToPage,
  navigateToPreviousPage,
  renameCurrentPage,
  resizeCurrentPage,
} from './pageManager';
export { createMeasureTool } from './measureTool';
export { createLineTool } from './lineTool';
export { createMoveTool } from './moveTool';
export { createPointerTool } from './pointerTool';
export { createRotateTool } from './rotateTool';
export { createRectangleTool } from './rectangleTool';
export { createScaleTool } from './scaleTool';
export { closeScene, createNewScene, getSceneName, getSceneSize, hasScene } from './sceneManager';
export { deserializeScene, getSerializerFormats, serializeScene } from './sceneSerializer';
export { createSelectTool } from './selectTool';
export { createZoomTool } from './zoomTool';
export {
  batchCommands,
  canRedo,
  canUndo,
  clearHistory,
  executeCommand,
  getRedoCount,
  getRedoLabel,
  getUndoCount,
  getUndoLabel,
  redoCommand,
  undoCommand,
} from './historyUtils';
export { expandBounds, getSceneBounds, getSelectionBounds, isNodeInBounds } from './boundsUtils';
export { buildNode, buildScene, countNodes } from './sceneBuilder';
export { createEditorLayoutDef, getLayoutRegion, getLayoutRegions } from './editorLayout';
export { countMatchingNodes, findFirstNode, findNodeByPath, findNodes } from './sceneSearch';
export {
  createLayoutScene,
  getLayoutChildNode,
  getLayoutNode,
  getLayoutNodeNames,
  resizeLayout,
} from './layoutRenderer';
export { createDarkTheme, createLightTheme, getThemeColor, mergeTheme } from './themeDefinition';
export {
  applyPreferences,
  capturePreferences,
  deserializePreferences,
  getDefaultPreferences,
  mergePreferences,
  serializePreferences,
} from './editorPreferences';
export {
  createPanelRegistry,
  getAllPanelIds,
  getPanel,
  getPanelCount,
  getPanelsByRegion,
  registerDefaultPanels,
  registerPanel,
  unregisterPanel,
} from './panelDefinition';
export { formatShortcut, parseShortcutString, shortcutMatchesEvent } from './shortcutDisplay';
export {
  createEditorApplication,
  getApplicationEditorState,
  getApplicationLayout,
  getApplicationTheme,
} from './editorApplication';
export { cloneNode, cloneNodeWithOffset, cloneNodes, deepCloneNode } from './nodeClone';
export { sceneToScreen, sceneToScreenDistance, screenToScene, screenToSceneDistance } from './coordinateUtils';
export {
  filterUnlockedNodes,
  filterVisibleNodes,
  findNodesByKind,
  findNodesByName,
  getCommonAncestor,
  getNodePath,
} from './nodeQueries';
export {
  addEditorSnapGuide,
  clearEditorSnapGuides,
  enableEditorSnapGrid,
  getEditorSnapGridSize,
  isEditorSnapGridEnabled,
  removeEditorSnapGuide,
  setEditorSnapGrid,
  snapEditorPosition,
} from './snapManager';
export { snapDimension, snapPosition, snapToGrid, snapToGuides } from './snapUtils';
export {
  getDeepestSelectedAncestor,
  getSelectedBounds,
  getSelectedNodes,
  isAncestorSelected,
} from './selectionQueries';
export { formatSelectionLabel, getSelectionSummary, syncSelectionToStatusBar } from './selectionSync';
export {
  deselectAll,
  deselectNode,
  getEditorSelectedNodes,
  getEditorSelectionCount,
  getSelectableCount,
  hasSelection,
  invertSelection,
  isNodeSelected,
  selectAll,
  selectNode,
} from './selectionOps';
export {
  activateEditorTool,
  deactivateEditorTool,
  getActiveEditorTool,
  getActiveEditorToolId,
  getRegisteredEditorToolIds,
  isEditorToolActive,
  registerEditorTool,
  unregisterEditorTool,
} from './toolManager';
export {
  clearEditorCursorPosition,
  clearEditorStatusMessage,
  getEditorCursorPosition,
  getEditorStatusActiveToolName,
  getEditorStatusBarVersion,
  getEditorStatusMessage,
  getEditorStatusSelectionCount,
  getEditorStatusSelectionLabel,
  getEditorStatusZoomPercent,
  setEditorCursorPosition,
  setEditorStatusActiveToolName,
  setEditorStatusMessage,
  setEditorStatusSelectionInfo,
  setEditorStatusZoomPercent,
} from './statusBarManager';
export { formatWindowTitle, updateWindowTitle } from './windowTitle';
export {
  addEditorZoomPreset,
  computeEditorFitWidthZoom,
  computeEditorFitZoom,
  findEditorNearestPreset,
  getEditorNextZoomIn,
  getEditorNextZoomOut,
  getEditorZoomPreset,
  getEditorZoomPresetVersion,
  getEditorZoomPresets,
  removeEditorZoomPreset,
} from './zoomPresetManager';
export {
  getZoomLevel,
  getZoomPercent,
  getZoomPercentLabel,
  setZoomLevel,
  zoomIn,
  zoomOut,
  zoomToActualSize,
  zoomToFit,
} from './zoomController';
export {
  getEditorTextAlign,
  getEditorTextColor,
  getEditorTextFontFamily,
  getEditorTextFontSize,
  getEditorTextFontStyle,
  getEditorTextFontWeight,
  getEditorTextLetterSpacing,
  getEditorTextLineHeight,
  isEditorTextStrikethrough,
  isEditorTextUnderline,
  setEditorTextAlign,
  setEditorTextColor,
  setEditorTextFontFamily,
  setEditorTextFontSize,
  setEditorTextFontStyle,
  setEditorTextFontWeight,
  setEditorTextLetterSpacing,
  setEditorTextLineHeight,
  setEditorTextStrikethrough,
  setEditorTextUnderline,
  toggleEditorTextBold,
  toggleEditorTextItalic,
  toggleEditorTextUnderline,
} from './textStyleManager';
export {
  computeEditorTransformOrigin,
  getEditorCustomTransformOrigin,
  getEditorTransformOriginMode,
  setEditorCustomTransformOrigin,
  setEditorTransformOriginMode,
} from './transformOriginManager';
export {
  composeTransform,
  decomposeTransform,
  getLocalPosition,
  getNodeCenter,
  getWorldPosition,
} from './transformUtils';

export {
  applyThemeBorders,
  applyThemeToLayout,
  applyThemeToLayoutChild,
  applyThemeToNode,
  clearThemeFromLayout,
  getDefaultRegionColors,
  getRegionColor,
} from './themeRenderer';
export {
  createRenderLoopState,
  getMinFrameInterval,
  getRenderLoopFps,
  getRenderLoopFrameCount,
  isRenderLoopRunning,
  pauseRenderLoop,
  resumeRenderLoop,
  setRenderLoopCallback,
  startRenderLoop,
  stepRenderLoop,
  stopRenderLoop,
} from './renderLoop';
export { createDefaultFileFilters, createTauriHostAdapter, createTauriHostCapabilities } from './tauriHost';
export {
  createDesktopBootstrap,
  disposeDesktopBootstrap,
  getDesktopEditor,
  getDesktopLayout,
  getDesktopPanels,
  getDesktopTheme,
  resizeDesktop,
  startDesktopLoop,
  stepDesktopLoop,
  stopDesktopLoop,
} from './desktopBootstrap';
export {
  createCanvasRenderer,
  disposeCanvasRenderer,
  renderScene,
  resizeCanvasRenderer,
  startCanvasLoop,
  stopCanvasLoop,
} from './canvasRenderer';
export { bindDomEvents, createKeyEventFromDom, createPointerEventFromDom } from './domEventAdapter';

export type { ThemeMapping } from './themeRenderer';
export type { RenderLoopConfig, RenderLoopState } from './renderLoop';
export type { TauriFileFilter, TauriHostConfig, TauriIpc } from './tauriHost';
export type { DesktopBootstrap, DesktopBootstrapConfig } from './desktopBootstrap';
export type { CanvasRendererConfig, CanvasRendererState } from './canvasRenderer';
export type { DomEventBindings } from './domEventAdapter';

export type { KeyEventLike } from './commandDispatch';
export type { AlignMode } from './commands/alignNodesCommand';
export type { TransformEntry } from './commands/batchTransformCommand';
export type { DistributeMode } from './commands/distributeNodesCommand';
export type { FlipAxis } from './commands/flipNodeCommand';
export { createDesktopEditor, isDesktopEditorModified } from './desktopEditor';
export { createEditorRuntime, getRuntimeNode } from './editorRuntime';

export type { DesktopEditor, DesktopEditorOptions } from './desktopEditor';
export type { EditorRuntime, EditorRuntimeOptions, EditorRuntimeProperty } from './editorRuntime';
export type { EditorState } from './editorState';
export type { HeadlessEditor, HeadlessEditorOptions } from './headlessEditor';
export type { NamedCommandArguments, NamedCommandFactory } from './commandRegistry';
export type { ColorAtPoint, ColorPickCallback, EyedropperTool, EyedropperToolOptions } from './eyedropperTool';
export type { HandTool } from './handTool';
export type { EditorLoopState } from './editorLoop';
export type { BridgeSnapshot } from './hostCallbackBridge';
export type { InitEditorOptions } from './initEditor';
export type { DefaultToolsOptions } from './registerDefaultTools';
export type { InspectorSnapshot } from './inspectorState';
export type { MarqueeHitTestFn, MarqueeRect, MarqueeTool } from './marqueeTool';
export type { MeasureResult, MeasureTool } from './measureTool';
export type { LinePreview, LineTool, LineToolOptions } from './lineTool';
export type { MoveTool } from './moveTool';
export type {
  HandleHitTestFn,
  PointerHitTestFn,
  PointerTool,
  PointerToolConfig,
  RotationHandleHit,
  RotationHitTestFn,
  ScaleHandle,
  ScaleHandleHit,
} from './pointerTool';
export type { RotateTool, RotateToolConfig } from './rotateTool';
export type { RectanglePreview, RectangleTool, RectangleToolOptions } from './rectangleTool';
export type { ScaleTool } from './scaleTool';
export type { HitTestFn, SelectTool } from './selectTool';
export type { ZoomTool } from './zoomTool';
export type { BoundsRectangle } from './boundsUtils';
export type { SceneDef, SceneNodeDef } from './sceneBuilder';
export type { LayoutConfig, LayoutRegion } from './editorLayout';
export type { SceneSearchCriteria } from './sceneSearch';
export type { LayoutScene } from './layoutRenderer';
export type { EditorTheme, ThemeColors, ThemeSizes, ThemeSpacing } from './themeDefinition';
export type { EditorPreferences } from './editorPreferences';
export type { PanelDefinition, PanelRegistry } from './panelDefinition';
export type { EditorApplication, EditorApplicationOptions } from './editorApplication';
export type { Platform, ShortcutParts } from './shortcutDisplay';
export type { CoordinatePoint } from './coordinateUtils';
export type { GuideSnapResult, SnapPoint } from './snapUtils';
export type { DecomposedTransform, TransformPoint } from './transformUtils';
export type { WindowTitleOptions } from './windowTitle';
export {
  canSaveDocument,
  canSaveDocumentAs,
  closeDocument,
  hasDocumentPath,
  hasOpenDocument,
  isDocumentModified,
  newDocument,
  openDocument,
  saveDocument,
  saveDocumentAs,
} from './sessionController';
export {
  centerOnPoint,
  fitToScene,
  frameNode,
  frameSelection,
  getVisibleSceneBounds,
  panViewport,
  resizeViewport,
  zoomAtPoint,
} from './viewportOps';

export type { ConfirmResult, SessionCallbacks } from './sessionController';
export type { SaveResult } from './fileOperations';
export type { CursorPosition, MessageSeverity } from '@flighthq/editor-status';
export type { DocumentFormat, DocumentLifecycle, DocumentMetadata } from '@flighthq/editor-document';
export type { HostAdapter, HostCallbacks, HostCapabilities } from '@flighthq/editor-host';
export type { PropertyDefinition, PropertyType, PropertyValue } from '@flighthq/editor-properties';
export type { Checkpoint } from '@flighthq/editor-history-state';
export type { MenuDefinition, MenuItem, MenuItemRole } from '@flighthq/editor-menu';
export type { ZoomPreset } from '@flighthq/editor-zoom-presets';
export type { NodeCreator, NodeFactoryEntry } from '@flighthq/editor-node-factory';
export type { KeyBinding, KeyboardEventLike } from '@flighthq/editor-keyboard';
export type { RecentFile, SaveStatus } from '@flighthq/editor-file';
export type { EditorPointerEvent, EditorTool } from '@flighthq/editor-tool';
