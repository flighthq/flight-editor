import { createScene2D } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetSceneBackgroundColorCommand } from './setSceneBackgroundColorCommand';

describe('createSetSceneBackgroundColorCommand', () => {
  it('sets the scene color', () => {
    const scene = createScene2D({ color: 0x000000ff });

    createSetSceneBackgroundColorCommand(scene, 0x123456ff).execute();

    expect(scene.color).toBe(0x123456ff);
  });

  it('restores the original color on undo', () => {
    const scene = createScene2D({ color: 0x010203ff });
    const command = createSetSceneBackgroundColorCommand(scene, 0xaabbccff);

    command.execute();
    command.undo();

    expect(scene.color).toBe(0x010203ff);
  });

  it('restores a null original background', () => {
    const scene = createScene2D({ color: null });
    const command = createSetSceneBackgroundColorCommand(scene, 0xffffffff);

    command.execute();
    command.undo();

    expect(scene.color).toBeNull();
  });

  it('normalizes the new color to an unsigned packed value', () => {
    const scene = createScene2D();

    createSetSceneBackgroundColorCommand(scene, -1).execute();

    expect(scene.color).toBe(0xffffffff);
  });

  it('captures the original color when the command is created', () => {
    const scene = createScene2D({ color: 0x111111ff });
    const command = createSetSceneBackgroundColorCommand(scene, 0x222222ff);
    scene.color = 0x333333ff;

    command.execute();
    command.undo();

    expect(scene.color).toBe(0x111111ff);
  });

  it('supports re-execute after undo', () => {
    const scene = createScene2D({ color: 0xaabbccff });
    const command = createSetSceneBackgroundColorCommand(scene, 0xddeeffff);

    command.execute();
    command.undo();
    command.execute();

    expect(scene.color).toBe(0xddeeffff);
  });

  it('multiple undo/redo cycles are stable', () => {
    const scene = createScene2D({ color: 0x112233ff });
    const command = createSetSceneBackgroundColorCommand(scene, 0x445566ff);

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(scene.color).toBe(0x445566ff);
      command.undo();
      expect(scene.color).toBe(0x112233ff);
    }
  });
});
