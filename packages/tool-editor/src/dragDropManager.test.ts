import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  beginEditorDrag,
  beginExternalDrag,
  beginHierarchyDrag,
  beginLibraryDrag,
  cancelEditorDrag,
  endEditorDrag,
  getEditorDragPayload,
  getEditorDragPosition,
  getEditorDropTarget,
  isEditorDragging,
  setEditorDropTarget,
  updateEditorDragPosition,
} from './dragDropManager';

describe('beginEditorDrag', () => {
  it('starts a drag operation', () => {
    const editor = createEditorState();
    beginEditorDrag(editor, 'library', 'sprite', { id: 'test' }, 10, 20);
    expect(isEditorDragging(editor)).toBe(true);
    const payload = getEditorDragPayload(editor);
    expect(payload?.source).toBe('library');
    expect(payload?.kind).toBe('sprite');
  });
});

describe('updateEditorDragPosition', () => {
  it('updates the drag position', () => {
    const editor = createEditorState();
    beginEditorDrag(editor, 'library', 'sprite', null, 0, 0);
    updateEditorDragPosition(editor, 50, 60);
    const pos = getEditorDragPosition(editor);
    expect(pos?.x).toBe(50);
    expect(pos?.y).toBe(60);
  });
});

describe('setEditorDropTarget', () => {
  it('sets the current drop target', () => {
    const editor = createEditorState();
    beginEditorDrag(editor, 'library', 'sprite', null, 0, 0);
    const target = { name: 'container' };
    setEditorDropTarget(editor, target);
    expect(getEditorDropTarget(editor)).toBe(target);
  });
});

describe('endEditorDrag', () => {
  it('ends the drag and returns the payload', () => {
    const editor = createEditorState();
    beginEditorDrag(editor, 'library', 'sprite', { id: 'test' }, 0, 0);
    const payload = endEditorDrag(editor);
    expect(payload?.source).toBe('library');
    expect(isEditorDragging(editor)).toBe(false);
  });

  it('returns null when not dragging', () => {
    const editor = createEditorState();
    expect(endEditorDrag(editor)).toBeNull();
  });
});

describe('cancelEditorDrag', () => {
  it('cancels the drag operation', () => {
    const editor = createEditorState();
    beginEditorDrag(editor, 'library', 'sprite', null, 0, 0);
    cancelEditorDrag(editor);
    expect(isEditorDragging(editor)).toBe(false);
  });
});

describe('isEditorDragging', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isEditorDragging(editor)).toBe(false);
  });
});

describe('getEditorDragPayload', () => {
  it('returns null when not dragging', () => {
    const editor = createEditorState();
    expect(getEditorDragPayload(editor)).toBeNull();
  });
});

describe('getEditorDragPosition', () => {
  it('returns the drag position during drag', () => {
    const editor = createEditorState();
    beginEditorDrag(editor, 'library', 'sprite', null, 15, 25);
    const pos = getEditorDragPosition(editor);
    expect(pos?.x).toBe(15);
    expect(pos?.y).toBe(25);
  });
});

describe('getEditorDropTarget', () => {
  it('returns null when no target set', () => {
    const editor = createEditorState();
    expect(getEditorDropTarget(editor)).toBeNull();
  });
});

describe('beginLibraryDrag', () => {
  it('starts a library-sourced drag', () => {
    const editor = createEditorState();
    beginLibraryDrag(editor, 'sprite', { id: 'lib-1' }, 0, 0);
    expect(getEditorDragPayload(editor)?.source).toBe('library');
  });
});

describe('beginHierarchyDrag', () => {
  it('starts a hierarchy-sourced drag', () => {
    const editor = createEditorState();
    beginHierarchyDrag(editor, 'node', { id: 'node-1' }, 0, 0);
    expect(getEditorDragPayload(editor)?.source).toBe('hierarchy');
  });
});

describe('beginExternalDrag', () => {
  it('starts an external-sourced drag', () => {
    const editor = createEditorState();
    beginExternalDrag(editor, 'file', { path: '/test.png' }, 0, 0);
    expect(getEditorDragPayload(editor)?.source).toBe('external');
  });
});
