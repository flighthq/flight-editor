import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { getNodeHeight, getNodeWidth, setNodeHeight, setNodeWidth } from '@flighthq/node';

export function createSetNodeSizeCommand(node: Node2D, width: number, height: number): Command {
  const oldWidth = getNodeWidth(node);
  const oldHeight = getNodeHeight(node);
  return {
    label: 'Set Node Size',
    execute() {
      setNodeWidth(node, width);
      setNodeHeight(node, height);
    },
    undo() {
      setNodeWidth(node, oldWidth);
      setNodeHeight(node, oldHeight);
    },
  };
}
