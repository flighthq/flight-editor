import { describe, expect, it } from 'vitest';

import { createDesktopCapabilities, createHeadlessAdapter } from '@flighthq/editor-host';

import { createEditorState } from './editorState';
import {
  getEditorHostAdapter,
  getEditorHostAdapterVersion,
  getEditorHostCallbacks,
  getEditorHostCapabilities,
  hasEditorCapability,
  setEditorHostAdapter,
  setEditorHostCallbacks,
} from './hostManager';

describe('getEditorHostAdapter', () => {
  it('returns the default headless adapter', () => {
    const editor = createEditorState();
    const adapter = getEditorHostAdapter(editor);
    expect(adapter).toBeDefined();
    expect(adapter.capabilities.hasFileSystem).toBe(false);
  });
});

describe('setEditorHostAdapter', () => {
  it('replaces the host adapter', () => {
    const editor = createEditorState();
    const adapter = createHeadlessAdapter();
    setEditorHostAdapter(editor, adapter);
    expect(getEditorHostAdapter(editor)).toBe(adapter);
  });
});

describe('getEditorHostCapabilities', () => {
  it('returns headless capabilities by default', () => {
    const editor = createEditorState();
    const caps = getEditorHostCapabilities(editor);
    expect(caps.hasFileSystem).toBe(false);
    expect(caps.hasClipboard).toBe(false);
  });
});

describe('hasEditorCapability', () => {
  it('returns false for headless capabilities', () => {
    const editor = createEditorState();
    expect(hasEditorCapability(editor, 'hasFileSystem')).toBe(false);
  });

  it('returns true when adapter has the capability', () => {
    const editor = createEditorState();
    const caps = createDesktopCapabilities();
    const adapter = { ...createHeadlessAdapter(), capabilities: caps };
    setEditorHostAdapter(editor, adapter);
    expect(hasEditorCapability(editor, 'hasFileSystem')).toBe(true);
  });
});

describe('getEditorHostCallbacks', () => {
  it('returns empty callbacks initially', () => {
    const editor = createEditorState();
    const callbacks = getEditorHostCallbacks(editor);
    expect(callbacks).toBeDefined();
  });
});

describe('setEditorHostCallbacks', () => {
  it('sets the host callbacks', () => {
    const editor = createEditorState();
    const callbacks = { onDirtyChange: () => {} };
    setEditorHostCallbacks(editor, callbacks);
    expect(getEditorHostCallbacks(editor)).toBe(callbacks);
  });
});

describe('getEditorHostAdapterVersion', () => {
  it('starts at zero', () => {
    const editor = createEditorState();
    expect(getEditorHostAdapterVersion(editor)).toBe(0);
  });

  it('increments when adapter changes', () => {
    const editor = createEditorState();
    setEditorHostAdapter(editor, createHeadlessAdapter());
    expect(getEditorHostAdapterVersion(editor)).toBe(1);
  });
});
