import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { addNodeChild, removeNodeChild } from '@flighthq/node';

export function createAddNodeCommand(parent: Node2D, child: Node2D): Command {
  return {
    label: 'Add Node',
    execute() {
      addNodeChild(parent, child);
    },
    undo() {
      removeNodeChild(parent, child);
    },
  };
}
