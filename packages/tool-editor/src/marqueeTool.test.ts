import { getSelectedNodes, getSelectionCount, isSelected, setSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it, vi } from 'vitest';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { MarqueeHitTestFn } from './marqueeTool';

import { createEditorState } from './editorState';
import { createMarqueeTool } from './marqueeTool';

function makeEvent(overrides: Partial<EditorPointerEvent> = {}): EditorPointerEvent {
  return {
    x: 0,
    y: 0,
    button: 0,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    ...overrides,
  };
}

describe('createMarqueeTool', () => {
  it('exposes a normalized current rectangle throughout a reverse drag', () => {
    const tool = createMarqueeTool(createEditorState(), () => []);

    tool.pointerDown(makeEvent({ x: 100, y: 80 }));
    expect(tool.currentRect).toEqual({ x1: 100, y1: 80, x2: 100, y2: 80 });

    tool.pointerMove(makeEvent({ x: 20, y: 30 }));
    expect(tool.currentRect).toEqual({ x1: 20, y1: 30, x2: 100, y2: 80 });
  });

  it('does not hit-test or change selection during pointer move', () => {
    const editor = createEditorState();
    const existing = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [existing]);
    const hitTest = vi.fn<MarqueeHitTestFn>(() => []);
    const tool = createMarqueeTool(editor, hitTest);

    tool.pointerDown(makeEvent({ x: 1, y: 2 }));
    tool.pointerMove(makeEvent({ x: 10, y: 20 }));

    expect(hitTest).not.toHaveBeenCalled();
    expect(getSelectedNodes(editor.selection)).toEqual([existing]);
  });

  it('hit-tests the completed normalized rectangle and replaces selection', () => {
    const editor = createEditorState();
    const previous = createNode2D(DisplayObjectKind);
    const first = createNode2D(DisplayObjectKind);
    const second = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [previous]);
    const hitTest = vi.fn<MarqueeHitTestFn>(() => [first, second]);
    const tool = createMarqueeTool(editor, hitTest);

    tool.pointerDown(makeEvent({ x: 50, y: 70 }));
    tool.pointerUp(makeEvent({ x: 10, y: 20 }));

    expect(hitTest).toHaveBeenCalledWith(10, 20, 50, 70);
    expect(getSelectedNodes(editor.selection)).toEqual([first, second]);
    expect(tool.currentRect).toBeNull();
  });

  it('adds hit nodes to the existing selection while shift is held', () => {
    const editor = createEditorState();
    const existing = createNode2D(DisplayObjectKind);
    const added = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [existing]);
    const tool = createMarqueeTool(editor, () => [added]);

    tool.pointerDown(makeEvent());
    tool.pointerUp(makeEvent({ x: 10, y: 10, shiftKey: true }));

    expect(isSelected(editor.selection, existing)).toBe(true);
    expect(isSelected(editor.selection, added)).toBe(true);
    expect(getSelectionCount(editor.selection)).toBe(2);
  });

  it('does not duplicate nodes already selected during a shift marquee', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [node]);
    const tool = createMarqueeTool(editor, () => [node, node]);

    tool.pointerDown(makeEvent());
    tool.pointerUp(makeEvent({ x: 10, y: 10, shiftKey: true }));

    expect(getSelectedNodes(editor.selection)).toEqual([node]);
  });

  it('ignores pointer up when no marquee drag is active', () => {
    const editor = createEditorState();
    const hitTest = vi.fn<MarqueeHitTestFn>(() => []);
    const tool = createMarqueeTool(editor, hitTest);

    tool.pointerUp(makeEvent({ x: 10, y: 10 }));

    expect(hitTest).not.toHaveBeenCalled();
    expect(editor.selection.version).toBe(0);
  });

  it('cancels an active marquee when deactivated', () => {
    const editor = createEditorState();
    const hitTest = vi.fn<MarqueeHitTestFn>(() => []);
    const tool = createMarqueeTool(editor, hitTest);
    tool.pointerDown(makeEvent({ x: 1, y: 2 }));

    tool.deactivate();
    tool.pointerUp(makeEvent({ x: 10, y: 20 }));

    expect(tool.currentRect).toBeNull();
    expect(hitTest).not.toHaveBeenCalled();
  });

  it('has id "marquee"', () => {
    const tool = createMarqueeTool(createEditorState(), () => []);
    expect(tool.id).toBe('marquee');
  });

  it('clears selection when no nodes are hit', () => {
    const editor = createEditorState();
    const existing = createNode2D(DisplayObjectKind);
    setSelection(editor.selection, [existing]);
    const tool = createMarqueeTool(editor, () => []);

    tool.pointerDown(makeEvent({ x: 0, y: 0 }));
    tool.pointerUp(makeEvent({ x: 100, y: 100 }));

    expect(getSelectionCount(editor.selection)).toBe(0);
  });

  it('pointer move without pointer down does nothing', () => {
    const tool = createMarqueeTool(createEditorState(), () => []);

    tool.pointerMove(makeEvent({ x: 50, y: 50 }));

    expect(tool.currentRect).toBeNull();
  });
});
