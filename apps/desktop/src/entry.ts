import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { createTauriApp } from './main';

import type { TauriIpc } from '@flighthq/tool-editor';

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ipc: TauriIpc = {
  invoke: (command, args) => invoke(command, args),
  listen: (event, handler) => listen(event, (e) => handler(e.payload as never)),
};

const app = createTauriApp({
  ipc,
  canvas,
  width: canvas.width,
  height: canvas.height,
});

window.addEventListener('resize', () => {
  app.resize(window.innerWidth, window.innerHeight);
});
