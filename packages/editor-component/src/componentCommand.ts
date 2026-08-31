import type { Command } from '@flighthq/editor-command';
import type { ComponentDefinition, ComponentInstance, ComponentState } from './componentState';

import { createSnapshotCommand } from '@flighthq/editor-command';

interface ComponentSnapshot {
  readonly definitions: readonly ComponentDefinition[];
  readonly instances: readonly ComponentInstance[];
}

export function createComponentCommand(
  state: ComponentState,
  label: string,
  mutate: (state: ComponentState) => void,
): Command {
  return createSnapshotCommand(
    label,
    {
      capture: (): ComponentSnapshot => ({
        definitions: Array.from(state.definitions.values()).map((definition) => ({
          ...definition,
          nestedDefinitionIds: definition.nestedDefinitionIds?.slice(),
        })),
        instances: Array.from(state.instances.values()).map((instance) => ({
          ...instance,
          overrides: instance.overrides.map((override) => ({ ...override })),
        })),
      }),
      restore(snapshot) {
        state.definitions = new Map(snapshot.definitions.map((definition) => [definition.id, { ...definition }]));
        state.instances = new Map(
          snapshot.instances.map((instance) => [
            instance.instanceId,
            { ...instance, overrides: instance.overrides.map((override) => ({ ...override })) },
          ]),
        );
        state.version++;
      },
    },
    () => mutate(state),
  );
}
