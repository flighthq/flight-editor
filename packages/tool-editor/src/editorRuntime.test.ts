import { getSelectedNodes } from '@flighthq/editor-selection';
import { createHeadlessAdapter, getHostAdapter } from '@flighthq/editor-host';
import { addNodeChild } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorRuntime, getRuntimeNode } from './editorRuntime';

describe('createEditorRuntime', () => {
  it('creates the same initialized editor core for any host', () => {
    const gameHostAdapter = createHeadlessAdapter();
    const runtime = createEditorRuntime({ hostAdapter: gameHostAdapter, sceneName: 'Embedded' });
    expect(runtime.state.sceneState.name).toBe('Embedded');
    expect(runtime.state.commandRegistry.size).toBeGreaterThan(0);
    expect(getHostAdapter(runtime.state.host)).toBe(gameHostAdapter);
    runtime.dispose();
    expect(runtime.state.scene).toBeNull();
  });

  it('loads and serializes Flight scenes through the shared serializer', () => {
    const source = createEditorRuntime({ sceneName: 'Shared' });
    const target = createEditorRuntime({ autoCreateScene: false });
    target.load(source.serialize());
    expect(target.state.sceneState.name).toBe('Shared');
  });

  it('selects and edits nodes using shared editor commands', () => {
    const runtime = createEditorRuntime();
    const node = createNode2D(DisplayObjectKind, { name: 'Before', x: 2 });
    addNodeChild(runtime.state.scene!.root, node);
    expect(runtime.selectNode([0])).toBe(true);
    expect(getSelectedNodes(runtime.state.selection)).toEqual([node]);
    expect(runtime.updateNode([0], 'name', 'After')).toBe(true);
    expect(runtime.updateNode([0], 'x', 42)).toBe(true);
    expect(node).toMatchObject({ name: 'After', x: 42 });
    expect(runtime.state.commandHistory.undoStack).toHaveLength(2);
  });

  it('restores valid selection paths after an external document reload', () => {
    const runtime = createEditorRuntime();
    addNodeChild(runtime.state.scene!.root, createNode2D(DisplayObjectKind, { name: 'Persistent' }));
    runtime.selectNode([0]);

    runtime.load(runtime.serialize());

    expect(runtime.getSelectionPaths()).toEqual([[0]]);
    expect(getSelectedNodes(runtime.state.selection)[0]?.name).toBe('Persistent');
  });

  it('provides shared property metadata and applies multi-node edits as one undo step', () => {
    const runtime = createEditorRuntime();
    const first = createNode2D(DisplayObjectKind, { x: 1 });
    const second = createNode2D(DisplayObjectKind, { x: 2 });
    addNodeChild(runtime.state.scene!.root, first);
    addNodeChild(runtime.state.scene!.root, second);

    expect(runtime.getProperties([0]).find(({ id }) => id === 'alpha')).toMatchObject({
      label: 'Opacity',
      min: 0,
      max: 1,
      value: 1,
    });
    expect(runtime.updateNodes([[0], [1]], 'x', 30)).toBe(true);
    expect([first.x, second.x]).toEqual([30, 30]);
    expect(runtime.state.commandHistory.undoStack).toHaveLength(1);
    expect(runtime.undo()).toBe(true);
    expect([first.x, second.x]).toEqual([1, 2]);
    expect(runtime.redo()).toBe(true);
    expect([first.x, second.x]).toEqual([30, 30]);
  });

  it('supports scene construction through registered kinds and guarded hierarchy actions', () => {
    const runtime = createEditorRuntime();
    expect(runtime.getNodeKinds()).toContain(DisplayObjectKind);
    expect(runtime.createNode(DisplayObjectKind)).toBe(true);
    expect(runtime.createNode(DisplayObjectKind, [0])).toBe(true);
    expect(runtime.reparentNode([0], [0, 0])).toBe(false);
    expect(runtime.duplicateNodes([[0, 0]])).toBe(true);
    expect(runtime.deleteNodes([[0, 0]])).toBe(true);
    expect(runtime.canUndo()).toBe(true);
  });

  it('supports multi-selection without allowing the scene root into editable selection', () => {
    const runtime = createEditorRuntime();
    addNodeChild(runtime.state.scene!.root, createNode2D(DisplayObjectKind));
    addNodeChild(runtime.state.scene!.root, createNode2D(DisplayObjectKind));
    expect(runtime.selectNodes([[0], [1]])).toBe(true);
    expect(runtime.getSelectionPaths()).toEqual([[0], [1]]);
    expect(runtime.selectNodes([[]])).toBe(false);
  });

  it('translates multiple nodes as one gesture transaction', () => {
    const runtime = createEditorRuntime();
    const first = createNode2D(DisplayObjectKind, { x: 1, y: 2 });
    const second = createNode2D(DisplayObjectKind, { x: 3, y: 4 });
    addNodeChild(runtime.state.scene!.root, first);
    addNodeChild(runtime.state.scene!.root, second);

    expect(runtime.translateNodes([[0], [1]], 10, -2)).toBe(true);
    expect([first.x, first.y, second.x, second.y]).toEqual([11, 0, 13, 2]);
    expect(runtime.state.commandHistory.undoStack).toHaveLength(1);
    runtime.undo();
    expect([first.x, first.y, second.x, second.y]).toEqual([1, 2, 3, 4]);
  });

  it('optionally snaps completed move gestures to the shared grid', () => {
    const runtime = createEditorRuntime();
    const node = createNode2D(DisplayObjectKind, { x: 2, y: 4 });
    addNodeChild(runtime.state.scene!.root, node);

    runtime.translateNodes([[0]], 4, 12, true);
    expect(node).toMatchObject({ x: 10, y: 20 });
  });

  it('provides host-neutral nested render transforms for presentation hit testing', () => {
    const runtime = createEditorRuntime();
    const parent = createNode2D(DisplayObjectKind, { x: 10, y: 20, scaleX: 2 });
    const child = createNode2D(DisplayObjectKind, { x: 5, y: 3 });
    Object.assign(child, { width: 40, height: 30 });
    addNodeChild(parent, child);
    addNodeChild(runtime.state.scene!.root, parent);

    expect(runtime.getRenderNodes()[1]).toMatchObject({
      path: [0, 0],
      matrix: { a: 2, d: 1, e: 20, f: 23 },
      width: 40,
      height: 30,
    });
  });

  it('scales and rotates a selection in one undoable transform gesture', () => {
    const runtime = createEditorRuntime();
    const node = createNode2D(DisplayObjectKind, { rotation: 0.25, scaleX: 2, scaleY: 3 });
    addNodeChild(runtime.state.scene!.root, node);

    expect(runtime.transformNodes([[0]], 2, 0.5)).toBe(true);
    expect(node).toMatchObject({ rotation: 0.75, scaleX: 4, scaleY: 6 });
    expect(runtime.state.commandHistory.undoStack).toHaveLength(1);
    expect(runtime.transformNodes([[0]], 0, 0)).toBe(false);
  });

  it('rejects root transforms, invalid paths, and invalid values', () => {
    const runtime = createEditorRuntime();
    expect(runtime.updateNode([], 'x', 10)).toBe(false);
    expect(runtime.updateNode([4], 'x', 10)).toBe(false);
    expect(runtime.updateNode([], 'alpha', 2)).toBe(false);
  });
});

describe('getRuntimeNode', () => {
  it('resolves the root and index paths', () => {
    const runtime = createEditorRuntime();
    const child = createNode2D(DisplayObjectKind);
    addNodeChild(runtime.state.scene!.root, child);
    expect(getRuntimeNode(runtime, [])).toBe(runtime.state.scene!.root);
    expect(getRuntimeNode(runtime, [0])).toBe(child);
    expect(getRuntimeNode(runtime, [1])).toBeNull();
  });
});
