import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { addNodeChild, addNodeChildAt, getNodeChildIndex, getNodeParent, removeNodeChild } from '@flighthq/node';

export function createReparentNodeCommand(node: Node2D, newParent: Node2D): Command {
  const oldParent = getNodeParent(node) as Node2D | null;
  const oldIndex = oldParent !== null ? getNodeChildIndex(oldParent, node) : -1;

  return {
    label: 'Reparent Node',
    execute() {
      if (oldParent !== null) removeNodeChild(oldParent, node);
      addNodeChild(newParent, node);
    },
    undo() {
      removeNodeChild(newParent, node);
      if (oldParent !== null) addNodeChildAt(oldParent, node, oldIndex);
    },
  };
}
