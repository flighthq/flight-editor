export interface DevTransform {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly tx: number;
  readonly ty: number;
}
export interface DevNodeInput {
  readonly id: string;
  readonly parentId?: string;
  readonly transform: DevTransform;
  readonly width: number;
  readonly height: number;
  readonly layout?: Readonly<Record<string, unknown>>;
  readonly typography?: Readonly<Record<string, unknown>>;
  readonly colors?: readonly string[];
  readonly tokens?: Readonly<Record<string, unknown>>;
  readonly component?: Readonly<Record<string, unknown>>;
  readonly assets?: readonly string[];
  readonly diagnostics?: readonly string[];
}
export interface DevNodeProjection {
  readonly id: string;
  readonly worldTransform: DevTransform;
  readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly spacing: { readonly parentX: number; readonly parentY: number } | null;
  readonly layout: Readonly<Record<string, unknown>>;
  readonly typography: Readonly<Record<string, unknown>>;
  readonly colors: readonly string[];
  readonly tokens: Readonly<Record<string, unknown>>;
  readonly component: Readonly<Record<string, unknown>>;
  readonly assets: readonly string[];
  readonly diagnostics: readonly string[];
}
export interface DevModeSnapshot {
  readonly revision: number;
  readonly nodes: readonly DevNodeProjection[];
}
export interface DevCodeGenerator {
  readonly id: string;
  readonly version: string;
  readonly target: string;
  readonly language: string;
  readonly mediaType: string;
  generate(snapshot: Readonly<DevModeSnapshot>): string | Promise<string>;
}
export interface DevModeState {
  generators: Map<string, DevCodeGenerator>;
  version: number;
}
export interface DevGenerationResult {
  readonly output: string | null;
  readonly mediaType: string | null;
  readonly diagnostics: readonly string[];
  readonly inputRevision: number;
}
function multiply(left: DevTransform, right: DevTransform): DevTransform {
  return {
    a: left.a * right.a + left.c * right.b,
    b: left.b * right.a + left.d * right.b,
    c: left.a * right.c + left.c * right.d,
    d: left.b * right.c + left.d * right.d,
    tx: left.a * right.tx + left.c * right.ty + left.tx,
    ty: left.b * right.tx + left.d * right.ty + left.ty,
  };
}
function freeze(value: unknown): void {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return;
  Object.freeze(value);
  for (const child of Object.values(value)) freeze(child);
}
export function createDevModeState(): DevModeState {
  return { generators: new Map(), version: 0 };
}
export function createDevModeSnapshot(revision: number, inputs: readonly DevNodeInput[]): DevModeSnapshot {
  if (!Number.isSafeInteger(revision) || revision < 0) throw new RangeError('Revision must be non-negative');
  const byId = new Map(inputs.map((node) => [node.id, node]));
  const cache = new Map<string, DevTransform>();
  const world = (node: DevNodeInput, visiting = new Set<string>()): DevTransform => {
    const found = cache.get(node.id);
    if (found !== undefined) return found;
    if (visiting.has(node.id)) throw new Error(`Transform hierarchy cycle: ${node.id}`);
    visiting.add(node.id);
    const parent = node.parentId === undefined ? undefined : byId.get(node.parentId);
    const result = parent === undefined ? { ...node.transform } : multiply(world(parent, visiting), node.transform);
    visiting.delete(node.id);
    cache.set(node.id, result);
    return result;
  };
  const nodes = inputs
    .map((node): DevNodeProjection => {
      const transform = world(node);
      const parent = node.parentId === undefined ? undefined : byId.get(node.parentId);
      const corners = [
        [0, 0],
        [node.width, 0],
        [0, node.height],
        [node.width, node.height],
      ].map(([x, y]) => ({
        x: transform.a * x! + transform.c * y! + transform.tx,
        y: transform.b * x! + transform.d * y! + transform.ty,
      }));
      const xs = corners.map(({ x }) => x);
      const ys = corners.map(({ y }) => y);
      return {
        id: node.id,
        worldTransform: transform,
        bounds: {
          x: Math.min(...xs),
          y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        },
        spacing: parent === undefined ? null : { parentX: node.transform.tx, parentY: node.transform.ty },
        layout: structuredClone(node.layout ?? {}),
        typography: structuredClone(node.typography ?? {}),
        colors: [...(node.colors ?? [])],
        tokens: structuredClone(node.tokens ?? {}),
        component: structuredClone(node.component ?? {}),
        assets: [...(node.assets ?? [])],
        diagnostics: [...(node.diagnostics ?? [])],
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  return { revision, nodes };
}
export function registerDevCodeGenerator(state: DevModeState, generator: DevCodeGenerator): void {
  if (generator.id.trim() === '' || generator.version.trim() === '')
    throw new TypeError('Generator identity must not be empty');
  if (state.generators.has(generator.id)) throw new Error(`Generator already registered: ${generator.id}`);
  state.generators.set(generator.id, generator);
  state.version++;
}
export function unregisterDevCodeGenerator(state: DevModeState, generatorId: string): boolean {
  if (!state.generators.delete(generatorId)) return false;
  state.version++;
  return true;
}
export async function runDevCodeGenerator(
  state: Readonly<DevModeState>,
  generatorId: string,
  snapshot: Readonly<DevModeSnapshot>,
): Promise<DevGenerationResult> {
  const generator = state.generators.get(generatorId);
  if (generator === undefined)
    return {
      output: null,
      mediaType: null,
      diagnostics: [`Unsupported generator: ${generatorId}`],
      inputRevision: snapshot.revision,
    };
  if (snapshot.nodes.some(({ diagnostics }) => diagnostics.length > 0))
    return {
      output: null,
      mediaType: generator.mediaType,
      diagnostics: snapshot.nodes.flatMap(({ id, diagnostics }) => diagnostics.map((value) => `${id}: ${value}`)),
      inputRevision: snapshot.revision,
    };
  const input = structuredClone(snapshot);
  freeze(input);
  try {
    return {
      output: await generator.generate(input),
      mediaType: generator.mediaType,
      diagnostics: [],
      inputRevision: snapshot.revision,
    };
  } catch (error) {
    return {
      output: null,
      mediaType: generator.mediaType,
      diagnostics: [error instanceof Error ? error.message : String(error)],
      inputRevision: snapshot.revision,
    };
  }
}
export function compareDevModeSnapshots(
  left: Readonly<DevModeSnapshot>,
  right: Readonly<DevModeSnapshot>,
): readonly { readonly nodeId: string; readonly changed: readonly string[] }[] {
  const ids = new Set([...left.nodes.map(({ id }) => id), ...right.nodes.map(({ id }) => id)]);
  const byLeft = new Map(left.nodes.map((node) => [node.id, node]));
  const byRight = new Map(right.nodes.map((node) => [node.id, node]));
  return Array.from(ids)
    .sort()
    .map((id) => {
      const a = byLeft.get(id);
      const b = byRight.get(id);
      if (a === undefined || b === undefined) return { nodeId: id, changed: [a === undefined ? 'added' : 'removed'] };
      const changed: string[] = [];
      for (const key of ['bounds', 'layout', 'typography', 'colors', 'tokens', 'component', 'assets'] as const)
        if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) changed.push(key);
      return { nodeId: id, changed };
    })
    .filter(({ changed }) => changed.length > 0);
}
