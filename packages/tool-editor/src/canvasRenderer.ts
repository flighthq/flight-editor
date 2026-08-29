import type { Application, ApplicationWindow, GlApplicationRenderView, Scene2D } from '@flighthq/types';

import type { DesktopBootstrap } from './desktopBootstrap';

import {
  attachApplicationRenderView,
  attachWindowRenderContext,
  attachWindowResize,
  createApplication,
  createApplicationWindow,
  detachApplicationRenderView,
  detachWindowRenderContext,
  detachWindowResize,
  registerApplicationWindow,
  setApplicationMainWindow,
  stopApplicationLoop,
  stepApplicationLoop,
} from '@flighthq/application';
import { createGlApplicationRenderView } from '@flighthq/application-gl';
import { renderGlScene2D } from '@flighthq/scene2d-gl';

import { registerGlRenderers } from './glRendererSetup';
import { resizeDesktop, stepDesktopLoop } from './desktopBootstrap';

export interface CanvasRendererState {
  readonly app: Application;
  readonly window: ApplicationWindow;
  readonly renderView: GlApplicationRenderView;
  readonly canvas: HTMLCanvasElement;
  animationFrameId: number;
  isRunning: boolean;
  renderersRegistered: boolean;
}

export interface CanvasRendererConfig {
  readonly canvas: HTMLCanvasElement;
  readonly antialias?: boolean;
  readonly powerPreference?: WebGLPowerPreference;
}

export function createCanvasRenderer(config: Readonly<CanvasRendererConfig>): CanvasRendererState {
  const { canvas } = config;
  const app = createApplication();
  const win = createApplicationWindow();

  registerApplicationWindow(app, win);
  setApplicationMainWindow(app, win);

  attachWindowRenderContext(win, canvas);
  attachWindowResize(win, canvas);

  const renderView = createGlApplicationRenderView(win, canvas, {
    render: {
      antialias: config.antialias ?? true,
      powerPreference: config.powerPreference ?? 'high-performance',
    },
  });

  attachApplicationRenderView(renderView);

  const state: CanvasRendererState = {
    app,
    window: win,
    renderView,
    canvas,
    animationFrameId: 0,
    isRunning: false,
    renderersRegistered: false,
  };

  registerGlRenderers(renderView.renderState);
  state.renderersRegistered = true;

  return state;
}

export function renderScene(renderer: Readonly<CanvasRendererState>, scene: Scene2D): void {
  const state = renderer.renderView.renderState;
  renderGlScene2D(state, scene.root);
}

export function startCanvasLoop(renderer: CanvasRendererState, bootstrap: DesktopBootstrap): void {
  if (renderer.isRunning) return;
  renderer.isRunning = true;

  function frame(timestamp: number) {
    if (!renderer.isRunning) return;

    stepDesktopLoop(bootstrap, timestamp);

    stepApplicationLoop(renderer.app, 0);

    const layoutScene = bootstrap.layout.scene;
    renderScene(renderer, layoutScene);

    renderer.animationFrameId = requestAnimationFrame(frame);
  }

  renderer.animationFrameId = requestAnimationFrame(frame);
}

export function stopCanvasLoop(renderer: CanvasRendererState): void {
  renderer.isRunning = false;
  if (renderer.animationFrameId !== 0) {
    cancelAnimationFrame(renderer.animationFrameId);
    renderer.animationFrameId = 0;
  }
}

export function resizeCanvasRenderer(
  renderer: Readonly<CanvasRendererState>,
  bootstrap: DesktopBootstrap,
  width: number,
  height: number,
): void {
  renderer.canvas.width = width;
  renderer.canvas.height = height;
  resizeDesktop(bootstrap, width, height);
}

export function disposeCanvasRenderer(renderer: CanvasRendererState): void {
  stopCanvasLoop(renderer);
  detachApplicationRenderView(renderer.renderView);
  detachWindowRenderContext(renderer.window);
  detachWindowResize(renderer.window);
  stopApplicationLoop(renderer.app);
}
