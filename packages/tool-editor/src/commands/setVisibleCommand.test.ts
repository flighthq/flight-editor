import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetVisibleCommand } from './setVisibleCommand';

describe('createSetVisibleCommand', () => {
  it('hides a visible node and restores on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    expect(node.visible).toBe(true);

    const cmd = createSetVisibleCommand(node, false);
    cmd.execute();
    expect(node.visible).toBe(false);

    cmd.undo();
    expect(node.visible).toBe(true);
  });

  it('shows a hidden node and restores on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    node.visible = false;

    const cmd = createSetVisibleCommand(node, true);
    cmd.execute();
    expect(node.visible).toBe(true);

    cmd.undo();
    expect(node.visible).toBe(false);
  });
});
