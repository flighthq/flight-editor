import { getNodeChildCount } from '@flighthq/node';
import { describe, expect, it } from 'vitest';

import {
  createEditorApplication,
  getApplicationEditorState,
  getApplicationLayout,
  getApplicationTheme,
} from './editorApplication';

describe('createEditorApplication', () => {
  it('creates application with default settings', () => {
    const app = createEditorApplication();
    expect(app.state).toBeDefined();
    expect(app.layout).toBeDefined();
    expect(app.panels).toBeDefined();
    expect(app.theme).toBeDefined();
    expect(app.preferences).toBeDefined();
  });

  it('uses dark theme by default', () => {
    const app = createEditorApplication();
    expect(app.theme.name).toBe('dark');
  });

  it('uses light theme when specified', () => {
    const app = createEditorApplication({ preferences: { theme: 'light' } });
    expect(app.theme.name).toBe('light');
  });

  it('creates layout with default size', () => {
    const app = createEditorApplication();
    expect(app.layout.scene.scene2dWidth).toBe(1280);
    expect(app.layout.scene.scene2dHeight).toBe(720);
  });

  it('creates layout with custom size', () => {
    const app = createEditorApplication({ layout: { width: 1920, height: 1080 } });
    expect(app.layout.scene.scene2dWidth).toBe(1920);
    expect(app.layout.scene.scene2dHeight).toBe(1080);
  });

  it('registers default panels', () => {
    const app = createEditorApplication();
    expect(app.panels.panels.size).toBe(4);
  });

  it('skips defaults when requested', () => {
    const app = createEditorApplication({ skipDefaults: true });
    expect(app.panels.panels.size).toBe(0);
  });

  it('creates layout with six root regions', () => {
    const app = createEditorApplication();
    expect(getNodeChildCount(app.layout.scene.root)).toBe(6);
  });

  it('merges custom preferences', () => {
    const app = createEditorApplication({ preferences: { gridSize: 20 } });
    expect(app.preferences.gridSize).toBe(20);
    expect(app.preferences.showRulers).toBe(true);
  });
});

describe('getApplicationEditorState', () => {
  it('returns the editor state', () => {
    const app = createEditorApplication();
    const state = getApplicationEditorState(app);
    expect(state).toBe(app.state);
  });
});

describe('getApplicationTheme', () => {
  it('returns the theme', () => {
    const app = createEditorApplication();
    const theme = getApplicationTheme(app);
    expect(theme).toBe(app.theme);
  });
});

describe('getApplicationLayout', () => {
  it('returns the layout scene', () => {
    const app = createEditorApplication();
    const layout = getApplicationLayout(app);
    expect(layout).toBe(app.layout);
  });
});
