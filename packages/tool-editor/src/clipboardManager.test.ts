import { addToSelection, clearSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  canPaste,
  copySelection,
  cutSelection,
  getClipboardCount,
  getClipboardNodes,
  isCopyOperation,
  isCutOperation,
} from './clipboardManager';
import { createEditorState } from './editorState';

function makeNode(name: string) {
  const node = createNode2D(DisplayObjectKind);
  node.name = name;
  return node;
}

describe('copySelection', () => {
  it('copies selected nodes to clipboard', () => {
    const editor = createEditorState();
    const node = makeNode('rect');
    addToSelection(editor.selection, node);
    const count = copySelection(editor);
    expect(count).toBe(1);
    expect(getClipboardNodes(editor)).toHaveLength(1);
    expect(isCopyOperation(editor)).toBe(true);
  });

  it('returns 0 when nothing selected', () => {
    const editor = createEditorState();
    const count = copySelection(editor);
    expect(count).toBe(0);
    expect(canPaste(editor)).toBe(false);
  });

  it('copies multiple nodes', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('a'));
    addToSelection(editor.selection, makeNode('b'));
    const count = copySelection(editor);
    expect(count).toBe(2);
    expect(getClipboardCount(editor)).toBe(2);
  });
});

describe('cutSelection', () => {
  it('cuts selected nodes to clipboard', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('circle'));
    const count = cutSelection(editor);
    expect(count).toBe(1);
    expect(isCutOperation(editor)).toBe(true);
  });

  it('returns 0 when nothing selected', () => {
    const editor = createEditorState();
    const count = cutSelection(editor);
    expect(count).toBe(0);
  });
});

describe('getClipboardNodes', () => {
  it('returns empty array initially', () => {
    const editor = createEditorState();
    expect(getClipboardNodes(editor)).toHaveLength(0);
  });
});

describe('canPaste', () => {
  it('returns false when clipboard empty', () => {
    const editor = createEditorState();
    expect(canPaste(editor)).toBe(false);
  });

  it('returns true after copy', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('x'));
    copySelection(editor);
    expect(canPaste(editor)).toBe(true);
  });
});

describe('isCutOperation', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isCutOperation(editor)).toBe(false);
  });
});

describe('isCopyOperation', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isCopyOperation(editor)).toBe(false);
  });
});

describe('getClipboardCount', () => {
  it('returns 0 initially', () => {
    const editor = createEditorState();
    expect(getClipboardCount(editor)).toBe(0);
  });

  it('returns count after copy', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('a'));
    addToSelection(editor.selection, makeNode('b'));
    addToSelection(editor.selection, makeNode('c'));
    copySelection(editor);
    expect(getClipboardCount(editor)).toBe(3);
  });
});
