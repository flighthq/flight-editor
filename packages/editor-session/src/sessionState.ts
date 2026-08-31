export type SessionDocumentStatus = 'loading' | 'ready' | 'invalid' | 'saving' | 'closed';
export type ExternalRevisionStatus = 'current' | 'changed' | 'deleted' | 'conflicted';

export interface SessionDocument {
  readonly id: string;
  uri: string | null;
  title: string;
  status: SessionDocumentStatus;
  externalStatus: ExternalRevisionStatus;
  revision: number;
  lastGoodRevision: number | null;
  dirty: boolean;
}

export interface SessionState {
  readonly documents: Map<string, SessionDocument>;
  order: string[];
  activeDocumentId: string | null;
  version: number;
}

export function createSessionState(): SessionState {
  return { documents: new Map(), order: [], activeDocumentId: null, version: 0 };
}

export function openSessionDocument(state: SessionState, document: Readonly<SessionDocument>): boolean {
  validateDocument(document);
  if (state.documents.has(document.id) || (document.uri && findByUri(state, document.uri))) return false;
  state.documents.set(document.id, { ...document });
  state.order.push(document.id);
  state.activeDocumentId = document.id;
  state.version++;
  return true;
}

export function closeSessionDocument(state: SessionState, id: string, discardDirty = false): SessionDocument | null {
  const document = state.documents.get(id);
  if (!document || (document.dirty && !discardDirty)) return null;
  state.documents.delete(id);
  const index = state.order.indexOf(id);
  if (index >= 0) state.order.splice(index, 1);
  if (state.activeDocumentId === id)
    state.activeDocumentId = state.order[Math.min(index, state.order.length - 1)] ?? null;
  state.version++;
  return { ...document, status: 'closed' };
}

export function activateSessionDocument(state: SessionState, id: string): boolean {
  if (!state.documents.has(id) || state.activeDocumentId === id) return false;
  state.activeDocumentId = id;
  state.version++;
  return true;
}

export function updateSessionDocument(
  state: SessionState,
  id: string,
  update: Readonly<Partial<Omit<SessionDocument, 'id'>>>,
): boolean {
  const document = state.documents.get(id);
  if (!document) return false;
  if (update.revision !== undefined && update.revision < document.revision) return false;
  const next = { ...document, ...update, id };
  validateDocument(next);
  if (next.uri && [...state.documents.values()].some((item) => item.id !== id && item.uri === next.uri)) return false;
  if (JSON.stringify(document) === JSON.stringify(next)) return true;
  state.documents.set(id, next);
  state.version++;
  return true;
}

export function getSessionDocument(state: Readonly<SessionState>, id: string): Readonly<SessionDocument> | null {
  return state.documents.get(id) ?? null;
}

export function getSessionDocuments(state: Readonly<SessionState>): readonly Readonly<SessionDocument>[] {
  return state.order.flatMap((id) => {
    const document = state.documents.get(id);
    return document ? [document] : [];
  });
}

export function getActiveSessionDocument(state: Readonly<SessionState>): Readonly<SessionDocument> | null {
  return state.activeDocumentId ? (state.documents.get(state.activeDocumentId) ?? null) : null;
}

function findByUri(state: Readonly<SessionState>, uri: string): SessionDocument | null {
  return [...state.documents.values()].find((document) => document.uri === uri) ?? null;
}

function validateDocument(document: Readonly<SessionDocument>): void {
  if (document.id.length === 0 || document.title.length === 0)
    throw new Error('Session document identity and title are required');
  if (!Number.isSafeInteger(document.revision) || document.revision < 0)
    throw new Error('Document revision must be non-negative');
  if (document.lastGoodRevision !== null && document.lastGoodRevision > document.revision) {
    throw new Error('Last good revision cannot exceed current revision');
  }
}
