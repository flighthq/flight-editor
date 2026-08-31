export type DiagnosticSeverity = 'error' | 'warning' | 'information' | 'hint';

export interface DiagnosticRange {
  readonly start: number;
  readonly end: number;
}

export interface EditorDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly severity: DiagnosticSeverity;
  readonly range?: DiagnosticRange;
  readonly identity?: string;
  readonly blocksMutation?: boolean;
  readonly blocksVisualization?: boolean;
}

export interface DiagnosticBatch {
  readonly source: string;
  readonly revision: number;
  readonly diagnostics: readonly EditorDiagnostic[];
}

export interface DiagnosticSummary {
  readonly total: number;
  readonly errors: number;
  readonly warnings: number;
  readonly blocksMutation: boolean;
  readonly blocksVisualization: boolean;
}

export interface DiagnosticState {
  readonly batches: Map<string, DiagnosticBatch>;
  version: number;
}

export function createDiagnosticState(): DiagnosticState {
  return { batches: new Map(), version: 0 };
}

export function publishDiagnostics(
  state: DiagnosticState,
  source: string,
  revision: number,
  diagnostics: readonly EditorDiagnostic[],
): boolean {
  if (source.length === 0 || !Number.isSafeInteger(revision) || revision < 0) return false;
  const current = state.batches.get(source);
  if (current && current.revision > revision) return false;
  const normalized = diagnostics.map(normalizeDiagnostic);
  if (current && current.revision === revision && diagnosticsEqual(current.diagnostics, normalized)) return true;
  state.batches.set(source, { source, revision, diagnostics: normalized });
  state.version++;
  return true;
}

export function clearDiagnostics(state: DiagnosticState, source?: string): boolean {
  if (source !== undefined) {
    if (!state.batches.delete(source)) return false;
    state.version++;
    return true;
  }
  if (state.batches.size === 0) return false;
  state.batches.clear();
  state.version++;
  return true;
}

export function getDiagnostics(state: Readonly<DiagnosticState>, source?: string): readonly EditorDiagnostic[] {
  if (source !== undefined) return state.batches.get(source)?.diagnostics ?? [];
  return [...state.batches.values()]
    .sort((a, b) => a.source.localeCompare(b.source))
    .flatMap((batch) => batch.diagnostics);
}

export function getDiagnosticRevision(state: Readonly<DiagnosticState>, source: string): number | null {
  return state.batches.get(source)?.revision ?? null;
}

export function summarizeDiagnostics(state: Readonly<DiagnosticState>): DiagnosticSummary {
  const diagnostics = getDiagnostics(state);
  return {
    total: diagnostics.length,
    errors: diagnostics.filter((item) => item.severity === 'error').length,
    warnings: diagnostics.filter((item) => item.severity === 'warning').length,
    blocksMutation: diagnostics.some((item) => item.blocksMutation === true),
    blocksVisualization: diagnostics.some((item) => item.blocksVisualization === true),
  };
}

function normalizeDiagnostic(diagnostic: Readonly<EditorDiagnostic>): EditorDiagnostic {
  if (diagnostic.code.length === 0) throw new Error('Diagnostic code must not be empty');
  if (diagnostic.message.length === 0) throw new Error('Diagnostic message must not be empty');
  if (diagnostic.range && (diagnostic.range.start < 0 || diagnostic.range.end < diagnostic.range.start)) {
    throw new Error('Diagnostic range must be ordered and non-negative');
  }
  return { ...diagnostic, range: diagnostic.range ? { ...diagnostic.range } : undefined };
}

function diagnosticsEqual(left: readonly EditorDiagnostic[], right: readonly EditorDiagnostic[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
