import { setSelection } from '@flighthq/editor-selection';
import { setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { getInspectorSelectedNames, getInspectorSnapshot } from './inspectorState';

describe('getInspectorSelectedNames', () => {
  it('is exported', () => expect(getInspectorSelectedNames).toBeTypeOf('function'));
});

describe('getInspectorSnapshot', () => {
  it('returns empty snapshot with no selection', () => {
    const editor = createEditorState();
    const snapshot = getInspectorSnapshot(editor);

    expect(snapshot.count).toBe(0);
    expect(snapshot.name).toBeNull();
    expect(snapshot.transform).toBeNull();
    expect(snapshot.node).toBeNull();
  });

  it('returns primary node properties when selected', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    node.name = 'MySprite';
    setNodeTransform2D(node, {
      pivotX: 0,
      pivotY: 0,
      rotation: 0,
      scaleX: 2,
      scaleY: 3,
      skewX: 0,
      skewY: 0,
      x: 10,
      y: 20,
    });
    setSelection(editor.selection, [node]);

    const snapshot = getInspectorSnapshot(editor);

    expect(snapshot.count).toBe(1);
    expect(snapshot.name).toBe('MySprite');
    expect(snapshot.transform).not.toBeNull();
    expect(snapshot.transform!.x).toBe(10);
    expect(snapshot.transform!.y).toBe(20);
    expect(snapshot.transform!.scaleX).toBe(2);
    expect(snapshot.transform!.scaleY).toBe(3);
    expect(snapshot.node).toBe(node);
  });

  it('returns primary from multi-selection', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    a.name = 'A';
    const b = createNode2D(DisplayObjectKind);
    b.name = 'B';
    setSelection(editor.selection, [a, b]);

    const snapshot = getInspectorSnapshot(editor);

    expect(snapshot.count).toBe(2);
    expect(snapshot.name).toBe('A');
    expect(snapshot.node).toBe(a);
  });

  it('returns selected names list', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    a.name = 'Alpha';
    const b = createNode2D(DisplayObjectKind);
    b.name = 'Beta';
    setSelection(editor.selection, [a, b]);

    const names = getInspectorSelectedNames(editor);

    expect(names).toEqual(['Alpha', 'Beta']);
  });

  it('returns empty names list with no selection', () => {
    const editor = createEditorState();
    const names = getInspectorSelectedNames(editor);
    expect(names).toEqual([]);
  });

  it('returns empty string for unnamed nodes', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);

    const names = getInspectorSelectedNames(editor);
    expect(names).toEqual(['']);
  });

  it('snapshot reflects transform changes', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setNodeTransform2D(node, {
      pivotX: 5,
      pivotY: 10,
      rotation: 45,
      scaleX: 2,
      scaleY: 3,
      skewX: 0,
      skewY: 0,
      x: 100,
      y: 200,
    });
    setSelection(editor.selection, [node]);

    const snapshot = getInspectorSnapshot(editor);
    expect(snapshot.transform!.pivotX).toBe(5);
    expect(snapshot.transform!.pivotY).toBe(10);
    expect(snapshot.transform!.rotation).toBe(45);
  });

  it('snapshot count matches selection size', () => {
    const editor = createEditorState();
    const nodes = Array.from({ length: 5 }, () => createNode2D(DisplayObjectKind));
    setSelection(editor.selection, nodes);

    expect(getInspectorSnapshot(editor).count).toBe(5);
    expect(getInspectorSelectedNames(editor)).toHaveLength(5);
  });
});
