import type { Command } from '@flighthq/editor-command';
import type { SceneState } from '@flighthq/editor-scene-state';

import { setSceneName } from '@flighthq/editor-scene-state';

export function createSetSceneNameCommand(state: SceneState, name: string): Command {
  const oldName = state.name;

  return {
    label: 'Set Scene Name',
    execute() {
      setSceneName(state, name);
    },
    undo() {
      setSceneName(state, oldName);
    },
  };
}
