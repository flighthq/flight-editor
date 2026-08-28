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

  it('changes between two non-null blend modes', () => {
    const node = createNode2D(DisplayObjectKind);
    node.blendMode = BlendMode.Add;

    const cmd = createSetBlendModeCommand(node, BlendMode.Darken);
    cmd.execute();
    expect(node.blendMode).toBe(BlendMode.Darken);

    cmd.undo();
    expect(node.blendMode).toBe(BlendMode.Add);
  });

  it('has the correct label', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetBlendModeCommand(node, BlendMode.Normal);

    expect(cmd.label).toBe('Set Blend Mode');
  });

  it('supports re-execute after undo', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetBlendModeCommand(node, BlendMode.Lighten);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(node.blendMode).toBe(BlendMode.Lighten);
  });

  it('setting same blend mode is a valid identity operation', () => {
    const node = createNode2D(DisplayObjectKind);
    node.blendMode = BlendMode.Normal;
    const cmd = createSetBlendModeCommand(node, BlendMode.Normal);

    cmd.execute();
    expect(node.blendMode).toBe(BlendMode.Normal);

    cmd.undo();
    expect(node.blendMode).toBe(BlendMode.Normal);
  });

  it('multiple undo/redo cycles are stable', () => {
    const node = createNode2D(DisplayObjectKind);
    node.blendMode = BlendMode.Add;
    const cmd = createSetBlendModeCommand(node, BlendMode.Screen);

    for (let i = 0; i < 3; i++) {
      cmd.execute();
      expect(node.blendMode).toBe(BlendMode.Screen);
      cmd.undo();
      expect(node.blendMode).toBe(BlendMode.Add);
    }
  });
});
