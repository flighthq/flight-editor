import type { EditorState } from './editorState';
import type { LayoutConfig } from './editorLayout';
import type { LayoutScene } from './layoutRenderer';
import type { PanelRegistry } from './panelDefinition';
import type { EditorPreferences } from './editorPreferences';
import type { EditorTheme } from './themeDefinition';

import { initEditor } from './initEditor';
import { createLayoutScene } from './layoutRenderer';
import { createPanelRegistry, registerDefaultPanels } from './panelDefinition';
import { applyPreferences, getDefaultPreferences } from './editorPreferences';
import { createDarkTheme, createLightTheme } from './themeDefinition';
import { registerDefaultContextMenuItems } from './contextMenuManager';

export interface EditorApplication {
  readonly state: EditorState;
  readonly layout: LayoutScene;
  readonly panels: PanelRegistry;
  readonly theme: EditorTheme;
  readonly preferences: EditorPreferences;
}

export interface EditorApplicationOptions {
  readonly layout?: LayoutConfig;
  readonly preferences?: Partial<EditorPreferences>;
  readonly skipDefaults?: boolean;
}

export function createEditorApplication(options?: Readonly<EditorApplicationOptions>): EditorApplication {
  const skipDefaults = options?.skipDefaults ?? false;
  const state = initEditor({ skipDefaults });

  if (!skipDefaults) {
    registerDefaultContextMenuItems(state);
  }

  const prefs = { ...getDefaultPreferences(), ...options?.preferences };
  applyPreferences(state, prefs);

  const theme = prefs.theme === 'light' ? createLightTheme() : createDarkTheme();

  const layoutConfig: LayoutConfig = options?.layout ?? { width: 1280, height: 720 };
  const layout = createLayoutScene(layoutConfig);

  const panels = createPanelRegistry();
  if (!skipDefaults) {
    registerDefaultPanels(panels);
  }

  return { state, layout, panels, theme, preferences: prefs };
}

export function getApplicationEditorState(app: Readonly<EditorApplication>): EditorState {
  return app.state;
}

export function getApplicationTheme(app: Readonly<EditorApplication>): EditorTheme {
  return app.theme;
}

export function getApplicationLayout(app: Readonly<EditorApplication>): LayoutScene {
  return app.layout;
}
