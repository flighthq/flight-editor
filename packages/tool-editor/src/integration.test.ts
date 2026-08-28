import {
  clearCommandHistory,
  executeCommand,
  getCommandHistoryUndoCount,
  isCommandHistoryClean,
  markCommandHistoryClean,
  redo,
  undo,
} from '@flighthq/editor-command';
import { expandHierarchyNode, getHierarchyRows } from '@flighthq/editor-hierarchy';
import { isLocked } from '@flighthq/editor-lock';
import { registerNodeKind } from '@flighthq/editor-node-factory';
import { hideRulers, isRulerVisible, showRulers } from '@flighthq/editor-rulers';
import { getSelectionCount, isSelected, setSelection } from '@flighthq/editor-selection';
import { activateTool, registerTool } from '@flighthq/editor-tool';
import {
  addNodeChild,
  getNodeChildAt,
  getNodeChildCount,
  getNodeChildren,
  getNodeParent,
  getNodeTransform2D,
  setNodeTransform2D,
} from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
import { BlendMode, DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { Transform2DLike } from '@flighthq/types';

import { createAddNodeCommand } from './commands/addNodeCommand';
import { createAlignNodesCommand } from './commands/alignNodesCommand';
import { createClearSceneCommand } from './commands/clearSceneCommand';
import { createCopySelectionCommand } from './commands/copySelectionCommand';
import { createDeleteSelectionCommand } from './commands/deleteSelectionCommand';
import { createDuplicateSelectionCommand } from './commands/duplicateSelectionCommand';
import { createGroupNodesCommand } from './commands/groupNodesCommand';
import { createLockSelectionCommand } from './commands/lockSelectionCommand';
import { createPasteNodesCommand } from './commands/pasteNodesCommand';
import { createRemoveNodeCommand } from './commands/removeNodeCommand';
import { createReparentNodeCommand } from './commands/reparentNodeCommand';
import { createSetAlphaCommand } from './commands/setAlphaCommand';
import { createSetBlendModeCommand } from './commands/setBlendModeCommand';
import { createSetNodeNameCommand } from './commands/setNodeNameCommand';
import { createSetSceneColorCommand } from './commands/setSceneColorCommand';
import { createSetTransform2DCommand } from './commands/setTransform2DCommand';
import { createSetVisibleCommand } from './commands/setVisibleCommand';
import { createUngroupNodesCommand } from './commands/ungroupNodesCommand';
import {
  createBringForwardCommand,
  createBringToFrontCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
} from './commands/zOrderCommands';
import { createEditorState, setEditorScene } from './editorState';
import { createHandTool } from './handTool';
import { getInspectorSelectedNames, getInspectorSnapshot } from './inspectorState';
import { createMoveTool } from './moveTool';
import { createScaleTool } from './scaleTool';
import { createSelectTool } from './selectTool';
import { createZoomTool } from './zoomTool';

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

  it('command history stress: 20 commands with full undo/redo cycle', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(root, node);

    for (let i = 0; i < 20; i++) {
      executeCommand(
        editor.commandHistory,
        createSetTransform2DCommand(node, {
          pivotX: 0,
          pivotY: 0,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          skewY: 0,
          x: i * 10,
          y: i * 5,
        }),
      );
    }

    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(20);

    for (let i = 0; i < 20; i++) undo(editor.commandHistory);
    expect(readTransform(node).x).toBe(0);
    expect(readTransform(node).y).toBe(0);

    for (let i = 0; i < 20; i++) redo(editor.commandHistory);
    expect(readTransform(node).x).toBe(190);
    expect(readTransform(node).y).toBe(95);
  });

  it('interleaved command types: undo preserves each command state independently', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const node = createNode2D(DisplayObjectKind);
    node.name = 'Original';
    addNodeChild(root, node);

    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'Renamed'));
    executeCommand(editor.commandHistory, createSetAlphaCommand(node, 0.5));
    executeCommand(editor.commandHistory, createSetBlendModeCommand(node, BlendMode.Multiply));
    executeCommand(editor.commandHistory, createSetVisibleCommand(node, false));

    expect(node.name).toBe('Renamed');
    expect(node.alpha).toBe(0.5);
    expect(node.blendMode).toBe(BlendMode.Multiply);
    expect(node.visible).toBe(false);

    undo(editor.commandHistory);
    expect(node.visible).toBe(true);
    expect(node.blendMode).toBe(BlendMode.Multiply);

    undo(editor.commandHistory);
    expect(node.blendMode).toBeNull();
    expect(node.alpha).toBe(0.5);

    undo(editor.commandHistory);
    expect(node.alpha).toBe(1);
    expect(node.name).toBe('Renamed');

    undo(editor.commandHistory);
    expect(node.name).toBe('Original');
  });

  it('new command after undo clears redo stack', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);

    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'A'));
    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'B'));
    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'C'));

    undo(editor.commandHistory);
    undo(editor.commandHistory);
    expect(node.name).toBe('A');

    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'D'));
    expect(redo(editor.commandHistory)).toBe(false);
    expect(node.name).toBe('D');
  });

  it('clean tracking across command history', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);

    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'A'));
    markCommandHistoryClean(editor.commandHistory);
    expect(isCommandHistoryClean(editor.commandHistory)).toBe(true);

    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'B'));
    expect(isCommandHistoryClean(editor.commandHistory)).toBe(false);

    undo(editor.commandHistory);
    expect(isCommandHistoryClean(editor.commandHistory)).toBe(true);
  });

  it('duplicate selection with undo at each step', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    a.name = 'Source';
    addNodeChild(root, a);
    setSelection(editor.selection, [a]);

    executeCommand(editor.commandHistory, createDuplicateSelectionCommand(editor));
    expect(getNodeChildCount(root)).toBe(2);
    const dup = getNodeChildAt(root, 1)!;
    expect(dup.name).toBe('Source Copy');

    setSelection(editor.selection, [dup]);
    executeCommand(editor.commandHistory, createDuplicateSelectionCommand(editor));
    expect(getNodeChildCount(root)).toBe(3);

    undo(editor.commandHistory);
    expect(getNodeChildCount(root)).toBe(2);

    undo(editor.commandHistory);
    expect(getNodeChildCount(root)).toBe(1);
    expect(getNodeChildAt(root, 0)).toBe(a);
  });

  it('group → ungroup round-trip preserves tree structure', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    addNodeChild(root, a);
    addNodeChild(root, b);
    addNodeChild(root, c);

    const group = createNode2D(DisplayObjectKind);
    const groupCmd = createGroupNodesCommand([a, b], group);
    executeCommand(editor.commandHistory, groupCmd);

    expect(getNodeChildren(root).length).toBe(2);
    expect(getNodeParent(a)).toBe(group);
    expect(getNodeParent(b)).toBe(group);

    const ungroupCmd = createUngroupNodesCommand(group);
    executeCommand(editor.commandHistory, ungroupCmd);

    expect(getNodeChildren(root).length).toBe(3);
    expect(getNodeParent(a)).toBe(root);
    expect(getNodeParent(b)).toBe(root);

    undo(editor.commandHistory);
    expect(getNodeParent(a)).toBe(group);
    expect(getNodeParent(b)).toBe(group);

    undo(editor.commandHistory);
    expect(getNodeChildren(root).length).toBe(3);
    expect(getNodeChildren(root)[0]).toBe(a);
    expect(getNodeChildren(root)[1]).toBe(b);
    expect(getNodeChildren(root)[2]).toBe(c);
  });

  it('lock node → verify lock state via command', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addNodeChild(root, a);
    addNodeChild(root, b);

    setSelection(editor.selection, [a]);
    executeCommand(editor.commandHistory, createLockSelectionCommand(editor));
    expect(isLocked(editor.locks, a)).toBe(true);
    expect(isLocked(editor.locks, b)).toBe(false);

    undo(editor.commandHistory);
    expect(isLocked(editor.locks, a)).toBe(false);
  });

  it('z-order commands through history', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const c = createNode2D(DisplayObjectKind);
    addNodeChild(root, a);
    addNodeChild(root, b);
    addNodeChild(root, c);

    executeCommand(editor.commandHistory, createBringToFrontCommand(a));
    expect(getNodeChildAt(root, 2)).toBe(a);

    executeCommand(editor.commandHistory, createSendToBackCommand(a));
    expect(getNodeChildAt(root, 0)).toBe(a);

    undo(editor.commandHistory);
    expect(getNodeChildAt(root, 2)).toBe(a);

    undo(editor.commandHistory);
    expect(getNodeChildAt(root, 0)).toBe(a);
  });

  it('align nodes through history', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const nodes = [0, 50, 100].map((x) => {
      const n = createNode2D(DisplayObjectKind);
      setNodeTransform2D(n, {
        pivotX: 0,
        pivotY: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        x,
        y: 0,
      });
      addNodeChild(root, n);
      return n;
    });

    executeCommand(editor.commandHistory, createAlignNodesCommand(nodes, 'left'));
    expect(nodes.every((n) => readTransform(n).x === 0)).toBe(true);

    undo(editor.commandHistory);
    expect(readTransform(nodes[0]).x).toBe(0);
    expect(readTransform(nodes[1]).x).toBe(50);
    expect(readTransform(nodes[2]).x).toBe(100);
  });

  it('inspector snapshot updates with selection changes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    a.name = 'NodeA';
    const b = createNode2D(DisplayObjectKind);
    b.name = 'NodeB';

    expect(getInspectorSnapshot(editor).count).toBe(0);

    setSelection(editor.selection, [a]);
    const snap1 = getInspectorSnapshot(editor);
    expect(snap1.count).toBe(1);
    expect(snap1.name).toBe('NodeA');
    expect(snap1.node).toBe(a);

    setSelection(editor.selection, [a, b]);
    const snap2 = getInspectorSnapshot(editor);
    expect(snap2.count).toBe(2);
    expect(getInspectorSelectedNames(editor)).toEqual(['NodeA', 'NodeB']);
  });

  it('zoom tool integrates with viewport state', () => {
    const editor = createEditorState();
    const zoomTool = createZoomTool(editor);
    registerTool(editor.toolRegistry, zoomTool);
    activateTool(editor.toolRegistry, 'zoom');

    const initialZoom = editor.viewport.camera.zoom;
    zoomTool.pointerDown({ x: 400, y: 300, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });
    zoomTool.pointerUp({ x: 400, y: 300, button: 0, shiftKey: false, ctrlKey: false, altKey: false, metaKey: false });

    expect(editor.viewport.camera.zoom).toBeGreaterThan(initialZoom);
  });

  it('clear history resets all tracking', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);

    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'A'));
    executeCommand(editor.commandHistory, createSetNodeNameCommand(node, 'B'));
    markCommandHistoryClean(editor.commandHistory);

    clearCommandHistory(editor.commandHistory);
    expect(getCommandHistoryUndoCount(editor.commandHistory)).toBe(0);
    expect(isCommandHistoryClean(editor.commandHistory)).toBe(true);
    expect(undo(editor.commandHistory)).toBe(false);
  });

  it('reparent via command then undo restores original parent', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const parent1 = createNode2D(DisplayObjectKind);
    const parent2 = createNode2D(DisplayObjectKind);
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(root, parent1);
    addNodeChild(root, parent2);
    addNodeChild(parent1, child);

    executeCommand(editor.commandHistory, createReparentNodeCommand(child, parent2));
    expect(getNodeParent(child)).toBe(parent2);
    expect(getNodeChildCount(parent1)).toBe(0);
    expect(getNodeChildCount(parent2)).toBe(1);

    undo(editor.commandHistory);
    expect(getNodeParent(child)).toBe(parent1);
    expect(getNodeChildCount(parent1)).toBe(1);
    expect(getNodeChildCount(parent2)).toBe(0);
  });

  it('delete and re-add through history preserves node identity', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const node = createNode2D(DisplayObjectKind);
    node.name = 'Persistent';
    addNodeChild(root, node);

    executeCommand(editor.commandHistory, createRemoveNodeCommand(node));
    expect(getNodeChildCount(root)).toBe(0);

    undo(editor.commandHistory);
    expect(getNodeChildCount(root)).toBe(1);
    expect(getNodeChildAt(root, 0)).toBe(node);
    expect(getNodeChildAt(root, 0)!.name).toBe('Persistent');
  });

  it('copy → paste to different parent → undo paste → redo paste cycle', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const source = createNode2D(DisplayObjectKind);
    const target = createNode2D(DisplayObjectKind);
    source.name = 'Source';
    addNodeChild(root, source);
    addNodeChild(root, target);

    setSelection(editor.selection, [source]);
    executeCommand(editor.commandHistory, createCopySelectionCommand(editor, 'copy'));

    const pasteCmd = createPasteNodesCommand(editor, target);
    executeCommand(editor.commandHistory, pasteCmd);
    expect(getNodeChildCount(target)).toBe(1);
    expect(getNodeChildAt(target, 0)).toBe(source);

    undo(editor.commandHistory);
    expect(getNodeChildCount(target)).toBe(0);

    redo(editor.commandHistory);
    expect(getNodeChildCount(target)).toBe(1);
  });

  it('duplicate → lock → delete → undo all restores state', () => {
    const editor = createEditorState();
    const scene = createScene2D();
    setEditorScene(editor, scene);
    const root = scene.root;

    const node = createNode2D(DisplayObjectKind);
    node.name = 'Original';
    addNodeChild(root, node);
    setSelection(editor.selection, [node]);

    executeCommand(editor.commandHistory, createDuplicateSelectionCommand(editor));
    expect(getNodeChildCount(root)).toBe(2);

    const dup = getNodeChildAt(root, 1)!;
    setSelection(editor.selection, [dup]);

    executeCommand(editor.commandHistory, createLockSelectionCommand(editor));
    expect(isLocked(editor.locks, dup)).toBe(true);

    executeCommand(editor.commandHistory, createDeleteSelectionCommand(editor));
    expect(getNodeChildCount(root)).toBe(1);

    undo(editor.commandHistory);
    undo(editor.commandHistory);
    undo(editor.commandHistory);
    expect(getNodeChildCount(root)).toBe(1);
    expect(getNodeChildAt(root, 0)).toBe(node);
    expect(isLocked(editor.locks, dup)).toBe(false);
  });

  it('set alpha + blend mode + visible compose independently', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);

    executeCommand(editor.commandHistory, createSetAlphaCommand(node, 0.5));
    executeCommand(editor.commandHistory, createSetBlendModeCommand(node, BlendMode.Multiply));
    executeCommand(editor.commandHistory, createSetVisibleCommand(node, false));

    expect(node.alpha).toBe(0.5);
    expect(node.blendMode).toBe(BlendMode.Multiply);
    expect(node.visible).toBe(false);

    undo(editor.commandHistory);
    expect(node.visible).toBe(true);
    expect(node.blendMode).toBe(BlendMode.Multiply);

    undo(editor.commandHistory);
    expect(node.blendMode).toBeNull();
    expect(node.alpha).toBe(0.5);

    undo(editor.commandHistory);
    expect(node.alpha).toBe(1);
  });

  it('scene color + clear scene + undo restores both', () => {
    const editor = createEditorState();
    const scene = createScene2D({ color: 0xff0000ff });
    setEditorScene(editor, scene);
    const root = scene.root;

    const node = createNode2D(DisplayObjectKind);
    addNodeChild(root, node);

    executeCommand(editor.commandHistory, createSetSceneColorCommand(scene, 0x00ff00ff));
    executeCommand(editor.commandHistory, createClearSceneCommand(root));

    expect(scene.color).toBe(0x00ff00ff);
    expect(getNodeChildCount(root)).toBe(0);

    undo(editor.commandHistory);
    expect(getNodeChildCount(root)).toBe(1);

    undo(editor.commandHistory);
    expect(scene.color).toBe(0xff0000ff);
  });
});
