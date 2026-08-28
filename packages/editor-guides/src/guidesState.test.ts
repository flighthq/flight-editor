import { describe, expect, it } from 'vitest';

import {
  addGuide,
  clearGuides,
  createGuidesState,
  getGuideById,
  getGuideCount,
  getGuideSnapPositions,
  getGuidesByAxis,
  getGuidesVersion,
  lockGuide,
  moveGuide,
  removeGuide,
  unlockGuide,
} from './guidesState';

describe('addGuide', () => {
  it('is exported', () => expect(addGuide).toBeTypeOf('function'));
});

describe('clearGuides', () => {
  it('is exported', () => expect(clearGuides).toBeTypeOf('function'));
});

describe('getGuideById', () => {
  it('is exported', () => expect(getGuideById).toBeTypeOf('function'));
});

describe('getGuideCount', () => {
  it('is exported', () => expect(getGuideCount).toBeTypeOf('function'));
});

describe('getGuideSnapPositions', () => {
  it('is exported', () => expect(getGuideSnapPositions).toBeTypeOf('function'));
});

describe('getGuidesByAxis', () => {
  it('is exported', () => expect(getGuidesByAxis).toBeTypeOf('function'));
});

describe('getGuidesVersion', () => {
  it('is exported', () => expect(getGuidesVersion).toBeTypeOf('function'));
});

describe('lockGuide', () => {
  it('is exported', () => expect(lockGuide).toBeTypeOf('function'));
});

describe('moveGuide', () => {
  it('is exported', () => expect(moveGuide).toBeTypeOf('function'));
});

describe('removeGuide', () => {
  it('is exported', () => expect(removeGuide).toBeTypeOf('function'));
});

describe('unlockGuide', () => {
  it('is exported', () => expect(unlockGuide).toBeTypeOf('function'));
});

describe('createGuidesState', () => {
  it('starts empty', () => {
    const state = createGuidesState();
    expect(getGuideCount(state)).toBe(0);
    expect(getGuidesVersion(state)).toBe(0);
  });

  it('adds horizontal and vertical guides', () => {
    const state = createGuidesState();
    const h = addGuide(state, 'horizontal', 100);
    const v = addGuide(state, 'vertical', 200);

    expect(h.axis).toBe('horizontal');
    expect(h.position).toBe(100);
    expect(v.axis).toBe('vertical');
    expect(v.position).toBe(200);
    expect(getGuideCount(state)).toBe(2);
    expect(getGuidesVersion(state)).toBe(2);
  });

  it('assigns unique ids', () => {
    const state = createGuidesState();
    const a = addGuide(state, 'horizontal', 10);
    const b = addGuide(state, 'horizontal', 20);
    expect(a.id).not.toBe(b.id);
  });

  it('removes a guide by id', () => {
    const state = createGuidesState();
    const g = addGuide(state, 'vertical', 50);
    expect(removeGuide(state, g.id)).toBe(true);
    expect(getGuideCount(state)).toBe(0);
  });

  it('returns false for removing nonexistent guide', () => {
    const state = createGuidesState();
    expect(removeGuide(state, 999)).toBe(false);
  });

  it('moves an unlocked guide', () => {
    const state = createGuidesState();
    const g = addGuide(state, 'horizontal', 100);
    expect(moveGuide(state, g.id, 250)).toBe(true);
    expect(getGuideById(state, g.id)!.position).toBe(250);
  });

  it('prevents moving a locked guide', () => {
    const state = createGuidesState();
    const g = addGuide(state, 'horizontal', 100);
    lockGuide(state, g.id);
    expect(moveGuide(state, g.id, 250)).toBe(false);
    expect(getGuideById(state, g.id)!.position).toBe(100);
  });

  it('locks and unlocks a guide', () => {
    const state = createGuidesState();
    const g = addGuide(state, 'vertical', 30);
    expect(g.locked).toBe(false);

    expect(lockGuide(state, g.id)).toBe(true);
    expect(getGuideById(state, g.id)!.locked).toBe(true);

    expect(unlockGuide(state, g.id)).toBe(true);
    expect(getGuideById(state, g.id)!.locked).toBe(false);
  });

  it('no-ops on redundant lock/unlock', () => {
    const state = createGuidesState();
    const g = addGuide(state, 'horizontal', 10);
    const v = getGuidesVersion(state);

    expect(lockGuide(state, g.id)).toBe(true);
    expect(unlockGuide(state, g.id)).toBe(true);
    expect(lockGuide(state, g.id)).toBe(true);
    expect(lockGuide(state, g.id)).toBe(false);
    expect(getGuidesVersion(state)).toBe(v + 3);
  });

  it('clears all guides', () => {
    const state = createGuidesState();
    addGuide(state, 'horizontal', 10);
    addGuide(state, 'vertical', 20);
    clearGuides(state);
    expect(getGuideCount(state)).toBe(0);
  });

  it('clear on empty does not bump version', () => {
    const state = createGuidesState();
    const v = getGuidesVersion(state);
    clearGuides(state);
    expect(getGuidesVersion(state)).toBe(v);
  });

  it('filters by axis', () => {
    const state = createGuidesState();
    addGuide(state, 'horizontal', 10);
    addGuide(state, 'vertical', 20);
    addGuide(state, 'horizontal', 30);

    expect(getGuidesByAxis(state, 'horizontal')).toHaveLength(2);
    expect(getGuidesByAxis(state, 'vertical')).toHaveLength(1);
  });

  it('returns snap positions for an axis', () => {
    const state = createGuidesState();
    addGuide(state, 'horizontal', 100);
    addGuide(state, 'horizontal', 200);
    addGuide(state, 'vertical', 50);

    expect(getGuideSnapPositions(state, 'horizontal')).toEqual([100, 200]);
    expect(getGuideSnapPositions(state, 'vertical')).toEqual([50]);
  });
});
