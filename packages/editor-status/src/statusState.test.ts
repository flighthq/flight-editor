import { describe, expect, it } from 'vitest';

import {
  clearCursorPosition,
  clearStatusMessage,
  createStatusBarState,
  getActiveToolName,
  getCursorPosition,
  getSelectionCount,
  getSelectionLabel,
  getStatusBarVersion,
  getStatusMessage,
  getZoomPercent,
  setActiveToolName,
  setCursorPosition,
  setSelectionInfo,
  setStatusMessage,
  setZoomPercent,
} from './statusState';

describe('createStatusBarState', () => {
  it('starts with defaults', () => {
    const state = createStatusBarState();
    expect(getStatusMessage(state)).toBeNull();
    expect(getZoomPercent(state)).toBe(100);
    expect(getSelectionCount(state)).toBe(0);
    expect(getSelectionLabel(state)).toBe('');
    expect(getCursorPosition(state)).toBeNull();
    expect(getActiveToolName(state)).toBe('');
    expect(getStatusBarVersion(state)).toBe(0);
  });
});

describe('getStatusMessage', () => {
  it('returns null initially', () => {
    expect(getStatusMessage(createStatusBarState())).toBeNull();
  });

  it('returns the set message', () => {
    const state = createStatusBarState();
    setStatusMessage(state, 'Saved', 'info', 1000);
    expect(getStatusMessage(state)).toEqual({ text: 'Saved', severity: 'info', timestamp: 1000 });
  });
});

describe('setStatusMessage', () => {
  it('sets a message and bumps version', () => {
    const state = createStatusBarState();
    setStatusMessage(state, 'Error occurred', 'error', 500);
    expect(getStatusMessage(state)?.text).toBe('Error occurred');
    expect(getStatusMessage(state)?.severity).toBe('error');
    expect(getStatusBarVersion(state)).toBe(1);
  });

  it('replaces previous message', () => {
    const state = createStatusBarState();
    setStatusMessage(state, 'First', 'info', 100);
    setStatusMessage(state, 'Second', 'warning', 200);
    expect(getStatusMessage(state)?.text).toBe('Second');
    expect(getStatusMessage(state)?.severity).toBe('warning');
    expect(getStatusBarVersion(state)).toBe(2);
  });

  it('always bumps version even with same text', () => {
    const state = createStatusBarState();
    setStatusMessage(state, 'Same', 'info', 100);
    setStatusMessage(state, 'Same', 'info', 200);
    expect(getStatusBarVersion(state)).toBe(2);
  });
});

describe('clearStatusMessage', () => {
  it('clears the message', () => {
    const state = createStatusBarState();
    setStatusMessage(state, 'Test', 'info', 100);
    clearStatusMessage(state);
    expect(getStatusMessage(state)).toBeNull();
  });

  it('is idempotent when already null', () => {
    const state = createStatusBarState();
    const v = getStatusBarVersion(state);
    clearStatusMessage(state);
    expect(getStatusBarVersion(state)).toBe(v);
  });

  it('bumps version on clear', () => {
    const state = createStatusBarState();
    setStatusMessage(state, 'Test', 'info', 100);
    const v = getStatusBarVersion(state);
    clearStatusMessage(state);
    expect(getStatusBarVersion(state)).toBe(v + 1);
  });
});

describe('getZoomPercent', () => {
  it('returns 100 by default', () => {
    expect(getZoomPercent(createStatusBarState())).toBe(100);
  });
});

describe('setZoomPercent', () => {
  it('sets zoom level', () => {
    const state = createStatusBarState();
    setZoomPercent(state, 200);
    expect(getZoomPercent(state)).toBe(200);
    expect(getStatusBarVersion(state)).toBe(1);
  });

  it('accepts fractional values', () => {
    const state = createStatusBarState();
    setZoomPercent(state, 33.33);
    expect(getZoomPercent(state)).toBe(33.33);
  });

  it('is idempotent for same value', () => {
    const state = createStatusBarState();
    setZoomPercent(state, 100);
    expect(getStatusBarVersion(state)).toBe(0);
  });
});

describe('getSelectionCount', () => {
  it('returns 0 by default', () => {
    expect(getSelectionCount(createStatusBarState())).toBe(0);
  });
});

describe('getSelectionLabel', () => {
  it('returns empty string by default', () => {
    expect(getSelectionLabel(createStatusBarState())).toBe('');
  });
});

