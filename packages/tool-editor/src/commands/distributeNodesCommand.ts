import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D } from '@flighthq/node';

import { createSetTransform2DCommand } from './setTransform2DCommand';

export type DistributeMode = 'horizontal' | 'vertical';

interface NodeTransform {
  readonly node: Node2D;
  readonly transform: Transform2DLike;
}

function snapshotTransform2D(node: Node2D): Transform2DLike {
  const transform = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(transform, node);
  return transform;
}

export function createDistributeNodesCommand(nodes: readonly Node2D[], mode: DistributeMode): Command {
  const axis = mode === 'horizontal' ? 'x' : 'y';
  const sorted: NodeTransform[] = nodes
    .map((node) => ({ node, transform: snapshotTransform2D(node) }))
    .sort((left, right) => left.transform[axis] - right.transform[axis]);
  const commands: Command[] = [];

  if (sorted.length >= 3) {
    const first = sorted[0].transform[axis];
    const last = sorted[sorted.length - 1].transform[axis];
    const spacing = (last - first) / (sorted.length - 1);

    for (let i = 1; i < sorted.length - 1; i++) {
      const { node, transform } = sorted[i];
      commands.push(createSetTransform2DCommand(node, { ...transform, [axis]: first + spacing * i }));
    }
  }

  return {
    label: mode === 'horizontal' ? 'Distribute Horizontally' : 'Distribute Vertically',
    execute() {
      for (const command of commands) command.execute();
    },
    undo() {
      for (let i = commands.length - 1; i >= 0; i--) commands[i].undo();
    },
  };
}
