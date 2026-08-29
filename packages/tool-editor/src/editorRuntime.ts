import type { HostAdapter, HostCallbacks } from '@flighthq/editor-host';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import type { EditorState } from './editorState';
import type { DefaultToolsOptions } from './registerDefaultTools';

import { setHostCallbacks } from '@flighthq/editor-host';
import { setSelection } from '@flighthq/editor-selection';
import { getNodeChildAt, getNodeTransform2D } from '@flighthq/node';

import { executeNamedCommand } from './commandRegistry';
import { initEditor } from './initEditor';
import { registerDefaultContextMenuItems } from './contextMenuManager';
import { createNewScene } from './sceneManager';
import { deserializeScene, serializeScene } from './sceneSerializer';
import { fitToScene, resizeViewport } from './viewportOps';

export type EditorRuntimeProperty = 'name' | 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'alpha' | 'visible';

export interface EditorRuntimeOptions {
  readonly hostAdapter?: HostAdapter;
  readonly callbacks?: HostCallbacks;
  readonly viewportWidth?: number;
  readonly viewportHeight?: number;
  readonly tools?: Readonly<DefaultToolsOptions>;
  readonly autoCreateScene?: boolean;
  readonly sceneWidth?: number;
  readonly sceneHeight?: number;
  readonly sceneName?: string;
}

export interface EditorRuntime {
  readonly state: EditorState;
  load(data: ArrayBuffer): void;
  serialize(): ArrayBuffer;
  selectNode(path: readonly number[]): boolean;
  updateNode(path: readonly number[], property: EditorRuntimeProperty, value: string | number | boolean): boolean;
  resize(width: number, height: number): void;
  dispose(): void;
}

export function createEditorRuntime(options: Readonly<EditorRuntimeOptions> = {}): EditorRuntime {
  const state = initEditor({
    viewportWidth: options.viewportWidth,
    viewportHeight: options.viewportHeight,
    hostAdapter: options.hostAdapter,
    tools: options.tools,
  });
  if (options.callbacks) setHostCallbacks(state.host, options.callbacks);
  registerDefaultContextMenuItems(state);
  if (options.autoCreateScene ?? true) {
    createNewScene(state, options.sceneWidth ?? 800, options.sceneHeight ?? 600, options.sceneName ?? 'Untitled');
    fitToScene(state);
  }

  return {
    state,
    load(data) {
      deserializeScene(state, data);
      fitToScene(state);
    },
    serialize() {
      return serializeScene(state);
    },
    selectNode(path) {
      const node = getNodeAtPath(state, path);
      if (node === null) return false;
      setSelection(state.selection, [node]);
      return true;
    },
    updateNode(path, property, value) {
      const node = getNodeAtPath(state, path);
      if (node === null || path.length === 0) return false;
      return updateNodeProperty(state, node, property, value);
    },
    resize(width, height) {
      resizeViewport(state, width, height);
    },
    dispose() {
      state.scene = null;
    },
  };
}

export function getRuntimeNode(runtime: Readonly<EditorRuntime>, path: readonly number[]): Node2D | null {
  return getNodeAtPath(runtime.state, path);
}

function getNodeAtPath(state: Readonly<EditorState>, path: readonly number[]): Node2D | null {
  if (state.scene === null) return null;
  let node = state.scene.root;
  for (const index of path) {
    if (!Number.isInteger(index) || index < 0) return null;
    const child = getNodeChildAt(node, index);
    if (child === null) return null;
    node = child as Node2D;
  }
  return node;
}

function updateNodeProperty(
  state: EditorState,
  node: Node2D,
  property: EditorRuntimeProperty,
  value: string | number | boolean,
): boolean {
  if (property === 'name') {
    return typeof value === 'string' && executeNamedCommand(state, 'setNodeName', { node, name: value });
  }
  if (property === 'visible') {
    return typeof value === 'boolean' && executeNamedCommand(state, 'setVisible', { node, visible: value });
  }
  if (property === 'alpha') {
    return (
      typeof value === 'number' &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1 &&
      executeNamedCommand(state, 'setAlpha', { node, alpha: value })
    );
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  const transform: Transform2DLike = {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  };
  getNodeTransform2D(transform, node);
  transform[property] = value;
  return executeNamedCommand(state, 'setTransform2D', { node, transform });
}
