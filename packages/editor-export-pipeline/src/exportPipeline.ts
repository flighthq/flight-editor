export interface ExportAsset {
  readonly id: string;
  readonly dependencies: readonly string[];
  readonly value: unknown;
}
export interface ExportRequest {
  readonly exporterId: string;
  readonly targetVersion: string;
  readonly rootAssetIds: readonly string[];
  readonly options: Readonly<Record<string, unknown>>;
}
export interface ExportContext {
  readonly assets: readonly ExportAsset[];
  readonly options: Readonly<Record<string, unknown>>;
  readonly signal: AbortSignal;
  report(progress: number, message: string): void;
}
export interface ExportArtifact {
  readonly path: string;
  readonly mediaType: string;
  readonly content: string | Uint8Array;
}
export interface EditorExporter {
  readonly id: string;
  readonly version: string;
  readonly targetVersions: readonly string[];
  readonly requiredCapabilities: readonly string[];
  export(context: ExportContext): Promise<readonly ExportArtifact[]>;
}
export interface ExportPipelineState {
  exporters: Map<string, EditorExporter>;
  version: number;
}
export interface ExportPlan {
  readonly exporter: EditorExporter;
  readonly assets: readonly ExportAsset[];
  readonly request: ExportRequest;
  readonly diagnostics: readonly string[];
}
export interface ExportReport {
  readonly status: 'cancelled' | 'failed' | 'partial' | 'succeeded';
  readonly artifacts: readonly ExportArtifact[];
  readonly errors: readonly string[];
  readonly metadata: {
    readonly exporterId: string;
    readonly exporterVersion: string;
    readonly targetVersion: string;
    readonly inputDigest: string;
  };
}
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (typeof value === 'object' && value !== null)
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`)
      .join(',')}}`;
  return JSON.stringify(value);
}
function digest(value: unknown): string {
  let hash = 2166136261;
  for (const char of stable(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
export function createExportPipelineState(): ExportPipelineState {
  return { exporters: new Map(), version: 0 };
}
export function registerExporter(state: ExportPipelineState, exporter: EditorExporter): void {
  if (exporter.id.trim() === '' || exporter.version.trim() === '')
    throw new TypeError('Exporter identity must not be empty');
  if (state.exporters.has(exporter.id)) throw new Error(`Exporter already registered: ${exporter.id}`);
  state.exporters.set(exporter.id, exporter);
  state.version++;
}
export function unregisterExporter(state: ExportPipelineState, exporterId: string): boolean {
  if (!state.exporters.delete(exporterId)) return false;
  state.version++;
  return true;
}
export function createExportPlan(
  state: Readonly<ExportPipelineState>,
  request: Readonly<ExportRequest>,
  assets: ReadonlyMap<string, ExportAsset>,
  hostCapabilities: ReadonlySet<string>,
): ExportPlan {
  const exporter = state.exporters.get(request.exporterId);
  if (exporter === undefined) throw new Error(`Unknown exporter: ${request.exporterId}`);
  const diagnostics: string[] = [];
  if (!exporter.targetVersions.includes(request.targetVersion))
    diagnostics.push(`Unsupported target version: ${request.targetVersion}`);
  for (const capability of exporter.requiredCapabilities)
    if (!hostCapabilities.has(capability)) diagnostics.push(`Missing host capability: ${capability}`);
  const included = new Map<string, ExportAsset>();
  const visiting = new Set<string>();
  const visit = (id: string): void => {
    if (included.has(id)) return;
    if (visiting.has(id)) {
      diagnostics.push(`Asset dependency cycle: ${id}`);
      return;
    }
    const asset = assets.get(id);
    if (asset === undefined) {
      diagnostics.push(`Missing asset: ${id}`);
      return;
    }
    visiting.add(id);
    for (const dependency of asset.dependencies) visit(dependency);
    visiting.delete(id);
    included.set(id, asset);
  };
  for (const id of request.rootAssetIds) visit(id);
  return {
    exporter,
    assets: Array.from(included.values()).sort((a, b) => a.id.localeCompare(b.id)),
    request: { ...request, rootAssetIds: request.rootAssetIds.slice(), options: structuredClone(request.options) },
    diagnostics: diagnostics.sort(),
  };
}
export async function runExportPlan(
  plan: Readonly<ExportPlan>,
  signal: AbortSignal,
  report: ExportContext['report'] = () => {},
): Promise<ExportReport> {
  const metadata = {
    exporterId: plan.exporter.id,
    exporterVersion: plan.exporter.version,
    targetVersion: plan.request.targetVersion,
    inputDigest: digest({ assets: plan.assets, options: plan.request.options }),
  };
  if (signal.aborted) return { status: 'cancelled', artifacts: [], errors: [], metadata };
  if (plan.diagnostics.length > 0) return { status: 'failed', artifacts: [], errors: plan.diagnostics, metadata };
  try {
    const artifacts = await plan.exporter.export({
      assets: structuredClone(plan.assets),
      options: structuredClone(plan.request.options),
      signal,
      report(progress, message) {
        if (!Number.isFinite(progress) || progress < 0 || progress > 1)
          throw new RangeError('Export progress must be between zero and one');
        report(progress, message);
      },
    });
    if (signal.aborted) return { status: 'cancelled', artifacts: [], errors: [], metadata };
    const errors: string[] = [];
    const paths = new Set<string>();
    for (const artifact of artifacts) {
      if (paths.has(artifact.path)) errors.push(`Duplicate artifact path: ${artifact.path}`);
      paths.add(artifact.path);
    }
    return { status: errors.length > 0 ? 'partial' : 'succeeded', artifacts, errors, metadata };
  } catch (error) {
    return {
      status: signal.aborted ? 'cancelled' : 'failed',
      artifacts: [],
      errors: signal.aborted ? [] : [error instanceof Error ? error.message : String(error)],
      metadata,
    };
  }
}
export function compareExportReproducibility(left: Readonly<ExportReport>, right: Readonly<ExportReport>): boolean {
  if (left.metadata.inputDigest !== right.metadata.inputDigest || left.artifacts.length !== right.artifacts.length)
    return false;
  return left.artifacts.every((artifact, index) => {
    const other = right.artifacts[index];
    return (
      other !== undefined &&
      artifact.path === other.path &&
      artifact.mediaType === other.mediaType &&
      stable(artifact.content) === stable(other.content)
    );
  });
}
