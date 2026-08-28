import { describe, expect, it, vi } from 'vitest';

import { createEditorLoopState } from './editorLoop';
import { initEditor } from './initEditor';
import {
  createRenderLoopState,
  getMinFrameInterval,
  getRenderLoopFps,
  getRenderLoopFrameCount,
  isRenderLoopRunning,
  pauseRenderLoop,
  resumeRenderLoop,
  setRenderLoopCallback,
  startRenderLoop,
  stepRenderLoop,
  stopRenderLoop,
} from './renderLoop';

function setup() {
  const editor = initEditor({});
  const editorLoop = createEditorLoopState(editor);
  return { editor, editorLoop };
}

describe('createRenderLoopState', () => {
  it('creates with default config', () => {
    const state = createRenderLoopState();
    expect(state.frameCount).toBe(0);
    expect(state.isRunning).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.targetFps).toBe(60);
    expect(state.onRender).toBeNull();
  });

  it('accepts custom config', () => {
    const onRender = vi.fn();
    const state = createRenderLoopState({ targetFps: 30, onRender });
    expect(state.targetFps).toBe(30);
    expect(state.onRender).toBe(onRender);
  });
});

describe('stepRenderLoop', () => {
  it('does nothing when not running', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    const result = stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    expect(result).toBe(false);
    expect(renderLoop.frameCount).toBe(0);
  });

  it('increments frame count when running', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    expect(renderLoop.frameCount).toBe(1);
  });

  it('tracks delta time between frames', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    stepRenderLoop(renderLoop, editor, editorLoop, 1016);
    expect(renderLoop.deltaTime).toBe(16);
  });

  it('does not step when paused', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    pauseRenderLoop(renderLoop);
    const result = stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    expect(result).toBe(false);
    expect(renderLoop.frameCount).toBe(0);
  });
});

describe('startRenderLoop', () => {
  it('sets running state', () => {
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    expect(renderLoop.isRunning).toBe(true);
    expect(renderLoop.isPaused).toBe(false);
  });

  it('resets frame count', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    startRenderLoop(renderLoop);
    expect(renderLoop.frameCount).toBe(0);
  });
});

describe('stopRenderLoop', () => {
  it('clears running state', () => {
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stopRenderLoop(renderLoop);
    expect(renderLoop.isRunning).toBe(false);
  });
});

describe('pauseRenderLoop', () => {
  it('pauses a running loop', () => {
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    pauseRenderLoop(renderLoop);
    expect(renderLoop.isPaused).toBe(true);
    expect(renderLoop.isRunning).toBe(true);
  });

  it('does nothing if not running', () => {
    const renderLoop = createRenderLoopState();
    pauseRenderLoop(renderLoop);
    expect(renderLoop.isPaused).toBe(false);
  });
});

describe('resumeRenderLoop', () => {
  it('resumes a paused loop', () => {
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    pauseRenderLoop(renderLoop);
    resumeRenderLoop(renderLoop);
    expect(renderLoop.isPaused).toBe(false);
  });

  it('resets lastFrameTime on resume', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    pauseRenderLoop(renderLoop);
    resumeRenderLoop(renderLoop);
    expect(renderLoop.lastFrameTime).toBe(0);
  });
});

describe('isRenderLoopRunning', () => {
  it('returns true when running and not paused', () => {
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    expect(isRenderLoopRunning(renderLoop)).toBe(true);
  });

  it('returns false when paused', () => {
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    pauseRenderLoop(renderLoop);
    expect(isRenderLoopRunning(renderLoop)).toBe(false);
  });

  it('returns false when stopped', () => {
    const renderLoop = createRenderLoopState();
    expect(isRenderLoopRunning(renderLoop)).toBe(false);
  });
});

describe('getRenderLoopFps', () => {
  it('returns 0 when no frames rendered', () => {
    const renderLoop = createRenderLoopState();
    expect(getRenderLoopFps(renderLoop)).toBe(0);
  });

  it('calculates fps from delta time', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stepRenderLoop(renderLoop, editor, editorLoop, 1000);
    stepRenderLoop(renderLoop, editor, editorLoop, 1016);
    expect(getRenderLoopFps(renderLoop)).toBeCloseTo(62.5, 1);
  });
});

describe('getRenderLoopFrameCount', () => {
  it('tracks total frames', () => {
    const { editor, editorLoop } = setup();
    const renderLoop = createRenderLoopState();
    startRenderLoop(renderLoop);
    stepRenderLoop(renderLoop, editor, editorLoop, 0);
    stepRenderLoop(renderLoop, editor, editorLoop, 16);
    stepRenderLoop(renderLoop, editor, editorLoop, 32);
    expect(getRenderLoopFrameCount(renderLoop)).toBe(3);
  });
});

describe('setRenderLoopCallback', () => {
  it('sets the render callback', () => {
    const renderLoop = createRenderLoopState();
    const cb = vi.fn();
    setRenderLoopCallback(renderLoop, cb);
    expect(renderLoop.onRender).toBe(cb);
  });

  it('clears the callback with null', () => {
    const renderLoop = createRenderLoopState({ onRender: vi.fn() });
    setRenderLoopCallback(renderLoop, null);
    expect(renderLoop.onRender).toBeNull();
  });
});

describe('getMinFrameInterval', () => {
  it('returns interval for 60 fps', () => {
    const renderLoop = createRenderLoopState({ targetFps: 60 });
    expect(getMinFrameInterval(renderLoop)).toBeCloseTo(16.67, 1);
  });

  it('returns interval for 30 fps', () => {
    const renderLoop = createRenderLoopState({ targetFps: 30 });
    expect(getMinFrameInterval(renderLoop)).toBeCloseTo(33.33, 1);
  });
});
