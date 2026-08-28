import type { EditorState } from './editorState';
import type { EditorLoopState } from './editorLoop';

import { tickEditor } from './editorLoop';

export interface RenderLoopState {
  frameCount: number;
  lastFrameTime: number;
  deltaTime: number;
  isRunning: boolean;
  isPaused: boolean;
  targetFps: number;
  onRender: (() => void) | null;
}

export interface RenderLoopConfig {
  readonly targetFps?: number;
  readonly onRender?: () => void;
}

export function createRenderLoopState(config?: Readonly<RenderLoopConfig>): RenderLoopState {
  return {
    frameCount: 0,
    lastFrameTime: 0,
    deltaTime: 0,
    isRunning: false,
    isPaused: false,
    targetFps: config?.targetFps ?? 60,
    onRender: config?.onRender ?? null,
  };
}

export function stepRenderLoop(
  renderLoop: RenderLoopState,
  editor: EditorState,
  editorLoop: EditorLoopState,
  timestamp: number,
): boolean {
  if (!renderLoop.isRunning || renderLoop.isPaused) return false;

  const dt = renderLoop.lastFrameTime > 0 ? timestamp - renderLoop.lastFrameTime : 0;
  renderLoop.deltaTime = dt;
  renderLoop.lastFrameTime = timestamp;
  renderLoop.frameCount++;

  const changed = tickEditor(editor, editorLoop);

  if (changed && renderLoop.onRender) {
    renderLoop.onRender();
  }

  return changed;
}

export function startRenderLoop(renderLoop: RenderLoopState): void {
  renderLoop.isRunning = true;
  renderLoop.isPaused = false;
  renderLoop.lastFrameTime = 0;
  renderLoop.frameCount = 0;
}

export function stopRenderLoop(renderLoop: RenderLoopState): void {
  renderLoop.isRunning = false;
  renderLoop.isPaused = false;
}

export function pauseRenderLoop(renderLoop: RenderLoopState): void {
  if (renderLoop.isRunning) {
    renderLoop.isPaused = true;
  }
}

export function resumeRenderLoop(renderLoop: RenderLoopState): void {
  if (renderLoop.isRunning && renderLoop.isPaused) {
    renderLoop.isPaused = false;
    renderLoop.lastFrameTime = 0;
  }
}

export function isRenderLoopRunning(renderLoop: Readonly<RenderLoopState>): boolean {
  return renderLoop.isRunning && !renderLoop.isPaused;
}

export function getRenderLoopFps(renderLoop: Readonly<RenderLoopState>): number {
  if (renderLoop.deltaTime <= 0) return 0;
  return 1000 / renderLoop.deltaTime;
}

export function getRenderLoopFrameCount(renderLoop: Readonly<RenderLoopState>): number {
  return renderLoop.frameCount;
}

export function setRenderLoopCallback(renderLoop: RenderLoopState, onRender: (() => void) | null): void {
  renderLoop.onRender = onRender;
}

export function getMinFrameInterval(renderLoop: Readonly<RenderLoopState>): number {
  return 1000 / renderLoop.targetFps;
}
