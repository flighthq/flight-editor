import { describe, expect, it } from 'vitest';

import {
  createAddFromFactoryCommand,
  createAlignNodesCommand,
  createBringForwardCommand,
  createBringToFrontCommand,
  createCopySelectionCommand,
  createDeleteSelectionCommand,
  createDuplicateSelectionCommand,
  createFlipNodeCommand,
  createDistributeNodesCommand,
  createLockSelectionCommand,
  createMoveToPageCommand,
  createMarqueeTool,
  createPasteNodesCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
  createSetPivotCommand,
  createSetClipCommand,
  createSetColorAdjustmentCommand,
  createSetNodeSizeCommand,
  createSetScaleModeCommand,
  createSetSceneAlignCommand,
  createSetSceneBackgroundColorCommand,
  createSetSceneNameCommand,
  decomposeTransform,
  executeCommand,
  expandBounds,
  findNodesByName,
  snapToGrid,
  screenToScene,
  getSelectedNodes,
  registerDefaultNodeKinds,
  createResetTransformCommand,
  createReorderNodesCommand,
  createFromShapeCommand,
  createEyedropperTool,
  createMeasureTool,
  createLineTool,
  createRectangleTool,
  createEditorLayoutDef,
  getLayoutRegion,
  getLayoutRegions,
  findNodes,
  findFirstNode,
  countMatchingNodes,
  createLayoutScene,
  getLayoutNode,
  getLayoutChildNode,
  getLayoutNodeNames,
  resizeLayout,
  createDarkTheme,
  createLightTheme,
  getThemeColor,
  mergeTheme,
  getDefaultPreferences,
  serializePreferences,
  deserializePreferences,
  applyPreferences,
  capturePreferences,
  mergePreferences,
  createPanelRegistry,
  registerPanel,
  unregisterPanel,
  getPanel,
  getPanelsByRegion,
  getPanelCount,
  getAllPanelIds,
  registerDefaultPanels,
  formatShortcut,
  parseShortcutString,
  shortcutMatchesEvent,
  createEditorApplication,
  getApplicationEditorState,
  getApplicationLayout,
  getApplicationTheme,
  cloneNode,
  deepCloneNode,
  cloneNodeWithOffset,
  cloneNodes,
  executeNamedCommand,
  deserializeScene,
  getSerializerFormats,
  serializeScene,
  registerDefaultCommands,
  registerDefaultTools,
} from './index';

