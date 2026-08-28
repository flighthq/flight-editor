import { addNodeChild } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  collapseHierarchyAll,
  collapseHierarchyNode,
  createHierarchyState,
  expandHierarchyAll,
  expandHierarchyNode,
  expandHierarchyToNode,
  getHierarchyRows,
  getHierarchyVersion,
  isHierarchyNodeExpanded,
  toggleHierarchyNode,
} from './hierarchyState';

function buildTree() {
  const root = createNode2D(DisplayObjectKind);
  root.name = 'root';
  const a = createNode2D(DisplayObjectKind);
  a.name = 'a';
  const b = createNode2D(DisplayObjectKind);
  b.name = 'b';
  const a1 = createNode2D(DisplayObjectKind);
  a1.name = 'a1';
  const a2 = createNode2D(DisplayObjectKind);
  a2.name = 'a2';
  addNodeChild(root, a);
  addNodeChild(root, b);
  addNodeChild(a, a1);
  addNodeChild(a, a2);
  return { root, a, b, a1, a2 };
}

describe('collapseHierarchyNode', () => {
  it('is exported', () => expect(collapseHierarchyNode).toBeTypeOf('function'));
});

describe('expandHierarchyNode', () => {
  it('is exported', () => expect(expandHierarchyNode).toBeTypeOf('function'));
});

describe('getHierarchyVersion', () => {
  it('is exported', () => expect(getHierarchyVersion).toBeTypeOf('function'));
});

describe('isHierarchyNodeExpanded', () => {
  it('is exported', () => expect(isHierarchyNodeExpanded).toBeTypeOf('function'));
});

describe('createHierarchyState', () => {
  it('starts with nothing expanded', () => {
    const state = createHierarchyState();
    expect(state.expanded.size).toBe(0);
    expect(getHierarchyVersion(state)).toBe(0);
  });
});

describe('expandHierarchyNode / collapseHierarchyNode', () => {
  it('expands and collapses a node', () => {
    const { root } = buildTree();
    const state = createHierarchyState();

    expandHierarchyNode(state, root);
    expect(isHierarchyNodeExpanded(state, root)).toBe(true);
    expect(getHierarchyVersion(state)).toBe(1);

    collapseHierarchyNode(state, root);
    expect(isHierarchyNodeExpanded(state, root)).toBe(false);
    expect(getHierarchyVersion(state)).toBe(2);
  });

  it('does not bump version for redundant expand', () => {
    const { root } = buildTree();
    const state = createHierarchyState();
    expandHierarchyNode(state, root);
    expandHierarchyNode(state, root);
    expect(getHierarchyVersion(state)).toBe(1);
  });

  it('does not bump version for redundant collapse', () => {
    const { root } = buildTree();
    const state = createHierarchyState();
    collapseHierarchyNode(state, root);
    expect(getHierarchyVersion(state)).toBe(0);
  });
});

describe('toggleHierarchyNode', () => {
  it('toggles between expanded and collapsed', () => {
    const { root } = buildTree();
    const state = createHierarchyState();

    toggleHierarchyNode(state, root);
    expect(isHierarchyNodeExpanded(state, root)).toBe(true);

    toggleHierarchyNode(state, root);
    expect(isHierarchyNodeExpanded(state, root)).toBe(false);
  });
});

describe('expandHierarchyAll', () => {
  it('expands all parent nodes in the subtree', () => {
    const { root, a } = buildTree();
    const state = createHierarchyState();

    expandHierarchyAll(state, root);
    expect(isHierarchyNodeExpanded(state, root)).toBe(true);
    expect(isHierarchyNodeExpanded(state, a)).toBe(true);
  });

  it('does not expand leaf nodes', () => {
    const { root, a1, a2, b } = buildTree();
    const state = createHierarchyState();

    expandHierarchyAll(state, root);
    expect(isHierarchyNodeExpanded(state, a1)).toBe(false);
    expect(isHierarchyNodeExpanded(state, a2)).toBe(false);
    expect(isHierarchyNodeExpanded(state, b)).toBe(false);
  });
});

