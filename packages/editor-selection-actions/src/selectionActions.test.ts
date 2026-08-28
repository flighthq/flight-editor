import { createHierarchyState, isHierarchyNodeExpanded } from '@flighthq/editor-hierarchy';
import { createLockState, lockNode } from '@flighthq/editor-lock';
import { createSelectionState, getSelectedNodes, getSelectionCount, setSelection } from '@flighthq/editor-selection';
import { addNodeChild, createNode } from '@flighthq/node';
import { NodeKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { NodeAny } from '@flighthq/types';

import {
  invertSelection,
  selectAll,
  selectChildren,
  selectNone,
  selectParent,
  selectSiblings,
} from './selectionActions';

function node(name: string): NodeAny {
  const result = createNode(NodeKind);
  result.name = name;
  return result;
}

function buildTree() {
  const root = node('root');
  const a = node('a');
  const b = node('b');
  const c = node('c');
  const a1 = node('a1');
  const a2 = node('a2');
  addNodeChild(root, a);
  addNodeChild(root, b);
  addNodeChild(root, c);
  addNodeChild(a, a1);
  addNodeChild(a, a2);
  return { root, a, b, c, a1, a2 };
}

function selectedNames(selection: ReturnType<typeof createSelectionState>): Array<string | null> {
  return getSelectedNodes(selection).map((entry) => entry.name);
}

describe('selectAll', () => {
  it('selects every unlocked descendant in hierarchy order while excluding the root', () => {
    const { root, b } = buildTree();
    const selection = createSelectionState();
    const locks = createLockState();
    lockNode(locks, b);
    selectAll(selection, locks, root);
    expect(selectedNames(selection)).toEqual(['a', 'a1', 'a2', 'c']);
  });

  it('does not bump selection version when the selectable hierarchy is already selected', () => {
    const { root } = buildTree();
    const selection = createSelectionState();
    const locks = createLockState();
    selectAll(selection, locks, root);
    const version = selection.version;
    selectAll(selection, locks, root);
    expect(selection.version).toBe(version);
  });
});

describe('selectNone', () => {
  it('clears the current selection', () => {
    const { a } = buildTree();
    const selection = createSelectionState();
    setSelection(selection, [a]);
    selectNone(selection);
    expect(getSelectionCount(selection)).toBe(0);
    expect(selection.version).toBe(2);
  });

  it('does not bump selection version when already empty', () => {
    const selection = createSelectionState();
    selectNone(selection);
    expect(selection.version).toBe(0);
  });
});

describe('invertSelection', () => {
  it('selects unlocked descendants outside the current selection', () => {
    const { root, a, b, c } = buildTree();
    const selection = createSelectionState();
    const locks = createLockState();
    setSelection(selection, [a, c]);
    lockNode(locks, b);
    invertSelection(selection, locks, root);
    expect(selectedNames(selection)).toEqual(['a1', 'a2']);
  });

  it('drops selections outside the supplied hierarchy universe', () => {
    const { root, a } = buildTree();
    const external = node('external');
    const selection = createSelectionState();
    setSelection(selection, [a, external]);
    invertSelection(selection, createLockState(), root);
    expect(selectedNames(selection)).toEqual(['a1', 'a2', 'b', 'c']);
  });
});

describe('selectParent', () => {
  it('selects unique unlocked parents and expands their ancestor paths', () => {
    const { root, a, b, a1 } = buildTree();
    const selection = createSelectionState();
    const locks = createLockState();
    const hierarchy = createHierarchyState();
    setSelection(selection, [a1, b]);
    lockNode(locks, root);
    selectParent(selection, locks, hierarchy);
    expect(selectedNames(selection)).toEqual(['a']);
    expect(isHierarchyNodeExpanded(hierarchy, root)).toBe(true);
  });

  it('preserves root selection when no selectable parent exists', () => {
    const { root } = buildTree();
    const selection = createSelectionState();
    setSelection(selection, [root]);
    const version = selection.version;
    selectParent(selection, createLockState(), createHierarchyState());
    expect(getSelectedNodes(selection)).toEqual([root]);
    expect(selection.version).toBe(version);
  });
});

describe('selectChildren', () => {
  it('selects direct unlocked children and expands their parents', () => {
    const { a, a1, a2 } = buildTree();
    const selection = createSelectionState();
    const locks = createLockState();
    const hierarchy = createHierarchyState();
    setSelection(selection, [a]);
    lockNode(locks, a2);
    selectChildren(selection, locks, hierarchy);
    expect(getSelectedNodes(selection)).toEqual([a1]);
    expect(isHierarchyNodeExpanded(hierarchy, a)).toBe(true);
  });

  it('preserves leaf selection when no selectable children exist', () => {
    const { a1 } = buildTree();
    const selection = createSelectionState();
    setSelection(selection, [a1]);
    const version = selection.version;
    selectChildren(selection, createLockState(), createHierarchyState());
    expect(getSelectedNodes(selection)).toEqual([a1]);
    expect(selection.version).toBe(version);
  });
});

describe('selectSiblings', () => {
  it('selects all unlocked children of each parent and reveals them', () => {
    const { root, a, b, c } = buildTree();
    const selection = createSelectionState();
    const locks = createLockState();
    const hierarchy = createHierarchyState();
    setSelection(selection, [a]);
    lockNode(locks, b);
    selectSiblings(selection, locks, hierarchy);
    expect(getSelectedNodes(selection)).toEqual([a, c]);
    expect(isHierarchyNodeExpanded(hierarchy, root)).toBe(true);
  });

  it('preserves root selection when it has no siblings', () => {
    const { root } = buildTree();
    const selection = createSelectionState();
    setSelection(selection, [root]);
    const version = selection.version;
    selectSiblings(selection, createLockState(), createHierarchyState());
    expect(getSelectedNodes(selection)).toEqual([root]);
    expect(selection.version).toBe(version);
  });
});
