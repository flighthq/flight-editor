import type { Command } from '@flighthq/editor-command';
import type { Scene2D } from '@flighthq/types';

export function createSetSceneBackgroundColorCommand(scene: Scene2D, color: number): Command {
  const oldColor = scene.color;
  const newColor = color >>> 0;

  return {
    label: 'Set Scene Background Color',
    execute() {
      scene.color = newColor;
    },
    undo() {
      scene.color = oldColor;
    },
  };
}
