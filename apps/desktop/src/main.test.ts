import { describe, expect, it } from 'vitest';

import { createTauriApp } from './main';

function createMockIpc() {
  return {
    invoke: () => Promise.resolve(null),
    listen: () => Promise.resolve(() => {}),
  };
}

describe('createTauriApp', () => {
  it('creates an app with default dimensions', () => {
    const app = createTauriApp({ ipc: createMockIpc() });
    expect(app.bootstrap).toBeDefined();
    expect(app.bootstrap.layout.config.width).toBe(1280);
    expect(app.bootstrap.layout.config.height).toBe(720);
    app.dispose();
  });

  it('accepts custom dimensions', () => {
    const app = createTauriApp({ ipc: createMockIpc(), width: 1920, height: 1080 });
    expect(app.bootstrap.layout.config.width).toBe(1920);
    expect(app.bootstrap.layout.config.height).toBe(1080);
    app.dispose();
  });

  it('step returns a boolean', () => {
    const app = createTauriApp({ ipc: createMockIpc() });
    const result = app.step(1000);
    expect(typeof result).toBe('boolean');
    app.dispose();
  });

  it('resize updates layout dimensions', () => {
    const app = createTauriApp({ ipc: createMockIpc() });
    app.resize(800, 600);
    expect(app.bootstrap.layout.config.width).toBe(800);
    expect(app.bootstrap.layout.config.height).toBe(600);
    app.dispose();
  });
});
