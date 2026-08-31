import type { Command } from '@flighthq/editor-command';
import type { BooleanEntry, BooleanState } from './booleanState';

import { createSnapshotCommand } from '@flighthq/editor-command';

export function createBooleanCommand(
  state: BooleanState,
  label: string,
  mutate: (state: BooleanState) => void,
): Command {
  return createSnapshotCommand(
    label,
    {
      capture: (): readonly BooleanEntry[] =>
        Array.from(state.entries.values()).map((entry) => ({
          ...entry,
          operands: entry.operands.map((operand) => ({ ...operand })),
        })),
      restore(entries) {
        state.entries = new Map(
          entries.map((entry) => [
            entry.resultNodeId,
            { ...entry, operands: entry.operands.map((operand) => ({ ...operand })) },
          ]),
        );
        state.version++;
      },
    },
    () => mutate(state),
  );
}
