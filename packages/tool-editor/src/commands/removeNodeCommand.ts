import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { addNodeChildAt, getNodeChildIndex, getNodeParent, removeNodeChild } from '@flighthq/node';

export function createRemoveNodeCommand(node: Node2D): Command {
  const parent = getNodeParent(node) as Node2D | null;
  const index = parent !== null ? getNodeChildIndex(parent, node) : -1;

  return {
    label: 'Remove Node',
    execute() {
      if (parent !== null) removeNodeChild(parent, node);
    },
    undo() {
      if (parent !== null) addNodeChildAt(parent, node, index);
    },
  };
}
