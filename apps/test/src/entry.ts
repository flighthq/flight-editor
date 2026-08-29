import { createHeadlessAdapter } from '@flighthq/editor-host';

import {
  bindDomEvents,
  createCanvasRenderer,
  createDesktopBootstrap,
  disposeCanvasRenderer,
  disposeDesktopBootstrap,
  resizeCanvasRenderer,
  startCanvasLoop,
  startDesktopLoop,
  stopCanvasLoop,
} from '@flighthq/tool-editor';

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
const canvasArea = canvas.parentElement!;

function syncCanvasSize() {
  const rect = canvasArea.getBoundingClientRect();
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);
  return { width: canvas.width, height: canvas.height };
}

const { width, height } = syncCanvasSize();

const hostAdapter = createHeadlessAdapter();

const bootstrap = createDesktopBootstrap({
  hostAdapter,
  layout: { width, height },
  appName: 'Flight Editor Test',
  autoCreateScene: true,
});

startDesktopLoop(bootstrap);

const renderer = createCanvasRenderer({ canvas, antialias: true });
const events = bindDomEvents(bootstrap.editor.state, canvas);

startCanvasLoop(renderer, bootstrap);

const toolEls = document.querySelectorAll<HTMLElement>('[data-tool]');
toolEls.forEach((el) => {
  el.addEventListener('pointerdown', () => {
    toolEls.forEach((t) => t.classList.remove('active'));
    el.classList.add('active');

    const statusTool = document.querySelector('.status-bar__tool');
    if (statusTool) {
      const name = el.dataset.tooltip?.replace(/\s*\(.*\)/, '') ?? el.dataset.tool ?? '';
      statusTool.textContent = `${name} Tool`;
    }
  });
});

const coordsEl = document.getElementById('status-coords');
canvas.addEventListener('pointermove', (e) => {
  if (coordsEl) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    coordsEl.textContent = `X: ${x} Y: ${y}`;
  }
});

const resizeObserver = new ResizeObserver(() => {
  const { width: w, height: h } = syncCanvasSize();
  resizeCanvasRenderer(renderer, bootstrap, w, h);
});
resizeObserver.observe(canvasArea);

window.addEventListener('beforeunload', () => {
  resizeObserver.disconnect();
  events.dispose();
  stopCanvasLoop(renderer);
  disposeCanvasRenderer(renderer);
  disposeDesktopBootstrap(bootstrap);
});
