export interface LockState {
  readonly locked: Set<unknown>;
  version: number;
}

export function createLockState(): LockState {
  return { locked: new Set(), version: 0 };
}

export function lockNode(state: LockState, node: unknown): void {
  if (state.locked.has(node)) return;
  state.locked.add(node);
  state.version++;
}

export function unlockNode(state: LockState, node: unknown): void {
  if (!state.locked.delete(node)) return;
  state.version++;
}

export function toggleLock(state: LockState, node: unknown): void {
  if (state.locked.has(node)) {
    state.locked.delete(node);
  } else {
    state.locked.add(node);
  }
  state.version++;
}

export function isLocked(state: Readonly<LockState>, node: unknown): boolean {
  return state.locked.has(node);
}

export function clearLocks(state: LockState): void {
  if (state.locked.size === 0) return;
  state.locked.clear();
  state.version++;
}

export function getLockedCount(state: Readonly<LockState>): number {
  return state.locked.size;
}

export function getLockVersion(state: Readonly<LockState>): number {
  return state.version;
}
