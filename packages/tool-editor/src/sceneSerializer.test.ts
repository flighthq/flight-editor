import { addToSelection, getSelectionCount } from '@flighthq/editor-selection';
import { addNodeChild, getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { createNewScene } from './sceneManager';
import { deserializeScene, getSerializerFormats, serializeScene } from './sceneSerializer';

describe('serializeScene', () => {
  it('serializes scene metadata, fit settings, traits, and hierarchy to UTF-8 JSON', () => {
    const editor = createEditorState();
    createNewScene(editor, 640, 480, 'Round Trip');
    editor.scene!.align = 'top';
    editor.scene!.scaleMode = 'showall';
    editor.scene!.color = 0x123456ff;
    const parent = createNode2D(DisplayObjectKind, { alpha: 0.5, name: 'parent', x: 12, y: 34 });
    const child = createNode2D(DisplayObjectKind, { name: 'child' });
    addNodeChild(parent, child);
    addNodeChild(editor.scene!.root, parent);

    const value = JSON.parse(new TextDecoder().decode(serializeScene(editor)));
    expect(value).toMatchObject({
      format: 'flight-scene',
      version: 1,
      name: 'Round Trip',
      scene: { align: 'top', color: 0x123456ff, scaleMode: 'showall', width: 640, height: 480 },
    });
    expect(value.scene.root.children[0]).toMatchObject({
      kind: DisplayObjectKind,
      traits: { alpha: 0.5, name: 'parent', x: 12, y: 34 },
    });
    expect(value.scene.root.children[0].children[0].traits.name).toBe('child');
  });

  it('rejects serialization when the editor has no scene', () => {
    expect(() => serializeScene(createEditorState())).toThrow('without a scene');
  });
});

describe('deserializeScene', () => {
  it('reconstructs a fresh Scene2D and synchronizes editor scene state', () => {
    const source = createEditorState();
    createNewScene(source, 1024, 768, 'Loaded Scene');
    source.scene!.color = 0xabcdef12;
    const parent = createNode2D(DisplayObjectKind, { name: 'parent', rotation: 0.25, x: 20 });
    addNodeChild(parent, createNode2D(DisplayObjectKind, { name: 'nested', visible: false }));
    addNodeChild(source.scene!.root, parent);
    const data = serializeScene(source);

    const target = createEditorState();
    createNewScene(target, 10, 20, 'Old Scene');
    const oldScene = target.scene;
    addToSelection(target.selection, target.scene!.root);
    deserializeScene(target, data);

    expect(target.scene).not.toBe(oldScene);
    expect(target.sceneState).toMatchObject({ name: 'Loaded Scene', width: 1024, height: 768, dirty: false });
    expect(target.scene).toMatchObject({ color: 0xabcdef12, scene2dWidth: 1024, scene2dHeight: 768 });
    expect(getSelectionCount(target.selection)).toBe(0);
    expect(getNodeChildCount(target.scene!.root)).toBe(1);
    const restoredParent = getNodeChildAt(target.scene!.root, 0)!;
    expect(restoredParent).toMatchObject({ name: 'parent', rotation: 0.25, x: 20 });
    expect(getNodeChildAt(restoredParent, 0)).toMatchObject({ name: 'nested', visible: false });
  });

  it('rejects malformed or unsupported data without replacing the current scene', () => {
    const editor = createEditorState();
    createNewScene(editor);
    const scene = editor.scene;
    const malformed = new TextEncoder().encode('{"format":"other"}').buffer as ArrayBuffer;
    expect(() => deserializeScene(editor, malformed)).toThrow('Invalid Flight scene data');
    expect(editor.scene).toBe(scene);
  });

  it('preserves unknown document and scene fields through visual edits', () => {
    const source = {
      format: 'flight-scene',
      version: 1,
      name: 'Extensible',
      backgroundColor: 0xffffffff,
      pluginData: { timeline: 'intro' },
      scene: {
        align: 'center',
        color: null,
        scaleMode: 'showall',
        width: 800,
        height: 600,
        physics: { gravity: 9.8 },
        root: { kind: DisplayObjectKind, traits: {}, children: [] },
      },
    };
    const editor = createEditorState();
    deserializeScene(editor, new TextEncoder().encode(JSON.stringify(source)).buffer as ArrayBuffer);

    const saved = JSON.parse(new TextDecoder().decode(serializeScene(editor)));
    expect(saved.pluginData).toEqual({ timeline: 'intro' });
    expect(saved.scene.physics).toEqual({ gravity: 9.8 });
  });
});

describe('getSerializerFormats', () => {
  it('reports the JSON-backed Flight scene formats', () => {
    expect(getSerializerFormats()).toEqual(['flight', 'json']);
  });

  it('returns an immutable shared format list', () => {
    expect(Object.isFrozen(getSerializerFormats())).toBe(true);
    expect(getSerializerFormats()).toBe(getSerializerFormats());
  });
});
