import type { Command } from '@flighthq/editor-command';
import type { ClipRegion, Node2D } from '@flighthq/types';

import { cloneClipRegion } from '@flighthq/clip';
import { setNode2DClip } from '@flighthq/scene2d';

export function createSetClipCommand(node: Node2D, clip: Readonly<ClipRegion> | null): Command {
  const oldClip = node.clip === null ? null : cloneClipRegion(node.clip);
  const newClip = clip === null ? null : cloneClipRegion(clip);
  return {
    label: 'Set Clip',
    execute() {
      setNode2DClip(node, newClip);
    },
    undo() {
      setNode2DClip(node, oldClip);
    },
  };
}
