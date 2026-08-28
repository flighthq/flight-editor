import { addToSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addExportForNode,
  addExportForSelection,
  clearAllExports,
  getAllExports,
  getEnabledExportCount,
  getEnabledExports,
  getExportCount,
  getExportForNode,
  removeExportForNode,
  setExportNodeEnabled,
  setExportNodeFormat,
  setExportNodeScale,
  setExportNodeSuffix,
} from './exportManager';

describe('addExportForNode', () => {
  it('adds an export slice', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'node-1');
    expect(getExportCount(editor)).toBe(1);
  });

  it('uses default format and scale', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'node-1');
    const slice = getExportForNode(editor, 'node-1');
    expect(slice).toBeDefined();
    expect(slice!.format).toBe('png');
    expect(slice!.scale).toBe(1);
    expect(slice!.enabled).toBe(true);
  });

  it('accepts custom format and scale', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'node-1', 'svg', 2, '@2x');
    const slice = getExportForNode(editor, 'node-1');
    expect(slice!.format).toBe('svg');
    expect(slice!.scale).toBe(2);
    expect(slice!.suffix).toBe('@2x');
  });
});

describe('addExportForSelection', () => {
  it('adds exports for selected nodes', () => {
    const editor = createEditorState();
    addToSelection(editor.selection, createNode2D(DisplayObjectKind));
    addToSelection(editor.selection, createNode2D(DisplayObjectKind));
    const count = addExportForSelection(editor);
    expect(count).toBe(2);
    expect(getExportCount(editor)).toBe(2);
  });

  it('returns 0 when nothing selected', () => {
    const editor = createEditorState();
    expect(addExportForSelection(editor)).toBe(0);
  });
});

describe('removeExportForNode', () => {
  it('removes an existing export', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'node-1');
    expect(removeExportForNode(editor, 'node-1')).toBe(true);
    expect(getExportCount(editor)).toBe(0);
  });

  it('returns false for unknown node', () => {
    const editor = createEditorState();
    expect(removeExportForNode(editor, 'unknown')).toBe(false);
  });
});

describe('getExportForNode', () => {
  it('returns undefined for unknown node', () => {
    const editor = createEditorState();
    expect(getExportForNode(editor, 'unknown')).toBeUndefined();
  });
});

describe('getAllExports', () => {
  it('returns all slices', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    addExportForNode(editor, 'b');
    addExportForNode(editor, 'c');
    expect(getAllExports(editor)).toHaveLength(3);
  });
});

describe('getEnabledExports', () => {
  it('returns only enabled slices', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    addExportForNode(editor, 'b');
    setExportNodeEnabled(editor, 'b', false);
    expect(getEnabledExports(editor)).toHaveLength(1);
  });
});

describe('setExportNodeFormat', () => {
  it('changes the format', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    setExportNodeFormat(editor, 'a', 'jpeg');
    expect(getExportForNode(editor, 'a')!.format).toBe('jpeg');
  });
});

describe('setExportNodeScale', () => {
  it('changes the scale', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    setExportNodeScale(editor, 'a', 3);
    expect(getExportForNode(editor, 'a')!.scale).toBe(3);
  });
});

describe('setExportNodeSuffix', () => {
  it('changes the suffix', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    setExportNodeSuffix(editor, 'a', '@3x');
    expect(getExportForNode(editor, 'a')!.suffix).toBe('@3x');
  });
});

describe('setExportNodeEnabled', () => {
  it('disables an export', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    setExportNodeEnabled(editor, 'a', false);
    expect(getExportForNode(editor, 'a')!.enabled).toBe(false);
  });
});

describe('clearAllExports', () => {
  it('removes all exports', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    addExportForNode(editor, 'b');
    clearAllExports(editor);
    expect(getExportCount(editor)).toBe(0);
  });
});

describe('getExportCount', () => {
  it('returns 0 initially', () => {
    const editor = createEditorState();
    expect(getExportCount(editor)).toBe(0);
  });
});

describe('getEnabledExportCount', () => {
  it('counts only enabled exports', () => {
    const editor = createEditorState();
    addExportForNode(editor, 'a');
    addExportForNode(editor, 'b');
    setExportNodeEnabled(editor, 'a', false);
    expect(getEnabledExportCount(editor)).toBe(1);
  });
});
