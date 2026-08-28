import { addToSelection, clearSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  clearEditorLocks,
  getEditorLockedCount,
  hasLockedSelection,
  isEditorNodeLocked,
  isSelectionLocked,
  isSelectionPartiallyLocked,
  lockEditorNode,
  lockSelectedNodes,
  toggleEditorNodeLock,
  toggleSelectedLocks,
  unlockEditorNode,
  unlockSelectedNodes,
} from './lockManager';

describe('lockSelectedNodes', () => {
  it('locks all selected nodes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    addToSelection(editor.selection, b);
    const count = lockSelectedNodes(editor);
    expect(count).toBe(2);
    expect(isEditorNodeLocked(editor, a)).toBe(true);
    expect(isEditorNodeLocked(editor, b)).toBe(true);
  });

  it('skips already-locked nodes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    lockEditorNode(editor, a);
    expect(lockSelectedNodes(editor)).toBe(0);
  });
});

describe('unlockSelectedNodes', () => {
  it('unlocks all selected nodes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    lockEditorNode(editor, a);
    const count = unlockSelectedNodes(editor);
    expect(count).toBe(1);
    expect(isEditorNodeLocked(editor, a)).toBe(false);
  });

  it('skips already-unlocked nodes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    expect(unlockSelectedNodes(editor)).toBe(0);
  });
});

describe('toggleSelectedLocks', () => {
  it('toggles lock state on selected nodes', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    toggleSelectedLocks(editor);
    expect(isEditorNodeLocked(editor, a)).toBe(true);
    toggleSelectedLocks(editor);
    expect(isEditorNodeLocked(editor, a)).toBe(false);
  });
});

describe('isSelectionLocked', () => {
  it('returns true when all selected nodes are locked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    lockEditorNode(editor, a);
    expect(isSelectionLocked(editor)).toBe(true);
  });

  it('returns false when no selection', () => {
    const editor = createEditorState();
    expect(isSelectionLocked(editor)).toBe(false);
  });

  it('returns false when only some are locked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    addToSelection(editor.selection, b);
    lockEditorNode(editor, a);
    expect(isSelectionLocked(editor)).toBe(false);
  });
});

describe('isSelectionPartiallyLocked', () => {
  it('returns true when some but not all are locked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    addToSelection(editor.selection, b);
    lockEditorNode(editor, a);
    expect(isSelectionPartiallyLocked(editor)).toBe(true);
  });

  it('returns false when all are locked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    lockEditorNode(editor, a);
    expect(isSelectionPartiallyLocked(editor)).toBe(false);
  });

  it('returns false when none are locked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    expect(isSelectionPartiallyLocked(editor)).toBe(false);
  });
});

describe('isEditorNodeLocked', () => {
  it('returns false for unlocked node', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    expect(isEditorNodeLocked(editor, a)).toBe(false);
  });
});

describe('lockEditorNode', () => {
  it('locks a specific node', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    lockEditorNode(editor, a);
    expect(isEditorNodeLocked(editor, a)).toBe(true);
  });
});

describe('unlockEditorNode', () => {
  it('unlocks a specific node', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    lockEditorNode(editor, a);
    unlockEditorNode(editor, a);
    expect(isEditorNodeLocked(editor, a)).toBe(false);
  });
});

describe('toggleEditorNodeLock', () => {
  it('toggles lock on a node', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    toggleEditorNodeLock(editor, a);
    expect(isEditorNodeLocked(editor, a)).toBe(true);
    toggleEditorNodeLock(editor, a);
    expect(isEditorNodeLocked(editor, a)).toBe(false);
  });
});

describe('clearEditorLocks', () => {
  it('removes all locks', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);
    lockEditorNode(editor, a);
    lockEditorNode(editor, b);
    clearEditorLocks(editor);
    expect(getEditorLockedCount(editor)).toBe(0);
  });
});

describe('getEditorLockedCount', () => {
  it('returns the number of locked nodes', () => {
    const editor = createEditorState();
    expect(getEditorLockedCount(editor)).toBe(0);
    const a = createNode2D(DisplayObjectKind);
    lockEditorNode(editor, a);
    expect(getEditorLockedCount(editor)).toBe(1);
  });
});

describe('hasLockedSelection', () => {
  it('returns true if any selected node is locked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    lockEditorNode(editor, a);
    expect(hasLockedSelection(editor)).toBe(true);
  });

  it('returns false with no selection', () => {
    const editor = createEditorState();
    expect(hasLockedSelection(editor)).toBe(false);
  });

  it('returns false when selection is unlocked', () => {
    const editor = createEditorState();
    const a = createNode2D(DisplayObjectKind);
    addToSelection(editor.selection, a);
    expect(hasLockedSelection(editor)).toBe(false);
  });
});
