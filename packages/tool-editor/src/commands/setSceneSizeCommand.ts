import type { Command } from '@flighthq/editor-command';
import type { Scene2D } from '@flighthq/types';

export function createSetSceneSizeCommand(scene: Scene2D, width: number, height: number): Command {
  const oldWidth = scene.scene2dWidth;
  const oldHeight = scene.scene2dHeight;

  return {
    label: 'Set Scene Size',
    execute() {
      scene.scene2dWidth = width;
      scene.scene2dHeight = height;
    },
    undo() {
      scene.scene2dWidth = oldWidth;
      scene.scene2dHeight = oldHeight;
    },
  };
}
