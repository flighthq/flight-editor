import { setSelection } from '@flighthq/editor-selection';
import { addExportSlice } from '@flighthq/editor-export-settings';
import { addPage } from '@flighthq/editor-page';
import { setTextColor, setTextFontSize } from '@flighthq/editor-text-style';
import { setTransformOriginMode } from '@flighthq/editor-transform-origin';
import { setNodeTransform2D } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { createTextLabel } from '@flighthq/text';
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
    expect(snapshot.textStyle).toBeNull();
    expect(snapshot.transformOriginMode).toBe('center');
    expect(snapshot.exportSlices).toEqual([]);
    expect(snapshot.activePage).toBeNull();
    expect(snapshot.zoom).toBe(1);
    expect(snapshot.zoomPreset?.id).toBe('100%');
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

  it('includes text, origin, export, page, and zoom context', () => {
    const editor = createEditorState();
    const text = createTextLabel({ name: 'headline' });
    const graphic = createNode2D(DisplayObjectKind, { name: 'graphic' });
    setSelection(editor.selection, [text, graphic]);
    setTextFontSize(editor.textStyle, 32);
    setTextColor(editor.textStyle, 0x336699);
    setTransformOriginMode(editor.transformOrigin, 'bottomRight');
    addExportSlice(editor.exportSettings, {
      nodeId: 'headline',
      format: 'svg',
      scale: 2,
      suffix: '@2x',
      enabled: true,
    });
    addPage(editor.pages, { id: 'page-a', name: 'Page A', width: 800, height: 600, color: null });
    editor.viewport.camera.zoom = 1.8;

    const snapshot = getInspectorSnapshot(editor);
    expect(snapshot.textStyle).toMatchObject({ fontSize: 32, color: 0x336699 });
    expect(snapshot.textStyle).not.toBe(editor.textStyle);
    expect(snapshot.transformOriginMode).toBe('bottomRight');
    expect(snapshot.exportSlices).toEqual([
      { nodeId: 'headline', format: 'svg', scale: 2, suffix: '@2x', enabled: true },
    ]);
    expect(snapshot.activePage).toEqual({ id: 'page-a', name: 'Page A', width: 800, height: 600, color: null });
    expect(snapshot.zoom).toBe(1.8);
    expect(snapshot.zoomPreset).toEqual({ id: '200%', label: '200%', zoom: 2 });
  });

  it('omits text style when no selected node is text-capable', () => {
    const editor = createEditorState();
    setSelection(editor.selection, [createNode2D(DisplayObjectKind)]);
    expect(getInspectorSnapshot(editor).textStyle).toBeNull();
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
