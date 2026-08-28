import { describe, expect, it } from 'vitest';

import {
  createRulerState,
  getRulerOrigin,
  getRulerSubdivisions,
  getRulerTickSpacing,
  getRulerUnit,
  getRulerVersion,
  getSubdivisionSpacing,
  hideRulers,
  isRulerVisible,
  resetRulerOrigin,
  setRulerOrigin,
  setRulerSubdivisions,
  setRulerTickSpacing,
  setRulerUnit,
  showRulers,
  toggleRulers,
} from './rulerState';

describe('createRulerState', () => {
  it('creates with default values', () => {
    const state = createRulerState();

    expect(isRulerVisible(state)).toBe(true);
    expect(getRulerUnit(state)).toBe('pixels');
    expect(getRulerOrigin(state)).toEqual({ x: 0, y: 0 });
    expect(getRulerTickSpacing(state)).toBe(100);
    expect(getRulerSubdivisions(state)).toBe(10);
    expect(getRulerVersion(state)).toBe(0);
  });
});

describe('visibility', () => {
  it('hides rulers', () => {
    const state = createRulerState();
    hideRulers(state);

    expect(isRulerVisible(state)).toBe(false);
    expect(getRulerVersion(state)).toBe(1);
  });

  it('shows rulers', () => {
    const state = createRulerState();
    hideRulers(state);
    showRulers(state);

    expect(isRulerVisible(state)).toBe(true);
    expect(getRulerVersion(state)).toBe(2);
  });

  it('show is no-op when already visible', () => {
    const state = createRulerState();
    showRulers(state);

    expect(getRulerVersion(state)).toBe(0);
  });

  it('hide is no-op when already hidden', () => {
    const state = createRulerState();
    hideRulers(state);
    const v = getRulerVersion(state);
    hideRulers(state);

    expect(getRulerVersion(state)).toBe(v);
  });

  it('toggles visibility', () => {
    const state = createRulerState();
    toggleRulers(state);

    expect(isRulerVisible(state)).toBe(false);

    toggleRulers(state);

    expect(isRulerVisible(state)).toBe(true);
  });
});

describe('units', () => {
  it('changes unit', () => {
    const state = createRulerState();
    setRulerUnit(state, 'inches');

    expect(getRulerUnit(state)).toBe('inches');
    expect(getRulerVersion(state)).toBe(1);
  });

  it('sets centimeters', () => {
    const state = createRulerState();
    setRulerUnit(state, 'centimeters');

    expect(getRulerUnit(state)).toBe('centimeters');
  });

  it('no-op for same unit', () => {
    const state = createRulerState();
    setRulerUnit(state, 'pixels');

    expect(getRulerVersion(state)).toBe(0);
  });
});

describe('origin', () => {
  it('sets origin', () => {
    const state = createRulerState();
    setRulerOrigin(state, 50, 75);

    expect(getRulerOrigin(state)).toEqual({ x: 50, y: 75 });
    expect(getRulerVersion(state)).toBe(1);
  });

  it('no-op for same origin', () => {
    const state = createRulerState();
    setRulerOrigin(state, 0, 0);

    expect(getRulerVersion(state)).toBe(0);
  });

  it('resets origin to zero', () => {
    const state = createRulerState();
    setRulerOrigin(state, 100, 200);
    resetRulerOrigin(state);

    expect(getRulerOrigin(state)).toEqual({ x: 0, y: 0 });
  });

  it('reset is no-op when already at zero', () => {
    const state = createRulerState();
    resetRulerOrigin(state);

    expect(getRulerVersion(state)).toBe(0);
  });

  it('supports negative origin', () => {
    const state = createRulerState();
    setRulerOrigin(state, -50, -100);

    expect(getRulerOrigin(state)).toEqual({ x: -50, y: -100 });
  });
});

describe('tick spacing', () => {
  it('sets tick spacing', () => {
    const state = createRulerState();
    setRulerTickSpacing(state, 50);

    expect(getRulerTickSpacing(state)).toBe(50);
    expect(getRulerVersion(state)).toBe(1);
  });

  it('no-op for same spacing', () => {
    const state = createRulerState();
    setRulerTickSpacing(state, 100);

    expect(getRulerVersion(state)).toBe(0);
  });

  it('rejects zero spacing', () => {
    const state = createRulerState();
    setRulerTickSpacing(state, 0);

    expect(getRulerTickSpacing(state)).toBe(100);
    expect(getRulerVersion(state)).toBe(0);
  });

  it('rejects negative spacing', () => {
    const state = createRulerState();
    setRulerTickSpacing(state, -10);

    expect(getRulerTickSpacing(state)).toBe(100);
    expect(getRulerVersion(state)).toBe(0);
  });
});

describe('subdivisions', () => {
  it('sets subdivisions', () => {
    const state = createRulerState();
    setRulerSubdivisions(state, 5);

    expect(getRulerSubdivisions(state)).toBe(5);
    expect(getRulerVersion(state)).toBe(1);
  });

  it('no-op for same subdivisions', () => {
    const state = createRulerState();
    setRulerSubdivisions(state, 10);

    expect(getRulerVersion(state)).toBe(0);
  });

  it('rejects zero subdivisions', () => {
    const state = createRulerState();
    setRulerSubdivisions(state, 0);

    expect(getRulerSubdivisions(state)).toBe(10);
    expect(getRulerVersion(state)).toBe(0);
  });

  it('floors fractional subdivisions', () => {
    const state = createRulerState();
    setRulerSubdivisions(state, 3.7);

    expect(getRulerSubdivisions(state)).toBe(3);
  });
});

describe('getSubdivisionSpacing', () => {
  it('computes spacing between subdivision ticks', () => {
    const state = createRulerState();
    setRulerTickSpacing(state, 100);
    setRulerSubdivisions(state, 5);

    expect(getSubdivisionSpacing(state)).toBe(20);
  });

  it('computes with default values', () => {
    const state = createRulerState();

    expect(getSubdivisionSpacing(state)).toBe(10);
  });
});
