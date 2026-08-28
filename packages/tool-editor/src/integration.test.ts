import { executeCommand, redo, undo } from '@flighthq/editor-command';
import { expandHierarchyNode, getHierarchyRows, isHierarchyNodeExpanded } from '@flighthq/editor-hierarchy';
import { createNodeFactory, registerNodeKind } from '@flighthq/editor-node-factory';
import { getSelectedNodes, getSelectionCount, isSelected } from '@flighthq/editor-selection';
import { activateTool, registerTool } from '@flighthq/editor-tool';
import { getNodeTransform2D } from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { Transform2DLike } from '@flighthq/types';

import { createAddNodeCommand } from './commands/addNodeCommand';
import { createSetNodeNameCommand } from './commands/setNodeNameCommand';
import { createEditorState, setEditorScene } from './editorState';
import { createMoveTool } from './moveTool';
import { createSelectTool } from './selectTool';

function readTransform(node: any): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

describe('editor integration', () => {
  it('full workflow: create scene, add nodes, select, move, undo', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    registerNodeKind(editor.nodeFactory, 'container', 'Container', 'core', () => createNode2D(DisplayObjectKind));

    const container = createNode2D(DisplayObjectKind);
    container.name = 'Stage';
    const addCmd = createAddNodeCommand(root, container);
    executeCommand(editor.commandHistory, addCmd);

    const child = createNode2D(DisplayObjectKind);
    child.name = 'Sprite1';
    const addChildCmd = createAddNodeCommand(container, child);
    executeCommand(editor.commandHistory, addChildCmd);

    expandHierarchyNode(editor.hierarchy, root);
    expandHierarchyNode(editor.hierarchy, container);
    const rows = getHierarchyRows(editor.hierarchy, root);
    expect(rows).toHaveLength(3);
    expect(rows[0].node).toBe(root);
    expect(rows[1].node).toBe(container);
    expect(rows[2].node).toBe(child);
    expect(rows[1].depth).toBe(1);
    expect(rows[2].depth).toBe(2);

    const hitNodes = [container, child];
    const selectTool = createSelectTool(editor, (x) => (x < 200 ? hitNodes[0] : hitNodes[1]));
    registerTool(editor.toolRegistry, selectTool);
    activateTool(editor.toolRegistry, 'select');

    selectTool.pointerDown({
      x: 100,
      y: 100,
      button: 0,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(getSelectionCount(editor.selection)).toBe(1);
    expect(isSelected(editor.selection, container)).toBe(true);

    const moveTool = createMoveTool(editor);
    registerTool(editor.toolRegistry, moveTool);
    activateTool(editor.toolRegistry, 'move');

    moveTool.pointerDown({ x: 0, y: 0, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
    moveTool.pointerMove({ x: 50, y: 30, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
    moveTool.pointerUp({ x: 50, y: 30, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });

    expect(readTransform(container).x).toBe(50);
    expect(readTransform(container).y).toBe(30);

    undo(editor.commandHistory);
    expect(readTransform(container).x).toBe(0);
    expect(readTransform(container).y).toBe(0);

    redo(editor.commandHistory);
    expect(readTransform(container).x).toBe(50);
    expect(readTransform(container).y).toBe(30);

    const renameCmd = createSetNodeNameCommand(child, 'RenamedSprite');
    executeCommand(editor.commandHistory, renameCmd);
    expect(child.name).toBe('RenamedSprite');

    undo(editor.commandHistory);
    expect(child.name).toBe('Sprite1');
  });

  it('hierarchy reflects scene structure after add/remove', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    a.name = 'A';
    const b = createNode2D(DisplayObjectKind);
    b.name = 'B';

    executeCommand(editor.commandHistory, createAddNodeCommand(root, a));
    executeCommand(editor.commandHistory, createAddNodeCommand(root, b));

    expandHierarchyNode(editor.hierarchy, root);
    expect(getHierarchyRows(editor.hierarchy, root)).toHaveLength(3);

    undo(editor.commandHistory);
    expect(getHierarchyRows(editor.hierarchy, root)).toHaveLength(2);

    undo(editor.commandHistory);
    expect(getHierarchyRows(editor.hierarchy, root)).toHaveLength(1);
  });
});
