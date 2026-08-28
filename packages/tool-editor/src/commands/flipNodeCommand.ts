import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

export type FlipAxis = 'horizontal' | 'vertical';

export function createFlipNodeCommand(nodes: readonly Node2D[], axis: FlipAxis): Command {
  const entries = nodes.map((node) => {
    const oldTransform = snapshotTransform(node);
    const newTransform = { ...oldTransform };
    if (axis === 'horizontal') newTransform.scaleX = -newTransform.scaleX;
    else newTransform.scaleY = -newTransform.scaleY;
    return { node, oldTransform, newTransform };
  });

  return {
    label: axis === 'horizontal' ? 'Flip Horizontally' : 'Flip Vertically',
    execute() {
      for (const entry of entries) setNodeTransform2D(entry.node, entry.newTransform);
    },
    undo() {
      for (const entry of entries) setNodeTransform2D(entry.node, entry.oldTransform);
    },
  };
}

function snapshotTransform(node: Node2D): Transform2DLike {
  const out = { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, pivotX: 0, pivotY: 0 };
  getNodeTransform2D(out, node);
  return out;
}
