import { addNodeChild, getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
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

  it('restores children in their original order', () => {
    const scene = createScene2D();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    a.name = 'A';
    b.name = 'B';
    c.name = 'C';
    for (const child of [a, b, c]) addNodeChild(scene.root, child);

    const cmd = createClearSceneCommand(scene.root);
    cmd.execute();
    cmd.undo();

    expect(getNodeChildCount(scene.root)).toBe(3);
    expect(getNodeChildAt(scene.root, 0)).toBe(a);
    expect(getNodeChildAt(scene.root, 1)).toBe(b);
    expect(getNodeChildAt(scene.root, 2)).toBe(c);
  });

  it('has the correct label', () => {
    const scene = createScene2D();
    const cmd = createClearSceneCommand(scene.root);

    expect(cmd.label).toBe('Clear Scene');
  });

  it('supports re-execute after undo', () => {
    const scene = createScene2D();
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(scene.root, node);

    const cmd = createClearSceneCommand(scene.root);
    cmd.execute();
    cmd.undo();
    cmd.execute();

    expect(getNodeChildCount(scene.root)).toBe(0);
  });
});
