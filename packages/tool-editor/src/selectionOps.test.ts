import { addNodeChild } from '@flighthq/node';
import { addToSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { createNewScene } from './sceneManager';
import {
  deselectAll,
  deselectNode,
  getEditorSelectedNodes,
  getEditorSelectionCount,
  getSelectableCount,
  hasSelection,
  invertSelection,
  isNodeSelected,
  selectAll,
  selectNode,
} from './selectionOps';

function setupEditor(nodeCount: number) {
  const editor = createEditorState();
  createNewScene(editor);
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(editor.scene!.root, node);
    nodes.push(node);
  }
  return { editor, nodes };
}

describe('selectAll', () => {
  it('selects all root children', () => {
    const { editor } = setupEditor(3);
    expect(selectAll(editor)).toBe(3);
    expect(getEditorSelectionCount(editor)).toBe(3);
  });

  it('returns 0 with no scene', () => {
    const editor = createEditorState();
    expect(selectAll(editor)).toBe(0);
  });
});

describe('deselectAll', () => {
  it('clears selection', () => {
    const { editor, nodes } = setupEditor(2);
    addToSelection(editor.selection, nodes[0]!);
    deselectAll(editor);
    expect(getEditorSelectionCount(editor)).toBe(0);
  });
});

describe('invertSelection', () => {
  it('inverts the selection', () => {
    const { editor, nodes } = setupEditor(3);
    addToSelection(editor.selection, nodes[0]!);
    const count = invertSelection(editor);
    expect(count).toBe(2);
    expect(isNodeSelected(editor, nodes[0]!)).toBe(false);
    expect(isNodeSelected(editor, nodes[1]!)).toBe(true);
  });
});

describe('getEditorSelectionCount', () => {
  it('returns 0 initially', () => {
    const { editor } = setupEditor(2);
    expect(getEditorSelectionCount(editor)).toBe(0);
  });
});

describe('getEditorSelectedNodes', () => {
  it('returns selected nodes', () => {
    const { editor, nodes } = setupEditor(1);
    addToSelection(editor.selection, nodes[0]!);
    expect(getEditorSelectedNodes(editor)).toHaveLength(1);
  });
});

describe('selectNode', () => {
  it('adds a node to selection', () => {
    const { editor, nodes } = setupEditor(1);
    selectNode(editor, nodes[0]!);
    expect(isNodeSelected(editor, nodes[0]!)).toBe(true);
  });
});

describe('deselectNode', () => {
  it('removes a node from selection', () => {
    const { editor, nodes } = setupEditor(1);
    selectNode(editor, nodes[0]!);
    deselectNode(editor, nodes[0]!);
    expect(isNodeSelected(editor, nodes[0]!)).toBe(false);
  });
});

describe('isNodeSelected', () => {
  it('returns false for unselected node', () => {
    const { editor, nodes } = setupEditor(1);
    expect(isNodeSelected(editor, nodes[0]!)).toBe(false);
  });
});

describe('hasSelection', () => {
  it('returns false when empty', () => {
    const { editor } = setupEditor(1);
    expect(hasSelection(editor)).toBe(false);
  });

  it('returns true when nodes are selected', () => {
    const { editor, nodes } = setupEditor(1);
    selectNode(editor, nodes[0]!);
    expect(hasSelection(editor)).toBe(true);
  });
});

describe('getSelectableCount', () => {
  it('returns number of root children', () => {
    const { editor } = setupEditor(4);
    expect(getSelectableCount(editor)).toBe(4);
  });

  it('returns 0 with no scene', () => {
    const editor = createEditorState();
    expect(getSelectableCount(editor)).toBe(0);
  });
});
