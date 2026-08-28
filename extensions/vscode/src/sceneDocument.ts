import type { EditableNodeProperty } from './protocol';

export interface FlightNode {
  readonly kind: string;
  readonly traits: Record<string, unknown>;
  readonly children: FlightNode[];
}

export interface FlightDocument {
  readonly format: 'flight-scene';
  readonly version: 1;
  readonly name: string;
  readonly backgroundColor: number;
  readonly scene: {
    readonly align: string;
    readonly color: number | null;
    readonly scaleMode: string;
    readonly width: number;
    readonly height: number;
    readonly root: FlightNode;
  };
}

export interface ParseResult {
  readonly document?: FlightDocument;
  readonly error?: string;
}

export function parseFlightDocument(text: string): ParseResult {
  let value: unknown;
  try {
    value = JSON.parse(text) as unknown;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid JSON' };
  }
  if (!isFlightDocument(value)) return { error: 'Expected a Flight scene document (format flight-scene, version 1).' };
  return { document: value };
}

export function updateFlightNode(
  text: string,
  path: readonly number[],
  property: EditableNodeProperty,
  value: string | number | boolean,
): ParseResult & { readonly text?: string } {
  const result = parseFlightDocument(text);
  if (!result.document) return result;
  const node = findNode(result.document.scene.root, path);
  if (!node) return { error: `Scene node path ${path.join('.')} no longer exists.` };
  if (!isPropertyValue(property, value)) return { error: `Invalid value for ${property}.` };
  node.traits[property] = value;
  return { document: result.document, text: `${JSON.stringify(result.document, null, 2)}\n` };
}

function findNode(root: FlightNode, path: readonly number[]): FlightNode | undefined {
  let node = root;
  for (const index of path) {
    const child = node.children[index];
    if (!child) return undefined;
    node = child;
  }
  return node;
}

function isPropertyValue(property: EditableNodeProperty, value: string | number | boolean): boolean {
  if (property === 'name') return typeof value === 'string';
  if (property === 'visible') return typeof value === 'boolean';
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  return property !== 'alpha' || (value >= 0 && value <= 1);
}

function isFlightDocument(value: unknown): value is FlightDocument {
  if (!isRecord(value) || value.format !== 'flight-scene' || value.version !== 1) return false;
  if (typeof value.name !== 'string' || !isFiniteNumber(value.backgroundColor) || !isRecord(value.scene)) return false;
  const scene = value.scene;
  return (
    typeof scene.align === 'string' &&
    typeof scene.scaleMode === 'string' &&
    (scene.color === null || isFiniteNumber(scene.color)) &&
    isFiniteNumber(scene.width) &&
    scene.width > 0 &&
    isFiniteNumber(scene.height) &&
    scene.height > 0 &&
    isFlightNode(scene.root)
  );
}

function isFlightNode(value: unknown): value is FlightNode {
  return (
    isRecord(value) &&
    typeof value.kind === 'string' &&
    isRecord(value.traits) &&
    Array.isArray(value.children) &&
    value.children.every(isFlightNode)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
