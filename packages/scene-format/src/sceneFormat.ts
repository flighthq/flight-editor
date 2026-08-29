import { parse, stringify } from 'yaml';

export type FlightSceneValue =
  | null
  | boolean
  | number
  | string
  | FlightSceneValue[]
  | { [key: string]: FlightSceneValue };

export interface FlightSceneNode {
  readonly kind: string;
  readonly traits: Readonly<Record<string, FlightSceneValue>>;
  readonly children: readonly FlightSceneNode[];
}

export interface FlightSceneDocument {
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
    readonly root: FlightSceneNode;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

export function parseFlightScene(source: string): FlightSceneDocument {
  let value: unknown;
  try {
    value = parse(source, { maxAliasCount: 100, prettyErrors: true, uniqueKeys: true });
  } catch {
    throw new Error('Invalid Flight scene YAML');
  }
  if (!isFlightSceneDocument(value)) throw new Error('Invalid Flight scene document');
  return value;
}

export function stringifyFlightScene(document: Readonly<FlightSceneDocument>): string {
  if (!isFlightSceneDocument(document)) throw new Error('Invalid Flight scene document');
  return stringify(document, { indent: 2, lineWidth: 0 });
}

function isFlightSceneDocument(value: unknown): value is FlightSceneDocument {
  if (!isRecord(value) || value.format !== 'flight-scene' || value.version !== 1) return false;
  if (typeof value.name !== 'string' || !isFiniteNumber(value.backgroundColor)) return false;
  const scene = value.scene;
  if (!isRecord(scene) || typeof scene.align !== 'string' || typeof scene.scaleMode !== 'string') return false;
  if (scene.color !== null && !isFiniteNumber(scene.color)) return false;
  return isFiniteNumber(scene.width) && isFiniteNumber(scene.height) && isFlightSceneNode(scene.root);
}

function isFlightSceneNode(value: unknown): value is FlightSceneNode {
  if (!isRecord(value) || typeof value.kind !== 'string' || !isRecord(value.traits)) return false;
  return Array.isArray(value.children) && value.children.every(isFlightSceneNode) && isFlightSceneValue(value.traits);
}

function isFlightSceneValue(value: unknown): value is FlightSceneValue {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return true;
  if (isFiniteNumber(value)) return true;
  if (Array.isArray(value)) return value.every(isFlightSceneValue);
  return isRecord(value) && Object.values(value).every(isFlightSceneValue);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
