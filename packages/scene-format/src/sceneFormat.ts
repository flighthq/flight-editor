import { LineCounter, parseDocument, stringify } from 'yaml';

export type FlightSceneValue =
  | null
  | boolean
  | number
  | string
  | FlightSceneValue[]
  | { [key: string]: FlightSceneValue };

export interface FlightSceneNode {
  /** Stable serialized identity. Legacy version-1 documents may omit it until migrated. */
  readonly id?: string;
  readonly kind: string;
  readonly traits: Readonly<Record<string, FlightSceneValue>>;
  readonly children: readonly FlightSceneNode[];
  readonly [key: string]: unknown;
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

export interface FlightSceneDiagnostic {
  readonly code:
    | 'yaml-syntax'
    | 'invalid-document'
    | 'invalid-dimension'
    | 'missing-node-identity'
    | 'duplicate-node-identity';
  readonly severity: 'error' | 'warning';
  readonly message: string;
  readonly path: string;
  readonly line: number | null;
  readonly column: number | null;
}

export interface FlightSceneParseResult {
  readonly document: FlightSceneDocument | null;
  readonly diagnostics: readonly FlightSceneDiagnostic[];
}

export interface FlightSceneMigrationResult {
  readonly document: FlightSceneDocument;
  readonly changes: readonly {
    readonly code: 'minted-node-identity';
    readonly path: string;
    readonly identity: string;
  }[];
}

export function inspectFlightScene(source: string): FlightSceneParseResult {
  const lineCounter = new LineCounter();
  const parsed = parseDocument(source, {
    lineCounter,
    prettyErrors: true,
    uniqueKeys: true,
  });
  if (parsed.errors.length > 0) {
    return {
      document: null,
      diagnostics: parsed.errors.map((error) => {
        const position = lineCounter.linePos(error.pos[0]);
        return {
          code: 'yaml-syntax',
          severity: 'error',
          message: error.message,
          path: '',
          line: position.line,
          column: position.col,
        };
      }),
    };
  }
  let value: unknown;
  try {
    value = parsed.toJS({ maxAliasCount: 100 });
  } catch (error) {
    return {
      document: null,
      diagnostics: [
        {
          code: 'yaml-syntax',
          severity: 'error',
          message: error instanceof Error ? error.message : 'YAML expansion failed',
          path: '',
          line: null,
          column: null,
        },
      ],
    };
  }
  if (!isFlightSceneDocument(value)) {
    return {
      document: null,
      diagnostics: [
        {
          code: 'invalid-document',
          severity: 'error',
          message: 'Document does not match the Flight scene schema',
          path: '',
          line: null,
          column: null,
        },
      ],
    };
  }
  return { document: value, diagnostics: validateFlightScene(value) };
}

export function parseFlightScene(source: string): FlightSceneDocument {
  const result = inspectFlightScene(source);
  if (result.document === null) {
    const syntax = result.diagnostics.some(({ code }) => code === 'yaml-syntax');
    throw new Error(syntax ? 'Invalid Flight scene YAML' : 'Invalid Flight scene document');
  }
  return result.document;
}

export function validateFlightScene(document: Readonly<FlightSceneDocument>): readonly FlightSceneDiagnostic[] {
  const diagnostics: FlightSceneDiagnostic[] = [];
  if (document.scene.width <= 0 || document.scene.height <= 0) {
    diagnostics.push({
      code: 'invalid-dimension',
      severity: 'error',
      message: 'Scene width and height must be greater than zero',
      path: 'scene',
      line: null,
      column: null,
    });
  }
  const identities = new Map<string, string>();
  visitNode(document.scene.root, 'scene.root', (node, path) => {
    if (node.id === undefined || node.id.trim() === '') {
      diagnostics.push({
        code: 'missing-node-identity',
        severity: 'warning',
        message: 'Node has no stable serialized identity',
        path,
        line: null,
        column: null,
      });
      return;
    }
    const previous = identities.get(node.id);
    if (previous !== undefined) {
      diagnostics.push({
        code: 'duplicate-node-identity',
        severity: 'error',
        message: `Node identity is already used at ${previous}`,
        path,
        line: null,
        column: null,
      });
    } else {
      identities.set(node.id, path);
    }
  });
  return diagnostics;
}

export function migrateFlightSceneIdentities(
  document: Readonly<FlightSceneDocument>,
  mintIdentity: (path: string) => string,
): FlightSceneMigrationResult {
  const used = new Set<string>();
  visitNode(document.scene.root, 'scene.root', (node) => {
    if (node.id !== undefined && node.id.trim() !== '') {
      if (used.has(node.id)) throw new Error(`Cannot migrate duplicate node identity: ${node.id}`);
      used.add(node.id);
    }
  });
  const changes: { code: 'minted-node-identity'; path: string; identity: string }[] = [];
  const migrateNode = (node: FlightSceneNode, path: string): FlightSceneNode => {
    let identity = node.id;
    if (identity === undefined || identity.trim() === '') {
      identity = mintIdentity(path);
      if (identity.trim() === '' || used.has(identity)) {
        throw new Error(`Identity migration produced an invalid or duplicate identity: ${identity}`);
      }
      used.add(identity);
      changes.push({ code: 'minted-node-identity', path, identity });
    }
    return {
      ...node,
      id: identity,
      traits: { ...node.traits },
      children: node.children.map((child, index) => migrateNode(child, `${path}.children[${index}]`)),
    };
  };
  return {
    document: {
      ...document,
      scene: { ...document.scene, root: migrateNode(document.scene.root, 'scene.root') },
    },
    changes,
  };
}

export function stringifyFlightScene(document: Readonly<FlightSceneDocument>): string {
  if (!isFlightSceneDocument(document)) throw new Error('Invalid Flight scene document');
  return stringify(canonicalDocument(document), { indent: 2, lineWidth: 0 });
}

function canonicalDocument(document: Readonly<FlightSceneDocument>): Record<string, unknown> {
  const known = new Set(['format', 'version', 'name', 'backgroundColor', 'scene']);
  return {
    format: document.format,
    version: document.version,
    name: document.name,
    backgroundColor: document.backgroundColor,
    scene: canonicalScene(document.scene),
    ...sortedUnknown(document, known),
  };
}

function canonicalScene(scene: FlightSceneDocument['scene']): Record<string, unknown> {
  const known = new Set(['align', 'color', 'scaleMode', 'width', 'height', 'root']);
  return {
    align: scene.align,
    color: scene.color,
    scaleMode: scene.scaleMode,
    width: scene.width,
    height: scene.height,
    root: canonicalNode(scene.root),
    ...sortedUnknown(scene, known),
  };
}

function canonicalNode(node: FlightSceneNode): Record<string, unknown> {
  const known = new Set(['id', 'kind', 'traits', 'children']);
  return {
    ...(node.id === undefined ? {} : { id: node.id }),
    kind: node.kind,
    traits: node.traits,
    children: node.children.map(canonicalNode),
    ...sortedUnknown(node, known),
  };
}

function sortedUnknown(value: Readonly<Record<string, unknown>>, known: ReadonlySet<string>): Record<string, unknown> {
  return Object.fromEntries(
    Object.keys(value)
      .filter((key) => !known.has(key))
      .sort()
      .map((key) => [key, value[key]]),
  );
}

function visitNode(node: FlightSceneNode, path: string, visitor: (node: FlightSceneNode, path: string) => void): void {
  visitor(node, path);
  node.children.forEach((child, index) => visitNode(child, `${path}.children[${index}]`, visitor));
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
  if (value.id !== undefined && typeof value.id !== 'string') return false;
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
