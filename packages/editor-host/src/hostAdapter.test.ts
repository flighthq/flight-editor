import { describe, expect, it } from 'vitest';

import {
  createDesktopCapabilities,
  createHeadlessAdapter,
  createHeadlessCapabilities,
  createHostAdapterState,
  getHostAdapter,
  getHostAdapterVersion,
  getHostCallbacks,
  getHostCapabilities,
  hasCapability,
  setHostAdapter,
  setHostCallbacks,
} from './hostAdapter';

import type { HostAdapter } from './hostAdapter';

describe('createHeadlessCapabilities', () => {
  it('returns all capabilities disabled', () => {
    const caps = createHeadlessCapabilities();
    expect(caps.hasFileSystem).toBe(false);
    expect(caps.hasClipboard).toBe(false);
    expect(caps.hasNativeMenus).toBe(false);
    expect(caps.hasNativeDialogs).toBe(false);
    expect(caps.hasDragDrop).toBe(false);
  });
});

describe('createDesktopCapabilities', () => {
  it('returns all capabilities enabled', () => {
    const caps = createDesktopCapabilities();
    expect(caps.hasFileSystem).toBe(true);
    expect(caps.hasClipboard).toBe(true);
    expect(caps.hasNativeMenus).toBe(true);
    expect(caps.hasNativeDialogs).toBe(true);
    expect(caps.hasDragDrop).toBe(true);
  });
});

describe('createHeadlessAdapter', () => {
  it('returns a functional adapter with no capabilities', () => {
    const adapter = createHeadlessAdapter();
    expect(adapter.capabilities.hasFileSystem).toBe(false);
    expect(adapter.capabilities.hasClipboard).toBe(false);
  });

  it('showOpenDialog returns null', async () => {
    const adapter = createHeadlessAdapter();
    expect(await adapter.showOpenDialog()).toBeNull();
  });

  it('showSaveDialog returns null', async () => {
    const adapter = createHeadlessAdapter();
    expect(await adapter.showSaveDialog('test.flight')).toBeNull();
  });

  it('readFile rejects with an error', async () => {
    const adapter = createHeadlessAdapter();
    await expect(adapter.readFile('/test')).rejects.toThrow('File system not available');
  });

  it('writeFile rejects with an error', async () => {
    const adapter = createHeadlessAdapter();
    await expect(adapter.writeFile('/test', new ArrayBuffer(0))).rejects.toThrow('File system not available');
  });

  it('readClipboardText returns empty string', async () => {
    const adapter = createHeadlessAdapter();
    expect(await adapter.readClipboardText()).toBe('');
  });

  it('writeClipboardText resolves', async () => {
    const adapter = createHeadlessAdapter();
    await expect(adapter.writeClipboardText('test')).resolves.toBeUndefined();
  });

  it('setWindowTitle and showMessage are no-ops', () => {
    const adapter = createHeadlessAdapter();
    adapter.setWindowTitle('Test');
    adapter.showMessage('Test', 'info');
  });
});

describe('createHostAdapterState', () => {
  it('defaults to headless adapter', () => {
    const state = createHostAdapterState();
    expect(getHostCapabilities(state).hasFileSystem).toBe(false);
    expect(getHostAdapterVersion(state)).toBe(0);
    expect(getHostCallbacks(state)).toEqual({});
  });

  it('accepts a custom adapter', () => {
    const custom: HostAdapter = {
      ...createHeadlessAdapter(),
      capabilities: createDesktopCapabilities(),
    };
    const state = createHostAdapterState(custom);
    expect(getHostCapabilities(state).hasFileSystem).toBe(true);
  });
});

describe('getHostAdapter', () => {
  it('returns the current adapter', () => {
    const state = createHostAdapterState();
    const adapter = getHostAdapter(state);
    expect(adapter.capabilities).toBeDefined();
  });
});

describe('setHostAdapter', () => {
  it('replaces the adapter and bumps version', () => {
    const state = createHostAdapterState();
    const custom: HostAdapter = {
      ...createHeadlessAdapter(),
      capabilities: createDesktopCapabilities(),
    };
    setHostAdapter(state, custom);
    expect(getHostCapabilities(state).hasFileSystem).toBe(true);
    expect(getHostAdapterVersion(state)).toBe(1);
  });
});

describe('getHostCapabilities', () => {
  it('reflects the adapter capabilities', () => {
    const state = createHostAdapterState();
    expect(getHostCapabilities(state).hasNativeMenus).toBe(false);
  });
});

describe('getHostCallbacks', () => {
  it('returns empty callbacks initially', () => {
    const state = createHostAdapterState();
    expect(getHostCallbacks(state)).toEqual({});
  });
});

describe('setHostCallbacks', () => {
  it('sets callbacks and bumps version', () => {
    const state = createHostAdapterState();
    const onDirtyChange = () => {};
    setHostCallbacks(state, { onDirtyChange });
    expect(getHostCallbacks(state).onDirtyChange).toBe(onDirtyChange);
    expect(getHostAdapterVersion(state)).toBe(1);
  });

  it('replaces previous callbacks', () => {
    const state = createHostAdapterState();
    setHostCallbacks(state, { onDirtyChange: () => {} });
    setHostCallbacks(state, { onTitleChange: () => {} });
    expect(getHostCallbacks(state).onDirtyChange).toBeUndefined();
    expect(getHostCallbacks(state).onTitleChange).toBeDefined();
  });
});

describe('hasCapability', () => {
  it('returns true for enabled capabilities', () => {
    const custom: HostAdapter = {
      ...createHeadlessAdapter(),
      capabilities: createDesktopCapabilities(),
    };
    const state = createHostAdapterState(custom);
    expect(hasCapability(state, 'hasFileSystem')).toBe(true);
    expect(hasCapability(state, 'hasClipboard')).toBe(true);
    expect(hasCapability(state, 'hasNativeMenus')).toBe(true);
  });

  it('returns false for disabled capabilities', () => {
    const state = createHostAdapterState();
    expect(hasCapability(state, 'hasFileSystem')).toBe(false);
    expect(hasCapability(state, 'hasClipboard')).toBe(false);
  });

  it('reflects adapter changes', () => {
    const state = createHostAdapterState();
    expect(hasCapability(state, 'hasFileSystem')).toBe(false);
    setHostAdapter(state, {
      ...createHeadlessAdapter(),
      capabilities: createDesktopCapabilities(),
    });
    expect(hasCapability(state, 'hasFileSystem')).toBe(true);
  });
});

describe('getHostAdapterVersion', () => {
  it('starts at 0', () => {
    expect(getHostAdapterVersion(createHostAdapterState())).toBe(0);
  });

  it('tracks cumulative changes', () => {
    const state = createHostAdapterState();
    setHostAdapter(state, createHeadlessAdapter());
    setHostCallbacks(state, { onDirtyChange: () => {} });
    expect(getHostAdapterVersion(state)).toBe(2);
  });
});
