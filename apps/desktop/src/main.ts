import type { TauriIpc } from '@flighthq/tool-editor';
import type { CanvasRendererState, DomEventBindings } from '@flighthq/tool-editor';

import {
  bindDomEvents,
  createCanvasRenderer,
  createDefaultFileFilters,
  createDesktopBootstrap,
  createTauriHostAdapter,
  deserializeScene,
  disposeCanvasRenderer,
  disposeDesktopBootstrap,
  resizeCanvasRenderer,
  serializeScene,
  startCanvasLoop,
  startDesktopLoop,
  stopCanvasLoop,
} from '@flighthq/tool-editor';

export interface TauriAppConfig {
  readonly ipc: TauriIpc;
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly appName?: string;
  readonly antialias?: boolean;
}

export interface TauriApp {
  readonly renderer: CanvasRendererState;
  readonly events: DomEventBindings;
  resize(width: number, height: number): void;
  dispose(): void;
}

export function createTauriApp(config: Readonly<TauriAppConfig>): TauriApp {
  const { ipc, canvas, width = 1280, height = 720, appName = 'Flight Editor' } = config;

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

  const renderer = createCanvasRenderer({
    canvas,
    antialias: config.antialias ?? true,
  });

  const events = bindDomEvents(bootstrap.editor.state, canvas);

  startCanvasLoop(renderer, bootstrap);

  return {
    renderer,
    events,

    resize(newWidth: number, newHeight: number): void {
      resizeCanvasRenderer(renderer, bootstrap, newWidth, newHeight);
    },

    dispose(): void {
      events.dispose();
      stopCanvasLoop(renderer);
      disposeCanvasRenderer(renderer);
      disposeDesktopBootstrap(bootstrap);
    },
  };
}
