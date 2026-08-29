export type EditableNodeProperty = 'name' | 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'alpha' | 'visible';

export interface PropertySnapshot {
  readonly id: EditableNodeProperty;
  readonly label: string;
  readonly type: 'string' | 'number' | 'boolean' | 'color' | 'enum' | 'vector2';
  readonly category: string;
  readonly value: string | number | boolean;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export interface DocumentSnapshot {
  readonly type: 'document';
  readonly scene: SceneSnapshot | null;
  readonly version: number;
  readonly selection: readonly (readonly number[])[];
  readonly properties: readonly PropertySnapshot[];
  readonly nodeKinds: readonly string[];
  readonly renderNodes: readonly RenderNodeSnapshot[];
}

export interface SceneNodeSnapshot {
  readonly kind: string;
  readonly traits: Readonly<{ name?: string }>;
  readonly children: readonly SceneNodeSnapshot[];
}

export interface SceneSnapshot {
  readonly format: 'flight-scene';
  readonly version: 1;
  readonly name: string;
  readonly scene: {
    readonly align: string;
    readonly scaleMode: string;
    readonly width: number;
    readonly height: number;
    readonly root: SceneNodeSnapshot;
  };
}

export interface RenderNodeSnapshot {
  readonly path: readonly number[];
  readonly matrix: Readonly<{ a: number; b: number; c: number; d: number; e: number; f: number }>;
  readonly width: number;
  readonly height: number;
  readonly alpha: number;
  readonly color: number | null;
}

export interface ReadyMessage {
  readonly type: 'ready';
}

export interface OpenSourceMessage {
  readonly type: 'openSource';
}

export interface SelectNodeMessage {
  readonly type: 'selectNode';
  readonly paths: readonly (readonly number[])[];
}

export interface UpdateNodeMessage {
  readonly type: 'updateNode';
  readonly baseVersion: number;
  readonly paths: readonly (readonly number[])[];
  readonly property: EditableNodeProperty;
  readonly value: string | number | boolean;
}

export type SceneAction =
  | { readonly action: 'create'; readonly kind: string; readonly parentPath: readonly number[] }
  | { readonly action: 'delete'; readonly paths: readonly (readonly number[])[] }
  | { readonly action: 'duplicate'; readonly paths: readonly (readonly number[])[] }
  | {
      readonly action: 'translate';
      readonly paths: readonly (readonly number[])[];
      readonly deltaX: number;
      readonly deltaY: number;
      readonly snap: boolean;
    }
  | {
      readonly action: 'transform';
      readonly paths: readonly (readonly number[])[];
      readonly scaleFactor: number;
      readonly rotationDelta: number;
    }
  | { readonly action: 'reparent'; readonly path: readonly number[]; readonly parentPath: readonly number[] };

export interface SceneActionMessage {
  readonly type: 'sceneAction';
  readonly baseVersion: number;
  readonly operation: SceneAction;
}

export type WebviewMessage =
  | ReadyMessage
  | OpenSourceMessage
  | SelectNodeMessage
  | UpdateNodeMessage
  | SceneActionMessage;

export function isWebviewMessage(value: unknown): value is WebviewMessage {
  if (!isRecord(value) || typeof value.type !== 'string') return false;
  if (value.type === 'ready' || value.type === 'openSource') return true;
  if (value.type === 'selectNode') return isNodePaths(value.paths);
  if (value.type === 'sceneAction') return Number.isInteger(value.baseVersion) && isSceneAction(value.operation);
  return (
    value.type === 'updateNode' &&
    Number.isInteger(value.baseVersion) &&
    isNodePaths(value.paths) &&
    isEditableNodeProperty(value.property) &&
    (typeof value.value === 'string' || typeof value.value === 'number' || typeof value.value === 'boolean')
  );
}

function isSceneAction(value: unknown): value is SceneAction {
  if (!isRecord(value) || typeof value.action !== 'string') return false;
  if (value.action === 'create') return typeof value.kind === 'string' && isNodePath(value.parentPath);
  if (value.action === 'delete' || value.action === 'duplicate') return isNodePaths(value.paths);
  if (value.action === 'translate') {
    return (
      isNodePaths(value.paths) &&
      isFiniteNumber(value.deltaX) &&
      isFiniteNumber(value.deltaY) &&
      typeof value.snap === 'boolean'
    );
  }
  if (value.action === 'transform') {
    return isNodePaths(value.paths) && isFiniteNumber(value.scaleFactor) && isFiniteNumber(value.rotationDelta);
  }
  return value.action === 'reparent' && isNodePath(value.path) && isNodePath(value.parentPath);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNodePaths(value: unknown): value is readonly (readonly number[])[] {
  return Array.isArray(value) && value.every(isNodePath);
}

function isNodePath(value: unknown): value is readonly number[] {
  return Array.isArray(value) && value.every((part) => Number.isInteger(part) && part >= 0);
}

function isEditableNodeProperty(value: unknown): value is EditableNodeProperty {
  return ['name', 'x', 'y', 'scaleX', 'scaleY', 'rotation', 'alpha', 'visible'].includes(String(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
