import {
  createNodeFactory,
  createNodeFromKind,
  getNodeKindCategories,
  getNodeKindIds,
  getNodeKindsByCategory,
} from '@flighthq/editor-node-factory';
import { DisplayObjectKind, NativeTextKind, ShapeKind, SpriteKind, TextLabelKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { registerDefaultNodeKinds } from './factoryPresets';

describe('registerDefaultNodeKinds', () => {
  it('registers common container, graphics, and text creators', () => {
    const factory = createNodeFactory();
    registerDefaultNodeKinds(factory);
    expect(getNodeKindIds(factory)).toEqual([DisplayObjectKind, SpriteKind, ShapeKind, NativeTextKind, TextLabelKind]);
    expect(getNodeKindCategories(factory)).toEqual(['Containers', 'Graphics', 'Text']);
    expect(getNodeKindsByCategory(factory, 'Graphics').map(({ id }) => id)).toEqual([SpriteKind, ShapeKind]);
    for (const id of getNodeKindIds(factory)) expect(createNodeFromKind(factory, id)?.kind).toBe(id);
  });

  it('replaces existing entries with canonical defaults', () => {
    const factory = createNodeFactory();
    registerDefaultNodeKinds(factory);
    registerDefaultNodeKinds(factory);
    expect(factory.entries.size).toBe(5);
  });
});
