import type { TauriIpc } from '@flighthq/tool-editor';

import {
  createDefaultFileFilters,
  createDesktopBootstrap,
  createTauriHostAdapter,
  serializeScene,
  deserializeScene,
  startDesktopLoop,
  stepDesktopLoop,
  disposeDesktopBootstrap,
  resizeDesktop,
} from '@flighthq/tool-editor';

export interface TauriAppConfig {
  readonly ipc: TauriIpc;
  readonly width?: number;
  readonly height?: number;
  readonly appName?: string;
}

export function createTauriApp(config: Readonly<TauriAppConfig>) {
  const { ipc, width = 1280, height = 720, appName = 'Flight Editor' } = config;

  const hostAdapter = createTauriHostAdapter({
    ipc,
    fileFilters: createDefaultFileFilters(),
  });

  const bootstrap = createDesktopBootstrap({
    hostAdapter,
    layout: { width, height },
    appName,
    autoCreateScene: true,
    serialize: () => serializeScene(bootstrap.editor.state),
    deserialize: (data: ArrayBuffer) => deserializeScene(bootstrap.editor.state, data),
  });

  startDesktopLoop(bootstrap);

  return {
    bootstrap,

    step(timestamp: number): boolean {
      return stepDesktopLoop(bootstrap, timestamp);
    },

    resize(newWidth: number, newHeight: number): void {
      resizeDesktop(bootstrap, newWidth, newHeight);
    },

    dispose(): void {
      disposeDesktopBootstrap(bootstrap);
    },
  };
}
