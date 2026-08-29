export interface DocumentSnapshot {
  readonly type: 'document';
  readonly text: string;
  readonly version: number;
}

export interface ReadyMessage {
  readonly type: 'ready';
}

export interface OpenSourceMessage {
  readonly type: 'openSource';
}

export interface SelectNodeMessage {
  readonly type: 'selectNode';
  readonly path: readonly number[];
}

export interface UpdateNodeMessage {
  readonly type: 'updateNode';
  readonly baseVersion: number;
  readonly path: readonly number[];
  readonly property: EditableNodeProperty;
  readonly value: string | number | boolean;
}

export type EditableNodeProperty = 'name' | 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'alpha' | 'visible';
export type WebviewMessage = ReadyMessage | OpenSourceMessage | SelectNodeMessage | UpdateNodeMessage;

export function isWebviewMessage(value: unknown): value is WebviewMessage {
  if (!isRecord(value) || typeof value.type !== 'string') return false;
  if (value.type === 'ready' || value.type === 'openSource') return true;
  if (value.type === 'selectNode') return isNodePath(value.path);
  return (
    value.type === 'updateNode' &&
    Number.isInteger(value.baseVersion) &&
    isNodePath(value.path) &&
    isEditableNodeProperty(value.property) &&
    (typeof value.value === 'string' || typeof value.value === 'number' || typeof value.value === 'boolean')
  );
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
