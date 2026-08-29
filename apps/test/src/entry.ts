import { createHeadlessAdapter } from '@flighthq/editor-host';

import type { Node2D } from '@flighthq/types';

import {
  bindDomEvents,
  canRedo,
  canUndo,
  createCanvasRenderer,
  createDesktopBootstrap,
  createSetAlphaCommand,
  createSetBlendModeCommand,
  createSetNodeNameCommand,
  createSetSceneNameCommand,
  createSetSceneSizeCommand,
  createSetTransform2DCommand,
  createSetVisibleCommand,
  dispatchAction,
  disposeCanvasRenderer,
  disposeDesktopBootstrap,
  executeCommand,
  getInspectorSnapshot,
  getSceneName,
  getSceneSize,
  getZoomPercentLabel,
  resizeCanvasRenderer,
  screenToScene,
  startCanvasLoop,
  startDesktopLoop,
  stopCanvasLoop,
  switchTool,
  zoomIn,
  zoomOut,
} from '@flighthq/tool-editor';

import type { InspectorSnapshot } from '@flighthq/tool-editor';

const TOOL_SHORTCUTS: Record<string, string> = {
  v: 'pointer',
  h: 'hand',
  z: 'zoom',
  m: 'marquee',
  g: 'move',
  s: 'scale',
  r: 'rotate',
  u: 'rectangle',
  n: 'line',
  i: 'eyedropper',
  k: 'measure',
};

const TOOL_LABELS: Record<string, string> = {
  pointer: 'Pointer Tool',
  hand: 'Hand Tool',
  zoom: 'Zoom Tool',
  marquee: 'Marquee Tool',
  select: 'Select Tool',
  move: 'Move Tool',
  scale: 'Scale Tool',
  rotate: 'Rotate Tool',
  rectangle: 'Rectangle Tool',
  line: 'Line Tool',
  eyedropper: 'Eyedropper Tool',
  measure: 'Measure Tool',
};

const canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
const canvasArea = canvas.parentElement!;

function syncCanvasSize(): { width: number; height: number } {
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

const editor = bootstrap.editor.state;

const toolEls = document.querySelectorAll<HTMLElement>('[data-tool]');
const statusToolEl = document.getElementById('status-tool')!;
const statusZoomEl = document.getElementById('status-zoom')!;
const statusSelectionEl = document.getElementById('status-selection')!;
const statusCoordsEl = document.getElementById('status-coords')!;
const toolbarZoomEl = document.getElementById('toolbar-zoom')!;
const toolbarSceneSizeEl = document.getElementById('toolbar-scene-size')!;

const propX = document.getElementById('prop-x') as HTMLInputElement;
const propY = document.getElementById('prop-y') as HTMLInputElement;
const propW = document.getElementById('prop-w') as HTMLInputElement;
const propH = document.getElementById('prop-h') as HTMLInputElement;
const propRotation = document.getElementById('prop-rotation') as HTMLInputElement;
const propVisible = document.getElementById('prop-visible') as HTMLInputElement;
const propAlphaSlider = document.getElementById('prop-alpha-slider') as HTMLInputElement;
const propAlphaText = document.getElementById('prop-alpha-text') as HTMLInputElement;
const propBlend = document.getElementById('prop-blend') as HTMLSelectElement;
const propName = document.getElementById('prop-name') as HTMLInputElement;
const propSceneName = document.getElementById('prop-scene-name') as HTMLInputElement;
const propSceneW = document.getElementById('prop-scene-w') as HTMLInputElement;
const propSceneH = document.getElementById('prop-scene-h') as HTMLInputElement;

const propsTransform = document.getElementById('props-transform')!;
const propsAppearance = document.getElementById('props-appearance')!;
const propsNodeName = document.getElementById('props-node-name')!;
const propsEmpty = document.getElementById('props-empty')!;
const propsHeader = document.getElementById('props-header')!;

function activateToolUI(toolId: string): void {
  if (switchTool(editor, toolId)) {
    toolEls.forEach((el) => el.classList.toggle('active', el.dataset.tool === toolId));
    statusToolEl.textContent = TOOL_LABELS[toolId] ?? `${toolId} Tool`;
  }
}

toolEls.forEach((el) => {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const toolId = el.dataset.tool;
    if (toolId) activateToolUI(toolId);
  });
});

document.addEventListener('keydown', (e) => {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLSelectElement ||
    e.target instanceof HTMLTextAreaElement
  ) {
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      dispatchAction(editor, 'undo');
      return;
    }
    if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
      e.preventDefault();
      dispatchAction(editor, 'redo');
      return;
    }
  }

  const toolId = TOOL_SHORTCUTS[e.key.toLowerCase()];
  if (toolId && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    activateToolUI(toolId);
  }
});

