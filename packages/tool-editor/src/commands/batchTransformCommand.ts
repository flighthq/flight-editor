import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

export interface TransformEntry {
  readonly node: Node2D;
  readonly transform: Readonly<Transform2DLike>;
}

function snapshotTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

export function createBatchTransformCommand(entries: readonly TransformEntry[]): Command {
  const snapshots = entries.map(({ node, transform }) => ({
    node,
    oldTransform: snapshotTransform(node),
    newTransform: { ...transform },
  }));

  return {
    label: 'Transform',
    execute() {
      for (const { node, newTransform } of snapshots) {
        setNodeTransform2D(node, newTransform);
      }
    },
    undo() {
      for (const { node, oldTransform } of snapshots) {
        setNodeTransform2D(node, oldTransform);
      }
    },
  };
}
