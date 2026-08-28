import type { Command } from '@flighthq/editor-command';
import type { Adjustment, Node2D } from '@flighthq/types';

import { getNodeColorAdjustments, invalidateNodeAppearance, setNodeColorAdjustments } from '@flighthq/node';

export function createSetColorAdjustmentCommand(node: Node2D, adjustments: readonly Adjustment[]): Command {
  const previous = getNodeColorAdjustments(node);
  const oldAdjustments = previous === null ? null : [...previous];
  const newAdjustments = [...adjustments];
  return {
    label: 'Set Color Adjustments',
    execute() {
      setNodeColorAdjustments(node, newAdjustments);
      invalidateNodeAppearance(node);
    },
    undo() {
      setNodeColorAdjustments(node, oldAdjustments);
      invalidateNodeAppearance(node);
    },
  };
}
