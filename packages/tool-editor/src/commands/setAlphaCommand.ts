import { invalidateNodeAppearance } from '@flighthq/node';

import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

export function createSetAlphaCommand(node: Node2D, alpha: number): Command {
  const oldAlpha = node.alpha;

  return {
    label: 'Set Alpha',
    execute() {
      node.alpha = alpha;
      invalidateNodeAppearance(node);
    },
    undo() {
      node.alpha = oldAlpha;
      invalidateNodeAppearance(node);
    },
  };
}
