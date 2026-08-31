import { describe, expect, it } from 'vitest';

import {
  clearActiveSmartGuides,
  createSmartGuideState,
  getActiveSmartGuideCount,
  getActiveSmartGuides,
  getSmartGuideVersion,
  isSmartGuidesEnabled,
  isSpacingGuidesEnabled,
  setActiveSmartGuides,
  setSmartGuidesEnabled,
  setSpacingGuidesEnabled,
} from './smartGuideState';

import type { SmartGuide } from './smartGuideState';

const edgeGuide: SmartGuide = {
  kind: 'edge',
  orientation: 'horizontal',
  position: 100,
  from: 50,
  to: 200,
  label: null,
};

const spacingGuide: SmartGuide = {
  kind: 'spacing',
  orientation: 'vertical',
  position: 150,
  from: 100,
  to: 200,
  label: '50px',
};

describe('createSmartGuideState', () => {
  it('starts enabled with no active guides', () => {
    const state = createSmartGuideState();
    expect(isSmartGuidesEnabled(state)).toBe(true);
    expect(isSpacingGuidesEnabled(state)).toBe(true);
    expect(getActiveSmartGuideCount(state)).toBe(0);
    expect(getSmartGuideVersion(state)).toBe(0);
  });
});

describe('getActiveSmartGuides', () => {
  it('returns empty array for fresh state', () => {
    const state = createSmartGuideState();
    expect(getActiveSmartGuides(state)).toEqual([]);
  });
});

describe('getActiveSmartGuideCount', () => {
  it('is exported', () => expect(getActiveSmartGuideCount).toBeTypeOf('function'));
});

describe('setActiveSmartGuides', () => {
  it('sets the active guides', () => {
    const state = createSmartGuideState();
    setActiveSmartGuides(state, [edgeGuide, spacingGuide]);
    expect(getActiveSmartGuideCount(state)).toBe(2);
    expect(getActiveSmartGuides(state)).toEqual([edgeGuide, spacingGuide]);
    expect(getSmartGuideVersion(state)).toBe(1);
  });

  it('does not alias the input array', () => {
    const state = createSmartGuideState();
    const input = [edgeGuide];
    setActiveSmartGuides(state, input);
    input.length = 0;
    expect(getActiveSmartGuideCount(state)).toBe(1);
  });
});

describe('clearActiveSmartGuides', () => {
  it('removes all active guides', () => {
    const state = createSmartGuideState();
    setActiveSmartGuides(state, [edgeGuide]);
    clearActiveSmartGuides(state);
    expect(getActiveSmartGuideCount(state)).toBe(0);
    expect(getSmartGuideVersion(state)).toBe(2);
  });

  it('does not bump version when already empty', () => {
    const state = createSmartGuideState();
    clearActiveSmartGuides(state);
    expect(getSmartGuideVersion(state)).toBe(0);
  });
});

describe('isSmartGuidesEnabled', () => {
  it('is exported', () => expect(isSmartGuidesEnabled).toBeTypeOf('function'));
});

describe('setSmartGuidesEnabled', () => {
  it('disables smart guides and clears active guides', () => {
    const state = createSmartGuideState();
    setActiveSmartGuides(state, [edgeGuide]);
    setSmartGuidesEnabled(state, false);
    expect(isSmartGuidesEnabled(state)).toBe(false);
    expect(getActiveSmartGuideCount(state)).toBe(0);
  });

  it('does not bump version when value unchanged', () => {
    const state = createSmartGuideState();
    setSmartGuidesEnabled(state, true);
    expect(getSmartGuideVersion(state)).toBe(0);
  });
});

describe('isSpacingGuidesEnabled', () => {
  it('is exported', () => expect(isSpacingGuidesEnabled).toBeTypeOf('function'));
});

describe('setSpacingGuidesEnabled', () => {
  it('toggles spacing guides independently', () => {
    const state = createSmartGuideState();
    setSpacingGuidesEnabled(state, false);
    expect(isSpacingGuidesEnabled(state)).toBe(false);
    expect(isSmartGuidesEnabled(state)).toBe(true);
    expect(getSmartGuideVersion(state)).toBe(1);
  });

  it('does not bump version when value unchanged', () => {
    const state = createSmartGuideState();
    setSpacingGuidesEnabled(state, true);
    expect(getSmartGuideVersion(state)).toBe(0);
  });
});

describe('getSmartGuideVersion', () => {
  it('is exported', () => expect(getSmartGuideVersion).toBeTypeOf('function'));
});
