import { createHeadlessAdapter } from '@flighthq/editor-host';
import { getNodeHeight, getNodeWidth } from '@flighthq/node';

import type { Node2D } from '@flighthq/types';

import {
  bindDomEvents,
  canRedo,
  canUndo,
  createCanvasRenderer,
  createDesktopBootstrap,
  createNewScene,
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
  getEditorCursorPosition,
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
  zoomToActualSize,
  zoomToFit,
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

// ── Bootstrap ───────────────────────────────────────────────

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

switchTool(editor, 'pointer');

// ── DOM references ──────────────────────────────────────────

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

// ── Tool strip ──────────────────────────────────────────────

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

// ── Keyboard shortcuts ──────────────────────────────────────

function isFormElement(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement
  );
}

document.addEventListener(
  'keydown',
  (e) => {
    if (isFormElement(e.target)) {
      e.stopPropagation();
      return;
    }

    const toolId = TOOL_SHORTCUTS[e.key.toLowerCase()];
    if (toolId && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      activateToolUI(toolId);
    }
  },
  true,
);

// ── Toolbar actions ─────────────────────────────────────────

document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    switch (btn.dataset.action) {
      case 'new':
        createNewScene(editor);
        break;
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

// ── Menu bar dropdowns ──────────────────────────────────────

let openMenu: HTMLElement | null = null;

function closeMenus(): void {
  if (openMenu) {
    openMenu.classList.remove('open');
    openMenu = null;
  }
}

function toggleMenu(item: HTMLElement): void {
  if (openMenu === item) {
    closeMenus();
    return;
  }
  closeMenus();
  item.classList.add('open');
  openMenu = item;
}

document.querySelectorAll<HTMLElement>('.menu-bar__item[data-menu]').forEach((item) => {
  item.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    toggleMenu(item);
  });

  item.addEventListener('pointerenter', () => {
    if (openMenu && openMenu !== item) toggleMenu(item);
  });
});

document.addEventListener('pointerdown', () => closeMenus());

document.querySelectorAll<HTMLElement>('[data-command]').forEach((menuItem) => {
  menuItem.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const cmd = menuItem.dataset.command!;
    closeMenus();

    switch (cmd) {
      case 'zoom-in':
        zoomIn(editor);
        break;
      case 'zoom-out':
        zoomOut(editor);
        break;
      case 'zoom-fit': {
        const size = getSceneSize(editor);
        zoomToFit(editor, size.width, size.height);
        break;
      }
      case 'zoom-100':
        zoomToActualSize(editor);
        break;
      case 'new-scene':
        createNewScene(editor);
        break;
      default:
        dispatchAction(editor, cmd);
        break;
    }
  });
});

// ── Cursor position ─────────────────────────────────────────

canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  const scene = screenToScene(editor.viewport, screenX, screenY);
  statusCoordsEl.textContent = `X: ${Math.round(scene.x)} Y: ${Math.round(scene.y)}`;
});

// ── Properties panel: focus tracking ────────────────────────

let inputFocused: HTMLElement | null = null;

function trackFocus(el: HTMLElement): void {
  el.addEventListener('focus', () => {
    inputFocused = el;
  });
  el.addEventListener('blur', () => {
    if (inputFocused === el) inputFocused = null;
  });
}

for (const el of [
  propX,
  propY,
  propW,
  propH,
  propRotation,
  propName,
  propAlphaSlider,
  propAlphaText,
  propBlend,
  propSceneName,
  propSceneW,
  propSceneH,
  propVisible,
]) {
  trackFocus(el);
}

// ── Properties panel: sync from editor ──────────────────────

let lastSnapshot: InspectorSnapshot | null = null;

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

    const nodeW = getNodeWidth(node);
    const nodeH = getNodeHeight(node);
    if (inputFocused !== propW) propW.value = String(Math.round(nodeW * 100) / 100);
    if (inputFocused !== propH) propH.value = String(Math.round(nodeH * 100) / 100);

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

// ── Properties panel: write to editor ───────────────────────

function commitTransform(): void {
  if (!lastSnapshot?.node || !lastSnapshot.transform) return;
  const node = lastSnapshot.node as Node2D;
  const x = parseFloat(propX.value) || 0;
  const y = parseFloat(propY.value) || 0;
  const rotationDeg = parseFloat(propRotation.value) || 0;
  const rotation = (rotationDeg * Math.PI) / 180;

  const newTransform = {
    ...lastSnapshot.transform,
    x,
    y,
    rotation,
  };

  executeCommand(editor, createSetTransform2DCommand(node, newTransform));

  const newW = parseFloat(propW.value);
  const newH = parseFloat(propH.value);
  const curW = getNodeWidth(node);
  const curH = getNodeHeight(node);
  if (!isNaN(newW) && !isNaN(newH) && (newW !== curW || newH !== curH)) {
    const scaleX = curW > 0 ? newW / curW : 1;
    const scaleY = curH > 0 ? newH / curH : 1;
    const sizeTransform = {
      ...newTransform,
      scaleX: lastSnapshot.transform.scaleX * scaleX,
      scaleY: lastSnapshot.transform.scaleY * scaleY,
    };
    executeCommand(editor, createSetTransform2DCommand(node, sizeTransform));
  }
}

function commitAlpha(): void {
  if (!lastSnapshot?.node) return;
  const node = lastSnapshot.node as Node2D;
  let percent = parseInt(propAlphaSlider.value, 10);
  if (isNaN(percent)) percent = 100;
  percent = Math.max(0, Math.min(100, percent));
  executeCommand(editor, createSetAlphaCommand(node, percent / 100));
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
  const value = propBlend.value === 'Normal' ? null : propBlend.value;
  executeCommand(editor, createSetBlendModeCommand(node, value));
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

// ── Status bar sync ─────────────────────────────────────────

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

  const cursor = getEditorCursorPosition(editor);
  if (cursor) {
    statusCoordsEl.textContent = `X: ${Math.round(cursor.x)} Y: ${Math.round(cursor.y)}`;
  }

  lastSnapshot = snapshot;
  syncPropertiesPanel(snapshot);
}

// ── Main loop ───────────────────────────────────────────────

let rafId = 0;
function pollUI(): void {
  syncStatusBar();
  rafId = requestAnimationFrame(pollUI);
}
rafId = requestAnimationFrame(pollUI);

// ── Resize ──────────────────────────────────────────────────

const resizeObserver = new ResizeObserver(() => {
  const { width: w, height: h } = syncCanvasSize();
  resizeCanvasRenderer(renderer, bootstrap, w, h);
});
resizeObserver.observe(canvasArea);

// ── Cleanup ─────────────────────────────────────────────────

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(rafId);
  resizeObserver.disconnect();
  events.dispose();
  stopCanvasLoop(renderer);
  disposeCanvasRenderer(renderer);
  disposeDesktopBootstrap(bootstrap);
});
