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

  it('has the correct label', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetVisibleCommand(node, false);
    expect(cmd.label).toBe('Set Visible');
  });

  it('can re-execute after undo', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetVisibleCommand(node, false);

    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(node.visible).toBe(false);
  });

  it('setting same visibility is a valid operation', () => {
    const node = createNode2D(DisplayObjectKind);
    const cmd = createSetVisibleCommand(node, true);

    cmd.execute();
    expect(node.visible).toBe(true);

    cmd.undo();
    expect(node.visible).toBe(true);
  });
});
