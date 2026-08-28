import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { addNodeChildAt, getNodeChildIndex, getNodeChildren, getNodeParent, removeNodeChild } from '@flighthq/node';

export function createUngroupNodesCommand(group: Node2D): Command {
  const parent = getNodeParent(group) as Node2D | null;
  const groupIndex = parent !== null ? getNodeChildIndex(parent, group) : -1;
  const children = getNodeChildren(group).slice() as Node2D[];

  return {
    label: 'Ungroup',
    execute() {
      if (parent === null) return;
      for (let i = 0; i < children.length; i++) {
        removeNodeChild(group, children[i]);
        addNodeChildAt(parent, children[i], groupIndex + i);
      }
      removeNodeChild(parent, group);
    },
    undo() {
      if (parent === null) return;
      for (const child of children) {
        removeNodeChild(parent, child);
      }
      addNodeChildAt(parent, group, groupIndex);
      for (let i = 0; i < children.length; i++) {
        addNodeChildAt(group, children[i], i);
      }
    },
  };
}
