import { describe, expect, it } from 'vitest';

import {
  addKeyframe,
  createAnimationState,
  deleteTime,
  findKeyframeAt,
  getAnimationSessionVersion,
  getAnimationVersion,
  getDuration,
  getKeyframe,
  getKeyframeCount,
  getKeyframesForNode,
  getKeyframesForTrack,
  getPlayheadTime,
  insertTime,
  isLooping,
  isPlaying,
  removeKeyframe,
  setDuration,
  setLooping,
  setPlaying,
  setPlayheadTime,
  updateKeyframe,
  validateAnimationState,
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
    expect(getAnimationSessionVersion(state)).toBe(0);
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
    expect(getAnimationVersion(state)).toBe(0);
    expect(getAnimationSessionVersion(state)).toBe(1);
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
    expect(getAnimationSessionVersion(state)).toBe(0);
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
    expect(getAnimationVersion(state)).toBe(0);
    expect(getAnimationSessionVersion(state)).toBe(1);
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

describe('findKeyframeAt', () => {
  it('finds a stable target and property slot', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    expect(findKeyframeAt(state, 'n1', 'x', 0)?.id).toBe('kf-1');
  });
});

describe('getKeyframesForTrack', () => {
  it('returns deterministic timeline order', () => {
    const state = createAnimationState();
    addKeyframe(state, kfB);
    addKeyframe(state, kfA);
    addKeyframe(state, kfC);
    expect(getKeyframesForTrack(state, 'n1', 'x').map(({ id }) => id)).toEqual(['kf-1', 'kf-2']);
  });
});

describe('updateKeyframe', () => {
  it('updates without replacing identity and rejects occupied slots', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    addKeyframe(state, kfB);
    expect(updateKeyframe(state, 'kf-2', { value: 200 })).toBe(true);
    expect(getKeyframe(state, 'kf-2')?.value).toBe(200);
    expect(() => updateKeyframe(state, 'kf-2', { time: 0 })).toThrow('occupied');
    expect(updateKeyframe(state, 'missing', { time: 2 })).toBe(false);
  });
});

describe('insertTime', () => {
  it('ripples keyframes and duration from the insertion point', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    addKeyframe(state, kfB);
    expect(insertTime(state, 500, 250)).toBe(1);
    expect(getKeyframe(state, 'kf-2')?.time).toBe(750);
    expect(getDuration(state)).toBe(1250);
  });
});

describe('deleteTime', () => {
  it('removes the span and ripples later keyframes', () => {
    const state = createAnimationState();
    addKeyframe(state, kfA);
    addKeyframe(state, kfB);
    expect(deleteTime(state, 0, 250)).toBe(1);
    expect(getKeyframe(state, 'kf-2')?.time).toBe(250);
    expect(getDuration(state)).toBe(750);
  });
});

describe('getAnimationSessionVersion', () => {
  it('separates transient playback state from document dirtiness', () => {
    const state = createAnimationState();
    setPlayheadTime(state, 20);
    setPlaying(state, true);
    expect(getAnimationVersion(state)).toBe(0);
    expect(getAnimationSessionVersion(state)).toBe(2);
  });
});

describe('validateAnimationState', () => {
  it('reports malformed hydrated state deterministically', () => {
    const state = createAnimationState(100);
    state.keyframes.set('late', { ...kfA, id: 'late', time: 200 });
    state.keyframes.set('same', { ...kfA, id: 'same' });
    state.keyframes.set('same-2', { ...kfA, id: 'same-2' });
    expect(validateAnimationState(state).map(({ code }) => code)).toEqual(['duplicate-slot', 'out-of-range']);
  });
});
