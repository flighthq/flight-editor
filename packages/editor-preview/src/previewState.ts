export type PreviewPhase =
  | 'stopped'
  | 'starting'
  | 'running'
  | 'paused'
  | 'reloading'
  | 'stopping'
  | 'disconnected'
  | 'error';

export interface PreviewSnapshot<T = unknown> {
  readonly revision: number;
  readonly documentId: string;
  readonly value: T;
}

export type PreviewOperationKind = 'start' | 'stop' | 'pause' | 'resume' | 'step' | 'restart' | 'reload';

export interface PreviewOperation<T = unknown> {
  readonly id: number;
  readonly kind: PreviewOperationKind;
  readonly snapshot?: PreviewSnapshot<T>;
  readonly stepMilliseconds?: number;
}

export interface RuntimeOverride {
  readonly targetId: string;
  readonly property: string;
  readonly authoredValue: unknown;
  readonly runtimeValue: unknown;
}

export interface PreviewState<T = unknown> {
  phase: PreviewPhase;
  nextOperationId: number;
  pending: PreviewOperation<T> | null;
  snapshot: PreviewSnapshot<T> | null;
  runtimeRevision: number | null;
  lastError: string | null;
  overrides: Map<string, RuntimeOverride>;
  version: number;
}

function overrideKey(targetId: string, property: string): string {
  return `${targetId}\0${property}`;
}

function assertSnapshot(snapshot: PreviewSnapshot): void {
  if (!Number.isSafeInteger(snapshot.revision) || snapshot.revision < 0) {
    throw new TypeError('Preview snapshot revision must be a non-negative integer');
  }
  if (snapshot.documentId.trim() === '') throw new TypeError('Preview document id must not be empty');
}

function beginOperation<T>(
  state: PreviewState<T>,
  operation: Omit<PreviewOperation<T>, 'id'>,
  phase: PreviewPhase,
): PreviewOperation<T> {
  if (state.pending !== null) throw new Error(`Preview operation already pending: ${state.pending.kind}`);
  const pending = { ...operation, id: state.nextOperationId++ };
  state.pending = pending;
  state.phase = phase;
  state.lastError = null;
  state.version++;
  return pending;
}

export function createPreviewState<T = unknown>(): PreviewState<T> {
  return {
    phase: 'stopped',
    nextOperationId: 1,
    pending: null,
    snapshot: null,
    runtimeRevision: null,
    lastError: null,
    overrides: new Map(),
    version: 0,
  };
}

export function requestPreviewStart<T>(state: PreviewState<T>, snapshot: PreviewSnapshot<T>): PreviewOperation<T> {
  if (state.phase !== 'stopped' && state.phase !== 'error' && state.phase !== 'disconnected') {
    throw new Error(`Cannot start preview while ${state.phase}`);
  }
  assertSnapshot(snapshot);
  return beginOperation(state, { kind: 'start', snapshot: { ...snapshot } }, 'starting');
}

export function requestPreviewStop<T>(state: PreviewState<T>): PreviewOperation<T> {
  if (state.phase === 'stopped') throw new Error('Preview is already stopped');
  return beginOperation(state, { kind: 'stop' }, 'stopping');
}

export function requestPreviewPause<T>(state: PreviewState<T>): PreviewOperation<T> {
  if (state.phase !== 'running') throw new Error('Only a running preview can pause');
  return beginOperation(state, { kind: 'pause' }, 'running');
}

export function requestPreviewResume<T>(state: PreviewState<T>): PreviewOperation<T> {
  if (state.phase !== 'paused') throw new Error('Only a paused preview can resume');
  return beginOperation(state, { kind: 'resume' }, 'paused');
}

export function requestPreviewStep<T>(state: PreviewState<T>, milliseconds: number): PreviewOperation<T> {
  if (state.phase !== 'paused') throw new Error('Preview stepping requires a paused preview');
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    throw new RangeError('Preview step must be finite and greater than zero');
  }
  return beginOperation(state, { kind: 'step', stepMilliseconds: milliseconds }, 'paused');
}

