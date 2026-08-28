import type { Command } from '@flighthq/editor-command';
import type { NodeAny } from '@flighthq/types';

import { addNodeChildAt, getNodeChildCount, getNodeChildIndex, getNodeParent, removeNodeChild } from '@flighthq/node';

type TargetIndex = (index: number, childCount: number) => number;

function createZOrderCommand(node: NodeAny, label: string, getTargetIndex: TargetIndex): Command {
  const parent = getNodeParent(node) as NodeAny | null;
  const originalIndex = parent === null ? -1 : getNodeChildIndex(parent, node);
  const childCount = parent === null ? 0 : getNodeChildCount(parent);
  const targetIndex = getTargetIndex(originalIndex, childCount);
  const moves = parent !== null && originalIndex >= 0 && targetIndex !== originalIndex;

  function moveTo(index: number): void {
    if (!moves || parent === null) return;
    removeNodeChild(parent, node);
    addNodeChildAt(parent, node, index);
  }

  return {
    label,
    execute() {
      moveTo(targetIndex);
    },
    undo() {
      moveTo(originalIndex);
    },
  };
}

export function createBringForwardCommand(node: NodeAny): Command {
  return createZOrderCommand(node, 'Bring Forward', (index, childCount) => Math.min(index + 1, childCount - 1));
}

export function createSendBackwardCommand(node: NodeAny): Command {
  return createZOrderCommand(node, 'Send Backward', (index) => Math.max(index - 1, 0));
}

export function createBringToFrontCommand(node: NodeAny): Command {
  return createZOrderCommand(node, 'Bring to Front', (_index, childCount) => childCount - 1);
}

export function createSendToBackCommand(node: NodeAny): Command {
  return createZOrderCommand(node, 'Send to Back', () => 0);
}
