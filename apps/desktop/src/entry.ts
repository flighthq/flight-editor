import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { createTauriApp } from './main';

import type { TauriIpc } from '@flighthq/tool-editor';

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const ipc: TauriIpc = {
  invoke: (command, args) => invoke(command, args),
  listen: (event, handler) => listen(event, (e) => handler(e.payload as never)),
};

const app = createTauriApp({
  ipc,
  canvas,
  width,
  height,
});

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  app.resize(w, h);
});
