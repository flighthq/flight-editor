export interface DocumentRevision<T = unknown> {
  readonly id: string;
  readonly parentId: string | null;
  readonly sequence: number;
  readonly formatVersion: number;
  readonly timestamp: number;
  readonly author?: string;
  readonly label?: string;
  readonly document: T;
  readonly diagnostics?: readonly string[];
}
export interface VersionHistoryStorage<T = unknown> {
  list(): Promise<readonly DocumentRevision<T>[]>;
  append(revision: Readonly<DocumentRevision<T>>): Promise<void>;
}
export interface VersionHistoryState<T = unknown> {
  revisions: Map<string, DocumentRevision<T>>;
  order: string[];
  version: number;
}
export type DirtyWorkDecision = 'cancel' | 'discard' | 'stash';
export interface RevisionPreview<T> {
  readonly revisionId: string;
  readonly sourceFormatVersion: number;
  readonly document: Readonly<T>;
  readonly diagnostics: readonly string[];
}
export interface RestoreRevisionResult<T> {
  readonly status: 'cancelled' | 'restored';
  readonly revision?: DocumentRevision<T>;
  readonly stashedDocument?: T;
}
function cloneRevision<T>(value: Readonly<DocumentRevision<T>>): DocumentRevision<T> {
  return { ...value, document: structuredClone(value.document), diagnostics: value.diagnostics?.slice() };
}
function freeze(value: unknown): void {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return;
  Object.freeze(value);
  for (const child of Object.values(value)) freeze(child);
}
function validateRevision<T>(revision: Readonly<DocumentRevision<T>>): void {
  if (revision.id.trim() === '') throw new TypeError('Revision id must not be empty');
  if (!Number.isSafeInteger(revision.sequence) || revision.sequence < 1)
    throw new RangeError('Revision sequence must be positive');
  if (!Number.isSafeInteger(revision.formatVersion) || revision.formatVersion < 1)
    throw new RangeError('Format version must be positive');
  if (!Number.isFinite(revision.timestamp)) throw new RangeError('Revision timestamp must be finite');
}
export function createVersionHistoryState<T = unknown>(): VersionHistoryState<T> {
  return { revisions: new Map(), order: [], version: 0 };
}
export async function loadVersionHistory<T>(
  state: VersionHistoryState<T>,
  storage: VersionHistoryStorage<T>,
): Promise<void> {
  const values = await storage.list();
  const next = new Map<string, DocumentRevision<T>>();
  for (const value of values) {
    validateRevision(value);
    if (next.has(value.id)) throw new Error(`Duplicate revision: ${value.id}`);
    next.set(value.id, cloneRevision(value));
  }
  const order = Array.from(next.values())
    .sort((a, b) => a.sequence - b.sequence || a.id.localeCompare(b.id))
    .map(({ id }) => id);
  for (const id of order) {
    const revision = next.get(id)!;
    if (revision.parentId !== null && !next.has(revision.parentId))
      throw new Error(`Missing revision parent: ${revision.parentId}`);
  }
  state.revisions = next;
  state.order = order;
  state.version++;
}
export async function appendDocumentRevision<T>(
  state: VersionHistoryState<T>,
  storage: VersionHistoryStorage<T>,
  revision: Readonly<DocumentRevision<T>>,
): Promise<DocumentRevision<T>> {
  validateRevision(revision);
  if (state.revisions.has(revision.id)) throw new Error(`Revision already exists: ${revision.id}`);
  const latest = state.order.length === 0 ? undefined : state.revisions.get(state.order[state.order.length - 1]!);
  if (revision.sequence !== (latest?.sequence ?? 0) + 1) throw new Error('Revision sequence must append monotonically');
  if (revision.parentId !== (latest?.id ?? null)) throw new Error('Revision parent must be the current tip');
  const owned = cloneRevision(revision);
  await storage.append(cloneRevision(owned));
  state.revisions.set(owned.id, owned);
  state.order.push(owned.id);
  state.version++;
  return cloneRevision(owned);
}
export function listDocumentRevisions<T>(state: Readonly<VersionHistoryState<T>>): readonly DocumentRevision<T>[] {
  return state.order.map((id) => cloneRevision(state.revisions.get(id)!));
}
export function previewDocumentRevision<T>(
  state: Readonly<VersionHistoryState<T>>,
  revisionId: string,
  targetFormatVersion: number,
  migrate: (document: Readonly<T>, fromVersion: number, toVersion: number) => T,
): RevisionPreview<T> {
  const revision = state.revisions.get(revisionId);
  if (revision === undefined) throw new Error(`Unknown revision: ${revisionId}`);
  const document =
    revision.formatVersion === targetFormatVersion
      ? structuredClone(revision.document)
      : migrate(structuredClone(revision.document), revision.formatVersion, targetFormatVersion);
  freeze(document);
  return {
    revisionId,
    sourceFormatVersion: revision.formatVersion,
    document,
    diagnostics: [...(revision.diagnostics ?? [])],
  };
}
export function duplicateDocumentRevision<T>(state: Readonly<VersionHistoryState<T>>, revisionId: string): T {
  const revision = state.revisions.get(revisionId);
  if (revision === undefined) throw new Error(`Unknown revision: ${revisionId}`);
  return structuredClone(revision.document);
}
export async function restoreDocumentRevision<T>(
  state: VersionHistoryState<T>,
  storage: VersionHistoryStorage<T>,
  revisionId: string,
  currentDocument: T,
  dirty: boolean,
  decision: DirtyWorkDecision,
  identity: Readonly<{ id: string; timestamp: number; author?: string; label?: string }>,
  targetFormatVersion: number,
  migrate: (document: Readonly<T>, fromVersion: number, toVersion: number) => T,
): Promise<RestoreRevisionResult<T>> {
  if (dirty && decision === 'cancel') return { status: 'cancelled' };
  const preview = previewDocumentRevision(state, revisionId, targetFormatVersion, migrate);
  const tip = state.order.length === 0 ? null : state.order[state.order.length - 1]!;
  const sequence = tip === null ? 1 : state.revisions.get(tip)!.sequence + 1;
  const revision: DocumentRevision<T> = {
    ...identity,
    parentId: tip,
    sequence,
    formatVersion: targetFormatVersion,
    document: structuredClone(preview.document),
  };
  const appended = await appendDocumentRevision(state, storage, revision);
  return {
    status: 'restored',
    revision: appended,
    stashedDocument: dirty && decision === 'stash' ? structuredClone(currentDocument) : undefined,
  };
}
export function createRevisionComparison<T>(
  state: Readonly<VersionHistoryState<T>>,
  leftId: string,
  rightId: string,
): { readonly left: Readonly<T>; readonly right: Readonly<T>; readonly diagnostics: readonly string[] } {
  const left = state.revisions.get(leftId);
  const right = state.revisions.get(rightId);
  if (left === undefined || right === undefined) throw new Error('Comparison revision not found');
  const a = structuredClone(left.document);
  const b = structuredClone(right.document);
  freeze(a);
  freeze(b);
  return { left: a, right: b, diagnostics: [...(left.diagnostics ?? []), ...(right.diagnostics ?? [])] };
}