export function requestPreviewRestart<T>(state: PreviewState<T>): PreviewOperation<T> {
  if (state.snapshot === null || (state.phase !== 'running' && state.phase !== 'paused')) {
    throw new Error('An active preview snapshot is required to restart');
  }
  return beginOperation(state, { kind: 'restart', snapshot: state.snapshot }, 'reloading');
}

export function requestPreviewReload<T>(state: PreviewState<T>, snapshot: PreviewSnapshot<T>): PreviewOperation<T> {
  if (state.phase !== 'running' && state.phase !== 'paused') {
    throw new Error('Only an active preview can reload');
  }
  assertSnapshot(snapshot);
  if (state.snapshot !== null && snapshot.revision <= state.snapshot.revision) {
    throw new Error('Preview reload revision must be newer than the active snapshot');
  }
  return beginOperation(state, { kind: 'reload', snapshot: { ...snapshot } }, 'reloading');
}

export function completePreviewOperation<T>(
  state: PreviewState<T>,
  operationId: number,
  runtimeRevision?: number,
): boolean {
  const operation = state.pending;
  if (operation === null || operation.id !== operationId) return false;
  if (runtimeRevision !== undefined && (!Number.isSafeInteger(runtimeRevision) || runtimeRevision < 0)) {
    throw new TypeError('Runtime revision must be a non-negative integer');
  }
  state.pending = null;
  switch (operation.kind) {
    case 'start':
    case 'restart':
    case 'reload':
      state.snapshot = operation.snapshot ?? state.snapshot;
      state.runtimeRevision = runtimeRevision ?? state.snapshot?.revision ?? null;
      state.phase = 'running';
      state.overrides.clear();
      break;
    case 'pause':
      state.phase = 'paused';
      break;
    case 'resume':
    case 'step':
      state.phase = operation.kind === 'step' ? 'paused' : 'running';
      break;
    case 'stop':
      state.phase = 'stopped';
      state.snapshot = null;
      state.runtimeRevision = null;
      state.overrides.clear();
      break;
  }
  state.version++;
  return true;
}

export function failPreviewOperation<T>(
  state: PreviewState<T>,
  operationId: number,
  message: string,
  disconnected = false,
): boolean {
  if (state.pending?.id !== operationId) return false;
  state.pending = null;
  state.phase = disconnected ? 'disconnected' : 'error';
  state.lastError = message;
  state.version++;
  return true;
}

export function recordRuntimeOverride<T>(state: PreviewState<T>, override: RuntimeOverride): void {
  if (state.phase !== 'running' && state.phase !== 'paused')
    throw new Error('Runtime overrides require an active preview');
  if (override.targetId.trim() === '' || override.property.trim() === '') {
    throw new TypeError('Runtime override target and property must not be empty');
  }
  const key = overrideKey(override.targetId, override.property);
  if (Object.is(override.authoredValue, override.runtimeValue)) state.overrides.delete(key);
  else state.overrides.set(key, { ...override });
  state.version++;
}

export function getRuntimeOverrides<T>(state: Readonly<PreviewState<T>>): readonly RuntimeOverride[] {
  return Array.from(state.overrides.values()).sort(
    (a, b) => a.targetId.localeCompare(b.targetId) || a.property.localeCompare(b.property),
  );
}

export function discardRuntimeOverrides<T>(state: PreviewState<T>): boolean {
  if (state.overrides.size === 0) return false;
  state.overrides.clear();
  state.version++;
  return true;
}

export function takeRuntimeOverridesForApply<T>(
  state: PreviewState<T>,
  keys?: ReadonlySet<string>,
): readonly RuntimeOverride[] {
  const selected = getRuntimeOverrides(state).filter(
    ({ targetId, property }) => keys === undefined || keys.has(overrideKey(targetId, property)),
  );
  for (const { targetId, property } of selected) state.overrides.delete(overrideKey(targetId, property));
  if (selected.length > 0) state.version++;
  return selected;
}
