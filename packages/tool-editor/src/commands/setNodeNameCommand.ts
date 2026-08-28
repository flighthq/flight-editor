import type { Command } from '@flighthq/editor-command';
import type { Node2D } from '@flighthq/types';

export function createSetNodeNameCommand(node: Node2D, newName: string | null): Command {
  const oldName = node.name;

  return {
    label: 'Rename Node',
    execute() {
      node.name = newName;
    },
    undo() {
      node.name = oldName;
    },
  };
}
