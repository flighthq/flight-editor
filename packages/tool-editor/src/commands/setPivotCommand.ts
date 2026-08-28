import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D } from '@flighthq/node';

import { createSetTransform2DCommand } from './setTransform2DCommand';

function snapshotTransform2D(node: Node2D): Transform2DLike {
  const transform = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(transform, node);
  return transform;
}

export function createSetPivotCommand(node: Node2D, pivotX: number, pivotY: number): Command {
  const transform = snapshotTransform2D(node);
  const command = createSetTransform2DCommand(node, { ...transform, pivotX, pivotY });

  return {
    label: 'Set Pivot',
    execute: command.execute,
    undo: command.undo,
  };
}
