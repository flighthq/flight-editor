import type { Command } from '@flighthq/editor-command';
import type { EditorState } from '@flighthq/tool-editor';
import type { NodeAny } from '@flighthq/types';

import { isLocked, lockNode, unlockNode } from '@flighthq/editor-lock';
import { getSelectedNodes } from '@flighthq/editor-selection';

interface LockEntry {
  readonly node: NodeAny;
  readonly wasLocked: boolean;
}

export function createLockSelectionCommand(editor: EditorState): Command {
  const entries: LockEntry[] = getSelectedNodes(editor.selection).map((node) => ({
    node,
    wasLocked: isLocked(editor.locks, node),
  }));

  return {
    label: 'Lock Selection',
    execute() {
      for (const { node } of entries) lockNode(editor.locks, node);
    },
    undo() {
      for (const { node, wasLocked } of entries) {
        if (!wasLocked) unlockNode(editor.locks, node);
      }
    },
  };
}
