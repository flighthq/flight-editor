export type CollaborationPermission = 'view' | 'comment' | 'edit';
export interface CollaborationOperation {
  readonly id: string;
  readonly actorId: string;
  readonly baseRevision: number;
  readonly payload: unknown;
}
export interface CollaborationPresence {
  readonly actorId: string;
  readonly expiresAt: number;
  readonly selection: readonly string[];
  readonly pageId: string | null;
}
export interface CollaborationState {
  revision: number;
  permission: CollaborationPermission;
  connected: boolean;
  pending: CollaborationOperation[];
  acknowledged: string[];
  rejected: ReadonlyMap<string, string>;
  presence: Map<string, CollaborationPresence>;
  version: number;
}
export function createCollaborationState(revision = 0): CollaborationState {
  if (!Number.isInteger(revision) || revision < 0) throw new RangeError('Revision must be non-negative');
  return {
    revision,
    permission: 'edit',
    connected: false,
    pending: [],
    acknowledged: [],
    rejected: new Map(),
    presence: new Map(),
    version: 0,
  };
}
export function setCollaborationConnection(s: CollaborationState, connected: boolean): boolean {
  if (s.connected === connected) return false;
  s.connected = connected;
  s.version++;
  return true;
}
export function setCollaborationPermission(s: CollaborationState, p: CollaborationPermission): boolean {
  if (s.permission === p) return false;
  s.permission = p;
  s.version++;
  return true;
}
export function enqueueCollaborationOperation(s: CollaborationState, o: CollaborationOperation): void {
  if (s.permission !== 'edit') throw new Error('Editing is not permitted');
  if (!o.id.trim() || !o.actorId.trim()) throw new TypeError('Operation identity is required');
  if (s.pending.some((x) => x.id === o.id) || s.acknowledged.includes(o.id) || s.rejected.has(o.id))
    throw new Error('Operation already exists');
  s.pending.push({ ...o });
  s.version++;
}
export function acknowledgeCollaborationOperation(s: CollaborationState, id: string, revision: number): boolean {
  const i = s.pending.findIndex((x) => x.id === id);
  if (i < 0) return false;
  if (!Number.isInteger(revision) || revision <= s.revision) throw new RangeError('Acknowledged revision must advance');
  s.pending.splice(i, 1);
  s.acknowledged.push(id);
  s.revision = revision;
  s.version++;
  return true;
}
export function rejectCollaborationOperation(s: CollaborationState, id: string, reason: string): boolean {
  const i = s.pending.findIndex((x) => x.id === id);
  if (i < 0) return false;
  s.pending.splice(i, 1);
  s.rejected = new Map(s.rejected).set(id, reason);
  s.version++;
  return true;
}
export function updateCollaborationPresence(s: CollaborationState, p: CollaborationPresence): void {
  if (!p.actorId.trim() || !Number.isFinite(p.expiresAt)) throw new TypeError('Valid presence is required');
  s.presence.set(p.actorId, { ...p, selection: [...p.selection] });
  s.version++;
}
export function expireCollaborationPresence(s: CollaborationState, now: number): readonly string[] {
  const ids = [...s.presence]
    .filter(([, p]) => p.expiresAt <= now)
    .map(([id]) => id)
    .sort();
  for (const id of ids) s.presence.delete(id);
  if (ids.length) s.version++;
  return ids;
}
export function rebaseCollaborationOperations(s: CollaborationState, revision: number): void {
  if (revision < s.revision) throw new RangeError('Cannot move revision backward');
  s.revision = revision;
  s.pending = s.pending.map((o) => ({ ...o, baseRevision: revision }));
  s.version++;
}
