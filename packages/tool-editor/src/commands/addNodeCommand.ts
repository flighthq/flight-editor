import type { Command } from '@flighthq/editor-command';
import type { NodeAny } from '@flighthq/types';

import { addNodeChild, removeNodeChild } from '@flighthq/node';

export function createAddNodeCommand(parent: NodeAny, child: NodeAny): Command {
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
