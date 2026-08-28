import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  createEditorNodeFromKind,
  getEditorNodeKindCategories,
  getEditorNodeKindEntry,
  getEditorNodeKindIds,
  getEditorNodeKindsByCategory,
  registerEditorNodeKind,
  unregisterEditorNodeKind,
} from './nodeFactoryManager';

describe('registerEditorNodeKind', () => {
  it('registers a node kind', () => {
    const editor = createEditorState();
    registerEditorNodeKind(editor, 'sprite', 'Sprite', 'basic', () => createNode2D(DisplayObjectKind));
    expect(getEditorNodeKindIds(editor)).toContain('sprite');
  });
});

describe('unregisterEditorNodeKind', () => {
  it('removes a node kind', () => {
    const editor = createEditorState();
    registerEditorNodeKind(editor, 'sprite', 'Sprite', 'basic', () => createNode2D(DisplayObjectKind));
    expect(unregisterEditorNodeKind(editor, 'sprite')).toBe(true);
    expect(getEditorNodeKindIds(editor)).not.toContain('sprite');
  });
});

describe('createEditorNodeFromKind', () => {
  it('creates a node from a registered kind', () => {
    const editor = createEditorState();
    registerEditorNodeKind(editor, 'rect', 'Rectangle', 'shapes', () => createNode2D(DisplayObjectKind));
    const node = createEditorNodeFromKind(editor, 'rect');
    expect(node).not.toBeNull();
  });

  it('returns null for unregistered kind', () => {
    const editor = createEditorState();
    expect(createEditorNodeFromKind(editor, 'missing')).toBeNull();
  });
});

describe('getEditorNodeKindEntry', () => {
  it('returns the entry for a registered kind', () => {
    const editor = createEditorState();
    registerEditorNodeKind(editor, 'text', 'Text', 'basic', () => createNode2D(DisplayObjectKind));
    const entry = getEditorNodeKindEntry(editor, 'text');
    expect(entry).toBeDefined();
    expect(entry!.label).toBe('Text');
  });
});

describe('getEditorNodeKindIds', () => {
  it('returns empty when no kinds registered', () => {
    const editor = createEditorState();
    expect(getEditorNodeKindIds(editor)).toHaveLength(0);
  });
});

describe('getEditorNodeKindCategories', () => {
  it('returns registered categories', () => {
    const editor = createEditorState();
    registerEditorNodeKind(editor, 'a', 'A', 'shapes', () => createNode2D(DisplayObjectKind));
    expect(getEditorNodeKindCategories(editor)).toContain('shapes');
  });
});

describe('getEditorNodeKindsByCategory', () => {
  it('filters by category', () => {
    const editor = createEditorState();
    registerEditorNodeKind(editor, 'a', 'A', 'shapes', () => createNode2D(DisplayObjectKind));
    registerEditorNodeKind(editor, 'b', 'B', 'text', () => createNode2D(DisplayObjectKind));
    expect(getEditorNodeKindsByCategory(editor, 'shapes')).toHaveLength(1);
  });
});
