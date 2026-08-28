import { createScene2D } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetSceneColorCommand } from './setSceneColorCommand';

describe('createSetSceneColorCommand', () => {
  it('sets scene color and restores on undo', () => {
    const scene = createScene2D({ color: 0xff0000ff });
    const cmd = createSetSceneColorCommand(scene, 0x00ff00ff);

    cmd.execute();
    expect(scene.color).toBe(0x00ff00ff);

    cmd.undo();
    expect(scene.color).toBe(0xff0000ff);
  });

  it('sets color from null', () => {
    const scene = createScene2D();
    expect(scene.color).toBeNull();

    const cmd = createSetSceneColorCommand(scene, 0xffffffff);
    cmd.execute();
    expect(scene.color).toBe(0xffffffff);

    cmd.undo();
    expect(scene.color).toBeNull();
  });

  it('clears color to null', () => {
    const scene = createScene2D({ color: 0x000000ff });
    const cmd = createSetSceneColorCommand(scene, null);

    cmd.execute();
    expect(scene.color).toBeNull();

    cmd.undo();
    expect(scene.color).toBe(0x000000ff);
  });

  it('has the correct label', () => {
    const scene = createScene2D();
    const cmd = createSetSceneColorCommand(scene, 0xffffffff);

    expect(cmd.label).toBe('Set Scene Color');
  });

  it('supports re-execute after undo', () => {
    const scene = createScene2D({ color: 0xff0000ff });
    const cmd = createSetSceneColorCommand(scene, 0x0000ffff);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(scene.color).toBe(0x0000ffff);
  });
});
