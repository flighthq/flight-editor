import { createSelectionState, setSelection } from '@flighthq/editor-selection';
import { addNodeChild } from '@flighthq/node';
import { createDisplayObject, createHtmlView } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import {
  getDeepestSelectedAncestor,
  getSelectedBounds,
  getSelectedNodes,
  isAncestorSelected,
} from './selectionQueries';

function createTree() {
  const root = createDisplayObject();
  const group = createDisplayObject();
  const leaf = createHtmlView({ data: { width: 20, height: 10 }, x: 5, y: 7 });
  const sibling = createHtmlView({ data: { width: 5, height: 5 }, x: 30, y: 2 });
  addNodeChild(root, group);
  addNodeChild(group, leaf);
  addNodeChild(root, sibling);
  return { root, group, leaf, sibling };
}

describe('getSelectedNodes', () => {
  it('resolves graph members in traversal order and ignores detached selections', () => {
    const { root, leaf, sibling } = createTree();
    const selection = createSelectionState();
    setSelection(selection, [sibling, createDisplayObject(), root, leaf]);
    expect(getSelectedNodes(selection, root)).toEqual([root, leaf, sibling]);
  });
});

describe('getSelectedBounds', () => {
  it('combines resolved selection bounds and returns null when none resolve', () => {
    const { root, leaf, sibling } = createTree();
    const selection = createSelectionState();
    setSelection(selection, [leaf, sibling]);
    expect(getSelectedBounds(selection, root)).toEqual({ x: 5, y: 2, width: 30, height: 15 });
    setSelection(selection, [createDisplayObject()]);
    expect(getSelectedBounds(selection, root)).toBeNull();
  });
});

describe('isAncestorSelected', () => {
  it('checks ancestors without treating the node itself as an ancestor', () => {
    const { group, leaf } = createTree();
    const selection = createSelectionState();
    setSelection(selection, [group, leaf]);
    expect(isAncestorSelected(selection, leaf)).toBe(true);
    expect(isAncestorSelected(selection, group)).toBe(false);
  });
});

describe('getDeepestSelectedAncestor', () => {
  it('returns the nearest selected ancestor or null', () => {
    const { root, group, leaf } = createTree();
    const selection = createSelectionState();
    setSelection(selection, [root, group]);
    expect(getDeepestSelectedAncestor(selection, leaf)).toBe(group);
    setSelection(selection, [leaf]);
    expect(getDeepestSelectedAncestor(selection, leaf)).toBeNull();
  });
});
