import { createTauriApp } from './main';

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ipc = (window as unknown as { __TAURI_INTERNALS__: { invoke: (...args: unknown[]) => Promise<unknown> } })
  .__TAURI_INTERNALS__;

const app = createTauriApp({
  ipc: {
    invoke: (command, args) => ipc.invoke(command, args),
    listen: () => Promise.resolve(() => {}),
  },
  canvas,
  width: canvas.width,
  height: canvas.height,
});

window.addEventListener('resize', () => {
  app.resize(window.innerWidth, window.innerHeight);
});
