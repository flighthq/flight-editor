import type { Node2D } from '@flighthq/types';

import type { EditorState } from './editorState';
import type { AlignMode } from './commands/alignNodesCommand';
import type { DistributeMode } from './commands/distributeNodesCommand';

import { executeCommand } from '@flighthq/editor-command';
import { getSelectedNodes } from '@flighthq/editor-selection';

import { createAlignNodesCommand } from './commands/alignNodesCommand';
import { createDistributeNodesCommand } from './commands/distributeNodesCommand';

export function alignSelection(editor: EditorState, mode: AlignMode): boolean {
  const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
  if (nodes.length < 2) return false;
  const command = createAlignNodesCommand(nodes, mode);
  executeCommand(editor.commandHistory, command);
  return true;
}

export function alignLeft(editor: EditorState): boolean {
  return alignSelection(editor, 'left');
}

export function alignRight(editor: EditorState): boolean {
  return alignSelection(editor, 'right');
}

export function alignTop(editor: EditorState): boolean {
  return alignSelection(editor, 'top');
}

export function alignBottom(editor: EditorState): boolean {
  return alignSelection(editor, 'bottom');
}

export function alignCenterH(editor: EditorState): boolean {
  return alignSelection(editor, 'center-h');
}

export function alignCenterV(editor: EditorState): boolean {
  return alignSelection(editor, 'center-v');
}

export function distributeSelection(editor: EditorState, mode: DistributeMode): boolean {
  const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
  if (nodes.length < 3) return false;
  const command = createDistributeNodesCommand(nodes, mode);
  executeCommand(editor.commandHistory, command);
  return true;
}

export function distributeHorizontal(editor: EditorState): boolean {
  return distributeSelection(editor, 'horizontal');
}

export function distributeVertical(editor: EditorState): boolean {
  return distributeSelection(editor, 'vertical');
}
