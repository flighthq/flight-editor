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
export { createEditorLoopState, forceUpdateTitle, tickEditor } from './editorLoop';
export { createEyedropperTool } from './eyedropperTool';
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
export { canSave, canSaveAs, hasFilePath, needsSave, openFile, saveFile, saveFileAs } from './fileOperations';
export {
  getActiveEditorToolId,
  handleKeyDown,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  switchTool,
} from './eventHandler';
export {
  getRegisteredCommandCount,
  getRegisteredMenuCount,
  getRegisteredShortcutCount,
  initEditor,
} from './initEditor';
export { registerDefaultNodeKinds } from './factoryPresets';
export { registerDefaultTools } from './registerDefaultTools';
export { createHandTool } from './handTool';
export { captureBridgeSnapshot, hasBridgeChanges, notifyHostChanges } from './hostCallbackBridge';
export { getInspectorSelectedNames, getInspectorSnapshot } from './inspectorState';
export { createMarqueeTool } from './marqueeTool';
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
export { batchCommands, executeCommand, getRedoLabel, getUndoLabel } from './historyUtils';
export { expandBounds, getSceneBounds, getSelectionBounds, isNodeInBounds } from './boundsUtils';
export { sceneToScreen, sceneToScreenDistance, screenToScene, screenToSceneDistance } from './coordinateUtils';
export {
  filterUnlockedNodes,
  filterVisibleNodes,
  findNodesByKind,
  findNodesByName,
  getCommonAncestor,
  getNodePath,
} from './nodeQueries';
export { snapDimension, snapPosition, snapToGrid, snapToGuides } from './snapUtils';
export {
  getDeepestSelectedAncestor,
  getSelectedBounds,
  getSelectedNodes,
  isAncestorSelected,
} from './selectionQueries';
export { formatSelectionLabel, getSelectionSummary, syncSelectionToStatusBar } from './selectionSync';
export { formatWindowTitle, updateWindowTitle } from './windowTitle';
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
  composeTransform,
  decomposeTransform,
  getLocalPosition,
  getNodeCenter,
  getWorldPosition,
} from './transformUtils';

export type { KeyEventLike } from './commandDispatch';
export type { AlignMode } from './commands/alignNodesCommand';
export type { TransformEntry } from './commands/batchTransformCommand';
export type { DistributeMode } from './commands/distributeNodesCommand';
export type { FlipAxis } from './commands/flipNodeCommand';
export type { EditorState } from './editorState';
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
export type { CoordinatePoint } from './coordinateUtils';
export type { GuideSnapResult, SnapPoint } from './snapUtils';
export type { DecomposedTransform, TransformPoint } from './transformUtils';
export type { WindowTitleOptions } from './windowTitle';
export type { SaveResult } from './fileOperations';
