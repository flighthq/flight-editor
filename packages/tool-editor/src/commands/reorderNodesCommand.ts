import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

import { getNodeChildren, getNodeParent, setNodeChildIndex } from '@flighthq/node';

interface OrderPlan {
  readonly parent: Node2D;
  readonly original: readonly Node2D[];
  readonly target: readonly Node2D[];
}

export function createReorderNodesCommand(nodes: readonly Node2D[], targetIndices: readonly number[]): Command {
  if (nodes.length !== targetIndices.length) throw new RangeError('Each node must have a target index');

  const parentEntries = new Map<Node2D, Array<{ node: Node2D; targetIndex: number }>>();
  for (let i = 0; i < nodes.length; i++) {
    const parent = getNodeParent(nodes[i]) as Node2D | null;
    if (parent === null) continue;
    const entries = parentEntries.get(parent) ?? [];
    entries.push({ node: nodes[i], targetIndex: targetIndices[i] });
    parentEntries.set(parent, entries);
  }

  const plans: OrderPlan[] = [];
  for (const [parent, entries] of parentEntries) {
    const original = getNodeChildren(parent).slice() as Node2D[];
    const target: Array<Node2D | undefined> = Array.from({ length: original.length });
    const selected = new Set(entries.map(({ node }) => node));

    for (const { node, targetIndex } of entries) {
      if (targetIndex < 0 || targetIndex >= original.length) throw new RangeError('Target index is out of bounds');
      if (target[targetIndex] !== undefined) throw new RangeError('Target indices must be unique within a parent');
      target[targetIndex] = node;
    }

    const remaining = original.filter((node) => !selected.has(node));
    let remainingIndex = 0;
    for (let i = 0; i < target.length; i++) target[i] ??= remaining[remainingIndex++];
    plans.push({ parent, original, target: target as Node2D[] });
  }

  function applyOrder(parent: Node2D, order: readonly Node2D[]): void {
    for (let i = 0; i < order.length; i++) setNodeChildIndex(parent, order[i], i);
  }

  return {
    label: 'Reorder Nodes',
    execute() {
      for (const { parent, target } of plans) applyOrder(parent, target);
    },
    undo() {
      for (const { parent, original } of plans) applyOrder(parent, original);
    },
  };
}
