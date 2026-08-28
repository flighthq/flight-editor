import { describe, expect, it } from 'vitest';

import {
  createAddFromFactoryCommand,
  createAlignNodesCommand,
  createBringForwardCommand,
  createBringToFrontCommand,
  createCopySelectionCommand,
  createDeleteSelectionCommand,
  createDuplicateSelectionCommand,
  createDistributeNodesCommand,
  createLockSelectionCommand,
  createMarqueeTool,
  createPasteNodesCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
  createSetPivotCommand,
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
});
