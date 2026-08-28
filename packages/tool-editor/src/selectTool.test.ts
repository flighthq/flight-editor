import { getSelectedNodes, getSelectionCount, isSelected } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';

import { createSelectTool } from './selectTool';

import type { EditorPointerEvent } from '@flighthq/editor-tool';

function makeEvent(overrides: Partial<EditorPointerEvent> = {}): EditorPointerEvent {
  return {
    x: 100,
    y: 100,
    button: 0,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    ...overrides,
  };
}

describe('createSelectTool', () => {
  it('selects a hit node on pointer down', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const tool = createSelectTool(editor, () => node);

    tool.pointerDown(makeEvent());

    expect(getSelectionCount(editor.selection)).toBe(1);
    expect(isSelected(editor.selection, node)).toBe(true);
  });

  it('clears selection when clicking empty space', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const tool = createSelectTool(editor, () => null);

    editor.selection.nodes.push(node);
    editor.selection.version++;

    tool.pointerDown(makeEvent());

    expect(getSelectionCount(editor.selection)).toBe(0);
  });

  it('does not clear selection when shift-clicking empty space', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const tool = createSelectTool(editor, () => null);

    editor.selection.nodes.push(node);
    editor.selection.version++;

    tool.pointerDown(makeEvent({ shiftKey: true }));

    expect(getSelectionCount(editor.selection)).toBe(1);
  });

  it('adds to selection with shift-click', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    const tool = createSelectTool(editor, (x) => (x < 200 ? a : b));

    tool.pointerDown(makeEvent({ x: 100 }));
    expect(getSelectionCount(editor.selection)).toBe(1);

    tool.pointerDown(makeEvent({ x: 300, shiftKey: true }));
    expect(getSelectionCount(editor.selection)).toBe(2);
    expect(isSelected(editor.selection, a)).toBe(true);
    expect(isSelected(editor.selection, b)).toBe(true);
  });

  it('removes from selection with shift-click on already selected', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    const tool = createSelectTool(editor, () => node);

    tool.pointerDown(makeEvent());
    expect(getSelectionCount(editor.selection)).toBe(1);

    tool.pointerDown(makeEvent({ shiftKey: true }));
    expect(getSelectionCount(editor.selection)).toBe(0);
  });

  it('does not re-select an already selected node without shift', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    const tool = createSelectTool(editor, () => a);

    tool.pointerDown(makeEvent());
    const versionAfterFirst = editor.selection.version;

    tool.pointerDown(makeEvent());
    expect(editor.selection.version).toBe(versionAfterFirst);
    expect(getSelectedNodes(editor.selection)).toEqual([a]);
  });
});
