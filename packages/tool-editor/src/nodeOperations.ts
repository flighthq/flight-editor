import type { Node2D, NodeAny, Transform2DLike } from '@flighthq/types';
import type { AlignMode } from './commands/alignNodesCommand';
import type { DistributeMode } from './commands/distributeNodesCommand';
import type { FlipAxis } from './commands/flipNodeCommand';
import type { EditorState } from './editorState';

import { getSelectedNodes, getSelectionCount } from '@flighthq/editor-selection';
import { createAddNodeCommand } from './commands/addNodeCommand';
import { createAlignNodesCommand } from './commands/alignNodesCommand';
import { createDeleteSelectionCommand } from './commands/deleteSelectionCommand';
import { createDistributeNodesCommand } from './commands/distributeNodesCommand';
import { createDuplicateSelectionCommand } from './commands/duplicateSelectionCommand';
import { createFlipNodeCommand } from './commands/flipNodeCommand';
import { createGroupNodesCommand } from './commands/groupNodesCommand';
import { createRemoveNodeCommand } from './commands/removeNodeCommand';
import { createReparentNodeCommand } from './commands/reparentNodeCommand';
import { createSetNodeNameCommand } from './commands/setNodeNameCommand';
import { createSetTransform2DCommand } from './commands/setTransform2DCommand';
import { createSetVisibleCommand } from './commands/setVisibleCommand';
import { createUngroupNodesCommand } from './commands/ungroupNodesCommand';
import {
  createBringForwardCommand,
  createBringToFrontCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
} from './commands/zOrderCommands';
import { executeCommand } from './historyUtils';

export function addNode(editor: EditorState, parent: NodeAny, child: NodeAny): void {
  executeCommand(editor, createAddNodeCommand(parent, child));
}

export function removeNode(editor: EditorState, node: Node2D): void {
  executeCommand(editor, createRemoveNodeCommand(node));
}

export function deleteSelection(editor: EditorState): boolean {
  if (getSelectionCount(editor.selection) === 0) return false;
  executeCommand(editor, createDeleteSelectionCommand(editor));
  return true;
}

export function duplicateSelection(editor: EditorState): boolean {
  if (getSelectionCount(editor.selection) === 0) return false;
  executeCommand(editor, createDuplicateSelectionCommand(editor));
  return true;
}

export function groupSelection(editor: EditorState, group: Node2D): boolean {
  const nodes = getSelectedNodes(editor.selection) as Node2D[];
  if (nodes.length < 2) return false;
  executeCommand(editor, createGroupNodesCommand(nodes, group));
  return true;
}

export function ungroupNode(editor: EditorState, group: Node2D): void {
  executeCommand(editor, createUngroupNodesCommand(group));
}

export function reparentNode(editor: EditorState, node: Node2D, newParent: Node2D): void {
  executeCommand(editor, createReparentNodeCommand(node, newParent));
}

export function renameNode(editor: EditorState, node: Node2D, name: string): void {
  executeCommand(editor, createSetNodeNameCommand(node, name));
}

export function setNodeTransform(editor: EditorState, node: Node2D, transform: Readonly<Transform2DLike>): void {
  executeCommand(editor, createSetTransform2DCommand(node, transform));
}

export function setNodeVisible(editor: EditorState, node: Node2D, visible: boolean): void {
  executeCommand(editor, createSetVisibleCommand(node, visible));
}

export function flipNodes(editor: EditorState, nodes: readonly Node2D[], axis: FlipAxis): void {
  executeCommand(editor, createFlipNodeCommand(nodes, axis));
}

export function flipSelection(editor: EditorState, axis: FlipAxis): boolean {
  const nodes = getSelectedNodes(editor.selection) as Node2D[];
  if (nodes.length === 0) return false;
  executeCommand(editor, createFlipNodeCommand(nodes, axis));
  return true;
}

export function alignSelection(editor: EditorState, mode: AlignMode): boolean {
  const nodes = getSelectedNodes(editor.selection) as Node2D[];
  if (nodes.length < 2) return false;
  executeCommand(editor, createAlignNodesCommand(nodes, mode));
  return true;
}

export function distributeSelection(editor: EditorState, mode: DistributeMode): boolean {
  const nodes = getSelectedNodes(editor.selection) as Node2D[];
  if (nodes.length < 3) return false;
  executeCommand(editor, createDistributeNodesCommand(nodes, mode));
  return true;
}

export function bringNodeToFront(editor: EditorState, node: NodeAny): void {
  executeCommand(editor, createBringToFrontCommand(node));
}

export function bringNodeForward(editor: EditorState, node: NodeAny): void {
  executeCommand(editor, createBringForwardCommand(node));
}

export function sendNodeBackward(editor: EditorState, node: NodeAny): void {
  executeCommand(editor, createSendBackwardCommand(node));
}

export function sendNodeToBack(editor: EditorState, node: NodeAny): void {
  executeCommand(editor, createSendToBackCommand(node));
}
