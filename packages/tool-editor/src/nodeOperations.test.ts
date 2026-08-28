import { addNodeChild, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { addToSelection } from '@flighthq/editor-selection';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState, setEditorScene } from './editorState';
import {
  addNode,
  alignSelection,
  bringNodeForward,
  bringNodeToFront,
  deleteSelection,
  distributeSelection,
  duplicateSelection,
  flipNodes,
  flipSelection,
  groupSelection,
  removeNode,
  renameNode,
  reparentNode,
  sendNodeBackward,
  sendNodeToBack,
  setNodeTransform,
  setNodeVisible,
  ungroupNode,
} from './nodeOperations';

function buildEditor() {
  const editor = createEditorState();
  const scene = createScene2D();
  setEditorScene(editor, scene);
  return { editor, root: scene.root };
}

describe('addNode', () => {
  it('adds a child to a parent via command history', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNode(editor, root, child);
    expect(getNodeChildCount(root)).toBe(1);
  });
});

describe('removeNode', () => {
  it('removes a node from its parent', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    expect(getNodeChildCount(root)).toBe(1);
    removeNode(editor, child);
    expect(getNodeChildCount(root)).toBe(0);
  });
});

describe('deleteSelection', () => {
  it('returns false with no selection', () => {
    const { editor } = buildEditor();
    expect(deleteSelection(editor)).toBe(false);
  });

  it('deletes selected nodes', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    addToSelection(editor.selection, child);
    expect(deleteSelection(editor)).toBe(true);
    expect(getNodeChildCount(root)).toBe(0);
  });
});

describe('duplicateSelection', () => {
  it('returns false with no selection', () => {
    const { editor } = buildEditor();
    expect(duplicateSelection(editor)).toBe(false);
  });

  it('duplicates selected nodes', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    addToSelection(editor.selection, child);
    expect(duplicateSelection(editor)).toBe(true);
    expect(getNodeChildCount(root)).toBe(2);
  });
});

describe('groupSelection', () => {
  it('returns false with fewer than 2 nodes', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    addToSelection(editor.selection, child);
    const group = createNode2D(DisplayObjectKind);
    expect(groupSelection(editor, group)).toBe(false);
  });
});

describe('ungroupNode', () => {
  it('ungroups a node', () => {
    const { editor, root } = buildEditor();
    const group = createNode2D(DisplayObjectKind);
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, group);
    addNodeChild(group, child);
    ungroupNode(editor, group);
    expect(getNodeParent(child)).toBe(root);
  });
});

describe('reparentNode', () => {
  it('moves a node to a new parent', () => {
    const { editor, root } = buildEditor();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addNodeChild(root, a);
    addNodeChild(root, b);
    reparentNode(editor, b, a);
    expect(getNodeParent(b)).toBe(a);
  });
});

describe('renameNode', () => {
  it('renames a node', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    renameNode(editor, child, 'test-name');
    expect(child.name).toBe('test-name');
  });
});

describe('setNodeTransform', () => {
  it('sets the transform on a node', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    setNodeTransform(editor, child, {
      x: 10,
      y: 20,
      scaleX: 2,
      scaleY: 2,
      rotation: 0,
      skewX: 0,
      skewY: 0,
      pivotX: 0,
      pivotY: 0,
    });
    expect(child.x).toBe(10);
    expect(child.y).toBe(20);
  });
});

describe('setNodeVisible', () => {
  it('changes node visibility', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    setNodeVisible(editor, child, false);
    expect(child.visible).toBe(false);
  });
});

describe('flipNodes', () => {
  it('flips nodes on an axis', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    flipNodes(editor, [child], 'horizontal');
    expect(child.scaleX).toBe(-1);
  });
});

describe('flipSelection', () => {
  it('returns false with no selection', () => {
    const { editor } = buildEditor();
    expect(flipSelection(editor, 'horizontal')).toBe(false);
  });

  it('flips selected nodes', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    addToSelection(editor.selection, child);
    expect(flipSelection(editor, 'vertical')).toBe(true);
    expect(child.scaleY).toBe(-1);
  });
});

describe('alignSelection', () => {
  it('returns false with fewer than 2 nodes', () => {
    const { editor } = buildEditor();
    expect(alignSelection(editor, 'left')).toBe(false);
  });
});

describe('distributeSelection', () => {
  it('returns false with fewer than 3 nodes', () => {
    const { editor, root } = buildEditor();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addNodeChild(root, a);
    addNodeChild(root, b);
    addToSelection(editor.selection, a);
    addToSelection(editor.selection, b);
    expect(distributeSelection(editor, 'horizontal')).toBe(false);
  });
});

describe('bringNodeToFront', () => {
  it('executes without error', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    expect(() => bringNodeToFront(editor, child)).not.toThrow();
  });
});

describe('bringNodeForward', () => {
  it('executes without error', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    expect(() => bringNodeForward(editor, child)).not.toThrow();
  });
});

describe('sendNodeBackward', () => {
  it('executes without error', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    expect(() => sendNodeBackward(editor, child)).not.toThrow();
  });
});

describe('sendNodeToBack', () => {
  it('executes without error', () => {
    const { editor, root } = buildEditor();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, child);
    expect(() => sendNodeToBack(editor, child)).not.toThrow();
  });
});
