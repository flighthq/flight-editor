import type { Command } from '@flighthq/editor-command';
import type { PrototypeFlow, PrototypeInteraction, PrototypeState } from './prototypeState';

import { createSnapshotCommand } from '@flighthq/editor-command';

interface PrototypeSnapshot {
  readonly flows: readonly PrototypeFlow[];
  readonly interactions: readonly PrototypeInteraction[];
}

export function createPrototypeCommand(
  state: PrototypeState,
  label: string,
  mutate: (state: PrototypeState) => void,
): Command {
  return createSnapshotCommand(
    label,
    {
      capture: (): PrototypeSnapshot => ({
        flows: Array.from(state.flows.values()).map((flow) => ({ ...flow })),
        interactions: Array.from(state.interactions.values()).map((interaction) => ({ ...interaction })),
      }),
      restore(snapshot) {
        state.flows = new Map(snapshot.flows.map((flow) => [flow.id, { ...flow }]));
        state.interactions = new Map(snapshot.interactions.map((interaction) => [interaction.id, { ...interaction }]));
        state.version++;
      },
    },
    () => mutate(state),
  );
}
