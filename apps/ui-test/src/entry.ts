import type {
  Application,
  ApplicationWindow,
  GlApplicationRenderView,
  GlRenderState,
  Node2D,
  Scene2D,
} from '@flighthq/types';

import type { FlightSceneNode, FlightSceneValue } from '@flighthq/scene-format';

import {
  attachApplicationRenderView,
  createApplication,
  createApplicationWindow,
  registerApplicationWindow,
  setApplicationMainWindow,
  stepApplicationLoop,
  stopApplicationLoop,
} from '@flighthq/application';
import { createGlApplicationRenderView } from '@flighthq/application-gl';
import { addNodeChild, computeScene2DFitTransform } from '@flighthq/node';
import { prepareScene2DRender, registerRenderer } from '@flighthq/render';
import { createEmptyGlRegistries, createGlPipeline, renderGlBackground } from '@flighthq/render-gl';
import { parseFlightScene } from '@flighthq/scene-format';
import { createDisplayObject, createScene2D, createSprite } from '@flighthq/scene2d';
import {
  defaultGlShapeCommands,
  defaultGlShapeRenderer,
  defaultGlSpriteRenderer,
  defaultGlTextLabelRenderer,
  registerGlColorAdjustmentMaterialFeature,
  registerGlShapeCommands,
  registerGlStandardMaterial,
  renderGlScene2D,
} from '@flighthq/scene2d-gl';
import { createShape, registerDefaultShapeBoundsCommands } from '@flighthq/shape';
import { createTextLabel } from '@flighthq/text';
import { ShapeKind, SpriteKind, TextLabelKind } from '@flighthq/types';

// ── Canvas setup ───────────────────────────────────────────

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const overlay = document.getElementById('drop-overlay')!;

function syncCanvasSize(): { width: number; height: number } {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  return { width: w, height: h };
}

const { width, height } = syncCanvasSize();

// ── Flight application + GL render view ────────────────────

const app: Application = createApplication();
const win: ApplicationWindow = createApplicationWindow();
win.width = width;
win.height = height;
win.devicePixelRatio = globalThis.devicePixelRatio ?? 1;

registerApplicationWindow(app, win);
setApplicationMainWindow(app, win);
const renderView: GlApplicationRenderView = createGlApplicationRenderView(win, canvas, {
  context: { antialias: true, powerPreference: 'high-performance' },
  pipeline: createGlPipeline(createEmptyGlRegistries()),
  render: { imageSmoothingEnabled: true },
});
attachApplicationRenderView(renderView);

const glState: GlRenderState = renderView.renderState;

// ── Register renderers ─────────────────────────────────────

registerDefaultShapeBoundsCommands();
registerGlStandardMaterial(glState);
registerGlColorAdjustmentMaterialFeature(glState);
registerGlShapeCommands(glState, defaultGlShapeCommands);
registerRenderer(glState, ShapeKind, defaultGlShapeRenderer);
registerRenderer(glState, SpriteKind, defaultGlSpriteRenderer);
registerRenderer(glState, TextLabelKind, defaultGlTextLabelRenderer);

// ── Scene state ────────────────────────────────────────────

let scene: Scene2D | null = null;

// ── Load .flight file ──────────────────────────────────────

function loadFlightData(data: ArrayBuffer): void {
  const text = new TextDecoder().decode(new Uint8Array(data));
  const doc = parseFlightScene(text);
  const s = doc.scene;

  const newScene = createScene2D({
    align: s.align as Scene2D['align'],
    color: s.color,
    scaleMode: s.scaleMode as Scene2D['scaleMode'],
    scene2dWidth: s.width,
    scene2dHeight: s.height,
  });

  applyNodeTraits(newScene.root as unknown as Record<string, unknown>, s.root.traits);
  restoreChildren(newScene.root, s.root.children);

  scene = newScene;
}

function applyNodeTraits(node: Record<string, unknown>, traits: Readonly<Record<string, FlightSceneValue>>): void {
  for (const [key, value] of Object.entries(traits)) {
    if (key === '__proto__' || key === 'constructor' || key === 'kind' || key === 'prototype') continue;
    node[key] = value;
  }
}

function createNodeForKind(kind: string): Node2D {
  switch (kind) {
    case ShapeKind:
      return createShape();
    case SpriteKind:
      return createSprite();
    case TextLabelKind:
      return createTextLabel();
    default:
      return createDisplayObject();
  }
}

function restoreChildren(parent: Node2D, children: readonly FlightSceneNode[]): void {
  for (const child of children) {
    const node = createNodeForKind(child.kind);
    applyNodeTraits(node as unknown as Record<string, unknown>, child.traits);
    addNodeChild(parent, node);
    restoreChildren(node, child.children);
  }
}

// ── Render loop ────────────────────────────────────────────

let rafId = 0;

function frame(_timestamp: number): void {
  stepApplicationLoop(app, 0);

  if (scene) {
    computeScene2DFitTransform(scene.root, scene, win.width, win.height);
    prepareScene2DRender(glState, scene.root);
    renderGlBackground(glState);
    renderGlScene2D(glState, scene.root);
  }

  rafId = requestAnimationFrame(frame);
}

rafId = requestAnimationFrame(frame);

// ── Resize ─────────────────────────────────────────────────

window.addEventListener('resize', () => {
  const { width: w, height: h } = syncCanvasSize();
  win.width = w;
  win.height = h;
  win.devicePixelRatio = globalThis.devicePixelRatio ?? 1;
});

// ── Drag-and-drop .flight files ────────────────────────────

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  overlay.classList.add('visible');
});

document.addEventListener('dragleave', (e) => {
  if (e.relatedTarget === null) overlay.classList.remove('visible');
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  overlay.classList.remove('visible');
  const file = e.dataTransfer?.files[0];
  if (file && file.name.endsWith('.flight')) {
    file.arrayBuffer().then(loadFlightData);
  }
});

// ── Auto-load bundled sample ───────────────────────────────

fetch('./sample.flight')
  .then((r) => {
    if (r.ok) return r.arrayBuffer();
    return null;
  })
  .then((data) => {
    if (data) loadFlightData(data);
  })
  .catch(() => {});

// ── Cleanup ────────────────────────────────────────────────

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(rafId);
  stopApplicationLoop(app);
});
