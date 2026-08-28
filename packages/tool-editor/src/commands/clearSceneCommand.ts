import { addNodeChildAt, getNodeChildAt, getNodeChildCount, removeNodeChildren } from '@flighthq/node';

import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

export function createClearSceneCommand(root: Node2D): Command {
  let snapshot: Node2D[] = [];

  return {
    label: 'Clear Scene',
    execute() {
      const count = getNodeChildCount(root);
      snapshot = [];
      for (let i = 0; i < count; i++) {
        snapshot.push(getNodeChildAt(root, i) as Node2D);
      }
      removeNodeChildren(root);
    },
    undo() {
      for (let i = 0; i < snapshot.length; i++) {
        addNodeChildAt(root, snapshot[i], i);
      }
    },
  };
}
