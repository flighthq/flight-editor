export type CommentAnchor = {
  readonly nodeId: string | null;
  readonly pageId: string | null;
  readonly x?: number;
  readonly y?: number;
};
export type CommentMessage = {
  readonly id: string;
  readonly authorId: string;
  readonly body: string;
  readonly createdAt: number;
};
export interface CommentThread {
  readonly id: string;
  readonly anchor: CommentAnchor;
  readonly revision: number;
  readonly messages: readonly CommentMessage[];
  readonly resolved: boolean;
  readonly sync: 'synced' | 'pending' | 'failed';
}
export interface CommentsState {
  threads: Map<string, CommentThread>;
  activeId: string | null;
  drafts: Map<string, string>;
  visible: boolean;
  version: number;
}
const valid = (v: string, l: string) => {
  if (!v.trim()) throw new TypeError(l + ' must not be empty');
};
export function createCommentsState(): CommentsState {
  return { threads: new Map(), activeId: null, drafts: new Map(), visible: true, version: 0 };
}
export function createCommentThread(s: CommentsState, t: CommentThread): void {
  valid(t.id, 'Thread id');
  if (s.threads.has(t.id)) throw new Error('Thread already exists');
  if (!t.anchor.nodeId && !t.anchor.pageId) throw new Error('Comment anchor requires a target');
  s.threads.set(t.id, { ...t, anchor: { ...t.anchor }, messages: t.messages.map((m) => ({ ...m })) });
  s.version++;
}
export function replyToCommentThread(s: CommentsState, id: string, m: CommentMessage): void {
  valid(m.body, 'Comment body');
  const t = s.threads.get(id);
  if (!t) throw new Error('Unknown thread');
  if (t.messages.some((x) => x.id === m.id)) return;
  s.threads.set(id, { ...t, messages: [...t.messages, { ...m }], sync: 'pending' });
  s.version++;
}
export function setCommentResolved(s: CommentsState, id: string, resolved: boolean): boolean {
  const t = s.threads.get(id);
  if (!t) throw new Error('Unknown thread');
  if (t.resolved === resolved) return false;
  s.threads.set(id, { ...t, resolved, sync: 'pending' });
  s.version++;
  return true;
}
export function moveCommentAnchor(s: CommentsState, id: string, a: CommentAnchor): void {
  const t = s.threads.get(id);
  if (!t) throw new Error('Unknown thread');
  s.threads.set(id, { ...t, anchor: { ...a }, sync: 'pending' });
  s.version++;
}
export function reconcileCommentAnchors(
  s: CommentsState,
  nodeIds: ReadonlySet<string>,
  pageIds: ReadonlySet<string>,
): readonly string[] {
  const missing: string[] = [];
  for (const [id, t] of s.threads)
    if ((t.anchor.nodeId && !nodeIds.has(t.anchor.nodeId)) || (t.anchor.pageId && !pageIds.has(t.anchor.pageId)))
      missing.push(id);
  return missing.sort();
}
export function setCommentDraft(s: CommentsState, id: string, body: string): void {
  if (body) s.drafts.set(id, body);
  else s.drafts.delete(id);
  s.version++;
}
export function markCommentSync(s: CommentsState, id: string, status: 'synced' | 'failed'): void {
  const t = s.threads.get(id);
  if (!t) throw new Error('Unknown thread');
  s.threads.set(id, { ...t, sync: status });
  s.version++;
}
export function getVisibleCommentThreads(
  s: Readonly<CommentsState>,
  includeResolved = false,
): readonly CommentThread[] {
  if (!s.visible) return [];
  return [...s.threads.values()].filter((t) => includeResolved || !t.resolved).sort((a, b) => a.id.localeCompare(b.id));
}
