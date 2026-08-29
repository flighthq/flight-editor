import type { HostAdapter, HostCallbacks } from '@flighthq/editor-host';
import type { PropertyDefinition } from '@flighthq/editor-properties';
import type { Node2D, Transform2DLike } from '@flighthq/types';

import type { EditorState } from './editorState';
import type { DefaultToolsOptions } from './registerDefaultTools';

import { setHostCallbacks } from '@flighthq/editor-host';
import { createNodeFromKind, getNodeKindIds } from '@flighthq/editor-node-factory';
import { getSelectedNodes, setSelection } from '@flighthq/editor-selection';
import { getNodeChildAt, getNodeChildCount, getNodeTransform2D } from '@flighthq/node';

import { executeNamedCommand } from './commandRegistry';
import { createBatchTransformCommand } from './commands/batchTransformCommand';
import { createSetAlphaCommand } from './commands/setAlphaCommand';
import { createSetNodeNameCommand } from './commands/setNodeNameCommand';
import { createSetVisibleCommand } from './commands/setVisibleCommand';
import { batchCommands, canRedo, canUndo, executeCommand, redoCommand, undoCommand } from './historyUtils';
import { initEditor } from './initEditor';
import { getEditorPropertyDefinitions } from './propertyManager';
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
  selectNodes(paths: readonly (readonly number[])[]): boolean;
  getSelectionPaths(): readonly (readonly number[])[];
  getProperties(path: readonly number[]): readonly EditorRuntimePropertyField[];
  getNodeKinds(): readonly string[];
  getSceneSnapshot(): EditorRuntimeSceneSnapshot;
  getRenderNodes(): readonly EditorRuntimeRenderNode[];
  updateNode(path: readonly number[], property: EditorRuntimeProperty, value: string | number | boolean): boolean;
  updateNodes(
    paths: readonly (readonly number[])[],
    property: EditorRuntimeProperty,
    value: string | number | boolean,
  ): boolean;
  translateNodes(paths: readonly (readonly number[])[], deltaX: number, deltaY: number, snapToGrid?: boolean): boolean;
  transformNodes(paths: readonly (readonly number[])[], scaleFactor: number, rotationDelta: number): boolean;
  createNode(kind: string, parentPath?: readonly number[]): boolean;
  deleteNodes(paths: readonly (readonly number[])[]): boolean;
  duplicateNodes(paths: readonly (readonly number[])[]): boolean;
  reparentNode(path: readonly number[], parentPath: readonly number[]): boolean;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  resize(width: number, height: number): void;
  dispose(): void;
}

export interface EditorRuntimePropertyField extends PropertyDefinition {
  readonly id: EditorRuntimeProperty;
  readonly value: string | number | boolean;
}

export interface EditorRuntimeMatrix2D {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly e: number;
  readonly f: number;
}

export interface EditorRuntimeRenderNode {
  readonly path: readonly number[];
  readonly matrix: EditorRuntimeMatrix2D;
  readonly width: number;
  readonly height: number;
  readonly alpha: number;
  readonly color: number | null;
}

export interface EditorRuntimeSceneNodeSnapshot {
  readonly kind: string;
  readonly traits: Readonly<{ name?: string }>;
  readonly children: readonly EditorRuntimeSceneNodeSnapshot[];
}

