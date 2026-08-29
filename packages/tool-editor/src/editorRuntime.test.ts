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
