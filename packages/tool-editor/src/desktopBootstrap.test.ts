import { createHeadlessAdapter } from '@flighthq/editor-host';
import { describe, expect, it, vi } from 'vitest';

import {
  createDesktopBootstrap,
  disposeDesktopBootstrap,
  getDesktopEditor,
  getDesktopLayout,
  getDesktopPanels,
  getDesktopTheme,
  resizeDesktop,
  startDesktopLoop,
  stepDesktopLoop,
  stopDesktopLoop,
} from './desktopBootstrap';
import { isRenderLoopRunning } from './renderLoop';

function createTestBootstrap(overrides: Record<string, unknown> = {}) {
  return createDesktopBootstrap({
    hostAdapter: createHeadlessAdapter(),
    autoCreateScene: false,
    ...overrides,
  });
}

describe('createDesktopBootstrap', () => {
  it('creates a bootstrap with all components', () => {
    const bootstrap = createTestBootstrap();
    expect(bootstrap.editor).toBeDefined();
    expect(bootstrap.layout).toBeDefined();
    expect(bootstrap.panels).toBeDefined();
    expect(bootstrap.theme).toBeDefined();
    expect(bootstrap.preferences).toBeDefined();
    expect(bootstrap.renderLoop).toBeDefined();
  });

  it('uses dark theme by default', () => {
    const bootstrap = createTestBootstrap();
    expect(bootstrap.theme.name).toBe('dark');
  });

  it('uses light theme when preference is set', () => {
    const bootstrap = createTestBootstrap({ preferences: { theme: 'light' } });
    expect(bootstrap.theme.name).toBe('light');
  });

  it('uses default layout dimensions', () => {
    const bootstrap = createTestBootstrap();
    expect(bootstrap.layout.config.width).toBe(1280);
    expect(bootstrap.layout.config.height).toBe(720);
  });

  it('accepts custom layout config', () => {
    const bootstrap = createTestBootstrap({ layout: { width: 1920, height: 1080 } });
    expect(bootstrap.layout.config.width).toBe(1920);
    expect(bootstrap.layout.config.height).toBe(1080);
  });

  it('registers default panels', () => {
    const bootstrap = createTestBootstrap();
    expect(bootstrap.panels.panels.size).toBeGreaterThan(0);
  });
});

describe('startDesktopLoop', () => {
  it('starts the render loop', () => {
    const bootstrap = createTestBootstrap();
    expect(isRenderLoopRunning(bootstrap.renderLoop)).toBe(false);
    startDesktopLoop(bootstrap);
    expect(isRenderLoopRunning(bootstrap.renderLoop)).toBe(true);
  });
});

describe('stopDesktopLoop', () => {
  it('stops the render loop', () => {
    const bootstrap = createTestBootstrap();
    startDesktopLoop(bootstrap);
    stopDesktopLoop(bootstrap);
    expect(isRenderLoopRunning(bootstrap.renderLoop)).toBe(false);
  });
});

describe('stepDesktopLoop', () => {
  it('steps the render loop when running', () => {
    const bootstrap = createTestBootstrap({ autoCreateScene: true });
    startDesktopLoop(bootstrap);
    const result = stepDesktopLoop(bootstrap, 1000);
    expect(typeof result).toBe('boolean');
  });

  it('returns false when loop is not running', () => {
    const bootstrap = createTestBootstrap();
    expect(stepDesktopLoop(bootstrap, 1000)).toBe(false);
  });
});

describe('resizeDesktop', () => {
  it('resizes both editor viewport and layout', () => {
    const bootstrap = createTestBootstrap();
    resizeDesktop(bootstrap, 1920, 1080);
    expect(bootstrap.layout.config.width).toBe(1920);
    expect(bootstrap.layout.config.height).toBe(1080);
  });
});

describe('disposeDesktopBootstrap', () => {
  it('stops the loop and disposes the editor', () => {
    const bootstrap = createTestBootstrap({ autoCreateScene: true });
    startDesktopLoop(bootstrap);
    disposeDesktopBootstrap(bootstrap);
    expect(isRenderLoopRunning(bootstrap.renderLoop)).toBe(false);
  });
});

describe('getDesktopEditor', () => {
  it('returns the desktop editor', () => {
    const bootstrap = createTestBootstrap();
    expect(getDesktopEditor(bootstrap)).toBe(bootstrap.editor);
  });
});

describe('getDesktopLayout', () => {
  it('returns the layout scene', () => {
    const bootstrap = createTestBootstrap();
    expect(getDesktopLayout(bootstrap)).toBe(bootstrap.layout);
  });
});

describe('getDesktopTheme', () => {
  it('returns the theme', () => {
    const bootstrap = createTestBootstrap();
    expect(getDesktopTheme(bootstrap)).toBe(bootstrap.theme);
  });
});

describe('getDesktopPanels', () => {
  it('returns the panel registry', () => {
    const bootstrap = createTestBootstrap();
    expect(getDesktopPanels(bootstrap)).toBe(bootstrap.panels);
  });
});
