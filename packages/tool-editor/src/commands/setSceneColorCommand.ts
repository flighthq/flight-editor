import type { Command } from '@flighthq/editor-command';
import type { Scene2D } from '@flighthq/types';

export function createSetSceneColorCommand(scene: Scene2D, color: number | null): Command {
  const oldColor = scene.color;

  return {
    label: 'Set Scene Color',
    execute() {
      scene.color = color;
    },
    undo() {
      scene.color = oldColor;
    },
  };
}
