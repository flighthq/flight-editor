import type { Command } from '@flighthq/editor-command';
import type { Scene2D, ViewportAlign } from '@flighthq/types';

export function createSetSceneAlignCommand(scene: Scene2D, align: ViewportAlign): Command {
  const oldAlign = scene.align;
  return {
    label: 'Set Scene Align',
    execute() {
      scene.align = align;
    },
    undo() {
      scene.align = oldAlign;
    },
  };
}