describe('setSelectionInfo', () => {
  it('sets count and label together', () => {
    const state = createStatusBarState();
    setSelectionInfo(state, 3, '3 objects selected');
    expect(getSelectionCount(state)).toBe(3);
    expect(getSelectionLabel(state)).toBe('3 objects selected');
    expect(getStatusBarVersion(state)).toBe(1);
  });

  it('is idempotent for same values', () => {
    const state = createStatusBarState();
    setSelectionInfo(state, 1, 'Sprite');
    const v = getStatusBarVersion(state);
    setSelectionInfo(state, 1, 'Sprite');
    expect(getStatusBarVersion(state)).toBe(v);
  });

  it('updates when only count changes', () => {
    const state = createStatusBarState();
    setSelectionInfo(state, 1, 'selected');
    setSelectionInfo(state, 2, 'selected');
    expect(getSelectionCount(state)).toBe(2);
    expect(getStatusBarVersion(state)).toBe(2);
  });

  it('updates when only label changes', () => {
    const state = createStatusBarState();
    setSelectionInfo(state, 1, 'Sprite');
    setSelectionInfo(state, 1, 'Shape');
    expect(getSelectionLabel(state)).toBe('Shape');
    expect(getStatusBarVersion(state)).toBe(2);
  });
});

describe('getCursorPosition', () => {
  it('returns null initially', () => {
    expect(getCursorPosition(createStatusBarState())).toBeNull();
  });
});

describe('setCursorPosition', () => {
  it('sets the cursor position', () => {
    const state = createStatusBarState();
    setCursorPosition(state, 150, 250);
    expect(getCursorPosition(state)).toEqual({ x: 150, y: 250 });
    expect(getStatusBarVersion(state)).toBe(1);
  });

  it('is idempotent for same position', () => {
    const state = createStatusBarState();
    setCursorPosition(state, 10, 20);
    const v = getStatusBarVersion(state);
    setCursorPosition(state, 10, 20);
    expect(getStatusBarVersion(state)).toBe(v);
  });

  it('handles negative coordinates', () => {
    const state = createStatusBarState();
    setCursorPosition(state, -5, -10);
    expect(getCursorPosition(state)).toEqual({ x: -5, y: -10 });
  });

  it('handles fractional coordinates', () => {
    const state = createStatusBarState();
    setCursorPosition(state, 10.5, 20.75);
    expect(getCursorPosition(state)).toEqual({ x: 10.5, y: 20.75 });
  });
});

describe('clearCursorPosition', () => {
  it('clears the position', () => {
    const state = createStatusBarState();
    setCursorPosition(state, 10, 20);
    clearCursorPosition(state);
    expect(getCursorPosition(state)).toBeNull();
  });

  it('is idempotent when already null', () => {
    const state = createStatusBarState();
    const v = getStatusBarVersion(state);
    clearCursorPosition(state);
    expect(getStatusBarVersion(state)).toBe(v);
  });
});

describe('getActiveToolName', () => {
  it('returns empty string by default', () => {
    expect(getActiveToolName(createStatusBarState())).toBe('');
  });
});

describe('setActiveToolName', () => {
  it('sets the tool name', () => {
    const state = createStatusBarState();
    setActiveToolName(state, 'Select');
    expect(getActiveToolName(state)).toBe('Select');
    expect(getStatusBarVersion(state)).toBe(1);
  });

  it('is idempotent for same name', () => {
    const state = createStatusBarState();
    setActiveToolName(state, 'Move');
    const v = getStatusBarVersion(state);
    setActiveToolName(state, 'Move');
    expect(getStatusBarVersion(state)).toBe(v);
  });

  it('clears with empty string', () => {
    const state = createStatusBarState();
    setActiveToolName(state, 'Hand');
    setActiveToolName(state, '');
    expect(getActiveToolName(state)).toBe('');
  });
});

describe('getStatusBarVersion', () => {
  it('starts at 0', () => {
    expect(getStatusBarVersion(createStatusBarState())).toBe(0);
  });

  it('tracks cumulative changes', () => {
    const state = createStatusBarState();
    setZoomPercent(state, 200);
    setActiveToolName(state, 'Select');
    setSelectionInfo(state, 1, 'Node');
    setCursorPosition(state, 10, 20);
    setStatusMessage(state, 'Ready', 'info', 100);
    expect(getStatusBarVersion(state)).toBe(5);
  });
});
