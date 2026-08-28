import { createScene2D } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetScaleModeCommand } from './setScaleModeCommand';

describe('createSetScaleModeCommand', () => {
  it('sets and restores every supported viewport scale mode', () => {
    for (const mode of ['exactfit', 'noborder', 'noscale', 'showall'] as const) {
      const scene = createScene2D({ scaleMode: 'noscale' });
      const command = createSetScaleModeCommand(scene, mode);
      command.execute();
      expect(scene.scaleMode).toBe(mode);
      command.undo();
      expect(scene.scaleMode).toBe('noscale');
      expect(command.label).toBe('Set Scale Mode');
    }
  });
});
