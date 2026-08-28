import { addNodeChild, getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createNode2D, createSprite } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { cloneNode, cloneNodeWithOffset, cloneNodes, deepCloneNode } from './nodeClone';

describe('cloneNode', () => {
  it('clones a container node', () => {
    const original = createNode2D(DisplayObjectKind);
    original.name = 'group';
    original.alpha = 0.5;
    const clone = cloneNode(original);
    expect(clone.name).toBe('group');
    expect(clone.alpha).toBe(0.5);
    expect(clone).not.toBe(original);
  });

  it('clones a sprite node', () => {
    const original = createSprite();
    original.name = 'icon';
    const clone = cloneNode(original);
    expect(clone.name).toBe('icon');
    expect(clone).not.toBe(original);
  });

  it('does not clone children shallowly', () => {
    const parent = createNode2D(DisplayObjectKind);
    addNodeChild(parent, createNode2D(DisplayObjectKind));
    const clone = cloneNode(parent);
    expect(getNodeChildCount(clone)).toBe(0);
  });

  it('preserves visibility', () => {
    const node = createNode2D(DisplayObjectKind);
    node.visible = false;
    const clone = cloneNode(node);
    expect(clone.visible).toBe(false);
  });
});

describe('deepCloneNode', () => {
  it('clones with children', () => {
    const parent = createNode2D(DisplayObjectKind);
    parent.name = 'parent';
    const child = createNode2D(DisplayObjectKind);
    child.name = 'child';
    addNodeChild(parent, child);

    const clone = deepCloneNode(parent);
    expect(clone.name).toBe('parent');
    expect(getNodeChildCount(clone)).toBe(1);
    const clonedChild = getNodeChildAt(clone, 0);
    expect(clonedChild).not.toBe(child);
  });

  it('clones deeply nested hierarchy', () => {
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    c.name = 'leaf';
    addNodeChild(b, c);
    addNodeChild(a, b);

    const clone = deepCloneNode(a);
    expect(getNodeChildCount(clone)).toBe(1);
    const clonedB = getNodeChildAt(clone, 0);
    expect(getNodeChildCount(clonedB!)).toBe(1);
  });
});

describe('cloneNodeWithOffset', () => {
  it('creates clone at offset position', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = 'target';
    const clone = cloneNodeWithOffset(node, 10, 20);
    expect(clone.name).toBe('target');
    expect(clone).not.toBe(node);
  });
});

describe('cloneNodes', () => {
  it('clones multiple nodes', () => {
    const a = createNode2D(DisplayObjectKind);
    a.name = 'a';
    const b = createNode2D(DisplayObjectKind);
    b.name = 'b';
    const clones = cloneNodes([a, b]);
    expect(clones).toHaveLength(2);
    expect(clones[0].name).toBe('a');
    expect(clones[1].name).toBe('b');
    expect(clones[0]).not.toBe(a);
    expect(clones[1]).not.toBe(b);
  });

  it('returns empty array for empty input', () => {
    expect(cloneNodes([])).toHaveLength(0);
  });
});