document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const action = btn.dataset.action;
    if (!action) return;

    switch (action) {
      case 'undo':
        dispatchAction(editor, 'undo');
        break;
      case 'redo':
        dispatchAction(editor, 'redo');
        break;
      case 'zoom-in':
        zoomIn(editor);
        break;
      case 'zoom-out':
        zoomOut(editor);
        break;
    }
  });
});

canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  const scene = screenToScene(editor.viewport, screenX, screenY);
  statusCoordsEl.textContent = `X: ${Math.round(scene.x)} Y: ${Math.round(scene.y)}`;
});

let lastSnapshot: InspectorSnapshot | null = null;
let inputFocused: HTMLElement | null = null;

function trackInputFocus(): void {
  const inputs = [
    propX,
    propY,
    propW,
    propH,
    propRotation,
    propName,
    propAlphaText,
    propSceneName,
    propSceneW,
    propSceneH,
  ];
  for (const input of inputs) {
    input.addEventListener('focus', () => {
      inputFocused = input;
    });
    input.addEventListener('blur', () => {
      if (inputFocused === input) inputFocused = null;
    });
  }
  propAlphaSlider.addEventListener('focus', () => {
    inputFocused = propAlphaSlider;
  });
  propAlphaSlider.addEventListener('blur', () => {
    if (inputFocused === propAlphaSlider) inputFocused = null;
  });
  propBlend.addEventListener('focus', () => {
    inputFocused = propBlend;
  });
  propBlend.addEventListener('blur', () => {
    if (inputFocused === propBlend) inputFocused = null;
  });
  propVisible.addEventListener('focus', () => {
    inputFocused = propVisible;
  });
  propVisible.addEventListener('blur', () => {
    if (inputFocused === propVisible) inputFocused = null;
  });
}

trackInputFocus();

function showNodeProps(show: boolean): void {
  const display = show ? '' : 'none';
  propsTransform.style.display = display;
  propsAppearance.style.display = display;
  propsNodeName.style.display = display;
  propsEmpty.style.display = show ? 'none' : '';
}

function syncPropertiesPanel(snapshot: InspectorSnapshot): void {
  const hasNode = snapshot.count > 0 && snapshot.node !== null;

  showNodeProps(hasNode);

  if (hasNode && snapshot.node && snapshot.transform) {
    const node = snapshot.node as Node2D;

    if (inputFocused !== propX) propX.value = String(Math.round(snapshot.transform.x * 100) / 100);
    if (inputFocused !== propY) propY.value = String(Math.round(snapshot.transform.y * 100) / 100);
    if (inputFocused !== propW) propW.value = String(Math.round(snapshot.transform.scaleX * 100) / 100);
    if (inputFocused !== propH) propH.value = String(Math.round(snapshot.transform.scaleY * 100) / 100);
    if (inputFocused !== propRotation) {
      const degrees = Math.round(((snapshot.transform.rotation * 180) / Math.PI) * 100) / 100;
      propRotation.value = String(degrees);
    }

    if (inputFocused !== propVisible) propVisible.checked = node.visible;

    const alphaPercent = Math.round(node.alpha * 100);
    if (inputFocused !== propAlphaSlider) propAlphaSlider.value = String(alphaPercent);
    if (inputFocused !== propAlphaText) propAlphaText.value = `${alphaPercent}%`;

    if (inputFocused !== propBlend) propBlend.value = node.blendMode ?? 'Normal';
    if (inputFocused !== propName) propName.value = snapshot.name ?? '';

    if (snapshot.count === 1) {
      propsHeader.textContent = snapshot.name ?? 'Properties';
    } else {
      propsHeader.textContent = `${snapshot.count} objects`;
    }
  } else {
    propsHeader.textContent = 'Properties';
  }

  const sceneSize = getSceneSize(editor);
  const sceneName = getSceneName(editor);
  if (inputFocused !== propSceneName) propSceneName.value = sceneName;
  if (inputFocused !== propSceneW) propSceneW.value = String(sceneSize.width);
  if (inputFocused !== propSceneH) propSceneH.value = String(sceneSize.height);
  toolbarSceneSizeEl.textContent = `${sceneSize.width} × ${sceneSize.height}`;
}

