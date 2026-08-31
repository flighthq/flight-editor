import type { Command } from '@flighthq/editor-command';
import type { AnimationState, Keyframe } from './animationState';

import { createSnapshotCommand } from '@flighthq/editor-command';

interface AnimationSnapshot {
  readonly keyframes: readonly Keyframe[];
  readonly duration: number;
  readonly looping: boolean;
}

export function createAnimationCommand(
  state: AnimationState,
  label: string,
  mutate: (state: AnimationState) => void,
): Command {
  return createSnapshotCommand(
    label,
    {
      capture: (): AnimationSnapshot => ({
        keyframes: Array.from(state.keyframes.values()).map((keyframe) => ({ ...keyframe })),
        duration: state.duration,
        looping: state.looping,
      }),
      restore(snapshot) {
        state.keyframes = new Map(snapshot.keyframes.map((keyframe) => [keyframe.id, { ...keyframe }]));
        state.duration = snapshot.duration;
        state.looping = snapshot.looping;
        state.playheadTime = Math.min(state.playheadTime, state.duration);
        state.version++;
      },
    },
    () => mutate(state),
  );
}
