import { setHostCallbacks } from '@flighthq/editor-host';
import { describe, expect, it, vi } from 'vitest';

import { createEditorState } from './editorState';
import { captureBridgeSnapshot, hasBridgeChanges, notifyHostChanges } from './hostCallbackBridge';

import type { BridgeSnapshot } from './hostCallbackBridge';

describe('captureBridgeSnapshot', () => {
  it('captures initial state', () => {
    const editor = createEditorState();
    const snapshot = captureBridgeSnapshot(editor);
    expect(snapshot.dirty).toBe(false);
    expect(snapshot.title).toBe('Untitled');
    expect(snapshot.selectionCount).toBe(0);
    expect(snapshot.toolId).toBeNull();
    expect(snapshot.zoom).toBe(1);
  });
});

describe('notifyHostChanges', () => {
  it('calls onDirtyChange when dirty changes', () => {
    const editor = createEditorState();
    const onDirtyChange = vi.fn();
    setHostCallbacks(editor.host, { onDirtyChange });

    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: true, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };

    notifyHostChanges(editor, prev, curr);
    expect(onDirtyChange).toHaveBeenCalledWith(true);
  });

  it('calls onTitleChange when title changes', () => {
    const editor = createEditorState();
    const onTitleChange = vi.fn();
    setHostCallbacks(editor.host, { onTitleChange });

    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: false, title: 'B', selectionCount: 0, toolId: null, zoom: 1 };

    notifyHostChanges(editor, prev, curr);
    expect(onTitleChange).toHaveBeenCalledWith('B');
  });

  it('calls onSelectionChange when count changes', () => {
    const editor = createEditorState();
    const onSelectionChange = vi.fn();
    setHostCallbacks(editor.host, { onSelectionChange });

    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 3, toolId: null, zoom: 1 };

    notifyHostChanges(editor, prev, curr);
    expect(onSelectionChange).toHaveBeenCalledWith(3);
  });

  it('calls onToolChange when tool changes', () => {
    const editor = createEditorState();
    const onToolChange = vi.fn();
    setHostCallbacks(editor.host, { onToolChange });

    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: 'select', zoom: 1 };

    notifyHostChanges(editor, prev, curr);
    expect(onToolChange).toHaveBeenCalledWith('select');
  });

  it('calls onZoomChange when zoom changes', () => {
    const editor = createEditorState();
    const onZoomChange = vi.fn();
    setHostCallbacks(editor.host, { onZoomChange });

    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 2 };

    notifyHostChanges(editor, prev, curr);
    expect(onZoomChange).toHaveBeenCalledWith(2);
  });

  it('does not call callbacks when nothing changes', () => {
    const editor = createEditorState();
    const onDirtyChange = vi.fn();
    const onTitleChange = vi.fn();
    setHostCallbacks(editor.host, { onDirtyChange, onTitleChange });

    const snapshot: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };

    notifyHostChanges(editor, snapshot, snapshot);
    expect(onDirtyChange).not.toHaveBeenCalled();
    expect(onTitleChange).not.toHaveBeenCalled();
  });

  it('handles missing callbacks gracefully', () => {
    const editor = createEditorState();
    setHostCallbacks(editor.host, {});

    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: true, title: 'B', selectionCount: 1, toolId: 'pen', zoom: 2 };

    notifyHostChanges(editor, prev, curr);
  });
});

describe('hasBridgeChanges', () => {
  it('returns false when snapshots are identical', () => {
    const snapshot: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    expect(hasBridgeChanges(snapshot, snapshot)).toBe(false);
  });

  it('returns true when dirty changes', () => {
    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: true, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    expect(hasBridgeChanges(prev, curr)).toBe(true);
  });

  it('returns true when title changes', () => {
    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: false, title: 'B', selectionCount: 0, toolId: null, zoom: 1 };
    expect(hasBridgeChanges(prev, curr)).toBe(true);
  });

  it('returns true when zoom changes', () => {
    const prev: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 1 };
    const curr: BridgeSnapshot = { dirty: false, title: 'A', selectionCount: 0, toolId: null, zoom: 0.5 };
    expect(hasBridgeChanges(prev, curr)).toBe(true);
  });
});
