import type { Command } from '@flighthq/editor-command';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import { getNodeTransform2D } from '@flighthq/node';

import { createSetTransform2DCommand } from './setTransform2DCommand';

export type AlignMode = 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v';

function snapshotTransform2D(node: Node2D): Transform2DLike {
  const transform = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(transform, node);
  return transform;
}

function alignmentTarget(transforms: readonly Transform2DLike[], mode: AlignMode): number {
  const values = transforms.map((transform) =>
    mode === 'left' || mode === 'right' || mode === 'center-h' ? transform.x : transform.y,
  );

  switch (mode) {
    case 'left':
    case 'top':
      return Math.min(...values);
    case 'right':
    case 'bottom':
      return Math.max(...values);
    case 'center-h':
    case 'center-v':
      return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}

function alignmentLabel(mode: AlignMode): string {
  switch (mode) {
    case 'left':
      return 'Align Left';
    case 'right':
      return 'Align Right';
    case 'top':
      return 'Align Top';
    case 'bottom':
      return 'Align Bottom';
    case 'center-h':
      return 'Align Horizontal Centers';
    case 'center-v':
      return 'Align Vertical Centers';
  }
}

export function createAlignNodesCommand(nodes: readonly Node2D[], mode: AlignMode): Command {
  const transforms = nodes.map(snapshotTransform2D);
  const commands: Command[] = [];

  if (transforms.length > 0) {
    const target = alignmentTarget(transforms, mode);
    const horizontal = mode === 'left' || mode === 'right' || mode === 'center-h';
    for (let i = 0; i < nodes.length; i++) {
      const transform = transforms[i];
      const aligned = horizontal ? { ...transform, x: target } : { ...transform, y: target };
      commands.push(createSetTransform2DCommand(nodes[i], aligned));
    }
  }

  return {
    label: alignmentLabel(mode),
    execute() {
      for (const command of commands) command.execute();
    },
    undo() {
      for (let i = commands.length - 1; i >= 0; i--) commands[i].undo();
    },
  };
}
