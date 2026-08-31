export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';

export interface Keyframe {
  readonly id: string;
  /** Stable node identity, never a hierarchy path. */
  readonly nodeId: string;
  readonly property: string;
  readonly time: number;
  readonly value: unknown;
  readonly easing: EasingFunction;
}

export interface AnimationDiagnostic {
  readonly code: 'duplicate-slot' | 'invalid-duration' | 'invalid-keyframe' | 'out-of-range';
  readonly keyframeId?: string;
  readonly message: string;
}

export interface AnimationState {
  keyframes: Map<string, Keyframe>;
  playheadTime: number;
  duration: number;
  playing: boolean;
  looping: boolean;
  /** Authored document revision. Session-only playback changes do not increment it. */
  version: number;
  sessionVersion: number;
}

function assertKeyframe(keyframe: Keyframe): void {
  if (
    keyframe.id.trim() === '' ||
    keyframe.nodeId.trim() === '' ||
    keyframe.property.trim() === '' ||
    !Number.isFinite(keyframe.time) ||
    keyframe.time < 0
  ) {
    throw new TypeError('A keyframe requires non-empty identities and a finite, non-negative time');
  }
}

function compareKeyframes(a: Keyframe, b: Keyframe): number {
  return (
    a.time - b.time ||
    a.nodeId.localeCompare(b.nodeId) ||
    a.property.localeCompare(b.property) ||
    a.id.localeCompare(b.id)
  );
}

export function createAnimationState(duration = 1000): AnimationState {
  if (!Number.isFinite(duration) || duration < 0) {
    throw new RangeError('Animation duration must be finite and non-negative');
  }
  return {
    keyframes: new Map(),
    playheadTime: 0,
    duration,
    playing: false,
    looping: false,
    version: 0,
    sessionVersion: 0,
  };
}

export function addKeyframe(state: AnimationState, keyframe: Keyframe): void {
  assertKeyframe(keyframe);
  if (state.keyframes.has(keyframe.id)) throw new Error(`Keyframe id already exists: ${keyframe.id}`);
  const collision = findKeyframeAt(state, keyframe.nodeId, keyframe.property, keyframe.time);
  if (collision !== undefined) throw new Error(`Keyframe slot already occupied by: ${collision.id}`);
  state.keyframes.set(keyframe.id, { ...keyframe });
  state.version++;
}

export function updateKeyframe(
  state: AnimationState,
  keyframeId: string,
  patch: Partial<Omit<Keyframe, 'id'>>,
): boolean {
  const current = state.keyframes.get(keyframeId);
  if (current === undefined) return false;
  const next: Keyframe = { ...current, ...patch, id: keyframeId };
  assertKeyframe(next);
  const collision = findKeyframeAt(state, next.nodeId, next.property, next.time);
  if (collision !== undefined && collision.id !== keyframeId) {
    throw new Error(`Keyframe slot already occupied by: ${collision.id}`);
  }
  if (keyframesEqual(current, next)) return false;
  state.keyframes.set(keyframeId, next);
  state.version++;
  return true;
}

function keyframesEqual(a: Keyframe, b: Keyframe): boolean {
  return (
    a.nodeId === b.nodeId &&
    a.property === b.property &&
    a.time === b.time &&
    a.value === b.value &&
    a.easing === b.easing
  );
}

export function removeKeyframe(state: AnimationState, keyframeId: string): boolean {
  if (!state.keyframes.delete(keyframeId)) return false;
  state.version++;
  return true;
}

export function getKeyframe(state: Readonly<AnimationState>, keyframeId: string): Keyframe | undefined {
  return state.keyframes.get(keyframeId);
}

export function findKeyframeAt(
  state: Readonly<AnimationState>,
  nodeId: string,
  property: string,
  time: number,
): Keyframe | undefined {
  return Array.from(state.keyframes.values()).find(
    (keyframe) => keyframe.nodeId === nodeId && keyframe.property === property && keyframe.time === time,
  );
}

export function getKeyframesForNode(state: Readonly<AnimationState>, nodeId: string): readonly Keyframe[] {
  return Array.from(state.keyframes.values())
    .filter((keyframe) => keyframe.nodeId === nodeId)
    .sort(compareKeyframes);
}

export function getKeyframesForTrack(
  state: Readonly<AnimationState>,
  nodeId: string,
  property: string,
): readonly Keyframe[] {
  return Array.from(state.keyframes.values())
    .filter((keyframe) => keyframe.nodeId === nodeId && keyframe.property === property)
    .sort(compareKeyframes);
}

