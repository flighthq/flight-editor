import type { HostAdapter, HostCapabilities } from '@flighthq/editor-host';

import { createDesktopCapabilities } from '@flighthq/editor-host';

export interface TauriDialogFilter {
  readonly name: string;
  readonly extensions: readonly string[];
}

export interface TauriAdapterConfig {
  readonly windowLabel?: string;
  readonly dialogFilters?: readonly TauriDialogFilter[];
}

export function createTauriCapabilities(): HostCapabilities {
  return createDesktopCapabilities();
}

export function createTauriAdapter(_config: Readonly<TauriAdapterConfig> = {}): HostAdapter {
  return {
    capabilities: createTauriCapabilities(),
    showOpenDialog: () => Promise.resolve(null),
    showSaveDialog: () => Promise.resolve(null),
    readFile: () => Promise.resolve(new ArrayBuffer(0)),
    writeFile: () => Promise.resolve(),
    readClipboardText: () => Promise.resolve(''),
    writeClipboardText: () => Promise.resolve(),
    setWindowTitle: () => {},
    showMessage: () => {},
  };
}
