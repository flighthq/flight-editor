import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

export function createSetPivotCommand(node: Node2D, pivotX: number, pivotY: number): Command {
  const old: Transform2DLike = {
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
  getNodeTransform2D(old, node);
  const oldPivotX = old.pivotX;
  const oldPivotY = old.pivotY;

  return {
    label: 'Set Pivot',
    execute() {
      const current: Transform2DLike = { ...old };
      getNodeTransform2D(current, node);
      setNodeTransform2D(node, { ...current, pivotX, pivotY });
    },
    undo() {
      const current: Transform2DLike = { ...old };
      getNodeTransform2D(current, node);
      setNodeTransform2D(node, { ...current, pivotX: oldPivotX, pivotY: oldPivotY });
    },
  };
}