export interface EditorRuntimeSceneSnapshot {
  readonly format: 'flight-scene';
  readonly version: 1;
  readonly name: string;
  readonly scene: {
    readonly align: string;
    readonly scaleMode: string;
    readonly width: number;
    readonly height: number;
    readonly root: EditorRuntimeSceneNodeSnapshot;
  };
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
      const selectionPaths = getSelectionPaths(state);
      deserializeScene(state, data);
      setSelection(
        state.selection,
        selectionPaths.flatMap((path) => {
          const node = getNodeAtPath(state, path);
          return node === null || path.length === 0 ? [] : [node];
        }),
      );
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
    selectNodes(paths) {
      const nodes = paths.flatMap((path) => {
        const node = getNodeAtPath(state, path);
        return node === null || path.length === 0 ? [] : [node];
      });
      if (nodes.length !== paths.length) return false;
      setSelection(state.selection, nodes);
      return true;
    },
    getSelectionPaths() {
      return getSelectionPaths(state);
    },
    getProperties(path) {
      const node = getNodeAtPath(state, path);
      if (node === null || path.length === 0) return [];
      return getRuntimeProperties(state, node);
    },
    getNodeKinds() {
      return getNodeKindIds(state.nodeFactory);
    },
    getSceneSnapshot() {
      const scene = state.scene;
      if (scene === null) throw new Error('Cannot snapshot an editor without a scene');
      return {
        format: 'flight-scene',
        version: 1,
        name: state.sceneState.name,
        scene: {
          align: scene.align,
          scaleMode: scene.scaleMode,
          width: scene.scene2dWidth,
          height: scene.scene2dHeight,
          root: getSceneNodeSnapshot(scene.root),
        },
      };
    },
    getRenderNodes() {
      return getRenderNodes(state);
    },
    updateNode(path, property, value) {
      return updateNodes(state, [path], property, value);
    },
    updateNodes(paths, property, value) {
      return updateNodes(state, paths, property, value);
    },
    translateNodes(paths, deltaX, deltaY, snapToGrid = false) {
      if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) return false;
      const nodes = resolveEditableNodes(state, paths);
      if (nodes === null) return false;
      executeCommand(
        state,
        createBatchTransformCommand(
          nodes.map((node) => {
            const transform = readTransform(node);
            transform.x += deltaX;
            transform.y += deltaY;
            if (snapToGrid) {
              if (state.snap.gridSizeX > 0)
                transform.x = Math.round(transform.x / state.snap.gridSizeX) * state.snap.gridSizeX;
              if (state.snap.gridSizeY > 0)
                transform.y = Math.round(transform.y / state.snap.gridSizeY) * state.snap.gridSizeY;
            }
            return { node, transform };
          }),
        ),
      );
      return true;
    },
    transformNodes(paths, scaleFactor, rotationDelta) {
      if (!Number.isFinite(scaleFactor) || scaleFactor <= 0 || !Number.isFinite(rotationDelta)) return false;
      const nodes = resolveEditableNodes(state, paths);
      if (nodes === null) return false;
      executeCommand(
        state,
        createBatchTransformCommand(
          nodes.map((node) => {
            const transform = readTransform(node);
            transform.scaleX *= scaleFactor;
            transform.scaleY *= scaleFactor;
            transform.rotation += rotationDelta;
            return { node, transform };
          }),
        ),
      );
      return true;
    },
    createNode(kind, parentPath = []) {
      const parent = getNodeAtPath(state, parentPath);
      const child = createNodeFromKind(state.nodeFactory, kind);
      if (parent === null || child === null) return false;
      if (!executeNamedCommand(state, 'addNode', { parent, child })) return false;
      setSelection(state.selection, [child]);
      return true;
    },
    deleteNodes(paths) {
      if (!selectEditableNodes(state, paths)) return false;
      return executeNamedCommand(state, 'deleteSelection');
    },
    duplicateNodes(paths) {
      if (!selectEditableNodes(state, paths)) return false;
      return executeNamedCommand(state, 'duplicateSelection');
    },
    reparentNode(path, parentPath) {
      const node = getNodeAtPath(state, path);
      const newParent = getNodeAtPath(state, parentPath);
      if (
        node === null ||
        newParent === null ||
        path.length === 0 ||
        node === newParent ||
        containsNode(node, newParent)
      ) {
        return false;
      }
      return executeNamedCommand(state, 'reparentNode', { node, newParent });
    },
    undo() {
      return undoCommand(state);
    },
    redo() {
      return redoCommand(state);
    },
    canUndo() {
      return canUndo(state);
    },
    canRedo() {
      return canRedo(state);
    },
    resize(width, height) {
      resizeViewport(state, width, height);
    },
    dispose() {
      state.scene = null;
    },
  };
}

