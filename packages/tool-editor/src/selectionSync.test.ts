import { addToSelection, clearSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { formatSelectionLabel, getSelectionSummary, syncSelectionToStatusBar } from './selectionSync';

function makeNode(name: string) {
  const node = createNode2D();
  node.name = name;
  node.kind = DisplayObjectKind;
  return node;
}

describe('syncSelectionToStatusBar', () => {
  it('syncs empty selection', () => {
    const editor = createEditorState();
    syncSelectionToStatusBar(editor);
    expect(editor.statusBar.selectionCount).toBe(0);
    expect(editor.statusBar.selectionLabel).toBe('No selection');
  });

  it('syncs single selection', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('rect'));
    syncSelectionToStatusBar(editor);
    expect(editor.statusBar.selectionCount).toBe(1);
    expect(editor.statusBar.selectionLabel).toBe('1 object selected');
  });

  it('syncs multiple selection', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('a'));
    addToSelection(editor.selection, makeNode('b'));
    addToSelection(editor.selection, makeNode('c'));
    syncSelectionToStatusBar(editor);
    expect(editor.statusBar.selectionCount).toBe(3);
    expect(editor.statusBar.selectionLabel).toBe('3 objects selected');
  });

  it('updates after clearing selection', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('a'));
    syncSelectionToStatusBar(editor);
    expect(editor.statusBar.selectionCount).toBe(1);

    clearSelection(editor.selection);
    syncSelectionToStatusBar(editor);
    expect(editor.statusBar.selectionCount).toBe(0);
  });
});

describe('formatSelectionLabel', () => {
  it('returns no selection for zero', () => {
    expect(formatSelectionLabel(0)).toBe('No selection');
  });

  it('returns singular for one', () => {
    expect(formatSelectionLabel(1)).toBe('1 object selected');
  });

  it('returns plural for many', () => {
    expect(formatSelectionLabel(5)).toBe('5 objects selected');
  });
});

describe('getSelectionSummary', () => {
  it('returns summary for empty selection', () => {
    const editor = createEditorState();
    const summary = getSelectionSummary(editor);
    expect(summary.count).toBe(0);
    expect(summary.label).toBe('No selection');
    expect(summary.names).toHaveLength(0);
  });

  it('returns node names', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, makeNode('Circle'));
    addToSelection(editor.selection, makeNode('Rectangle'));
    const summary = getSelectionSummary(editor);
    expect(summary.count).toBe(2);
    expect(summary.names).toEqual(['Circle', 'Rectangle']);
  });
});
