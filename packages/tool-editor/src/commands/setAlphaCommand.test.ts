import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetAlphaCommand } from './setAlphaCommand';

describe('createSetAlphaCommand', () => {
  it('sets alpha and restores on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    expect(node.alpha).toBe(1);

    const cmd = createSetAlphaCommand(node, 0.5);
    cmd.execute();
    expect(node.alpha).toBe(0.5);

    cmd.undo();
    expect(node.alpha).toBe(1);
  });

  it('handles zero alpha', () => {
    const node = createNode2D(DisplayObjectKind);

    const cmd = createSetAlphaCommand(node, 0);
    cmd.execute();
    expect(node.alpha).toBe(0);

    cmd.undo();
    expect(node.alpha).toBe(1);
  });

  it('restores a non-default alpha on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    node.alpha = 0.3;

    const cmd = createSetAlphaCommand(node, 0.8);
    cmd.execute();
    expect(node.alpha).toBe(0.8);

    cmd.undo();
    expect(node.alpha).toBe(0.3);
  });

  it('has the correct label', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetAlphaCommand(node, 0.5);

    expect(cmd.label).toBe('Set Alpha');
  });

  it('supports re-execute after undo', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetAlphaCommand(node, 0.25);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(node.alpha).toBe(0.25);
  });
});
