import { createScene2D } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetSceneAlignCommand } from './setSceneAlignCommand';

describe('createSetSceneAlignCommand', () => {
  it('sets and restores every supported viewport alignment', () => {
    const alignments = ['bottom', 'bottomleft', 'bottomright', 'left', 'right', 'top', 'topleft', 'topright'] as const;
    for (const align of alignments) {
      const scene = createScene2D({ align: 'topleft' });
      const command = createSetSceneAlignCommand(scene, align);
      command.execute();
      expect(scene.align).toBe(align);
      command.undo();
      expect(scene.align).toBe('topleft');
      expect(command.label).toBe('Set Scene Align');
    }
  });
});
