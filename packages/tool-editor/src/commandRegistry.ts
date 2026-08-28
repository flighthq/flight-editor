import type { Command } from '@flighthq/editor-command';
import type {
  Adjustment,
  BlendMode,
  ClipRegion,
  Node2D,
  NodeAny,
  ShapeCommandToken,
  Transform2DLike,
  ViewportAlign,
  ViewportScaleMode,
} from '@flighthq/types';

import { getSelectedNodes } from '@flighthq/editor-selection';
import { createNode2D, isNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';

import { createAddFromFactoryCommand } from './commands/addFromFactoryCommand';
import { createAddNodeCommand } from './commands/addNodeCommand';
import { createAlignNodesCommand } from './commands/alignNodesCommand';
import { createClearSceneCommand } from './commands/clearSceneCommand';
import { createFromShapeCommand } from './commands/createFromShapeCommand';
import { createDeleteSelectionCommand } from './commands/deleteSelectionCommand';
import { createDistributeNodesCommand } from './commands/distributeNodesCommand';
import { createDuplicateSelectionCommand } from './commands/duplicateSelectionCommand';
import { createFlipNodeCommand } from './commands/flipNodeCommand';
import { createGroupNodesCommand } from './commands/groupNodesCommand';
import { createLockSelectionCommand } from './commands/lockSelectionCommand';
import { createMoveToPageCommand } from './commands/moveToPageCommand';
import { createPasteNodesCommand } from './commands/pasteNodesCommand';
import { createRemoveNodeCommand } from './commands/removeNodeCommand';
import { createReorderNodesCommand } from './commands/reorderNodesCommand';
import { createReparentNodeCommand } from './commands/reparentNodeCommand';
import { createResetTransformCommand } from './commands/resetTransformCommand';
import { createSetAlphaCommand } from './commands/setAlphaCommand';
import { createSetBlendModeCommand } from './commands/setBlendModeCommand';
import { createSetClipCommand } from './commands/setClipCommand';
import { createSetColorAdjustmentCommand } from './commands/setColorAdjustmentCommand';
import { createSetNodeNameCommand } from './commands/setNodeNameCommand';
import { createSetNodeSizeCommand } from './commands/setNodeSizeCommand';
import { createSetPivotCommand } from './commands/setPivotCommand';
import { createSetScaleModeCommand } from './commands/setScaleModeCommand';
import { createSetSceneAlignCommand } from './commands/setSceneAlignCommand';
import { createSetSceneBackgroundColorCommand } from './commands/setSceneBackgroundColorCommand';
import { createSetSceneColorCommand } from './commands/setSceneColorCommand';
import { createSetSceneNameCommand } from './commands/setSceneNameCommand';
import { createSetSceneSizeCommand } from './commands/setSceneSizeCommand';
import { createSetTransform2DCommand } from './commands/setTransform2DCommand';
import { createSetVisibleCommand } from './commands/setVisibleCommand';
import { createUngroupNodesCommand } from './commands/ungroupNodesCommand';
import {
  createBringForwardCommand,
  createBringToFrontCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
} from './commands/zOrderCommands';
import type { EditorState } from './editorState';
import { executeCommand } from './historyUtils';

export type NamedCommandArguments = Readonly<Record<string, unknown>>;
export type NamedCommandFactory = (editor: EditorState, arguments_: NamedCommandArguments) => Command | null;

function isNode(value: unknown): value is Node2D {
  return typeof value === 'object' && value !== null && isNode2D(value as NodeAny);
}

function selectedNodes(editor: Readonly<EditorState>): Node2D[] {
  return getSelectedNodes(editor.selection).filter(isNode2D);
}

function argumentNode(editor: Readonly<EditorState>, arguments_: NamedCommandArguments): Node2D | null {
  if (arguments_.node !== undefined) return isNode(arguments_.node) ? arguments_.node : null;
  return selectedNodes(editor)[0] ?? null;
}

function argumentNodes(editor: Readonly<EditorState>, arguments_: NamedCommandArguments): Node2D[] | null {
  if (arguments_.nodes === undefined) return selectedNodes(editor);
  if (!Array.isArray(arguments_.nodes) || !arguments_.nodes.every(isNode)) return null;
  return arguments_.nodes;
}

function argumentParent(editor: Readonly<EditorState>, arguments_: NamedCommandArguments): Node2D | null {
  if (arguments_.parent !== undefined) return isNode(arguments_.parent) ? arguments_.parent : null;
  return editor.scene?.root ?? null;
}

function nodeCommand(factory: (node: Node2D) => Command): NamedCommandFactory {
  return (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    return node === null ? null : factory(node);
  };
}

function nodesCommand(factory: (nodes: readonly Node2D[]) => Command): NamedCommandFactory {
  return (editor, arguments_) => {
    const nodes = argumentNodes(editor, arguments_);
    return nodes === null || nodes.length === 0 ? null : factory(nodes);
  };
}

const defaultCommandFactories: Readonly<Record<string, NamedCommandFactory>> = {
  alignLeft: nodesCommand((nodes) => createAlignNodesCommand(nodes, 'left')),
  alignRight: nodesCommand((nodes) => createAlignNodesCommand(nodes, 'right')),
  alignTop: nodesCommand((nodes) => createAlignNodesCommand(nodes, 'top')),
  alignBottom: nodesCommand((nodes) => createAlignNodesCommand(nodes, 'bottom')),
  alignHorizontalCenters: nodesCommand((nodes) => createAlignNodesCommand(nodes, 'center-h')),
  alignVerticalCenters: nodesCommand((nodes) => createAlignNodesCommand(nodes, 'center-v')),
  distributeHorizontally: nodesCommand((nodes) => createDistributeNodesCommand(nodes, 'horizontal')),
  distributeVertically: nodesCommand((nodes) => createDistributeNodesCommand(nodes, 'vertical')),
  deleteSelection: (editor) => createDeleteSelectionCommand(editor),
  duplicateSelection: (editor) => createDuplicateSelectionCommand(editor),
  lockSelection: (editor) => createLockSelectionCommand(editor),
  flipHorizontal: nodesCommand((nodes) => createFlipNodeCommand(nodes, 'horizontal')),
  flipVertical: nodesCommand((nodes) => createFlipNodeCommand(nodes, 'vertical')),
  bringForward: nodeCommand(createBringForwardCommand),
  sendBackward: nodeCommand(createSendBackwardCommand),
  bringToFront: nodeCommand(createBringToFrontCommand),
  sendToBack: nodeCommand(createSendToBackCommand),
  resetTransform: nodeCommand(createResetTransformCommand),
  removeNode: nodeCommand(createRemoveNodeCommand),
  ungroup: nodeCommand(createUngroupNodesCommand),
  setNodeName: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    const name = arguments_.name;
    return node === null || (typeof name !== 'string' && name !== null) ? null : createSetNodeNameCommand(node, name);
  },
  setNodeSize: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    const { width, height } = arguments_;
    return node === null || typeof width !== 'number' || typeof height !== 'number'
      ? null
      : createSetNodeSizeCommand(node, width, height);
  },
  setPivot: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    const { pivotX, pivotY } = arguments_;
    return node === null || typeof pivotX !== 'number' || typeof pivotY !== 'number'
      ? null
      : createSetPivotCommand(node, pivotX, pivotY);
  },
  setAlpha: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    return node === null || typeof arguments_.alpha !== 'number' ? null : createSetAlphaCommand(node, arguments_.alpha);
  },
  setVisible: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    return node === null || typeof arguments_.visible !== 'boolean'
      ? null
      : createSetVisibleCommand(node, arguments_.visible);
  },
  setBlendMode: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    const blendMode = arguments_.blendMode;
    return node === null || (typeof blendMode !== 'string' && blendMode !== null)
      ? null
      : createSetBlendModeCommand(node, blendMode as BlendMode | null);
  },
  setClip: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    const clip = arguments_.clip;
    return node === null || (clip !== null && (typeof clip !== 'object' || Array.isArray(clip)))
      ? null
      : createSetClipCommand(node, clip as Readonly<ClipRegion> | null);
  },
  setColorAdjustments: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    return node === null || !Array.isArray(arguments_.adjustments)
      ? null
      : createSetColorAdjustmentCommand(node, arguments_.adjustments as Adjustment[]);
  },
  setTransform2D: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    const transform = arguments_.transform;
    return node === null || transform === null || typeof transform !== 'object' || Array.isArray(transform)
      ? null
      : createSetTransform2DCommand(node, transform as Readonly<Transform2DLike>);
  },
  clearScene: (editor) => (editor.scene === null ? null : createClearSceneCommand(editor.scene.root)),
  setSceneAlign: (editor, arguments_) =>
    editor.scene === null || typeof arguments_.align !== 'string'
      ? null
      : createSetSceneAlignCommand(editor.scene, arguments_.align as ViewportAlign),
  setScaleMode: (editor, arguments_) =>
    editor.scene === null || typeof arguments_.scaleMode !== 'string'
      ? null
      : createSetScaleModeCommand(editor.scene, arguments_.scaleMode as ViewportScaleMode),
  setSceneColor: (editor, arguments_) => {
    const color = arguments_.color;
    return editor.scene === null || (color !== null && typeof color !== 'number')
      ? null
      : createSetSceneColorCommand(editor.scene, color);
  },
  setSceneBackgroundColor: (editor, arguments_) =>
    editor.scene === null || typeof arguments_.color !== 'number'
      ? null
      : createSetSceneBackgroundColorCommand(editor.scene, arguments_.color),
  setSceneSize: (editor, arguments_) => {
    const { width, height } = arguments_;
    return editor.scene === null || typeof width !== 'number' || typeof height !== 'number'
      ? null
      : createSetSceneSizeCommand(editor.scene, width, height);
  },
  setSceneName: (editor, arguments_) =>
    typeof arguments_.name !== 'string' ? null : createSetSceneNameCommand(editor.sceneState, arguments_.name),
  addNode: (editor, arguments_) => {
    const parent = argumentParent(editor, arguments_);
    return parent === null || !isNode(arguments_.child) ? null : createAddNodeCommand(parent, arguments_.child);
  },
  addFromFactory: (editor, arguments_) => {
    const parent = argumentParent(editor, arguments_);
    return parent === null || typeof arguments_.kindId !== 'string'
      ? null
      : createAddFromFactoryCommand(editor, arguments_.kindId, parent);
  },
  paste: (editor, arguments_) => {
    const parent = argumentParent(editor, arguments_);
    return parent === null ? null : createPasteNodesCommand(editor, parent);
  },
  reparentNode: (editor, arguments_) => {
    const node = argumentNode(editor, arguments_);
    return node === null || !isNode(arguments_.newParent)
      ? null
      : createReparentNodeCommand(node, arguments_.newParent);
  },
  moveToPage: (editor, arguments_) => {
    const nodes = argumentNodes(editor, arguments_);
    return nodes === null || nodes.length === 0 || !isNode(arguments_.targetParent)
      ? null
      : createMoveToPageCommand(nodes, arguments_.targetParent);
  },
  reorderNodes: (editor, arguments_) => {
    const nodes = argumentNodes(editor, arguments_);
    const targetIndices = arguments_.targetIndices;
    return nodes === null || !Array.isArray(targetIndices) || !targetIndices.every((index) => typeof index === 'number')
      ? null
      : createReorderNodesCommand(nodes, targetIndices as number[]);
  },
  groupNodes: (editor, arguments_) => {
    const nodes = argumentNodes(editor, arguments_);
    if (nodes === null || nodes.length === 0) return null;
    const group =
      arguments_.group === undefined ? createNode2D(DisplayObjectKind, { name: 'Group' }) : arguments_.group;
    return isNode(group) ? createGroupNodesCommand(nodes, group) : null;
  },
  createFromShape: (editor, arguments_) => {
    const parent = argumentParent(editor, arguments_);
    const shapeCommands = arguments_.shapeCommands;
    const name = arguments_.name;
    return parent === null || !Array.isArray(shapeCommands) || (name !== undefined && typeof name !== 'string')
      ? null
      : createFromShapeCommand(parent, shapeCommands as ShapeCommandToken[], name);
  },
};

export function registerDefaultCommands(editor: EditorState): void {
  for (const [name, factory] of Object.entries(defaultCommandFactories)) editor.commandRegistry.set(name, factory);
}

export function executeNamedCommand(
  editor: EditorState,
  name: string,
  arguments_: NamedCommandArguments = {},
): boolean {
  const command = editor.commandRegistry.get(name)?.(editor, arguments_) ?? null;
  if (command === null) return false;
  executeCommand(editor, command);
  return true;
}
