import { describe, expect, it } from 'vitest';

import {
  addKeyframe,
  createAnimationState,
  getAnimationVersion,
  getDuration,
  getKeyframe,
  getKeyframeCount,
  getKeyframesForNode,
  getPlayheadTime,
  isLooping,
  isPlaying,
  removeKeyframe,
  setDuration,
  setLooping,
  setPlaying,
  setPlayheadTime,
} from './animationState';

import type { Keyframe } from './animationState';

const kfA: Keyframe = { id: 'kf-1', nodeId: 'n1', property: 'x', time: 0, value: 0, easing: 'linear' };
const kfB: Keyframe = { id: 'kf-2', nodeId: 'n1', property: 'x', time: 500, value: 100, easing: 'ease-out' };
const kfC: Keyframe = { id: 'kf-3', nodeId: 'n2', property: 'alpha', time: 0, value: 1, easing: 'ease-in' };

describe('createAnimationState', () => {
  it('starts with defaults', () => {
    const state = createAnimationState();
    expect(getKeyframeCount(state)).toBe(0);
    expect(getPlayheadTime(state)).toBe(0);
    expect(getDuration(state)).toBe(1000);
    expect(isPlaying(state)).toBe(false);
    expect(isLooping(state)).toBe(false);
    expect(getAnimationVersion(state)).toBe(0);
  });
});

describe('addKeyframe', () => {
  it('adds a keyframe', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    expect(getKeyframeCount(state)).toBe(1);
    expect(getKeyframe(state, 'kf-1')).toEqual(kfA);
    expect(getAnimationVersion(state)).toBe(1);
  });
});

describe('removeKeyframe', () => {
  it('removes a keyframe', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    const removed = removeKeyframe(state, 'kf-1');
    expect(removed).toBe(true);
    expect(getKeyframeCount(state)).toBe(0);
  });

  it('returns false when not found', () => {
    const state = createAnimationState();
    const removed = removeKeyframe(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getAnimationVersion(state)).toBe(0);
  });
});

describe('getKeyframe', () => {
  it('returns undefined for unknown id', () => {
    const state = createAnimationState();
    expect(getKeyframe(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getKeyframesForNode', () => {
  it('filters by node id', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    addKeyframe(state, kfB);
    addKeyframe(state, kfC);
    expect(getKeyframesForNode(state, 'n1')).toEqual([kfA, kfB]);
    expect(getKeyframesForNode(state, 'n2')).toEqual([kfC]);
  });

  it('returns empty for unknown node', () => {
    const state = createAnimationState();
    expect(getKeyframesForNode(state, 'nonexistent')).toEqual([]);
  });
});

describe('getKeyframeCount', () => {
  it('is exported', () => expect(getKeyframeCount).toBeTypeOf('function'));
});

describe('getPlayheadTime', () => {
  it('is exported', () => expect(getPlayheadTime).toBeTypeOf('function'));
});

describe('setPlayheadTime', () => {
  it('sets the playhead time', () => {
    const state = createAnimationState();
    setPlayheadTime(state, 500);
    expect(getPlayheadTime(state)).toBe(500);
    expect(getAnimationVersion(state)).toBe(1);
  });

  it('clamps to duration', () => {
    const state = createAnimationState();
    setPlayheadTime(state, 9999);
    expect(getPlayheadTime(state)).toBe(1000);
  });

  it('clamps to zero', () => {
    const state = createAnimationState();
    setPlayheadTime(state, -100);
    expect(getPlayheadTime(state)).toBe(0);
  });

  it('does not bump version when unchanged', () => {
    const state = createAnimationState();
    setPlayheadTime(state, 0);
    expect(getAnimationVersion(state)).toBe(0);
  });
});

describe('getDuration', () => {
  it('is exported', () => expect(getDuration).toBeTypeOf('function'));
});

describe('setDuration', () => {
  it('sets the duration', () => {
    const state = createAnimationState();
    setDuration(state, 2000);
    expect(getDuration(state)).toBe(2000);
    expect(getAnimationVersion(state)).toBe(1);
  });

  it('clamps to zero', () => {
    const state = createAnimationState();
    setDuration(state, -500);
    expect(getDuration(state)).toBe(0);
  });

  it('clamps playhead when duration shrinks', () => {
    const state = createAnimationState();
    setPlayheadTime(state, 800);
    setDuration(state, 500);
    expect(getPlayheadTime(state)).toBe(500);
  });

  it('does not bump version when unchanged', () => {
    const state = createAnimationState();
    setDuration(state, 1000);
    expect(getAnimationVersion(state)).toBe(0);
  });
});

describe('isPlaying', () => {
  it('is exported', () => expect(isPlaying).toBeTypeOf('function'));
});

describe('setPlaying', () => {
  it('starts playback', () => {
    const state = createAnimationState();
    setPlaying(state, true);
    expect(isPlaying(state)).toBe(true);
    expect(getAnimationVersion(state)).toBe(1);
  });

  it('does not bump version when unchanged', () => {
    const state = createAnimationState();
    setPlaying(state, false);
    expect(getAnimationVersion(state)).toBe(0);
  });
});

describe('isLooping', () => {
  it('is exported', () => expect(isLooping).toBeTypeOf('function'));
});

describe('setLooping', () => {
  it('enables looping', () => {
    const state = createAnimationState();
    setLooping(state, true);
    expect(isLooping(state)).toBe(true);
    expect(getAnimationVersion(state)).toBe(1);
  });

  it('does not bump version when unchanged', () => {
    const state = createAnimationState();
    setLooping(state, false);
    expect(getAnimationVersion(state)).toBe(0);
  });
});

describe('getAnimationVersion', () => {
  it('is exported', () => expect(getAnimationVersion).toBeTypeOf('function'));
});
