import { invalidateNodeAppearance } from '@flighthq/node';

import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

export function createSetVisibleCommand(node: Node2D, visible: boolean): Command {
  const oldVisible = node.visible;

  return {
    label: 'Set Visible',
    execute() {
      node.visible = visible;
      invalidateNodeAppearance(node);
    },
    undo() {
      node.visible = oldVisible;
      invalidateNodeAppearance(node);
    },
  };
}
