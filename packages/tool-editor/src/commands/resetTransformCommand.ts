import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

const IDENTITY_TRANSFORM: Readonly<Transform2DLike> = {
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  pivotX: 0,
  pivotY: 0,
};

export function createResetTransformCommand(node: Node2D): Command {
  const oldTransform = snapshotTransform(node);
  return {
    label: 'Reset Transform',
    execute() {
      setNodeTransform2D(node, IDENTITY_TRANSFORM);
    },
    undo() {
      setNodeTransform2D(node, oldTransform);
    },
  };
}

function snapshotTransform(node: Node2D): Transform2DLike {
  const out = { ...IDENTITY_TRANSFORM };
  getNodeTransform2D(out, node);
  return out;
}
