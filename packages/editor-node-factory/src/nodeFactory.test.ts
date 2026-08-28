import { createNode2D, createSprite } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  createNodeFactory,
  createNodeFromKind,
  getNodeKindCategories,
  getNodeKindEntry,
  getNodeKindIds,
  getNodeKindsByCategory,
  registerNodeKind,
  unregisterNodeKind,
} from './nodeFactory';

describe('createNodeFactory', () => {
  it('starts empty', () => {
    const factory = createNodeFactory();
    expect(getNodeKindIds(factory)).toEqual([]);
  });
});

describe('registerNodeKind / unregisterNodeKind', () => {
  it('registers and retrieves a kind', () => {
    const factory = createNodeFactory();
    registerNodeKind(factory, 'container', 'Container', 'core', () => createNode2D(DisplayObjectKind));

    expect(getNodeKindIds(factory)).toEqual(['container']);
    const entry = getNodeKindEntry(factory, 'container');
    expect(entry?.label).toBe('Container');
    expect(entry?.category).toBe('core');
  });

  it('unregisters a kind', () => {
    const factory = createNodeFactory();
    registerNodeKind(factory, 'container', 'Container', 'core', () => createNode2D(DisplayObjectKind));

    expect(unregisterNodeKind(factory, 'container')).toBe(true);
    expect(getNodeKindIds(factory)).toEqual([]);
    expect(unregisterNodeKind(factory, 'container')).toBe(false);
  });
});

describe('getNodeKindsByCategory', () => {
  it('filters by category', () => {
    const factory = createNodeFactory();
    registerNodeKind(factory, 'container', 'Container', 'core', () => createNode2D(DisplayObjectKind));
    registerNodeKind(factory, 'sprite', 'Sprite', 'visual', () => createSprite());
    registerNodeKind(factory, 'empty', 'Empty Node', 'core', () => createNode2D(DisplayObjectKind));

    const core = getNodeKindsByCategory(factory, 'core');
    expect(core).toHaveLength(2);
    expect(core.map((e) => e.id).sort()).toEqual(['container', 'empty']);
  });
});

describe('getNodeKindCategories', () => {
  it('returns unique categories', () => {
    const factory = createNodeFactory();
    registerNodeKind(factory, 'a', 'A', 'core', () => createNode2D(DisplayObjectKind));
    registerNodeKind(factory, 'b', 'B', 'visual', () => createSprite());
    registerNodeKind(factory, 'c', 'C', 'core', () => createNode2D(DisplayObjectKind));

    const categories = getNodeKindCategories(factory);
    expect(categories.sort()).toEqual(['core', 'visual']);
  });
});

describe('createNodeFromKind', () => {
  it('creates a node using the registered factory', () => {
    const factory = createNodeFactory();
    registerNodeKind(factory, 'container', 'Container', 'core', () => createNode2D(DisplayObjectKind));

    const node = createNodeFromKind(factory, 'container');
    expect(node).not.toBeNull();
    expect(node?.kind).toBe('DisplayObject');
  });

  it('returns null for unknown kind', () => {
    const factory = createNodeFactory();
    expect(createNodeFromKind(factory, 'unknown')).toBeNull();
  });

  it('creates fresh instances each time', () => {
    const factory = createNodeFactory();
    registerNodeKind(factory, 'container', 'Container', 'core', () => createNode2D(DisplayObjectKind));

    const a = createNodeFromKind(factory, 'container');
    const b = createNodeFromKind(factory, 'container');
    expect(a).not.toBe(b);
  });
});
