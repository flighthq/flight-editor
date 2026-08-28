import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  clearEditorCursorPosition,
  clearEditorStatusMessage,
  getEditorCursorPosition,
  getEditorStatusActiveToolName,
  getEditorStatusBarVersion,
  getEditorStatusMessage,
  getEditorStatusSelectionCount,
  getEditorStatusSelectionLabel,
  getEditorStatusZoomPercent,
  setEditorCursorPosition,
  setEditorStatusActiveToolName,
  setEditorStatusMessage,
  setEditorStatusSelectionInfo,
  setEditorStatusZoomPercent,
} from './statusBarManager';

describe('getEditorStatusMessage', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorStatusMessage(editor)).toBeNull();
  });
});

describe('setEditorStatusMessage', () => {
  it('sets a status message', () => {
    const editor = createEditorState();
    setEditorStatusMessage(editor, 'Saved');
    expect(getEditorStatusMessage(editor)).toBe('Saved');
  });
});

describe('clearEditorStatusMessage', () => {
  it('clears the status message', () => {
    const editor = createEditorState();
    setEditorStatusMessage(editor, 'Hello');
    clearEditorStatusMessage(editor);
    expect(getEditorStatusMessage(editor)).toBeNull();
  });
});

describe('getEditorStatusZoomPercent', () => {
  it('returns a number', () => {
    const editor = createEditorState();
    expect(typeof getEditorStatusZoomPercent(editor)).toBe('number');
  });
});

describe('setEditorStatusZoomPercent', () => {
  it('sets the zoom percent', () => {
    const editor = createEditorState();
    setEditorStatusZoomPercent(editor, 200);
    expect(getEditorStatusZoomPercent(editor)).toBe(200);
  });
});

describe('getEditorStatusSelectionCount', () => {
  it('returns zero initially', () => {
    const editor = createEditorState();
    expect(getEditorStatusSelectionCount(editor)).toBe(0);
  });
});

describe('getEditorStatusSelectionLabel', () => {
  it('returns empty string initially', () => {
    const editor = createEditorState();
    expect(getEditorStatusSelectionLabel(editor)).toBe('');
  });
});

describe('setEditorStatusSelectionInfo', () => {
  it('sets selection count and label', () => {
    const editor = createEditorState();
    setEditorStatusSelectionInfo(editor, 3, 'Sprites');
    expect(getEditorStatusSelectionCount(editor)).toBe(3);
    expect(getEditorStatusSelectionLabel(editor)).toBe('Sprites');
  });
});

describe('getEditorStatusActiveToolName', () => {
  it('returns empty string initially', () => {
    const editor = createEditorState();
    expect(getEditorStatusActiveToolName(editor)).toBe('');
  });
});

describe('setEditorStatusActiveToolName', () => {
  it('sets the active tool name', () => {
    const editor = createEditorState();
    setEditorStatusActiveToolName(editor, 'select');
    expect(getEditorStatusActiveToolName(editor)).toBe('select');
  });
});

describe('getEditorCursorPosition', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorCursorPosition(editor)).toBeNull();
  });
});

describe('setEditorCursorPosition', () => {
  it('sets cursor position', () => {
    const editor = createEditorState();
    setEditorCursorPosition(editor, 100, 200);
    const pos = getEditorCursorPosition(editor);
    expect(pos).not.toBeNull();
    expect(pos!.x).toBe(100);
    expect(pos!.y).toBe(200);
  });
});

describe('clearEditorCursorPosition', () => {
  it('clears cursor position', () => {
    const editor = createEditorState();
    setEditorCursorPosition(editor, 100, 200);
    clearEditorCursorPosition(editor);
    expect(getEditorCursorPosition(editor)).toBeNull();
  });
});

describe('getEditorStatusBarVersion', () => {
  it('returns a number', () => {
    const editor = createEditorState();
    expect(typeof getEditorStatusBarVersion(editor)).toBe('number');
  });
});
