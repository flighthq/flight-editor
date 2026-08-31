export type GestureEndReason =
  | 'commit'
  | 'cancel'
  | 'pointer-cancel'
  | 'focus-loss'
  | 'document-replaced'
  | 'interrupted';

export interface ActiveGesture<T> {
  readonly id: string;
  readonly kind: string;
  readonly initial: T;
  latest: T;
  previewCount: number;
}

export interface CompletedGesture<T> {
  readonly id: string;
  readonly kind: string;
  readonly initial: T;
  readonly final: T;
  readonly previewCount: number;
  readonly reason: GestureEndReason;
}

export interface GestureState<T> {
  active: ActiveGesture<T> | null;
  sequence: number;
  version: number;
}

export function createGestureState<T>(): GestureState<T> {
  return { active: null, sequence: 0, version: 0 };
}

export function beginGesture<T>(state: GestureState<T>, kind: string, initial: T): string {
  if (state.active) throw new Error(`Cannot begin ${kind}; gesture ${state.active.id} is active`);
  if (kind.length === 0) throw new Error('Gesture kind must not be empty');
  const id = `${kind}:${++state.sequence}`;
  state.active = { id, kind, initial, latest: initial, previewCount: 0 };
  state.version++;
  return id;
}

export function previewGesture<T>(state: GestureState<T>, id: string, value: T): void {
  const active = requireGesture(state, id);
  active.latest = value;
  active.previewCount++;
  state.version++;
}

export function commitGesture<T>(state: GestureState<T>, id: string, final?: T): CompletedGesture<T> {
  const active = requireGesture(state, id);
  const result = complete(active, final ?? active.latest, 'commit');
  state.active = null;
  state.version++;
  return result;
}

export function cancelGesture<T>(
  state: GestureState<T>,
  id: string,
  reason: Exclude<GestureEndReason, 'commit'> = 'cancel',
): CompletedGesture<T> {
  const active = requireGesture(state, id);
  const result = complete(active, active.initial, reason);
  state.active = null;
  state.version++;
  return result;
}

export function interruptGesture<T>(
  state: GestureState<T>,
  reason: Exclude<GestureEndReason, 'commit' | 'cancel'>,
): CompletedGesture<T> | null {
  if (!state.active) return null;
  return cancelGesture(state, state.active.id, reason);
}

export function getActiveGesture<T>(state: Readonly<GestureState<T>>): Readonly<ActiveGesture<T>> | null {
  return state.active;
}

function requireGesture<T>(state: Readonly<GestureState<T>>, id: string): ActiveGesture<T> {
  if (!state.active || state.active.id !== id) throw new Error(`Gesture ${id} is not active`);
  return state.active;
}

function complete<T>(active: Readonly<ActiveGesture<T>>, final: T, reason: GestureEndReason): CompletedGesture<T> {
  return {
    id: active.id,
    kind: active.kind,
    initial: active.initial,
    final,
    previewCount: active.previewCount,
    reason,
  };
}