describe('collapseHierarchyAll', () => {
  it('collapses everything', () => {
    const { root, a } = buildTree();
    const state = createHierarchyState();
    expandHierarchyNode(state, root);
    expandHierarchyNode(state, a);

    collapseHierarchyAll(state);
    expect(isHierarchyNodeExpanded(state, root)).toBe(false);
    expect(isHierarchyNodeExpanded(state, a)).toBe(false);
  });

  it('does not bump version if already collapsed', () => {
    const state = createHierarchyState();
    collapseHierarchyAll(state);
    expect(getHierarchyVersion(state)).toBe(0);
  });
});

describe('expandHierarchyToNode', () => {
  it('expands ancestors to reveal a deep node', () => {
    const { root, a, a1 } = buildTree();
    const state = createHierarchyState();

    expandHierarchyToNode(state, a1);
    expect(isHierarchyNodeExpanded(state, root)).toBe(true);
    expect(isHierarchyNodeExpanded(state, a)).toBe(true);
    expect(isHierarchyNodeExpanded(state, a1)).toBe(false);
  });

  it('does not bump version if ancestors already expanded', () => {
    const { root, a, a1 } = buildTree();
    const state = createHierarchyState();
    expandHierarchyNode(state, root);
    expandHierarchyNode(state, a);
    const v = getHierarchyVersion(state);

    expandHierarchyToNode(state, a1);
    expect(getHierarchyVersion(state)).toBe(v);
  });

  it('expands only necessary ancestors for root child', () => {
    const { root, a } = buildTree();
    const state = createHierarchyState();

    expandHierarchyToNode(state, a);
    expect(isHierarchyNodeExpanded(state, root)).toBe(true);
    expect(isHierarchyNodeExpanded(state, a)).toBe(false);
  });
});

describe('getHierarchyRows', () => {
  it('returns only the root when nothing is expanded', () => {
    const { root } = buildTree();
    const state = createHierarchyState();
    const rows = getHierarchyRows(state, root);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ node: root, depth: 0, hasChildren: true, expanded: false });
  });

  it('returns root and children when root is expanded', () => {
    const { root, a, b } = buildTree();
    const state = createHierarchyState();
    expandHierarchyNode(state, root);
    const rows = getHierarchyRows(state, root);

    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ node: root, depth: 0, hasChildren: true, expanded: true });
    expect(rows[1]).toEqual({ node: a, depth: 1, hasChildren: true, expanded: false });
    expect(rows[2]).toEqual({ node: b, depth: 1, hasChildren: false, expanded: false });
  });

  it('returns full tree when all expanded', () => {
    const { root, a, b, a1, a2 } = buildTree();
    const state = createHierarchyState();
    expandHierarchyAll(state, root);
    const rows = getHierarchyRows(state, root);

    expect(rows).toHaveLength(5);
    expect(rows.map((r) => r.node)).toEqual([root, a, a1, a2, b]);
    expect(rows.map((r) => r.depth)).toEqual([0, 1, 2, 2, 1]);
  });

  it('marks leaf nodes as hasChildren: false', () => {
    const { root, a, b, a1, a2 } = buildTree();
    const state = createHierarchyState();
    expandHierarchyAll(state, root);
    const rows = getHierarchyRows(state, root);

    const a1Row = rows.find((r) => r.node === a1);
    const a2Row = rows.find((r) => r.node === a2);
    const bRow = rows.find((r) => r.node === b);
    expect(a1Row?.hasChildren).toBe(false);
    expect(a2Row?.hasChildren).toBe(false);
    expect(bRow?.hasChildren).toBe(false);
  });

  it('returns subtree when starting from a child', () => {
    const { root, a, a1, a2 } = buildTree();
    const state = createHierarchyState();
    expandHierarchyNode(state, a);
    const rows = getHierarchyRows(state, a);

    expect(rows).toHaveLength(3);
    expect(rows[0].node).toBe(a);
    expect(rows[0].depth).toBe(0);
    expect(rows[1].node).toBe(a1);
    expect(rows[2].node).toBe(a2);
  });
});
