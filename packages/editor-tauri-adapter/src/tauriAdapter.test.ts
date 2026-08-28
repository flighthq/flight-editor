import type { HostAdapter } from '@flighthq/editor-host';

import { describe, expect, it } from 'vitest';

import { createTauriAdapter, createTauriCapabilities } from './tauriAdapter';

describe('createTauriCapabilities', () => {
  it('enables every desktop host capability', () => {
    expect(createTauriCapabilities()).toEqual({
      hasFileSystem: true,
      hasClipboard: true,
      hasNativeMenus: true,
      hasNativeDialogs: true,
      hasDragDrop: true,
    });
  });
});

describe('createTauriAdapter', () => {
  it('satisfies the HostAdapter contract and accepts future configuration', () => {
    const adapter: HostAdapter = createTauriAdapter({
      windowLabel: 'main',
      dialogFilters: [{ name: 'Flight Scene', extensions: ['flight'] }],
    });
    expect(adapter.capabilities).toEqual(createTauriCapabilities());
  });

  it('resolves dialog, file, and clipboard stubs without native bindings', async () => {
    const adapter = createTauriAdapter();
    await expect(adapter.showOpenDialog()).resolves.toBeNull();
    await expect(adapter.showSaveDialog('Untitled.flight')).resolves.toBeNull();
    await expect(adapter.readFile('/tmp/scene.flight')).resolves.toEqual(new ArrayBuffer(0));
    await expect(adapter.writeFile('/tmp/scene.flight', new ArrayBuffer(4))).resolves.toBeUndefined();
    await expect(adapter.readClipboardText()).resolves.toBe('');
    await expect(adapter.writeClipboardText('Flight')).resolves.toBeUndefined();
  });

  it('exposes no-op window and message stubs', () => {
    const adapter = createTauriAdapter();
    expect(() => adapter.setWindowTitle('Flight Editor')).not.toThrow();
    expect(() => adapter.showMessage('Ready', 'info')).not.toThrow();
    expect(() => adapter.showMessage('Careful', 'warning')).not.toThrow();
    expect(() => adapter.showMessage('Failed', 'error')).not.toThrow();
  });
});
