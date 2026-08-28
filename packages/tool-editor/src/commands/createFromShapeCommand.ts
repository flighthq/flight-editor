import type { Command } from '@flighthq/editor-command';
import type { Node2D, ShapeCommandToken } from '@flighthq/types';

import { addNodeChild, removeNodeChild } from '@flighthq/node';
import { createShape } from '@flighthq/shape';

export function createFromShapeCommand(
  parent: Node2D,
  shapeCommands: readonly ShapeCommandToken[],
  name?: string,
): Command {
  const commands = shapeCommands.map((token) => (Array.isArray(token) ? [...token] : token));
  const shape = createShape({ name, data: { commands } });

  return {
    label: 'Create Shape',
    execute() {
      addNodeChild(parent, shape);
    },
    undo() {
      removeNodeChild(parent, shape);
    },
  };
}