function getSceneNodeSnapshot(node: Readonly<Node2D>): EditorRuntimeSceneNodeSnapshot {
  const children: EditorRuntimeSceneNodeSnapshot[] = [];
  for (let index = 0; index < getNodeChildCount(node); index++) {
    const child = getNodeChildAt(node, index);
    if (child !== null) children.push(getSceneNodeSnapshot(child));
  }
  return {
    kind: node.kind,
    traits: typeof node.name === 'string' ? { name: node.name } : {},
    children,
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

function updateNodes(
  state: EditorState,
  paths: readonly (readonly number[])[],
  property: EditorRuntimeProperty,
  value: string | number | boolean,
): boolean {
  const nodes = paths.flatMap((path) => {
    const node = getNodeAtPath(state, path);
    return node === null || path.length === 0 ? [] : [node];
  });
  if (nodes.length === 0 || nodes.length !== paths.length) return false;
  if (nodes.length === 1) return updateNodeProperty(state, nodes[0]!, property, value);

  if (property === 'name') {
    if (typeof value !== 'string') return false;
    executeCommand(
      state,
      batchCommands(
        nodes.map((node) => createSetNodeNameCommand(node, value)),
        'Rename Nodes',
      ),
    );
    return true;
  }
  if (property === 'visible') {
    if (typeof value !== 'boolean') return false;
    executeCommand(
      state,
      batchCommands(
        nodes.map((node) => createSetVisibleCommand(node, value)),
        'Set Visibility',
      ),
    );
    return true;
  }
  if (property === 'alpha') {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) return false;
    executeCommand(
      state,
      batchCommands(
        nodes.map((node) => createSetAlphaCommand(node, value)),
        'Set Opacity',
      ),
    );
    return true;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  const transforms = nodes.map((node) => {
    const transform = readTransform(node);
    transform[property] = value;
    return { node, transform };
  });
  executeCommand(state, createBatchTransformCommand(transforms));
  return true;
}

function readTransform(node: Node2D): Transform2DLike {
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
  return transform;
}

function getRuntimeProperties(state: Readonly<EditorState>, node: Node2D): EditorRuntimePropertyField[] {
  const transform = readTransform(node);
  const values: Readonly<Record<EditorRuntimeProperty, string | number | boolean>> = {
    name: node.name ?? node.kind,
    visible: node.visible,
    alpha: node.alpha,
    x: transform.x,
    y: transform.y,
    rotation: transform.rotation,
    scaleX: transform.scaleX,
    scaleY: transform.scaleY,
  };
  return getEditorPropertyDefinitions(state)
    .filter((definition): definition is PropertyDefinition & { id: EditorRuntimeProperty } => definition.id in values)
    .map((definition) => ({ ...definition, value: values[definition.id] }));
}

function getSelectionPaths(state: Readonly<EditorState>): readonly (readonly number[])[] {
  if (state.scene === null) return [];
  const selected = new Set(getSelectedNodes(state.selection));
  const paths: number[][] = [];
  walkNodePaths(state.scene.root, [], (node, path) => {
    if (selected.has(node)) paths.push(path);
  });
  return paths;
}

function walkNodePaths(node: Node2D, path: number[], visit: (node: Node2D, path: number[]) => void): void {
  visit(node, path);
  for (let index = 0; index < getNodeChildCount(node); index++) {
    const child = getNodeChildAt(node, index) as Node2D | null;
    if (child !== null) walkNodePaths(child, [...path, index], visit);
  }
}

function selectEditableNodes(state: EditorState, paths: readonly (readonly number[])[]): boolean {
  const nodes = resolveEditableNodes(state, paths);
  if (nodes === null) return false;
  setSelection(state.selection, nodes);
  return true;
}

function resolveEditableNodes(state: Readonly<EditorState>, paths: readonly (readonly number[])[]): Node2D[] | null {
  const nodes = paths.flatMap((path) => {
    const node = getNodeAtPath(state, path);
    return node === null || path.length === 0 ? [] : [node];
  });
  return nodes.length === 0 || nodes.length !== paths.length ? null : nodes;
}

function containsNode(parent: Node2D, candidate: Node2D): boolean {
  if (parent === candidate) return true;
  for (let index = 0; index < getNodeChildCount(parent); index++) {
    const child = getNodeChildAt(parent, index) as Node2D | null;
    if (child !== null && containsNode(child, candidate)) return true;
  }
  return false;
}

function getRenderNodes(state: Readonly<EditorState>): EditorRuntimeRenderNode[] {
  if (state.scene === null) return [];
  const result: EditorRuntimeRenderNode[] = [];
  const identity: EditorRuntimeMatrix2D = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  for (let index = 0; index < getNodeChildCount(state.scene.root); index++) {
    const child = getNodeChildAt(state.scene.root, index) as Node2D | null;
    if (child !== null) appendRenderNode(child, [index], identity, result);
  }
  return result;
}

function appendRenderNode(
  node: Node2D,
  path: number[],
  parentMatrix: EditorRuntimeMatrix2D,
  result: EditorRuntimeRenderNode[],
): void {
  if (!node.visible) return;
  const matrix = multiplyMatrix(parentMatrix, localMatrix(node));
  const traits = node as unknown as Readonly<Record<string, unknown>>;
  result.push({
    path,
    matrix,
    width: finiteDimension(traits.width, 80),
    height: finiteDimension(traits.height, 50),
    alpha: node.alpha,
    color: typeof traits.color === 'number' && Number.isFinite(traits.color) ? traits.color : null,
  });
  for (let index = 0; index < getNodeChildCount(node); index++) {
    const child = getNodeChildAt(node, index) as Node2D | null;
    if (child !== null) appendRenderNode(child, [...path, index], matrix, result);
  }
}

function localMatrix(node: Node2D): EditorRuntimeMatrix2D {
  const transform = readTransform(node);
  const a = Math.cos(transform.rotation + transform.skewY) * transform.scaleX;
  const b = Math.sin(transform.rotation + transform.skewY) * transform.scaleX;
  const c = -Math.sin(transform.rotation - transform.skewX) * transform.scaleY;
  const d = Math.cos(transform.rotation - transform.skewX) * transform.scaleY;
  return {
    a,
    b,
    c,
    d,
    e: transform.x - transform.pivotX * a - transform.pivotY * c,
    f: transform.y - transform.pivotX * b - transform.pivotY * d,
  };
}

function multiplyMatrix(left: EditorRuntimeMatrix2D, right: EditorRuntimeMatrix2D): EditorRuntimeMatrix2D {
  return {
    a: left.a * right.a + left.c * right.b,
    b: left.b * right.a + left.d * right.b,
    c: left.a * right.c + left.c * right.d,
    d: left.b * right.c + left.d * right.d,
    e: left.a * right.e + left.c * right.f + left.e,
    f: left.b * right.e + left.d * right.f + left.f,
  };
}

function finiteDimension(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}
