import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { addNodeChildAt, getNodeChildIndex, getNodeChildren, getNodeParent, removeNodeChild } from '@flighthq/node';

interface OriginalPosition {
  node: Node2D;
  parent: Node2D;
  index: number;
}

export function createGroupNodesCommand(nodes: readonly Node2D[], group: Node2D): Command {
  const originals: OriginalPosition[] = [];
  let insertParent: Node2D | null = null;
  let insertIndex = 0;

  for (const node of nodes) {
    const parent = getNodeParent(node) as Node2D | null;
    if (parent === null) continue;
    const index = getNodeChildIndex(parent, node);
    originals.push({ node, parent, index });
  }

  if (originals.length > 0) {
    insertParent = originals[0].parent;
    insertIndex = originals[0].index;
  }

  return {
    label: 'Group',
    execute() {
      if (insertParent === null) return;
      for (const { node, parent } of originals) {
        removeNodeChild(parent, node);
      }
      addNodeChildAt(insertParent, group, insertIndex);
      for (const { node } of originals) {
        addNodeChildAt(group, node, getNodeChildren(group).length);
      }
    },
    undo() {
      if (insertParent === null) return;
      for (const { node } of originals) {
        removeNodeChild(group, node);
      }
      removeNodeChild(insertParent, group);
      for (const { node, parent, index } of originals) {
        addNodeChildAt(parent, node, index);
      }
    },
  };
}
