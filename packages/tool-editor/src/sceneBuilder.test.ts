import { getNodeChildCount } from '@flighthq/node';
import { describe, expect, it } from 'vitest';

import { buildNode, buildScene, countNodes } from './sceneBuilder';

describe('buildScene', () => {
  it('creates a scene with default dimensions', () => {
    const scene = buildScene({});
    expect(scene.scene2dWidth).toBe(800);
    expect(scene.scene2dHeight).toBe(600);
  });

  it('creates a scene with custom dimensions', () => {
    const scene = buildScene({ width: 1920, height: 1080 });
    expect(scene.scene2dWidth).toBe(1920);
    expect(scene.scene2dHeight).toBe(1080);
  });

  it('adds root children from definition', () => {
    const scene = buildScene({
      root: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
    });
    expect(getNodeChildCount(scene.root)).toBe(3);
  });

  it('builds nested hierarchy', () => {
    const scene = buildScene({
      root: [
        {
          name: 'parent',
          children: [{ name: 'child1' }, { name: 'child2' }],
        },
      ],
    });
    expect(getNodeChildCount(scene.root)).toBe(1);
    expect(countNodes(scene)).toBe(3);
  });
});

describe('buildNode', () => {
  it('creates a container by default', () => {
    const node = buildNode({ name: 'group' });
    expect(node.name).toBe('group');
  });

  it('creates a sprite when kind is sprite', () => {
    const node = buildNode({ kind: 'sprite', name: 'bg' });
    expect(node.name).toBe('bg');
  });

  it('creates a shape when kind is shape', () => {
    const node = buildNode({ kind: 'shape', name: 'panel', width: 100, height: 50, fillColor: 0xff0000 });
    expect(node.name).toBe('panel');
  });

  it('applies position without throwing', () => {
    const node = buildNode({ x: 100, y: 200 });
    expect(node).toBeDefined();
  });

  it('applies scale without throwing', () => {
    const node = buildNode({ scaleX: 2, scaleY: 3 });
    expect(node).toBeDefined();
  });

  it('applies alpha', () => {
    const node = buildNode({ alpha: 0.5 });
    expect(node.alpha).toBe(0.5);
  });

  it('applies visibility', () => {
    const node = buildNode({ visible: false });
    expect(node.visible).toBe(false);
  });

  it('adds children', () => {
    const node = buildNode({
      children: [{ name: 'a' }, { name: 'b' }],
    });
    expect(getNodeChildCount(node)).toBe(2);
  });
});

describe('countNodes', () => {
  it('returns 0 for empty scene', () => {
    const scene = buildScene({});
    expect(countNodes(scene)).toBe(0);
  });

  it('counts all descendants', () => {
    const scene = buildScene({
      root: [{ children: [{ children: [{}, {}] }] }, {}],
    });
    expect(countNodes(scene)).toBe(5);
  });
});
