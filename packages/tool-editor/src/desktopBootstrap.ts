import type { HostAdapter, HostCallbacks } from '@flighthq/editor-host';

import type { DesktopEditor } from './desktopEditor';
import type { EditorPreferences } from './editorPreferences';
import type { LayoutConfig } from './editorLayout';
import type { LayoutScene } from './layoutRenderer';
import type { EditorTheme } from './themeDefinition';
import type { PanelRegistry } from './panelDefinition';
import type { RenderLoopConfig, RenderLoopState } from './renderLoop';
import type { DefaultToolsOptions } from './registerDefaultTools';
import type { ConfirmResult } from './sessionController';

import { createDesktopEditor } from './desktopEditor';
import { createLayoutScene, resizeLayout } from './layoutRenderer';
import { createPanelRegistry, registerDefaultPanels } from './panelDefinition';
import { applyPreferences, getDefaultPreferences } from './editorPreferences';
import { createDarkTheme, createLightTheme } from './themeDefinition';
import { applyThemeToLayout } from './themeRenderer';
import { createRenderLoopState, startRenderLoop, stepRenderLoop, stopRenderLoop } from './renderLoop';

export interface DesktopBootstrap {
  readonly editor: DesktopEditor;
  layout: LayoutScene;
  readonly panels: PanelRegistry;
  readonly theme: EditorTheme;
  readonly preferences: EditorPreferences;
  readonly renderLoop: RenderLoopState;
}

export interface DesktopBootstrapConfig {
  readonly hostAdapter: HostAdapter;
  readonly layout?: LayoutConfig;
  readonly preferences?: Partial<EditorPreferences>;
  readonly renderLoop?: RenderLoopConfig;
  readonly tools?: Readonly<DefaultToolsOptions>;
  readonly callbacks?: HostCallbacks;
  readonly appName?: string;
  readonly autoCreateScene?: boolean;
  readonly sceneWidth?: number;
  readonly sceneHeight?: number;
  readonly sceneName?: string;
  readonly confirmDiscard?: () => Promise<ConfirmResult>;
  readonly serialize?: () => ArrayBuffer;
  readonly deserialize?: (data: ArrayBuffer) => void;
}

export function createDesktopBootstrap(config: Readonly<DesktopBootstrapConfig>): DesktopBootstrap {
  const prefs = { ...getDefaultPreferences(), ...config.preferences };
  const theme = prefs.theme === 'light' ? createLightTheme() : createDarkTheme();

  const layoutConfig: LayoutConfig = config.layout ?? { width: 1280, height: 720 };
  const layout = createLayoutScene(layoutConfig);
  applyThemeToLayout(layout, theme);

  const panels = createPanelRegistry();
  registerDefaultPanels(panels);

  const editor = createDesktopEditor({
    hostAdapter: config.hostAdapter,
    viewportWidth: layoutConfig.width,
    viewportHeight: layoutConfig.height,
    tools: config.tools,
    callbacks: config.callbacks,
    appName: config.appName,
    autoCreateScene: config.autoCreateScene,
    sceneWidth: config.sceneWidth,
    sceneHeight: config.sceneHeight,
    sceneName: config.sceneName,
    confirmDiscard: config.confirmDiscard,
    serialize: config.serialize,
    deserialize: config.deserialize,
  });

  applyPreferences(editor.state, prefs);

  const renderLoop = createRenderLoopState(config.renderLoop);

  return { editor, layout, panels, theme, preferences: prefs, renderLoop };
}

export function startDesktopLoop(bootstrap: Readonly<DesktopBootstrap>): void {
  startRenderLoop(bootstrap.renderLoop);
}

export function stopDesktopLoop(bootstrap: Readonly<DesktopBootstrap>): void {
  stopRenderLoop(bootstrap.renderLoop);
}

export function stepDesktopLoop(bootstrap: Readonly<DesktopBootstrap>, timestamp: number): boolean {
  return stepRenderLoop(bootstrap.renderLoop, bootstrap.editor.state, bootstrap.editor.loop, timestamp);
}

export function resizeDesktop(bootstrap: DesktopBootstrap, width: number, height: number): void {
  bootstrap.editor.resize(width, height);
  bootstrap.layout = resizeLayout(bootstrap.layout, width, height);
  applyThemeToLayout(bootstrap.layout, bootstrap.theme);
}

export function disposeDesktopBootstrap(bootstrap: Readonly<DesktopBootstrap>): void {
  stopRenderLoop(bootstrap.renderLoop);
  bootstrap.editor.dispose();
}

export function getDesktopEditor(bootstrap: Readonly<DesktopBootstrap>): DesktopEditor {
  return bootstrap.editor;
}

export function getDesktopLayout(bootstrap: Readonly<DesktopBootstrap>): LayoutScene {
  return bootstrap.layout;
}

export function getDesktopTheme(bootstrap: Readonly<DesktopBootstrap>): EditorTheme {
  return bootstrap.theme;
}

export function getDesktopPanels(bootstrap: Readonly<DesktopBootstrap>): PanelRegistry {
  return bootstrap.panels;
}