describe('tool-editor', () => {
  it('exports editor command creators', () => {
    expect(createAddFromFactoryCommand).toBeTypeOf('function');
    expect(createAlignNodesCommand).toBeTypeOf('function');
    expect(createBringForwardCommand).toBeTypeOf('function');
    expect(createBringToFrontCommand).toBeTypeOf('function');
    expect(createCopySelectionCommand).toBeTypeOf('function');
    expect(createDeleteSelectionCommand).toBeTypeOf('function');
    expect(createDuplicateSelectionCommand).toBeTypeOf('function');
    expect(createDistributeNodesCommand).toBeTypeOf('function');
    expect(createLockSelectionCommand).toBeTypeOf('function');
    expect(createMarqueeTool).toBeTypeOf('function');
    expect(createPasteNodesCommand).toBeTypeOf('function');
    expect(createSendBackwardCommand).toBeTypeOf('function');
    expect(createSendToBackCommand).toBeTypeOf('function');
    expect(createSetPivotCommand).toBeTypeOf('function');
    expect(createSetSceneBackgroundColorCommand).toBeTypeOf('function');
    expect(createSetSceneNameCommand).toBeTypeOf('function');
    expect(createSetSceneAlignCommand).toBeTypeOf('function');
    expect(createSetScaleModeCommand).toBeTypeOf('function');
    expect(createSetClipCommand).toBeTypeOf('function');
    expect(createFlipNodeCommand).toBeTypeOf('function');
    expect(createSetColorAdjustmentCommand).toBeTypeOf('function');
    expect(createResetTransformCommand).toBeTypeOf('function');
    expect(createSetNodeSizeCommand).toBeTypeOf('function');
    expect(createMoveToPageCommand).toBeTypeOf('function');
    expect(createFromShapeCommand).toBeTypeOf('function');
    expect(createReorderNodesCommand).toBeTypeOf('function');
    expect(createEyedropperTool).toBeTypeOf('function');
    expect(createMeasureTool).toBeTypeOf('function');
    expect(createLineTool).toBeTypeOf('function');
    expect(createRectangleTool).toBeTypeOf('function');
    expect(executeNamedCommand).toBeTypeOf('function');
    expect(registerDefaultCommands).toBeTypeOf('function');
    expect(registerDefaultTools).toBeTypeOf('function');
  });

  it('exports coordinate, node-query, and bounds utilities', () => {
    expect(screenToScene).toBeTypeOf('function');
    expect(findNodesByName).toBeTypeOf('function');
    expect(expandBounds).toBeTypeOf('function');
  });

  it('exports transform and snap utilities', () => {
    expect(decomposeTransform).toBeTypeOf('function');
    expect(snapToGrid).toBeTypeOf('function');
  });

  it('exports selection, history, and node-factory helpers', () => {
    expect(getSelectedNodes).toBeTypeOf('function');
    expect(executeCommand).toBeTypeOf('function');
    expect(registerDefaultNodeKinds).toBeTypeOf('function');
  });

  it('exports scene serialization helpers', () => {
    expect(deserializeScene).toBeTypeOf('function');
    expect(getSerializerFormats).toBeTypeOf('function');
    expect(serializeScene).toBeTypeOf('function');
  });

  it('exports layout utilities', () => {
    expect(createEditorLayoutDef).toBeTypeOf('function');
    expect(getLayoutRegion).toBeTypeOf('function');
    expect(getLayoutRegions).toBeTypeOf('function');
  });

  it('exports scene search utilities', () => {
    expect(findNodes).toBeTypeOf('function');
    expect(findFirstNode).toBeTypeOf('function');
    expect(countMatchingNodes).toBeTypeOf('function');
  });

  it('exports layout renderer utilities', () => {
    expect(createLayoutScene).toBeTypeOf('function');
    expect(getLayoutNode).toBeTypeOf('function');
    expect(getLayoutChildNode).toBeTypeOf('function');
    expect(getLayoutNodeNames).toBeTypeOf('function');
    expect(resizeLayout).toBeTypeOf('function');
  });

  it('exports theme utilities', () => {
    expect(createDarkTheme).toBeTypeOf('function');
    expect(createLightTheme).toBeTypeOf('function');
    expect(getThemeColor).toBeTypeOf('function');
    expect(mergeTheme).toBeTypeOf('function');
  });

  it('exports preferences utilities', () => {
    expect(getDefaultPreferences).toBeTypeOf('function');
    expect(serializePreferences).toBeTypeOf('function');
    expect(deserializePreferences).toBeTypeOf('function');
    expect(applyPreferences).toBeTypeOf('function');
    expect(capturePreferences).toBeTypeOf('function');
    expect(mergePreferences).toBeTypeOf('function');
  });

  it('exports panel definition utilities', () => {
    expect(createPanelRegistry).toBeTypeOf('function');
    expect(registerPanel).toBeTypeOf('function');
    expect(unregisterPanel).toBeTypeOf('function');
    expect(getPanel).toBeTypeOf('function');
    expect(getPanelsByRegion).toBeTypeOf('function');
    expect(getPanelCount).toBeTypeOf('function');
    expect(getAllPanelIds).toBeTypeOf('function');
    expect(registerDefaultPanels).toBeTypeOf('function');
  });

  it('exports shortcut display utilities', () => {
    expect(formatShortcut).toBeTypeOf('function');
    expect(parseShortcutString).toBeTypeOf('function');
    expect(shortcutMatchesEvent).toBeTypeOf('function');
  });

  it('exports editor application utilities', () => {
    expect(createEditorApplication).toBeTypeOf('function');
    expect(getApplicationEditorState).toBeTypeOf('function');
    expect(getApplicationLayout).toBeTypeOf('function');
    expect(getApplicationTheme).toBeTypeOf('function');
  });

  it('exports node clone utilities', () => {
    expect(cloneNode).toBeTypeOf('function');
    expect(deepCloneNode).toBeTypeOf('function');
    expect(cloneNodeWithOffset).toBeTypeOf('function');
    expect(cloneNodes).toBeTypeOf('function');
  });
});