function syncStatusBar(): void {
  const zoomLabel = getZoomPercentLabel(editor);
  statusZoomEl.textContent = zoomLabel;
  toolbarZoomEl.textContent = zoomLabel;

  const snapshot = getInspectorSnapshot(editor);
  if (snapshot.count === 0) {
    statusSelectionEl.textContent = 'No selection';
  } else if (snapshot.count === 1) {
    statusSelectionEl.textContent = snapshot.name ? `"${snapshot.name}"` : '1 object';
  } else {
    statusSelectionEl.textContent = `${snapshot.count} objects`;
  }

  const undoBtn = document.querySelector('[data-action="undo"]') as HTMLButtonElement | null;
  const redoBtn = document.querySelector('[data-action="redo"]') as HTMLButtonElement | null;
  if (undoBtn) undoBtn.style.opacity = canUndo(editor) ? '1' : '0.3';
  if (redoBtn) redoBtn.style.opacity = canRedo(editor) ? '1' : '0.3';

  lastSnapshot = snapshot;
  syncPropertiesPanel(snapshot);
}

function commitTransform(): void {
  if (!lastSnapshot?.node || !lastSnapshot.transform) return;
  const node = lastSnapshot.node as Node2D;
  const x = parseFloat(propX.value) || 0;
  const y = parseFloat(propY.value) || 0;
  const scaleX = parseFloat(propW.value) || 1;
  const scaleY = parseFloat(propH.value) || 1;
  const rotationDeg = parseFloat(propRotation.value) || 0;
  const rotation = (rotationDeg * Math.PI) / 180;

  const newTransform = {
    ...lastSnapshot.transform,
    x,
    y,
    scaleX,
    scaleY,
    rotation,
  };

  executeCommand(editor, createSetTransform2DCommand(node, newTransform));
}

function commitAlpha(): void {
  if (!lastSnapshot?.node) return;
  const node = lastSnapshot.node as Node2D;
  let percent = parseInt(propAlphaSlider.value, 10);
  if (isNaN(percent)) percent = 100;
  percent = Math.max(0, Math.min(100, percent));
  const alpha = percent / 100;
  executeCommand(editor, createSetAlphaCommand(node, alpha));
}

propX.addEventListener('change', commitTransform);
propY.addEventListener('change', commitTransform);
propW.addEventListener('change', commitTransform);
propH.addEventListener('change', commitTransform);
propRotation.addEventListener('change', commitTransform);

propVisible.addEventListener('change', () => {
  if (!lastSnapshot?.node) return;
  const node = lastSnapshot.node as Node2D;
  executeCommand(editor, createSetVisibleCommand(node, propVisible.checked));
});

propAlphaSlider.addEventListener('input', () => {
  const percent = parseInt(propAlphaSlider.value, 10);
  propAlphaText.value = `${percent}%`;
});

propAlphaSlider.addEventListener('change', commitAlpha);

propAlphaText.addEventListener('change', () => {
  let percent = parseInt(propAlphaText.value, 10);
  if (isNaN(percent)) percent = 100;
  percent = Math.max(0, Math.min(100, percent));
  propAlphaSlider.value = String(percent);
  propAlphaText.value = `${percent}%`;
  commitAlpha();
});

propBlend.addEventListener('change', () => {
  if (!lastSnapshot?.node) return;
  const node = lastSnapshot.node as Node2D;
  executeCommand(editor, createSetBlendModeCommand(node, propBlend.value || null));
});

propName.addEventListener('change', () => {
  if (!lastSnapshot?.node) return;
  const node = lastSnapshot.node as Node2D;
  executeCommand(editor, createSetNodeNameCommand(node, propName.value || null));
});

propSceneName.addEventListener('change', () => {
  executeCommand(editor, createSetSceneNameCommand(editor.sceneState, propSceneName.value || 'Untitled'));
});

propSceneW.addEventListener('change', commitSceneSize);
propSceneH.addEventListener('change', commitSceneSize);

function commitSceneSize(): void {
  const w = parseInt(propSceneW.value, 10);
  const h = parseInt(propSceneH.value, 10);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;
  if (!editor.scene) return;
  executeCommand(editor, createSetSceneSizeCommand(editor.scene, w, h));
}

const resizeObserver = new ResizeObserver(() => {
  const { width: w, height: h } = syncCanvasSize();
  resizeCanvasRenderer(renderer, bootstrap, w, h);
});
resizeObserver.observe(canvasArea);

let rafId = 0;
function pollUI(): void {
  syncStatusBar();
  rafId = requestAnimationFrame(pollUI);
}
rafId = requestAnimationFrame(pollUI);

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(rafId);
  resizeObserver.disconnect();
  events.dispose();
  stopCanvasLoop(renderer);
  disposeCanvasRenderer(renderer);
  disposeDesktopBootstrap(bootstrap);
});
