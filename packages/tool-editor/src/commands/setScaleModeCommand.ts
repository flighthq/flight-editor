import type { Command } from '@flighthq/editor-command';
import type { Scene2D, ViewportScaleMode } from '@flighthq/types';

export function createSetScaleModeCommand(scene: Scene2D, scaleMode: ViewportScaleMode): Command {
  const oldScaleMode = scene.scaleMode;
  return {
    label: 'Set Scale Mode',
    execute() {
      scene.scaleMode = scaleMode;
    },
    undo() {
      scene.scaleMode = oldScaleMode;
    },
  };
}
