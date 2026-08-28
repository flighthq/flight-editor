import type { Command } from '@flighthq/editor-command';
import type { BlendMode, Node2D } from '@flighthq/types';

export function createSetBlendModeCommand(node: Node2D, blendMode: BlendMode | null): Command {
  const oldBlendMode = node.blendMode;

  return {
    label: 'Set Blend Mode',
    execute() {
      node.blendMode = blendMode;
    },
    undo() {
      node.blendMode = oldBlendMode;
    },
  };
}
