import { addNodeChild, getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { createScene2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createClearSceneCommand } from './clearSceneCommand';

describe('createClearSceneCommand', () => {
  it('removes all children from root and restores on undo', () => {
    const scene = createScene2D();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addNodeChild(scene.root, a);
    addNodeChild(scene.root, b);

    const cmd = createClearSceneCommand(scene.root);
    cmd.execute();
    expect(getNodeChildCount(scene.root)).toBe(0);

    cmd.undo();
    expect(getNodeChildCount(scene.root)).toBe(2);
    expect(getNodeChildAt(scene.root, 0)).toBe(a);
    expect(getNodeChildAt(scene.root, 1)).toBe(b);
  });

  it('handles empty root without error', () => {
    const scene = createScene2D();
    const cmd = createClearSceneCommand(scene.root);
    cmd.execute();
    expect(getNodeChildCount(scene.root)).toBe(0);
    cmd.undo();
    expect(getNodeChildCount(scene.root)).toBe(0);
  });
});
