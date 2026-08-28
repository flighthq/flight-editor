import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { addNodeChild, addNodeChildAt, getNodeChildIndex, getNodeParent, removeNodeChild } from '@flighthq/node';

interface OriginalPosition {
  readonly node: Node2D;
  readonly parent: Node2D | null;
  readonly index: number;
}

export function createMoveToPageCommand(nodes: readonly Node2D[], targetParent: Node2D): Command {
  const originals: OriginalPosition[] = nodes.map((node) => {
    const parent = getNodeParent(node) as Node2D | null;
    return { node, parent, index: parent === null ? -1 : getNodeChildIndex(parent, node) };
  });

  return {
    label: 'Move to Page',
    execute() {
      for (const { node } of originals) addNodeChild(targetParent, node);
    },
    undo() {
      for (const { node } of originals) removeNodeChild(targetParent, node);

      const attached = originals
        .filter((entry): entry is OriginalPosition & { parent: Node2D } => entry.parent !== null)
        .sort((a, b) => a.index - b.index);
      for (const { node, parent, index } of attached) addNodeChildAt(parent, node, index);
    },
  };
}
