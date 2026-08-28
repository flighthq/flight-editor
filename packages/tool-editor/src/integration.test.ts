import { executeCommand, redo, undo } from '@flighthq/editor-command';
import { expandHierarchyNode, getHierarchyRows } from '@flighthq/editor-hierarchy';
import { registerNodeKind } from '@flighthq/editor-node-factory';
import { hideRulers, isRulerVisible, showRulers } from '@flighthq/editor-rulers';
import { getSelectionCount, isSelected, setSelection } from '@flighthq/editor-selection';
import { activateTool, registerTool } from '@flighthq/editor-tool';
import { addNodeChild, getNodeChildCount, getNodeTransform2D } from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { Transform2DLike } from '@flighthq/types';

import { createAddNodeCommand } from './commands/addNodeCommand';
import { createClearSceneCommand } from './commands/clearSceneCommand';
import { createDeleteSelectionCommand } from './commands/deleteSelectionCommand';
import { createSetNodeNameCommand } from './commands/setNodeNameCommand';
import { createSetSceneColorCommand } from './commands/setSceneColorCommand';
import { createEditorState, setEditorScene } from './editorState';
import { createHandTool } from './handTool';
import { createMoveTool } from './moveTool';
import { createScaleTool } from './scaleTool';
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

    const scaleTool = createScaleTool(editor);
    registerTool(editor.toolRegistry, scaleTool);
    activateTool(editor.toolRegistry, 'scale');

    scaleTool.pointerDown({ x: 0, y: 0, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
    scaleTool.pointerUp({ x: 100, y: 100, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });

    expect(readTransform(container).scaleX).toBe(2);
    expect(readTransform(container).scaleY).toBe(2);

    undo(editor.commandHistory);
    expect(readTransform(container).scaleX).toBe(1);
    expect(readTransform(container).scaleY).toBe(1);
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

  it('delete selection with undo restores full scene state', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    for (const child of [a, b, c]) addNodeChild(root, child);

    setSelection(editor.selection, [a, c]);
    const deleteCmd = createDeleteSelectionCommand(editor);
    executeCommand(editor.commandHistory, deleteCmd);

    expect(getNodeChildCount(root)).toBe(1);
    expect(getSelectionCount(editor.selection)).toBe(0);

    undo(editor.commandHistory);

    expect(getNodeChildCount(root)).toBe(3);
    expect(getSelectionCount(editor.selection)).toBe(2);
    expect(isSelected(editor.selection, a)).toBe(true);
    expect(isSelected(editor.selection, c)).toBe(true);
  });

  it('scene color change with undo', () => {
    const editor = createEditorState();
    const scene = createScene2D({ color: 0xff0000ff });
    setEditorScene(editor, scene);

    const cmd = createSetSceneColorCommand(scene, 0x00ff00ff);
    executeCommand(editor.commandHistory, cmd);
    expect(scene.color).toBe(0x00ff00ff);

    undo(editor.commandHistory);
    expect(scene.color).toBe(0xff0000ff);

    redo(editor.commandHistory);
    expect(scene.color).toBe(0x00ff00ff);
  });

  it('clear scene with undo restores all children', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    for (const child of [a, b]) addNodeChild(root, child);

    const cmd = createClearSceneCommand(root);
    executeCommand(editor.commandHistory, cmd);
    expect(getNodeChildCount(root)).toBe(0);

    undo(editor.commandHistory);
    expect(getNodeChildCount(root)).toBe(2);
  });

  it('hand tool pans viewport without affecting scene', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(root, node);

    const startCamX = editor.viewport.camera.x;
    const handTool = createHandTool(editor);
    registerTool(editor.toolRegistry, handTool);
    activateTool(editor.toolRegistry, 'hand');

    handTool.pointerDown({ x: 0, y: 0, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
    handTool.pointerMove({ x: 50, y: 0, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
    handTool.pointerUp({ x: 50, y: 0, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });

    expect(editor.viewport.camera.x).not.toBe(startCamX);
    expect(readTransform(node).x).toBe(0);
  });

  it('rulers state integrates with editor', () => {
    const editor = createEditorState();
    expect(isRulerVisible(editor.rulers)).toBe(true);

    hideRulers(editor.rulers);
    expect(isRulerVisible(editor.rulers)).toBe(false);

    showRulers(editor.rulers);
    expect(isRulerVisible(editor.rulers)).toBe(true);
  });
});
