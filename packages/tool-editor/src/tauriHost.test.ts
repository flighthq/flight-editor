import { describe, expect, it, vi } from 'vitest';

import { createDefaultFileFilters, createTauriHostAdapter, createTauriHostCapabilities } from './tauriHost';

import type { TauriIpc } from './tauriHost';

function mockIpc(): TauriIpc & { calls: { command: string; args?: Record<string, unknown> }[] } {
  const calls: { command: string; args?: Record<string, unknown> }[] = [];
  return {
    calls,
    invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
      calls.push({ command, args });
      return Promise.resolve(null as T);
    },
    listen<T>(_event: string, _handler: (payload: T) => void): Promise<() => void> {
      return Promise.resolve(() => {});
    },
  };
}

describe('createTauriHostCapabilities', () => {
  it('returns desktop capabilities', () => {
    const caps = createTauriHostCapabilities();
    expect(caps.hasFileSystem).toBe(true);
    expect(caps.hasClipboard).toBe(true);
    expect(caps.hasNativeMenus).toBe(true);
    expect(caps.hasNativeDialogs).toBe(true);
    expect(caps.hasDragDrop).toBe(true);
  });
});

describe('createTauriHostAdapter', () => {
  it('creates an adapter with desktop capabilities', () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    expect(adapter.capabilities.hasFileSystem).toBe(true);
  });

  it('showOpenDialog invokes dialog open command', async () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    await adapter.showOpenDialog();
    expect(ipc.calls[0].command).toBe('plugin:dialog|open');
  });

  it('showOpenDialog returns null when cancelled', async () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    const result = await adapter.showOpenDialog();
    expect(result).toBeNull();
  });

  it('showOpenDialog returns path when file selected', async () => {
    const ipc: TauriIpc = {
      invoke: vi.fn().mockResolvedValue({ path: '/home/user/doc.flight' }),
      listen: vi.fn().mockResolvedValue(() => {}),
    };
    const adapter = createTauriHostAdapter({ ipc });
    const result = await adapter.showOpenDialog();
    expect(result).not.toBeNull();
    expect(result!.path).toBe('/home/user/doc.flight');
    expect(result!.name).toBe('doc.flight');
  });

  it('showSaveDialog invokes dialog save command', async () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    await adapter.showSaveDialog('untitled.flight');
    expect(ipc.calls[0].command).toBe('plugin:dialog|save');
    expect(ipc.calls[0].args?.defaultPath).toBe('untitled.flight');
  });

  it('readFile invokes fs read command', async () => {
    const ipc: TauriIpc = {
      invoke: vi.fn().mockResolvedValue([72, 101, 108, 108, 111]),
      listen: vi.fn().mockResolvedValue(() => {}),
    };
    const adapter = createTauriHostAdapter({ ipc });
    const buffer = await adapter.readFile('/test.txt');
    expect(buffer.byteLength).toBe(5);
  });

  it('writeFile invokes fs write command', async () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    const data = new TextEncoder().encode('test').buffer as ArrayBuffer;
    await adapter.writeFile('/test.txt', data);
    expect(ipc.calls[0].command).toBe('plugin:fs|write_file');
  });

  it('readClipboardText invokes clipboard read', async () => {
    const ipc: TauriIpc = {
      invoke: vi.fn().mockResolvedValue('clipboard text'),
      listen: vi.fn().mockResolvedValue(() => {}),
    };
    const adapter = createTauriHostAdapter({ ipc });
    const text = await adapter.readClipboardText();
    expect(text).toBe('clipboard text');
  });

  it('writeClipboardText invokes clipboard write', async () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    await adapter.writeClipboardText('hello');
    expect(ipc.calls[0].command).toBe('plugin:clipboard-manager|write_text');
  });

  it('setWindowTitle invokes window set_title', () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc, windowLabel: 'editor' });
    adapter.setWindowTitle('My Document');
    expect(ipc.calls[0].command).toBe('plugin:window|set_title');
    expect(ipc.calls[0].args?.label).toBe('editor');
    expect(ipc.calls[0].args?.title).toBe('My Document');
  });

  it('setWindowTitle defaults to main label', () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    adapter.setWindowTitle('Test');
    expect(ipc.calls[0].args?.label).toBe('main');
  });

  it('showMessage invokes dialog message', () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    adapter.showMessage('Something happened', 'info');
    expect(ipc.calls[0].command).toBe('plugin:dialog|message');
  });

  it('showMessage maps severity to kind', () => {
    const ipc = mockIpc();
    const adapter = createTauriHostAdapter({ ipc });
    adapter.showMessage('Error!', 'error');
    expect(ipc.calls[0].args?.kind).toBe('error');
  });

  it('passes file filters to dialogs', async () => {
    const ipc = mockIpc();
    const filters = createDefaultFileFilters();
    const adapter = createTauriHostAdapter({ ipc, fileFilters: filters });
    await adapter.showOpenDialog();
    const args = ipc.calls[0].args;
    expect(args?.filters).toHaveLength(2);
  });
});

describe('createDefaultFileFilters', () => {
  it('includes Flight Scene filter', () => {
    const filters = createDefaultFileFilters();
    expect(filters[0].name).toBe('Flight Scene');
    expect(filters[0].extensions).toContain('flight');
  });

  it('includes All Files filter', () => {
    const filters = createDefaultFileFilters();
    expect(filters[1].name).toBe('All Files');
    expect(filters[1].extensions).toContain('*');
  });
});
