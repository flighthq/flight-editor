export type AssetKind = 'audio' | 'font' | 'image' | 'model' | 'scene' | 'script' | 'video' | 'other';
export type AssetStatus = 'loading' | 'ready' | 'missing' | 'failed' | 'stale';

export interface AssetRecord {
  readonly id: string;
  name: string;
  folder: string;
  kind: AssetKind;
  sourceUri: string;
  derivedUri: string | null;
  status: AssetStatus;
  error: string | null;
  tags: string[];
  dependencies: string[];
  revision: number;
  metadata: Readonly<Record<string, unknown>>;
}

export interface AssetImportOperation {
  readonly id: number;
  readonly assetId: string;
  readonly sourceUri: string;
  readonly expectedRevision: number;
}

export interface AssetState {
  assets: Map<string, AssetRecord>;
  usages: Map<string, Set<string>>;
  pending: Map<string, AssetImportOperation>;
  nextOperationId: number;
  version: number;
}

export interface AssetInput {
  readonly id: string;
  readonly name: string;
  readonly kind: AssetKind;
  readonly sourceUri: string;
  readonly folder?: string;
  readonly tags?: readonly string[];
  readonly dependencies?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AssetImportResult {
  readonly derivedUri: string | null;
  readonly dependencies?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AssetRemovalResult {
  readonly removed: boolean;
  readonly usages: readonly string[];
  readonly dependents: readonly string[];
}

export interface AssetTransferResult {
  readonly assets: readonly AssetRecord[];
  readonly idMap: ReadonlyMap<string, string>;
}

function required(value: string, label: string): string {
  const result = value.trim();
  if (result === '') throw new TypeError(`${label} must not be empty`);
  return result;
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort();
}

function cloneAsset(asset: Readonly<AssetRecord>): AssetRecord {
  return {
    ...asset,
    tags: [...asset.tags],
    dependencies: [...asset.dependencies],
    metadata: { ...asset.metadata },
  };
}

function assertDependencies(state: Readonly<AssetState>, assetId: string, dependencies: readonly string[]): void {
  for (const dependency of dependencies) {
    if (dependency === assetId) throw new Error(`Asset ${assetId} cannot depend on itself`);
    if (!state.assets.has(dependency)) throw new Error(`Unknown asset dependency: ${dependency}`);
  }
}

function dependentsOf(state: Readonly<AssetState>, assetId: string): string[] {
  return Array.from(state.assets.values())
    .filter(({ dependencies }) => dependencies.includes(assetId))
    .map(({ id }) => id)
    .sort();
}

export function createAssetState(): AssetState {
  return { assets: new Map(), usages: new Map(), pending: new Map(), nextOperationId: 1, version: 0 };
}

export function registerAsset(state: AssetState, input: Readonly<AssetInput>): AssetRecord {
  const id = required(input.id, 'Asset id');
  if (state.assets.has(id)) throw new Error(`Asset already exists: ${id}`);
  const dependencies = unique(input.dependencies ?? []);
  assertDependencies(state, id, dependencies);
  const asset: AssetRecord = {
    id,
    name: required(input.name, 'Asset name'),
    folder: input.folder?.trim() ?? '',
    kind: input.kind,
    sourceUri: required(input.sourceUri, 'Asset source URI'),
    derivedUri: null,
    status: 'stale',
    error: null,
    tags: unique(input.tags ?? []),
    dependencies,
    revision: 0,
    metadata: { ...input.metadata },
  };
  state.assets.set(id, asset);
  state.version++;
  return cloneAsset(asset);
}

export function updateAsset(
  state: AssetState,
  assetId: string,
  change: Readonly<Pick<Partial<AssetRecord>, 'name' | 'folder' | 'sourceUri' | 'tags' | 'dependencies'>>,
): AssetRecord {
  const asset = state.assets.get(assetId);
  if (asset === undefined) throw new Error(`Unknown asset: ${assetId}`);
  const dependencies = change.dependencies === undefined ? asset.dependencies : unique(change.dependencies);
  assertDependencies(state, assetId, dependencies);
  if (change.name !== undefined) asset.name = required(change.name, 'Asset name');
  if (change.folder !== undefined) asset.folder = change.folder.trim();
  if (change.tags !== undefined) asset.tags = unique(change.tags);
  asset.dependencies = dependencies;
  if (change.sourceUri !== undefined && change.sourceUri !== asset.sourceUri) {
    asset.sourceUri = required(change.sourceUri, 'Asset source URI');
    asset.status = 'stale';
    asset.error = null;
    asset.revision++;
    state.pending.delete(assetId);
  }
  state.version++;
  return cloneAsset(asset);
}

export function duplicateAsset(state: AssetState, assetId: string, newId: string, name?: string): AssetRecord {
  const source = state.assets.get(assetId);
  if (source === undefined) throw new Error(`Unknown asset: ${assetId}`);
  const copy = registerAsset(state, {
    ...source,
    id: newId,
    name: name ?? `${source.name} copy`,
  });
  const stored = state.assets.get(copy.id)!;
  stored.derivedUri = source.derivedUri;
  stored.status = source.status;
  stored.revision = source.revision;
  return cloneAsset(stored);
}

export function beginAssetImport(state: AssetState, assetId: string): AssetImportOperation {
  const asset = state.assets.get(assetId);
  if (asset === undefined) throw new Error(`Unknown asset: ${assetId}`);
  const operation = {
    id: state.nextOperationId++,
    assetId,
    sourceUri: asset.sourceUri,
    expectedRevision: asset.revision,
  };
  state.pending.set(assetId, operation);
  asset.status = 'loading';
  asset.error = null;
  state.version++;
  return operation;
}

export function completeAssetImport(
  state: AssetState,
  operationId: number,
  result: Readonly<AssetImportResult>,
): boolean {
  const operation = Array.from(state.pending.values()).find(({ id }) => id === operationId);
  if (operation === undefined) return false;
  const asset = state.assets.get(operation.assetId);
  if (asset === undefined || asset.revision !== operation.expectedRevision || asset.sourceUri !== operation.sourceUri) {
    state.pending.delete(operation.assetId);
    return false;
  }
  const dependencies = unique(result.dependencies ?? asset.dependencies);
  assertDependencies(state, asset.id, dependencies);
  asset.derivedUri = result.derivedUri;
  asset.dependencies = dependencies;
  asset.metadata = { ...(result.metadata ?? asset.metadata) };
  asset.status = 'ready';
  asset.error = null;
  asset.revision++;
  state.pending.delete(asset.id);
  state.version++;
  return true;
}

export function failAssetImport(state: AssetState, operationId: number, message: string): boolean {
  const operation = Array.from(state.pending.values()).find(({ id }) => id === operationId);
  if (operation === undefined) return false;
  const asset = state.assets.get(operation.assetId);
  state.pending.delete(operation.assetId);
  if (asset !== undefined) {
    asset.status = 'failed';
    asset.error = required(message, 'Import error');
  }
  state.version++;
  return true;
}

export function cancelAssetImport(state: AssetState, assetId: string): boolean {
  if (!state.pending.delete(assetId)) return false;
  const asset = state.assets.get(assetId);
  if (asset !== undefined) asset.status = asset.derivedUri === null ? 'stale' : 'ready';
  state.version++;
  return true;
}

export function markAssetMissing(state: AssetState, assetId: string): boolean {
  const asset = state.assets.get(assetId);
  if (asset === undefined) return false;
  state.pending.delete(assetId);
  asset.status = 'missing';
  asset.error = null;
  state.version++;
  return true;
}

export function setAssetUsage(state: AssetState, assetId: string, ownerId: string, used: boolean): void {
  if (!state.assets.has(assetId)) throw new Error(`Unknown asset: ${assetId}`);
  const owner = required(ownerId, 'Asset usage owner');
  const usages = state.usages.get(assetId) ?? new Set<string>();
  if (used) usages.add(owner);
  else usages.delete(owner);
  if (usages.size === 0) state.usages.delete(assetId);
  else state.usages.set(assetId, usages);
  state.version++;
}

export function getAssetReferences(
  state: Readonly<AssetState>,
  assetId: string,
): { readonly usages: readonly string[]; readonly dependents: readonly string[] } {
  return {
    usages: Array.from(state.usages.get(assetId) ?? []).sort(),
    dependents: dependentsOf(state, assetId),
  };
}

export function removeAsset(state: AssetState, assetId: string, force = false): AssetRemovalResult {
  if (!state.assets.has(assetId)) return { removed: false, usages: [], dependents: [] };
  const references = getAssetReferences(state, assetId);
  if (!force && (references.usages.length > 0 || references.dependents.length > 0)) {
    return { removed: false, ...references };
  }
  state.assets.delete(assetId);
  state.usages.delete(assetId);
  state.pending.delete(assetId);
  if (force) {
    for (const dependentId of references.dependents) {
      const dependent = state.assets.get(dependentId);
      if (dependent !== undefined) dependent.dependencies = dependent.dependencies.filter((id) => id !== assetId);
    }
  }
  state.version++;
  return { removed: true, ...references };
}

export function relinkAssetReferences(state: AssetState, fromAssetId: string, toAssetId: string): void {
  if (fromAssetId === toAssetId) return;
  if (!state.assets.has(fromAssetId) || !state.assets.has(toAssetId)) throw new Error('Relink assets must exist');
  const usages = state.usages.get(fromAssetId);
  if (usages !== undefined) {
    const target = state.usages.get(toAssetId) ?? new Set<string>();
    for (const usage of usages) target.add(usage);
    state.usages.set(toAssetId, target);
    state.usages.delete(fromAssetId);
  }
  for (const asset of state.assets.values()) {
    if (asset.dependencies.includes(fromAssetId)) {
      asset.dependencies = unique(asset.dependencies.map((id) => (id === fromAssetId ? toAssetId : id)));
    }
  }
  state.version++;
}

export function transferAssets(
  source: Readonly<AssetState>,
  target: Readonly<AssetState>,
  assetIds: readonly string[],
  resolveId: (sourceId: string) => string = (sourceId) => sourceId,
): AssetTransferResult {
  const included = new Set<string>();
  const visit = (id: string): void => {
    const asset = source.assets.get(id);
    if (asset === undefined) throw new Error(`Unknown source asset: ${id}`);
    if (included.has(id)) return;
    included.add(id);
    for (const dependency of asset.dependencies) visit(dependency);
  };
  for (const id of assetIds) visit(id);
  const idMap = new Map<string, string>();
  for (const id of Array.from(included).sort()) {
    const mapped = required(resolveId(id), 'Transferred asset id');
    if (target.assets.has(mapped) || Array.from(idMap.values()).includes(mapped)) {
      throw new Error(`Transferred asset id already exists: ${mapped}`);
    }
    idMap.set(id, mapped);
  }
  const assets = Array.from(included)
    .sort()
    .map((id) => {
      const result = cloneAsset(source.assets.get(id)!);
      return { ...result, id: idMap.get(id)!, dependencies: result.dependencies.map((value) => idMap.get(value)!) };
    });
  return { assets, idMap };
}

export function validateAssetState(state: Readonly<AssetState>): readonly string[] {
  const diagnostics: string[] = [];
  for (const asset of state.assets.values()) {
    if (asset.id.trim() === '' || asset.name.trim() === '' || asset.sourceUri.trim() === '') {
      diagnostics.push(`Asset ${asset.id || '<empty>'} has invalid required fields`);
    }
    for (const dependency of asset.dependencies) {
      if (!state.assets.has(dependency)) diagnostics.push(`Asset ${asset.id} has missing dependency ${dependency}`);
      if (dependency === asset.id) diagnostics.push(`Asset ${asset.id} depends on itself`);
    }
    const pending = state.pending.get(asset.id);
    if (asset.status === 'loading' && pending === undefined)
      diagnostics.push(`Asset ${asset.id} is loading without an operation`);
  }
  for (const assetId of state.usages.keys()) {
    if (!state.assets.has(assetId)) diagnostics.push(`Usage references missing asset ${assetId}`);
  }
  return diagnostics.sort();
}
