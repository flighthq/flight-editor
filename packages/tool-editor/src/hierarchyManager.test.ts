import { addNodeChild } from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
import { addToSelection } from '@flighthq/editor-selection';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState, setEditorScene } from './editorState';
import {
  collapseAll,
  collapseNode,
  expandAll,
  expandNode,
  getHierarchyTreeRows,
  isNodeExpanded,
  revealNode,
  revealSelectedNodes,
  selectAndRevealNode,
  toggleNode,
} from './hierarchyManager';

function buildEditorWithTree() {
  const editor = createEditorState();
  const scene = createScene2D();
  setEditorScene(editor, scene);
  const root = scene.root;

  const a = createNode2D(DisplayObjectKind);
  a.name = 'a';
  const b = createNode2D(DisplayObjectKind);
  b.name = 'b';
  const a1 = createNode2D(DisplayObjectKind);
  a1.name = 'a1';

  addNodeChild(root, a);
  addNodeChild(root, b);
  addNodeChild(a, a1);

  return { editor, scene, root, a, b, a1 };
}

describe('getHierarchyTreeRows', () => {
  it('returns empty when no scene is set', () => {
    const editor = createEditorState();
    expect(getHierarchyTreeRows(editor)).toEqual([]);
  });

  it('returns rows from scene root', () => {
    const { editor, root } = buildEditorWithTree();
    const rows = getHierarchyTreeRows(editor);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].node).toBe(root);
  });

  it('includes children when root is expanded', () => {
    const { editor, root, a, b } = buildEditorWithTree();
    expandNode(editor, root);
    const rows = getHierarchyTreeRows(editor);
    expect(rows).toHaveLength(3);
    expect(rows[1].node).toBe(a);
    expect(rows[2].node).toBe(b);
  });
});

describe('expandNode', () => {
  it('expands a node in the hierarchy', () => {
    const { editor, root } = buildEditorWithTree();
    expandNode(editor, root);
    expect(isNodeExpanded(editor, root)).toBe(true);
  });
});

describe('collapseNode', () => {
  it('collapses an expanded node', () => {
    const { editor, root } = buildEditorWithTree();
    expandNode(editor, root);
    collapseNode(editor, root);
    expect(isNodeExpanded(editor, root)).toBe(false);
  });
});

describe('toggleNode', () => {
  it('toggles expansion state', () => {
    const { editor, root } = buildEditorWithTree();
    toggleNode(editor, root);
    expect(isNodeExpanded(editor, root)).toBe(true);
    toggleNode(editor, root);
    expect(isNodeExpanded(editor, root)).toBe(false);
  });
});

describe('expandAll', () => {
  it('expands all parent nodes', () => {
    const { editor, root, a } = buildEditorWithTree();
    expandAll(editor);
    expect(isNodeExpanded(editor, root)).toBe(true);
    expect(isNodeExpanded(editor, a)).toBe(true);
  });

  it('does nothing when no scene is set', () => {
    const editor = createEditorState();
    expandAll(editor);
    expect(getHierarchyTreeRows(editor)).toEqual([]);
  });
});

describe('collapseAll', () => {
  it('collapses all expanded nodes', () => {
    const { editor, root, a } = buildEditorWithTree();
    expandAll(editor);
    collapseAll(editor);
    expect(isNodeExpanded(editor, root)).toBe(false);
    expect(isNodeExpanded(editor, a)).toBe(false);
  });
});

describe('revealNode', () => {
  it('expands ancestors of a deep node', () => {
    const { editor, root, a, a1 } = buildEditorWithTree();
    revealNode(editor, a1);
    expect(isNodeExpanded(editor, root)).toBe(true);
    expect(isNodeExpanded(editor, a)).toBe(true);
    expect(isNodeExpanded(editor, a1)).toBe(false);
  });
});

describe('isNodeExpanded', () => {
  it('returns false for unexpanded nodes', () => {
    const { editor, root } = buildEditorWithTree();
    expect(isNodeExpanded(editor, root)).toBe(false);
  });
});

describe('selectAndRevealNode', () => {
  it('selects the node and reveals it in the hierarchy', () => {
    const { editor, root, a, a1 } = buildEditorWithTree();
    selectAndRevealNode(editor, a1);
    expect(isNodeExpanded(editor, root)).toBe(true);
    expect(isNodeExpanded(editor, a)).toBe(true);
    const selected = editor.selection.nodes;
    expect(selected).toHaveLength(1);
    expect(selected[0]).toBe(a1);
  });
});

describe('revealSelectedNodes', () => {
  it('reveals all selected nodes in the hierarchy', () => {
    const { editor, a1, b } = buildEditorWithTree();
    selectAndRevealNode(editor, a1);
    addToSelection(editor.selection, b);
    revealSelectedNodes(editor);
    const rows = getHierarchyTreeRows(editor);
    const nodeNames = rows.map((r) => r.node.name);
    expect(nodeNames).toContain('a1');
    expect(nodeNames).toContain('b');
  });
});
