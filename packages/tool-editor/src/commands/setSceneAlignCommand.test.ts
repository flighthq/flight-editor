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

  it('multiple undo/redo cycles are stable', () => {
    const scene = createScene2D({ align: 'topleft' });
    const command = createSetSceneAlignCommand(scene, 'bottomright');

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(scene.align).toBe('bottomright');
      command.undo();
      expect(scene.align).toBe('topleft');
    }
  });

  it('same alignment is a valid identity operation', () => {
    const scene = createScene2D({ align: 'top' });
    const command = createSetSceneAlignCommand(scene, 'top');
    command.execute();
    expect(scene.align).toBe('top');
    command.undo();
    expect(scene.align).toBe('top');
  });

  it('captures the original alignment when the command is created', () => {
    const scene = createScene2D({ align: 'left' });
    const command = createSetSceneAlignCommand(scene, 'bottomright');
    scene.align = 'top';

    command.execute();
    expect(scene.align).toBe('bottomright');
    command.undo();
    expect(scene.align).toBe('left');
  });

  it('does not change alignment before execution', () => {
    const scene = createScene2D({ align: 'topright' });

    createSetSceneAlignCommand(scene, 'bottomleft');

    expect(scene.align).toBe('topright');
  });
});
