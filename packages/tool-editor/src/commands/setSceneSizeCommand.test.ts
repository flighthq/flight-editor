import { createScene2D } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetSceneSizeCommand } from './setSceneSizeCommand';

describe('createSetSceneSizeCommand', () => {
  it('sets scene dimensions and restores on undo', () => {
    const scene = createScene2D({ scene2dWidth: 800, scene2dHeight: 600 });
    expect(scene.scene2dWidth).toBe(800);
    expect(scene.scene2dHeight).toBe(600);

    const cmd = createSetSceneSizeCommand(scene, 1920, 1080);
    cmd.execute();
    expect(scene.scene2dWidth).toBe(1920);
    expect(scene.scene2dHeight).toBe(1080);

    cmd.undo();
    expect(scene.scene2dWidth).toBe(800);
    expect(scene.scene2dHeight).toBe(600);
  });

  it('handles non-standard dimensions', () => {
    const scene = createScene2D({ scene2dWidth: 400, scene2dHeight: 300 });
    const cmd = createSetSceneSizeCommand(scene, 100, 100);
    cmd.execute();
    expect(scene.scene2dWidth).toBe(100);
    expect(scene.scene2dHeight).toBe(100);
  });

  it('has the correct label', () => {
    const scene = createScene2D({ scene2dWidth: 800, scene2dHeight: 600 });
    const cmd = createSetSceneSizeCommand(scene, 1920, 1080);

    expect(cmd.label).toBe('Set Scene Size');
  });

  it('supports re-execute after undo', () => {
    const scene = createScene2D({ scene2dWidth: 800, scene2dHeight: 600 });
    const cmd = createSetSceneSizeCommand(scene, 1920, 1080);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(scene.scene2dWidth).toBe(1920);
    expect(scene.scene2dHeight).toBe(1080);
  });

  it('identity operation preserves dimensions', () => {
    const scene = createScene2D({ scene2dWidth: 800, scene2dHeight: 600 });
    const cmd = createSetSceneSizeCommand(scene, 800, 600);

    cmd.execute();
    expect(scene.scene2dWidth).toBe(800);
    expect(scene.scene2dHeight).toBe(600);

    cmd.undo();
    expect(scene.scene2dWidth).toBe(800);
    expect(scene.scene2dHeight).toBe(600);
  });

  it('changes only width when height stays the same', () => {
    const scene = createScene2D({ scene2dWidth: 800, scene2dHeight: 600 });
    const cmd = createSetSceneSizeCommand(scene, 1024, 600);

    cmd.execute();
    expect(scene.scene2dWidth).toBe(1024);
    expect(scene.scene2dHeight).toBe(600);
  });
});
