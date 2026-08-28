import { createNode2D } from '@flighthq/scene2d';
import { BlendMode, DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetBlendModeCommand } from './setBlendModeCommand';

describe('createSetBlendModeCommand', () => {
  it('sets blend mode and restores on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    expect(node.blendMode).toBeNull();

    const cmd = createSetBlendModeCommand(node, BlendMode.Multiply);
    cmd.execute();
    expect(node.blendMode).toBe(BlendMode.Multiply);

    cmd.undo();
    expect(node.blendMode).toBeNull();
  });

  it('clears blend mode back to null', () => {
    const node = createNode2D(DisplayObjectKind);
    node.blendMode = BlendMode.Screen;

    const cmd = createSetBlendModeCommand(node, null);
    cmd.execute();
    expect(node.blendMode).toBeNull();

    cmd.undo();
    expect(node.blendMode).toBe(BlendMode.Screen);
  });
});
