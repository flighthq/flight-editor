import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

function snapshotTransform2D(node: Node2D): Transform2DLike {
  const out = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(out, node);
  return out;
}

export function createSetTransform2DCommand(node: Node2D, newTransform: Readonly<Transform2DLike>): Command {
  const oldTransform = snapshotTransform2D(node);
  const snapshot = { ...newTransform };

  return {
    label: 'Set Transform',
    execute() {
      setNodeTransform2D(node, snapshot);
    },
    undo() {
      setNodeTransform2D(node, oldTransform);
    },
  };
}
