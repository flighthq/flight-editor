export type PluginCapability =
  | 'commands'
  | 'diagnostics'
  | 'document'
  | 'export'
  | 'generators'
  | 'import'
  | 'inspectors'
  | 'network'
  | 'panels'
  | 'resources'
  | 'tools'
  | 'widgets';
export type PluginContributionKind = Exclude<PluginCapability, 'document' | 'network'> | 'node-factories';
export interface PluginManifest {
  readonly id: string;
  readonly version: string;
  readonly apiVersion: number;
  readonly capabilities: readonly PluginCapability[];
}
export interface PluginContribution {
  readonly id: string;
  readonly kind: PluginContributionKind;
  readonly value: unknown;
}
export interface PluginWidgetSchema {
  readonly type: 'object';
  readonly properties: Readonly<Record<string, 'boolean' | 'number' | 'string'>>;
  readonly required?: readonly string[];
}
export interface EditorPlugin {
  readonly manifest: PluginManifest;
  activate(context: PluginActivationContext): void | (() => void);
  readonly migrateDocumentData?: (data: unknown, fromVersion: number) => unknown;
}
export interface PluginActivationContext {
  readonly register: (value: PluginContribution) => void;
  readonly subscribe: (dispose: () => void) => void;
  readonly mutateDocument: (commandId: string, mutation: () => void) => void;
}
export interface LoadedPlugin {
  readonly plugin: EditorPlugin;
  readonly keys: readonly string[];
  readonly disposals: readonly (() => void)[];
}
export interface PluginState {
  readonly apiVersion: number;
  readonly hostCapabilities: ReadonlySet<PluginCapability>;
  plugins: Map<string, LoadedPlugin>;
  contributions: Map<string, PluginContribution>;
  documentData: Map<string, { version: number; data: unknown }>;
  version: number;
}
function required(value: string, label: string): void {
  if (value.trim() === '') throw new TypeError(`${label} must not be empty`);
}
function key(value: Readonly<PluginContribution>): string {
  return `${value.kind}:${value.id}`;
}
export function createPluginState(apiVersion: number, hostCapabilities: ReadonlySet<PluginCapability>): PluginState {
  if (!Number.isSafeInteger(apiVersion) || apiVersion < 1) throw new RangeError('Plugin API version must be positive');
  return {
    apiVersion,
    hostCapabilities: new Set(hostCapabilities),
    plugins: new Map(),
    contributions: new Map(),
    documentData: new Map(),
    version: 0,
  };
}
export function loadPlugin(state: PluginState, plugin: EditorPlugin): void {
  const manifest = plugin.manifest;
  required(manifest.id, 'Plugin id');
  required(manifest.version, 'Plugin version');
  if (manifest.apiVersion !== state.apiVersion) throw new Error('Plugin API version mismatch');
  if (state.plugins.has(manifest.id)) throw new Error(`Plugin already loaded: ${manifest.id}`);
  for (const capability of manifest.capabilities)
    if (!state.hostCapabilities.has(capability)) throw new Error(`Host capability unavailable: ${capability}`);
  const keys: string[] = [];
  const disposals: (() => void)[] = [];
  const allowed = new Set(manifest.capabilities);
  try {
    const dispose = plugin.activate({
      register(value) {
        required(value.id, 'Contribution id');
        const capability = value.kind === 'node-factories' ? 'tools' : value.kind;
        if (!allowed.has(capability)) throw new Error(`Undeclared plugin capability: ${capability}`);
        const id = key(value);
        if (state.contributions.has(id)) throw new Error(`Duplicate contribution: ${id}`);
        state.contributions.set(id, { ...value });
        keys.push(id);
      },
      subscribe(value) {
        disposals.push(value);
      },
      mutateDocument(commandId, mutation) {
        required(commandId, 'Document command id');
        if (!allowed.has('document')) throw new Error('Document capability is required');
        mutation();
      },
    });
    if (dispose !== undefined) disposals.push(dispose);
  } catch (error) {
    for (const id of keys) state.contributions.delete(id);
    for (const dispose of disposals.reverse()) dispose();
    throw error;
  }
  state.plugins.set(manifest.id, { plugin, keys, disposals });
  state.version++;
}
export function unloadPlugin(state: PluginState, pluginId: string): boolean {
  const loaded = state.plugins.get(pluginId);
  if (loaded === undefined) return false;
  for (const id of loaded.keys) state.contributions.delete(id);
  for (const dispose of [...loaded.disposals].reverse()) dispose();
  state.plugins.delete(pluginId);
  state.version++;
  return true;
}
export function getPluginContributions(
  state: Readonly<PluginState>,
  kind: PluginContributionKind,
): readonly PluginContribution[] {
  return Array.from(state.contributions.values())
    .filter((value) => value.kind === kind)
    .sort((a, b) => a.id.localeCompare(b.id));
}
export function setPluginDocumentData(state: PluginState, pluginId: string, version: number, data: unknown): void {
  required(pluginId, 'Plugin data id');
  if (!Number.isSafeInteger(version) || version < 1) throw new RangeError('Plugin data version must be positive');
  state.documentData.set(pluginId, { version, data: structuredClone(data) });
  state.version++;
}
export function migratePluginDocumentData(state: PluginState, pluginId: string, targetVersion: number): boolean {
  const stored = state.documentData.get(pluginId);
  const migrate = state.plugins.get(pluginId)?.plugin.migrateDocumentData;
  if (stored === undefined || stored.version >= targetVersion) return false;
  if (migrate === undefined) throw new Error(`Plugin migration unavailable: ${pluginId}`);
  const data = migrate(structuredClone(stored.data), stored.version);
  state.documentData.set(pluginId, { version: targetVersion, data: structuredClone(data) });
  state.version++;
  return true;
}
export function runReadonlyPluginGenerator<TInput, TOutput>(
  generator: (input: Readonly<TInput>) => TOutput,
  input: TInput,
): TOutput {
  const frozen = structuredClone(input);
  const freeze = (value: unknown): void => {
    if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return;
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  };
  freeze(frozen);
  return generator(frozen);
}
export function validatePluginWidget(schema: Readonly<PluginWidgetSchema>, value: unknown): readonly string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return ['Widget value must be an object'];
  const record = value as Record<string, unknown>;
  const result: string[] = [];
  for (const id of schema.required ?? []) if (!(id in record)) result.push(`Missing required widget property: ${id}`);
  for (const [id, item] of Object.entries(record)) {
    const expected = schema.properties[id];
    if (expected === undefined) result.push(`Unknown widget property: ${id}`);
    else if (typeof item !== expected) result.push(`Invalid widget property type: ${id}`);
  }
  return result.sort();
}
