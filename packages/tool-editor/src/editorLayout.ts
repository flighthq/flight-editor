import type { SceneDef, SceneNodeDef } from './sceneBuilder';

export interface LayoutConfig {
  readonly width: number;
  readonly height: number;
  readonly toolbarHeight?: number;
  readonly statusBarHeight?: number;
  readonly leftPanelWidth?: number;
  readonly rightPanelWidth?: number;
  readonly menuBarHeight?: number;
}

export function createEditorLayoutDef(config: Readonly<LayoutConfig>): SceneDef {
  const {
    width,
    height,
    toolbarHeight = 40,
    statusBarHeight = 24,
    leftPanelWidth = 240,
    rightPanelWidth = 280,
    menuBarHeight = 28,
  } = config;

  const canvasTop = menuBarHeight + toolbarHeight;
  const canvasHeight = height - canvasTop - statusBarHeight;
  const canvasWidth = width - leftPanelWidth - rightPanelWidth;

  return {
    width,
    height,
    root: [
      createMenuBarNode(width, menuBarHeight),
      createToolbarNode(width, menuBarHeight, toolbarHeight),
      createLeftPanelNode(leftPanelWidth, canvasTop, canvasHeight),
      createCanvasNode(leftPanelWidth, canvasTop, canvasWidth, canvasHeight),
      createRightPanelNode(width - rightPanelWidth, canvasTop, rightPanelWidth, canvasHeight),
      createStatusBarNode(width, height - statusBarHeight, statusBarHeight),
    ],
  };
}

export function getLayoutRegion(
  config: Readonly<LayoutConfig>,
  region: LayoutRegion,
): { x: number; y: number; width: number; height: number } {
  const {
    width,
    height,
    toolbarHeight = 40,
    statusBarHeight = 24,
    leftPanelWidth = 240,
    rightPanelWidth = 280,
    menuBarHeight = 28,
  } = config;

  const canvasTop = menuBarHeight + toolbarHeight;
  const canvasHeight = height - canvasTop - statusBarHeight;
  const canvasWidth = width - leftPanelWidth - rightPanelWidth;

  switch (region) {
    case 'menuBar':
      return { x: 0, y: 0, width, height: menuBarHeight };
    case 'toolbar':
      return { x: 0, y: menuBarHeight, width, height: toolbarHeight };
    case 'leftPanel':
      return { x: 0, y: canvasTop, width: leftPanelWidth, height: canvasHeight };
    case 'canvas':
      return { x: leftPanelWidth, y: canvasTop, width: canvasWidth, height: canvasHeight };
    case 'rightPanel':
      return { x: width - rightPanelWidth, y: canvasTop, width: rightPanelWidth, height: canvasHeight };
    case 'statusBar':
      return { x: 0, y: height - statusBarHeight, width, height: statusBarHeight };
  }
}

export type LayoutRegion = 'menuBar' | 'toolbar' | 'leftPanel' | 'canvas' | 'rightPanel' | 'statusBar';

export function getLayoutRegions(): readonly LayoutRegion[] {
  return ['menuBar', 'toolbar', 'leftPanel', 'canvas', 'rightPanel', 'statusBar'];
}

function createMenuBarNode(width: number, height: number): SceneNodeDef {
  return { name: 'menuBar', x: 0, y: 0, width, height };
}

function createToolbarNode(width: number, top: number, height: number): SceneNodeDef {
  return { name: 'toolbar', x: 0, y: top, width, height };
}

function createLeftPanelNode(width: number, top: number, height: number): SceneNodeDef {
  return {
    name: 'leftPanel',
    x: 0,
    y: top,
    width,
    height,
    children: [{ name: 'hierarchy', x: 0, y: 0, width, height }],
  };
}

function createCanvasNode(left: number, top: number, width: number, height: number): SceneNodeDef {
  return {
    name: 'canvas',
    x: left,
    y: top,
    width,
    height,
    children: [
      { name: 'viewport', x: 0, y: 0, width, height },
      { name: 'rulers', x: 0, y: 0, width, height },
    ],
  };
}

function createRightPanelNode(left: number, top: number, width: number, height: number): SceneNodeDef {
  return {
    name: 'rightPanel',
    x: left,
    y: top,
    width,
    height,
    children: [{ name: 'inspector', x: 0, y: 0, width, height }],
  };
}

function createStatusBarNode(width: number, top: number, height: number): SceneNodeDef {
  return { name: 'statusBar', x: 0, y: top, width, height };
}
