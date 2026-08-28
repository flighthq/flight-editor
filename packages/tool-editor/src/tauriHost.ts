import type { FileDialogResult, HostAdapter, HostCapabilities } from '@flighthq/editor-host';

import { createDesktopCapabilities } from '@flighthq/editor-host';

export interface TauriIpc {
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
  listen<T>(event: string, handler: (payload: T) => void): Promise<() => void>;
}

export interface TauriHostConfig {
  readonly ipc: TauriIpc;
  readonly windowLabel?: string;
  readonly fileFilters?: readonly TauriFileFilter[];
}

export interface TauriFileFilter {
  readonly name: string;
  readonly extensions: readonly string[];
}

interface TauriOpenResult {
  readonly path: string;
}

interface TauriSaveResult {
  readonly path: string;
}

export function createTauriHostAdapter(config: Readonly<TauriHostConfig>): HostAdapter {
  const { ipc, fileFilters = [] } = config;

  return {
    capabilities: createTauriHostCapabilities(),

    showOpenDialog(): Promise<FileDialogResult | null> {
      return ipc
        .invoke<TauriOpenResult | null>('plugin:dialog|open', {
          filters: formatFilters(fileFilters),
          multiple: false,
        })
        .then((result) => {
          if (!result) return null;
          return { path: result.path, name: extractFileName(result.path) };
        });
    },

    showSaveDialog(defaultName: string): Promise<FileDialogResult | null> {
      return ipc
        .invoke<TauriSaveResult | null>('plugin:dialog|save', {
          defaultPath: defaultName,
          filters: formatFilters(fileFilters),
        })
        .then((result) => {
          if (!result) return null;
          return { path: result.path, name: extractFileName(result.path) };
        });
    },

    readFile(path: string): Promise<ArrayBuffer> {
      return ipc.invoke<number[]>('plugin:fs|read_file', { path }).then((bytes) => {
        const buffer = new Uint8Array(bytes);
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
      });
    },

    writeFile(path: string, data: ArrayBuffer): Promise<void> {
      const bytes = Array.from(new Uint8Array(data));
      return ipc.invoke('plugin:fs|write_file', { path, contents: bytes });
    },

    readClipboardText(): Promise<string> {
      return ipc.invoke<string>('plugin:clipboard-manager|read_text', {});
    },

    writeClipboardText(text: string): Promise<void> {
      return ipc.invoke('plugin:clipboard-manager|write_text', { text });
    },

    setWindowTitle(title: string): void {
      ipc.invoke('plugin:window|set_title', { label: config.windowLabel ?? 'main', title }).catch(() => {});
    },

    showMessage(text: string, severity: 'info' | 'warning' | 'error'): void {
      ipc
        .invoke('plugin:dialog|message', {
          message: text,
          kind: severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'info',
        })
        .catch(() => {});
    },
  };
}

export function createTauriHostCapabilities(): HostCapabilities {
  return createDesktopCapabilities();
}

export function createDefaultFileFilters(): readonly TauriFileFilter[] {
  return Object.freeze([
    { name: 'Flight Scene', extensions: ['flight', 'json'] },
    { name: 'All Files', extensions: ['*'] },
  ]);
}

function formatFilters(filters: readonly TauriFileFilter[]): { name: string; extensions: string[] }[] {
  return filters.map((f) => ({
    name: f.name,
    extensions: [...f.extensions],
  }));
}

function extractFileName(path: string): string {
  const separatorIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return separatorIndex >= 0 ? path.substring(separatorIndex + 1) : path;
}
