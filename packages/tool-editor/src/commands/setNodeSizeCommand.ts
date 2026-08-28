import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D, setNodeHeight, setNodeTransform2D, setNodeWidth } from '@flighthq/node';

export function createSetNodeSizeCommand(node: Node2D, width: number, height: number): Command {
  const oldTransform: Transform2DLike = {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  };
  getNodeTransform2D(oldTransform, node);
  return {
    label: 'Set Node Size',
    execute() {
      setNodeWidth(node, width);
      setNodeHeight(node, height);
    },
    undo() {
      setNodeTransform2D(node, oldTransform);
    },
  };
}
