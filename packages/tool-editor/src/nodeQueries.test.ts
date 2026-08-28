import { createLockState, lockNode } from '@flighthq/editor-lock';
import { addNodeChild } from '@flighthq/node';
import { createDisplayObject, createHtmlView } from '@flighthq/scene2d';
import { DisplayObjectKind, HtmlViewKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  filterUnlockedNodes,
  filterVisibleNodes,
  findNodesByKind,
  findNodesByName,
  getCommonAncestor,
  getNodePath,
} from './nodeQueries';

function createTree() {
  const root = createDisplayObject({ name: 'root' });
  const group = createDisplayObject({ name: 'target' });
  const leaf = createHtmlView({ name: 'target' });
  addNodeChild(root, group);
  addNodeChild(group, leaf);
  return { root, group, leaf };
}

describe('findNodesByName', () => {
  it('finds all matching descendants in depth-first order without including root', () => {
    const { root, group, leaf } = createTree();
    expect(findNodesByName(root, 'target')).toEqual([group, leaf]);
    expect(findNodesByName(root, 'root')).toEqual([]);
  });
});

describe('findNodesByKind', () => {
  it('finds descendants of a specific Flight kind', () => {
    const { root, group, leaf } = createTree();
    expect(findNodesByKind(root, DisplayObjectKind)).toEqual([group]);
    expect(findNodesByKind(root, HtmlViewKind)).toEqual([leaf]);
  });
});

describe('filterVisibleNodes', () => {
  it('keeps only explicitly visible nodes without changing order', () => {
    const { group, leaf } = createTree();
    leaf.visible = false;
    expect(filterVisibleNodes([leaf, group])).toEqual([group]);
  });
});

describe('filterUnlockedNodes', () => {
  it('filters nodes held by editor lock state', () => {
    const { group, leaf } = createTree();
    const locks = createLockState();
    lockNode(locks, group);
    expect(filterUnlockedNodes(locks, [group, leaf])).toEqual([leaf]);
  });
});

describe('getNodePath', () => {
  it('returns the root-to-node path inclusive', () => {
    const { root, group, leaf } = createTree();
    expect(getNodePath(leaf)).toEqual([root, group, leaf]);
    expect(getNodePath(root)).toEqual([root]);
  });
});

describe('getCommonAncestor', () => {
  it('handles empty, singleton, ancestor, sibling, and disconnected inputs', () => {
    const { root, group, leaf } = createTree();
    const sibling = createDisplayObject();
    addNodeChild(root, sibling);
    expect(getCommonAncestor([])).toBeNull();
    expect(getCommonAncestor([leaf])).toBe(leaf);
    expect(getCommonAncestor([group, leaf])).toBe(group);
    expect(getCommonAncestor([leaf, sibling])).toBe(root);
    expect(getCommonAncestor([leaf, createDisplayObject()])).toBeNull();
  });
});
