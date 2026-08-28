import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorCheckpoint,
  clearEditorCheckpoints,
  getEditorCheckpoint,
  getEditorCheckpointCount,
  getEditorCheckpoints,
  getEditorHistoryPanelVersion,
  removeEditorCheckpoint,
} from './historyStateManager';

describe('addEditorCheckpoint', () => {
  it('adds a checkpoint and returns an id', () => {
    const editor = createEditorState();
    const id = addEditorCheckpoint(editor, 'Initial', { nodes: [] });
    expect(typeof id).toBe('number');
    expect(getEditorCheckpointCount(editor)).toBe(1);
  });
});

describe('removeEditorCheckpoint', () => {
  it('removes a checkpoint by id', () => {
    const editor = createEditorState();
    const id = addEditorCheckpoint(editor, 'snap', null);
    expect(removeEditorCheckpoint(editor, id)).toBe(true);
    expect(getEditorCheckpointCount(editor)).toBe(0);
  });
});

describe('getEditorCheckpoint', () => {
  it('returns a checkpoint by id', () => {
    const editor = createEditorState();
    const id = addEditorCheckpoint(editor, 'v1', 'data');
    const cp = getEditorCheckpoint(editor, id);
    expect(cp).toBeDefined();
    expect(cp!.label).toBe('v1');
  });
});

describe('getEditorCheckpoints', () => {
  it('returns all checkpoints', () => {
    const editor = createEditorState();
    addEditorCheckpoint(editor, 'a', null);
    addEditorCheckpoint(editor, 'b', null);
    expect(getEditorCheckpoints(editor)).toHaveLength(2);
  });
});

describe('getEditorCheckpointCount', () => {
  it('returns zero when empty', () => {
    const editor = createEditorState();
    expect(getEditorCheckpointCount(editor)).toBe(0);
  });
});

describe('clearEditorCheckpoints', () => {
  it('clears all checkpoints', () => {
    const editor = createEditorState();
    addEditorCheckpoint(editor, 'a', null);
    addEditorCheckpoint(editor, 'b', null);
    clearEditorCheckpoints(editor);
    expect(getEditorCheckpointCount(editor)).toBe(0);
  });
});

describe('getEditorHistoryPanelVersion', () => {
  it('increments on changes', () => {
    const editor = createEditorState();
    const v0 = getEditorHistoryPanelVersion(editor);
    addEditorCheckpoint(editor, 'snap', null);
    expect(getEditorHistoryPanelVersion(editor)).toBeGreaterThan(v0);
  });
});
