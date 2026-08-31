export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';

export interface Keyframe {
  readonly id: string;
  readonly nodeId: string;
  readonly property: string;
  readonly time: number;
  readonly value: unknown;
  readonly easing: EasingFunction;
}

export interface AnimationState {
  keyframes: Map<string, Keyframe>;
  playheadTime: number;
  duration: number;
  playing: boolean;
  looping: boolean;
  version: number;
}

export function createAnimationState(): AnimationState {
  return {
    keyframes: new Map(),
    playheadTime: 0,
    duration: 1000,
    playing: false,
    looping: false,
    version: 0,
  };
}

export function addKeyframe(state: AnimationState, keyframe: Keyframe): void {
  state.keyframes.set(keyframe.id, keyframe);
  state.version++;
}

export function removeKeyframe(state: AnimationState, keyframeId: string): boolean {
  if (!state.keyframes.delete(keyframeId)) return false;
  state.version++;
  return true;
}

export function getKeyframe(state: Readonly<AnimationState>, keyframeId: string): Keyframe | undefined {
  return state.keyframes.get(keyframeId);
}

export function getKeyframesForNode(state: Readonly<AnimationState>, nodeId: string): readonly Keyframe[] {
  const result: Keyframe[] = [];
  for (const kf of state.keyframes.values()) {
    if (kf.nodeId === nodeId) {
      result.push(kf);
    }
  }
  return result;
}

export function getKeyframeCount(state: Readonly<AnimationState>): number {
  return state.keyframes.size;
}

export function getPlayheadTime(state: Readonly<AnimationState>): number {
  return state.playheadTime;
}

export function setPlayheadTime(state: AnimationState, time: number): void {
  const clamped = Math.max(0, Math.min(time, state.duration));
  if (state.playheadTime === clamped) return;
  state.playheadTime = clamped;
  state.version++;
}

export function getDuration(state: Readonly<AnimationState>): number {
  return state.duration;
}

export function setDuration(state: AnimationState, duration: number): void {
  const clamped = Math.max(0, duration);
  if (state.duration === clamped) return;
  state.duration = clamped;
  if (state.playheadTime > clamped) {
    state.playheadTime = clamped;
  }
  state.version++;
}

export function isPlaying(state: Readonly<AnimationState>): boolean {
  return state.playing;
}

export function setPlaying(state: AnimationState, playing: boolean): void {
  if (state.playing === playing) return;
  state.playing = playing;
  state.version++;
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