export function getKeyframeCount(state: Readonly<AnimationState>): number {
  return state.keyframes.size;
}

export function insertTime(state: AnimationState, at: number, amount: number): number {
  if (!Number.isFinite(at) || at < 0 || !Number.isFinite(amount) || amount <= 0) {
    throw new RangeError('Insert time values are invalid');
  }
  let changed = 0;
  for (const [id, keyframe] of state.keyframes) {
    if (keyframe.time >= at) {
      state.keyframes.set(id, { ...keyframe, time: keyframe.time + amount });
      changed++;
    }
  }
  state.duration += amount;
  state.version++;
  return changed;
}

export function deleteTime(state: AnimationState, from: number, to: number): number {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from < 0 || to <= from) {
    throw new RangeError('Delete time range is invalid');
  }
  const width = to - from;
  let removed = 0;
  for (const [id, keyframe] of state.keyframes) {
    if (keyframe.time >= from && keyframe.time < to) {
      state.keyframes.delete(id);
      removed++;
    } else if (keyframe.time >= to) {
      state.keyframes.set(id, { ...keyframe, time: keyframe.time - width });
    }
  }
  state.duration = Math.max(0, state.duration - width);
  state.playheadTime = Math.min(state.playheadTime, state.duration);
  state.version++;
  return removed;
}

export function getPlayheadTime(state: Readonly<AnimationState>): number {
  return state.playheadTime;
}

export function setPlayheadTime(state: AnimationState, time: number): void {
  if (!Number.isFinite(time)) throw new TypeError('Playhead time must be finite');
  const clamped = Math.max(0, Math.min(time, state.duration));
  if (state.playheadTime === clamped) return;
  state.playheadTime = clamped;
  state.sessionVersion++;
}

export function getDuration(state: Readonly<AnimationState>): number {
  return state.duration;
}

export function setDuration(state: AnimationState, duration: number): void {
  if (!Number.isFinite(duration)) throw new TypeError('Animation duration must be finite');
  const clamped = Math.max(0, duration);
  if (state.duration === clamped) return;
  state.duration = clamped;
  if (state.playheadTime > clamped) state.playheadTime = clamped;
  state.version++;
}

export function isPlaying(state: Readonly<AnimationState>): boolean {
  return state.playing;
}

export function setPlaying(state: AnimationState, playing: boolean): void {
  if (state.playing === playing) return;
  state.playing = playing;
  state.sessionVersion++;
}

export function isLooping(state: Readonly<AnimationState>): boolean {
  return state.looping;
}

export function setLooping(state: AnimationState, looping: boolean): void {
  if (state.looping === looping) return;
  state.looping = looping;
  state.version++;
}

export function getAnimationVersion(state: Readonly<AnimationState>): number {
  return state.version;
}

export function getAnimationSessionVersion(state: Readonly<AnimationState>): number {
  return state.sessionVersion;
}

export function validateAnimationState(state: Readonly<AnimationState>): readonly AnimationDiagnostic[] {
  const diagnostics: AnimationDiagnostic[] = [];
  const occupied = new Map<string, string>();
  if (!Number.isFinite(state.duration) || state.duration < 0) {
    diagnostics.push({ code: 'invalid-duration', message: 'Duration is invalid' });
  }
  for (const keyframe of Array.from(state.keyframes.values()).sort(compareKeyframes)) {
    if (
      keyframe.id === '' ||
      keyframe.nodeId === '' ||
      keyframe.property === '' ||
      !Number.isFinite(keyframe.time) ||
      keyframe.time < 0
    ) {
      diagnostics.push({
        code: 'invalid-keyframe',
        keyframeId: keyframe.id,
        message: 'Keyframe identity or time is invalid',
      });
      continue;
    }
    if (keyframe.time > state.duration) {
      diagnostics.push({
        code: 'out-of-range',
        keyframeId: keyframe.id,
        message: 'Keyframe exceeds duration',
      });
    }
    const slot = `${keyframe.nodeId}\0${keyframe.property}\0${keyframe.time}`;
    const other = occupied.get(slot);
    if (other !== undefined) {
      diagnostics.push({
        code: 'duplicate-slot',
        keyframeId: keyframe.id,
        message: `Keyframe overlaps ${other}`,
      });
    } else {
      occupied.set(slot, keyframe.id);
    }
  }
  return diagnostics;
}
